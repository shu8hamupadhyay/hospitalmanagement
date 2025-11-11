import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Paper, Typography } from '@mui/material';
import { login } from '../services/auth';
import api from '../services/api';

export default function Login(){
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      // expected response: { token, role }
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role || 'ADMIN');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
      <Paper style={{padding:24, width:420}} elevation={3}>
        <Typography variant="h5" gutterBottom>Sign in</Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:12}}>
          <TextField label="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
          <TextField label="Password" value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
          <Button type="submit" variant="contained">Login</Button>
        </form>
      </Paper>
    </Box>
  );
}
