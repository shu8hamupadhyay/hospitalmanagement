import React from 'react';
import { Typography, Grid, Card, CardContent } from '@mui/material';
import api from '../services/api';

export default function Dashboard(){
  // Could fetch summary stats from backend
  return (
    <div>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card><CardContent><Typography>Patients</Typography><Typography variant="h5">--</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent><Typography>Appointments</Typography><Typography variant="h5">--</Typography></CardContent></Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card><CardContent><Typography>Revenue</Typography><Typography variant="h5">--</Typography></CardContent></Card>
        </Grid>
      </Grid>
    </div>
  );
}
