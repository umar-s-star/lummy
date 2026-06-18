import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import DishPage from './pages/DishPage';
import AboutPage from './pages/AboutPage';
import BranchesPage from './pages/BranchesPage';
import AdminPage from './pages/AdminPage';
import { useThemeStore, useDataStore } from './store';
import { useEffect } from 'react';

export default function App() {
  const { theme } = useThemeStore();
  const syncFromBackend = useDataStore((s) => s.syncFromBackend);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Try to load live data from backend on startup (silently falls back to localStorage)
  useEffect(() => {
    syncFromBackend();
  }, []);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            fontFamily: 'Jost, sans-serif',
            fontSize: '13px',
            borderRadius: '12px',
          },
          success: {
            iconTheme: { primary: '#B8884B', secondary: '#13200F' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/"         element={<HomePage />} />
          <Route path="/menu"     element={<MenuPage />} />
          <Route path="/dish/:id" element={<DishPage />} />
          <Route path="/about"    element={<AboutPage />} />
          <Route path="/branches" element={<BranchesPage />} />
          <Route path="/admin"    element={<AdminPage />} />
          <Route path="*"         element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
