import React from 'react';
import { LocateFixed } from 'lucide-react';
import { isLocationInTenerife } from '../../utils/GeolocationUtils';
import '../../assets/css/Home/GpsButton.css';

interface GpsButtonProps {
  onLocationFound: (coords: { lat: number; lng: number } | null) => void;
  onLoadingChange?: (isLoading: boolean) => void;
  onError?: (error: string | null) => void;
}

const GpsButton: React.FC<GpsButtonProps> = ({ onLocationFound, onLoadingChange, onError }) => {

  const toggleLocation = () => {
    if (onError) onError(null);
    if (onLoadingChange) onLoadingChange(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (onLoadingChange) onLoadingChange(false);
        const { latitude, longitude } = position.coords;

        if (!isLocationInTenerife(latitude, longitude)) {
          const msg = "Lo sentimos, solo mostramos centros dentro de la isla de Tenerife.";
          if (onError) onError(msg);
          onLocationFound(null);
          return;
        }

        const coords = {
          lat: latitude,
          lng: longitude,
        };
        onLocationFound(coords);
        if (onError) onError(null);
      },
      (error) => {
        if (onLoadingChange) onLoadingChange(false);
        console.error("Error obteniendo ubicación:", error);
        const msg = "No se pudo acceder a tu ubicación. Revisa los permisos del navegador.";
        if (onError) onError(msg);
        onLocationFound(null);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  return (
    <>
      <button
        className="gps-button-home icon-button-tooltip"
        onClick={toggleLocation}
        type="button"
        aria-label="Buscar centros usando mi ubicación actual"
        data-label="Mi Ubicación"
      >
        <LocateFixed aria-hidden="true" color='black' />
      </button>
    </>
  );
};

export default GpsButton;
