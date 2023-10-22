import { Typography, Box, useTheme, useMediaQuery } from "@mui/material";
import { tokens } from "../theme";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const colors = tokens(theme.palette.mode);
  return (
    <Box mb="30px">
    <Typography
      variant={isMobile ? "h4" : "h2"}
      color={colors.grey[100]}
      fontWeight="bold"
      sx={{
        m: "0 0 0 0",
        textAlign: isMobile ? "center" : "left" 
      }}
    >
      {title}
    </Typography>
    {/* <Typography variant="h5" color={colors.greenAccent[400]}>
      {subtitle}
    </Typography> */}
  </Box>
  );
};

export default Header;
