import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Select, TextField, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import { useEffect, useState } from "react";
import * as React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import { styled } from '@mui/material/styles';
import CircularProgress from "@mui/material/CircularProgress";
import Message from "../components/Message";
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
const ViewSubStoreItems = () => {
  const [open, setOpen] = React.useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [subStoreItems, setSubStoreItems] = useState([]);
  const [custName, setCustName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [quantityMove, setQuantityMove] = useState('');
  const [price, setPrice] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [phone, setPhone] = useState('');
  const [creditDate, setCreditDate] = useState('');
  const [credit, setCredit] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedMoveRow, setSelectedMoveRow] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaled, setIsSaled] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const [reload, setReload] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleSale = (selectedrow) => {
    setIsSaled(true);
    if (transactionType === 'credit') {

      Axios.post(`/Substore/holesale/${selectedrow._id}`, {
        quantity: quantity,
        customerName: custName,
        paymentMethod: transactionType,
        amount: price,
        phone: phone,
        paymentDate: creditDate
      }).then((response) => {
        setMessage("Sale Adedded to pending successfully waiting to be approved by Admin!! " + response.data);
        setIsSaled(false);
        setOpen(false);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransactionType('');
        setErrorMessage('');
        setTransfer(false);
        setCredit(false);
        setReload(!reload);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred");
        }
        setIsSaled(false);
      })
    } else if (transactionType === 'transfer') {
      Axios.post(`/Substore/holesall/${selectedrow._id}`, {
        quantity: quantity,
        amount: price,
        customerName: custName,
        paymentMethod: `${transactionType}(Bank Name: ${bankName}, Account Number: ${accountNumber})`,
      }).then((response) => {
        setOpen(false);
        setIsSaled(false);
        setMessage("Sale Adedded to pending successfully waiting to be approved by Admin!!");
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransactionType('');
        setErrorMessage('');
        setTransfer(false);
        setCredit(false);
        setReload(!reload);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setErrorMessage(error.response.data);
        } else {
          setErrorMessage("An error occurred");
        }
        setIsSaled(false);
      })
    } else {
      Axios.post(`/Substore/holesall/${selectedrow._id}`, {
        quantity: quantity,
        amount: price,
        customerName: custName,
        paymentMethod: transactionType,
      }).then((response) => {
        setOpen(false);
        setIsSaled(false);
        setMessage("Sale Adedded to pending successfully waiting to be approved by Admin!!");
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransactionType('');
        setErrorMessage('');
        setTransfer(false);
        setCredit(false);
        setReload(!reload);
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
  const resetForm = () => {
    setQuantityMove('');
    setErrorMessage('');
  };
  const saleResetForm = () => {
    setCustName('');
    setPrice('');
    setQuantity('');
    setTransactionType('');
    setErrorMessage('');
    setTransfer(false);
    setCredit(false);
  };
  const handleClickOpen = (row) => {
    setOpen(true);
    setSelectedRow(row);
  };
  const handleMoveClickOpen = (row) => {
    setOpenMove(true);
    setSelectedMoveRow(row);
  };
  const handleMoveClose = () => {
    setOpenMove(false);
    setSelectedMoveRow(null);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  const handleMove = (row) => {
    setIsMoved(true);
    Axios.post(`/Substore/transaction/${row._id}`, {
      quantity: quantityMove,
    }).then((response) => {
      setOpenMove(false);
      setMessage(`${quantityMove} ${row.name} is succesfully moved to pending waiting to be approved by admin`);
      setIsMoved(false);
      setReload(!reload);
    }).catch((error) => {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An error occurred");
      }
      setIsMoved(false);
      setOpenMove(true);
    })
  };
  useEffect(() => {
    Axios.get('/Substore/getall').then((response) => {
      setSubStoreItems(response.data);
      setLoading(false);
    }).catch((error) => {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An error occurred");
      }
      setLoading(false);
    })
  }, [reload]);
  const getRowId = (row) => {
    return row._id;
  };
  const columns = [
    {
      field: "warehouseName",
      headerName: "Warehouse Name",
      width: 120,
      cellClassName: "name-column--cell",
    },
    {
      field: "name",
      headerName: "Item Name",
      width: 120,
      cellClassName: "name-column--cell",
    },
    {
      field: "itemCode",
      headerName: "Item Code",
      width: 120,
      cellClassName: "name-column--cell",
    },
    {
      field: "specification",
      headerName: "Item Specification",
      width: 120,
      cellClassName: "name-column--cell",
    },
    {
      field: "type",
      headerName: "Item Type",
      width: 120,
      cellClassName: "name-column--cell",
    },
    {
      field: "expireDate",
      headerName: "Expire Date",
      width: 120,
      cellClassName: "name-column--cell",
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 120,
      cellClassName: "name-column--cell",
    },
    {
      field: "move",
      headerName: "Move",
      renderCell: ({ row }) => {
        // Render the delete button here
        return <button onClick={() => handleMoveClickOpen(row)} className="btn btn-primary mx-1 ">Move</button>;
      },
    },
    {
      field: "sale",
      headerName: "Sale",
      renderCell: ({ row }) => {
        // Render the delete button here
        return <button onClick={() => handleClickOpen(row)} className="btn btn-primary mx-1 ">Sale</button>;
      },
    },
  ];
  return (
    <>
      <BootstrapDialog
        open={openMove}
        onClose={handleMoveClose}
        aria-labelledby="customized-dialog-title"
        fullWidth
      >
        <DialogTitle
          id="customized-dialog-title"
        >
          Moving Items
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => { handleMoveClose(); resetForm(); }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {errorMessage && <DialogTitle>
          <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error' />
        </DialogTitle>}
        <DialogContent dividers>
          <TextField
            sx={{
              marginBottom: '5px'
            }}
            required
            fullWidth
            variant="outlined"
            type="number"
            label="Quantity"
            value={quantityMove}
            name="quantity"
            onChange={(e) => setQuantityMove(e.target.value)}
          />
          {/* } */}
        </DialogContent>
        <DialogActions dividers>

          <Button style={{ color: 'white' }} onClick={() => handleMove(selectedMoveRow)} disabled={isMoved} >
            {isMoved ? <CircularProgress color="secondary" size={30} /> : 'Move'}
          </Button>
        </DialogActions>
      </BootstrapDialog>

      <BootstrapDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle
          id="customized-dialog-title"
        >
          Sale Sub Store Items
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => { handleClose(); saleResetForm() }}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        {errorMessage && <DialogTitle>
          <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error' />
        </DialogTitle>}
        <DialogContent dividers>
          <TextField
            required
            label="Customer Name"
            value={custName}
            onChange={(e) => setCustName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            required
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            type="number"
            margin="normal"
          />
          <TextField
            required
            label="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth
            margin="normal"
          />
          <FormControl
            fullWidth
            sx={{ gridColumn: "span 4" }}>
            <InputLabel id="demo-simple-select-helper-label">Select Transaction Type</InputLabel>
            <Select
              required
              label="Transaction Type"
              value={transactionType}
              onChange={(e) => handleTransactionType(e.target.value)}
              fullWidth
              margin="normal"
            >
              <MenuItem value="transfer">Transfer</MenuItem>
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="credit">Credit</MenuItem>
            </Select>
          </FormControl>
          {transfer &&
            <FormControl
              fullWidth
              sx={{ gridColumn: "span 4" }}>
              <InputLabel id="demo-simple-select-helper-label">Select Bank Name</InputLabel>
              <Select
                required
                label="Bank Name"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="cbe">CBE</MenuItem>
                <MenuItem value="awash">Awash</MenuItem>
                <MenuItem value="abay">Abay</MenuItem>
              </Select>
            </FormControl>
          }
          {transfer && <TextField
            required
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
            margin="normal"
          />}
          {credit && <TextField
            required
            label="phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
          />}
          {
            credit && <TextField
              required
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
        <DialogActions dividers>
          <Button style={{ color: 'white' }} onClick={() => handleSale(selectedRow)} disabled={isSaled}>
            {isSaled ? <CircularProgress color="secondary" size={30} /> : 'Sale'}
          </Button>
        </DialogActions>
      </BootstrapDialog>
      <Box
        margin={0}
        padding={0}
      >
        <Header
          title="SUB STORE ITEMS"
        />
        {loading && <LinearProgress color="secondary" />}
        <Message message={message} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='success' />
        <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error' />
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
            rows={subStoreItems}
            columns={columns}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
            slotProps={{
              toolbar: {
                showQuickFilter: true,
                style: { color: "red" },
              },
            }}
            disableColumnFilter={isMobile}
          />
        </Box>
      </Box>
    </>
  );
};

export default ViewSubStoreItems;
