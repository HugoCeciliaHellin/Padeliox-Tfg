// src/Pages/Register/Register.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // ① importar useAuth
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import './Register.css';

export default function Register() {
  const { user } = useAuth();    // ② leer user
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'player'
  });

  // 🔄 si ya hay user, vamos a /app
  useEffect(() => {
    if (user) navigate('/app', { replace: true });
  }, [user, navigate]);

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await client.post('/auth/register', formData);
      alert(`Usuario registrado con ID: ${res.data.userId}`);
      navigate('/login');
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="register-form">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de usuario:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}        // ③ aquí
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}        // ③ aquí
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}        // ③ aquí
            required
          />
        </div>
        <div>
          <label>Rol:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}        // ③ aquí
          >
            <option value="player">Jugador</option>
            <option value="organizer">Organizador</option>
          </select>
        </div>

        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
}
