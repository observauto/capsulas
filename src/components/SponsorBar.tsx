import React from "react";

export const SponsorBar: React.FC = () => {
  return (
    <div className="w-full bg-[#4f9fde]">
      <div className="max-w-6xl mx-auto px-4 py-1 flex items-center justify-end gap-2">
        <span className="text-white text-sm font-medium">Presentado por</span>
        <img
          src="/BYD-Logo-White-PNG.png"
          alt="BYD"
          className="h-4 w-auto opacity-90"
        />
      </div>
    </div>
  );
};