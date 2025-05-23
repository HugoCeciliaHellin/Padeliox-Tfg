// src/components/UI/Spinner.jsx
import React from 'react';
import './Spinner.css';

export default function Spinner() {
  return (
    <div className="spinner" role="status" aria-label="Cargando">
      <div></div><div></div><div></div><div></div>
    </div>
  );
}
