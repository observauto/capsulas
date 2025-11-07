import React from "react";

export interface SponsorLogoProps {
  name: string;
  logoUrl: string;
  link?: string;
  accentColor?: string;
  className?: string;
}

export const SponsorLogo = ({ 
  name, 
  logoUrl, 
  link, 
  accentColor, 
  className = "" 
}: SponsorLogoProps) => {
  const imageElement = (
    <img
      src={logoUrl}
      alt={`${name} Logo`}
      className={`h-6 w-auto max-w-[120px] object-contain ${className}`}
      style={accentColor ? { filter: `drop-shadow(0 0 2px ${accentColor})` } : undefined}
      onError={(e) => {
        // Fallback for broken images
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        const parent = target.parentElement;
        if (parent) {
          const fallback = document.createElement('span');
          fallback.textContent = name;
          fallback.className = 'text-sm font-medium text-foreground';
          parent.appendChild(fallback);
        }
      }}
    />
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className="hover:opacity-80 transition-opacity"
        aria-label={`Visit ${name}`}
      >
        {imageElement}
      </a>
    );
  }

  return imageElement;
};
