import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import api from '../../services/api';

export default function Billing(){
  const [bills, setBills] = useState([]);
  useEffect(()=>{ api.get('/bills').then(res=>setBills(res.data || [])); }, []);
  return (
    <div>
      <Typography variant="h4" gutterBottom>Billing</Typography>
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Patient</TableCell><TableCell>Amount</TableCell></TableRow></TableHead>
          <TableBody>{bills.map(b=>(<TableRow key={b.id}><TableCell>{b.id}</TableCell><TableCell>{b.patientName}</TableCell><TableCell>{b.amount}</TableCell></TableRow>))}</TableBody>
        </Table>
      </Paper>
    </div>
  );
}
