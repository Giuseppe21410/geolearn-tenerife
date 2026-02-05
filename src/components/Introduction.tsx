import React from 'react';
import '../assets/css/Introduction.css';
import EducationIllustration from '../assets/img/education-illustration.png'; 
import { Link } from 'react-router-dom';

const Introduction: React.FC = () => {
  return (
    <section className="introduction-section">
      <div className="introduction-content">
        <h1 className="introduction-title">Explora la Educación y Cultura en Tenerife</h1>
        <p className="introduction-description">
          GeoLearn Tenerife es tu ventana interactiva a la red de centros educativos y culturales de la isla. 
          Descubre colegios, universidades, bibliotecas y museos con datos precisos y accesibles. 
          Nuestra misión es empoderar a estudiantes, familias y visitantes con información detallada para 
          conectar con el rico ecosistema formativo y cultural de Tenerife.
        </p>
        <Link to="/mapa" className="introduction-button">
        Acceder al Mapa Interactivo
        </Link>
      </div>
      <div className="introduction-image">
        <img src={EducationIllustration} alt="Ilustración de educación interactiva" />
      </div>
    </section>
  );
};

export default Introduction;