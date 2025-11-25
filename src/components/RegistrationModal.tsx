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

        <div className="space-y-6 py-2">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">
              {context === 'capsule'
                ? '🌟 Regístrate ahora y gana puntos (+100) mientras lees esta cápsula. ¡Es gratis!'
                : '¡Estás a punto de completar este quiz! Para ganar puntos y insignias, necesitas registrarte.'
              }
            </p>
          </div>

          {/* Beneficios destacados */}
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4 border border-primary/20">
            <h3 className="font-semibold text-primary mb-3 flex items-center gap-2">
              <Gift className="h-5 w-5" />
              ¿Qué obtienes al registrarte?
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#FFA500] rounded-full flex items-center justify-center flex-shrink-0">
                  <Trophy className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Gana puntos por cada cápsula</p>
                  <p className="text-xs text-muted-foreground">+100 puntos base + bonus por dificultad</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Star className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Colecciona insignias exclusivas</p>
                  <p className="text-xs text-muted-foreground">Logros únicos por completar cápsulas</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">Acceso a contenido premium</p>
                  <p className="text-xs text-muted-foreground">Capasulas exclusivas para miembros</p>
                </div>
              </div>
            </div>
          </div>

          {/* Badges de ejemplo */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Ejemplos de insignias que puedes ganar:</p>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary" className="bg-gradient-to-r from-[#1C3B71]/10 to-[#1C3B71]/5 text-[#1C3B71] border-[#1C3B71]/20">
                🏆 Experto en Flotas
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-[#D70102]/10 to-[#D70102]/5 text-[#D70102] border-[#D70102]/20">
                ⚡ Pro GNV
              </Badge>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500/10 to-green-500/5 text-green-600 border-green-500/20">
                🛡️ Seguridad Vial
              </Badge>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3 pt-2">
            <Button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02]"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Registrarse Ahora
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>

            <Button
              onClick={handleContinue}
              variant="outline"
              className="w-full border-2 border-primary/20 hover:bg-primary/5 font-medium py-3 rounded-xl transition-all"
            >
              Continuar sin Registro
              <span className="text-sm text-muted-foreground ml-2">(No ganarás puntos)</span>
            </Button>
          </div>

          <div className="text-center pt-2 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              ¿Ya tienes cuenta?
              <Button
                variant="link"
                className="p-0 h-auto text-primary font-semibold ml-1"
                onClick={() => navigate('/gamificacion')}
              >
                Inicia sesión aquí
              </Button>
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};