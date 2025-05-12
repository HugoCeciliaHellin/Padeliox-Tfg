// src/components/Header/Header.jsx
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.jpg';
import './Header.css';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // limpia token y user en el contexto
    navigate('/login'); // redirige de inmediato al login (o a “/” si prefieres)
  };

  return (
    <header className="header">
      <div className="container">
        <Link to="/">
          <img src={Logo} alt="PADELIIOX" className="logo" />
        </Link>
        <nav>
          <ul>
            {user ? (
              <>
                <li><Link to="/app/reservar">Reservar Pistas</Link></li>
                <li><Link to="/app/reservas">Mis Reservas</Link></li>
                <li><Link to="/app/perfil">Perfil</Link></li>
                <li><span>Usuario: {user.username}</span></li>
                <li><span>Rol: {user.role}</span></li>
                <li>
                  <Link to="/app" className="btn-home">
                    Inicio
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn-logout">
                    Cerrar Sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Iniciar Sesión</Link></li>
                <li><Link to="/register">Registrarse</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
