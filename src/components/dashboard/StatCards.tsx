import React, { useMemo, useState, useEffect } from 'react';
import { Building2, Trophy, LayoutGrid, Heart } from 'lucide-react';
import '../../assets/css/DashBoard/DashboardKpi.css';

interface StatCardsProps {
  features: any[];
  selectedActivity?: string;
}

const StatCards: React.FC<StatCardsProps> = ({ features, selectedActivity = 'Todos' }) => {
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const updateFavCount = () => {
      const saved = JSON.parse(localStorage.getItem('favs') || '[]');
      setFavCount(saved.length);
    };

    updateFavCount();

    window.addEventListener('favsUpdated', updateFavCount);
    window.addEventListener('storage', updateFavCount);

    return () => {
      window.removeEventListener('favsUpdated', updateFavCount);
      window.removeEventListener('storage', updateFavCount);
    };
  }, []);

  const stats = useMemo(() => {
    const total = features.length;

    const municipiosMap: Record<string, number> = {};
    features.forEach(f => {
      const m = f.properties?.municipio_nombre;
      if (m) municipiosMap[m] = (municipiosMap[m] || 0) + 1;
    });

    let maxCentros = 0;
    let municipioLider = 'Ninguno';

    Object.entries(municipiosMap).forEach(([nombre, conteo]) => {
      if (conteo > maxCentros) {
        maxCentros = conteo;
        municipioLider = nombre;
      }
    });

    const tiposUnicos = new Set(
      features
        .map(f => f.properties?.actividad_tipo)
        .filter(Boolean)
    );

    const filteredCount = selectedActivity !== 'Todos'
      ? features.filter(f => f.properties?.actividad_tipo === selectedActivity).length
      : total;

    return {
      total,
      filteredCount,
      municipioLider,
      diversidad: tiposUnicos.size,
      totalFavs: favCount,
    };
  }, [features, favCount, selectedActivity]);

  const cards = [
    {
      label: selectedActivity !== 'Todos' ? `Total de ${selectedActivity}` : 'Total de Centros',
      value: stats.filteredCount,
      icon: <Building2 size={36} aria-hidden="true" />,
      color: '#0ea5e9',
    },
    {
      label: 'Municipio Líder',
      value: stats.municipioLider,
      icon: <Trophy size={36} aria-hidden="true" />,
      color: '#e67e22',
    },
    {
      label: 'Diversidad Cultural',
      value: `${stats.diversidad} Categorías`,
      icon: <LayoutGrid size={36} aria-hidden="true" />,
      color: '#9b59b6',
    },
    {
      label: 'Favoritos Guardados',
      value: stats.totalFavs,
      icon: <Heart size={36} aria-hidden="true" />,
      color: '#ff4757',
    },
  ];

  return (
    <section
      className="kpi-grid"
      aria-label="Resumen de indicadores de centros educativos y culturales"
    >
      {cards.map((card, index) => (
        <article
          key={index}
          className="kpi-card glass"
        >
          <div className="kpi-icon" style={{ color: card.color }}>
            {card.icon}
          </div>
          <div>
            <span className="kpi-label">{card.label}</span>
            <span className="kpi-value">{card.value}</span>
          </div>
        </article>
      ))}
    </section>
  );
};

export default StatCards;
