import React, { useContext, useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Radio,
  Box
} from '@mui/material';
import UserContext from '../context/UserContext';
import { useQuery } from '@tanstack/react-query';
import { fetchInvoices } from '../hooks/useInvoices';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import ProductTable from './ProductTable';



const InvoiceTable = () => {
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [value, setValue] = useState(null);
  const { userState, setUserState } = useContext(UserContext);

  const createData = (user, productName, quantity) => {
    return { user, productName, quantity };
  };
  const { control, handleSubmit, watch } = useForm({
    defaultValues: {
      invoiceId: ''
    }
  });
  const { data: invoices, error, isLoading } = useQuery({
    queryKey: ['invoices'],
    queryFn: fetchInvoices,
  });
  useEffect(() => {
    if (userState.userId && invoices) {
      const filtered = invoices.value.filter(invoice => invoice.UserId === userState.userId);
      setFilteredInvoices(filtered);
    }
  }, [userState.userId, invoices]);
  const handleDataFromChild = (data) => {
    const printTotalAmount = filteredInvoices.map((item) => {
      if (item.InvoiceId === userState.invoiceId) {
        return { ...item, TotalAmount: data.total }
      } else {
        return item;
      }
    })
    setFilteredInvoices(printTotalAmount)
  }
  return (
      <Box sx={{ display: 'flex', height: '100vh', widht: '100vw', flexDirection: "column", alignItems: 'center', gap: 5 }}>
        <TableContainer component={Paper} sx={{ width: '70%', height: '50%' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Invoice Name</TableCell>
                <TableCell>Paid Date</TableCell>
                <TableCell>Total Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {invoices && filteredInvoices.map((row, index) => {
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Radio
                        value={row.InvoiceId}
                        name="radio-buttons"
                        checked={userState.invoiceId === row.InvoiceId}
                        onChange={(e) => setUserState({ ...userState, invoiceId: e.target.value })}
                        aria-multiselectable={false}
                      />
                    </TableCell>
                    <TableCell>{row.Name}</TableCell>
                    <TableCell>{dayjs(row.PaidDate).format('DD.MM.YYYY')}</TableCell>
                    <TableCell>{row.TotalAmount ?? 'Click to see'}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <ProductTable sendDataToParent={handleDataFromChild} fetchId={userState.invoiceId} />
      </Box>
  );
};

export default InvoiceTable;
