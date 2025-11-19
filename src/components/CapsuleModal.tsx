import { X, BookOpen, Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SponsorStrip } from "@/components/SponsorStrip";
import { Sponsor } from "@/types/capsule";
import { useToast } from "@/hooks/use-toast";
import { listFullCapsules } from "@/lib/capsulesRepo";

interface Capsule {
  id: string;
  title: string;
  blurb: string;
  sections?: { h: string; p: string }[];
}

interface CapsuleModalProps {
  capsule: Capsule | null;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  sponsors?: Sponsor[];
}

export const CapsuleModal = ({
  capsule,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  sponsors = [],
}: CapsuleModalProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  if (!capsule) return null;

  // Check if this capsule has a full version
  const fullCapsules = listFullCapsules();
  const fullCapsule = fullCapsules.find(fc => 
    fc.id.includes(capsule.id) || capsule.id.includes(fc.slug.replace(/-/g, "_"))
  );

  const handleStartCapsule = () => {
    if (fullCapsule) {
      navigate(`/capsulas/${fullCapsule.slug}`);
      onClose();
    } else {
      toast({
        title: "Próximamente",
        description: "Esta cápsula completa estará disponible pronto.",
      });
    }
  };

  const handleShare = async () => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[840px] md:max-w-[900px] w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold pr-8">{capsule.title}</DialogTitle>
        </DialogHeader>

        {sponsors.length > 0 && (
          <div className="rounded-lg overflow-hidden -mx-6 mt-4">
            <SponsorStrip sponsors={sponsors} variant="capsule" />
          </div>
        )}
        
        <div className="space-y-4 mt-4">
          <p className="text-muted-foreground leading-relaxed">{capsule.blurb}</p>
          
          {capsule.sections && capsule.sections.length > 0 && (
            <div className="space-y-3">
              {capsule.sections.map((section, idx) => (
                <div key={idx} className="border-l-2 border-primary pl-3">
                  <h4 className="font-semibold text-sm">{section.h}</h4>
                  <p className="text-sm text-muted-foreground">{section.p}</p>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between pt-6 gap-2">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleFavorite}
                className="rounded-full"
                title={isFavorite ? "Quitar de favoritos" : "Añadir a favoritos"}
              >
                {isFavorite ? (
                  <BookmarkCheck className="h-5 w-5 text-primary" />
                ) : (
                  <Bookmark className="h-5 w-5" />
                )}
              </Button>

              <Button
                variant="ghost"
                size="icon"
                onClick={handleShare}
                className="rounded-full"
                title="Compartir cápsula"
              >
                <Share2 className="h-5 w-5" />
              </Button>
            </div>
            
            <Button 
              className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
              onClick={handleStartCapsule}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Empezar cápsula
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
