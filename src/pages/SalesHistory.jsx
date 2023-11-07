import { Box, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import { useEffect, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Message from "../components/Message";
const SalesHistory = () => {
  document.title = "Sales History | Cashier"
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [salesHistoryList, setSalesHistory] = useState([]);
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [openAlert, setOpenAlert] = useState(true);
  useEffect(() => {
    Axios.get('/salleshistory/getall').then((response) => {
      setSalesHistory(response.data);
      setLoading(false);
    }).catch((error) => {
      if (error.response && error.response.data) {
        setOpenAlert(true);
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true);
        setErrorMessage("An error occurred");
      }
      setLoading(false);
    })
  }, []);
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
      field: "specification",
      headerName: "Item Specification",
      width: isMobile && 120,
      flex: !isMobile && 3,
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
      field: "paymentMethod",
      headerName: "Payment Method",
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
      field: "amount",
      headerName: "Total Price",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "createdAt",
      headerName: "Date",
      width: isMobile && 120,
      flex: !isMobile && 2,
      cellClassName: "name-column--cell",
      valueGetter: (params) => {
        const createdAt = params.row.createdAt;
        const date = new Date(createdAt);
        const formattedDate = date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "long",
          day: "numeric",
        });
        return formattedDate;
      },
    },
  ];
  return (
    <Box
      margin={0}
      padding={0}
    >
      <Header
        title="SALES HISTORY"
      />
      {errorMessage && <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error' />}
      {loading && <LinearProgress color="secondary" />}
      <Box
        margin={0}
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
          rows={salesHistoryList}
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
  );
};

export default SalesHistory;
