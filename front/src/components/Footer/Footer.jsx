import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer" aria-label="Pie de página">
    <nav className="footer__links" aria-label="Enlaces legales">
      <Link to="/politica-privacidad">Política de Privacidad</Link>
      <span aria-hidden="true" className="footer__separator">·</span>
      <Link to="/terminos-servicio">Términos de Servicio</Link>
    </nav>
    <p className="footer__copyright">
      &copy; {new Date().getFullYear()} <strong>PADELIOX</strong>. Todos los derechos reservados.
    </p>
  </footer>
);

export default Footer;
