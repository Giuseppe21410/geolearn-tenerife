import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import L from 'leaflet';
import { userLocationIcon, getIcon, getActiveLayerColor } from './utils/mapLogic';
import '../../assets/css/TenerifeMap/MapClusters.css';
import type { GeoJsonFeature, MarkerCluster } from './utils/mapTypes';

interface MapClickHandlerProps {
  onClick: () => void;
}

const MapClickHandler = ({ onClick }: MapClickHandlerProps) => {
  useMapEvents({
    click: () => onClick(),
  });
  return null;
};

const SrOnlyZoomControls = () => {
  const map = useMapEvents({});

  const panMap = (dx: number, dy: number) => {
    map.panBy([dx, dy]);
  };

  return (
    <div className="map-sr-controls" style={{ position: 'absolute', zIndex: 9999 }}>
      <button
        type="button"
        className="sr-only sr-only-focusable"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); map.zoomIn(); }}
      >
        Acercar nivel de mapa
      </button>
      <button
        type="button"
        className="sr-only sr-only-focusable"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); map.zoomOut(); }}
      >
        Alejar nivel de mapa
      </button>

      {/* Botones de Paneo SR-Only para navegación espacial del mapa */}
      <button
        type="button"
        className="sr-only sr-only-focusable"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); panMap(0, -250); }}
      >
        Mover vista del mapa hacia el Norte
      </button>
      <button
        type="button"
        className="sr-only sr-only-focusable"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); panMap(0, 250); }}
      >
        Mover vista del mapa hacia el Sur
      </button>
      <button
        type="button"
        className="sr-only sr-only-focusable"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); panMap(-250, 0); }}
      >
        Mover vista del mapa hacia el Oeste (Izquierda)
      </button>
      <button
        type="button"
        className="sr-only sr-only-focusable"
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); panMap(250, 0); }}
      >
        Mover vista del mapa hacia el Este (Derecha)
      </button>
    </div>
  );
};

interface MainMapViewProps {
  mapRef: React.MutableRefObject<L.Map | null>;
  isSatellite: boolean;
  userLocation: [number, number] | null;
  activeLayer: string;
  activityFilter: string | null;
  filteredFeatures: GeoJsonFeature[];
  selectedItemName: string | null;
  onBackgroundClick: () => void;
  onMarkerClick: (feature: GeoJsonFeature) => void;
}

const MainMapView: React.FC<MainMapViewProps> = ({
  mapRef,
  isSatellite,
  userLocation,
  activeLayer,
  activityFilter,
  filteredFeatures,
  selectedItemName,
  onBackgroundClick,
  onMarkerClick,
}) => {
  return (
    <MapContainer
      center={[28.2915, -16.6291]}
      zoom={11}
      minZoom={10}
      maxBounds={[[27.95, -16.95], [28.65, -16.05]]}
      style={{ height: '100vh', width: '100%' }}
      zoomControl={false}
      attributionControl={false}
      keyboard={true}
      ref={map => {
        if (map) mapRef.current = map;
      }}
    >
      <MapClickHandler
        onClick={onBackgroundClick}
      />
      <SrOnlyZoomControls />

      <TileLayer
        url={
          isSatellite
            ? 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        }
      />


      {userLocation && (
        <Marker
          position={userLocation}
          icon={userLocationIcon}
          zIndexOffset={1000}
          keyboard={true}
          title="Tu ubicación actual"
        >
          <Popup>¡Estás aquí!</Popup>
        </Marker>
      )}

      <MarkerClusterGroup
        key={`${activeLayer}-${activityFilter}`}
        chunkedLoading={true}
        chunkDelay={100}
        chunkInterval={200}
        removeOutsideVisibleBounds={true}
        maxClusterRadius={50}
        spiderfyOnMaxZoom={true}
        showCoverageOnHover={false}
        zoomToBoundsOnClick={true}
        disableClusteringAtZoom={18}
        iconCreateFunction={(cluster: MarkerCluster) => {
          const count = cluster.getChildCount();
          const layerColor = getActiveLayerColor(activeLayer);
          const sizeClass = count > 50 ? 'large' : count > 10 ? 'medium' : 'small';

          let nombreCapa = "centros";
          if (activeLayer === "biblioteca") nombreCapa = "bibliotecas y ludotecas";
          else if (activeLayer === "museo") nombreCapa = "museos y salas de arte";
          else if (activeLayer === "cultural") nombreCapa = "centros culturales o teatros";
          else if (activeLayer === "favoritos") nombreCapa = "centros favoritos";

          const srText = `${count} ${nombreCapa} agrupados en este sector. Pulsa para acercar y desglosarlos.`;

          return L.divIcon({
            html: `<div class="custom-cluster cluster-${sizeClass}" style="background-color: ${layerColor}ee;" title="${srText}" aria-label="${srText}" role="button" tabindex="0">
                    <span aria-hidden="true">${count}</span>
                    <span class="sr-only">${srText}</span>
                  </div>`,
            className: 'marker-cluster-custom',
            iconSize: L.point(40, 40),
          });
        }}
      >
        {filteredFeatures.map((feature, idx) => (
          <Marker
            key={`${feature.properties.nombre}-${idx}`}
            position={[
              feature.geometry.coordinates[1],
              feature.geometry.coordinates[0],
            ]}
            icon={getIcon(
              feature.properties.actividad_tipo,
              feature.properties.nombre,
              selectedItemName === feature.properties.nombre,
            )}
            keyboard={true}
            title={feature.properties.nombre}
            eventHandlers={{
              click: e => {
                L.DomEvent.stopPropagation(e);
                onMarkerClick(feature);
              },
            }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
};

export default MainMapView;
