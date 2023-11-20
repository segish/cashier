import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField, useMediaQuery } from "@mui/material";
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
    const [isExpense, setIsExpense] = useState(false);
    const [expense, setExpense] = useState(false);
    const [message, setMessage] = useState('');
    const [refetch, setRefetch] = useState(false);
    const [refetching, setRefetching] = useState(true);
    const [total, setTotal] = useState({
        totalSale: 0,
        totalSaleTransfer: 0,
        totalSaleCredit: 0,
        totalExpense: 0,
    });

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
        Axios.post('/expense/total').then((response) => {
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
            flex: !isMobile && 3,
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
            ><Box
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
                {loading && <LinearProgress color="secondary" />}
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
