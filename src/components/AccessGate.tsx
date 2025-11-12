// Ruta del archivo: src/components/AccessGate.tsx
// ** ATENCIÓN: Corregida la línea 11 para usar una importación nombrada
// ** en lugar de una importación por defecto para SponsorLogo.

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Shield, KeyRound, AlertTriangle } from 'lucide-react';
// ✅ CORRECCIÓN: Se cambió de 'import SponsorLogo' a 'import { SponsorLogo }'
import { SponsorLogo } from './SponsorLogo'; // Importamos SponsorLogo

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
    // Si es válido, el AuthContext se actualizará y App.tsx renderizará el layout
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
      {/* Fondo sutil (opcional) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C3B71]/50 via-gray-900 to-[#D70102]/30 opacity-30 z-0"></div>
      
      <Card className="w-full max-w-md z-10 bg-white/10 backdrop-blur-lg border-white/20 text-white shadow-2xl">
        <CardHeader className="text-center">
          {/* Usamos SponsorLogo en lugar de la imagen directa */}
          <SponsorLogo 
            src="/BYD-Logo-White-PNG.png" 
            alt="Logo Observauto" 
            className="h-12 w-auto mx-auto mb-4"
          />
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Acceso Restringido
          </CardTitle>
          <CardDescription className="text-gray-300 pt-2">
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
                className="pl-10 h-12 text-lg bg-white/5 border-white/30 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
                aria-label="Código de Acceso"
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/30 p-3 rounded-md border border-red-500/50">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}
            
            <Button 
              type="submit" 
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white hover:from-[#D70102] hover:to-[#1C3B71] transition-all duration-300 transform hover:scale-105 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white"
            >
              Validar Acceso
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
