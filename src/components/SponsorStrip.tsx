import React from "react";
import { SponsorLogo } from "./SponsorLogo";
import { Sponsor } from "@/types/capsule";

interface SponsorStripProps {
  sponsors: Sponsor[];
  variant?: "header" | "capsule";
}

export const SponsorStrip = ({ sponsors, variant = "header" }: SponsorStripProps) => {
  if (sponsors.length === 0) return null;

  const bgColor = variant === "header" ? "bg-[#4f9fde]" : "bg-muted/30";
  const textColor = variant === "header" ? "text-white" : "text-foreground";

  return (
    <div className={`w-full ${bgColor}`}>
      <div className={`max-w-6xl mx-auto px-4 ${variant === "header" ? "py-2" : "py-3"} flex items-center ${variant === "header" ? "justify-end" : "justify-center"} gap-3 flex-wrap`}>
        <span className={`${textColor} text-sm font-medium`}>
          {variant === "header" ? "Presentado por" : "Patrocinado por"}
        </span>
        {sponsors.map((sponsor, idx) => (
          <React.Fragment key={sponsor.name}>
            <SponsorLogo
              name={sponsor.name}
              logoUrl={sponsor.logoUrl}
              link={sponsor.link}
              accentColor={sponsor.accentColor}
              className="h-5 w-auto max-w-[100px]"
            />
            {idx < sponsors.length - 1 && (
              <span className={`${textColor} opacity-50`}>•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
