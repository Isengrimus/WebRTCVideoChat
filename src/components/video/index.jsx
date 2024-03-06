import { Center, Flex, Icon } from "@chakra-ui/react";
import { styles } from "./styles";
import { FiVideoOff } from "react-icons/fi";

import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const VideoBlock = ({ videoStream, isMuted }) => {
  const [isVideoStreamReady, setIsVideoStreamReady] = useState(false);

  useEffect(() => {
    if (videoStream.current) {
      videoStream.current.onloadedmetadata = () => {
        setIsVideoStreamReady(true);
      };
    }
  }, [videoStream]);

  return (
    <Flex sx={styles.videoWrapper(isVideoStreamReady)}>
      {isVideoStreamReady ? null : (
        <Center h="100%" w="100%">
          <Icon as={FiVideoOff} w="48px" h="48px" />
        </Center>
      )}
      <video
        autoPlay
        playsInline
        muted={isMuted}
        ref={videoStream}
        style={{ display: isVideoStreamReady ? "block" : "none" }}
      />
    </Flex>
  );
};

VideoBlock.propTypes = {
  videoStream: PropTypes.object.isRequired,
  isMuted: PropTypes.bool,
};

export default VideoBlock;
