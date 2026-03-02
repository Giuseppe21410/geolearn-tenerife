import React from 'react';
import '../../assets/css/Home/StatsSection.css';
import DashboardImgMobile from '../../assets/img/data-dashboard-mobile.webp';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';

const StatsSection: React.FC = () => {
  return (
    <section className="stats-section" aria-labelledby="stats-section-heading">
      <div className="stats-mobile-layout">
        <div className="stats-image-container-mobile">
          <LazyImage
            src={DashboardImgMobile}
            alt="Fondo decorativo de análisis de datos para GeoLearn"
            className="stats-floating-img-mobile"
          />
          <div className="stats-overlay-mobile"></div>
        </div>

        <div className="stats-text-content-mobile">
          <span className="stats-subtitle-mini">GEOLEARN DATA HUB</span>
          <div className="stats-divider-line" aria-hidden="true"></div>

          <h3 className="sr-only" id="stats-section-heading">Prepara tu propia estrategia de datos</h3>
          <div className="stats-heading-mobile" aria-hidden="true">
            PREPARA TU PROPIA <br /> <span>Estrategia</span>
          </div>

          <p className="stats-info-mobile">
            Configura tu propio análisis a través de los indicadores oficiales de la isla de Tenerife.
          </p>
          <Link
            to="/dashboard"
            className="stats-btn-mobile"
            role="button"
            aria-label="Ejecutar e ingresar al panel de análisis estadístico oficial de Tenerife"
          >
            Empieza a Analizar con Datos
          </Link>
        </div>
      </div>

    </section>
  );
};

export default StatsSection;

