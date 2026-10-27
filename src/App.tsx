import { NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Home from './pages/Home';
import Plantings from './pages/Plantings';
import PlantingDetail from './pages/PlantingDetail';
import Guide from './pages/Guide';
import Diagnose from './pages/Diagnose';
import Calculator from './pages/Calculator';
import SettingsPage from './pages/Settings';
import Shop from './pages/Shop';
import { Icon } from './components';
import { useDueNotifications } from './lib/notify';

const NAV = [
  { to: '/', label: 'Beranda', icon: 'home', end: true },
  { to: '/lahan', label: 'Lahan', icon: 'sprout' },
  { to: '/belanja', label: 'Belanja', icon: 'cart' },
  { to: '/panduan', label: 'Panduan', icon: 'book' },
  { to: '/pengaturan', label: 'Setelan', icon: 'sliders' }
] as const;

export default function App() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  useDueNotifications();
  return (
    <div className="app">
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/lahan" element={<Plantings />} />
          <Route path="/lahan/:id" element={<PlantingDetail />} />
          <Route path="/panduan" element={<Guide />} />
          <Route path="/panduan/:id" element={<Guide />} />
          <Route path="/diagnosa" element={<Diagnose />} />
          <Route path="/belanja" element={<Shop />} />
          <Route path="/kalkulator" element={<Calculator />} />
          <Route path="/pengaturan" element={<SettingsPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <nav className="tabbar" aria-label="Navigasi utama">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end={'end' in n} className={({ isActive }) => 'tab' + (isActive ? ' on' : '')}>
            <span className="ti"><Icon n={n.icon} /></span>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
