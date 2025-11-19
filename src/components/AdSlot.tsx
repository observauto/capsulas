import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AdSlotProps {
  slotId?: string;
  className?: string;
}

export const AdSlot = ({ slotId, className = "" }: AdSlotProps) => {
  return (
    <Card 
      className={`border-border/30 bg-gradient-to-br from-[#1C3B71]/5 to-[#D70102]/5 ${className}`}
      role="complementary"
      aria-label="Espacio publicitario"
      data-slot-id={slotId || "ad-slot"}
    >
      <CardContent className="p-6 flex flex-col items-center justify-center min-h-[120px] md:min-h-[180px] text-center">
        <div className="w-full h-24 md:h-32 bg-muted/20 rounded-lg mb-3 flex items-center justify-center">
          <span className="text-muted-foreground/40 text-sm">[ Espacio de pauta ]</span>
        </div>
        <span className="text-xs text-muted-foreground/60 font-medium uppercase tracking-wide">
          Patrocinado
        </span>
      </CardContent>
    </Card>
  );
};
