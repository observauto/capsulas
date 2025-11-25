import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { UserPlus, Trophy, Star, Gift, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface RegistrationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onContinue: () => void;
  context?: string; // 'capsule' | 'quiz'
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  open,
  onOpenChange,
  onContinue,
  context = 'capsule'
}) => {
  const navigate = useNavigate();
  const { signInWithGoogle } = useAuth();

  const handleRegister = async () => {
    try {
      // Redirect back to current page after login
      const currentUrl = window.location.href;
      await signInWithGoogle();

      // Store the return URL in sessionStorage to redirect after login
      sessionStorage.setItem('returnToCapsule', currentUrl);

      onOpenChange(false);
    } catch (error) {
      console.error('Error signing in:', error);
      // Fallback to navigation if sign in fails
      navigate('/gamificacion');
    }
  };

  const handleContinue = () => {
    onContinue();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto bg-gradient-to-br from-background via-background to-primary/5 border-2 border-primary/20 rounded-2xl shadow-2xl">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto mb-4 w-16 h-16 bg-gradient-to-br from-[#1C3B71] to-[#D70102] rounded-full flex items-center justify-center shadow-lg">
            <UserPlus className="h-8 w-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-[#1C3B71] to-[#D70102] bg-clip-text text-transparent">
            ¡Regístrate para Ganar!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-1">
          <div className="text-center">
            <p className="text-sm font-semibold text-muted-foreground">
              {context === 'capsule'
                ? '🌟 ¡Regístrate gratis y gana +100 puntos!'
                : '¡Regístrate para ganar puntos e insignias!'}
            </p>
          </div>

          {/* Beneficios ultra-compactos */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg p-2.5 border border-primary/20">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3 w-3 text-yellow-600 flex-shrink-0" />
                <span>Puntos por cada cápsula</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Star className="h-3 w-3 text-purple-600 flex-shrink-0" />
                <span>Insignias exclusivas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Gift className="h-3 w-3 text-green-600 flex-shrink-0" />
                <span>Premios canjeables</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-2 pt-1">
            <Button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white font-semibold py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Registrarse Ahora
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>

            <Button
              onClick={handleContinue}
              variant="outline"
              className="w-full border-2 border-primary/20 hover:bg-primary/5 font-medium py-2 rounded-xl transition-all text-sm"
            >
              Continuar sin Registro
              <span className="text-xs text-muted-foreground ml-1.5">(No ganarás puntos)</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};