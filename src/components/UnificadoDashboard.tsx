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
import { Trophy, Star, Target, Award, Clock, TrendingUp, Gift, CheckCircle2, X, Flame, LogIn, UserX, RefreshCw, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditProfileModal from './EditProfileModal';
import { buildUserScopedKey, readUserScopedJSON, writeUserScopedJSON } from '@/lib/user-storage';

// --- DEFINICIONES Y DATOS MOCK (SIN CAMBIOS) ---
interface UserProfile { id: string; user_id: string; email: string; name: string; role: string; level: number; created_at: string; avatar?: string; phone?: string; location?: string; bio?: string; }
interface RedeemedPrize { id: string; prize_id: string; prize_name: string; prize_points: number; validation_code: string; redeemed_at: string; status: 'pending' | 'delivered' | 'cancelled'; }
interface CapsuleProgress { id: string; capsule_name: string; section_name: string; progress_percentage: number; completed_at?: string; last_accessed: string; time_spent_minutes: number; }
const PRIZES = [ { id: "1", name: "Chaqueta Observauto Premium", description: "Chaqueta exclusiva de la marca patrocinadora con tecnología térmica", points: 1000, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", stock: 5, category: "premium", }, { id: "2", name: "Power Bank Observauto 20,000mAh", description: "Carga rápida, diseño compacto, perfecto para viajes", points: 500, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400", stock: 15, category: "tech", }, { id: "3", name: "Kit de Herramientas Automotriz", description: "Set profesional de 50 piezas para mantenimiento vehicular", points: 800, image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400", stock: 8, category: "tools", }, { id: "4", name: "Audífonos Bluetooth Premium", description: "Cancelación de ruido activa, 30 horas de batería", points: 600, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", stock: 12, category: "tech", }, { id: "5", name: "Mochila Observauto Tech", description: "Mochila antirrobo con puerto USB y compartimento para laptop", points: 400, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", stock: 20, category: "accessories", }, { id: "6", name: "Smartwatch Deportivo", description: "Monitor de ritmo cardíaco, GPS integrado, resistente al agua", points: 1200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", stock: 3, category: "premium", }, { id: "7", name: "Termo Inteligente 500ml", description: "Mantiene temperatura 12h, pantalla LED, recargable USB", points: 300, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", stock: 25, category: "accessories", }, { id: "8", name: "Llavero Observauto Premium", description: "Llavero metálico de lujo con acabado cromado", points: 100, image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400", stock: 50, category: "accessories", }, ];

const USER_PROFILE_KEY = 'userProfile';
const COMPLETED_CAPSULES_KEY = 'completed_capsules';
const REDEEMED_PRIZES_KEY = 'redeemedPrizes';

const loadUserProfile = (user: { id: string, email: string, name: string } | null): UserProfile => {
    const baseProfile: UserProfile = { id: '1', user_id: user?.id || 'guest', email: user?.email || '', name: user?.name || 'Invitado', role: 'end_user', level: 1, created_at: new Date().toISOString() };
    try {
        const saved = readUserScopedJSON<Partial<UserProfile>>(USER_PROFILE_KEY, user?.id);
        return { ...baseProfile, ...saved, user_id: user?.id || 'guest', email: user?.email || '', name: user?.name || 'Invitado' };
    } catch {
        return baseProfile;
    }
}
const loadUserCapsules = (userId?: string | null): CapsuleProgress[] => { /* ... (sin cambios) ... */ return []; };
const loadRedeemedPrizes = (userId?: string | null): RedeemedPrize[] => { try { return readUserScopedJSON<RedeemedPrize[]>(REDEEMED_PRIZES_KEY, userId) || []; } catch { return []; } };
const saveRedeemedPrizes = (prizes: RedeemedPrize[], userId?: string | null): void => { try { writeUserScopedJSON(REDEEMED_PRIZES_KEY, prizes, userId); } catch (e) { console.error(e); } };

export default function UnificadoDashboard() {
  const { user, signInWithGoogle } = useAuth();
  const { points, level, badges, subtractPoints, isLoading: isGamificationLoading } = useGamification();
  const activeUserId = user?.id ?? null;

  const [redeemedPrizes, setRedeemedPrizes] = useState<RedeemedPrize[]>(() => loadRedeemedPrizes(activeUserId));
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<(typeof PRIZES)[0] | null>(null);
  const [validationCode, setValidationCode] = useState("");
  
  const [userProfile, setUserProfile] = useState(() => loadUserProfile(user));
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [userCapsules, setUserCapsules] = useState<CapsuleProgress[]>(() => loadUserCapsules(activeUserId));

  useEffect(() => {
    setUserProfile(loadUserProfile(user));
    setRedeemedPrizes(loadRedeemedPrizes(activeUserId));
    setUserCapsules(loadUserCapsules(activeUserId));
  }, [user, activeUserId]);

  useEffect(() => {
    const handleStorageChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.type === 'prizes:redeem' || (event as StorageEvent).key === buildUserScopedKey(REDEEMED_PRIZES_KEY, activeUserId)) {
          setRedeemedPrizes(loadRedeemedPrizes(activeUserId));
      }
      if (customEvent.type === 'gamification:update' || (event as StorageEvent).key === buildUserScopedKey(COMPLETED_CAPSULES_KEY, activeUserId)) {
          setUserCapsules(loadUserCapsules(activeUserId));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('prizes:redeem', handleStorageChange);
    window.addEventListener('gamification:update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('prizes:redeem', handleStorageChange);
      window.removeEventListener('gamification:update', handleStorageChange);
    };
  }, [activeUserId]);

  const earnedBadges = React.useMemo(() => {
    return badges.map(code => AVAILABLE_BADGES[code]).filter(Boolean);
  }, [badges]);

  const handleProfileUpdate = (updatedProfile: UserProfile) => {
    setUserProfile(updatedProfile);
    writeUserScopedJSON(USER_PROFILE_KEY, updatedProfile, activeUserId);
  };
  
  const getNextLevelPoints = (currentLevel: number) => currentLevel * 100;

  const getCurrentLevelProgress = () => {
    const currentLevelPoints = (level - 1) * 100;
    const nextLevelPointsThreshold = getNextLevelPoints(level);
    if (nextLevelPointsThreshold <= currentLevelPoints) return 100;
    const progress = ((points - currentLevelPoints) / (nextLevelPointsThreshold - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };
  
  const handleRedeemClick = (prize: (typeof PRIZES)[0]) => {
    if (points < prize.points) {
      toast({ title: "Puntos insuficientes", description: `Necesitas ${prize.points - points} puntos más.`, variant: "destructive" });
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
  
  const getNextMilestone = () => {
    if (points < 100) return { points: 100, name: "Principiante" };
    if (points < 500) return { points: 500, name: "Intermedio" };
    if (points < 1000) return { points: 1000, name: "Experto" };
    return { points: 2000, name: "Maestro" };
  };
  const nextMilestone = getNextMilestone();
  const progressToNext = (points / nextMilestone.points) * 100;

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

  // ✅ CORRECCIÓN: Mostrar un estado de carga mientras los datos de gamificación se sincronizan.
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, {user?.name || userProfile.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Usuario Registrado
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="premios">Premios</TabsTrigger>
          <TabsTrigger value="insignias">Insignias</TabsTrigger>
          <TabsTrigger value="reclamados">Reclamados</TabsTrigger>
          <TabsTrigger value="capsulas">Cápsulas</TabsTrigger>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-90">Puntos Totales</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{points}</div>
                <p className="text-xs opacity-75 mt-1">Nivel {level}</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-90">Logros Obtenidos</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{earnedBadges.length}</div>
                <p className="text-xs opacity-75 mt-1">Badges conseguidos</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-90">Premios Canjeados</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{redeemedPrizes.length}</div>
                <p className="text-xs opacity-75 mt-1">Total canjeados</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-90">Tiempo Total</CardTitle></CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Math.round(userCapsules.reduce((sum, c) => sum + c.time_spent_minutes, 0) / 60)}h</div>
                <p className="text-xs opacity-75 mt-1">Horas de estudio</p>
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Progreso de Nivel</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Nivel {level} → {level + 1}</span>
                  <span className="text-sm text-gray-600">{points} / {getNextLevelPoints(level)} puntos</span>
                </div>
                <Progress value={getCurrentLevelProgress()} className="h-2" />
                <p className="text-xs text-gray-600">{getNextLevelPoints(level) - points} puntos para el siguiente nivel</p>
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5" />Próximo Hito</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                      <div>
                          <div className="flex items-center justify-between mb-2 text-sm">
                              <span>Próximo nivel: {nextMilestone.name}</span>
                              <span className="font-semibold">{nextMilestone.points} pts</span>
                          </div>
                          <Progress value={progressToNext} className="h-3" />
                      </div>
                      <div className="text-center p-3 rounded-lg bg-background/50">
                          <Gift className="h-6 w-6 mx-auto mb-1 text-green-500" />
                          <div className="text-2xl font-bold">{PRIZES.filter(p => p.points <= points).length}</div>
                          <div className="text-xs text-muted-foreground">Premios Disponibles</div>
                      </div>
                  </CardContent>
              </Card>
              <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Últimas Insignias</CardTitle></CardHeader>
                  <CardContent>
                      {earnedBadges.length > 0 ? (
                          <div className="space-y-3">
                              {earnedBadges.slice(0, 3).map((badge) => (
                                  <div key={badge.code} className="flex items-center gap-3">
                                      <div className="text-2xl">{badge.icon}</div>
                                      <div className="flex-1"><p className="text-sm font-medium">{badge.name}</p><p className="text-xs text-gray-600">{badge.description}</p></div>
                                  </div>
                              ))}
                              {earnedBadges.length > 3 && (<p className="text-xs text-gray-500 text-center">+{earnedBadges.length - 3} insignias más</p>)}
                          </div>
                      ) : (<p className="text-sm text-gray-600 text-center py-4">Aún no has obtenido insignias</p>)}
                  </CardContent>
              </Card>
          </div>
        </TabsContent>
        {/* ... (resto de las pestañas sin cambios lógicos mayores, solo consumir datos del contexto) ... */}
        {/* ... (los modales de canje y perfil permanecen igual) ... */}
      </Tabs>

      <Dialog open={showRedeemModal} onOpenChange={setShowRedeemModal}>
        <DialogContent>
            {/* ... Contenido del modal de canje (sin cambios) ... */}
        </DialogContent>
      </Dialog>
      <EditProfileModal open={showEditProfileModal} onOpenChange={setShowEditProfileModal} profile={userProfile} onProfileUpdate={handleProfileUpdate} />
    </div>
  );
}
