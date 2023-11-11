import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import { useEffect, useState } from "react";
import * as React from 'react';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
const PendingShopItem = () => {
  document.title = "pending Sales | STMS"
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [openAlert, setOpenAlert] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pendingList, setPendingList] = useState([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);
  const [isCancled, setIsCancled] = useState(false);
  const [openCancle, setOpenCancle] = useState(false);
  const [selectedCancleRow, setSelectedCancleRow] = useState(null);

  const handleCancleClickOpen = (row) => {
    setOpenCancle(true);
    setSelectedCancleRow(row);
  };

  const handleCancleClose = () => {
    setOpenCancle(false);
    setSelectedCancleRow(null);
  };

  const handleDelete = (row) => {
    setOpenAlert(false)
    setIsCancled(true);
    Axios.delete(`/sallespending/undo/${row._id}`).then((response) => {
      setMessage("pending canceled successfully!");
      setRefetch(!refetch)
      setIsCancled(false);
      setOpenCancle(false);
    }).catch((error) => {
      if (error.response && error.response.data) {
        setOpenAlert(true)
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true)
        setErrorMessage("An error occurred");
      }
      setIsCancled(false);
      setOpenCancle(false);
    })
  };
  useEffect(() => {
    setLoading(true);
    Axios.get('/sallespending/getall').then((response) => {
      setPendingList(response.data);
      setLoading(false);
    }).catch((error) => {
      if (error.response && error.response.data) {
        setOpenAlert(true)
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true)
        setErrorMessage("An error occurred");
      }
      setLoading(false);
    })
  }, [refetch]);

  const getRowId = (row) => {
    return row._id;
  };
  const columns = [
    {
      field: "itemCode",
      headerName: "Item Code",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Item Name",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "type",
      headerName: "Item Type",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "specification",
      headerName: "Specification",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "from",
      headerName: "From",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "to",
      headerName: "To",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "delete",
      headerName: "Delete",
      renderCell: ({ row }) => {
        // Render the delete button here
        return <button onClick={() => handleCancleClickOpen(row)} className="btn btn-danger mx-1 ">Cancel</button>;
      },
    },
  ];
  return (
    <>
      <Box padding={0}
        margin={0}>
        <Header
          title="PENDING SALES ITEMS"
        />
        {errorMessage && <Box sx={{ width: '100%' }}>
          <Collapse in={openAlert}>
            <Alert
              severity="error"
              action={
                <IconButton
                  aria-label="close"
                  color="warning"
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
              {errorMessage}
            </Alert>
          </Collapse>
        </Box>}
        {message && <Box sx={{ width: '100%' }}>
          <Collapse in={openAlert}>
            <Alert
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
        {loading && <LinearProgress color="secondary" />}
        <Dialog
          open={openCancle}
          onClose={handleCancleClose}
          aria-labelledby="responsive-dialog-title"
          // maxWidth="md" // Set the desired width here
          fullWidth
        >
          <DialogTitle id="delete-confirmation-dialog-title" style={{ textAlign: 'center' }}>Confirm Delete</DialogTitle>
          <DialogTitle>
          </DialogTitle>
          <DialogContent style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="body1">
              Are you sure you want to delete this pending?
            </Typography>
          </DialogContent>
          <DialogActions style={{ justifyContent: 'center' }}>
            <Button variant="outlined" color="inherit" onClick={() => handleCancleClose()} >
              No
            </Button>
            <Button variant="contained"
              color="primary" onClick={() => handleDelete(selectedCancleRow)} disabled={isCancled}>
              {isCancled ? <CircularProgress color="secondary" size={30} /> : 'Yes'}
            </Button>
          </DialogActions>
        </Dialog>
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[300],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[700],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[400],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[700],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
            "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
              color: `${colors.grey[100]} !important`,
            },
          }}
        >
          <DataGrid
            rows={pendingList}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
            loading={loading}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                style: { color: "red" },
              },
            }}
            disableColumnFilter={isMobile}
            disableDensitySelector={isMobile}
            disableColumnSelector={isMobile}
          />
        </Box>
      </Box>
    </>
  );
};

export default PendingShopItem;
