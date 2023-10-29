import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Skeleton } from "@mui/material";
import Axios from 'axios';
import {Link} from 'react-router-dom';
const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiDialog-paper': {
    width: '100%', // Adjust the width as needed
  },
}));
const Account = ({ open, handleClose }) => {
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [profilLoding, setProfilLoding] = useState(true);
  const [profile, setProfile] = useState(`../../assets/user.png`);
  useEffect(() => {
    setProfilLoding(true)
    Axios.post('/auth/refresh', {
      withCredentials: true,
    }).then((response) => {
      setAdminName(response.data.adminName);
      setEmail(response.data.email);
      setPhone(response.data.phone);
      setRole(response.data.type);
      setProfile(`../../assets/user.png`)
      setProfilLoding(false)
    }).catch((error) => {
      console.log(error);
    })
  }, []);
  return (
    <BootstrapDialog
      // fullScreen ={fullScreen}
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={open}

    >
      <DialogTitle sx={{ m: 0, p: 2, textAlign:"center" }} id="customized-dialog-title">
        Your Profile
      </DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
        {profilLoding ? <Skeleton variant="circular" width={150} height={150} />
          : <img
            alt="profile-user"
            width="150px"
            height="150px"
            src={profile}
            style={{ cursor: "pointer", borderRadius: "50%" }}

          />}
        <Typography gutterBottom variant="body1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
          Name : &nbsp; &nbsp; {profilLoding ?
            <Skeleton variant="rounded" width={150} height={30} /> :
            adminName}
        </Typography>
        <Typography gutterBottom variant="body1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
          Email : &nbsp; &nbsp;{profilLoding ?
            <Skeleton variant="rounded" width={150} height={30} /> :
            email}
        </Typography>
        <Typography gutterBottom variant="body1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
          Role : &nbsp; &nbsp;{profilLoding ?
            <Skeleton variant="rounded" width={150} height={30} /> :
            role}
        </Typography>
        <Typography gutterBottom variant="body1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
          Phone : &nbsp; &nbsp;{profilLoding ?
            <Skeleton variant="rounded" width={150} height={30} /> :
            phone}
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Link to="/change-password" >
          <Button variant="contained"
            color="primary" onClick={handleClose}>
            Cahnge password
          </Button>
        </Link>
      </DialogActions>
    </BootstrapDialog>

  )
}

export default Account;