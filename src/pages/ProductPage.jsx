import { Box, Button } from '@mui/material';
import React from 'react';
import InvoiceTable from '../components/InvoiceTable';
import { useNavigate } from 'react-router-dom';

const ProductPage = () => {
    const navigate = useNavigate();
    return (
        <Box>

            <Box sx={{ display: "flex", justifyContent: 'flex-end', pr: 2, pt: 2 }}>
                <Button onClick={() => navigate('/')} type="submit" variant="contained" color="primary">
                    Logout
                </Button>
            </Box>
            <InvoiceTable />
        </Box >
    );
}

export default ProductPage;