import React from 'react';
import type { TransportStop } from './utils/mapTypes';
import TranviaImg from '../../assets/img/bus.webp';
import BusImg from '../../assets/img/tram.webp';

interface InfoPanelTransportProps {
  nearbyTransport: TransportStop[];
}

const InfoPanelTransport: React.FC<InfoPanelTransportProps> = ({
  nearbyTransport,
}) => {
  return (
    <ul className="transport-container" aria-label="Opciones de transporte público cercano">
      {nearbyTransport.map((stop, i) => (
        <li key={i}>
          <a
            href={stop.url}
            target="_blank"
            rel="noreferrer"
            className="transport-card icon-button-tooltip tooltip-left"
            aria-label={`Ruta a la parada de ${stop.type} ${stop.nombre} a ${stop.distance.toFixed(2)} kilómetros`}
            data-label={`Ver ruta de ${stop.nombre}`}
          >
            <img
              src={stop.type === 'tranvia' ? BusImg : TranviaImg}
              alt=""
              aria-hidden="true"
              role="presentation"
            />
            <div className="transport-info">
              <span>{stop.nombre.toUpperCase()}</span>
              <small>{stop.distance.toFixed(2)} km</small>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
};

export default InfoPanelTransport;

