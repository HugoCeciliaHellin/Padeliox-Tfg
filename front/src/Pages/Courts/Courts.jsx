// src/Pages/Courts/Courts.jsx
import { useState, useEffect } from 'react';
import CourtCard from '../../components/CourtCard/CourtCard';
import { getCourts } from '../../api/courts';
import './Courts.css';

function Courts() {
  const [courts, setCourts] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    maxPrice: '',
    surface: ''
  });

  // Cada vez que cambian filtros, recarga pistas
  useEffect(() => {
    getCourts(filters).then(setCourts);
  }, [filters]);

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ search: '', maxPrice: '', surface: '' });
  };

  return (
    <div className="main-app courts-page">
      <aside className="filters">
        <h3>Filtros</h3>

        <input
          type="text"
          name="search"
          placeholder="Ciudad o club…"
          value={filters.search}
          onChange={handleFilterChange}
        />

        <input
          type="number"
          name="maxPrice"
          placeholder="Precio máx. (€)"
          value={filters.maxPrice}
          onChange={handleFilterChange}
        />

        <select
          name="surface"
          value={filters.surface}
          onChange={handleFilterChange}
        >
          <option value="">Superficie</option>
          <option value="césped">Césped</option>
          <option value="hormigón">Hormigón</option>
          <option value="moqueta">Moqueta</option>
          <option value="césped sintético">Césped sintético</option>
        </select>

        <button className="btn-reset" onClick={resetFilters}>
          Restablecer filtros
        </button>
      </aside>

      <section className="court-results">
        {courts.length
          ? courts.map(c => <CourtCard key={c.id} court={c} />)
          : <p className="no-results">No se encontraron pistas.</p>
        }
      </section>
    </div>
  );
}

export default Courts;
