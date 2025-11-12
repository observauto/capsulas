import React from "react";
import { Button } from "@/components/ui/button";
import { Trophy, CheckCircle2 } from "lucide-react";

interface Props { onStart: () => void; bestScore?: number; passed?: boolean; className?: string; }
export const QuizLaunchPanel: React.FC<Props> = ({ onStart, bestScore, passed, className }) => {
  return (
    <div className={`mt-10 p-6 border rounded-xl bg-gradient-to-br from-primary/5 via-background to-background ${className || ""}`}> 
      <div className="flex items-center gap-3 mb-3">
        <Trophy className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold">Pon a prueba lo aprendido</h3>
      </div>
      <p className="text-sm text-muted-foreground mb-4">Responde el quiz para ganar puntos extra y desbloquear logros.</p>
      {bestScore !== undefined && (
        <p className="text-xs mb-2">Mejor puntaje: <span className="font-semibold">{bestScore}%</span>{" "}{passed && <span className="text-green-600 font-medium inline-flex items-center gap-1"><CheckCircle2 className="h-3 w-3" />Aprobado</span>}</p>
      )}
      <Button onClick={onStart} className="gap-2">Iniciar Quiz</Button>
    </div>
  );
};