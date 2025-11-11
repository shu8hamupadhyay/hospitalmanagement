import api from './api'
export async function login(credentials){
  const res = await api.post('/api/auth/login', credentials)
  return res.data
}
