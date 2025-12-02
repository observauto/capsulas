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
    Home,
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
        to="/backoffice?tab=premios"
        aria-label="Ver premios y gamificación"
        className="group inline-flex h-9 items-center gap-2 rounded-lg border border-border/60 bg-white px-3 text-sm font-medium text-slate-900 shadow-sm transition-colors hover:border-blue-500 hover:bg-blue-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:hover:border-blue-400 dark:hover:bg-blue-500 dark:hover:text-white dark:focus-visible:ring-offset-slate-950"
    >
        <Trophy className="h-4 w-4 text-blue-600 transition-colors group-hover:text-white dark:text-blue-400 dark:group-hover:text-white" />
        <span className="transition-colors group-hover:text-white dark:group-hover:text-white">Puntos</span>
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
    const { user, signInWithGoogle, signOut, loginAsDev } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const pending = 0;

    useEffect(() => setMounted(true), []);

    // Helper para cerrar el menú móvil después de una acción
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        // Scroll al inicio de la página
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

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

                    <div className="hidden md:flex items-center ml-4 border-l border-gray-200 pl-4 h-6">
                        <Link
                            to="/"
                            className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors dark:text-slate-400 dark:hover:text-blue-400"
                        >
                            <Home className="h-4 w-4" />
                            Inicio
                        </Link>
                    </div>
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
                            <Link to="/backoffice?tab=resumen">
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
                        <>
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

                            {/* Dev Login Button - Temporary for local testing */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-xs text-muted-foreground"
                                onClick={() => loginAsDev()}
                            >
                                🛠️ Dev
                            </Button>
                        </>
                    )}

                    {/* Botones de funcionalidades */}
                    <div className="inline-flex items-center gap-2 border-l border-border/40 pl-3 dark:border-white/10">
                        <PointsPill points={user ? points : 0} notifications={pending} />

                        {user && (
                            <Link to="/backoffice?tab=capsulas&filter=favorites">
                                <Button
                                    variant="ghost"
                                    aria-label="Mostrar solo favoritas"
                                    className={cn(
                                        textButtonClass,
                                        "hover:text-orange-700 hover:bg-orange-50",
                                    )}
                                >
                                    <div className="flex items-center gap-2">
                                        <Bookmark className="h-4 w-4" />
                                        <span>Favoritos</span>
                                        <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold leading-none text-white">
                                            {favoritesCount}
                                        </span>
                                    </div>
                                </Button>
                            </Link>
                        )}

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
                                    aria-label={`Puntos: ${user ? points : 0}`}
                                >
                                    {user ? points : 0}
                                </span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="right"
                            className="flex w-[300px] flex-col gap-0 p-0 sm:w-[340px] border-l border-border/40 bg-white/95 backdrop-blur-xl dark:bg-slate-900/95"
                            id="mobile-menu"
                        >
                            <div className="flex flex-col h-full">
                                {/* Header del Menú - Perfil de Usuario */}
                                <div className="p-6 border-b border-border/40 bg-slate-50/50 dark:bg-slate-800/50">
                                    {user ? (
                                        <div className="flex items-center gap-4">
                                            {user.avatar_url ? (
                                                <img
                                                    src={user.avatar_url}
                                                    alt={user.name}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm dark:border-slate-700"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center border-2 border-white shadow-sm dark:border-slate-700 dark:bg-blue-900">
                                                    <span className="text-lg font-bold text-blue-600 dark:text-blue-300">
                                                        {user.name.charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-slate-900 truncate dark:text-slate-100">
                                                    {user.name}
                                                </p>
                                                <p className="text-xs text-slate-500 truncate dark:text-slate-400">
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <p className="text-sm font-medium text-slate-600 mb-3 dark:text-slate-400">
                                                Bienvenido a ObservAuto
                                            </p>
                                            <SheetClose asChild>
                                                <Button
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                                                    onClick={handleGoogleLogin}
                                                >
                                                    <img src="https://www.gstatic.com/images/branding/product/1x/gsa_48dp.png" alt="" className="h-4 w-4 mr-2 brightness-0 invert" />
                                                    Iniciar Sesión
                                                </Button>
                                            </SheetClose>
                                        </div>
                                    )}
                                </div>

                                {/* Cuerpo del Menú - Enlaces */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                                    <SheetClose asChild>
                                        <div onClick={closeMobileMenu}>
                                            <Link
                                                to="/"
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                    <Home className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Inicio</span>
                                            </Link>
                                        </div>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <div onClick={closeMobileMenu}>
                                            <Link
                                                to="/backoffice?tab=premios"
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                                                    <Trophy className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Mis Puntos</p>
                                                    <p className="text-xs text-slate-500 dark:text-slate-400">{user ? points : 0} puntos acumulados</p>
                                                </div>
                                            </Link>
                                        </div>
                                    </SheetClose>

                                    {user && (
                                        <SheetClose asChild>
                                            <Link
                                                to="/backoffice?tab=resumen"
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
                                                onClick={closeMobileMenu}
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400">
                                                    <LayoutDashboard className="h-4 w-4" />
                                                </div>
                                                <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Mi Panel de Control</span>
                                            </Link>
                                        </SheetClose>
                                    )}

                                    {user && (
                                        <SheetClose asChild>
                                            <Link
                                                to="/backoffice?tab=capsulas&filter=favorites"
                                                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors dark:hover:bg-slate-800"
                                                onClick={closeMobileMenu}
                                            >
                                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400">
                                                    <Bookmark className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1 flex items-center justify-between">
                                                    <span className="text-sm font-medium text-slate-900 dark:text-slate-100">Mis Favoritos</span>
                                                    <span className="inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-orange-600 px-1 text-[10px] font-bold leading-none text-white">
                                                        {favoritesCount}
                                                    </span>
                                                </div>
                                            </Link>
                                        </SheetClose>
                                    )}

                                    <div className="my-2 border-t border-border/40 dark:border-white/10" />

                                    <SheetClose asChild>
                                        <button
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors dark:hover:bg-slate-800 text-left"
                                            onClick={() => setShowGuide(true)}
                                        >
                                            <HelpCircle className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Guía de Uso</span>
                                        </button>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <button
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors dark:hover:bg-slate-800 text-left"
                                            onClick={() => { handleShare(); closeMobileMenu(); }}
                                        >
                                            <Share2 className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Compartir</span>
                                        </button>
                                    </SheetClose>

                                    <SheetClose asChild>
                                        <button
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-100 transition-colors dark:hover:bg-slate-800 text-left"
                                            onClick={() => { setTheme(theme === "dark" ? "light" : "dark"); closeMobileMenu(); }}
                                        >
                                            {theme === "dark" ? (
                                                <Sun className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                                            ) : (
                                                <Moon className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                                            )}
                                            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                                                {theme === "dark" ? "Modo Claro" : "Modo Oscuro"}
                                            </span>
                                        </button>
                                    </SheetClose>
                                </div>

                                {/* Footer del Menú - Logout */}
                                {user && (
                                    <div className="p-4 border-t border-border/40 bg-slate-50/50 dark:bg-slate-800/50">
                                        <SheetClose asChild>
                                            <Button
                                                variant="ghost"
                                                className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                                                onClick={handleSignOut}
                                            >
                                                <LogOut className="h-4 w-4 mr-2" />
                                                Cerrar Sesión
                                            </Button>
                                        </SheetClose>
                                    </div>
                                )}

                                {!user && (
                                    <div className="p-4 border-t border-border/40 bg-slate-50/50 dark:bg-slate-800/50">
                                        <SheetClose asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="w-full text-xs text-muted-foreground"
                                                onClick={() => loginAsDev()}
                                            >
                                                🛠️ Modo Dev (Test Local)
                                            </Button>
                                        </SheetClose>
                                    </div>
                                )}
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>

            {/* Mostrar guía de uso si está activada */}
            <CapsuleGuideModal open={showGuide} onOpenChange={setShowGuide} />
        </header >
    );
};

export default Navbar;
