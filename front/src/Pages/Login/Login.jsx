// src/Pages/Login/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import './Login.css';
import { toast } from 'react-toastify';

export default function Login() {
  const [formData, setFormData] = useState({ email:'', password:'' });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const {
        accessToken,
        userId,
        role,
        username,
        email
      } = await apiClient.post('/auth/login', formData);
      login({
        token: accessToken,
        userId,
        role,
        username,
        email
      });
      navigate('/app');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      toast.error('Error de autenticación: ' + msg);
    }
  };

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email"
                 value={formData.email}
                 onChange={handleChange}
                 required />
        </div>
        <div>
          <label>Contraseña:</label>
          <input type="password" name="password"
                 value={formData.password}
                 onChange={handleChange}
                 required />
        </div>
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
} 