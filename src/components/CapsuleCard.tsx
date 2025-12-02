import { LucideIcon, ChevronRight, Bookmark, BookmarkCheck, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface CapsuleCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onExplore: () => void;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isCompleted?: boolean;
  isInProgress?: boolean;
  breadcrumbLabel?: string; // optional override for breadcrumb
}

export const CapsuleCard: React.FC<CapsuleCardProps> = ({
  icon: Icon,
  title,
  description,
  onExplore,
  isFavorite,
  onToggleFavorite,
  isCompleted = false,
  isInProgress = false,
  breadcrumbLabel = title,
}) => {
  return (
    <Card className="group relative border border-border/40 bg-white/60 dark:bg-card/70 backdrop-blur-sm rounded-xl shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-200 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-lg bg-rose-50 dark:bg-primary/10 flex items-center justify-center shadow-inner group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 text-slate-800 dark:text-foreground group-hover:text-primary transition-colors" />
          </div>
          <button
            onClick={onExplore}
            className="flex-1 min-w-0 text-left"
          >
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-foreground leading-snug truncate group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            {isCompleted && (
              <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0 h-4 bg-green-50 text-green-700 border-green-200">
                <CheckCircle2 className="h-2.5 w-2.5 mr-0.5" />
                Completada
              </Badge>
            )}
            {!isCompleted && isInProgress && (
              <Badge variant="outline" className="mt-1 text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-700 border-blue-200">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500 mr-1" />
                En Progreso
              </Badge>
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite();
            }}
            aria-label={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
            className="h-8 w-8 inline-flex items-center justify-center rounded-md border border-transparent hover:border-border/60 hover:bg-muted/50 transition-colors"
          >
            {isFavorite ? (
              <BookmarkCheck className="h-4 w-4 text-primary" />
            ) : (
              <Bookmark className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 flex-1 flex flex-col">
        <p className="text-sm leading-relaxed text-slate-600 dark:text-muted-foreground flex-1">
          {description}
        </p>
        <div className="flex items-center justify-start pt-2">
          <button
            type="button"
            onClick={onExplore}
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-primary transition-colors"
          >
            <span>Explorar</span>
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
};