import { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';
import { useSearchParams } from 'react-router-dom';
import { getLayerFromType, findLayerForItem, filterFeatures } from './mapLogic.ts';
import { formatTitleCase, normalizeActivityQuery, KNOWN_NORMALIZED_TYPES } from '../../../utils/Textutils.ts';
import { isLocationInTenerife } from '../../../utils/GeolocationUtils.ts';
import type { PlaceProperties, GeoJsonFeature } from './mapTypes.ts';

interface UseTenerifeMapControllerResult {
  features: GeoJsonFeature[];
  selectedItem: PlaceProperties | null;
  isSatellite: boolean;
  activeLayer: string;
  favNames: string[];
  searchResults: GeoJsonFeature[];
  currentResultIndex: number;
  activityFilter: string | null;
  userLocation: [number, number] | null;
  notification: string | null;
  successNotification: string | null;
  filteredFeatures: GeoJsonFeature[];
  setIsSatellite: (value: boolean) => void;
  setActiveLayer: (value: string) => void;
  setActivityFilter: (value: string | null) => void;
  clearSelectedItem: () => void;
  handleLocateUser: () => void;
  handleSearchResult: (
    results: GeoJsonFeature[],
    isActivitySearch: boolean,
    activityName?: string,
  ) => void;
  focusOnFeature: (feature: GeoJsonFeature) => void;
  nextSearchResult: () => void;
}

export const useTenerifeMapController = (
  mapRef: React.MutableRefObject<L.Map | null>,
): UseTenerifeMapControllerResult => {
  const [features, setFeatures] = useState<GeoJsonFeature[]>([]);
  const [selectedItem, setSelectedItem] = useState<PlaceProperties | null>(null);
  const [isSatellite, setIsSatellite] = useState<boolean>(false);
  const [activeLayer, setActiveLayer] = useState<string>('otros');
  const [favNames, setFavNames] = useState<string[]>([]);

  const [searchResults, setSearchResults] = useState<GeoJsonFeature[]>([]);
  const [currentResultIndex, setCurrentResultIndex] = useState(0);
  const [activityFilter, setActivityFilter] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [successNotification, setSuccessNotification] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  const updateFavs = useCallback(() => {
    const savedFavs = JSON.parse(localStorage.getItem('favs') || '[]');
    setFavNames(savedFavs);
  }, []);

  const handleLocateUser = () => {
    if (!navigator.geolocation) {
      setNotification('Tu navegador no soporta geolocalización.');
      setTimeout(() => setNotification(null), 3000);
      return;
    }

    setNotification('Buscando tu ubicación...');

    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude } = position.coords;

        if (!isLocationInTenerife(latitude, longitude)) {
          setNotification('No estás en Tenerife. El mapa se centra solo en la isla.');
          setTimeout(() => setNotification(null), 4000);
          return;
        }

        setUserLocation([latitude, longitude]);
        setNotification(null);

        if (mapRef.current) {
          mapRef.current.flyTo([latitude, longitude], 15, {
            animate: true,
            duration: 1.5,
          });
        }
      },
      error => {
        console.error(error);
        setNotification('No se pudo obtener tu ubicación. Revisa los permisos.');
        setTimeout(() => setNotification(null), 4000);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 }
    );
  };

  useEffect(() => {
    const tema = searchParams.get('tema');
    const busqueda = searchParams.get('busqueda');
    const latParam = searchParams.get('lat');
    const lngParam = searchParams.get('lng');

    if (latParam && lngParam) {
      const lat = parseFloat(latParam);
      const lng = parseFloat(lngParam);
      if (!Number.isNaN(lat) && !Number.isNaN(lng)) {
        setUserLocation([lat, lng]);
        if (mapRef.current) {
          setTimeout(() => {
            mapRef.current?.flyTo([lat, lng], 15, {
              animate: true,
              duration: 2,
            });
          }, 500);
        }
      }
      return;
    }

    if (tema) {
      setActivityFilter(tema);
      setActiveLayer(getLayerFromType(tema));
      setSearchResults([]);
      setSelectedItem(null);
      // Success notification for type search from landing page
      const label = formatTitleCase(tema.replace(/ /g, ' '));
      setSuccessNotification(`Mostrando "${label}"`);
      setTimeout(() => setSuccessNotification(null), 4000);
      return;
    }

    if (busqueda && features.length > 0) {
      setActivityFilter(null);
      const term = busqueda.toLowerCase();

      const wordMatches = (text: string, word: string) =>
        text.split(/[\s/(),.-]+/).some(w => w === word);
      const queryWords = term.split(/\s+/).filter(Boolean);
      const normalized = normalizeActivityQuery(term).toLowerCase();
      const isKnownType = KNOWN_NORMALIZED_TYPES.has(normalized);

      const nameMatches = features.filter(f => {
        const nombre = (f.properties.nombre || '').toLowerCase();
        return queryWords.every(qw => wordMatches(nombre, qw));
      });

      const isExactCategory = term === normalized;
      const isSingleWord = queryWords.length === 1;

      if (isKnownType && (isSingleWord || isExactCategory || nameMatches.length === 0)) {
        const activityMatches = features.filter(f => {
          const tipo = (f.properties.actividad_tipo || '').toLowerCase();
          return tipo === normalized || queryWords.every(qw => wordMatches(tipo, qw));
        });

        if (activityMatches.length > 0) {
          const officialName = activityMatches[0].properties.actividad_tipo;
          setActivityFilter(officialName);
          setActiveLayer(getLayerFromType(officialName));
          setSearchResults([]);
          setSelectedItem(null);
          mapRef.current?.flyTo([28.2915, -16.6291], 10, { animate: true, duration: 1.5 });
          setSuccessNotification(`Mostrando "${formatTitleCase(officialName)}"`);
          setTimeout(() => setSuccessNotification(null), 4000);
          return;
        }
      }

      if (nameMatches.length > 0) {
        setSearchResults(nameMatches);
        setCurrentResultIndex(0);
        focusOnFeature(nameMatches[0]);
        return;
      }

      const finalActivityMatches = features.filter(f => {
        const tipo = (f.properties.actividad_tipo || '').toLowerCase();
        return tipo === normalized;
      });

      if (finalActivityMatches.length > 0) {
        const officialName = finalActivityMatches[0].properties.actividad_tipo;
        setActivityFilter(officialName);
        setActiveLayer(getLayerFromType(officialName));
        setSearchResults([]);
        setSelectedItem(null);
        mapRef.current?.flyTo([28.2915, -16.6291], 10, { animate: true, duration: 1.5 });
        setSuccessNotification(`Mostrando "${formatTitleCase(officialName)}"`);
        setTimeout(() => setSuccessNotification(null), 4000);
        return;
      }

      const nameFallback = features.filter(f => {
        const nombre = (f.properties.nombre || '').toLowerCase();
        return queryWords.every(qw => wordMatches(nombre, qw));
      });

      if (nameFallback.length > 0) {
        setSearchResults(nameFallback);
        setCurrentResultIndex(0);
        focusOnFeature(nameFallback[0]);
        return;
      }

      setSearchResults([]);
      setNotification(`No se encontraron resultados para "${busqueda}"`);
      setTimeout(() => setNotification(null), 4000);
    }
  }, [searchParams, features]);

  useEffect(() => {
    window.addEventListener('storage', updateFavs);
    updateFavs();

    const loadLocalGeoJson = async () => {
      try {
        const res = await fetch('/data/centros-educativos-y-culturales.geojson');
        if (!res.ok) {
          throw new Error('No se pudo cargar el GeoJSON local de centros');
        }
        const geoJsonData = await res.json();
        setFeatures(geoJsonData.features || []);
      } catch (err) {
        console.error('Error cargando GeoJSON local:', err);
        setNotification('Error cargando los datos del mapa.');
      }
    };

    loadLocalGeoJson();

    return () => window.removeEventListener('storage', updateFavs);
  }, [updateFavs]);

  const focusOnFeature = (feature: GeoJsonFeature) => {
    const targetLayer = findLayerForItem(feature);
    setActiveLayer(targetLayer);
    const { coordinates } = feature.geometry;
    mapRef.current?.flyTo([coordinates[1], coordinates[0]], 17, {
      animate: true,
      duration: 1.5,
    });
    setSelectedItem({
      ...feature.properties,
      latitud: coordinates[1],
      longitud: coordinates[0],
    });
  };

  const handleSearchResult = (
    results: GeoJsonFeature[],
    isActivitySearch: boolean,
    activityName?: string,
  ) => {
    if (!mapRef.current || results.length === 0) return;

    if (isActivitySearch) {
      setActivityFilter(activityName || null);
      setActiveLayer(getLayerFromType(activityName || ''));
      setSearchResults([]);
      setSelectedItem(null);
      mapRef.current.flyTo([28.2915, -16.6291], 10, {
        animate: true,
        duration: 1.5,
      });
      const label = formatTitleCase(activityName || '');
      setSuccessNotification(`Mostrando "${label}"`);
      setTimeout(() => setSuccessNotification(null), 4000);
    } else {
      setActivityFilter(null);
      setSearchResults(results);
      setCurrentResultIndex(0);
      focusOnFeature(results[0]);
    }
  };

  const nextSearchResult = () => {
    if (searchResults.length === 0) return;
    const nextIdx = (currentResultIndex + 1) % searchResults.length;
    setCurrentResultIndex(nextIdx);
    focusOnFeature(searchResults[nextIdx]);
  };

  const filteredFeatures = filterFeatures(features, activeLayer, activityFilter, favNames);

  const clearSelectedItem = () => {
    setSelectedItem(null);
    setSearchResults([]);
  };

  return {
    features,
    selectedItem,
    isSatellite,
    activeLayer,
    favNames,
    searchResults,
    currentResultIndex,
    activityFilter,
    userLocation,
    notification,
    successNotification,
    filteredFeatures,
    setIsSatellite,
    setActiveLayer,
    setActivityFilter,
    clearSelectedItem,
    handleLocateUser,
    handleSearchResult,
    focusOnFeature,
    nextSearchResult,
  };
};

