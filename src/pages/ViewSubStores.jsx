import { Box, Button, Checkbox, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, IconButton, InputLabel, MenuItem, Select, TextField, useMediaQuery } from "@mui/material";
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
import StatCard from "../components/StatCard";
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
  document.title = "Sub Store items | STMS"
  const [open, setOpen] = React.useState(false);
  const [openMove, setOpenMove] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [subStoreItems, setSubStoreItems] = useState([]);
  const [custName, setCustName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [cash, setCash] = useState(false);
  const [cashOrTransfer, setCashOrTransfer] = useState('');
  const [warehouseName, setWarehouseName] = useState('');
  const [warehouseNameList, setwarehouseNameList] = useState([]);
  const [quantityMove, setQuantityMove] = useState('');
  const [price, setPrice] = useState('');
  const [transactionType, setTransactionType] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [bankName, setBankName] = useState('');
  const [phone, setPhone] = useState('');
  const [credit, setCredit] = useState(false);
  const [transfer, setTransfer] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [checked, setChecked] = useState(false);
  const [chequeNumber, setChequeNumber] = useState(null);
  const [selectedMoveRow, setSelectedMoveRow] = useState(null);
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSaled, setIsSaled] = useState(false);
  const [isMoved, setIsMoved] = useState(false);
  const [reload, setReload] = useState(false);
  const [isPtransfer, setIsPtransfer] = useState(false);
  const [cashTransfer, setCashTransfer] = useState(false);
  const [partialPayment, setPartialPayment] = useState(false);
  const [refetching, setRefetching] = useState(true);
  const [paidAmount, setPaidAmount] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [total, setTotal] = useState({
    totalSale: 0,
    totalSaleTransfer: 0,
    totalSaleCredit: 0,
    totalExpense: 0,
  });

  const handleChange = (event) => {
    setChecked(event.target.checked)
    setChequeNumber(null);
  };
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

  const handleSale = (selectedrow) => {
    setIsSaled(true);
    if (transactionType === 'credit') {

      Axios.post(`/Substore/holesale/${selectedrow._id}`, {
        quantity: quantity,
        customerName: custName,
        paymentMethod: transactionType,
        amount: price,
        phone: phone,
        cheque: chequeNumber,
      }).then((response) => {
        setOpenAlert(true);
        setMessage(`${quantity}  ${selectedrow.name} Added to pending successfully waiting to be approved by Admin!! `);
        setIsSaled(false);
        setOpen(false);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransactionType('');
        setOpenAlert(true)
        setErrorMessage('');
        setTransfer(false);
        setCredit(false);
        saleResetForm();
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
      Axios.post(`/Substore/holesale/${selectedrow._id}`, {
        quantity: quantity,
        amount: price,
        customerName: custName,
        paymentMethod: `${transactionType}(Bank Name: ${bankName}, Account Number: ${accountNumber})`,
      }).then((response) => {
        setOpen(false);
        setIsSaled(false);
        setOpenAlert(true);
        setMessage(`${quantity}  ${selectedrow.name} Added to pending successfully waiting to be approved by Admin!!`);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransactionType('');
        setErrorMessage('');
        setTransfer(false);
        setCredit(false);
        saleResetForm();
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
    } else if (transactionType === 'cash/transfer') {
      Axios.post(`/Substore/holesale/${selectedrow._id}`, {
        quantity: quantity,
        customerName: custName,
        paymentMethod: "cash/transfer",
        amount: price,
        halfPayMethod: accountNumber,
        paidamount: paidAmount
      }).then((response) => {
        setOpen(false);
        setIsSaled(false);
        setMessage(`${quantity}  ${selectedrow.name} Added to pending successfully waiting to be approved by the Admin!! `);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransfer(false);
        setCashTransfer(true);
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
      Axios.post(`/Substore/holesale/${selectedrow._id}`, {
        quantity: quantity,
        customerName: custName,
        paymentMethod: "halfpaid",
        amount: price,
        phone: phone,
        cheque: chequeNumber,
        halfPayMethod: cash ? cashOrTransfer : `${cashOrTransfer}(Bank N: ${bankName}, Acc No: ${accountNumber})`,
        paidamount: paidAmount
      }).then((response) => {
        setOpenAlert(true);
        setMessage(`${quantity}  ${selectedrow.name} Added to pending successfully waiting to be approved by Admin!!`);
        setOpen(false);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransactionType('');
        setErrorMessage('');
        setTransfer(false);
        setIsSaled(false);
        setCredit(false);
        saleResetForm();
        setReload(!reload);
      }).catch((error) => {
        console.log('error ' + error);
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
      Axios.post(`/Substore/holesale/${selectedrow._id}`, {
        quantity: quantity,
        amount: price,
        customerName: custName,
        paymentMethod: transactionType,
      }).then((response) => {
        setOpen(false);
        setIsSaled(false);
        setOpenAlert(true)
        setMessage(`${quantity}  ${selectedrow.name} Added to pending successfully waiting to be approved by Admin!!`);
        setCustName('');
        setPrice('');
        setQuantity('');
        setTransactionType('');
        setErrorMessage('');
        setTransfer(false);
        saleResetForm();
        setCredit(false);
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
  const handleTransactionType = (value) => {
    if (value === "transfer") {
      setTransfer(true);
      setPartialPayment(false);
      setIsPtransfer(false);
      setCashTransfer(false);
      setCredit(false);
      setTransactionType(value);
    } else if (value === 'credit') {
      setCredit(true);
      setTransfer(false);
      setCashTransfer(false);
      setPartialPayment(false);
      setIsPtransfer(false);
      setTransactionType(value);
    } else if (value === 'partial_payment') {
      setPartialPayment(true);
      setCredit(false);
      setCashTransfer(false);
      setTransfer(false);
      setTransactionType(value);
    } else if (value === 'cash/transfer') {
      setCashTransfer(true);
      setPartialPayment(false);
      setIsPtransfer(false);
      setCredit(false);
      setTransfer(false);
      setTransactionType(value);
    } else {
      setTransactionType(value);
      setCashTransfer(false);
      setTransfer(false);
      setPartialPayment(false);
      setIsPtransfer(false);
      setCredit(false);
    }
    setCashOrTransfer('');
    setPaidAmount('');
    setPhone('');
    setChequeNumber(null);
    setBankName('');
    setAccountNumber('');
  }
  const resetForm = () => {
    setWarehouseName('');
    setQuantityMove('');
    setErrorMessage('');
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
    setCashTransfer(false);
    setIsPtransfer(false);
    setTransfer(false);
    setCredit(false);
    setChecked(false);
    setIsSaled(false);
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
      warehouseName: warehouseName,
      quantity: quantityMove,
    }).then((response) => {
      setOpenMove(false);
      setMessage(`${quantityMove} ${row.name} is succesfully moved to pending waiting to be approved by admin`);
      setIsMoved(false);
      setReload(!reload);
    }).catch((error) => {
      if (error.response && error.response.data) {
        setOpenAlert(true)
        setErrorMessage(error.response.data);
      } else {
        setOpenAlert(true)
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
    Axios.get('/warehouse/getall').then((response) => {
      const filteredWarehouse = response.data.filter((warehouse) => warehouse.type === "Shop");
      if (filteredWarehouse.length === 0) {
        setErrorMessage("No shops found!!");
      } else {
        setwarehouseNameList(filteredWarehouse);
      }
    }).catch((error) => {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data);
      } else {
        setErrorMessage("An error occurredf" + error);
      }
    })
  }, [reload]);

  useEffect(() => {
    setRefetching(true);
    Axios.post('/expense/total',{
      warehouseName:"substore"
    }).then((response) => {
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
  }, [reload]);

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
      flex: !isMobile && 2,
      cellClassName: "name-column--cell",
    },
    {
      field: "NetQuantity",
      headerName: "Quantity",
      width: isMobile && 120,
      flex: !isMobile && 1,
      cellClassName: "name-column--cell",
      valueGetter: (params) => params.row.quantity - params.row.pendingSaleQuantity - params.row.pendingToshopQuantity,
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
          Moving {selectedMoveRow && selectedMoveRow.name}
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
          <FormControl
            fullWidth
            sx={{ gridColumn: "span 4" }}>
            <InputLabel id="demo-simple-select-helper-label">Select shop Name</InputLabel>
            <Select
              required
              fullWidth
              variant="outlined"
              sx={{ gridColumn: "span 4", color: "white", marginBottom: '5px' }}
              value={warehouseName}
              name="warehouse"
              label="Warehouse Name"
              onChange={(e) => setWarehouseName(e.target.value)}
            >

              {
                warehouseNameList.map((warehouse) => (
                  <MenuItem key={warehouse.id} value={warehouse.name}>{warehouse.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
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
          Sale of {selectedRow && selectedRow.name}  from Sub Store
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
            label={`How Many ${selectedRow && selectedRow.name} ?`}
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            fullWidth
            type="number"
            margin="normal"
          />
          <TextField
            required
            label={`Unit Price (Price of 1 ${selectedRow && selectedRow.name}) `}
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
              <MenuItem value="partial_payment">PartialPayment with credit</MenuItem>
              <MenuItem value="cash/transfer">PartialPayment with cash and transfer</MenuItem>
            </Select>
          </FormControl>
          {transfer && <TextField
            required
            label="Bank Name"
            type="text"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
            fullWidth
            margin="normal"
          />}
          {transfer && <TextField
            required
            label="Account Number"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            fullWidth
            margin="normal"
          />}
          {cashTransfer &&
            <TextField
              required
              label="Paid Amount in cash"
              type="text"
              value={paidAmount}
              onChange={(e) => setPaidAmount(e.target.value)}
              fullWidth
              margin="normal"
            />
          }
          {cashTransfer &&
            <TextField
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
          {checked && <TextField
            required
            label="Enter Cheque Number?"
            value={chequeNumber}
            onChange={(e) => setChequeNumber(e.target.value)}
            fullWidth
            margin="normal"
            type="number"
          />}
          {credit && <FormControlLabel required control={<Checkbox onChange={handleChange} />} label="Have Cheque Book?" />}
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
              width={isMobile ? "100%" : "fit"}

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
              width={isMobile ? "100%" : "fit"}

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
              width={isMobile ? "100%" : "fit"}

            >
              <StatCard
                totalExpense={total.totalExpense}
                lable={"TODAY'S EXPENSE"}
                refetching={refetching}
              />
            </Box>
          </Box>
          <DataGrid
            rows={subStoreItems}
            columns={columns}
            loading={loading}
            components={{ Toolbar: GridToolbar }}
            getRowId={getRowId}
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

export default ViewSubStoreItems;
