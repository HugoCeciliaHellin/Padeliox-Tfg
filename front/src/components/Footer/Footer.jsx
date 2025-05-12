// src/components/Footer/Footer.jsx
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer__links">
      <Link to="/politica-privacidad">Política de Privacidad</Link>
      <Link to="/terminos-servicio">Términos de Servicio</Link>
    </div>
    <p>&copy; {new Date().getFullYear()} PADELIIOX. Todos los derechos reservados.</p>
  </footer>
);

export default Footer;
