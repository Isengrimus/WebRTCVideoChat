import io from "socket.io-client";
import { useState, useRef, useEffect } from "react";
import Peer from "simple-peer";

const socket = io.connect(import.meta.env.VITE_APP_WEBSOCKET_URL);

/**
 * Custom hook for managing WebRTC functionality.
 * @returns {{
 *   callUser: Function,
 *   leaveCall: Function,
 *   answerCall: Function,
 *   currentUserVideo: Object,
 *   memberUserVideo: Object,
 *   currentUser: string,
 *   callStatus: string,
 *   userName: string,
 *   setUserName: Function,
 *   setIdToCall: Function
 * }}
 */
export const useWebRTC = () => {
  // State variables
  const [currentUser, setCurrentUser] = useState("");
  const [stream, setStream] = useState();
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [idToCall, setIdToCall] = useState("");
  const [name, setName] = useState("");
  const [callStatus, setCallStatus] = useState("idle");

  // Refs
  const currentUserVideo = useRef();
  const memberUserVideo = useRef();
  const connectionRef = useRef();

  useEffect(() => {
    // Get user media stream
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);
        currentUserVideo.current.srcObject = stream;
      });

    // Set current user ID
    socket.on("me", (id) => {
      setCurrentUser(id);
    });

    // Handle incoming call
    socket.on("callUser", (data) => {
      setCallStatus("pending");
      setCaller(data.from);
      setName(data.name);
      setCallerSignal(data.signal);
    });

    // Handle call end
    socket.on("callEnded", () => {
      setCallStatus("idle");
      if (connectionRef.current) {
        connectionRef.current.destroy();
      }
    });
  }, []);

  /**
   * Call a user.
   */
  const callUser = () => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: idToCall,
        signalData: data,
        from: currentUser,
        name: name,
      });
    });
    peer.on("stream", (stream) => {
      memberUserVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallStatus("active");
      peer.signal(signal);
    });

    connectionRef.current = peer;
  };

  /**
   * Answer an incoming call.
   */
  const answerCall = () => {
    setCallStatus("active");
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller });
    });
    peer.on("stream", (stream) => {
      memberUserVideo.current.srcObject = stream;
    });

    peer.signal(callerSignal);
    connectionRef.current = peer;
  };

  /**
   * Leave the current call.
   */
  const leaveCall = () => {
    if (connectionRef.current) {
      setCallStatus("idle");
      connectionRef.current.destroy();
      socket.emit("endCall", { to: caller, from: currentUser });
    }
  };

  // Return the necessary functions and state variables
  return {
    callUser,
    leaveCall,
    answerCall,
    currentUserVideo,
    memberUserVideo,
    currentUser,
    callStatus,
    userName: name,
    setUserName: setName,
    setIdToCall,
  };
};
