import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Paper, Typography } from '@mui/material';
import api from '../../services/api';

export default function PatientForm(){
  const { id } = useParams();
  const isEdit = Boolean(id);
  const [form, setForm] = useState({ name:'', phone:'', email:'' });
  const navigate = useNavigate();

  useEffect(()=>{
    if(isEdit){
      api.get(`/patients/${id}`).then(res=>setForm(res.data || {}));
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(isEdit){
      await api.put(`/patients/${id}`, form);
    } else {
      await api.post('/patients', form);
    }
    navigate('/patients');
  };

  return (
    <Paper style={{padding:20}}>
      <Typography variant="h5">{isEdit? 'Edit' : 'Add'} Patient</Typography>
      <form onSubmit={handleSubmit} style={{display:'flex', flexDirection:'column', gap:12, marginTop:12}}>
        <TextField label="Name" value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required />
        <TextField label="Phone" value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})} />
        <TextField label="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <Button type="submit" variant="contained">Save</Button>
      </form>
    </Paper>
  );
}
