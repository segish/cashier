import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, InputLabel, MenuItem, Paper, Select, TextField, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import { useEffect, useState } from "react";
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Message from "../components/Message";
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/material/styles';
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
const ViewShopItems = () => {
  document.title = "Shop items | STMS"
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  // dialog
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [loading, setLoading] = useState(true);
  //dialog

  //input data
  const [custName, setCustName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [phone, setPhone] = useState('');
  const [creditDate, setCreditDate] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [reason, setReason] = useState('');
  const [totalSale, setTotalSale] = useState('');
  const [totalExpense, setTotalExpense] = useState('');
  const [credit, setCredit] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [chequeNumber, setChequeNumber] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  //input data

  //warehouse  and shope
  const [shopeItems, setShopItems] = useState([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaled, setIsSaled] = useState(false);
  const [isExpense, setIsExpense] = useState(false);
  const [reload, setReload] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [checked, setChecked] = useState(false);
  const [expense, setExpense] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  //transaction type
  const handleTransactionType = (value) => {
    if (value === "transfer") {
      setTransfer(true);
      setCredit(false);
      setTransactionType(value);
    } else if (value === 'credit') {
      setCredit(true);
      setTransfer(false);
      setTransactionType(value);
    } else {
      setTransactionType(value);
      setTransfer(false);
      setCredit(false);
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

  const saleResetForm = () => {
    setCustName('');
    setPrice('');
    setQuantity('');
    setTransactionType('');
    setOpenAlert(false)
    setErrorMessage('');
    setTransfer(false);
    setCredit(false);
  };
  const handleMoveClose = () => {
    setExpense(false);
  };
  const handleSale = (selectedrow) => {
    setIsSaled(true);
    if (transactionType === 'credit') {
      Axios.post(`/Shop/transaction/${selectedrow._id}`, {
        quantity: quantity,
        customerName: custName,
        paymentMethod: transactionType,
        amount: price,
        phone: phone,
        paymentDate: creditDate,
        cheque: chequeNumber,
      }).then((response) => {
        setMessage(`${quantity}  ${selectedrow.name} Sale Adedded to pending successfully waiting to be approved by Admin!!`);
        setIsSaled(false);
        setOpen(false);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransfer(false);
        setCredit(false);
        setTransactionType('');
        setOpenAlert(true)
        setErrorMessage('');
        setReload(!reload);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true)
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true)
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
        setOpen(false);
        setIsSaled(false);
        setMessage("Sale Adedded to pending successfully waiting to be approved by the Admin!! ");
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransfer(false);
        setCredit(false);
        setTransactionType('');
        setOpenAlert(true)
        setErrorMessage('');
        setReload(!reload);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true)
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true)
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
        setOpen(false);
        setIsSaled(false);
        setMessage(`${quantity}  ${selectedrow.name} Sale Adedded to pending successfully waiting to be approved by the Admin!! `);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransfer(false);
        setCredit(false);
        setTransactionType('');
        setOpenAlert(true)
        setErrorMessage('');
        setReload(!reload);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true)
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true)
          setErrorMessage("An error occurred");
        }
        setIsSaled(false);
      })
    }
  }

  const handeleExpense = (selectedrow) => {
    setIsExpense(true);
    Axios.post(`/expense/newexpense`, {
      amount: expenseAmount,
      reason: reason,
    }).then((response) => {
      setOpenAlert(true)
      setMessage(response.data);
      setIsExpense(false);
      setOpen(false);
      setExpenseAmount('');
      setReason('');
      setErrorMessage('');
      setExpense(false);
      setRefetch(!refetch)
    }).catch((error) => {
      if (error.response && error.response.data) {
        setOpenAlert(true)
        setErrorMessage(error.response.data);
        setMessage('');
      } else {
        setOpenAlert(true)
        setErrorMessage("An error occurred");
        setMessage('');
      }
      setIsExpense(false);
      setExpense(false);
    })
  }

  useEffect(() => {
    Axios.get('/Shop/getall').then((response) => {
      setShopItems(response.data);
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
  }, [reload]);

  useEffect(() => {
    Axios.get('/expense/total').then((response) => {
      setTotalExpense(response.data.totalExpense);
      setTotalSale(response.data.totalSale)
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
  }, [reload,refetch]);
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
      headerName: "Item Specification",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
    },
    {
      field: "expireDate",
      headerName: "Expire Date",
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
      field: "sale",
      headerName: "Sale",
      renderCell: ({ row }) => {
        // Render the delete button here
        return <button onClick={() => handleClickOpen(row)} className="btn btn-primary mx-1 ">Sale</button>;
      },
    },
  ];
  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  return (
    <>

      <BootstrapDialog
        open={expense}
        onClose={handleMoveClose}
        aria-labelledby="customized-dialog-title"
        fullWidth
      >
        <DialogTitle
          id="customized-dialog-title"
        >
          New Expense
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => { handleMoveClose() }}
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
            label="amount"
            value={expenseAmount}
            name="amount"
            onChange={(e) => setExpenseAmount(e.target.value)}
          />
          <TextField
            sx={{
              marginBottom: '5px'
            }}
            required
            fullWidth
            variant="outlined"
            type="text"
            multiline
            rows={2}
            label="reason"
            value={reason}
            name="quantity"
            onChange={(e) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions dividers>

          <Button style={{ color: 'white' }}
            onClick={() => handeleExpense()}
            disabled={isExpense}
          >
            {isExpense ? <CircularProgress color="secondary" size={30} /> : 'Add'}
          </Button>
        </DialogActions>
      </BootstrapDialog>



      <BootstrapDialog
        open={open}
        onClose={handleClose}
        aria-labelledby="costomized-dialog-title"
      >
        <DialogTitle
          id="costomized-dialog-title"
        >
          Sale Shop Items
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
            type="number"
            label="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
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
          {credit && <FormControlLabel required control={<Checkbox onChange={handleChange} />} label="Have Check Book?" />}
          {credit && checked && <TextField
            required
            label="Enter Check Number"
            value={chequeNumber}
            onChange={(e) => setChequeNumber(e.target.value)}
            fullWidth
            margin="normal"
            type="number"
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
        <DialogActions>
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
          title="SHOP ITEMS"
        />
        <Message message={message} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='success' />
        <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error' />
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Item style={{ color: "blue",fontSize:"20px" }}>TODAY'S TOTAL SALE = {totalSale} Brr</Item>
              </Grid>
              <Grid item xs={4}>
                <Item style={{ color: "red", fontSize: "20px" }}>TODAY'S TOTAL EXPENSE = {totalExpense} brr</Item>
              </Grid>
              <Grid item xs={4}>
                <Item style={{ color: "yellow", fontSize: "20px" }}>NET INCOME = {totalSale-totalExpense} brr</Item>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              onClick={() => setExpense(true)} className="btn btn-primary mx-1 "
              startIcon={<AddIcon />}
              sx={{ marginLeft: 'auto'}}
            >
              New Expense
            </Button>
          </Box>
          <DataGrid
            rows={shopeItems}
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

export default ViewShopItems;
