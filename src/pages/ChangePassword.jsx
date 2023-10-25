import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useTheme } from "@mui/material";
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { useState } from 'react';
import Message from '../components/Message';
import CircularProgress from '@mui/material/CircularProgress';
import { useContext } from 'react';
import { AuthContext } from '../context/Context';

export default function ChangePassword() {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const navigate = useNavigate();
  const { currentUser,refreshUser } = useContext(AuthContext)
  const handleSubmit = (event) => {
    setIsLoggedIn(true);
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      oldPassword: data.get('oldpassword'),
      newPassword: data.get('newpassword'),
    });
    Axios.post('/auth/pwdchange/' + currentUser._id, {
      oldPassword: data.get('oldpassword'),
      newPassword: data.get('newpassword'),
    }).then((response) => {
      // setMessage("You are logged in successfully!!")
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
        <Message message={message} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='success' />
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
          <TextField
            margin="normal"
            required
            fullWidth
            name="oldpassword"
            label="Enter Old Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="newpassword"
            label="Enter New Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />
          {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
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