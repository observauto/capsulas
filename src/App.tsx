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
import { RootLayout } from "./layouts/RootLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AccessGate>
          <Routes>
            <Route element={<RootLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/capsula/:id" element={<FullCapsule />} />
              <Route path="/capsula/:id/quiz" element={<CapsuleQuiz />} />
              
              <Route path="/backoffice" element={<UnificadoDashboard />} />
              <Route path="/gamificacion" element={<UnificadoDashboard />} />
              
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </AccessGate>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
