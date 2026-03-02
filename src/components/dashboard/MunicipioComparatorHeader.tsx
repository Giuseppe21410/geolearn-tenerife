import React from 'react';
import { Plus, BarChart3, Activity } from 'lucide-react';
import CustomSelect from '../common/CustomSelect';

interface MunicipioComparatorHeaderProps {
  selectedActivity: string;
  selectedMunicipios: string[];
  actividades: string[];
  municipiosDisponibles: string[];
  onSelectActivity: (activity: string) => void;
  onAddMunicipio: (municipio: string) => void;
}

const MunicipioComparatorHeader: React.FC<MunicipioComparatorHeaderProps> = ({
  selectedActivity,
  selectedMunicipios,
  actividades,
  municipiosDisponibles,
  onSelectActivity,
  onAddMunicipio,
}) => {
  return (
    <div className="comparator-header">
      <div className="header-title" aria-label="Comparativa por Municipios">
        <BarChart3 size={20} aria-hidden="true" />
        <h3 id="comparator-title" aria-hidden="true">Comparativa por Municipios</h3>
      </div>

      <div className="comparator-controls" role="search" aria-label="Controles para comparar municipios">
        <div className="custom-dropdown-container">
          <CustomSelect
            value={selectedActivity || 'Todos'}
            onChange={(val) => onSelectActivity(val === 'Todos' ? '' : val)}
            options={actividades}
            defaultLabel="Actividad..."
            icon={Activity}
            hideDefaultOption={true}
          />
        </div>

        <div className="custom-dropdown-container">
          <CustomSelect
            value="Todos"
            onChange={(val) => {
              if (val !== 'Todos') onAddMunicipio(val);
            }}
            options={municipiosDisponibles}
            defaultLabel="Añadir Municipio..."
            icon={Plus}
            disabled={selectedMunicipios.length >= 5}
            hideDefaultOption={true}
          />
        </div>
      </div>
    </div>
  );
};

export default MunicipioComparatorHeader;
