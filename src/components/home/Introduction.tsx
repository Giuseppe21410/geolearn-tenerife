import React from 'react';
import '../../assets/css/Home/Introduction.css';
import EducationIllustrationMobile from '../../assets/img/education-illustration-mobile.webp';
import { Link } from 'react-router-dom';
import LazyImage from '../common/LazyImage';
import { Map } from 'lucide-react';

const Introduction: React.FC = () => {
  return (

    <>
      <article
        className="introduction-section"
        aria-labelledby="introduction-heading"
      >
        <div className="mobile-interactive-card">
          <div className="mobile-card-header" aria-hidden="true">
            <div className="mobile-icon-container">
              <Map size={24} color="white" aria-hidden="true" />
            </div>
            <h2 id="introduction-heading" className="mobile-card-title">Mapa interactivo</h2>
          </div>
          <p className="mobile-card-description">
            Consulta centros educativos, bibliotecas, museos y todo lo que necesitas para descubrir la cultura de Tenerife.
          </p>
          <Link
            to="/mapa"
            className="mobile-card-button"
            role="button"
            aria-label="Ejecutar y abrir el mapa interactivo de Tenerife"
          >
            Ir al mapa interactivo
          </Link>
        </div>
      </article>
      <LazyImage
        src={EducationIllustrationMobile}
        alt="Ilustración de joven estudiante sosteniendo libros en una biblioteca"
        className="introduction-image-mobile"
        role="img"
      />
    </>
  );
};

export default Introduction;
