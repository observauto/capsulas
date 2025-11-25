import React from "react";

export const SponsorBar: React.FC = () => {
  return (
    <div className="w-full bg-[#4f9fde]">
      <div className="max-w-6xl mx-auto px-4 py-1 flex items-center justify-end gap-2">
        <span className="text-white text-sm font-medium">Presentadas por</span>
        <img
          src="https://www.vardi.com.co/wp-content/themes/vardi/img/logofo.svg"
          alt="Vardi"
          className="h-4 w-auto opacity-90"
        />
      </div>
    </div>
  );
};