import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Asegúrate de tener un archivo CSS para estilos

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const { login } = useAuth();                // ← el método de tu contexto
  const navigate = useNavigate();             // para redirigir al MainApp

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (res.ok) {
        login(data);                           // ← guardas token y user aquí
        navigate('/app');                      // ← rediriges a tu MainApp
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor: ' + err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="login-form">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit }>
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
        
        <button type="submit">Ingresar</button>
      </form>
    </div>
  );
};

export default Login;




