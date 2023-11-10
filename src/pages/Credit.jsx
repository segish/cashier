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
import Message from "../components/Message";
import styled from "@emotion/styled";
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
const PendingShopItem = () => {
    document.title = "credits | STMS"
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [openAlert, setOpenAlert] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [pendingList, setPendingList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [isApproved, setIsApproved] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [refetch, setRefetch] = useState(false);

    const handleClickOpen = (row) => {
        setOpen(true);
        setSelectedRow(row);

    }
    const handleClose = () => {
        setOpen(false);
        setSelectedRow(null);
    };
    const handleApprove = (selectedrow) => {
        setIsApproved(true);
        Axios.post(`/credits/approve/${selectedrow._id}`,{
            isCreditAtPendingSale: selectedrow.isCreditAtPendingSale,
        }).then((response) => {
            setRefetch(!refetch)
            setOpen(false);
            setIsApproved(false);
            setOpenAlert(true);
            setMessage(`Approving  successfull!`);
        }).catch((error) => {
            setOpen(true);
            if (error.response && error.response.data) {
                setOpenAlert(true);
                setErrorMessage(error.response.data);
            } else {
                setOpenAlert(true);
                setErrorMessage("An error occurred");
            }
            setIsApproved(false);
        })
    }
    useEffect(() => {
        setOpenAlert(false)
        setLoading(true);
        Axios.get('/credits/getall').then((response) => {
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
            field: "customerName",
            headerName: "Customer Name",
            width: isMobile && 120,
            flex: !isMobile && 1,
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
            field: "itemCode",
            headerName: "Item Code",
            width: isMobile && 120,
            flex: !isMobile && 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "phone",
            headerName: "Phone Number",
            width: isMobile && 120,
            flex: !isMobile && 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "warehouseName",
            headerName: "Warehouse Name",
            width: isMobile && 120,
            flex: !isMobile && 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "paymentDate",
            headerName: "Payment Deadline",
            width: isMobile && 120,
            flex: !isMobile && 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "cheque",
            headerName: "cheque number",
            width: isMobile && 120,
            flex: !isMobile && 1,
            cellClassName: "name-column--cell",
        },
        {
            field: "approve",
            headerName: "Approve",
            renderCell: ({ row }) => {
                return <button onClick={() => handleClickOpen(row)} className="btn btn-success mx-1">Approve</button>;
            },
        },
    ];
    return (
        <>
            <Box padding={0}
                margin={0}>
                <Header
                    title="CREDITS"
                /><BootstrapDialog
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="customized-dialog-title"
                    fullWidth
                >
                    <DialogTitle id="delete-confirmation-dialog-title" >Approve Credit</DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => handleClose()}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Typography variant="body1">
                            Are you sure you want to Approve this credit?
                        </Typography>
                    </DialogContent>
                    <DialogActions dividers style={{ justifyContent: 'center' }}>
                        <Button variant="outlined" color="inherit" onClick={() => handleClose()} >
                            No
                        </Button>
                        <Button variant="contained"
                            color="primary" onClick={() => handleApprove(selectedRow)} disabled={isApproved}>
                            {isApproved ? <CircularProgress color="secondary" size={30} /> : 'Yes'}
                        </Button>
                    </DialogActions>
                </BootstrapDialog>
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
                <Message message={message} openAlert={openAlert} setOpenAlert={setOpenAlert} severity='success' />
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
