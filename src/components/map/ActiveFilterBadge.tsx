import React from 'react';

interface ActiveFilterBadgeProps {
  activityFilter: string | null;
  onClear: () => void;
}

const ActiveFilterBadge: React.FC<ActiveFilterBadgeProps> = ({
  activityFilter,
  onClear,
}) => {
  if (!activityFilter) return null;

  return (
    <div className="active-filter-badge" role="status" aria-live="polite">
      Mostrando: <strong>{activityFilter}</strong>
      <button type="button" onClick={onClear} aria-label={`Borrar el filtro actual de modalidad ${activityFilter}`}>✕</button>
    </div>
  );
};

export default ActiveFilterBadge;

