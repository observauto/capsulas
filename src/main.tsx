import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { OnlyFavoritesProvider } from './context/OnlyFavoritesContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <GamificationProvider>
        <OnlyFavoritesProvider>
          <App />
        </OnlyFavoritesProvider>
      </GamificationProvider>
    </AuthProvider>
  </React.StrictMode>,
);