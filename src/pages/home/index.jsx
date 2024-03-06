/**
 * @file This file contains the implementation of the HomePage component.
 * The HomePage component is responsible for rendering the main page of the application.
 * It displays the video streams of the current user and the member user during an active call.
 * It also provides functionality to start and end a call, copy the user ID, and answer incoming calls.
 * @module pages/home/index
 */

import {
  Button,
  Card,
  Flex,
  Input,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import { styles } from "./styles";
import {
  FiCopy,
  FiPhoneCall,
  FiPhoneOff,
  FiPhoneIncoming,
} from "react-icons/fi";
import { useWebRTC } from "src/hooks/useWebRTC";
import VideoBlock from "../../components/video";
import CopyToClipboard from "react-copy-to-clipboard";

/**
 * The HomePage component renders the main page of the application.
 * It provides functionality to start and end a call, copy the user ID, and answer incoming calls.
 * @returns {JSX.Element} The rendered HomePage component
 */
const HomePage = () => {
  const {
    callUser,
    leaveCall,
    answerCall,
    currentUserVideo,
    memberUserVideo,
    currentUser,
    callStatus,
    userName,
    setUserName,
    setIdToCall,
  } = useWebRTC();

  /**
   * Handles the change event of the username input field.
   * Updates the username state with the new value.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleChangeUsername = (e) => {
    setUserName(e.target.value);
  };

  /**
   * Handles the change event of the ID to call input field.
   * Updates the ID to call state with the new value.
   * @param {React.ChangeEvent<HTMLInputElement>} e - The change event
   */
  const handleChangeIdToCall = (e) => {
    setIdToCall(e.target.value);
  };

  return (
    <Flex sx={styles.homePageWrapper}>
      <Flex sx={styles.titleWrapper}>
        <Text sx={styles.titleText}>WebVideoChat</Text>
      </Flex>
      <Wrap justify="center" spacing="16px" my="16px">
        <VideoBlock videoStream={currentUserVideo} isMuted />
        {callStatus === "active" ? (
          <VideoBlock videoStream={memberUserVideo} />
        ) : null}
      </Wrap>
      <Card
        variant="outline"
        direction={{ base: "column", sm: "row" }}
        sx={styles.functionalCardWrapper}
      >
        <VStack sx={styles.stackWrapper} spacing="12px">
          <Input placeholder="Username" onChange={handleChangeUsername} />
          <CopyToClipboard text={currentUser}>
            <Button colorScheme="teal" w="100%" leftIcon={<FiCopy />}>
              Copy your ID
            </Button>
          </CopyToClipboard>
        </VStack>
        <VStack sx={styles.stackWrapper} spacing="12px">
          <Input placeholder="ID to call" onChange={handleChangeIdToCall} />
          {callStatus !== "active" ? (
            <Button
              colorScheme="teal"
              w="100%"
              leftIcon={<FiPhoneCall />}
              isDisabled={callStatus === "pending"}
              onClick={callUser}
            >
              Start a call
            </Button>
          ) : (
            <Button
              colorScheme="red"
              w="100%"
              leftIcon={<FiPhoneOff />}
              onClick={leaveCall}
            >
              End the call
            </Button>
          )}
        </VStack>
      </Card>
      {callStatus === "pending" && callStatus !== "active" ? (
        <Card
          variant="outline"
          direction={{ base: "column", sm: "row" }}
          sx={styles.incomingCallCard}
        >
          <VStack>
            <Text>{userName} is calling...</Text>
            <Button
              leftIcon={<FiPhoneIncoming />}
              colorScheme="teal"
              onClick={answerCall}
            >
              Answer the call
            </Button>
          </VStack>
        </Card>
      ) : null}
    </Flex>
  );
};

export default HomePage;
