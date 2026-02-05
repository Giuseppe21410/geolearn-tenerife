import React, { useState } from 'react';
import '../assets/css/GpsButton.css';
import '../assets/css/Form.css';
import SearchIcon from '../assets/img/icons/arrow-up.svg';
import BookIcon from '../assets/img/icons/book.svg';
import GpsButton from './GpsButton.tsx';

interface SearchButtonProps {
    onSearch: (query: string) => void;
}

const Form: React.FC<SearchButtonProps> = ({ onSearch }) => {
    const [query, setQuery] = useState<string>("");

    const isWriting = query.trim().length > 0;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isWriting) onSearch(query);
    };

    // Función para que las sugerencias funcionen de verdad
    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        onSearch(suggestion);
    };

    return (
        <form className="search-container" onSubmit={handleFormSubmit}>
            <div className="search-wrapper">
                <GpsButton onLocationFound={(coords) => {
                    console.log('Coordenadas obtenidas:', coords);
                }} />
                
                <input 
                    type="text" 
                    placeholder="Busca institutos, facultades, bibliotecas públicas..." 
                    className="search-input"
                    onChange={handleInputChange}
                    value={query}
                />

                <button 
                    type="submit" 
                    className={`search-button ${isWriting ? 'active' : ''}`} 
                    disabled={!isWriting}
                >
                    <img src={isWriting ? SearchIcon : BookIcon} alt="Icono" />
                </button>
            </div>

            <div className="search-suggestions">
                <span>Sugerencias:</span>
                {['Colegios', 'Bibliotecas', 'Facultades', 'Museos', 'Institutos'].map((text) => (
                    <button 
                        key={text} 
                        type="button" 
                        onClick={() => handleSuggestionClick(text)}
                    >
                        {text}
                    </button>
                ))}
            </div>
        </form>
    );
}

export default Form;