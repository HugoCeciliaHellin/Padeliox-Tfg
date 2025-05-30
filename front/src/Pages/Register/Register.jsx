import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import apiClient from '../../api/client';
import { toast } from 'react-toastify';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', role: 'player'
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
    setErrors(errors => ({ ...errors, [e.target.name]: '' }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});
    try {
      await apiClient.post('/auth/register', formData);
      toast.success('Usuario registrado correctamente.');
      navigate('/login');
    } catch (err) {
      if (err.response?.data?.errors) {
        const fieldErrors = {};
        err.response.data.errors.forEach(e => {
          fieldErrors[e.param] = e.msg;
          toast.error(`${e.param}: ${e.msg}`);
        });
        setErrors(fieldErrors);
      } else if (err.response?.data?.message) {
        setErrors({ general: err.response.data.message });
        toast.error(err.response.data.message);
      } else {
        const fallback = 'No se pudo registrar el usuario';
        setErrors({ general: fallback });
        toast.error(fallback);
      }
    }
  };

  return (
    <div className="register-form">
      <h2>Crear cuenta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            autoComplete="username"
          />
          {errors.username && <div className="error">{errors.username}</div>}
        </div>
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
            autoComplete="new-password"
          />
          {errors.password && <div className="error">{errors.password}</div>}
        </div>
        <div>
          <label>Rol:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="player">Jugador</option>
            <option value="organizer">Organizador</option>
          </select>
        </div>
        {errors.general && <div className="error">{errors.general}</div>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
