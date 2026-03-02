import L from 'leaflet';
import type { GeoJsonFeature } from './mapTypes.ts';


export const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div style="
            width: 20px; height: 20px; 
            background-color: #4285F4; 
            border: 3px solid white; 
            border-radius: 50%; 
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            position: relative;">
            <div style="
                position: absolute; top: -10px; left: -10px;
                width: 40px; height: 40px;
                background-color: rgba(66, 133, 244, 0.4);
                border-radius: 50%;
                animation: pulse 2s infinite;
            "></div>
           </div>
           <style>
             @keyframes pulse {
               0% { transform: scale(0.5); opacity: 1; }
               100% { transform: scale(1.5); opacity: 0; }
             }
           </style>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export const getIcon = (tipo: string, nombre: string, isSelected: boolean) => {
  let color = '#3498db';
  const typeClean = (tipo || '').toLowerCase();
  const nameClean = (nombre || '').toLowerCase();

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
            ${isSelected
        ? `<div style="width: 6px; height: 6px; background-color: ${borderColor}; border-radius: 50%;"></div>`
        : ''
      }
          </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export const getMarkerColor = (tipo: string, nombre: string): string => {
  const typeClean = (tipo || '').toLowerCase();
  const nameClean = (nombre || '').toLowerCase();
  if (typeClean.includes('museo') || nameClean.includes('museo')) return '#e74c3c';
  if (nameClean.includes('teatro') || nameClean.includes('auditorio')) return '#e67e22';
  if (typeClean.includes('biblioteca')) return '#f1c40f';
  if (typeClean.includes('cultural')) return '#9b59b6';
  return '#3498db';
};

export const getLayerFromType = (type: string): string => {
  const t = type.toLowerCase();
  if (t.includes('museo')) return 'museo';
  if (t.includes('teatro') || t.includes('auditorio')) return 'teatro';
  if (t.includes('biblioteca') || t.includes('ludoteca')) return 'biblioteca';
  if (t.includes('cultural')) return 'cultural';
  return 'otros';
};

export const findLayerForItem = (feature: GeoJsonFeature): string => {
  const tipo = (feature.properties.actividad_tipo || '').toLowerCase();
  const nombre = (feature.properties.nombre || '').toLowerCase();
  if (tipo.includes('museo') || nombre.includes('museo')) return 'museo';
  if (nombre.includes('teatro') || nombre.includes('auditorio')) return 'teatro';
  if (tipo.includes('biblioteca') || tipo.includes('ludoteca')) return 'biblioteca';
  if (tipo.includes('cultural')) return 'cultural';
  return 'otros';
};

export const getActiveLayerColor = (activeLayer: string): string => {
  switch (activeLayer) {
    case 'museo':
      return '#e74c3c';
    case 'teatro':
      return '#e67e22';
    case 'biblioteca':
      return '#f1c40f';
    case 'cultural':
      return '#9b59b6';
    case 'favoritos':
      return '#f1c40f';
    default:
      return '#3498db';
  }
};

export const filterFeatures = (
  features: GeoJsonFeature[],
  activeLayer: string,
  activityFilter: string | null,
  favNames: string[],
): GeoJsonFeature[] => {
  return features.filter(feature => {
    if (activityFilter) {
      const featType = (feature.properties.actividad_tipo || '').toLowerCase();
      const filterType = activityFilter.toLowerCase();
      return featType.includes(filterType) || filterType.includes(featType);
    }
    const tipo = (feature.properties.actividad_tipo || '').toLowerCase();
    const nombre = (feature.properties.nombre || '').toLowerCase();

    if (activeLayer === 'favoritos') {
      return favNames.some(fav => fav.trim() === feature.properties.nombre.trim());
    }
    if (activeLayer === 'otros') {
      return (
        !tipo.includes('museo') &&
        !nombre.includes('museo') &&
        !nombre.includes('teatro') &&
        !nombre.includes('auditorio') &&
        !tipo.includes('biblioteca') &&
        !tipo.includes('ludoteca') &&
        !tipo.includes('cultural')
      );
    }
    if (activeLayer === 'museo') return tipo.includes('museo') || nombre.includes('museo');
    if (activeLayer === 'teatro')
      return nombre.includes('teatro') || nombre.includes('auditorio');
    if (activeLayer === 'biblioteca')
      return tipo.includes('biblioteca') || tipo.includes('ludoteca');
    if (activeLayer === 'cultural') return tipo.includes('cultural');
    return true;
  });
};

