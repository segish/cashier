// import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography, useTheme } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { tokens } from '../theme';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { Avatar, Skeleton, useTheme } from "@mui/material";
import Axios from 'axios';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
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
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const Account = ({ fullScreen, open, handleClose }) => {
  const theme = useTheme();
  const [userId, setUserId] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [role, setRole] = useState('');
  const [profilLoding, setProfilLoding] = useState(true);
  const [profile, setProfile] = useState(`../../assets/user.png`);
  const covertToBase64 = (e) => {
    var reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = () => {
      setProfileImage((prev) => ({ ...prev, profile: reader.result }))
    };
    reader.onerror = error => {
      console.log(error);
    };
  }
  const handleUpload = () => {
    Axios.post(`/auth/update/${userId}`, {
      profile: profileImage.profile,
    }).then((response) => {

    }).catch((error) => {

    })
  }
  useEffect(() => {
    setProfilLoding(true)
    Axios.post('/auth/refresh', {
      withCredentials: true,
    }).then((response) => {
      setAdminName(response.data.adminName);
      setEmail(response.data.email);
      setPhone(response.data.phone);
      setRole(response.data.type);
      setUserId(response.data._id);
      setProfile(response.data.profile)
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
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        Manage Profile
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
                {profilLoding ?<Skeleton variant="circular" width={150} height={150} />
                :<img
            alt="profile-user"
            width="150px"
            height="150px"
            src={profileImage.profile ? profileImage.profile : profile }
            style={{ cursor: "pointer", borderRadius: "50%" }}

          />}
        <Typography gutterBottom variant="body1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
          {profilLoding ?
            <Skeleton variant="rounded" width={150} height={30} /> :
                    adminName}
        </Typography>
        <Typography gutterBottom variant="body1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
          {profilLoding ?
            <Skeleton variant="rounded" width={150} height={30} /> :
                    email}
        </Typography>
        <Typography gutterBottom variant="body1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
          {profilLoding ?
            <Skeleton variant="rounded" width={150} height={30} /> :
                    role}
        </Typography>
        <Typography gutterBottom variant="body1" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '5px' }}>
          {profilLoding ?
            <Skeleton variant="rounded" width={150} height={30} /> :
                    -phone}
        </Typography>
      </DialogContent>
      <DialogActions style={{ justifyContent: 'center' }}>
        <Button component="label" variant="contained" startIcon={<CloudUploadIcon />}>
          Upload file
          <VisuallyHiddenInput name="profile" id="file" type="file" accept="image/star" onChange={(e) => covertToBase64(e)} />
        </Button>



        {profileImage.profile && <Button variant="contained"
          color="primary" onClick={() => handleUpload()}>
          Cahnge Profile
        </Button>}
      </DialogActions>
    </BootstrapDialog>

  )
}

export default Account;