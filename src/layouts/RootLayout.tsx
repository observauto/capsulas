import React from "react";
import { OnlyFavoritesProvider } from "@/context/OnlyFavoritesContext";
import { Navbar } from "@/components/Navbar";
import { SponsorBar } from "@/components/SponsorBar";

interface RootLayoutProps {
  children: React.ReactNode;
}

export const RootLayout: React.FC<RootLayoutProps> = ({ children }) => {
  return (
    <OnlyFavoritesProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <SponsorBar />
        <main className="flex-1">
          {children}
        </main>
      </div>
    </OnlyFavoritesProvider>
  );
};
