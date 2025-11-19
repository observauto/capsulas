import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Shield, KeyRound, AlertTriangle, Loader2 } from 'lucide-react'; // Agregado loader
import { SponsorLogo } from './SponsorLogo'; 
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/hooks/use-toast';
import { ACCESS_CODE } from '@/config/accessGate';

interface AccessGateProps {
  children: React.ReactNode;
}

export default function AccessGate({ children }: AccessGateProps) {
  const { isAccessGranted, grantAccess, loading } = useAuth(); // ✅ Usamos loading
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const { toast } = useToast();

  const handleVerify = () => {
    if (code === ACCESS_CODE) {
      grantAccess();
      toast({
        title: "Acceso Correcto",
        description: "Bienvenido a Cápsulas Observauto",
        className: "bg-green-600 text-white border-none"
      });
    } else {
      setAttempts(prev => prev + 1);
      setError('Código incorrecto');
      setCode('');
      
      if (attempts >= 2) {
        toast({
          title: "Acceso Denegado",
          description: "Por favor contacta al administrador si olvidaste el código.",
          variant: "destructive"
        });
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleVerify();
    }
  };

  // ✅ CORRECCIÓN CRÍTICA: Si está cargando, NO mostrar el bloqueo, esperar.
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-observauto-blue animate-spin" />
      </div>
    );
  }

  // Si ya tiene acceso (por localStorage o sesión activa), mostrar la app
  if (isAccessGranted) {
    return <>{children}</>;
  }

  // Solo si NO está cargando y NO tiene acceso, mostrar el Gate
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
        {/* Header Visual */}
        <div className="p-8 text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-observauto-blue/20 rounded-full flex items-center justify-center mb-4 ring-4 ring-observauto-blue/10">
            <Shield className="w-10 h-10 text-observauto-blue" />
          </div>
          
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Acceso Restringido
            </h1>
            <p className="text-slate-400">
              Esta plataforma es de uso exclusivo. Por favor ingresa tu código de acceso.
            </p>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-start gap-3 text-left">
            <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-200/80">
              El acceso a esta plataforma está monitoreado y protegido.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="p-8 pt-0 space-y-6">
          <div className="space-y-4">
            <div className="relative">
              <KeyRound className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <Input
                type="password"
                placeholder="Código de acceso"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  setError('');
                }}
                onKeyDown={handleKeyDown}
                className="pl-10 bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus:ring-observauto-blue focus:border-observauto-blue transition-all h-12 text-lg tracking-widest"
              />
            </div>
            
            {error && (
              <p className="text-red-400 text-sm font-medium animate-shake">
                {error}
              </p>
            )}
          </div>

          <Button 
            onClick={handleVerify}
            className="w-full h-12 bg-observauto-blue hover:bg-observauto-blue/90 text-white font-semibold text-lg shadow-lg shadow-observauto-blue/20 transition-all duration-300"
          >
            Ingresar a la Plataforma
          </Button>

          <div className="pt-6 border-t border-white/10 flex flex-col items-center justify-center gap-4">
            <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">
              Patrocinado por
            </p>
            <div className="opacity-70 hover:opacity-100 transition-opacity">
               <SponsorLogo className="h-8 w-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
