import { useState, useRef, useEffect } from 'react';
import { ChevronDown, type LucideIcon } from 'lucide-react';
import { formatTitleCase } from '../../utils/Textutils.ts';
import '../../assets/css/CustomSelect.css';

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  defaultLabel?: string;
  icon: LucideIcon;
  disabled?: boolean;
  hideDefaultOption?: boolean;
}

const CustomSelect = ({
  value,
  onChange,
  options,
  defaultLabel = 'Todos',
  placeholder,
  icon: Icon,
  disabled = false,
  hideDefaultOption = false,
}: CustomSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div
        className={`select-trigger ${isOpen ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => {
          if (!disabled) setIsOpen(!isOpen);
        }}
        role="combobox"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="custom-select-listbox"
        aria-disabled={disabled}
        aria-label={`Filtro ${placeholder || defaultLabel}. Selección actual: ${value === 'Todos' ? defaultLabel : formatTitleCase(value)}`}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(prev => !prev);
          }
        }}
      >
        <Icon size={24} className="pin-icon" aria-hidden="true" role="presentation" />
        <span className="selected-text">
          {value === 'Todos' ? defaultLabel : formatTitleCase(value)}
        </span>
        <ChevronDown size={18} className={`arrow ${isOpen ? 'rotate' : ''}`} aria-hidden="true" role="presentation" />
      </div>

      {isOpen && (
        <div
          id="custom-select-listbox"
          className="select-options-dropdown glass"
          role="listbox"
          aria-label={defaultLabel}
        >
          {!hideDefaultOption && (
            <div
              className={`option-item ${value === 'Todos' ? 'selected' : ''}`}
              onClick={() => {
                onChange('Todos');
                setIsOpen(false);
              }}
              role="option"
              tabIndex={0}
              aria-selected={value === 'Todos'}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onChange('Todos');
                  setIsOpen(false);
                }
              }}
            >
              {defaultLabel}
            </div>
          )}
          {options
            .map(opt => (
              <div
                key={opt}
                className={`option-item ${value === opt ? 'selected' : ''}`}
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                role="option"
                tabIndex={0}
                aria-selected={value === opt}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onChange(opt);
                    setIsOpen(false);
                  }
                }}
              >
                <span aria-hidden="true">{formatTitleCase(opt)}</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;
