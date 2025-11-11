import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import api from '../../services/api';

export default function Departments(){
  const [items, setItems] = useState([]);
  useEffect(()=>{ api.get('/departments').then(res=>setItems(res.data || [])); }, []);
  return (
    <div>
      <Typography variant="h4" gutterBottom>Departments</Typography>
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell></TableRow></TableHead>
          <TableBody>{items.map(it=>(<TableRow key={it.id}><TableCell>{it.id}</TableCell><TableCell>{it.name}</TableCell></TableRow>))}</TableBody>
        </Table>
      </Paper>
    </div>
  );
}
