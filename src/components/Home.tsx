import React from 'react';
import Form from './Form.tsx';
import Counter from './Counter.tsx';
import ChatBot from './ChatBot.tsx';
import StatsSection from './StatsSection.tsx';
import Introduction from './Introduction.tsx';
import CategoryGrid from './CategoryGrid.tsx';
import Footer from './Footer.tsx';
import '../assets/css/Home.css';
import CabildoLogo from "../assets/img/logo-cabildo.png";
import WebLogo from "../assets/img/logo-pagina.png";


const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* SECCIÓN 1: Hero / Parallax */}
      <section className="hero-section">
        <div className="parallax-bg"></div>
        <div className="overlay"></div>
        
        <div className="icon-cabildo">
          <a href="https://www.tenerife.es" target="_blank" rel="noopener noreferrer"><img src={CabildoLogo} alt="Logo Cabildo" /></a>
        </div>
        
        <header className="home-header">
          <div className="logo-pagina"><img src={WebLogo} alt="Logo de la página" /></div>
          <p className='subtitle'>Tu red de centros educativos, bibliotecas y espacios de estudio a un clic.</p>
          <Form onSearch={(query) => console.log("Searching for:", query)} />
        </header>
      </section>

      {/* SECCIÓN 2: Información (Aparece al hacer scroll) */}
      <section className="info-section">
        <div className="home-content">
          <Introduction />
          <CategoryGrid />
          <Counter />
          <ChatBot />
          <StatsSection />
          <Footer />
        </div>
      </section>
    </div>
    
  );
};
export default Home;