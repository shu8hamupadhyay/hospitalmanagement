import api from './api';

export async function login(username, password){
  const res = await api.post('/auth/login', { username, password });
  return res.data;
}

export function logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('role');
}
