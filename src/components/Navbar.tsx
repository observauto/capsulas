import React, { useState } from 'react';
import { Menu, X, Trophy, User, LogIn, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const { points } = useGamification();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Función para navegación segura
  const navigateTo = (path: string) => {
    window.location.href = path;
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between px-4">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('/')}>
          <span className="text-xl font-bold text-observauto-dark tracking-tight">
            Cápsulas <span className="text-observauto-red">Observauto</span>
          </span>
        </div>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden md:flex items-center gap-6">
          <a href="/" className="text-sm font-medium transition-colors hover:text-primary">
            Inicio
          </a>
          <a href="/#capsulas" className="text-sm font-medium transition-colors hover:text-primary">
            Cápsulas
          </a>
          {/* CORRECCIÓN: Enlace correcto al Dashboard */}
          <a href="/dashboard" className="text-sm font-medium transition-colors hover:text-primary flex items-center gap-1">
            <Trophy className="h-4 w-4 text-amber-500" />
            Premios
          </a>
        </div>

        {/* USER ACTIONS (DESKTOP) */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <>
              <div className="flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
                <span className="text-sm font-bold text-observauto-dark">{points} pts</span>
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-observauto-dark text-white">
                        {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.user_metadata?.full_name || 'Usuario'}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigateTo('/dashboard')}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Mi Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigateTo('/dashboard?tab=premios')}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Canjear Premios
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button id="auth-trigger" onClick={() => document.dispatchEvent(new CustomEvent('open-auth-modal'))}>
              <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
            </Button>
          )}
        </div>

        {/* MOBILE MENU */}
        <div className="md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col gap-6 mt-6">
                <div className="flex flex-col gap-2">
                  {user ? (
                     <div className="p-4 bg-slate-50 rounded-lg text-center">
                        <div className="text-lg font-bold">{user.user_metadata?.full_name}</div>
                        <div className="text-sm text-slate-500">{user.email}</div>
                        <div className="mt-2 font-bold text-amber-600">{points} Puntos</div>
                     </div>
                  ) : null}
                </div>

                <div className="flex flex-col gap-4">
                    <Button variant="ghost" className="justify-start" onClick={() => navigateTo('/')}>
                        Inicio
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigateTo('/#capsulas')}>
                        Cápsulas
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => navigateTo('/dashboard')}>
                        <Trophy className="mr-2 h-4 w-4" /> Premios y Puntos
                    </Button>
                </div>

                <div className="mt-auto">
                  {user ? (
                    <Button variant="destructive" className="w-full" onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                    </Button>
                  ) : (
                    <Button className="w-full" onClick={() => {
                        setIsMobileMenuOpen(false);
                        document.dispatchEvent(new CustomEvent('open-auth-modal'));
                    }}>
                      <LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
