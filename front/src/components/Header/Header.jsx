import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/Logo.jpg';
import './Header.css';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- Header para ORGANIZER ---
  if (user?.role === 'organizer') {
    return (
      <header className="header">
        <div className="container">
          <Link to="/app/global-reservations" className="logo-container">
            <img src={Logo} alt="PADELIOX" className="logo" />
          </Link>
          <nav>
            <ul>
              <li>
                <Link to="/app/global-reservations">Reservas Globales</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="btn-logout">
                  Salir
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    );
  }

  // --- Header para USERS normales ---
  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo-container">
          <img src={Logo} alt="PADELIOX" className="logo" />
        </Link>
        <nav>
          <ul>
            {user ? (
              <>
                <li><Link to="/app/reservar">Reservar</Link></li>
                <li><Link to="/app/reservas">Reservas</Link></li>
                <li><Link to="/app/perfil">Perfil</Link></li>
                <li className="user-info">{user.username}</li>
                <li className="role-info">{user.role}</li>
                <li>
                  <button onClick={handleLogout} className="btn-logout">
                    Salir
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className="btn-login">Iniciar sesión</Link></li>
                <li><Link to="/register" className="btn-register">Registrarse</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
