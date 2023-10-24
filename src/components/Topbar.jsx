import { Box, IconButton, useMediaQuery, useTheme } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext } from "../theme";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import Account from "./Account";

const Topbar = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [openAccount, setOpenAccount] = useState(false);
  const colorMode = useContext(ColorModeContext);

  const handleClickOpen = () => {
    setOpenAccount(true);
  };

  return (
    <Box display="flex" justifyContent={{ sm: "end", xs: 'end' }} p={2}>
      <Account fullScreen={fullScreen} open={openAccount} handleClose={() => setOpenAccount(false)} />
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <LightModeOutlinedIcon />
          ) : (
            < DarkModeOutlinedIcon />
          )}
        </IconButton>
        <IconButton>
          <PersonOutlinedIcon onClick = {handleClickOpen}/>
        </IconButton>
      </Box>
    </Box>
  );
};

export default Topbar;
