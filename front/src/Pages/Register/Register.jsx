
// src/Pages/Register/Register.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../../api/client';
import './Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    username:'', email:'', password:'', role:'player'
  });
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await client.post('/auth/register', formData);
      alert(`Usuario registrado con ID: ${res.data.userId}`);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || err.message;
      alert('Error: ' + msg);
    }
  };

  const handleChange = e => {
    setFormData(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className="register-form">
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        {/* ... campos igual que antes ... */}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
