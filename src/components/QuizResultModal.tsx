import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { QuizResult } from "@/types/capsule";
import { getBadge } from "@/lib/gamification";

interface QuizResultModalProps {
  result: QuizResult;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const QuizResultModal: React.FC<QuizResultModalProps> = ({
  result,
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  useEffect(() => {
    if (open && result.passed) {
      // Fire confetti
      const duration = 3000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);

        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        });
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [open, result.passed]);

  const handleViewRewards = () => {
    onOpenChange(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate("/backoffice?tab=premios");
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto rounded-2xl">
        {/* 1. Felicitaciones */}
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center text-2xl font-extrabold">
            {result.passed ? "🎉 ¡Felicitaciones! 🎉" : "😔 Sigue Practicando"}
          </DialogTitle>
          <DialogDescription className="text-center text-sm pt-1">
            {result.passed
              ? "¡Has completado exitosamente esta cápsula!"
              : "Revisa el contenido e intenta nuevamente."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-1">
          {/* 2. Puntaje Porcentaje */}
          <div className="text-center py-4 bg-gradient-to-br from-[#1C3B71]/10 via-background to-[#D70102]/10 rounded-xl border border-primary/20">
            <div className="text-5xl font-extrabold mb-1 bg-gradient-to-r from-[#1C3B71] to-[#D70102] bg-clip-text text-transparent">
              {result.scorePercent}%
            </div>
            <p className="text-xs text-muted-foreground">
              {result.correctCount} de {result.total} correctas
            </p>
          </div>

          {/* 3 y 4. Botones - Revisar respuestas y Ver premios */}
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              onClick={() => { onOpenChange(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="w-full text-sm py-2 rounded-xl font-semibold"
            >
              Revisar respuestas
            </Button>
            {result.passed && (
              <Button
                onClick={handleViewRewards}
                className="w-full text-sm py-2 rounded-xl bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white hover:opacity-90 font-semibold"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Ver premios disponibles
              </Button>
            )}
          </div>

          {/* 5. Puntos E Insignias Obtenidas - UNIFICADO */}
          {result.passed && (
            <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-3">
              {/* Título de sección */}
              <p className="text-center font-bold text-sm mb-2">Puntos e insignias Obtenidas</p>

              {/* Puntos */}
              <div className="text-center mb-2">
                <Trophy className="h-8 w-8 mx-auto mb-1 text-green-600" />
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  +{result.scorePercent + 50} puntos
                </p>
                <p className="text-[10px] text-muted-foreground">
                  {result.scorePercent} por calificación + 50 de bonificación
                </p>
              </div>

              {/* Insignias */}
              {result.badgesGranted.length > 0 && (
                <div className="border-t border-green-500/20 pt-2">
                  <div className="flex justify-center gap-2 flex-wrap">
                    {result.badgesGranted.map((badgeCode) => {
                      const badge = getBadge(badgeCode);
                      if (!badge) return null;
                      return (
                        <div
                          key={badgeCode}
                          className="text-center p-2 bg-white/50 dark:bg-slate-800/50 border border-primary/20 rounded-lg"
                          title={badge.description}
                        >
                          <div className="text-2xl">{badge.icon}</div>
                          <p className="text-[10px] font-semibold mt-0.5">{badge.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mensaje de no aprobado */}
          {!result.passed && (
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-xl p-3 text-center">
              <p className="text-xs font-medium">
                Necesitas al menos 70% para aprobar. ¡Intenta de nuevo!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
