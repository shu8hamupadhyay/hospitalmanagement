import React, { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Typography, Button, Table, TableBody, TableCell, TableHead, TableRow, Paper } from '@mui/material';
import api from '../../services/api';

export default function Patients(){
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    const res = await api.get('/patients');
    setPatients(res.data || []);
  };

  useEffect(()=>{ fetchPatients(); }, []);

  const handleDelete = async (id) => {
    if(!window.confirm('Delete patient?')) return;
    await api.delete(`/patients/${id}`);
    fetchPatients();
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Patients</Typography>
      <Button variant="contained" component={RouterLink} to="/patients/new" style={{marginBottom:12}}>Add Patient</Button>
      <Paper>
        <Table>
          <TableHead>
            <TableRow><TableCell>ID</TableCell><TableCell>Name</TableCell><TableCell>Phone</TableCell><TableCell>Actions</TableCell></TableRow>
          </TableHead>
          <TableBody>
            {patients.map(p=>(
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name || p.fullName || p.firstName}</TableCell>
                <TableCell>{p.phone}</TableCell>
                <TableCell>
                  <Button size="small" component={RouterLink} to={`/patients/${p.id}/edit`}>Edit</Button>
                  <Button size="small" onClick={()=>handleDelete(p.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
