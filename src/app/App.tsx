import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy, useState, useEffect } from 'react';
import Home from '../pages/Home';
import fondoMenu from '../assets/img/fondo-menu.webp';

const TenerifeMap = lazy(() => import('../pages/TenerifeMap'));
const Dashboard = lazy(() => import('../pages/Dashboard'));

const LoadingFallback = () => (
  <div
    role="status"
    aria-live="polite"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100%',
      backgroundColor: '#f5f5f5',
    }}
  >
    <div style={{ textAlign: 'center' }}>
      <div
        aria-hidden="true"
        style={{
          width: '50px',
          height: '50px',
          border: '4px solid #e0e0e0',
          borderTopColor: '#2563eb',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 20px',
        }}
      />
      <p style={{ color: '#666', fontSize: '16px' }}>Cargando aplicación...</p>
      <style>
        {`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  </div>
);

function App() {
  const checkDevice = () => {
    const isMobileUA = /iPad|iPhone|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // iOS 13+ en iPad suele solicitar versión de escritorio por defecto (userAgent indica Mac)
    const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;

    // Si es explícitamente un ordenador (Mac sin pantalla táctil o Windows/Linux), no es móvil
    const isDesktopOS = (/Macintosh/i.test(navigator.userAgent) && navigator.maxTouchPoints === 0) ||
      /Windows|Linux/i.test(navigator.userAgent) && !/Android/i.test(navigator.userAgent);

    if (isDesktopOS) {
      return false;
    }

    return window.innerWidth <= 1366 || isMobileUA || isIPadOS;
  };
  const checkOrientation = () => window.innerWidth > window.innerHeight;

  const [isMobile, setIsMobile] = useState(checkDevice());
  const [isLandscape, setIsLandscape] = useState(checkOrientation());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(checkDevice());
      setIsLandscape(checkOrientation());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!isMobile) {
    return (
      <main style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.90)), url(${fondoMenu})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <svg aria-hidden="true" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px', opacity: 0.9 }}>
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Descubre GeoLearn Tenerife
        </h1>
        <p style={{ fontSize: '1.2rem', maxWidth: '500px', lineHeight: '1.6', color: '#e2e8f0' }}>
          Esta experiencia inmersiva ha sido diseñada en exclusiva para dispositivos móviles.
          <br /><br />
          Para disfrutar del mapa interactivo y nuestro dashboard, por favor <strong>accede desde tu teléfono móvil</strong> o reduce el ancho de esta ventana.
        </p>
      </main>
    );
  }

  if (isLandscape) {
    return (
      <main style={{
        height: '100vh',
        width: '100vw',
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.95)), url(${fondoMenu})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        textAlign: 'center',
        padding: '20px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        zIndex: 9999
      }}>
        <svg aria-hidden="true" width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '24px', opacity: 0.9, transform: 'rotate(-90deg)', transition: 'transform 0.5s ease' }}>
          <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
          <line x1="12" y1="18" x2="12.01" y2="18"></line>
        </svg>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', letterSpacing: '-0.02em' }}>
          Gira tu dispositivo
        </h1>
        <p style={{ fontSize: '1.1rem', maxWidth: '400px', lineHeight: '1.5', color: '#e2e8f0' }}>
          Para disfrutar de la mejor experiencia en GeoLearn Tenerife, por favor <strong>usa tu dispositivo en posición vertical</strong> (modo retrato).
        </p>
      </main>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/mapa"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <TenerifeMap />
            </Suspense>
          }
        />
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;