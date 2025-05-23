// src/api/client.js
import axios from 'axios'
import { toast } from 'react-toastify'

const API_URL = process.env.REACT_APP_API_URL || '';
const axiosInstance = axios.create({
  baseURL: `${API_URL}/api`
});

axiosInstance.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

axiosInstance.interceptors.response.use(
  res => res,
  err => {
    const msg = err.response?.data?.message || err.message;
    toast.error(msg);
    return Promise.reject(err);
  }
);

export const apiClient = {
  get:    (url, cfg)       => axiosInstance.get(url, cfg).then(res => res.data),
  post:   (url, data, cfg) => axiosInstance.post(url, data, cfg).then(res => res.data),
  put:    (url, data, cfg) => axiosInstance.put(url, data, cfg).then(res => res.data),
  delete: (url, cfg)       => axiosInstance.delete(url, cfg).then(res => res.data),
};

export default apiClient
