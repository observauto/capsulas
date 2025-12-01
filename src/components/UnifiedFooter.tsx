```typescript
import React from "react";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FooterProps {
    lastLoadTimestamp?: string;
}

export const UnifiedFooter = ({ lastLoadTimestamp }: FooterProps) => {
    const currentYear = new Date().getFullYear();
    const loadTime = lastLoadTimestamp || new Date().toLocaleString("es-CO", {
        dateStyle: "long",
        timeStyle: "short",
    });
    
    const { user } = useAuth();
    const isDevMode = user?.id === 'dev-user-id';

    const handleResetLocalData = () => {
        if (confirm('⚠️ ¿Seguro que quieres borrar TODOS los datos locales?\n\nEsto eliminará:\n- Progreso de cápsulas\n- Premios canjeados\n- Favoritos\n- Configuraciones\n\nLa página se recargará automáticamente.')) {
            try {
                localStorage.clear();
                sessionStorage.clear();
                toast({
                    title: "Datos locales eliminados",
                    description: "Recargando la página...",
                });
                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } catch (error) {
                console.error('Error clearing storage:', error);
                toast({
                    title: "Error",
                    description: "No se pudieron eliminar los datos locales",
                    variant: "destructive"
                });
            }
        }
    };

    return (
        <footer className="w-full border-t border-border bg-muted/30 mt-16">
            <div className="max-w-6xl mx-auto px-4 py-10">
                {/* Multi-column links */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand Area */}
                    <div className="md:col-span-1">
                        <div className="flex items-center gap-2 mb-3">
                            <img
                                src="https://stats.observauto.com/pauta/logo_full.png"
                                alt="Observauto"
                                className="h-6 w-auto"
                            />
                            <span className="font-semibold text-foreground">Cápsulas</span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Observemos más autos juntos
                        </p>
                    </div>

                    {/* Aprende */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-3">Aprende</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Todas las cápsulas
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Favoritos
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Mis progresos
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Recursos */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-3">Recursos</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="https://observauto.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    Sitio principal
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Blog automotor
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Guías descargables
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contacto */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-3">Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="mailto:hola@observauto.com"
                                    className="text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    hola@observauto.com
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Redes sociales
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                                    Soporte
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <Separator className="mb-6" />

                {/* Legal line and load verification */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-2">
                        <span>© {currentYear} Observauto</span>
                        <a href="#" className="hover:text-foreground transition-colors">
                            Términos de uso
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            Privacidad
                        </a>
                        <a href="#" className="hover:text-foreground transition-colors">
                            Cookies
                        </a>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-xs">
                            Última carga: {loadTime}
                        </div>
                        {isDevMode && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleResetLocalData}
                                className="text-xs h-7 px-2 border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                                title="Borrar todos los datos locales (localStorage)"
                            >
                                <Trash2 className="h-3 w-3 mr-1" />
                                Reset Local Data
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    );
};
```
