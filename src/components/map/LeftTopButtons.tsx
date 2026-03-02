import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MapSearch from './MapSearch';

interface LeftTopButtonsProps {
  features: any[];
  onResultFound: (
    results: any[],
    isActivitySearch: boolean,
    activityName?: string,
  ) => void;
}

const LeftTopButtons: React.FC<LeftTopButtonsProps> = ({
  features,
  onResultFound,
}) => (
  <div className="left-top-buttons">
    <Link
      to="/"
      className="exit-button "
      aria-label="Volver a la página de inicio"
    >
      <ArrowLeft color="black" aria-hidden="true" role="presentation" />
    </Link>
    <MapSearch features={features} onResultFound={onResultFound} />
  </div>
);

export default LeftTopButtons;
