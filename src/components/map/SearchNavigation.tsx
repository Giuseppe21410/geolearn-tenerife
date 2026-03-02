import React from 'react';

interface SearchNavigationProps {
  searchResults: any[];
  currentResultIndex: number;
  onNext: () => void;
}

const SearchNavigation: React.FC<SearchNavigationProps> = ({
  searchResults,
  currentResultIndex,
  onNext,
}) => {
  if (searchResults.length <= 1) return null;

  return (
    <div className="search-navigation" aria-live="polite">
      <button
        type="button"
        onClick={onNext}
        aria-label={`Ver siguiente resultado, actualmente viendo ${currentResultIndex + 1} de ${searchResults.length}`}
      >
        Siguiente ({currentResultIndex + 1} de {searchResults.length})
      </button>
    </div>
  );
};

export default SearchNavigation;

