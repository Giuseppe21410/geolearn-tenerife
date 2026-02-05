import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/Home';
import TenerifeMap from './components/TenerifeMap';

function App() {
  return (
    <Router>
      <Routes>
        {/* Tu página principal actual */}
        <Route path="/" element={<LandingPage />} />
        
        {/* La nueva página del mapa */}
        <Route path="/mapa" element={<TenerifeMap />} />
      </Routes>
    </Router>
  );
}

export default App;