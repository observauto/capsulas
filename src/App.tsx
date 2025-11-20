import AccessGate from "@/components/AccessGate";
import InternalPlatform from "@/components/InternalPlatform";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import FullCapsule from "./pages/FullCapsule";
import Gamificacion from "./pages/Gamificacion";
import NotFound from "./pages/NotFound";
import { RootLayout } from "@/layouts/RootLayout";
import { GamificationProvider } from "@/context/GamificationContext";
import { AuthProvider } from "@/context/AuthContext";
import { OnlyFavoritesProvider } from "@/context/OnlyFavoritesContext";
import BackofficeDashboard from "@/components/backoffice/BackofficeDashboard";
import UnificadoDashboard from "@/components/UnificadoDashboard";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

// Feature flag (default ON). Set VITE_USE_GLOBAL_LAYOUT=false to fall back to legacy per-page header/footer.
const useGlobalLayout = import.meta.env?.VITE_USE_GLOBAL_LAYOUT !== "false";

// Componente de redirección
const GamificacionRedirect = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate('/backoffice');
  }, [navigate]);
  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <OnlyFavoritesProvider>
              <GamificationProvider>
                {/* AccessGate es la capa externa - solo maneja código "013" */}
              <AccessGate>
                {/* InternalPlatform es la capa interna - maneja Google Sign-In, UserGuide, paneles */}
                <InternalPlatform>
                  {useGlobalLayout ? (
                    <RootLayout>
                      <Routes>
                        <Route path="/" element={<Index />} />
                        <Route path="/capsulas/:slug" element={<FullCapsule />} />
                        <Route path="/gamificacion" element={<GamificacionRedirect />} />
                        <Route path="/backoffice" element={<UnificadoDashboard />} />
                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </RootLayout>
                  ) : (
                    // Legacy mode: pages still include their own Navbar/Footer (will be removed in future)
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/capsulas/:slug" element={<FullCapsule />} />
                      <Route path="/gamificacion" element={<GamificacionRedirect />} />
                      <Route path="/backoffice" element={<UnificadoDashboard />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  )}
                </InternalPlatform>
              </AccessGate>
              </GamificationProvider>
            </OnlyFavoritesProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
