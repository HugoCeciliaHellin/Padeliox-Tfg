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
import GlobalReservations from './Pages/GlobalReservations/GlobalReservations';
import { ToastContainer } from 'react-toastify';
import './App.css';
import './Pages/MainApp/MainApp.css';

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <ToastContainer position="top-right" autoClose={3000} />
      <Header />

      <Routes>
        {/* Si organizer va directo a global-reservations, sino flujo normal */}
        <Route
          path="/"
          element={
            user
              ? user.role === 'organizer'
                ? <Navigate to="/app/global-reservations" replace />
                : <Navigate to="/app" replace />
              : <Homepage />
          }
        />
        <Route
          path="/login"
          element={user ? <Navigate to={user.role === 'organizer' ? "/app/global-reservations" : "/app"} replace /> : <Login />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={user.role === 'organizer' ? "/app/global-reservations" : "/app"} replace /> : <Register />}
        />

        {/* Acceso solo para organizer */}
        <Route
          path="/app/global-reservations"
          element={
            user && user.role === 'organizer'
              ? <GlobalReservations />
              : <Navigate to="/" replace />
          }
        />

        {/* Ruta EXPÍCITA para Stripe (clave del fix) */}
        <Route path="/app/reservas" element={<MyReservations />} />

        {/* Público Footer */}
        <Route path="/politica-privacidad" element={<PrivacyPolicy />} />
        <Route path="/terminos-servicio" element={<TermsOfService />} />

        {/* Todo /app normal */}
        <Route path="/app" element={<PrivateRoute />}>
          <Route index element={<MainApp />} />
          <Route path="reservar" element={<Courts />} />
          <Route path="reservar/:id" element={<ReserveCourt />} />
          {/* Ya NO pongas <Route path="reservas" ...> aquí, la tienes arriba */}
          <Route path="perfil" element={<Profile />} />
          <Route path="registro" element={<RegisterMatch />} />
          <Route path="estadisticas" element={<Statistics />} />
        </Route>

        {/* Wildcard: Organizer -> global, sino /app o inicio */}
        <Route
          path="*"
          element={
            user
              ? user.role === 'organizer'
                ? <Navigate to="/app/global-reservations" replace />
                : <Navigate to="/app" replace />
              : <Navigate to="/" replace />
          }
        />
      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
