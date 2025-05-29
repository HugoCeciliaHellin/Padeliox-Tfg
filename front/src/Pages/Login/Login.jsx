// src/Pages/Login/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../api/client';
import './Login.css';
import { toast } from 'react-toastify';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    try {
      const { accessToken, user } = await apiClient.post('/auth/login', formData);
      login({
        token: accessToken,
        userId: user.id,
        role: user.role,
        username: user.username,
        email: user.email
      });
      navigate('/app');
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(e => fieldErrors[e.param] = e.msg);
        setErrors(fieldErrors);
      } else {
        const msg = err.response?.data?.message || 'Credenciales inválidas';
        setErrors({ general: msg });
        toast.error(msg);
      }
    }
  };

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(errors => ({ ...errors, [e.target.name]: '' }));
  };

  return (
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />
          {errors.email && <div className="error">{errors.email}</div>}
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        {errors.general && <div className="error">{errors.general}</div>}
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
}
