import React, { useMemo, useState } from "react";
import { Trophy, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { AVAILABLE_BADGES } from "@/lib/gamification";
import { useGamification } from "@/context/GamificationContext";

export const GamificationStatus = () => {
  const { points, badges } = useGamification();
  const earnedBadges = useMemo(() => {
    return badges.map(code => {
      const badge = AVAILABLE_BADGES[code];
      if (badge) return badge;
      return {
        code,
        name: code,
        description: "Insignia obtenida",
        icon: "🏅",
      };
    });
  }, [badges]);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-1 sm:gap-2"
          title="Ver progreso y logros"
        >
          <Trophy className="h-4 w-4" />
          <span className="font-semibold">{points}</span>
          {earnedBadges.length > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {earnedBadges.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-primary" />
              Tu Progreso
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Has acumulado <span className="font-semibold text-foreground">{points} puntos</span>
            </p>
          </div>

          {earnedBadges.length > 0 ? (
            <div>
              <h4 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <Award className="h-4 w-4" />
                Insignias Obtenidas ({earnedBadges.length})
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {earnedBadges.map((badge) => (
                  <div
                    key={badge.code}
                    className="flex items-start gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="text-2xl flex-shrink-0">{badge.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm">{badge.name}</p>
                      <p className="text-xs text-muted-foreground">{badge.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Award className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                Aún no has obtenido insignias.
                <br />
                ¡Completa cápsulas para ganarlas!
              </p>
            </div>
          )}

          {/* Show some locked badges as teaser */}
          {earnedBadges.length < Object.keys(AVAILABLE_BADGES).length && (
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">
                Por Desbloquear
              </h4>
              <div className="grid grid-cols-3 gap-2">
                {Object.values(AVAILABLE_BADGES)
                  .filter(badge => !earnedBadges.some(earned => earned.code === badge.code))
                  .slice(0, 6)
                  .map((badge) => (
                    <div
                      key={badge.code}
                      className="flex flex-col items-center p-2 rounded-lg bg-muted/30 opacity-50"
                      title={badge.name}
                    >
                      <div className="text-xl grayscale">{badge.icon}</div>
                      <p className="text-xs text-center mt-1 line-clamp-1">{badge.name}</p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
