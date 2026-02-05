import React, { useState, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, ZoomControl, useMapEvents } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'; 
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import InfoPanel from './InfoPanel.tsx';
import LayerSelector from './LayerSelector.tsx';
import MapLegend from './MapLegend.tsx';
import '../assets/css/TenerifeMap.css';
import { Link } from 'react-router-dom';
import ExitIcon from '../assets/img/icons/arrow-left.svg';

// Interfaces para tipado robusto
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

const MapClickHandler = ({ onClick }: { onClick: () => void }) => {
  useMapEvents({
    click: () => onClick(),
  });
  return null;
};

const getIcon = (tipo: string, nombre: string, isSelected: boolean) => {
  let color = '#3498db'; 
  const typeClean = (tipo || "").toLowerCase();
  const nameClean = (nombre || "").toLowerCase();

  if (typeClean.includes('museo') || nameClean.includes('museo')) {
    color = '#e74c3c'; 
  } else if (nameClean.includes('teatro') || nameClean.includes('auditorio')) {
    color = '#e67e22'; 
  } else if (typeClean.includes('biblioteca') || typeClean.includes('ludoteca')) {
    color = '#f1c40f'; 
  } else if (typeClean.includes('cultural')) {
    color = '#9b59b6'; 
  }

  const backgroundColor = isSelected ? '#ffffff' : color;
  const borderColor = isSelected ? color : '#ffffff';
  const size = isSelected ? 28 : 21; 
  const borderSize = isSelected ? 4 : 2;
  const shadow = isSelected ? `0 0 15px ${color}aa` : '0 0 8px rgba(0,0,0,0.4)';

  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
            background-color: ${backgroundColor}; 
            width: ${size}px; 
            height: ${size}px; 
            border-radius: 50%; 
            border: ${borderSize}px solid ${borderColor}; 
            box-shadow: ${shadow};
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            display: flex;
            align-items: center;
            justify-content: center;
            ${isSelected ? 'transform: scale(1.2); z-index: 1000;' : ''}
          ">
            ${isSelected ? `<div style="width: 6px; height: 6px; background-color: ${borderColor}; border-radius: 50%;"></div>` : ''}
          </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2]
  });
};

const TenerifeMap: React.FC = () => {
  const [features, setFeatures] = useState<GeoJsonFeature[]>([]);
  const [selectedItem, setSelectedItem] = useState<PlaceProperties | null>(null);
  const [isSatellite, setIsSatellite] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<string>('otros');
  const [favNames, setFavNames] = useState<string[]>([]);

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

  // Función para obtener el color dinámico del cluster según la capa
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

  const getMarkerColor = (tipo: string, nombre: string): string => {
    const typeClean = (tipo || "").toLowerCase();
    const nameClean = (nombre || "").toLowerCase();
    if (typeClean.includes('museo') || nameClean.includes('museo')) return '#e74c3c';
    if (nameClean.includes('teatro') || nameClean.includes('auditorio')) return '#e67e22';
    if (typeClean.includes('biblioteca')) return '#f1c40f';
    if (typeClean.includes('cultural')) return '#9b59b6';
    return '#3498db';
  };

  const filteredFeatures = features.filter(feature => {
    const tipo = (feature.properties.actividad_tipo || "").toLowerCase();
    const nombre = (feature.properties.nombre || "").toLowerCase();

    if (activeLayer === 'favoritos') {
        return favNames.some(fav => fav.trim() === feature.properties.nombre.trim());
    }
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
        >
          <MapClickHandler onClick={() => setSelectedItem(null)} />
          
          <TileLayer url={isSatellite 
            ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
            : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"} 
          />

          <ZoomControl position="bottomleft" />

          {/* Sincronización del color del Cluster con la capa activa */}
          <MarkerClusterGroup
            key={activeLayer} // Forzamos re-render para actualizar el color de los iconos
            chunkedLoading
            maxClusterRadius={50}
            iconCreateFunction={(cluster: MarkerCluster) => {
              const count = cluster.getChildCount();
              const layerColor = getActiveLayerColor();
              
              let sizeClass = 'small';
              if (count > 10) sizeClass = 'medium';
              if (count > 50) sizeClass = 'large';

              return L.divIcon({
                html: `<div class="custom-cluster cluster-${sizeClass}" style="background-color: ${layerColor}ee;">
                        <span>${count}</span>
                      </div>`,
                className: 'marker-cluster-custom',
                iconSize: L.point(40, 40),
              });
            }}
          >
            {filteredFeatures.map((feature, idx) => {
              const isSelected = selectedItem?.nombre === feature.properties.nombre;
              const { coordinates } = feature.geometry;

              return (
                <Marker 
                  key={`${activeLayer}-${feature.properties.nombre}-${idx}`}
                  position={[coordinates[1], coordinates[0]]} 
                  icon={getIcon(feature.properties.actividad_tipo, feature.properties.nombre, isSelected)}
                  eventHandlers={{
                    click: (e) => {
                      L.DomEvent.stopPropagation(e);
                      const map = e.target._map;
                      map.setView([coordinates[1], coordinates[0]], 16, { animate: true });
                      setSelectedItem({
                        ...feature.properties,
                        latitud: coordinates[1],
                        longitud: coordinates[0]
                      });
                    },
                  }}
                />
              );
            })}
          </MarkerClusterGroup>
        </MapContainer>

        <LayerSelector activeLayer={activeLayer} onLayerChange={setActiveLayer} />

        <div className="custom-map-controls">
            <div 
                className={`view-toggle-btn ${isSatellite ? 'mode-sat' : 'mode-map'}`}
                onClick={() => setIsSatellite(!isSatellite)}
            >
                <div className="view-toggle-label">{isSatellite ? 'Mapa' : 'Satélite'}</div>
            </div>
        </div>
      </div>

      {selectedItem && (
          <InfoPanel 
            selectedItem={selectedItem} 
            onClose={() => { setSelectedItem(null); updateFavs(); }}
            markerColor={getMarkerColor(selectedItem.actividad_tipo, selectedItem.nombre)}
          />
        )}
        
      <div className='exit-button-container'>
        <Link to="/" className="exit-button">
          <img src={ExitIcon} alt="Volver al menú principal." />
        </Link>
      </div>
    </div>
  );
};

export default TenerifeMap;