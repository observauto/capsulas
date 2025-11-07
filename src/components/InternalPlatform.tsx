import React from "react";
import { useAuth } from "@/context/AuthContext";

type Props = {
  children: React.ReactNode;
};

export default function InternalPlatform({ children }: Props) {
  const { accessCodeValid } = useAuth();

  // Si no tiene código válido, no mostrar contenido
  if (!accessCodeValid) {
    return null;
  }

  return (
    <>
      {children}
      {/* Solo se muestra la guía de los 5 pasos a través de CapsuleGuideButton */}
    </>
  );
}
