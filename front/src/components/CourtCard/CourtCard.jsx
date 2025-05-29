// src/components/CourtCard/CourtCard.jsx
import { useNavigate } from 'react-router-dom';
import './CourtCard.css';

function CourtCard({ court }) {
  const navigate = useNavigate();
  return (
    <div className="court-card" onClick={() => navigate(`/app/reservar/${court.id}`)} tabIndex={0}>
      {court.imageUrl && (
        <img src={court.imageUrl} alt={court.clubName} className="court-img" />
      )}
      <h3>{court.clubName} – {court.city}</h3>
      <p><strong>Superficie:</strong> {court.surface}</p>
      <p><strong>Precio:</strong> {court.price} €/h</p>
      <p>
        <strong>Iluminación:</strong> {court.hasLights ? 'Sí' : 'No'} |{" "}
        <strong>Vestuarios:</strong> {court.hasLockerRoom ? 'Sí' : 'No'}
      </p>
    </div>
  );
}

export default CourtCard;
