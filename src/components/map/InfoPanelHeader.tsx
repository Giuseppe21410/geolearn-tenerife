import React from 'react';
import { X, Star } from 'lucide-react';
import type { PlaceProperties } from './utils/mapTypes';

interface InfoPanelHeaderProps {
  selectedItem: PlaceProperties;
  markerColor: string;
  isFavorite: boolean;
  activityLabel: string;
  onToggleFavorite: () => void;
  onClose: () => void;
}

const InfoPanelHeader: React.FC<InfoPanelHeaderProps> = ({
  selectedItem,
  markerColor,
  isFavorite,
  activityLabel,
  onToggleFavorite,
  onClose,
}) => {
  return (
    <>
      <button
        type="button"
        className="close-btn "
        onClick={onClose}
        aria-label="Cerrar panel de detalles del centro"
      >
        <X aria-hidden="true" />
      </button>

      <h2>{selectedItem.nombre}</h2>

      <div className="badge-row">
        <div
          className="badge-panel"
          style={{
            backgroundColor: `${markerColor}22`,
            color: markerColor,
            border: `1px solid ${markerColor}44`,
          }}
        >
          {activityLabel}
        </div>
        <button
          type="button"
          className={`fav-btn icon-button-tooltip tooltip-left ${isFavorite ? 'active' : ''}`}
          onClick={onToggleFavorite}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? 'Quitar centro de tu lista de favoritos' : 'Agregar centro a tu lista de favoritos'}
          data-label={isFavorite ? 'Quitar Fav' : 'Favorito'}
        >
          <Star
            size={24}
            fill={isFavorite ? '#f1c40f' : 'none'}
            color={isFavorite ? '#f1c40f' : '#94a3b8'}
            aria-hidden="true"
          />
        </button>
      </div>
    </>
  );
};

export default InfoPanelHeader;

