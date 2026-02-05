import React, { useState, useEffect } from 'react';
import { getStats } from '../services/DataService.ts';
import '../assets/css/Counter.css';
import DatosContador from '../assets/img/datos-contador.png';

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
    <div className="counter-container">
      <div className="img-item">
        <img src={DatosContador} alt="Imagen sobre los datos del contador." />
      </div>
      
      <div className='counter-item-container'>
        {loading ? (
          <p>Actualizando datos del Cabildo...</p>
        ) : (
          <>
            <div className="counter-item">
              <span className="counter-number">{counts.bibliotecas}</span>
              <span className="counter-label">Bibliotecas/Ludotecas</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">{counts.museos}</span>
              <span className="counter-label">Museos/Salas de Arte</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">{counts.centrosEducativos}</span>
              <span className="counter-label">Centros Educativos</span>
            </div>
            <div className="counter-item">
              <span className="counter-number">{counts.centrosCulturales}</span>
              <span className="counter-label">Centros Culturales</span>
            </div>
          </>
        )}
      </div>   
    </div>
  );
};

export default Counter;
