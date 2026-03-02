import React from 'react';
import { Share2, Info } from 'lucide-react';

interface InfoPanelFooterProps {
  onShare: () => void;
}

const InfoPanelFooter: React.FC<InfoPanelFooterProps> = ({ onShare }) => {
  return (
    <div className="panel-footer">
      <button
        className="icon-action-btn icon-button-tooltip tooltip-right"
        onClick={onShare}
        aria-label="Compartir este lugar"
        data-label="Compartir"
      >
        <Share2 aria-hidden="true" color="black" />
      </button>
      <span className="error-notice">La información puede contener errores.</span>
      <a
        href="https://datos.tenerife.es/es/datos/conjuntos-de-datos/centros-educativos-y-culturales-en-tenerife"
        target="_blank"
        rel="noreferrer"
        className="icon-action-btn icon-button-tooltip tooltip-left"
        aria-label="Ver fuente de datos"
        data-label="Fuente de Datos"
      >
        <Info aria-hidden="true" color="black" />
      </a>
    </div>
  );
};

export default InfoPanelFooter;

