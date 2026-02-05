import React from 'react';
import '../assets/css/Footer.css';
import LogoGeoLearn from '../assets/img/icons/favicon.svg'; 
import TenerifeIcon from '../assets/img/datos-abiertos.png'; 

const Footer: React.FC = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        {/* Parte Izquierda: Logo y Copyright */}
        <div className="footer-left">
          <img src={LogoGeoLearn} alt="GeoLearn Logo" className="footer-logo" />
          <div className="footer-info">
            <p>© 2026 GeoLearn Tenerife</p>
            <p className="footer-legal">Datos proporcionados por el Cabildo de Tenerife</p>
          </div>
        </div>

        {/* Parte Derecha: Imagen decorativa y Créditos */}
        <div className="footer-right">
            <a href="https://datos.tenerife.es/es/" target="_blank" rel="noopener noreferrer">
                <img src={TenerifeIcon} alt="Datos Abiertos Tenerife" className="footer-island-img" />
            </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;