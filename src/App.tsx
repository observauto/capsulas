import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AccessGate from "./components/AccessGate";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import FullCapsule from "./pages/FullCapsule";
import CapsuleQuiz from "./pages/CapsuleQuiz";
import { UnificadoDashboard } from "./components/UnificadoDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AccessGate>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/capsula/:id" element={<FullCapsule />} />
            <Route path="/capsula/:id/quiz" element={<CapsuleQuiz />} />
            
            {/* Ruta Unificada para Dashboard: Ambas direcciones llevan al mismo panel nuevo */}
            <Route path="/backoffice" element={<UnificadoDashboard />} />
            <Route path="/gamificacion" element={<UnificadoDashboard />} />
            
            {/* Ruta 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AccessGate>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
