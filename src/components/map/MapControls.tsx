import React from 'react';
import { LocateFixed, ChartColumnIncreasing } from 'lucide-react';
import { Link } from 'react-router-dom';

interface MapControlsProps {
  isSatellite: boolean;
  onToggleSatellite: () => void;
  onLocateUser: () => void;
}

const MapControls: React.FC<MapControlsProps> = ({
  isSatellite,
  onToggleSatellite,
  onLocateUser,
}) => (
  <div className="custom-map-controls">
    <button
      type="button"
      className={`view-toggle-btn  ${isSatellite ? 'mode-sat' : 'mode-map'}`}
      onClick={onToggleSatellite}
      aria-pressed={isSatellite}
      aria-label={isSatellite ? 'Cambiar a modo mapa' : 'Cambiar a vista satélite'}
    >
      <div className="view-toggle-label" aria-hidden="true">{isSatellite ? 'Mapa' : 'Satélite'}</div>
    </button>

    <Link
      to="/dashboard"
      className="gps-button icon-button-tooltip tooltip-right"
      aria-label="Ir al Panel de Estadísticas Generales"
      data-label="Dashboard"
    >
      <ChartColumnIncreasing style={{ width: '22px', height: '22px', color: 'black' }} aria-hidden="true" />
    </Link>


    <button
      type="button"
      className="gps-button icon-button-tooltip tooltip-right"
      onClick={onLocateUser}
      aria-label="Centrar el mapa en mi ubicación"
      data-label="Mi Ubicación"
    >
      <LocateFixed style={{ width: '22px', height: '22px', color: 'black' }} aria-hidden="true" />
    </button>
  </div >
);

export default MapControls;
