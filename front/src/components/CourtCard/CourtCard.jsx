// src/components/CourtCard/CourtCard.jsx
import { useNavigate } from 'react-router-dom';
import './CourtCard.css';
function CourtCard({ court }) {
  const navigate = useNavigate();
  return (
    <div className='main-app'>
    <div
      className="court-card"
      onClick={() => navigate(`/app/reservar/${court.id}`)}
    >
      {court.imageUrl && <img src={court.imageUrl} alt={court.clubName} />}
      <h3>{court.clubName} – {court.city}</h3>
      <p>Superficie: {court.surface}</p>
      <p>Precio: {court.price} €/h</p>
      <p>
        Iluminación: {court.hasLights ? 'Sí' : 'No'} |
        Vestuarios: {court.hasLockerRoom ? 'Sí' : 'No'}
      </p>
    </div>
    </div>
  );
}

export default CourtCard;