import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { normalizeActivityQuery, KNOWN_NORMALIZED_TYPES } from '../../utils/Textutils.ts';

interface MapSearchProps {
  features: any[];
  onResultFound: (
    results: any[],
    isActivitySearch: boolean,
    activityName?: string,
  ) => void;
}

const wordMatches = (text: string, word: string): boolean =>
  text.split(/[\s/(),.-]+/).some(w => w === word);

const MapSearch: React.FC<MapSearchProps> = ({ features, onResultFound }) => {
  const [query, setQuery] = useState('');
  const [showError, setShowError] = useState(false);
  const [lastFailedQuery, setLastFailedQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanQuery = query.trim().toLowerCase();

    if (!cleanQuery) return;

    if (cleanQuery.length < 3) {
      setLastFailedQuery(query);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }

    const normalized = normalizeActivityQuery(cleanQuery).toLowerCase();
    const queryWords = cleanQuery.split(/\s+/).filter(Boolean);
    const isKnownType = KNOWN_NORMALIZED_TYPES.has(normalized);

    const nameMatches = features.filter(f => {
      const nombre = (f.properties.nombre || '').toLowerCase();
      return queryWords.every(qw => wordMatches(nombre, qw));
    });


    const isExactCategory = cleanQuery === normalized;
    const isSingleWord = queryWords.length === 1;

    if (isKnownType && (isSingleWord || isExactCategory || nameMatches.length === 0)) {
      const activityMatches = features.filter(f => {
        const actTipo = (f.properties.actividad_tipo || '').toLowerCase();
        return actTipo === normalized || queryWords.every(qw => wordMatches(actTipo, qw));
      });

      if (activityMatches.length > 0) {
        setShowError(false);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
        const officialName = activityMatches[0].properties.actividad_tipo;
        requestAnimationFrame(() => {
          onResultFound(activityMatches, true, officialName);
        });
        return;
      }
    }

    if (nameMatches.length > 0) {
      setShowError(false);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      requestAnimationFrame(() => {
        onResultFound(nameMatches, false);
      });
      return;
    }

    const finalActivityMatches = features.filter(f => {
      const actTipo = (f.properties.actividad_tipo || '').toLowerCase();
      return actTipo === normalized;
    });

    if (finalActivityMatches.length > 0) {
      setShowError(false);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      const officialName = finalActivityMatches[0].properties.actividad_tipo;
      requestAnimationFrame(() => {
        onResultFound(finalActivityMatches, true, officialName);
      });
      return;
    }

    const nameMatchesFallback = features.filter(f => {
      const nombre = (f.properties.nombre || '').toLowerCase();
      return queryWords.every(qw => wordMatches(nombre, qw));
    });

    if (nameMatchesFallback.length > 0) {
      setShowError(false);
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }
      requestAnimationFrame(() => {
        onResultFound(nameMatchesFallback, false);
      });
      return;
    }

    setLastFailedQuery(query);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  return (
    <div className="map-search-container">
      {showError && (
        <div className="search-error-toast" role="alert" aria-live="assertive">
          No se encontró "{lastFailedQuery}"
        </div>
      )}

      <form className="search-glass-wrapper" onSubmit={handleSearch} role="search">
        <input
          type="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Busca por actividad o nombre..."
          className="search-input"
          aria-label="Buscar centros, museos o puntos de interés"
        />
        <button
          type="submit"
          className="search-btn icon-button-tooltip tooltip-below"
          aria-label="Buscar"
          data-label="Buscar"
        >
          <Search aria-hidden="true" role="presentation" color='black' />
        </button>
      </form>
    </div>
  );
};

export default MapSearch;
