import React from 'react';
import { Globe, Phone, MapPin } from 'lucide-react';
import type { PlaceProperties } from './utils/mapTypes';

interface InfoPanelDetailsProps {
  selectedItem: PlaceProperties;
}

const InfoPanelDetails: React.FC<InfoPanelDetailsProps> = ({ selectedItem }) => {
  return (
    <div className="data-row">
      <p role="text">
        <span className="sr-only">Municipio: </span>
        <strong aria-hidden="true">Municipio</strong> {selectedItem.municipio_nombre}
      </p>

      <div className="action-line">
        <p role="text">
          <span className="sr-only">Dirección: </span>
          <strong aria-hidden="true">Dirección</strong> {selectedItem.direccion_nombre_via},{' '}
          {selectedItem.direccion_numero}
        </p>
        {selectedItem.direccion_nombre_via && (
          <a
            href={`https://www.google.com/maps?q=${selectedItem.latitud},${selectedItem.longitud}`}
            target="_blank"
            rel="noreferrer"
            className="icon-action-btn icon-button-tooltip tooltip-left"
            aria-label={`Abrir ubicación detallada de ${selectedItem.nombre} en Google Maps`}
            data-label="Ver en Maps"
          >
            <MapPin aria-hidden="true" color="black" />
          </a>
        )}
      </div>

      <div className="action-line">
        <p role="text">
          <span className="sr-only">Teléfono: </span>
          <strong aria-hidden="true">Teléfono</strong> {selectedItem.telefono || 'No disponible'}
        </p>
        {selectedItem.telefono && (
          <a
            href={`tel:${selectedItem.telefono}`}
            className="icon-action-btn icon-button-tooltip tooltip-left"
            aria-label={`Llamar por teléfono al centro educativo`}
            data-label="Llamar"
          >
            <Phone aria-hidden="true" color="black" />
          </a>
        )}
      </div>

      <div className="action-line">
        <p role="text">
          <span className="sr-only">Sitio Web: </span>
          <strong aria-hidden="true">Web</strong>{' '}
          {selectedItem.web ? selectedItem.web : 'No disponible'}
        </p>
        {selectedItem.web && (
          <a
            href={
              selectedItem.web.startsWith('http')
                ? selectedItem.web
                : `https://${selectedItem.web}`
            }
            target="_blank"
            rel="noreferrer"
            className="icon-action-btn icon-button-tooltip tooltip-left"
            aria-label={`Visitar sitio web oficial`}
            data-label="Visitar Web"
          >
            <Globe aria-hidden="true" color="black" />
          </a>
        )}
      </div>
    </div>
  );
};

export default InfoPanelDetails;

