import React, { useContext, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoiceLines } from '../hooks/useInvoiceLines';
import { fetchProducts } from '../hooks/useProducts';


const ProductTable = ({ fetchId, sendDataToParent }) => {
    const [childTable, setChildTable] = useState([])
    const [sumOfProducts, setSumOfProducts] = useState({
        total: 0,
        InvoiceId: ''
    });
    const { data: invoiceLines } = useQuery({
        queryKey: ['fetchInvoiceLines'],
        queryFn: fetchInvoiceLines,
    });
    const { data: products } = useQuery({
        queryKey: ['products'],
        queryFn: fetchProducts,
    })
    const getProductDetails = (id) => {
        if (products) {
            const product = products.value.find(p => p.ProductId === id);
            return product ? product : 'Unknown Product';
        } else {
            console.log('products not find', products);
        }
    };
    useEffect(() => {
        if (fetchId && invoiceLines) {
            const filtered = invoiceLines.value.filter(invoice => fetchId === invoice.InvoiceId)
            const invoicesWithProductDetails = filtered.map(invoice => {
                const productDetails = getProductDetails(invoice.ProductId);
                return {
                    ...invoice,
                    ProductName: productDetails.Name,
                    ProductPrice: productDetails.Price
                };
            });
            const calculateTotalSum = () => {
                const sum = invoicesWithProductDetails.reduce((acc, invoice) => {
                    return acc + (invoice.Quantity * invoice.ProductPrice);
                }, 0);
                setSumOfProducts();
                try {
                    sendDataToParent({
                        total: sum,
                    });
                } catch (error) {
                    console.log(error)
                }
            };
            calculateTotalSum();
            setChildTable(invoicesWithProductDetails);
        }
    }, [fetchId])
    return <TableContainer component={Paper} sx={{ width: '70%', height: '30%' }}>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell>Price Per Unit</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Total Amount</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {childTable.map((item, index) =>
                    <TableRow key={index}>
                        <TableCell>{item.ProductName}</TableCell>
                        <TableCell>{item.ProductPrice}</TableCell>
                        <TableCell>{item.Quantity}</TableCell>
                        <TableCell>{item.ProductPrice * item.Quantity}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    </TableContainer>;
}


export default ProductTable;