import React, { useState } from 'react';
import '../assets/css/LayerSelector.css';
import LayersIcon from '../assets/img/icons/layers.svg';
import MuseumIcon from '../assets/img/icons/museum.svg';
import LibraryIcon from '../assets/img/icons/book.svg';
import CultureIcon from '../assets/img/icons/culture.svg';
import SchoolIcon from '../assets/img/icons/primary-school.svg';
import starSolidIcon from '../assets/img/icons/star-solid.svg';

interface LayerSelectorProps {
  activeLayer: string;
  onLayerChange: (layer: string) => void;
}

// El orden aquí define cómo se apilan hacia arriba. 'otros' es el primero.
const layers = [
  { id: 'favoritos', label: 'Mis Favoritos', color: '#f1c40f', icon: starSolidIcon }, 
  { id: 'otros', label: 'General', color: '#3498db', icon: SchoolIcon },
  { id: 'museo', label: 'Museos', color: '#e74c3c', icon: MuseumIcon },
  { id: 'biblioteca', label: 'Bibliotecas', color: '#f1c40f', icon: LibraryIcon },
  { id: 'cultural', label: 'Centros Culturales', color: '#9b59b6', icon: CultureIcon },
];

const LayerSelector: React.FC<LayerSelectorProps> = ({ activeLayer, onLayerChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`layer-selector-container ${isOpen ? 'open' : ''}`}>
      <div className="layers-wrapper">
        {layers.map((layer, index) => (
          <button
            key={layer.id}
            className={`layer-btn ${activeLayer === layer.id ? 'active' : ''}`}
            style={{ 
              backgroundColor: activeLayer === layer.id ? layer.color : '#ffffff',
              '--index': index 
            } as React.CSSProperties}
            onClick={() => onLayerChange(layer.id)}
            title={layer.label}
          >
            <img 
              src={layer.icon} 
              alt={layer.label} 
              style={{ filter: activeLayer === layer.id ? 'brightness(0) invert(1)' : 'none' }}
            />
          </button>
        ))}
      </div>
      
      <button className="main-layers-btn" onClick={() => setIsOpen(!isOpen)}>
        <img src={LayersIcon} alt="Capas" />
      </button>
    </div>
  );
};

export default LayerSelector;