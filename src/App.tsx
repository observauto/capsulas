import { BrowserRouter as Router, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import Index from './pages/Index';
import FullCapsule from './pages/FullCapsule';
import CapsuleQuiz from './pages/CapsuleQuiz';
import NotFound from './pages/NotFound';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GamificationProvider } from './context/GamificationContext';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { TooltipProvider } from "@/components/ui/tooltip";
import AccessGate from './components/AccessGate';
import { useAccessGate } from './hooks/useAccessGate';
import UnificadoDashboard from './components/UnificadoDashboard';
import BackofficeDashboard from './components/backoffice/BackofficeDashboard';
import { useEffect } from 'react';

// Wrapper para rutas protegidas (Solo para Backoffice real)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex items-center justify-center h-screen">Cargando...</div>;
  
  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

// Componente de utilidad para resetear sesión si hay problemas
const SessionResetHandler = () => {
  const [searchParams] = useSearchParams();
  
  useEffect(() => {
    if (searchParams.get('reset') === 'true') {
      console.log('🧹 EJECUTANDO RESET DE EMERGENCIA...');
      localStorage.clear();
      sessionStorage.clear();
      // Eliminar cookies básicas si es posible (document.cookie no siempre limpia todo por httpOnly)
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
      // Recargar sin el parámetro para evitar bucle, llevando al inicio
      window.location.href = '/';
    }
  }, [searchParams]);

  return null;
};

// Componente principal con el Gate de Acceso (013)
const AppContent = () => {
  const { isVerified } = useAccessGate();

  // Si no hay código 013, mostrar Gate
  if (!isVerified) {
    return <AccessGate />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SessionResetHandler /> {/* Escucha por ?reset=true */}
      <Navbar />
      <main className="flex-grow pt-0">
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Rutas de Cápsulas */}
          <Route path="/capsula/:id" element={<FullCapsule />} />
          <Route path="/capsula/:id/quiz" element={<CapsuleQuiz />} />
          
          {/* RUTA DASHBOARD: Pública para ver premios */}
          <Route 
            path="/dashboard" 
            element={<UnificadoDashboard />} 
          />

          {/* RUTA BACKOFFICE (Admin): Protegida */}
          <Route 
            path="/backoffice" 
            element={
              <ProtectedRoute>
                <BackofficeDashboard />
              </ProtectedRoute>
            } 
          />

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <GamificationProvider>
          <TooltipProvider>
            <AppContent />
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </GamificationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
