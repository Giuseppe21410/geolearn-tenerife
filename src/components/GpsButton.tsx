import React, { useState } from 'react';
import '../assets/css/GpsButton.css';
import LocationIcon from '../assets/img/icons/location.svg';

interface GpsButtonProps {
  onLocationFound: (coords: { lat: number; lng: number } | null) => void;
}

const GpsButton: React.FC<GpsButtonProps> = ({ onLocationFound }) => {
  const [isActive, setIsActive] = useState(false);

  const toggleLocation = () => {
    if (!isActive) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onLocationFound(coords);
          setIsActive(true);
        },
        (error) => {
          console.error("Error obteniendo ubicación:", error);
          alert("No se pudo acceder a tu ubicación.");
          setIsActive(false);}
      );
    } else {
      setIsActive(false);
      onLocationFound(null);
    }
  };

  return (
    <button 
      className={`gps-button ${isActive ? 'active' : ''}`}
      onClick={toggleLocation}
      title="Buscar cerca de mí"
      type='button'
    >
        <img src={LocationIcon} alt="Ubicación" />
    </button>
  );
};

export default GpsButton;