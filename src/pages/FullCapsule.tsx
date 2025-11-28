import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Bookmark, BookmarkCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UnifiedFooter } from "@/components/UnifiedFooter";
import { SponsorStrip } from "@/components/SponsorStrip";
import { RegistrationModal } from "@/components/RegistrationModal";
import { Sponsor } from "@/types/capsule";
import { WizardMode } from "@/components/WizardMode";
import { ArticleMode } from "@/components/ArticleMode";
import { getFullCapsuleBySlug, isCapsuleCompleted } from "@/lib/capsulesRepo";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useGamification } from "@/context/GamificationContext";
import { useAuth } from "@/context/AuthContext";
import { useOnlyFavorites } from "@/context/OnlyFavoritesContext";
import confetti from "canvas-confetti";
import { readUserScopedJSON, writeUserScopedJSON } from "@/lib/user-storage";

const SPONSORS: Sponsor[] = [
  {
    name: "Sponsor A",
    logoUrl: "https://placehold.co/200x80/1C3B71/FFFFFF?text=Sponsor+A",
    link: "https://example.com",
    accentColor: "#1C3B71",
  },
  {
    name: "Sponsor B",
    logoUrl: "https://placehold.co/200x80/D70102/FFFFFF?text=Sponsor+B",
    link: "https://example.com",
    accentColor: "#D70102",
  },
  {
    name: "Sponsor C",
    logoUrl: "https://placehold.co/200x80/00447c/FFFFFF?text=Sponsor+C",
    link: "https://example.com",
    accentColor: "#00447c",
  },
];

const FullCapsule = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addPoints, grantBadges } = useGamification();
  const [capsule, setCapsule] = useState(getFullCapsuleBySlug(slug || ""));
  const [loadTimestamp] = useState(new Date().toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  }));

  // Estado del modal de registro
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  // Favorites - usando el contexto OnlyFavoritesContext
  const { toggleFavorite, isFavorite } = useOnlyFavorites();

  // Mostrar modal de registro al inicio si el usuario no está autenticado
  useEffect(() => {
    if (!user && capsule) {
      // Verificar si el modal ya fue mostrado para esta cápsula
      const modalShownKey = `registration_modal_shown_${capsule.slug}`;
      const hasShownModal = sessionStorage.getItem(modalShownKey);

      if (!hasShownModal) {
        // Pequeño delay para evitar que aparezca inmediatamente al cargar
        const timer = setTimeout(() => {
          setShowRegistrationModal(true);
        }, 1000); // 1 segundo de delay

        return () => clearTimeout(timer);
      }
    }
  }, [user, capsule]);

  // Manejar el cierre del modal de registro
  const handleRegistrationModalClose = (open: boolean) => {
    setShowRegistrationModal(open);
    if (!open && capsule) {
      // Marcar que el modal fue mostrado para esta cápsula
      sessionStorage.setItem(`registration_modal_shown_${capsule.slug}`, 'true');
    }
  };

  const handleShare = async () => {
    if (!capsule) return;

    const shareData = {
      title: capsule.title,
      text: `Descubre "${capsule.title}" en ObservAuto Cápsulas`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Share error:", err);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast({
          title: "¡Copiado!",
          description: "El enlace se copió al portapapeles",
        });
      } catch (err) {
        console.error("Clipboard error:", err);
        toast({
          title: "Error",
          description: "No se pudo copiar el enlace",
          variant: "destructive",
        });
      }
    }
  };

  const handleComplete = () => {
    if (!capsule) return;

    // Verificar si el usuario está autenticado
    if (!user) {
      // Usuario no autenticado, mostrar modal de registro
      setShowRegistrationModal(true);
      return;
    }

    // Usuario autenticado, proceder con la lógica de gamificación
    completeCapsuleWithGamification();
  };

  const handleContinueWithoutRegistration = () => {
    // Simplemente cerrar el modal para permitir lectura sin registro
    setShowRegistrationModal(false);
  };

  const completeCapsuleWithGamification = () => {
    if (!capsule) return;

    // 🎮 GAMIFICACIÓN: La lógica de puntos y badges principales se maneja en el Quiz
    // Aquí solo hacemos la celebración visual y navegación

    // 🎉 Celebración visual
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#1C3B71', '#D70102', '#FFD700']
    });

    toast({
      title: `¡Cápsula Completada! 🎉`,
      description: `Has completado la cápsula exitosamente.`,
      duration: 3000,
    });

    // Navigate back after a short delay
    setTimeout(() => {
      navigate("/");
    }, 2000);
  };

  const isCompleted = capsule ? isCapsuleCompleted(capsule.slug) : false;

  if (!capsule) {
    return (
      <div className="min-h-screen hero-bg">
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold mb-4">Cápsula no encontrada</h1>
          <p className="text-muted-foreground mb-6">
            La cápsula que buscas no existe o no está disponible.
          </p>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Button>
        </div>
        <UnifiedFooter lastLoadTimestamp={loadTimestamp} />
      </div>
    );
  }

  return (
    <div className="min-h-screen hero-bg">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 py-4 md:py-6">
        <div className="mb-4 md:mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a cápsulas
          </Button>

          {/* Rediseño compacto y atractivo - Optimizado para móvil */}
          <div className="bg-gradient-to-br from-card/95 via-card/90 to-primary/5 backdrop-blur-lg border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg">
            {/* Header compacto con título y acciones */}
            <div className="p-3 md:p-5 pb-2 md:pb-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5 fle x-wrap">
                    <h1 className="text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight leading-tight">
                      {capsule.title}
                    </h1>
                    {isCompleted && (
                      <Badge variant="secondary" className="flex items-center gap-1 text-xs flex-shrink-0">
                        <CheckCircle2 className="h-3 w-3" />
                        Completada
                      </Badge>
                    )}
                  </div>

                  {/* Summary - Oculto en móvil, visible en tablet+ solo en modo article */}
                  {capsule.mode === "article" && (
                    <p className="hidden md:block text-muted-foreground text-sm leading-relaxed">
                      {capsule.summary}
                    </p>
                  )}

                  {/* Nivel de dificultad compacto */}
                  {capsule.difficulty && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/15 text-primary mt-1.5">
                      {capsule.difficulty === "beginner" ? "🌱 Principiante" :
                        capsule.difficulty === "intermediate" ? "⚡ Intermedio" :
                          "🏆 Avanzado"}
                    </span>
                  )}
                </div>

                {/* Acciones compactas */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (capsule) {
                        toggleFavorite(capsule.slug);
                      }
                    }}
                    className="h-8 w-8 md:h-9 md:w-9 rounded-full hover:bg-primary/10"
                    title={isFavorite(capsule.slug) ? "Quitar de favoritos" : "Añadir a favoritos"}
                  >
                    {isFavorite(capsule.slug) ? (
                      <BookmarkCheck className="h-4 w-4 text-primary" />
                    ) : (
                      <Bookmark className="h-4 w-4" />
                    )}
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleShare}
                    className="h-8 w-8 md:h-9 md:w-9 rounded-full hover:bg-primary/10"
                    title="Compartir cápsula"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Sponsor Strip integrado y compacto */}
            <div className="px-2 md:px-3 pb-2 md:pb-3">
              <div className="rounded-xl overflow-hidden border border-border/30 bg-background/40">
                <SponsorStrip sponsors={SPONSORS} variant="capsule" />
              </div>
            </div>
          </div>
        </div>

        {/* Mode-specific content */}
        <div className="bg-card/80 backdrop-blur border border-border/50 rounded-2xl p-4 md:p-6">
          {capsule.mode === "wizard" ? (
            <WizardMode capsule={capsule} onComplete={handleComplete} />
          ) : (
            <ArticleMode capsule={capsule} onComplete={handleComplete} />
          )}
        </div>
      </div>

      <UnifiedFooter lastLoadTimestamp={loadTimestamp} />
      <Toaster />

      {/* Modal de registro para usuarios no autenticados */}
      <RegistrationModal
        open={showRegistrationModal}
        onOpenChange={handleRegistrationModalClose}
        onContinue={handleContinueWithoutRegistration}
        context="capsule"
      />
    </div>
  );
};

export default FullCapsule;
