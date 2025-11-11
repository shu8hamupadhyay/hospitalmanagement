import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/auth';

export default function Header(){
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar style={{display:'flex', justifyContent:'space-between'}}>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <IconButton><MenuIcon /></IconButton>
          <Typography variant="h6">Hospital Dashboard</Typography>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <Typography variant="body2">Admin</Typography>
          <IconButton onClick={handleLogout}><Avatar>U</Avatar></IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
}
