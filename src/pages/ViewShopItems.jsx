import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, TextField, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
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
  const [expenseAmount, setExpenseAmount] = useState('');
  const [reason, setReason] = useState('');
  const [credit, setCredit] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [chequeNumber, setChequeNumber] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [partialPayment, setPartialPayment] = useState(false);
  const [isPtransfer, setIsPtransfer] = useState(false);
  const [cashOrTransfer, setCashOrTransfer] = useState('');
  const [paidAmount, setPaidAmount] = useState('');
  const [cash, setCash] = useState(false);
  const [shopeItems, setShopItems] = useState([]);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSaled, setIsSaled] = useState(false);
  const [isExpense, setIsExpense] = useState(false);
  const [reload, setReload] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [checked, setChecked] = useState(false);
  const [refetching, setRefetching] = useState(true);
  const [expense, setExpense] = useState(false);
  const [total, setTotal] = useState({
    totalSale: 0,
    totalSaleTransfer: 0,
    totalSaleCredit: 0,
    totalExpense: 0,
  });
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

  const handleTransactionType = (value) => {
    if (value === "transfer") {
      setTransfer(true);
      setCredit(false);
      setPartialPayment(false);
      setIsPtransfer(false);
      setTransactionType(value);
    } else if (value === 'credit') {
      setCredit(true);
      setTransfer(false);
      setPartialPayment(false);
      setIsPtransfer(false);
      setTransactionType(value);
    } else if (value === 'partial_payment') {
      setPartialPayment(true);
      setCredit(false);
      setTransfer(false);
      setTransactionType(value);
    } else {
      setTransactionType(value);
      setTransfer(false);
      setPartialPayment(false);
      setIsPtransfer(false);
      setCredit(false);
    }
    setCashOrTransfer('');
    setCreditDate('');
    setPaidAmount('');
    setPhone('');
    setChequeNumber(null);
    setBankName('');
    setAccountNumber('');
  }

  const handleClickOpen = (row) => {
    setSelectedRow(row);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedRow(null);
  };
  const saleResetForm = () => {
    setCustName('');
    setPrice('');
    setQuantity('');
    setTransactionType('');
    setErrorMessage('');
    setCashOrTransfer('');
    setPaidAmount('');
    setPartialPayment(false);
    setIsPtransfer(false);
    setIsSaled(false);
    setTransfer(false);
    setChecked(false);
    setCredit(false);
    setReason('')
    setExpenseAmount('')
  };
  const handleMoveClose = () => {
    setExpense(false);
    saleResetForm();
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
    } else if (transactionType === 'partial_payment') {
      Axios.post(`/Shop/transaction/${selectedrow._id}`, {
        quantity: quantity,
        customerName: custName,
        paymentMethod: "halfpaid",
        amount: price,
        phone: phone,
        paymentDate: creditDate,
        cheque: chequeNumber,
        halfPayMethod: cash ? cashOrTransfer : `${cashOrTransfer}(Bank N: ${bankName}, Acc No: ${accountNumber})`,
        paidamount: paidAmount
      }).then((response) => {
        setOpenAlert(true);
        setMessage(`${quantity}  ${selectedrow.name} solled with both ${cashOrTransfer} and credit successfully!!`);
        setOpen(false);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransactionType('');
        setErrorMessage('');
        setTransfer(false);
        setCredit(false);
        setIsSaled(false);
        saleResetForm();
        setReload(!reload);
      }).catch((error) => {
        if (error.response && error.response.data) {
          setOpenAlert(true);
          setErrorMessage(error.response.data);
        } else {
          setOpenAlert(true);
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

  const handeleExpense = () => {
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
    setRefetching(true);
    Axios.get('/expense/total').then((response) => {
      setTotal(response.data);
      setRefetching(false);
    }).catch((error) => {
      if (error.response && error.response.data) {
        setOpenAlert(true)
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true)
        setErrorMessage("An error occurred");
      }
      setRefetching(false);
      setLoading(false);
    })
  }, [reload, refetch]);
  const handlePaymentType = (value) => {
    if (value === "transfer") {
      setIsPtransfer(true);
      setCash(false);
      setCashOrTransfer(value);
    } else {
      setCash(true);
      setIsPtransfer(false);
      setCashOrTransfer(value);
    }
  }
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
      field: "NetQuantity",
      headerName: "Quantity",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
      valueGetter: (params) => params.row.quantity - params.row.pendingSaleQuantity,
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
              <MenuItem value="partial_payment">PartialPayment</MenuItem>
            </Select>
          </FormControl>
          {transfer &&
            <TextField
              required
              label="Bank Name"
              type="text"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              fullWidth
              margin="normal"
            />
          }
          {transfer && <TextField
            required
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
            margin="normal"
          />}
          {partialPayment && <TextField
            required
            label="Paid Amount"
            type="text"
            value={paidAmount}
            onChange={(e) => setPaidAmount(e.target.value)}
            fullWidth
            margin="normal"
          />}
          {partialPayment &&
            <FormControl
              fullWidth
              sx={{ gridColumn: "span 4" }}>
              <InputLabel id="demo-simple-select-helper-label">Choose Payment Type</InputLabel>
              <Select
                required
                value={cashOrTransfer}
                onChange={(e) => handlePaymentType(e.target.value)}
                fullWidth
                margin="normal"
              >
                <MenuItem value="transfer">Transfer</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
              </Select>
            </FormControl>
          }
          {isPtransfer && !cash && <TextField
            required
            label="Bank Name"
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            fullWidth
            margin="normal"
          />}

          {isPtransfer && !cash && <TextField
            required
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
            margin="normal"
          />}
          {partialPayment && <TextField
            required
            label="phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            margin="normal"
            type="number"
          />}
          {partialPayment && <FormControlLabel required control={<Checkbox onChange={handleChange} />} label="Have Cheque book?" />}
          {partialPayment && checked && <TextField
            required
            label="Enter Cheque Number?"
            value={chequeNumber}
            onChange={(e) => setChequeNumber(e.target.value)}
            fullWidth
            margin="normal"
            type="number"
          />}
          {
            partialPayment && <TextField
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
          <Box
            display="flex"
            flexWrap="wrap"
            gap="6px"
            justifyContent="space-around"
            fullWidth
            marginBottom="5px"
          >

            <Box
              gridColumn={{ xs: "span 12", sm: "span 3", }}
              backgroundColor={colors.primary[500]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={isMobile?"100%":"fit"}

            >
              <StatCard
                cash={total.totalSale}
                transfer={total.totalSaleTransfer}
                credit={total.totalSaleCredit}
                lable={"TODAY'S SALE"}
                refetching={refetching}
              />
            </Box>
            <Box
              gridColumn={{ xs: "span 12", sm: "span 3", }}
              backgroundColor={colors.primary[500]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={isMobile?"100%":"fit"}

            >
              <StatCard
                netSale={total.totalSale + total.totalSaleTransfer + total.totalSaleCredit}
                netIncome={total.totalSale + total.totalSaleTransfer + total.totalSaleCredit - total.totalExpense}
                netCash={total.totalSale - total.totalExpense}
                lable={"TODAY'S NET"}
                refetching={refetching}
              />
            </Box>
            <Box
              gridColumn={{ xs: "span 12", sm: "span 3", }}
              backgroundColor={colors.primary[500]}
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={isMobile?"100%":"fit"}

            >
              <StatCard
                totalExpense={total.totalExpense}
                lable={"TODAY'S EXPENSE"}
                refetching={refetching}
              />
            </Box>
            <Button
              variant="contained"
              onClick={() => setExpense(true)}
              startIcon={<AddIcon />}
              sx={{ marginTop: "4px", border: 1, backgroundColor: colors.primary[400], alignSelf: "flex-end" }}
            >
              New Expense
            </Button>
          </Box>
          <Message message={message} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='success' />
          <Message message={errorMessage} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='error' />
          {loading && <LinearProgress color="secondary"/>}
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
