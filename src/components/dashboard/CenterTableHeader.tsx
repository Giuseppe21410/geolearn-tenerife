import React from 'react';
import { Search, Download, Star, List, Sheet } from 'lucide-react';

interface CenterTableHeaderProps {
  showFavorites: boolean;
  onToggleFavorites: () => void;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onExportCsv: () => void;
}

const CenterTableHeader: React.FC<CenterTableHeaderProps> = ({
  showFavorites,
  onToggleFavorites,
  searchTerm,
  onSearchChange,
  onExportCsv,
}) => {
  return (
    <div className="list-header">
      <div className="list-header-top">
        <div className="chart-title">
          <Sheet aria-hidden="true" role="presentation" color="black" width={20} height={20} />
          <h3 id="center-details-title">
            {showFavorites ? 'Mis Centros Favoritos' : 'Detalle sobre los Centros'}
          </h3>
        </div>

        <div className="list-actions">
          <button
            className="action-box-btn"
            onClick={onExportCsv}
            title="Descargar CSV"
            type="button"
            aria-label="Descargar listado de centros en CSV"
          >
            <Download size={18} aria-hidden="true" />
            <span aria-hidden="true">CSV</span>
          </button>

          <button
            className={`action-box-btn ${showFavorites ? 'active-fav' : ''}`}
            onClick={onToggleFavorites}
            type="button"
            aria-pressed={showFavorites}
            aria-label={
              showFavorites
                ? 'Mostrar todos los centros'
                : 'Mostrar solo centros favoritos'
            }
          >
            {showFavorites ? <List size={18} aria-hidden="true" /> : <Star size={18} aria-hidden="true" />}
            <span aria-hidden="true">{showFavorites ? 'Ver Todos' : 'Favoritos'}</span>
          </button>
        </div>
      </div>

      <div className="search-box" role="search">
        <Search size={16} aria-hidden="true" role="presentation" />
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
          aria-label="Buscar centros en la tabla"
        />
      </div>
    </div>
  );
};

export default CenterTableHeader;

