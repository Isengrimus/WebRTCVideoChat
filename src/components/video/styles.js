export const styles = {
  videoWrapper: (isVideoReady) => ({
    width: "300px",
    minHeight: "225px",
    borderRadius: "8px",
    overflow: "hidden",
    justifyContent: "center",
    border: isVideoReady ? "none" : "1px dashed #000",
    background: isVideoReady ? "none" : "#FFFFFF98",
  }),
};
