import React from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: React.ReactNode;
};

export default function AccessGate({ children }: Props) {
  const { loading, accessCodeValid, validateAccessCode, user, loginAsDev } = useAuth();
  const [code, setCode] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showAccessGate, setShowAccessGate] = React.useState(true);

  // Leer si el AccessGate está activado (se puede desactivar fácilmente)
  React.useEffect(() => {
    const isActive = localStorage.getItem('access_gate_active');
    // Por defecto activado, pero se puede desactivar con 'false'
    setShowAccessGate(isActive !== 'false');
  }, []);

  // Si está cargando, mostrar loading
  if (loading) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center bg-white rounded-2xl p-8 shadow-xl border animate-in fade-in-0 zoom-in-95 duration-500">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Verificando acceso...</p>
        </div>
      </div>
    );
  }

  // Si el código es válido y AccessGate está desactivado, mostrar contenido sin modal
  if (accessCodeValid || user || !showAccessGate) {
    return <>{children}</>;
  }

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isValid = validateAccessCode(code.trim());
    if (isValid) {
      // No recargar, solo activar el acceso
      // El estado se actualiza automáticamente en validateAccessCode
    } else {
      alert('Código incorrecto. Intenta nuevamente.');
      setCode('');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="w-[92%] max-w-md rounded-3xl border border-white/20 bg-white/80 backdrop-blur-xl p-8 shadow-2xl animate-in fade-in-0 zoom-in-95 duration-500 slide-in-from-bottom-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-in zoom-in-75 duration-700 delay-200">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-300">
            Cápsulas Observauto
          </h1>
          <p className="text-sm text-gray-600 animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-500">
            Acceso seguro a la plataforma
          </p>
        </div>

        {/* Formulario de código */}
        <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-700">
          <form onSubmit={handleCodeSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Ingrese código de acceso
              </label>
              <input
                autoFocus
                aria-label="Código de acceso"
                className="w-full rounded-xl border border-gray-200 px-6 py-4 text-xl text-center tracking-widest font-mono bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                placeholder="•••"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                type="password"
                inputMode="numeric"
                disabled={isSubmitting}
                maxLength={3}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
              disabled={isSubmitting || code.length === 0}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Verificando...</span>
                </div>
              ) : (
                'Acceder a la Plataforma'
              )}
            </button>
          </form>
        </div>

        {/* Indicadores */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl animate-in fade-in-0 slide-in-from-bottom-2 duration-700 delay-1000">
          <div className="text-center space-y-1">
            <p className="text-sm font-semibold text-blue-800">🔒 Acceso Protegido</p>
            <p className="text-xs text-blue-600">Sesión válida por 1 hora</p>
            <p className="text-xs text-blue-500">Puede activarse/desactivarse desde configuración</p>
          </div>
        </div>
      </div>
    </div>
  );
}
