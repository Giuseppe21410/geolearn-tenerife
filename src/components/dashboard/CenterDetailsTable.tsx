import React, { useState, useEffect, useMemo, useRef } from 'react';
import CenterTableHeader from './CenterTableHeader';
import CenterTable from './CenterTable';
import CenterPagination from './CenterPagination';
import '../../assets/css/DashBoard/DashboardTable.css';

interface CenterDetailsTableProps {
  data: any[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const CenterDetailsTable: React.FC<CenterDetailsTableProps> = ({
  data,
  searchTerm,
  onSearchChange,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const itemsPerPage = 10;

  // Custom Timer Navigation State
  const autoSkipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paginationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('favs');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [data, showFavorites, searchTerm]);

  const toggleFavorite = (id: string) => {
    const newFavs = favorites.includes(id)
      ? favorites.filter(fav => fav !== id)
      : [...favorites, id];

    setFavorites(newFavs);
    localStorage.setItem('favs', JSON.stringify(newFavs));
    window.dispatchEvent(new Event('favsUpdated'));
  };

  const displayData = useMemo(() => {
    if (showFavorites) {
      return data.filter(item => favorites.includes(item.properties?.nombre));
    }
    return data;
  }, [data, showFavorites, favorites]);

  const totalPages = Math.ceil(displayData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = displayData.slice(indexOfFirstItem, indexOfLastItem);

  const exportToCSV = () => {
    if (displayData.length === 0) return;

    const headers = [
      'Nombre',
      'Municipio',
      'Tipo',
      'Direccion',
      'CP',
      'Web',
      'Email',
      'Telefono',
    ];

    const cleanText = (text: any) => {
      if (!text) return '';
      return String(text).replace(/[";\r\n]/g, '').trim();
    };

    const rows = displayData.map(item => {
      const p = item.properties;
      const direccionCompleta = `${p.tipo_via_descripcion || ''} ${p.direccion_nombre_via || ''
        }, ${p.direccion_numero || ''}`;

      return [
        cleanText(p.nombre),
        cleanText(p.municipio_nombre),
        cleanText(p.actividad_tipo),
        cleanText(direccionCompleta),
        cleanText(p.direccion_codigo_postal),
        cleanText(p.web),
        cleanText(p.email),
        p.telefono ? Math.floor(p.telefono) : '',
      ].join(';');
    });

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows].join('\n');
    const blob = new Blob([csvContent], {
      type: 'text/csv;charset=utf-8;',
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute(
      'download',
      showFavorites ? 'mis_favoritos.csv' : 'centros_tenerife.csv',
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleTableFocusEnter = () => {
    // Si el usuario mantiene el foco dentro de la tabla por 3 segundos rectos
    autoSkipTimer.current = setTimeout(() => {
      if (paginationRef.current) {
        paginationRef.current.scrollIntoView({ behavior: 'smooth' });
        // Mover foco lógico para pantalla al primer control de paginación
        const firstPaginationButton = paginationRef.current.querySelector('button');
        if (firstPaginationButton) {
          firstPaginationButton.focus();
        }
      }
    }, 3000);
  };

  const handleTableFocusLeave = () => {
    // Si el usuario suelta el foco o se mueve rápido, cancelamos el salto forzado
    if (autoSkipTimer.current) {
      clearTimeout(autoSkipTimer.current);
    }
  };

  return (
    <section
      id="main-content"
      className="advanced-list-section glass"
      aria-labelledby="center-details-title"
    >
      <CenterTableHeader
        showFavorites={showFavorites}
        onToggleFavorites={() => setShowFavorites(!showFavorites)}
        searchTerm={searchTerm}
        onSearchChange={onSearchChange}
        onExportCsv={exportToCSV}
      />

      <div
        onFocus={handleTableFocusEnter}
        onBlur={handleTableFocusLeave}
      >
        <CenterTable
          items={currentItems}
          favorites={favorites}
          showFavorites={showFavorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      <div id="pagination-controls" ref={paginationRef}>
        <CenterPagination
          currentPage={currentPage}
          totalPages={totalPages}
          start={indexOfFirstItem + 1}
          end={Math.min(indexOfLastItem, displayData.length)}
          totalItems={displayData.length}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
};

export default CenterDetailsTable;
