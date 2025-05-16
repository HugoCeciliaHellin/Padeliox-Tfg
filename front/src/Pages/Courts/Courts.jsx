// src/Pages/Courts/Courts.jsx
import { useState, useEffect } from 'react';
import CourtCard from '../../components/CourtCard/CourtCard';
import { getCourts } from '../../api/courts';
import './Courts.css';

function Courts() {
  const [courts, setCourts] = useState([]);
  const [filters, setFilters] = useState({
    search: '', maxPrice: '', surface: '', hasLights: '', hasLockerRoom: ''
  });

  useEffect(() => {
    getCourts(filters).then(setCourts);
    
  }, [filters]);
  

  const handleFilterChange = e => {
    setFilters(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  return (
    <div className='main-app'>
    <div className="courts-page">
      <aside className="filters">
        <input
          type="text" name="search" placeholder="Ciudad o club..."
          value={filters.search} onChange={handleFilterChange}
        />
        <input
          type="number" name="maxPrice" placeholder="Precio máx."
          value={filters.maxPrice} onChange={handleFilterChange}
        />
        <select name="surface" value={filters.surface} onChange={handleFilterChange}>
          <option value="">Superficie</option>
          <option value="césped">Césped</option>
          <option value="hormigón">Hormigón</option>
          <option value="moqueta">Moqueta</option>
          <option value="césped sintético">Césped sintético</option>
        </select>
        <label>
          <input type="checkbox"
            name="hasLights"
            checked={filters.hasLights === 'true'}
            onChange={e => setFilters(f => ({
              ...f,
              hasLights: e.target.checked.toString()
            }))}
          />
          Iluminación
        </label>
        <label>
          <input type="checkbox"
            name="hasLockerRoom"
            checked={filters.hasLockerRoom === 'true'}
            onChange={e => setFilters(f => ({
              ...f,
              hasLockerRoom: e.target.checked.toString()
            }))}
          />
          Vestuarios
        </label>
      </aside>

      <section className="court-results">
        {courts.map(c => <CourtCard key={c.id} court={c} />)}
      </section>
    </div>
    </div>
  );
}

export default Courts;
