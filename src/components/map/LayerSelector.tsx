import React, { useState } from 'react';
import { Layers, Landmark, Library, Palette, School, Star, type LucideIcon } from 'lucide-react';
import '../../assets/css/TenerifeMap/LayerSelector.css';

interface LayerSelectorProps {
  activeLayer: string;
  onLayerChange: (layer: string) => void;
}

const layers: { id: string; label: string; color: string; icon: LucideIcon }[] = [
  { id: 'favoritos', label: 'Mis Favoritos', color: '#f1c40f', icon: Star },
  { id: 'otros', label: 'Centros Educativos', color: '#3498db', icon: School },
  { id: 'museo', label: 'Museos', color: '#e74c3c', icon: Landmark },
  { id: 'biblioteca', label: 'Bibliotecas', color: '#f1c40f', icon: Library },
  { id: 'cultural', label: 'Centros Culturales', color: '#9b59b6', icon: Palette },
];

const LayerSelector: React.FC<LayerSelectorProps> = ({ activeLayer, onLayerChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`layer-selector-container ${isOpen ? 'open' : ''}`} role="group" aria-label="Filtros por tipo de centro">
      <div className="layers-wrapper">
        {layers.map((layer, index) => (
          <button
            key={layer.id}
            className={`layer-btn icon-button-tooltip tooltip-right ${activeLayer === layer.id ? 'active' : ''}`}
            style={{
              backgroundColor: activeLayer === layer.id ? layer.color : '#ffffff',
              '--index': index,
            } as React.CSSProperties}
            onClick={() => onLayerChange(layer.id)}
            aria-label={layer.label}
            data-label={layer.label}
          >
            {(() => {
              const Icon = layer.icon;
              const isActive = activeLayer === layer.id;
              const isFavorites = layer.id === 'favoritos';
              const activeColor = isFavorites ? '#f1c40f' : layer.color;
              return (
                <Icon
                  aria-hidden="true"
                  role="presentation"
                  size={20}
                  color={isActive ? '#ffffff' : activeColor}
                />
              );
            })()}
          </button>
        ))}
      </div>

      <button
        type="button"
        className="main-layers-btn icon-button-tooltip tooltip-right"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Ocultar panel de capas" : "Mostrar panel de capas"}
        data-label={isOpen ? "Ocultar Capas" : "Capas"}
      >
        <Layers aria-hidden="true" role="presentation" color='black' />
      </button>
    </div>
  );
};

export default LayerSelector;
