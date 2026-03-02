export interface PlaceProperties {
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

export interface TransportStop {
  nombre: string;
  url: string;
  distance: number;
  type: 'tranvia' | 'guagua';
}

export interface GeoJsonFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: Omit<PlaceProperties, 'latitud' | 'longitud'>;
}

export type MarkerCluster = any;
