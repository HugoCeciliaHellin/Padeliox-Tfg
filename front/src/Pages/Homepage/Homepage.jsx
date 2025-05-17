import './Homepage.css';
import Logo from '../../assets/Logo.jpg';

const Homepage = () => (
  <section className="homepage">
    <div className="homepage-container">
      <img src={Logo} alt="Padeliox Logo" className="homepage-logo" />
      <h1>¡Bienvenido a <span>PADELIIOX!</span></h1>
      <p>
        Gestiona, participa y disfruta del pádel de manera rápida y sencilla. 
        La plataforma ideal para organizar torneos y reservas con comodidad y seguridad.
      </p>
    </div>
  </section>
);

export default Homepage;
