import React, { useState } from 'react';
import SearchIcon from '../assets/img/icons/search.svg';

interface MapSearchProps {
  features: any[];
  onResultFound: (results: any[], isActivitySearch: boolean, activityName?: string) => void;
}

const MapSearch: React.FC<MapSearchProps> = ({ features, onResultFound }) => {
  const [query, setQuery] = useState('');
  const [showError, setShowError] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState('');

  const normalizeActivity = (text: string): string => {
    const t = text.toLowerCase().trim();
    if (t.includes("museo") || t.includes("salas de arte") || t.includes("museos") || t.includes("salas de artes") || t.includes("Museos y Salas de arte")) {
      return "museos salas de arte";
    }
    if (t.includes("biblioteca") || t.includes("ludoteca") || t.includes("bibliotecas") || t.includes("ludotecas") || t.includes("Bibliotecas y Ludotecas") || t.includes("Biblioteca y Ludoteca")  ) {
      return "biblioteca ludoteca";
    }
    if (t.includes("guarderia") || t.includes("centro infantil") || t.includes("guarderías") || t.includes("centros infantiles") || t.includes("Guarderías y Centros Infantiles") || t.includes("Guarderias y Centros Infantiles") || t.includes("Guarderias centros infantiles") ) {
      return "guarderias centros infantiles";
    }
    return text;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toLowerCase();
    
    if (!cleanQuery) return;

    // 1. Normalizamos la entrada del usuario
    const normalized = normalizeActivity(cleanQuery);

    // 2. Buscamos si el texto (normalizado o no) coincide con un actividad_tipo oficial
    const activityMatches = features.filter(f => {
      const actTipo = (f.properties.actividad_tipo || "").toLowerCase();
      return actTipo === normalized.toLowerCase() || actTipo.includes(cleanQuery);
    });

    // --- CASO A: Búsqueda por Tipo de Actividad ---
    if (activityMatches.length > 0 && (cleanQuery.length > 3 || activityMatches.length > 1)) {
      setShowError(false);
      
      const officialName = activityMatches[0].properties.actividad_tipo;
      
      onResultFound(activityMatches, true, officialName);
      return;
    }

    // --- CASO B: Búsqueda por Nombre de lugar ---
    const nameMatches = features.filter(f => 
      f.properties.nombre.toLowerCase().includes(cleanQuery)
    );

    if (nameMatches.length > 0) {
      setShowError(false);
      onResultFound(nameMatches, false);
    } else {
      setLastFailedQuery(query); 
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <div className="map-search-container">
      {/* ERROR 1: Corregido - Mensaje fijo basado en lastFailedQuery */}
      {showError && (
        <div className="search-error-toast">
          No se encontró "{lastFailedQuery}"
        </div>
      )}

      <form className="search-glass-wrapper" onSubmit={handleSearch}>
        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Busca por actividad o nombre..."
          className="search-input"
        />
        <button type="submit" className="search-btn" aria-label="Buscar">
          <img src={SearchIcon} alt="Buscar" />
        </button>
      </form>
    </div>
  );
};

export default MapSearch;