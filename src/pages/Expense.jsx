import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, Paper, TextField, useMediaQuery } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../theme";
import Header from "../components/Header";
import { useTheme } from "@mui/material";
import Axios from 'axios';
import { useEffect, useState } from "react";
import LinearProgress from '@mui/material/LinearProgress';
import Message from "../components/Message";
import styled from "@emotion/styled";
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
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
const History = () => {
    document.title = "Expense pending | Cashier"
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [historyList, setHistoryList] = useState([]);
    const [openAlert, setOpenAlert] = useState(true);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [expenseAmount, setExpenseAmount] = useState('');
    const [reason, setReason] = useState('');
    const [totalSale, setTotalSale] = useState('');
    const [isExpense, setIsExpense] = useState(false);
    const [expense, setExpense] = useState(false);
    const [message, setMessage] = useState('');
    const [refetch, setRefetch] = useState(false);
    const [refetching, setRefetching] = useState(true);
    const [totalExpense, setTotalExpense] = useState('');

    const handleMoveClose = () => {
        setExpense(false);
    };
    const handeleExpense = () => {
        setIsExpense(true);
        Axios.post(`/expense/newexpense`, {
            amount: expenseAmount,
            reason: reason,
        }).then((response) => {
            setOpenAlert(true)
            setMessage(response.data);
            setIsExpense(false);
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
        setLoading(true);
        Axios.get('/expense/getall').then((response) => {
            setHistoryList(response.data);
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
    }, [refetch]);

    useEffect(() => {
        setRefetching(true);
        Axios.get('/expense/total').then((response) => {
            setTotalExpense(response.data.totalExpense);
            setTotalSale(response.data.totalSale)
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
        })
    }, [refetch]);
    const getRowId = (row) => {
        return row._id;
    };
    const columns = [
        {
            field: "reason",
            headerName: "Expense Reason",
            width: isMobile && 200,
            flex: !isMobile && 2,
            cellClassName: "name-column--cell",
        },
        {
            field: "amount",
            headerName: "Amount",
            width: isMobile && 120,
            flex: !isMobile && 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "createdAt",
            headerName: "Date",
            width: isMobile && 120,
            flex: !isMobile && 1,
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

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "50px",
        marginLeft: "4px",
        marginRight: "4px",
        color: theme.palette.text.secondary,
    }));

    return (<>
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

        <Box
            margin={0}
            padding={0}
        >
            <Header
                title="EXPENSE PENDING"
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
            ><Box sx={{ display: 'flex', flexDirection: isMobile && "column", justifyContent: 'flex-end' }}>
                    <Grid container spacing={isMobile ? 0.5 : 2} >
                        <Grid item xs={isMobile ? 12 : 4}>
                            <Item style={{ color: "blue", fontSize: "20px" }}>TODAY'S TOTAL SALE = {refetching ? <CircularProgress color="secondary" size={20} /> : totalSale + " Birr"} </Item>
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 4}>
                            <Item style={{ color: "red", fontSize: "20px" }}>TODAY'S TOTAL EXPENSE = {refetching ? <CircularProgress color="secondary" size={20} /> : totalExpense + " Birr"}</Item>
                        </Grid>
                        <Grid item xs={isMobile ? 12 : 3}>
                            <Item style={{ color: "yellow", fontSize: "20px" }}>NET INCOME = {refetching ? <CircularProgress color="secondary" size={20} /> : totalSale - totalExpense + " Birr"}</Item>
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        onClick={() => setExpense(true)} className="btn btn-primary mx-1 "
                        startIcon={<AddIcon />}
                        sx={{ marginTop: "4px", backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff', }}
                    >
                        New Expense
                    </Button>
                </Box>
                <DataGrid
                    rows={historyList}
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
        </Box></>
    );
};

export default History;
