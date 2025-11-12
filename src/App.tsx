// Ruta del archivo: src/App.tsx
// ** ATENCIÓN: Este archivo ahora implementa la lógica del Access Gate "013" **

import { BrowserRouter as Router } from 'react-router-dom';
import RootLayout from './layouts/RootLayout';
import { useAuth } from './context/AuthContext';
import AccessGate from './components/AccessGate';
import { RefreshCw } from 'lucide-react';

function App() {
  // Obtenemos los estados del AuthContext
  const { loading, accessCodeValid } = useAuth();

  // 1. Si el contexto está en su carga inicial (comprobando auth Y código "013")
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <RefreshCw className="h-10 w-10 mx-auto animate-spin text-primary" />
          <p className="mt-4 text-lg text-gray-700">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // 2. Si la carga terminó Y el código "013" NO es válido
  if (!accessCodeValid) {
    return <AccessGate />;
  }

  // 3. Si la carga terminó Y el código "013" SÍ es válido
  return (
    <Router>
      <RootLayout />
    </Router>
  );
}

export default App;
