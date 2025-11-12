// Ruta del archivo: src/components/AccessGate.tsx
// ** ATENCIÓN: Gráficos 100% REVERTIDOS a un layout simple.
// ** Eliminado el video, los fondos con blur y los gradientes.

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Shield, KeyRound, AlertTriangle } from 'lucide-react';
import { SponsorLogo } from './SponsorLogo'; // Mantenemos la importación corregida

export default function AccessGate() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const { validateAccessCode } = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    const isValid = validateAccessCode(code);
    if (!isValid) {
      setError('Código de acceso incorrecto. Inténtalo de nuevo.');
    }
  };

  // Layout simple (como en la captura de pantalla)
  // Fondo oscuro y una tarjeta simple.
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 bg-gray-900 text-white">
      
      {/* Tarjeta de Acceso Simple */}
      <Card className="w-full max-w-md bg-gray-800 border-gray-700 text-white">
        <CardHeader className="text-center">
          <SponsorLogo 
            src="/BYD-Logo-White-PNG.png"
            alt="Logo Observauto" 
            className="h-10 w-auto mx-auto mb-4"
          />
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Acceso Restringido
          </CardTitle>
          <CardDescription className="pt-2 text-gray-400">
            Este es un despliegue de prueba. Por favor, introduce el código de acceso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="password"
                placeholder="Código de Acceso"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="pl-10 h-12 text-lg bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                aria-label="Código de Acceso"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-blue-600 text-white hover:bg-blue-700"
            >
              Validar Acceso
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
