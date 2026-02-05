import React from 'react';
import '../assets/css/CategoryGrid.css';

// Importa tus iconos (ajusta las rutas)
import SchoolIcon from '../assets/img/icons/primary-school.svg';
import MuseumIcon from '../assets/img/icons/museum.svg';
import LibraryIcon from '../assets/img/icons/library.svg';
import CultureIcon from '../assets/img/icons/culture.svg';
import ProfessionalFormationIcon from '../assets/img/icons/professional-formation.svg';
import UniversityIcon from '../assets/img/icons/university.svg';
import SpecialEducationIcon from '../assets/img/icons/special-education.svg';
import SecondaryIcon from '../assets/img/icons/secondary-school.svg';
import ImgPrimary from '../assets/img/primary-school.jpg';
import ImgSecondary from '../assets/img/secondary-school.jpg';
import ImgSpecial from '../assets/img/special-education.jpg';
import ImgUni from '../assets/img/university.jpg';
import ImgFP from '../assets/img/professional-formation.jpg';
import ImgLibrary from '../assets/img/library.jpg';
import ImgMuseum from '../assets/img/museum.jpg';
import ImgCulture from '../assets/img/theater.jpg';

interface Category {
  id: string;
  name: string;
  icon: string;
  image: string; 
}

const categories: Category[] = [
  { id: '1', name: 'Educación Infantil y Primaria', icon: SchoolIcon, image: ImgPrimary },
  { id: '2', name: 'Enseñanza Secundaria', icon: SecondaryIcon, image: ImgSecondary },
  { id: '3', name: 'Enseñanza Especializada', icon: SpecialEducationIcon, image: ImgSpecial },
  { id: '4', name: 'Enseñanza Universitaria', icon: UniversityIcon, image: ImgUni },
  { id: '5', name: 'Formación Profesional', icon: ProfessionalFormationIcon, image: ImgFP },
  { id: '6', name: 'Biblioteca', icon: LibraryIcon, image: ImgLibrary },
  { id: '7', name: 'Museos', icon: MuseumIcon, image: ImgMuseum },
  { id: '8', name: 'Centros Culturales', icon: CultureIcon, image: ImgCulture },
];

const CategoryGrid: React.FC = () => {
  return (
    <section className="category-section">
      <h2 className="category-title">Búsqueda por temas:</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div key={cat.id} className="category-card">
            {/* Imagen de fondo que solo se ve en hover */}
            <div className="card-bg" style={{ backgroundImage: `url(${cat.image})` }}></div>
            <div className="card-overlay"></div>
            
            <div className="card-content">
              <img src={cat.icon} alt={cat.name} className="card-icon" />
              <span className="card-name">{cat.name}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;