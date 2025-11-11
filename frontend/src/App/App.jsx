import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login.jsx';
import Dashboard from '../pages/Dashboard.jsx';
import Patients from '../pages/patients/Patients.jsx';
import PatientForm from '../pages/patients/PatientForm.jsx';
import Appointments from '../pages/appointments/Appointments.jsx';
import Doctors from '../pages/doctors/Doctors.jsx';
import Departments from '../pages/departments/Departments.jsx';
import Billing from '../pages/billing/Billing.jsx';
import Header from '../components/Layout/Header.jsx';
import Sidebar from '../components/Layout/Sidebar.jsx';
import ProtectedRoute from '../components/Auth/ProtectedRoute.jsx';
import { Container } from '@mui/material';

function App() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <div style={{ flex: 1 }}>
        <Header />
        <Container maxWidth="xl" style={{ paddingTop: 20 }}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/patients" element={<ProtectedRoute><Patients /></ProtectedRoute>} />
            <Route path="/patients/new" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
            <Route path="/patients/:id/edit" element={<ProtectedRoute><PatientForm /></ProtectedRoute>} />
            <Route path="/appointments" element={<ProtectedRoute><Appointments /></ProtectedRoute>} />
            <Route path="/doctors" element={<ProtectedRoute><Doctors /></ProtectedRoute>} />
            <Route path="/departments" element={<ProtectedRoute><Departments /></ProtectedRoute>} />
            <Route path="/billing" element={<ProtectedRoute><Billing /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
      </div>
    </div>
  );
}

export default App;
