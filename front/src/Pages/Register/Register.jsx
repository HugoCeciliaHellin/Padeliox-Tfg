import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css'; 


const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'player'
  });

  const navigate = useNavigate(); // Para redirigir después del registro


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        alert(`Usuario registrado con ID: ${data.userId}`);
        navigate('/login'); 
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      alert('Error de conexión con el servidor');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div>
          <label>Rol:</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
          >
            <option value="player">Jugador</option>
            <option value="organizer">Organizador</option>
          </select>
        </div>
        
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;