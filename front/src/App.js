// src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Homepage from './Pages/Homepage/Homepage';
import Login from './Pages/Login/Login';
import Register from './Pages/Register/Register';
import PrivateRoute from './components/Private/PrivateRoutes';
import MainApp from './Pages/MainApp/MainApp';
import Courts from './Pages/Courts/Courts';
import ReserveCourt from './Pages/ReserveCourt/ReserveCourt';
import MyReservations from './Pages/MyReservations/MyReservations';
import Profile from './Pages/Profile/Profile';
import PrivacyPolicy from './Pages/FooterPages/PrivacyPolicy';
import TermsOfService from './Pages/FooterPages/TermsOfService';
import RegisterMatch from './Pages/RegisterMatch/RegisterMatch';
import Statistics from './Pages/Statistics/Statistics';
import './App.css';
import './Pages/MainApp/MainApp.css';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Header />

      <Routes>
        {/* RUTA RAÍZ: si estoy logueado, me lleva a /app, si no Homepage */}
        <Route
          path="/"
          element={user ? <Navigate to="/app" replace /> : <Homepage />}
        />

        {/* Login y Register redirigen a /app si ya estoy logueado */}
        <Route
          path="/login"
          element={user ? <Navigate to="/app" replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to="/app" replace /> : <Register />}
        />

        {/* Páginas públicas del Footer, siempre accesibles */}
        <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
        <Route path="/terminos-servicio" element={<TermsOfService />} />

        {/* Todo bajo /app requiere usuario autenticado */}
        <Route path="/app" element={<PrivateRoute />}>
          <Route index element={<MainApp />} />
          <Route path="reservar" element={<Courts />} />
          <Route path="reservar/:id" element={<ReserveCourt />} />
          <Route path="reservas" element={<MyReservations />} />
          <Route path="perfil" element={<Profile />} />
          <Route path="registro" element={<RegisterMatch />} />
          <Route path="estadisticas" element={<Statistics />} />
        </Route>

        {/* Cualquier ruta desconocida lleva a /app (si autenticado) o a / (si no autenticado) */}
        <Route
          path="*"
          element={user ? <Navigate to="/app" replace /> : <Navigate to="/" replace />}
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
