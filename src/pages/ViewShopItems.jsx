import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import { useEffect, useState } from "react";
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
const ViewShopItems = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [loading, setLoading] = useState(true);
  const [custName, setCustName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [phone, setPhone] = useState('');
  const [creditDate, setCreditDate] = useState('');
  const [credit, setCredit] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [refetch, setRefetch] = useState(false);

  //warehouse  and shope
  const [shopeItems, setShopItems] = useState([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaled, setIsSaled] = useState(false);

  //transaction type
  const handleTransactionType = (value) => {
    console.log('value' + value);
    if (value === "transfer") {
      setTransfer(true);
      setCredit(false);
      setTransactionType(value);
      console.log('from transfer');
      console.log(transactionType);
    } else if (value === 'credit') {
      setCredit(true);
      setTransfer(false);
      setTransactionType(value);
      console.log('from credit');
      console.log(transactionType);
    } else {
      setTransactionType(value);
      setTransfer(false);
      setCredit(false);
      console.log('from cash');
      console.log(transactionType);
    }
  }
  // popup related
  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };

  //popup related

  const handleSale = (selectedrow) => {
    setIsSaled(true);
    if (transactionType === 'credit') {
      Axios.post(`/Shop/transaction/${selectedrow._id}`, {
        quantity: quantity,
        customerName: custName,
        paymentMethod: transactionType,
        amount: price,
      }).then((response) => {
        setMessage("Sale Adedded to pending successfully waiting to be approved by the Admin!! " + response.data);
        // Axios.post('/credit/add', {
        //   amount: price,
        //   customerName: custName,
        //   itemCode: selectedrow.itemCode,
        //   phone: phone,
        //   warehouseName: selectedrow.warehouseName,
        //   paymentDate: creditDate
        // }).then((response) => {
        // setRefetch(!refetch)
        //   setIsSaled(false);
        //   setMessage("Credit Added succesfully!!");
        //   setOpen(false);
        // }).catch((error) => {
        //   if (error.response && error.response.data) {
        //     setErrorMessage(error.response.data);
        //   } else {
        //     setErrorMessage("An error occurred");
        //   }
        //   setIsSaled(false);
        // })
      }).catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred");
        }
        setIsSaled(false);
      })
    } else if (transactionType === 'transfer') {
      Axios.post(`/Shop/transaction/${selectedrow._id}`, {
        quantity: quantity,
        amount: price,
        customerName: custName,
        paymentMethod: `${transactionType}(Bank Name: ${bankName}, Account Number: ${accountNumber})`,
      }).then((response) => {
        setRefetch(!refetch)
        setOpen(false);
        setIsSaled(false);
        setMessage("Sale Adedded to pending successfully waiting to be approved by the Admin!! ");
      }).catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred");
        }
        setIsSaled(false);
      })
    } else {
      Axios.post(`/Shop/transaction/${selectedrow._id}`, {
        quantity: quantity,
        amount: price,
        customerName: custName,
        paymentMethod: transactionType,
      }).then((response) => {
        setRefetch(!refetch)
        setOpen(false);
        setIsSaled(false);
        setMessage("Sale Adedded to pending successfully waiting to be approved by the Admin!! " + response.data);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred");
        }
        setIsSaled(false);
      })
    }
  }
  useEffect(() => {
    setLoading(true);
    Axios.get('/Shop/getall').then((response) => {
      setShopItems(response.data);
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
      field: "warehouseName",
      headerName: "Warehouse Name",
      flex: 1,
      cellClassName: "name-column--cell",
    },
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
      headerName: "Item Specification",
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
      field: "sale",
      headerName: "Sale",
      renderCell: ({ row }) => {
        return <button onClick={() => handleClickOpen(row)} className="btn btn-primary mx-1 ">sell</button>;
      },
    },
  ];
  return (
    <>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle
          id="responsive-dialog-title"
          style={{ textAlign: 'center' }}
        >
          Fill the information below
        </DialogTitle>
        <DialogTitle>
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
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Customer Name"
            value={custName}
            onChange={(e) => setCustName(e.target.value)}
            fullWidth
            margin="normal"
          />
          {!credit && <TextField
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            margin="normal"
          />}
          <TextField
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl sx={{ gridColumn: "span 4" }} fullWidth>
            <InputLabel id="demo-simple-select-helper-label">Transaction Type</InputLabel>
            <Select
              sx={{ gridColumn: "span 4" }}
              label="Transaction Type"
              value={transactionType}
              onChange={(e) => handleTransactionType(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="">Select Transaction Type</MenuItem>
              <MenuItem value="transfer">Transfer</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="credit">Credit</MenuItem>
            </Select>
          </FormControl>
          {transfer &&
            <FormControl sx={{ gridColumn: "span 4" }} fullWidth>
              <InputLabel id="demo-simple-select-helper-label">Bank Name</InputLabel>
              <Select
                label="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="">Select Bank Name</MenuItem>
                <MenuItem value="cbe">CBE</MenuItem>
                <MenuItem value="awash">Awash</MenuItem>
                <MenuItem value="abay">Abay</MenuItem>
              </Select>
            </FormControl>
          }
          {transfer && <TextField
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
            margin="normal"
          />}
          {credit && <TextField
            label="phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
          />}
          {
            credit && <TextField
              label="Payment Date"
              type="date"
              value={creditDate}
              onChange={(e) => setCreditDate(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              InputProps={{ inputProps: { min: "yyyy-mm-dd" } }}
            />
          }
        </DialogContent>
        <DialogActions>
          <Button style={{ color: 'white' }} onClick={handleClose}>
            Cancel
          </Button>
          <Button style={{ color: 'white' }} onClick={() => handleSale(selectedRow)} disabled={isSaled}>
            {isSaled ? <CircularProgress color="secondary" size={30} /> : 'Sale'}
          </Button>
        </DialogActions>
      </Dialog>
      <Box m="20px">
        <Header
          title="VIEW SHOP ITEMS"
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
            rows={shopeItems}
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
              if (params.field === "sale") {
                handleClickOpen(row);
              }
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default ViewShopItems;
