import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CenterPaginationProps {
  currentPage: number;
  totalPages: number;
  start: number;
  end: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

const CenterPagination: React.FC<CenterPaginationProps> = ({
  currentPage,
  totalPages,
  start,
  end,
  totalItems,
  onPageChange,
}) => {
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages && totalPages > 0;

  return (
    <nav className="pagination-container" aria-label="Paginación de la tabla de centros">
      <div className="pagination-info" aria-live="polite">
        Mostrando <strong>{totalItems > 0 ? start : 0}</strong> -{' '}
        <strong>{end}</strong> de <strong>{totalItems}</strong> centros
      </div>

      <div className="pagination-controls">
        <button
          className="pagi-btn"
          onClick={() => canGoPrev && onPageChange(currentPage - 1)}
          disabled={!canGoPrev}
          type="button"
          aria-label="Página anterior"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        <div className="page-numbers">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter(
              page =>
                page === 1 ||
                page === totalPages ||
                Math.abs(page - currentPage) <= 1,
            )
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="pagi-dots">...</span>
                )}
                <button
                  className={`page-num ${currentPage === page ? 'active' : ''
                    }`}
                  onClick={() => onPageChange(page)}
                  type="button"
                  aria-current={currentPage === page ? 'page' : undefined}
                  aria-label={`Ir a la página ${page}`}
                >
                  {page}
                </button>
              </React.Fragment>
            ))}
        </div>

        <button
          className="pagi-btn"
          onClick={() => canGoNext && onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          type="button"
          aria-label="Página siguiente"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};

export default CenterPagination;
