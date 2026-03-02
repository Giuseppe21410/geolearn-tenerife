import React, { useState, useEffect } from 'react';
import { Info, X } from 'lucide-react';
import '../../assets/css/TenerifeMap/MapLegend.css';

const legendItems = [
  { label: 'Museos y Salas de Arte', color: '#e74c3c', desc: 'Espacios expositivos y galerías.' },
  { label: 'Teatros', color: '#e67e22', desc: 'Auditorios y artes escénicas.' },
  { label: 'Bibliotecas y Ludotecas', color: '#f1c40f', desc: 'Centros de lectura y ludotecas.' },
  { label: 'Centros Culturales', color: '#9b59b6', desc: 'Centros y asociaciones culturales.' },
  { label: 'Centros Educativos', color: '#3498db', desc: 'Enseñanza Infantil, Primaria, Secundaria, Especializada, Profesional, Guarderías, Universidades...' },
];

interface MapLegendProps {
  isPanelOpen: boolean;
}

const MapLegend: React.FC<MapLegendProps> = ({ isPanelOpen }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isPanelOpen) {
      setIsVisible(false);
    }
  }, [isPanelOpen]);

  return (
    <div className="map-legend-container" role="region" aria-label="Leyenda de colores del mapa">
      {isVisible && (
        <div className="legend-popover animate-fade-in" id="map-legend-popover">
          <h3>Leyenda:</h3>
          <ul className="legend-list" style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {legendItems.map(item => (
              <li key={item.label} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: item.color }} aria-hidden="true"></span>
                <div className="legend-text">
                  <span className="legend-label">{item.label}</span>
                  <p className="legend-desc">{item.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        type="button"
        className={`legend-toggle-btn icon-button-tooltip tooltip-left ${isVisible ? 'active' : ''}`}
        onClick={() => setIsVisible(!isVisible)}
        aria-label={isVisible ? 'Ocultar leyenda del mapa' : 'Mostrar leyenda del mapa'}
        data-label={isVisible ? 'Ocultar Leyenda' : 'Ver Leyenda'}
      >
        {isVisible ? (
          <X aria-hidden="true" color='black' />
        ) : (
          <Info aria-hidden="true" color='black' />
        )}
      </button>
    </div>
  );
};

export default MapLegend;
