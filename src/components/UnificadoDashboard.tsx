// Ruta del archivo: src/components/UnificadoDashboard.tsx

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/context/GamificationContext';
import { useAuth } from '@/context/AuthContext';
import { AVAILABLE_BADGES } from '@/lib/gamification';
import { Trophy, Star, Award, Gift, Flame, LogIn, UserX, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditProfileModal from './EditProfileModal';
import { readUserScopedJSON, writeUserScopedJSON } from '@/lib/user-storage';

// Definiciones de tipos y datos mock (sin cambios)
interface UserProfile { id: string; user_id: string; email: string; name: string; role: string; level: number; created_at: string; avatar?: string; phone?: string; location?: string; bio?: string; }
interface RedeemedPrize { id: string; prize_id: string; prize_name: string; prize_points: number; validation_code: string; redeemed_at: string; status: 'pending' | 'delivered' | 'cancelled'; }
const PRIZES = [ { id: "1", name: "Chaqueta Observauto Premium", description: "Chaqueta exclusiva de la marca patrocinadora con tecnología térmica", points: 1000, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", stock: 5, category: "premium", }, { id: "2", name: "Power Bank Observauto 20,000mAh", description: "Carga rápida, diseño compacto, perfecto para viajes", points: 500, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400", stock: 15, category: "tech", }, { id: "3", name: "Kit de Herramientas Automotriz", description: "Set profesional de 50 piezas para mantenimiento vehicular", points: 800, image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400", stock: 8, category: "tools", }, { id: "4", name: "Audífonos Bluetooth Premium", description: "Cancelación de ruido activa, 30 horas de batería", points: 600, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", stock: 12, category: "tech", }, { id: "5", name: "Mochila Observauto Tech", description: "Mochila antirrobo con puerto USB y compartimento para laptop", points: 400, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", stock: 20, category: "accessories", }, { id: "6", name: "Smartwatch Deportivo", description: "Monitor de ritmo cardíaco, GPS integrado, resistente al agua", points: 1200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", stock: 3, category: "premium", }, { id: "7", name: "Termo Inteligente 500ml", description: "Mantiene temperatura 12h, pantalla LED, recargable USB", points: 300, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", stock: 25, category: "accessories", }, { id: "8", name: "Llavero Observauto Premium", description: "Llavero metálico de lujo con acabado cromado", points: 100, image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400", stock: 50, category: "accessories", }, ];
// ... (resto de funciones de carga y guardado de datos locales como loadUserProfile, loadRedeemedPrizes, etc. SIN CAMBIOS)

// ✅ AÑADE ESTAS FUNCIONES, QUE ESTABAN EN OTROS DOCUMENTOS PERO FALTAN AQUÍ
const REDEEMED_PRIZES_KEY = 'redeemedPrizes';
const loadRedeemedPrizes = (userId?: string | null): RedeemedPrize[] => {
  try {
    return readUserScopedJSON<RedeemedPrize[]>(REDEEMED_PRIZES_KEY, userId, REDEEMED_PRIZES_KEY) || [];
  } catch (error) {
    console.error('Error loading redeemed prizes from localStorage:', error);
    return [];
  }
};
const saveRedeemedPrizes = (prizes: RedeemedPrize[], userId?: string | null): void => {
  try {
    writeUserScopedJSON(REDEEMED_PRIZES_KEY, prizes, userId);
  } catch (error) {
    console.error('Error saving redeemed prizes to localStorage:', error);
  }
};
const loadUserProfile = (userId?: string | null): UserProfile => {
    // Implementación simple para perfil, ya que los datos de gamificación vienen del contexto.
    const baseProfile = { id: '1', user_id: userId || 'demo-user', email: 'usuario@demo.com', name: 'Usuario Demo', role: 'end_user', level: 1, created_at: new Date().toISOString() };
    try {
        const saved = readUserScopedJSON<Partial<UserProfile>>('userProfile', userId, 'userProfile');
        return { ...baseProfile, ...saved, user_id: userId || 'demo-user' };
    } catch {
        return baseProfile;
    }
}


export default function UnificadoDashboard() {
  const { user, signInWithGoogle } = useAuth();
  const { points, level, badges, subtractPoints, isLoading: isGamificationLoading } = useGamification();
  const activeUserId = user?.id ?? null;

  const [redeemedPrizes, setRedeemedPrizes] = useState<RedeemedPrize[]>(() => loadRedeemedPrizes(activeUserId));
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<(typeof PRIZES)[0] | null>(null);
  const [validationCode, setValidationCode] = useState("");
  const [userProfile, setUserProfile] = useState(() => loadUserProfile(activeUserId));
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);

  useEffect(() => {
    setUserProfile(loadUserProfile(activeUserId));
    setRedeemedPrizes(loadRedeemedPrizes(activeUserId));
  }, [activeUserId]);

  useEffect(() => {
    const handleStorageChange = () => {
      setRedeemedPrizes(loadRedeemedPrizes(activeUserId));
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('prizes:redeem', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('prizes:redeem', handleStorageChange);
    };
  }, [activeUserId]);

  const earnedBadges = React.useMemo(() => {
    return badges.map(code => AVAILABLE_BADGES[code]).filter(Boolean);
  }, [badges]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    writeUserScopedJSON('userProfile', updatedProfile, activeUserId);
  };
  
  const getNextLevelPoints = (currentLevel: number) => currentLevel * 100;

  const getCurrentLevelProgress = () => {
    const currentLevelPoints = (level - 1) * 100;
    const nextLevelPointsThreshold = getNextLevelPoints(level);
    if (nextLevelPointsThreshold === currentLevelPoints) return 100;
    const progress = ((points - currentLevelPoints) / (nextLevelPointsThreshold - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };
  
  const handleRedeemClick = (prize: (typeof PRIZES)[0]) => {
    if (points < prize.points) {
      toast({ title: "Puntos insuficientes", variant: "destructive" });
      return;
    }
    setSelectedPrize(prize);
    setValidationCode(Math.random().toString(36).substring(2, 10).toUpperCase());
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (!selectedPrize) return;

    subtractPoints(selectedPrize.points);

    const newRedeemedPrize: RedeemedPrize = {
      id: `redeemed-${Date.now()}`,
      prize_id: selectedPrize.id,
      prize_name: selectedPrize.name,
      prize_points: selectedPrize.points,
      validation_code: validationCode,
      redeemed_at: new Date().toISOString(),
      status: 'pending'
    };

    const updatedPrizes = [newRedeemedPrize, ...redeemedPrizes];
    setRedeemedPrizes(updatedPrizes);
    saveRedeemedPrizes(updatedPrizes, activeUserId);

    window.dispatchEvent(new CustomEvent('prizes:redeem'));
    setShowRedeemModal(false);
    toast({
      title: "¡Premio Canjeado!",
      description: `Tu código de validación: ${validationCode}.`,
      duration: 10000,
    });
    setSelectedPrize(null);
  };

  if (!user) {
    return (
        <div className="container mx-auto p-6 space-y-6">
            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-8 text-center space-y-4">
                    <UserX className="h-12 w-12 text-blue-600 mx-auto" />
                    <h2 className="text-xl font-semibold text-gray-900">Accede a tu Panel Personal</h2>
                    <p className="text-gray-600 max-w-md mx-auto">
                        Inicia sesión con tu cuenta de Google para ver tu progreso, puntos, insignias y canjear premios exclusivos.
                    </p>
                    <Button onClick={signInWithGoogle} className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white">
                        <LogIn className="h-4 w-4 mr-2" />
                        Iniciar Sesión con Google
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  if (isGamificationLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary" />
          <p className="mt-2 text-gray-600">Sincronizando tu progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* ... (el resto del JSX del dashboard, sin cambios estructurales) ... */}
      {/* Ejemplo de cómo usar los nuevos datos en el JSX: */}
       <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Puntos Totales</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="text-2xl font-bold">{points}</div>
            <p className="text-xs opacity-75 mt-1">Nivel {level}</p>
        </CardContent>
        </Card>
        {/* Y así para el resto de las tarjetas y componentes que muestran datos de gamificación */}
    </div>
  );
}
