import React, { useState, useEffect } from 'react';
import '../assets/css/MapLegend.css';
import HelpIcon from '../assets/img/icons/info.svg';
import ExitIcon from '../assets/img/icons/x.svg';

const legendItems = [
  { label: 'Museos y Salas de Arte', color: '#e74c3c', desc: 'Espacios expositivos y galerías.' },
  { label: 'Teatros', color: '#e67e22', desc: 'Auditorios y artes escénicas.' },
  { label: 'Bibliotecas y Ludotecas', color: '#f1c40f', desc: 'Centros de lectura y ludotecas.' },
  { label: 'Centros Culturales', color: '#9b59b6', desc: 'Centros y asociaciones culturales.' },
  { label: 'Centros Educativos', color: '#3498db', desc: 'Instituciones educativas.' },
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
    <div className="map-legend-container">
      {isVisible && (
        <div className="legend-popover animate-fade-in">
          <h3>Leyenda:</h3>
          <div className="legend-list">
            {legendItems.map((item) => (
              <div key={item.label} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                <div className="legend-text">
                  <span className="legend-label">{item.label}</span>
                  <p className="legend-desc">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <button 
        className={`legend-toggle-btn ${isVisible ? 'active' : ''}`}
        onClick={() => setIsVisible(!isVisible)}
        title="Ver leyenda"
      >
        <img src={ isVisible ? ExitIcon : HelpIcon} alt="Información" />
      </button>
    </div>
  );
};

export default MapLegend;