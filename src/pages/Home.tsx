import React from 'react';
import Form from '../components/home/Form';
import Counter from '../components/home/Counter';
import ChatBot from '../components/home/ChatBot';
import StatsSection from '../components/home/StatsSection';
import Introduction from '../components/home/Introduction';
import CategoryGrid from '../components/home/CategoryGrid';
import Footer from '../components/home/Footer';
import LazyImage from '../components/common/LazyImage';
import '../assets/css/Home/Home.css';
import '../assets/css/Tooltip.css';
import CabildoLogo from '../assets/img/logo-cabildo.webp';
import WebLogo from '/logo-pagina.webp';


const Home: React.FC = () => {
  return (
    <main className="home-container">
      <section
        className="hero-section"
        aria-labelledby="home-hero-heading"
      >
        <div className="parallax-bg" role="presentation" aria-hidden="true"></div>
        <div className="overlay" role="presentation" aria-hidden="true"></div>

        <div className="icon-cabildo">
          <a
            href="https://www.tenerife.es"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Abrir sitio web del Cabildo de Tenerife en una nueva pestaña"
          >
            <LazyImage src={CabildoLogo} alt="" role="presentation" aria-hidden="true" />
          </a>
        </div>

        <header className="home-header">
          <div className="icon-page-img">
            <LazyImage
              src={WebLogo}
              alt="GeoLearn Tenerife, plataforma de centros educativos, bibliotecas y espacios de estudio"
              preload={true}
            />
          </div>
          <h1 className="subtitle" id="home-hero-heading">
            Tu red de centros educativos, bibliotecas y espacios de estudio a un clic.
          </h1>
          <Form />
        </header>
      </section>

      <section
        className="info-section"
        aria-label="Información y herramientas de búsqueda de centros educativos"
      >
        <div className="home-content">
          <Introduction />
          <CategoryGrid />
          <Counter />
          <ChatBot />
          <StatsSection />
          <Footer />
        </div>
      </section>
    </main>
  );
};
export default Home;
