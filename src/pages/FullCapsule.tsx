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
import { getFullCapsuleBySlug } from "@/lib/capsulesRepo";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { useGamification } from "@/context/GamificationContext";
import { useAuth } from "@/context/AuthContext";
import { useOnlyFavorites } from "@/context/OnlyFavoritesContext";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabase";

const SPONSORS: Sponsor[] = [ { name: "BYD", logoUrl: "/BYD-Logo-White-PNG.png", link: "https://www.byd.com", accentColor: "#00447c" } ];

const FullCapsule = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { addPoints, grantBadges } = useGamification();
  const [capsule, setCapsule] = useState(getFullCapsuleBySlug(slug || ""));
  const [isCompleted, setIsCompleted] = useState(false);
  const [loadTimestamp] = useState(new Date().toLocaleString("es-CO", { dateStyle: "long", timeStyle: "short" }));
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const { toggleFavorite, isFavorite } = useOnlyFavorites();

  useEffect(() => {
    const checkCompletion = async () => {
        if (!user || !slug) {
            setIsCompleted(false);
            return;
        }
        const { data } = await supabase.from('user_completed_capsules').select('id').eq('user_id', user.id).eq('capsule_slug', slug).maybeSingle();
        setIsCompleted(!!data);
    };
    checkCompletion();
  }, [user, slug]);

  const handleShare = async () => { /* ... (sin cambios) ... */ };

  const completeCapsuleWithGamification = async () => {
    if (!capsule || !user) return;
    if (isCompleted) {
        toast({ title: "Cápsula ya completada", description: "Ya has ganado los puntos por esta cápsula." });
        navigate("/");
        return;
    }

    const { error: insertError } = await supabase.from('user_completed_capsules').insert({ user_id: user.id, capsule_slug: capsule.slug });
    if (insertError) {
        if (insertError.code === '23505') { // Error de duplicado
            toast({ title: "Error", description: "Ya has completado esta cápsula." });
        } else {
            toast({ title: "Error", description: "No se pudo guardar tu progreso.", variant: "destructive" });
        }
        return;
    }
    
    setIsCompleted(true);
    const basePoints = 100;
    const difficultyBonus = capsule.difficulty === "advanced" ? 50 : capsule.difficulty === "intermediate" ? 25 : 0;
    const totalPoints = basePoints + difficultyBonus;
    addPoints(totalPoints);
    
    const badgesToGrant: string[] = ['primera_capsula'];
    if (capsule.mode === 'wizard') badgesToGrant.push('wizard_complete'); else badgesToGrant.push('article_reader');
    
    grantBadges(badgesToGrant);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: ['#1C3B71', '#D70102', '#FFD700'] });
    toast({ title: `¡Cápsula Completada! 🎉`, description: `Has ganado ${totalPoints} puntos.`, duration: 5000 });
    
    window.dispatchEvent(new CustomEvent('gamification:update'));
    setTimeout(() => navigate("/"), 3000);
  };

  const handleComplete = () => {
    if (!user) { setShowRegistrationModal(true); return; }
    completeCapsuleWithGamification();
  };
  
  const handleContinueWithoutRegistration = () => {
    setShowRegistrationModal(false);
    toast({ title: "Modo invitado", description: "Puedes leer la cápsula, pero tu progreso no se guardará." });
  };
  
  if (!capsule) return ( <div>Cápsula no encontrada</div> );

  return (
    <div className="min-h-screen hero-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4"><ArrowLeft className="h-4 w-4 mr-2" />Volver a cápsulas</Button>
        <div className="bg-gradient-to-br from-card/95 via-card/90 to-primary/5 backdrop-blur-lg border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg mb-6">
            <div className="p-4 md:p-6 pb-3 md:pb-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap"><h1 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">{capsule.title}</h1>{isCompleted && (<Badge variant="secondary" className="flex items-center gap-1 text-xs"><CheckCircle2 className="h-3 w-3" />Completada</Badge>)}</div>
                        {capsule.mode === "article" && (<p className="text-muted-foreground text-sm md:text-base leading-relaxed">{capsule.summary}</p>)}
                        {capsule.difficulty && (<span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary mt-2">{capsule.difficulty === "beginner" ? "🌱 Principiante" : capsule.difficulty === "intermediate" ? "⚡ Intermedio" : "🏆 Avanzado"}</span>)}
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Button variant="ghost" size="icon" onClick={() => toggleFavorite(capsule.slug)} className="h-9 w-9 rounded-full hover:bg-primary/10" title={isFavorite(capsule.slug) ? "Quitar de favoritos" : "Añadir a favoritos"}>{isFavorite(capsule.slug) ? <BookmarkCheck className="h-4 w-4 text-primary" /> : <Bookmark className="h-4 w-4" />}</Button>
                        <Button variant="ghost" size="icon" onClick={handleShare} className="h-9 w-9 rounded-full hover:bg-primary/10" title="Compartir cápsula"><Share2 className="h-4 w-4" /></Button>
                    </div>
                </div>
            </div>
            {capsule.sponsors && capsule.sponsors.length > 0 && (<div className="px-3 pb-3"><div className="rounded-xl overflow-hidden border border-border/30 bg-background/40"><SponsorStrip sponsors={capsule.sponsors} variant="capsule" /></div></div>)}
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
