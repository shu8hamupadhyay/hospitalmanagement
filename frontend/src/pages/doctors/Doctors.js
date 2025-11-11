import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableBody, TableHead, TableRow, TableCell } from '@mui/material';
import api from '../../services/api';

export default function Doctors(){
  const [doctors, setDoctors] = useState([]);
  useEffect(()=>{ api.get('/doctors').then(res=>setDoctors(res.data || [])); }, []);
  return (
    <div>
      <Typography variant="h4" gutterBottom>Doctors</Typography>
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Dept</TableCell></TableRow></TableHead>
          <TableBody>
            {doctors.map(d=>(<TableRow key={d.id}><TableCell>{d.id}</TableCell><TableCell>{d.name}</TableCell><TableCell>{d.departmentName || d.department?.name}</TableCell></TableRow>))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
