import { Alert, Box, IconButton, useMediaQuery } from "@mui/material";
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
    document.title = "credits | STMS"
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [openAlert, setOpenAlert] = useState(true);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const [pendingList, setPendingList] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(true);

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
    }, []);

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
    ];
    return (
        <>
            <Box padding={0}
                margin={0}>
                <Header
                    title="CREDITS"
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
