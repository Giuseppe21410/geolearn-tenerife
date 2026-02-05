import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import InfoPanel from './InfoPanel.tsx';
import LayerSelector from './LayerSelector.tsx';
import MapLegend from './MapLegend.tsx';
import MapSearch from './MapSearch.tsx';
import '../assets/css/TenerifeMap.css';
import { Link } from 'react-router-dom';
import ExitIcon from '../assets/img/icons/arrow-left.svg';

// --- Interfaces ---
interface PlaceProperties {
  nombre: string;
  actividad_tipo: string;
  municipio_nombre: string;
  direccion_nombre_via: string;
  direccion_numero: string;
  telefono?: string;
  web?: string;
  latitud: number;
  longitud: number;
}

interface GeoJsonFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: Omit<PlaceProperties, 'latitud' | 'longitud'>;
}

type MarkerCluster = any;

// --- Helper para clicks en el mapa ---
const MapClickHandler = ({ onClick }: { onClick: () => void }) => {
  useMapEvents({
    click: () => onClick(),
  });
  return null;
};

// --- Generador de Iconos Personalizados ---
const getIcon = (tipo: string, nombre: string, isSelected: boolean) => {
  let color = '#3498db'; 
  const typeClean = (tipo || "").toLowerCase();
  const nameClean = (nombre || "").toLowerCase();

  if (typeClean.includes('museo') || nameClean.includes('museo')) color = '#e74c3c'; 
  else if (nameClean.includes('teatro') || nameClean.includes('auditorio')) color = '#e67e22'; 
  else if (typeClean.includes('biblioteca') || typeClean.includes('ludoteca')) color = '#f1c40f'; 
  else if (typeClean.includes('cultural')) color = '#9b59b6'; 

  const backgroundColor = isSelected ? '#ffffff' : color;
  const borderColor = isSelected ? color : '#ffffff';
  const size = isSelected ? 22 : 18; 
  const borderSize = isSelected ? 4 : 2;
  const shadow = isSelected ? `0 0 15px ${color}aa` : '0 0 8px rgba(0,0,0,0.4)';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
            background-color: ${backgroundColor}; 
            width: ${size}px; height: ${size}px; 
            border-radius: 50%; border: ${borderSize}px solid ${borderColor}; 
            box-shadow: ${shadow}; transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex; align-items: center; justify-content: center;
            ${isSelected ? 'transform: scale(1.2); z-index: 1000;' : ''}
          ">
            ${isSelected ? `<div style="width: 6px; height: 6px; background-color: ${borderColor}; border-radius: 50%;"></div>` : ''}
          </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

const TenerifeMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const [features, setFeatures] = useState<GeoJsonFeature[]>([]);
  const [selectedItem, setSelectedItem] = useState<PlaceProperties | null>(null);
  const [isSatellite, setIsSatellite] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<string>('otros');
  const [favNames, setFavNames] = useState<string[]>([]);

  // Estados de Búsqueda y Filtro Maestro
  const [searchResults, setSearchResults] = useState<GeoJsonFeature[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [activityFilter, setActivityFilter] = useState<string | null>(null);

  // --- Lógica de Colores para el Panel (Recuperada) ---
  const getMarkerColor = (tipo: string, nombre: string): string => {
    const typeClean = (tipo || "").toLowerCase();
    const nameClean = (nombre || "").toLowerCase();
    if (typeClean.includes('museo') || nameClean.includes('museo')) return '#e74c3c';
    if (nameClean.includes('teatro') || nameClean.includes('auditorio')) return '#e67e22';
    if (typeClean.includes('biblioteca')) return '#f1c40f';
    if (typeClean.includes('cultural')) return '#9b59b6';
    return '#3498db';
  };

  const updateFavs = useCallback(() => {
    const savedFavs = JSON.parse(localStorage.getItem('favs') || '[]');
    setFavNames(savedFavs);
  }, []);

  useEffect(() => {
    window.addEventListener('storage', updateFavs);
    updateFavs();
    const geojsonUrl = 'https://datos.tenerife.es/ckan/api/action/package_show?id=573a49e8-e2fb-4fe4-b47b-ac5dec1bf580';
    fetch(geojsonUrl)
      .then(res => res.json())
      .then(apiData => {
        const resource = apiData.result.resources.find((r: any) => r.format.toLowerCase() === 'geojson');
        return fetch(resource.url);
      })
      .then(res => res.json())
      .then(geoJsonData => setFeatures(geoJsonData.features))
      .catch(err => console.error("Error cargando GeoJSON:", err));

    return () => window.removeEventListener('storage', updateFavs);
  }, [updateFavs]);

  // Determinar capa según tipo (Sincronización visual)
  const findLayerForItem = (feature: GeoJsonFeature): string => {
    const tipo = (feature.properties.actividad_tipo || "").toLowerCase();
    const nombre = (feature.properties.nombre || "").toLowerCase();
    if (tipo.includes('museo') || nombre.includes('museo')) return 'museo';
    if (nombre.includes('teatro') || nombre.includes('auditorio')) return 'teatro';
    if (tipo.includes('biblioteca') || tipo.includes('ludoteca')) return 'biblioteca';
    if (tipo.includes('cultural')) return 'cultural';
    return 'otros';
  };

  const handleSearchResult = (results: GeoJsonFeature[], isActivitySearch: boolean, activityName?: string) => {
    if (!mapRef.current || results.length === 0) return;

    if (isActivitySearch) {
      // FILTRO POR ACTIVIDAD (Categoría)
      setActivityFilter(activityName || null);
      
      // Sincronizamos la capa visual con el tipo de actividad buscado
      const targetLayer = findLayerForItem(results[0]);
      setActiveLayer(targetLayer);
      
      setSearchResults([]); 
      setSelectedItem(null);
      mapRef.current.flyTo([28.2915, -16.6291], 10, { animate: true, duration: 1.5 });
    } else {
      // BUSQUEDA POR NOMBRE
      setActivityFilter(null);
      setSearchResults(results);
      setCurrentResultIndex(0);
      focusOnFeature(results[0]);
    }
  };

  const focusOnFeature = (feature: GeoJsonFeature) => {
    const targetLayer = findLayerForItem(feature);
    setActiveLayer(targetLayer);
    const { coordinates } = feature.geometry;
    mapRef.current?.flyTo([coordinates[1], coordinates[0]], 17, { animate: true });
    setSelectedItem({
      ...feature.properties,
      latitud: coordinates[1],
      longitud: coordinates[0]
    });
  };

  const getActiveLayerColor = () => {
    switch (activeLayer) {
      case 'museo': return '#e74c3c';
      case 'teatro': return '#e67e22';
      case 'biblioteca': return '#f1c40f';
      case 'cultural': return '#9b59b6';
      case 'favoritos': return '#f1c40f'; 
      default: return '#3498db';
    }
  };

  const filteredFeatures = features.filter(feature => {
    if (activityFilter) {
      return feature.properties.actividad_tipo === activityFilter;
    }

    const tipo = (feature.properties.actividad_tipo || "").toLowerCase();
    const nombre = (feature.properties.nombre || "").toLowerCase();

    if (activeLayer === 'favoritos') return favNames.some(fav => fav.trim() === feature.properties.nombre.trim());
    if (activeLayer === 'otros') {
      return !tipo.includes('museo') && !nombre.includes('museo') &&
             !nombre.includes('teatro') && !nombre.includes('auditorio') &&
             !tipo.includes('biblioteca') && !tipo.includes('ludoteca') &&
             !tipo.includes('cultural');
    }
    if (activeLayer === 'museo') return tipo.includes('museo') || nombre.includes('museo');
    if (activeLayer === 'teatro') return nombre.includes('teatro') || nombre.includes('auditorio');
    if (activeLayer === 'biblioteca') return tipo.includes('biblioteca') || tipo.includes('ludoteca');
    if (activeLayer === 'cultural') return tipo.includes('cultural');
    return true;
  });

  return (
    <div className="map-page-container">      
      <MapLegend isPanelOpen={!!selectedItem} />
      
      <div className={`map-wrapper ${selectedItem ? 'with-panel' : ''}`}>
        <MapContainer 
          center={[28.2915, -16.6291]} zoom={11} minZoom={10} 
          maxBounds={[[27.95, -16.95], [28.65, -16.05]]} 
          style={{ height: "100vh", width: "100%" }}
          zoomControl={false} attributionControl={false}
          ref={(map) => { if (map) mapRef.current = map; }}
        >
          <MapClickHandler onClick={() => { setSelectedItem(null); setSearchResults([]); }} />
          
          <TileLayer url={isSatellite 
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} 
          />

          <ZoomControl position="bottomleft" />

          <MarkerClusterGroup
            key={`${activeLayer}-${activityFilter}`} 
            chunkedLoading
            maxClusterRadius={50}
            iconCreateFunction={(cluster: MarkerCluster) => {
              const count = cluster.getChildCount();
              const layerColor = getActiveLayerColor();
              let sizeClass = count > 50 ? 'large' : count > 10 ? 'medium' : 'small';
              return L.divIcon({
                html: `<div class="custom-cluster cluster-${sizeClass}" style="background-color: ${layerColor}ee;">
                        <span>${count}</span>
                      </div>`,
                className: 'marker-cluster-custom',
                iconSize: L.point(40, 40),
              });
            }}
          >
            {filteredFeatures.map((feature, idx) => (
              <Marker 
                key={`${feature.properties.nombre}-${idx}`}
                position={[feature.geometry.coordinates[1], feature.geometry.coordinates[0]]} 
                icon={getIcon(feature.properties.actividad_tipo, feature.properties.nombre, selectedItem?.nombre === feature.properties.nombre)}
                eventHandlers={{
                  click: (e) => {
                    L.DomEvent.stopPropagation(e);
                    focusOnFeature(feature);
                  },
                }}
              />
            ))}
          </MarkerClusterGroup>
        </MapContainer>

        {activityFilter && (
          <div className="active-filter-badge">
            Mostrando: <strong>{activityFilter}</strong>
            <button onClick={() => setActivityFilter(null)}>✕</button>
          </div>
        )}

        <LayerSelector 
            activeLayer={activeLayer} 
            onLayerChange={(layer) => { 
                setActiveLayer(layer); 
                setActivityFilter(null); 
            }} 
        />

        <div className="custom-map-controls">
            <div className={`view-toggle-btn ${isSatellite ? 'mode-sat' : 'mode-map'}`} onClick={() => setIsSatellite(!isSatellite)}>
                <div className="view-toggle-label">{isSatellite ? 'Mapa' : 'Satélite'}</div>
            </div>
        </div>
      </div>

      {selectedItem && (
        <InfoPanel 
          selectedItem={selectedItem} 
          onClose={() => { setSelectedItem(null); setSearchResults([]); }}
          // Restaurada lógica de color dinámico para el InfoPanel
          markerColor={getMarkerColor(selectedItem.actividad_tipo, selectedItem.nombre)}
        />
      )}

      {searchResults.length > 1 && (
        <div className="search-navigation">
          <button onClick={() => {
            const nextIdx = (currentResultIndex + 1) % searchResults.length;
            setCurrentResultIndex(nextIdx);
            focusOnFeature(searchResults[nextIdx]);
          }}>
            Siguiente ({currentResultIndex + 1} de {searchResults.length})
          </button>
        </div>
      )}

      <div className='left-top-buttons'>
        <Link to="/" className="exit-button">
          <img src={ExitIcon} alt="Volver" />
        </Link>
        <MapSearch features={features} onResultFound={handleSearchResult} />
      </div>
    </div>
  );
};

export default TenerifeMap;