import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight, BookMarked } from 'lucide-react';
import '../../assets/css/Home/GpsButton.css';
import '../../assets/css/Home/Form.css';
import '../../assets/css/Toast.css';
import '../../assets/css/Tooltip.css';
import GpsButton from './GpsButton';

interface FormProps {
    onSearch?: (query: string) => void;
}

const SUGGESTIONS = ['Colegios', 'Bibliotecas', 'Facultades', 'Museos', 'Institutos'];

const Form: React.FC<FormProps> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>("");
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const isWriting = query.trim().length > 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleNavigation = (text: string) => {
        const trimmed = text.trim();

        if (trimmed) {
            navigate(`/mapa?busqueda=${encodeURIComponent(trimmed)}`);
        } else {
            navigate('/mapa');
        }

        if (onSearch) {
            onSearch(trimmed);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = query.trim();
        if (trimmed && trimmed.length < 3) {
            setErrorMessage("Introduce al menos 3 caracteres para buscar");
            setTimeout(() => setErrorMessage(null), 3000);
            return;
        }
        handleNavigation(query);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        handleNavigation(suggestion);
    };

    return (
        <>
            {isLoadingLocation && (
                <div className="search-error-toast searching" role="status" aria-live="polite">
                    Buscando tu ubicación...
                </div>
            )}
            {errorMessage && (
                <div className="search-error-toast" role="alert" aria-live="assertive">
                    {errorMessage}
                </div>
            )}
            <form
                className="search-container"
                onSubmit={handleFormSubmit}
                role="search"
                aria-label="Buscar centros educativos y recursos culturales"
            >
                <div className="search-wrapper">
                    <GpsButton
                        onLocationFound={(coords) => {
                            if (coords) navigate(`/mapa?lat=${coords?.lat}&lng=${coords?.lng}`);
                        }}
                        onLoadingChange={setIsLoadingLocation}
                        onError={setErrorMessage}
                    />

                    <label
                        htmlFor="search-input"
                        className="sr-only"
                    >
                        Buscar centros por nombre o tipo cómo por ejemplo institutos, bibliotecas, facultades o museos
                    </label>
                    <input
                        id="search-input"
                        type="search"
                        placeholder="Busca centros educativos,..."
                        className="search-input"
                        onChange={handleInputChange}
                        value={query}
                        aria-describedby="search-suggestions-description"
                        autoComplete='off'

                    />

                    <button
                        type="submit"
                        className={`search-button icon-button-tooltip ${isWriting ? 'active' : 'default'}`}
                        aria-label={
                            isWriting
                                ? 'Realizar búsqueda con el texto introducido'
                                : 'Abre el mapa sin filtros de búsqueda'
                        }
                        data-label={isWriting ? 'Buscar' : 'Ir al Mapa'}
                    >
                        {isWriting ? (
                            <ArrowUpRight aria-hidden="true" color="black" />
                        ) : (
                            <BookMarked aria-hidden="true" color="black" />
                        )}
                    </button>
                </div>

                <ul
                    className="search-suggestions"
                    aria-labelledby="search-suggestions-description"
                >
                    {SUGGESTIONS.map((text) => (
                        <li key={text}>
                            <button
                                type="button"
                                onClick={() => handleSuggestionClick(text)}
                                aria-label={`Buscar sugerencia: ${text}`}
                            >
                                {text}
                            </button>
                        </li>
                    ))}
                </ul>
            </form>
        </>
    );
}

export default Form;
