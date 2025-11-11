// Ruta del archivo: src/pages/FullCapsule.tsx

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, Bookmark, BookmarkCheck, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Footer } from "@/components/Footer";
import { SponsorStrip } from "@/components/SponsorStrip";
import { RegistrationModal } from "@/components/RegistrationModal";
import { Sponsor } from "@/types/capsule";
import { WizardMode } from "@/components/WizardMode";
import { ArticleMode } from "@/components/ArticleMode";
import { getFullCapsuleBySlug, isCapsuleCompleted as checkIsCapsuleCompleted } from "@/lib/capsulesRepo";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useGamification } from "@/context/GamificationContext";
import { useAuth } from "@/context/AuthContext";
import { useOnlyFavorites } from "@/context/OnlyFavoritesContext";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase"; // ✅ Importar Supabase

const SPONSORS: Sponsor[] = [ { name: "BYD", logoUrl: "/BYD-Logo-White-PNG.png", link: "https://www.byd.com", accentColor: "#00447c" } ];

const FullCapsule = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addPoints, grantBadges } = useGamification();
  const [capsule, setCapsule] = useState(getFullCapsuleBySlug(slug || ""));
  const [loadTimestamp] = useState(new Date().toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" }));
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const { toggleFavorite, isFavorite } = useOnlyFavorites();

  const handleShare = async () => {
    if (!capsule) return;
    const shareData = { title: capsule.title, text: `Descubre "${capsule.title}" en ObservAuto Cápsulas`, url: window.location.href };
    try {
      if (navigator.share) await navigator.share(shareData);
      else {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast({ title: "¡Copiado!", description: "Enlace copiado al portapapeles" });
      }
    } catch (err) { console.error("Share error:", err); }
  };

  // ✅ CORRECCIÓN: Esta función ahora escribe en Supabase
  const completeCapsuleWithGamification = async () => {
    if (!capsule || !user) return;

    // Verificar si ya fue completada para no duplicar puntos
    const { data: existing, error: checkError } = await supabase
        .from('user_completed_capsules')
        .select('id')
        .eq('user_id', user.id)
        .eq('capsule_slug', capsule.slug)
        .maybeSingle();

    if (checkError) {
        console.error("Error verificando cápsula completada:", checkError);
        toast({ title: "Error", description: "No se pudo verificar el estado de la cápsula.", variant: "destructive" });
        return;
    }

    if (existing) {
        toast({ title: "Cápsula ya completada", description: "Ya has ganado los puntos por esta cápsula." });
        navigate("/");
        return;
    }

    // Guardar en Supabase
    const { error: insertError } = await supabase
      .from('user_completed_capsules')
      .insert({ user_id: user.id, capsule_slug: capsule.slug });

    if (insertError) {
      console.error("Error guardando cápsula completada:", insertError);
      toast({ title: "Error", description: "No se pudo guardar tu progreso.", variant: "destructive" });
      return;
    }

    // Lógica de gamificación
    const basePoints = 100;
    const difficultyBonus = capsule.difficulty === "advanced" ? 50 : capsule.difficulty === "intermediate" ? 25 : 0;
    const totalPoints = basePoints + difficultyBonus;
    addPoints(totalPoints);

    const badgesToGrant: string[] = [];
    if (capsule.mode === 'wizard') badgesToGrant.push('wizard_complete');
    else badgesToGrant.push('article_reader');
    
    // Aquí puedes añadir más lógica de badges si es necesario
    
    grantBadges(badgesToGrant);
    
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#1C3B71', '#D70102', '#FFD700'] });
    
    toast({
      title: `¡Cápsula Completada! 🎉`,
      description: `Has ganado ${totalPoints} puntos.`,
      duration: 5000,
    });
    
    // Notificar al dashboard para que se recargue
    window.dispatchEvent(new CustomEvent('gamification:update'));

    setTimeout(() => navigate("/"), 3000);
  };

  const handleComplete = () => {
    if (!user) {
      setShowRegistrationModal(true);
      return;
    }
    completeCapsuleWithGamification();
  };
  
  const handleContinueWithoutRegistration = () => {
    setShowRegistrationModal(false);
    toast({ title: "Modo invitado", description: "Puedes leer la cápsula, pero tu progreso no se guardará." });
  };
  
  if (!capsule) {
    return ( <div>Cápsula no encontrada</div> );
  }
  
  const isCompleted = checkIsCapsuleCompleted(capsule.slug);

  return (
    <div className="min-h-screen hero-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Volver a cápsulas</Button>
        <div className="bg-gradient-to-br from-card/95 via-card/90 to-primary/5 backdrop-blur-lg border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg mb-6">
            <div className="p-4 md:p-6 pb-3 md:pb-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">{capsule.title}</h1>
                            {isCompleted && (<Badge variant="secondary" className="flex items-center gap-1 text-xs"><CheckCircle2 className="h-3 w-3" />Completada</Badge>)}
                        </div>
                        {capsule.mode === "article" && (<p className="text-muted-foreground text-sm md:text-base leading-relaxed">{capsule.summary}</p>)}
                        {capsule.difficulty && (<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary mt-2">{capsule.difficulty === "beginner" ? "🌱 Principiante" : capsule.difficulty === "intermediate" ? "⚡ Intermedio" : "🏆 Avanzado"}</span>)}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(capsule.slug)} className="h-9 w-9 rounded-full hover:bg-primary/10" title={isFavorite(capsule.slug) ? "Quitar de favoritos" : "Añadir a favoritos"}>{isFavorite(capsule.slug) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}</Button>
                        <Button variant="ghost" size="icon" onClick={handleShare} className="h-9 w-9 rounded-full hover:bg-primary/10" title="Compartir cápsula"><Share2 className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
            {capsule.sponsors && capsule.sponsors.length > 0 && (
                <div className="px-3 pb-3"><div className="rounded-xl overflow-hidden border border-border/30 bg-background/40"><SponsorStrip sponsors={capsule.sponsors} variant="capsule" /></div></div>
            )}
        </div>
        <div className="bg-card/80 backdrop-blur border border-border/50 rounded-2xl p-6 md:p-8">
            {capsule.mode === "wizard" ? <WizardMode capsule={capsule} onComplete={handleComplete} /> : <ArticleMode capsule={capsule} onComplete={handleComplete} />}
        </div>
      </div>
      <Footer lastLoadTimestamp={loadTimestamp} />
      <Toaster />
      <RegistrationModal open={showRegistrationModal} onOpenChange={setShowRegistrationModal} onContinue={handleContinueWithoutRegistration} context="capsule" />
    </div>
  );
};

export default FullCapsule;
