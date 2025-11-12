// Ruta del archivo: src/components/AccessGate.tsx
// ** ATENCIÓN: Revertidos los cambios gráficos no solicitados.
// ** Mantenida la corrección del 'import { SponsorLogo }'.

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Shield, KeyRound, AlertTriangle } from 'lucide-react';
// ✅ Corrección de import (esto estaba bien)
import { SponsorLogo } from './SponsorLogo'; 

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

  // ❌ Revertido a un layout simple sin fondos ni desenfoques.
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <SponsorLogo 
            src="/BYD-Logo-White-PNG.png" // Asumo que tu CSS maneja el color de esto
            alt="Logo Observauto" 
            className="h-12 w-auto mx-auto mb-4"
          />
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Acceso Restringido
          </CardTitle>
          <CardDescription className="pt-2">
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
                className="pl-10 h-12 text-lg"
                aria-label="Código de Acceso"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-600">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
            >
              Validar Acceso
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
