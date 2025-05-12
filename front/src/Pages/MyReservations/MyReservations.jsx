import './MyReservations.css';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function MyReservations() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadReservations() {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/reservations', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) {
        console.error('Error al cargar reservas', res.status);
        return;
      }
      const data = await res.json();
      setList(Array.isArray(data) ? data : data.reservations || []);
    }
    loadReservations();
  }, []);

  const handleDelete = async id => {
    if (!window.confirm('¿Seguro que quieres eliminar esta reserva?')) return;
    const token = localStorage.getItem('token');
    const res = await fetch(`/api/reservations/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      setList(lst => lst.filter(r => r.id !== id));
    } else {
      const err = await res.json();
      alert('Error al eliminar: ' + (err.message || res.status));
    }
  };

  const handleEdit = async reservation => {
    // Pedimos nuevos horarios al usuario
    const newStart = prompt(
      'Nuevo inicio (YYYY-MM-DDThh:mm)',
      reservation.startTime.slice(0,16)
    );
    if (!newStart) return;
    const newEnd = prompt(
      'Nuevo fin (YYYY-MM-DDThh:mm)',
      reservation.endTime.slice(0,16)
    );
    if (!newEnd) return;

    const token = localStorage.getItem('token');
    const res = await fetch(`/api/reservations/${reservation.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ startTime: newStart, endTime: newEnd })
    });
    if (res.ok) {
      const updated = await res.json();
      setList(lst => lst.map(r => r.id === updated.id ? updated : r));
    } else {
      const err = await res.json();
      alert('Error al actualizar: ' + (err.message || res.status));
    }
  };

  return (
    <div className='main-app'>
      <div className="my-reservations">
        <h2>Mis Reservas</h2>
        {list.length === 0
          ? <p>No tienes reservas aún.</p>
          : list.map(r => (
            <div key={r.id} className="reservation-card">
              <p>Pista #{r.courtId}</p>
              <p>Desde: {new Date(r.startTime).toLocaleString()}</p>
              <p>Hasta: {new Date(r.endTime).toLocaleString()}</p>
              <div className="reservation-actions">
                <button
                  className="btn-edit"
                  onClick={() => handleEdit(r)}
                >
                  Editar horario
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(r.id)}
                >
                  Eliminar reserva
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

export default MyReservations;
