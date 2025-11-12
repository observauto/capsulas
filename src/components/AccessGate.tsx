// Ruta del archivo: src/components/AccessGate.tsx
// ** ATENCIÓN: Gráficos 100% revertidos al original.
// ** Solo se ha corregido la importación de la línea 11 para que Vercel pueda compilar.

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Shield, KeyRound, AlertTriangle } from 'lucide-react';
// ✅ CORRECCIÓN DE BUILD (Línea 11): Cambiado de 'default' a 'named' import.
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

  // ❌ Gráficos revertidos a tu layout original (el que yo modifiqué).
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4">
      {/* Fondo de Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover -z-20"
        poster="https-observauto.com/wp-content/uploads/2024/07/THUMBNAIL-CAPSULAS-OBSERVAUTO-scaled.jpg"
      >
        <source src="https://player.vimeo.com/progressive_redirect/playback/971556606/rendition/1080p/file.mp4?loc=external&log_user=0&signature=971d0c6b12a0d636b0d1e85f09456109913101861014167e419010374e89f8f4" type="video/mp4" />
      </video>
      {/* Overlay Oscuro */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/70 -z-10"></div>
      
      {/* Tarjeta de Acceso */}
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-md border-white/20 text-white">
        <CardHeader className="text-center">
          <SponsorLogo 
            src="/BYD-Logo-White-PNG.png"
            alt="Logo Observauto" 
            className="h-12 w-auto mx-auto mb-4"
          />
          <CardTitle className="text-2xl font-bold flex items-center justify-center gap-2">
            <Shield className="h-6 w-6" />
            Acceso Restringido
          </CardTitle>
          <CardDescription className="pt-2 text-gray-300">
            Este es un despliegue de prueba. Por favor, introduce el código de acceso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-300" />
              <Input
                type="password"
                placeholder="Código de Acceso"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="pl-10 h-12 text-lg bg-white/5 border-white/20 text-white placeholder:text-gray-300 focus:ring-blue-500"
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
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white hover:opacity-90"
            >
              Validar Acceso
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
