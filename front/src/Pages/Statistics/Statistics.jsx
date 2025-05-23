// src/Pages/Statistics/Statistics.jsx
import { useState, useEffect } from 'react';
import { listMyReservations } from '../../api/reservations';
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import './Statistics.css';

export default function Statistics() {
  const [data, setData] = useState([]);
  useEffect(() => {
    listMyReservations().then(rs => {
      const now = Date.now();
      const past = rs.filter(r => new Date(r.endTime) <= now && r.result);
      const wins   = past.filter(r => r.result === 'win').length;
      const losses = past.filter(r => r.result === 'loss').length;
      setData([
        { name: 'Victorias', value: wins },
        { name: 'Derrotas',  value: losses }
      ]);
    });
  }, []);

  const COLORS = ['#82ca9d', '#f77'];

  return (
    <div className="main-app statistics-page">
      <h2>Estadísticas</h2>

      <div className="chart-row">
        <div className="chart-item">
          <h3>Proporción de resultados</h3>
          <PieChart width={250} height={250}>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {data.map((_, i) =>
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              )}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </div>

        <div className="chart-item">
          <h3>Victorias vs Derrotas</h3>
          <BarChart
            width={300}
            height={250}
            data={data}
            margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="value" fill={COLORS[0]} />
          </BarChart>
        </div>
      </div>
    </div>
  );
}
