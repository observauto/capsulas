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
      navigate("/gamificacion");
    }, 100);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[95vh] overflow-y-auto rounded-3xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-center text-3xl md:text-4xl font-extrabold">
            {result.passed ? "🎉 ¡Felicitaciones! 🎉" : "😔 Sigue Practicando"}
          </DialogTitle>
          <DialogDescription className="text-center text-base pt-2">
            {result.passed
              ? "¡Has completado exitosamente esta cápsula!"
              : "No te desanimes, revisa el contenido e intenta nuevamente."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Score Display */}
          <div className="text-center py-8 bg-gradient-to-br from-[#1C3B71]/10 via-background to-[#D70102]/10 rounded-3xl border-2 border-primary/20">
            <div className="text-7xl md:text-8xl font-extrabold mb-4 bg-gradient-to-r from-[#1C3B71] to-[#D70102] bg-clip-text text-transparent">
              {result.scorePercent}%
            </div>
            <p className="text-lg md:text-xl text-muted-foreground">
              {result.correctCount} de {result.total} correctas
            </p>
          </div>

          {result.passed && (
            <>
              {/* Points Earned */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-2 border-green-500/30 rounded-2xl p-6 text-center">
                <Trophy className="h-12 w-12 mx-auto mb-3 text-green-600" />
                <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                  +{result.scorePercent + 50} puntos
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {result.scorePercent} por calificación + 50 de bonificación
                </p>
              </div>

              {/* Badges */}
              {result.badgesGranted.length > 0 && (
                <div className="space-y-3">
                  <p className="text-center font-bold text-xl">Insignias obtenidas:</p>
                  <div className="grid grid-cols-2 gap-4">
                    {result.badgesGranted.map((badgeCode) => {
                      const badge = getBadge(badgeCode);
                      if (!badge) return null;
                      return (
                        <div
                          key={badgeCode}
                          className="text-center p-5 bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl hover:scale-105 transition-transform"
                          title={badge.description}
                        >
                          <div className="text-5xl mb-3">{badge.icon}</div>
                          <p className="text-base font-semibold">{badge.name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}

          {!result.passed && (
            <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border-2 border-red-500/30 rounded-2xl p-6 text-center">
              <p className="text-lg font-medium">
                Necesitas al menos 70% para aprobar. ¡Revisa el contenido e intenta de nuevo!
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-3 pt-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="lg"
            className="w-full text-lg py-7 rounded-2xl font-semibold"
          >
            Revisar respuestas
          </Button>
          {result.passed && (
            <Button
              onClick={handleViewRewards}
              size="lg"
              className="w-full text-lg py-7 rounded-2xl bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white hover:opacity-90 font-semibold"
            >
              <Trophy className="h-6 w-6 mr-2" />
              Ver premios disponibles
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
