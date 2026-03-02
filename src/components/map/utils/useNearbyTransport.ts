import { useEffect, useState } from 'react';
import type { PlaceProperties, TransportStop } from './mapTypes.ts';

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

export const useNearbyTransport = (selectedItem: PlaceProperties) => {
  const [nearbyTransport, setNearbyTransport] = useState<TransportStop[]>([]);

  useEffect(() => {
    const fetchTransport = async () => {
      try {
        const [tranviaRes, guaguaRes] = await Promise.all([
          fetch('/data/paradas-tranvia.geojson'),
          fetch('/data/paradas-guaguas.geojson'),
        ]);

        if (!tranviaRes.ok || !guaguaRes.ok) {
          throw new Error('No se pudieron cargar los GeoJSON locales de transporte');
        }

        const tranviaData = await tranviaRes.json();
        const guaguaData = await guaguaRes.json();

        const allStops: TransportStop[] = [];

        const processFeatures = (features: any[], type: TransportStop['type']) => {
          features.forEach((f: any) => {
            const dist = getDistance(
              selectedItem.latitud,
              selectedItem.longitud,
              f.geometry.coordinates[1],
              f.geometry.coordinates[0],
            );
            allStops.push({
              nombre: f.properties.parada_nombre || 'Parada',
              url: f.properties.parada_url || '#',
              distance: dist,
              type,
            });
          });
        };

        if (tranviaData.features && Array.isArray(tranviaData.features)) {
          processFeatures(tranviaData.features, 'tranvia');
        }
        if (guaguaData.features && Array.isArray(guaguaData.features)) {
          processFeatures(guaguaData.features, 'guagua');
        }

        setNearbyTransport(
          allStops.sort((a, b) => a.distance - b.distance).slice(0, 4),
        );
      } catch (err) {
        console.error('Error cargando transporte local:', err);
      }
    };

    fetchTransport();
  }, [selectedItem]);

  return nearbyTransport;
};

