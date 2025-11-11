import React, { useEffect, useState } from 'react';
import { Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody, Button } from '@mui/material';
import api from '../../services/api';

export default function Appointments(){
  const [appointments, setAppointments] = useState([]);
  const fetch = async () => {
    const res = await api.get('/appointments');
    setAppointments(res.data || []);
  };
  useEffect(()=>{ fetch(); }, []);

  return (
    <div>
      <Typography variant="h4" gutterBottom>Appointments</Typography>
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>ID</TableCell><TableCell>Patient</TableCell><TableCell>Doctor</TableCell><TableCell>Date</TableCell></TableRow></TableHead>
          <TableBody>
            {appointments.map(a=>(
              <TableRow key={a.id}><TableCell>{a.id}</TableCell><TableCell>{a.patientName || a.patient?.name}</TableCell><TableCell>{a.doctorName || a.doctor?.name}</TableCell><TableCell>{a.date}</TableCell></TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </div>
  );
}
