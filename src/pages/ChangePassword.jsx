import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import InputAdornment from '@mui/material/InputAdornment';
import { FormControl, IconButton, InputLabel, OutlinedInput, useTheme } from "@mui/material";
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useState } from 'react';
import Message from '../components/Message';
import CircularProgress from '@mui/material/CircularProgress';
import { useContext } from 'react';
import { AuthContext } from '../context/Context';
import { Visibility, VisibilityOff } from '@mui/icons-material';

export default function ChangePassword() {
  document.title = "change password | Cashier"
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const navigate = useNavigate();
  const { currentUser, refreshUser } = useContext(AuthContext)
  const [showPassword, setShowPassword] = React.useState(false);
  const [shownewPassword, setShownewPassword] = React.useState(false);
  const [showconfPassword, setShowconfPassword] = React.useState(false);
  const handleSubmit = (event) => {
    setErrorMessage(null)
    setIsLoggedIn(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get('newpassword') !== data.get('confirm_password')) {
      setIsLoggedIn(false);
      setErrorMessage("please confirm password")
      return
    }
    Axios.post('/auth/pwdchange/' + currentUser._id, {
      oldPassword: data.get('oldpassword'),
      newPassword: data.get('newpassword'),
    }).then((response) => {
      setIsLoggedIn(false);
      refreshUser(null)
      navigate('/');
    }).catch((error) => {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An error occurred");
      }
      setIsLoggedIn(false)
    })
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          boxShadow: 3,
          borderRadius: 2,
          px: 4,
          py: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: `${colors.primary[400]}`
        }}
      >
        {/* <Message message={message} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='success' /> */}
        <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error' />

        <Avatar sx={{
          m: 0, bgcolor: 'secondary.main', width: '80px',
          height: '80px'
        }} >
          <img
            alt="profile-user"
            width="100px"
            height="100px"
            src={`../../assets/user.png`}
            style={{ cursor: "pointer", borderRadius: "50%" }}
          />
        </Avatar>
        <Typography mt={5} variant="h6" color={colors.grey[300]}
          sx={{
            fontSize: 14,
            textAlign: 'center'
          }}>
          Enter the credentials below to change your password
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <FormControl sx={{mt:1.5}} fullWidth>
            <InputLabel>Enter Old Password</InputLabel>
            <OutlinedInput
            margin="normal"
            required
            fullWidth
            name="oldpassword"
            label="Enter Old Password"
              type={showPassword ? "text" : "password"}
            id="password"
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
          />
          </FormControl>
          <FormControl sx={{mt:1.5}} fullWidth>
            <InputLabel>Enter New Password</InputLabel>
            <OutlinedInput
              margin="normal"
              required
              fullWidth
              name="newpassword"
              label="Enter New Password"
              type={shownewPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShownewPassword(!shownewPassword)}
                    edge="end"
                  >
                    {shownewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <FormControl sx={{ mt: 1.5 }} fullWidth>
            <InputLabel>Enter Old Password</InputLabel>
            <OutlinedInput
            margin="normal"
            required
            fullWidth
            name="confirm_password"
            label="Re Enter New Password"
              type={showconfPassword ? "text" : "password"}
            id="confirm password"
              autoComplete="current-password"
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowconfPassword(!showconfPassword)}
                    edge="end"
                  >
                    {showconfPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
          />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {isLoggedIn ? <CircularProgress color='primary' size={30} /> : 'Submit'}
          </Button>

        </Box>
      </Box>
    </Container>
  );
}