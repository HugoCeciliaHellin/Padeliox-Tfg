// src/api/client.js
import axios from 'axios';
const client = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
});
client.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
export default client;
