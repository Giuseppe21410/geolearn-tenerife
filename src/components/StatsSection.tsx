import React from 'react';
import '../assets/css/StatsSection.css';
import DashboardImg from '../assets/img/data-dashboard.png';

const StatsSection: React.FC = () => {
  return (
    <section className="stats-section">
      <div className="stats-image-container">
        <img src={DashboardImg} alt="Panel de estadísticas GeoLearn" className="stats-floating-img" />
      </div>

      <div className="stats-text-content">
        <span className="stats-badge">Open Data Power</span>
        <h2 className="stats-heading">Decisiones basadas en datos reales</h2>
        <p className="stats-info">
          No solo localizamos centros, analizamos el ecosistema educativo de Tenerife. 
          Accede a nuestro <strong>Dashboard de Estadísticas</strong> para visualizar la concentración de recursos por municipios, 
          comparar tipos de enseñanza y descubrir tendencias socioculturales en tiempo real.
        </p>
        <ul className="stats-features">
          <li>✓ Comparativa por municipios</li>
          <li>✓ Distribución de centros culturales</li>
        </ul>
        <button className="stats-btn" onClick={() => window.location.href = '#dashboard'}>
          Ver Estadísticas de la Isla
        </button>
      </div>
    </section>
  );
};

export default StatsSection;