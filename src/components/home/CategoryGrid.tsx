import React from 'react';
import { useNavigate } from 'react-router-dom';
import { School, GraduationCap, Users, Library, Palette, BriefcaseBusiness, Landmark, type LucideIcon } from 'lucide-react';
import '../../assets/css/Home/CategoryGrid.css';
import ImgPrimary from '../../assets/img/primary-school.webp';
import ImgSecondary from '../../assets/img/secondary-school.webp';
import ImgSpecial from '../../assets/img/special-education.webp';
import ImgUni from '../../assets/img/university.webp';
import ImgFP from '../../assets/img/professional-formation.webp';
import ImgLibrary from '../../assets/img/library.webp';
import ImgMuseum from '../../assets/img/museum.webp';
import ImgCulture from '../../assets/img/theater.webp';

interface Category {
  id: string;
  name: string;
  name_json: string;
  icon: LucideIcon;
  image: string;
}

const categories: Category[] = [
  {
    id: '1',
    name: 'Educación Infantil y Primaria',
    name_json: 'enseñanza infantil y primaria',
    icon: School,
    image: ImgPrimary,
  },
  {
    id: '2',
    name: 'Enseñanza Secundaria',
    name_json: 'enseñanza secundaria',
    icon: GraduationCap,
    image: ImgSecondary,
  },
  {
    id: '3',
    name: 'Enseñanza Especializada',
    name_json: 'enseñanza especial',
    icon: Users,
    image: ImgSpecial,
  },
  {
    id: '4',
    name: 'Enseñanza Universitaria',
    name_json: 'enseñanza universitaria',
    icon: GraduationCap,
    image: ImgUni,
  },
  {
    id: '5',
    name: 'Formación Profesional',
    name_json: 'enseñanza profesional',
    icon: BriefcaseBusiness,
    image: ImgFP,
  },
  {
    id: '6',
    name: 'Biblioteca',
    name_json: 'biblioteca ludoteca',
    icon: Library,
    image: ImgLibrary,
  },
  {
    id: '7',
    name: 'Museos',
    name_json: 'museos salas de arte',
    icon: Landmark,
    image: ImgMuseum,
  },
  {
    id: '8',
    name: 'Centros Culturales',
    name_json: 'centro cultural',
    icon: Palette,
    image: ImgCulture,
  },
];

const CategoryGrid: React.FC = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (categoryName: string) => {
    navigate(`/mapa?tema=${encodeURIComponent(categoryName)}`);
  };

  return (
    <section className="category-section" aria-labelledby="category-grid-heading">
      <h2 className="category-title" id="category-grid-heading">
        Búsqueda por temas:
      </h2>
      <ul className="category-grid" role="list">
        {categories.map(({ id, name, name_json, icon: Icon, image }) => (
          <li key={id}>
            <button
              type="button"
              className="category-card"
              onClick={() => handleCategoryClick(name_json)}
              aria-label={`Explorar centros de ${name}`}
            >
              <div
                className="card-bg"
                style={{ backgroundImage: `url(${image})` }}
                aria-hidden="true"
              />
              <div className="card-overlay" aria-hidden="true" />

              <div className="card-content" aria-hidden="true">
                <Icon className="card-icon" color="#1367d3" aria-hidden="true" role="presentation" />
                <span className="card-name">{name}</span>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default CategoryGrid;
