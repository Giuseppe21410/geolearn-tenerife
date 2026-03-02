import React, { useState, useEffect } from 'react';
import { getStats } from '../../services/DataService.ts';
import '../../assets/css/Home/Counter.css';

const Counter: React.FC = () => {
  const [counts, setCounts] = useState({
    bibliotecas: 0,
    museos: 0,
    centrosEducativos: 0,
    centrosCulturales: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCounts = async () => {
      const data = await getStats();
      if (data) {
        setCounts(data);
      }
      setLoading(false);
    };
    fetchCounts();
  }, []);

  return (
    <section
      className="counter-container"
      aria-labelledby="centers-counter-heading"
    >

      <div className="mobile-counter-header">
        <h2 id="centers-counter-heading" className="mobile-counter-title">
          Nuestra Red en Cifras
        </h2>
        <div className="title-underline" aria-hidden="true"></div>
      </div>

      <div className="counter-item-container">
        {loading ? (
          <div className="loading-text">Actualizando datos del Cabildo...</div>
        ) : (
          <>
            <div className="counter-item" role="text" aria-label={`Total de Bibliotecas y Ludotecas: ${counts.bibliotecas}`}>
              <span className="counter-number" aria-hidden="true">{counts.bibliotecas}</span>
              <span className="counter-label" aria-hidden="true">Bibliotecas/Ludotecas</span>
            </div>
            <div className="counter-item" role="text" aria-label={`Total de Museos y Salas de Arte: ${counts.museos}`}>
              <span className="counter-number" aria-hidden="true">{counts.museos}</span>
              <span className="counter-label" aria-hidden="true">Museos/Salas de Arte</span>
            </div>
            <div className="counter-item" role="text" aria-label={`Total de Centros Educativos: ${counts.centrosEducativos}`}>
              <span className="counter-number" aria-hidden="true">{counts.centrosEducativos}</span>
              <span className="counter-label" aria-hidden="true">Centros Educativos</span>
            </div>
            <div className="counter-item" role="text" aria-label={`Total de Centros Culturales: ${counts.centrosCulturales}`}>
              <span className="counter-number" aria-hidden="true">{counts.centrosCulturales}</span>
              <span className="counter-label" aria-hidden="true">Centros Culturales</span>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Counter; 
