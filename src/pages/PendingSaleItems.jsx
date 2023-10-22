import { Alert, Box, IconButton } from "@mui/material";
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
  const [openAlert, setOpenAlert] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [pendingList, setPendingList] = useState([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [refetch, setRefetch] = useState(false);

  const handleDelete = (row) => {
    if (window.confirm('Are you sure you want to cancel this pending?')) {
      Axios.delete(`/sallespending/undo/${row._id}`).then((response) => {
        setMessage("pending canceled successfully!");
        setRefetch(!refetch)
      }).catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred");
        }
      })
    }
  };
  useEffect(() => {
    setLoading(true);
    Axios.get('/sallespending/getall').then((response) => {
      setPendingList(response.data);
      setLoading(false);
    }).catch((error) => {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
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
      field: "name",
      headerName: "Item Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "itemCode",
      headerName: "Item Code",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "specification",
      headerName: "Specification",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "type",
      headerName: "Item Type",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "expireDate",
      headerName: "Expire Date",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "warehouseType",
      headerName: "Warehouse Type",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "from",
      headerName: "From",
      flex: 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "to",
      headerName: "To",
      flex: 1,
      cellClassName: "name-column--cell",
    },

    {
      field: "delete",
      headerName: "Delete",
      renderCell: ({ row }) => {
        // Render the delete button here
        return <button onClick={() => handleDelete(row)} className="btn btn-danger mx-1 ">Cancel</button>;
      },
    },
  ];
  return (
    <>
      <Box m="20px">
        <Header
          title="PENDING SHOP ITEMS"
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
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                style: { color: "red" },
              },
            }}
            onCellClick={(params) => {
              const row = params.row;

              if (params.field === "delete") {
                handleDelete(row);
              }
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default PendingShopItem;
