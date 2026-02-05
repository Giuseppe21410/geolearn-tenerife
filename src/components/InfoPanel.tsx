import React, { useState, useEffect } from 'react';
import '../assets/css/InfoPanel.css';
import starSolidIcon from '../assets/img/icons/star-solid.svg';
import starIcon from '../assets/img/icons/star.svg';
import closeIcon from '../assets/img/icons/x.svg';
import Globe from '../assets/img/icons/globe.svg';
import Phone from '../assets/img/icons/phone.svg';
import ExternalLink from '../assets/img/icons/share.svg';
import Map from '../assets/img/icons/map.svg';
import Info from '../assets/img/icons/info.svg';
import TranviaImg from '../assets/img/icons/bus.jpg';
import BusImg from '../assets/img/icons/tram.jpg';


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

interface TransportStop {
  nombre: string;
  url: string;
  distance: number;
  type: 'tranvia' | 'guagua';
}

interface InfoPanelProps {
  selectedItem: PlaceProperties;
  onClose: () => void;
  markerColor: string;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ selectedItem, onClose, markerColor }) => {
  const [favorites, setFavorites] = useState<string[]>(() => 
    JSON.parse(localStorage.getItem('favs') || '[]')
  );
  const [nearbyTransport, setNearbyTransport] = useState<TransportStop[]>([]);

  const isFavorite = favorites.includes(selectedItem.nombre);

  const toggleFavorite = () => {
    const updated = isFavorite 
      ? favorites.filter(f => f !== selectedItem.nombre) 
      : [...favorites, selectedItem.nombre];
    setFavorites(updated);
    localStorage.setItem('favs', JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  };

    const sharePage = async () => {
    const shareData = {
        title: selectedItem.nombre,
        text: `Mira este lugar en Tenerife: ${selectedItem.nombre}`,
        url: window.location.href, // O una URL personalizada con el ID del lugar
    };

    try {
        // Si el navegador soporta compartir nativamente (móviles)
        if (navigator.share) {
        await navigator.share(shareData);
        } else {
        // Si es PC, copiamos al portapapeles
        alert("¡Enlace copiado al portapapeles!");
        await navigator.share(shareData);
        }
    } catch (err) {
        console.error("Error al compartir:", err);
    }
    };

  const normalizeText = (text: string): string => {
    if (!text) return "";
    if (text == "museos salas de arte") return "Museos y Salas de arte";
    if (text == "biblioteca ludoteca") return "Biblioteca y Ludoteca";
    if (text == "guarderias centros infantiles") return "Guarderías y Centros infantiles";
    const preposiciones = ["de", "del", "la", "las", "el", "los", "en", "y", "a"];
    return text.toLowerCase().split(' ').map((word, index) => 
      (preposiciones.includes(word) && index !== 0) ? word : word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; 
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  };

  useEffect(() => {
    const fetchTransport = async () => {
      const apiIds = [
        { id: '749d9208-ad97-47f9-a497-0385df40420d', type: 'tranvia' as const },
        { id: '19914413-77e1-441c-83a7-8f0f45c0767a', type: 'guagua' as const }
      ];

      try {
        const allStops: TransportStop[] = [];

        for (const api of apiIds) {
          const res = await fetch(`https://datos.tenerife.es/ckan/api/action/package_show?id=${api.id}`);
          const data = await res.json();
          const resource = data.result.resources.find((r: any) => r.format.toLowerCase() === 'geojson');
          const geojsonRes = await fetch(resource.url);
          const geojsonData = await geojsonRes.json();

          geojsonData.features.forEach((f: any) => {
            const dist = getDistance(selectedItem.latitud, selectedItem.longitud, f.geometry.coordinates[1], f.geometry.coordinates[0]);
            allStops.push({
              nombre: f.properties.parada_nombre || "Parada",
              url: f.properties.parada_url || "#",
              distance: dist,
              type: api.type
            });
          });
        }

        setNearbyTransport(allStops.sort((a, b) => a.distance - b.distance).slice(0, 4));
      } catch (err) {
        console.error("Error cargando transporte:", err);
      }
    };
    fetchTransport();
  }, [selectedItem]);

  return (
    <div className="info-panel animate-slide-in">
      <button className="close-btn" onClick={onClose}>
        <img src={closeIcon} alt="Cerrar" />
      </button>

      <h2>{selectedItem.nombre}</h2>
      
      <div className="badge-row">
        <div className="badge-panel" style={{ backgroundColor: `${markerColor}22`, color: markerColor, border: `1px solid ${markerColor}44` }}>
          {normalizeText(selectedItem.actividad_tipo)}
        </div>
        <button className={`fav-btn ${isFavorite ? 'active' : ''}`} onClick={toggleFavorite}>
          {isFavorite ? <img src={starSolidIcon} alt="Favorito" /> : <img src={starIcon} alt="Agregar a favoritos" />}
        </button>
      </div>

      <div className="separator"></div>

      <div className="data-row">
        <p><strong>Municipio</strong> {selectedItem.municipio_nombre}</p>
       
        <div className="action-line">
           <p><strong>Dirección</strong> {selectedItem.direccion_nombre_via}, {selectedItem.direccion_numero}</p>
          {selectedItem.direccion_nombre_via && (
            <a href={`https://www.google.com/maps?q=${selectedItem.latitud},${selectedItem.longitud}`}
              target="_blank" rel="noreferrer" className="icon-action-btn">
              <img src={Map} alt="Google Maps" />
            </a>
          )}
        </div>
        
        <div className="action-line">
          <p><strong>Teléfono</strong> {selectedItem.telefono || 'No disponible'}</p>
          {selectedItem.telefono && (
            <a href={`tel:${selectedItem.telefono}`} className="icon-action-btn">
              <img src={Phone} alt="Llamar" />
            </a>
          )}
        </div>

        <div className="action-line">
          <p><strong>Web</strong> {selectedItem.web ? selectedItem.web : 'No disponible'}</p>
          {selectedItem.web && (
            <a href={selectedItem.web.startsWith('http') ? selectedItem.web : `https://${selectedItem.web}`} 
               target="_blank" rel="noreferrer" className="icon-action-btn">
              <img src={Globe} alt="Web" />
            </a>
          )}
        </div>
      </div>

      <div className="separator"></div>

      <div className="secondary-actions">
        
       
      </div>

      <div className="transport-container">
        {nearbyTransport.map((stop, i) => (
          <a key={i} href={stop.url} target="_blank" rel="noreferrer" className="transport-card">
            <img src={stop.type == "tranvia" ? TranviaImg : BusImg} alt={stop.type} />
            <div className="transport-info">
              <span>{stop.nombre.toUpperCase()}</span>
              <small>{stop.distance.toFixed(2)} km</small>
            </div>
          </a>
        ))}
      </div>

      <div className="panel-footer">
        <button className="footer-btn " onClick={sharePage} title="Compartir este lugar">
          <img src={ExternalLink} alt="Compartir" />
        </button>
        <span className="error-notice">La información puede contener errores.</span>
        <a href="https://datos.tenerife.es/es/datos/conjuntos-de-datos/centros-educativos-y-culturales-en-tenerife" target="_blank" rel="noreferrer" className="footer-btn" title="Fuente de datos">
          <img src={Info} alt="Fuente de datos" />
        </a>
      </div>
    </div>
  );
};

export default InfoPanel;