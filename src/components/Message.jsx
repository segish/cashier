import { Alert, Box, Collapse, IconButton } from '@mui/material';
import React from 'react'
import CloseIcon from '@mui/icons-material/Close';
const Message = ({message, openAlert, setOpenAlert, severity}) => {
  return (
    <>
    {message && <Box sx={{ width: '100%' }}>
      <Collapse in={openAlert}>
        <Alert
        severity={severity}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenAlert(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }
          sx={{ mb: 2 }}
        >
          {message}
        </Alert>
      </Collapse>
    </Box>}
    </>
  )
}

export default Message;