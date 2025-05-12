// src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header         from './components/Header/Header';
import Footer         from './components/Footer/Footer';
import Homepage       from './Pages/Homepage/Homepage';
import Login          from './Pages/Login/Login';
import Register       from './Pages/Register/Register';
import PrivateRoute   from './components/Private/PrivateRoutes';
import MainApp        from './Pages/MainApp/MainApp';
import Courts         from './Pages/Courts/Courts';
import ReserveCourt   from './Pages/ReserveCourt/ReserveCourt';
import MyReservations from './Pages/MyReservations/MyReservations';
import Profile        from './Pages/Profile/Profile';
import PrivacyPolicy  from './Pages/FooterPages/PrivacyPolicy';
import TermsOfService from './Pages/FooterPages/TermsOfService';
import './App.css';
import './Pages/MainApp/MainApp.css';

function App() {
  return (
    <Router>
      <Header />

      <Routes>
  {/* públicas */}
  <Route path="/" element={<Homepage />} />
  <Route path="/login" element={<Login />} />
  <Route path="/register" element={<Register />} />
  <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
  <Route path="/terminos-servicio" element={<TermsOfService />} />

  {/* todo lo que empieza por /app pasa por PrivateRoute */}
  <Route path="/app" element={<PrivateRoute />}>
    <Route index element={<MainApp />} />
    <Route path="reservar" element={<Courts />} />
    <Route path="reservar/:id" element={<ReserveCourt />} />
    <Route path="reservas" element={<MyReservations />} />
    <Route path="perfil" element={<Profile />} />
  </Route>
</Routes>


      <Footer />
    </Router>
  );
}

export default App;
