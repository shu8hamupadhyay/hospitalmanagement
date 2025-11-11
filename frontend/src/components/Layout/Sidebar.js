import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { Link } from 'react-router-dom';

const drawerWidth = 220;

export default function Sidebar(){
  return (
    <Drawer variant="permanent" open sx={{
        width: drawerWidth,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' },
      }}>
      <Toolbar />
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} to="/patients">
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Patients" />
        </ListItem>
        <ListItem button component={Link} to="/appointments">
          <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
          <ListItemText primary="Appointments" />
        </ListItem>
        <ListItem button component={Link} to="/doctors">
          <ListItemIcon><LocalHospitalIcon /></ListItemIcon>
          <ListItemText primary="Doctors" />
        </ListItem>
        <ListItem button component={Link} to="/departments">
          <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
          <ListItemText primary="Departments" />
        </ListItem>
        <ListItem button component={Link} to="/billing">
          <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
          <ListItemText primary="Billing" />
        </ListItem>
      </List>
    </Drawer>
  );
}
