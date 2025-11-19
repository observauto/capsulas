import React from "react";
import { useGamification } from "@/context/GamificationContext";

export const GamificationCounter: React.FC<{ className?: string }> = ({ className }) => {
  const { points, badges } = useGamification();
  const badgeCount = badges.length;

  return (
    <span
      className={
        "inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary text-xs font-semibold px-2 py-1 " +
        (className || "")
      }
      title="Tus puntos"
      aria-label={`Puntos: ${points}. Insignias: ${badgeCount}`}
    >
      ⭐ {points}
      <span className="sr-only">{`Insignias obtenidas: ${badgeCount}`}</span>
    </span>
  );
};
