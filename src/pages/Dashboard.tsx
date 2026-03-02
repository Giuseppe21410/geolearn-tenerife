import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Map, MapPin, Activity, ArrowLeft } from 'lucide-react';
import MunicipioComparator from '../components/dashboard/MunicipioComparator';
import Logo from '../assets/img/logo-data-hub.webp';
import StatCards from '../components/dashboard/StatCards';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import CustomSelect from '../components/common/CustomSelect';
import CenterDetailsTable from '../components/dashboard/CenterDetailsTable';
import '../assets/css/DashBoard/DashboardBase.css';
import '../assets/css/Tooltip.css';
import Footer from '../components/home/Footer';

const Dashboard: React.FC = () => {
  const [features, setFeatures] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [filterMunicipio, setFilterMunicipio] = useState('Todos');
  const [filterTipo, setFilterTipo] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadDataFromLocal = async () => {
      try {
        const response = await fetch('/data/centros-educativos-y-culturales.geojson');
        if (!response.ok) {
          throw new Error('No se pudo cargar el GeoJSON local de centros');
        }
        const geojsonData = await response.json();
        setFeatures(geojsonData.features || []);
      } catch (err) {
        setError("Error al cargar los datos");
        console.error(err);
      }
    };
    loadDataFromLocal();
  }, []);

  const municipiosUnicos = useMemo(() => {
    return Array.from(new Set(features.map(f => f.properties?.municipio_nombre).filter(Boolean))).sort();
  }, [features]);

  const tiposUnicos = useMemo(() => {
    return Array.from(new Set(features.map(f => f.properties?.actividad_tipo).filter(Boolean))).sort();
  }, [features]);

  const listaTotalFiltrada = useMemo(() => {
    return features.filter(f => {
      const p = f.properties || {};
      const matchMun = filterMunicipio === 'Todos' || p.municipio_nombre === filterMunicipio;
      const matchTip = filterTipo === 'Todos' || p.actividad_tipo === filterTipo;
      const matchBus = p.nombre?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchMun && matchTip && matchBus;
    });
  }, [features, filterMunicipio, filterTipo, searchTerm]);

  if (error) return <div className="error-screen">{error}</div>;

  return (
    <>
      <div className="dashboard-container">
        <header className="dashboard-header" role="banner">
          <div className="header-left">
            <Link to="/" className="exit-button" role="button" aria-label="Volver a la página de inicio">
              <ArrowLeft color='black' />
            </Link>
            <img src={Logo} alt="Logo de GeoLearn Tenerife" className="logo-header" />
            <Link
              to="/mapa"
              className="gps-button icon-button-tooltip tooltip-left"
              role="button"
              aria-label="Ejecutar y ver mapa interactivo de centros"
              data-label="Mapa Interactivo"
            >
              <Map size={28} color='black' />
            </Link>
          </div>
          <div className="group-control" role="search" aria-label="Filtros globales del panel">
            <CustomSelect
              value={filterMunicipio}
              onChange={setFilterMunicipio}
              options={municipiosUnicos}
              icon={MapPin}
              defaultLabel="Todos los Municipios"
            />
            <CustomSelect
              value={filterTipo}
              onChange={setFilterTipo}
              options={tiposUnicos}
              icon={Activity}
              defaultLabel="Todos los Tipos"
            />
          </div>
        </header>

        <StatCards
          features={features}
          selectedActivity={filterTipo}
        />

        <DashboardCharts
          features={features}
          filterMunicipio={filterMunicipio}
          filterTipo={filterTipo}
        />

        <main className="dashboard-main-content" id="main-content" aria-label="Contenido principal de la tabla">
          <CenterDetailsTable
            data={listaTotalFiltrada}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />
        </main>
        <MunicipioComparator features={features} />

      </div>
      <Footer />
    </>
  );
};

export default Dashboard;
