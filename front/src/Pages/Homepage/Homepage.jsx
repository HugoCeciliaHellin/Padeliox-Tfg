// src/Pages/Homepage/Homepage.jsx
import './Homepage.css';
import Logo from '../../assets/Logo.jpg'; 

const Homepage = () => (
  <section className="homepage">
    <img src={Logo} alt="Logo de Padeliox"/>
    <h1>¡Bienvenido a PADELIIOX!</h1>
    <p>La plataforma definitiva para gestionar y participar en torneos de pádel.</p>
  </section>

);

export default Homepage;