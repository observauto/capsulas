// Ruta del archivo: src/main.tsx
// ** ATENCIÓN: Este archivo es NUEVO y corrige el error "useAuth debe ser usado..."
// ** envolviendo la App en los providers correctos.

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // App.tsx usa 'export default App'
import './index.css';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/context/AuthContext';
import { GamificationProvider } from '@/context/GamificationContext';
import { OnlyFavoritesProvider } from '@/context/OnlyFavoritesContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 1. AuthProvider debe ser el más externo, ya que otros contextos
           (como Gamification) dependen de él (llaman a useAuth()). */}
    <AuthProvider>
      {/* 2. GamificationProvider va dentro de AuthProvider. */}
      <GamificationProvider>
        {/* 3. OnlyFavoritesProvider también puede ir aquí. */}
        <OnlyFavoritesProvider>
          {/* 4. Finalmente, la App, que ahora puede usar useAuth() */}
          <App />
        </OnlyFavoritesProvider>
      </GamificationProvider>
    </AuthProvider>
    
    {/* El Toaster para las notificaciones va fuera de los providers */}
    <Toaster />
  </React.StrictMode>
);
