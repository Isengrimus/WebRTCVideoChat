import { Box } from "@chakra-ui/react";
import PropTypes from "prop-types";
import { styles } from "./styles";

const Layout = ({ children }) => {
  return (
    <Box sx={styles.layoutWrapper}>
      <main>{children}</main>
    </Box>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
