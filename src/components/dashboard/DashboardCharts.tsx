import React from 'react';
import ActivityPieChart from './ActivityPieChart';
import TopMunicipiosBarChart from './TopMunicipiosBarChart';
import '../../assets/css/DashBoard/DashboardCharts.css';

interface DashboardChartsProps {
  features: any[];
  filterMunicipio: string;
  filterTipo: string;
}

const DashboardCharts: React.FC<DashboardChartsProps> = ({
  features,
  filterMunicipio,
  filterTipo,
}) => {
  return (
    <section
      className="charts-grid"
    >
      <ActivityPieChart features={features} filterMunicipio={filterMunicipio} />
      <TopMunicipiosBarChart features={features} filterTipo={filterTipo} />
    </section>
  );
};

export default DashboardCharts;
