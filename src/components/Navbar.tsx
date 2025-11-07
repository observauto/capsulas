import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTheme } from "next-themes";
import {
  Bookmark,
  BookmarkCheck,
  Menu,
  Moon,
  Share2,
  Sun,
  Trophy,
  LogOut,
  HelpCircle,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useToast } from "@/hooks/use-toast";
import { useOnlyFavorites } from "@/context/OnlyFavoritesContext";
import { cn } from "@/lib/utils";
import { useGamification } from "@/context/GamificationContext";
import { useAuth } from "@/context/AuthContext";
import { CapsuleGuideModal } from "./CapsuleGuideModal";

type PointsPillProps = {
  points: number;
  notifications?: number;
};

const PointsPill: React.FC<PointsPillProps> = ({ points, notifications }) => (
  <Link
    to="/gamificacion"
    aria-label="Ver premios y gamificación"
    className="group inline-flex h-9 items-center gap-2 rounded-full border border-border/60 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:border-blue-500 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:bg-blue-500 dark:hover:text-white dark:focus-visible:ring-offset-slate-950"
  >
    <Trophy className="h-4 w-4 text-blue-600 transition-colors group-hover:text-white dark:text-blue-400 dark:group-hover:text-white" />
    <span className="transition-colors group-hover:text-white dark:group-hover:text-white">Premios</span>
    <span
      className="transition-colors group-hover:text-white dark:group-hover:text-white"
      aria-live="polite"
    >
      {points}
    </span>
    {typeof notifications === "number" && notifications > 0 ? (
      <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold leading-none text-white">
        {notifications}
      </span>
    ) : null}
  </Link>
);

const iconButtonClass =
  "inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-white text-slate-700 shadow-sm transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-blue-500 dark:focus-visible:ring-offset-slate-950";

const textButtonClass =
  "inline-flex h-9 items-center justify-center rounded-lg border border-border/60 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-blue-500 dark:focus-visible:ring-offset-slate-950";

export const Navbar: React.FC = () => {
  const { onlyFavorites, toggleOnlyFavorites, favoritesCount } = useOnlyFavorites();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const { points } = useGamification();
  const { user, signOut, clearAccessCode, signInWithGoogle } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showGuide, setShowGuide] = useState(false);
  const pending = 0;

  useEffect(() => setMounted(true), []);

  const handleShare = async () => {
    const shareData = {
      title: "ObservAuto Cápsulas",
      text: "Descubre cápsulas de aprendizaje automotor en ObservAuto",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        if (error instanceof Error && error.name !== "AbortError") {
          console.error("Share error:", error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
        toast({ title: "¡Copiado!", description: "Enlace copiado al portapapeles" });
      } catch {
        toast({
          title: "Error",
          description: "No se pudo copiar el enlace",
          variant: "destructive",
        });
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // Usar directamente el signInWithGoogle del AuthContext
      await signInWithGoogle();
      toast({ title: "Google Sign-In", description: "Se abrirá la ventana de autenticación de Google" });
    } catch (error) {
      console.error('Error starting Google sign-in:', error);
      toast({ 
        title: "Error de autenticación", 
        description: "No se pudo iniciar sesión con Google", 
        variant: "destructive" 
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      clearAccessCode();
      toast({ title: "Sesión cerrada", description: "Has cerrado sesión exitosamente" });
      window.location.reload();
    } catch (error) {
      console.error('Error signing out:', error);
      toast({ title: "Error", description: "No se pudo cerrar sesión", variant: "destructive" });
    }
  };

  const toggleMenu = (value: boolean) => {
    setMobileMenuOpen(value);
  };

  return (
    <header
      className="sticky top-0 z-50 border-b border-border/40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 dark:border-white/10 dark:bg-slate-900/80"
      role="banner"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex flex-1 items-center gap-6">
          <a
            href="https://observauto.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center"
            aria-label="Ir a ObservAuto.com"
          >
            <img src="https://stats.observauto.com/pauta/logo_full.png" alt="ObservAuto" className="h-7 w-auto" />
          </a>

          <Link
            to="/"
            className="text-base font-semibold text-slate-900 transition-colors hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:text-slate-100 dark:hover:text-slate-300 dark:focus-visible:ring-offset-slate-950"
            style={{ letterSpacing: "-0.01em" }}
          >
            Cápsulas
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            // Usuario logueado: Avatar + Panel de Control + logout info
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="hidden sm:block">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
              </div>
              <Link to="/backoffice">
                <Button
                  variant="ghost"
                  size="icon"
                  className={iconButtonClass}
                  title="Mi Panel"
                >
                  <LayoutDashboard className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          ) : (
            // Usuario no logueado
            <Button
              variant="ghost"
              onClick={handleGoogleLogin}
              className={textButtonClass}
              aria-label="Entrar o crear cuenta"
              title="Entrar o crear cuenta"
            >
              <img src="https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png" alt="" className="h-4 w-4 mr-2" />
              <span>Entrar / Crear Cuenta</span>
            </Button>
          )}

          {/* Botones de funcionalidades */}
          <div className="inline-flex items-center gap-2 border-l border-border/40 pl-3 dark:border-white/10">
            <PointsPill points={points} notifications={pending} />
            
            <Button
              variant="ghost"
              onClick={toggleOnlyFavorites}
              aria-label={onlyFavorites ? "Ver todas las cápsulas" : "Mostrar solo favoritas"}
              className={cn(
                textButtonClass,
                onlyFavorites
                  ? "border-blue-500 bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
                  : "hover:text-white",
              )}
            >
              <div className="flex items-center gap-2">
                {onlyFavorites ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
                <span>Favoritos</span>
                <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold leading-none text-white">
                  {favoritesCount}
                </span>
              </div>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              aria-label="Compartir"
              className={iconButtonClass}
            >
              <Share2 className="h-5 w-5" />
            </Button>

            {mounted ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className={iconButtonClass}
                aria-label="Cambiar tema"
                title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
            ) : (
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent" aria-hidden />
            )}

            {/* Botón de ayuda */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowGuide(true)}
              className={iconButtonClass}
              title="Ver guía de uso"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>

            {user && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSignOut}
                className={iconButtonClass}
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex items-center md:hidden">
          <Sheet open={mobileMenuOpen} onOpenChange={toggleMenu}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative h-10 w-10 rounded-lg border border-border/60 bg-white text-slate-700 shadow-sm transition-colors hover:border-blue-500 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-950"
                aria-label="Abrir menú"
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-menu"
              >
                <Menu className="h-5 w-5" />
                <span
                  className="absolute -right-1 -top-1 inline-flex min-w-[1.5rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold leading-none text-white shadow"
                  aria-label={`Puntos: ${points}`}
                >
                  {points}
                </span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex w-[310px] flex-col gap-6 sm:w-[340px]"
              id="mobile-menu"
            >
              <div className="mt-10 flex flex-col gap-6">
                <SheetClose asChild>
                  <PointsPill points={points} notifications={pending} />
                </SheetClose>

                {/* Botón de ayuda en móvil */}
                <Button
                  variant="ghost"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  onClick={() => setShowGuide(true)}
                >
                  <HelpCircle className="h-5 w-5" />
                  <span>Guía de Uso</span>
                </Button>

                {user ? (
                  <>
                    {/* Enlace al Panel de Control */}
                    <SheetClose asChild>
                      <Link to="/backoffice">
                        <Button
                          variant="ghost"
                          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-blue-200 px-4 text-base font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-800 transition-colors w-full"
                        >
                          <LayoutDashboard className="h-5 w-5" />
                          <span>Mi Panel</span>
                        </Button>
                      </Link>
                    </SheetClose>

                    {/* Usuario logueado - mostrar avatar y logout en móvil */}
                    <SheetClose asChild>
                      <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          {user.avatar_url ? (
                            <img
                              src={user.avatar_url}
                              alt={user.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <span className="text-base font-medium text-gray-600">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={handleSignOut}
                          className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        >
                          <LogOut className="h-5 w-5" />
                        </Button>
                      </div>
                    </SheetClose>
                  </>
                ) : (
                  // Usuario no logueado - mostrar botón de login
                  <SheetClose asChild>
                    <Button
                      variant="outline"
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border/60 bg-white px-4 text-base font-medium text-slate-700 shadow-sm transition-colors hover:border-blue-500 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:text-blue-400 dark:focus-visible:ring-offset-slate-950"
                      onClick={handleGoogleLogin}
                    >
                      <img src="https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png" alt="" className="h-5 w-5" />
                      <span>Entrar / Crear Cuenta</span>
                    </Button>
                  </SheetClose>
                )}

                <div className="inline-flex items-center gap-2">
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      onClick={toggleOnlyFavorites}
                      className={cn(
                        "inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors",
                        onlyFavorites
                          ? "border-blue-500 bg-blue-600 text-white hover:bg-blue-500 hover:text-white"
                          : "hover:text-blue-700"
                      )}
                    >
                      {onlyFavorites ? <BookmarkCheck className="h-5 w-5" /> : <Bookmark className="h-5 w-5" />}
                      <span>Favoritos</span>
                      <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-bold leading-none text-white">
                        {favoritesCount}
                      </span>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(iconButtonClass, "h-11 w-11")}
                      onClick={handleShare}
                      aria-label="Compartir"
                    >
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(iconButtonClass, "h-11 w-11")}
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      aria-label="Cambiar tema"
                      title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
                    >
                      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Mostrar guía de uso si está activada */}
      <CapsuleGuideModal open={showGuide} onOpenChange={setShowGuide} />
    </header>
  );
};

export default Navbar;
