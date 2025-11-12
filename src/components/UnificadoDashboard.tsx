// Ruta del archivo: src/components/UnificadoDashboard.tsx

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/context/GamificationContext';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { AVAILABLE_BADGES } from '@/lib/gamification';
import { Trophy, Star, Target, Award, Clock, TrendingUp, Gift, CheckCircle2, X, Flame, LogIn, UserX, RefreshCw, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import EditProfileModal from './EditProfileModal';
import { readUserScopedJSON, writeUserScopedJSON } from '@/lib/user-storage';

// --- DEFINICIONES Y DATOS ---
interface UserProfile { id: string; user_id: string; email: string; name: string; role: string; level: number; created_at: string; avatar?: string; phone?: string; location?: string; bio?: string; }
interface RedeemedPrize { id: string; prize_id: string; prize_name: string; prize_points: number; validation_code: string; redeemed_at: string; status: string; }
interface CapsuleProgress { id: string; capsule_name: string; section_name: string; progress_percentage: number; completed_at?: string; last_accessed: string; time_spent_minutes: number; }

const PRIZES = [ { id: "1", name: "Chaqueta Observauto Premium", description: "Chaqueta exclusiva de la marca patrocinadora con tecnología térmica", points: 1000, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400", stock: 5, category: "premium", }, { id: "2", name: "Power Bank Observauto 20,000mAh", description: "Carga rápida, diseño compacto, perfecto para viajes", points: 500, image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400", stock: 15, category: "tech", }, { id: "3", name: "Kit de Herramientas Automotriz", description: "Set profesional de 50 piezas para mantenimiento vehicular", points: 800, image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400", stock: 8, category: "tools", }, { id: "4", name: "Audífonos Bluetooth Premium", description: "Cancelación de ruido activa, 30 horas de batería", points: 600, image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400", stock: 12, category: "tech", }, { id: "5", name: "Mochila Observauto Tech", description: "Mochila antirrobo con puerto USB y compartimento para laptop", points: 400, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400", stock: 20, category: "accessories", }, { id: "6", name: "Smartwatch Deportivo", description: "Monitor de ritmo cardíaco, GPS integrado, resistente al agua", points: 1200, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", stock: 3, category: "premium", }, { id: "7", name: "Termo Inteligente 500ml", description: "Mantiene temperatura 12h, pantalla LED, recargable USB", points: 300, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400", stock: 25, category: "accessories", }, { id: "8", name: "Llavero Observauto Premium", description: "Llavero metálico de lujo con acabado cromado", points: 100, image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400", stock: 50, category: "accessories", }, ];
const USER_PROFILE_KEY = 'userProfile';

const loadUserProfile = (user: { id: string, email: string, name: string } | null): UserProfile => {
    const baseProfile: UserProfile = { id: '1', user_id: user?.id || 'guest', email: user?.email || '', name: user?.name || 'Invitado', role: 'end_user', level: 1, created_at: new Date().toISOString() };
    try {
        const saved = readUserScopedJSON<Partial<UserProfile>>(USER_PROFILE_KEY, user?.id);
        const finalName = user?.name || saved?.name || 'Invitado';
        const finalEmail = user?.email || saved?.email || '';
        return { ...baseProfile, ...saved, user_id: user?.id || 'guest', name: finalName, email: finalEmail };
    } catch { return baseProfile; }
}

export default function UnificadoDashboard() {
    const { user, signInWithGoogle } = useAuth();
    const { points, level, badges, subtractPoints, isLoading: isGamificationLoading } = useGamification();
    const activeUserId = user?.id ?? null;

    const [redeemedPrizes, setRedeemedPrizes] = useState<RedeemedPrize[]>([]);
    const [userCapsules, setUserCapsules] = useState<CapsuleProgress[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [selectedPrize, setSelectedPrize] = useState<(typeof PRIZES)[0] | null>(null);
    const [validationCode, setValidationCode] = useState("");
    const [userProfile, setUserProfile] = useState(() => loadUserProfile(user));
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);

    const loadDashboardData = useCallback(async () => {
        if (!activeUserId || isGamificationLoading) {
            setIsLoadingData(false);
            return;
        }

        console.log("[DASHBOARD] Usuario estable, cargando datos de cápsulas y premios...");
        setIsLoadingData(true);
        try {
            const [prizesRes, capsulesRes] = await Promise.all([
                supabase.from('user_redeemed_prizes').select('*').eq('user_id', activeUserId).order('redeemed_at', { ascending: false }),
                supabase.from('user_completed_capsules').select('*').eq('user_id', activeUserId).order('completed_at', { ascending: false })
            ]);

            if (prizesRes.error) throw prizesRes.error;
            setRedeemedPrizes((prizesRes.data as RedeemedPrize[]) || []);

            if (capsulesRes.error) throw capsulesRes.error;
            const formattedCapsules = (capsulesRes.data || []).map((c, i) => ({
                id: `capsule-${i}`,
                capsule_name: c.capsule_slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                section_name: "Completada",
                progress_percentage: 100,
                completed_at: c.completed_at,
                last_accessed: c.completed_at,
                time_spent_minutes: 20
            }));
            setUserCapsules(formattedCapsules);
            console.log(`[DASHBOARD] Datos cargados: ${prizesRes.data?.length || 0} premios, ${capsulesRes.data?.length || 0} cápsulas.`);
            
        } catch (error: any) {
            console.error("Error al cargar datos del dashboard:", error);
            toast({ title: "Error de Carga", description: error.message, variant: "destructive" });
        } finally {
            setIsLoadingData(false);
        }
    }, [activeUserId, isGamificationLoading]);

    useEffect(() => {
        setUserProfile(loadUserProfile(user));
        loadDashboardData();
        const handleGamificationUpdate = () => {
            console.log("[DASHBOARD] Recibido evento 'gamification:update', recargando datos...");
            loadDashboardData();
        };
        window.addEventListener('gamification:update', handleGamificationUpdate);
        return () => window.removeEventListener('gamification:update', handleGamificationUpdate);
    }, [user, loadDashboardData]);

    const earnedBadges = useMemo(() => badges.map(code => AVAILABLE_BADGES[code]).filter(Boolean), [badges]);
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

    const confirmRedeem = async () => {
        if (!selectedPrize || !activeUserId) return;
        const newRedeemedPrize = { user_id: activeUserId, prize_id: selectedPrize.id, prize_name: selectedPrize.name, points_cost: selectedPrize.points, validation_code: validationCode, status: 'pending' };
        const { data, error } = await supabase.from('user_redeemed_prizes').insert(newRedeemedPrize).select().single();
        if (error) {
            console.error("Error al canjear premio:", error);
            toast({ title: "Error", description: "No se pudo canjear el premio.", variant: "destructive" });
            return;
        }
        subtractPoints(selectedPrize.points);
        loadDashboardData();
        setShowRedeemModal(false);
        toast({ title: "¡Premio Canjeado!", description: `Tu código de validación: ${validationCode}.`, duration: 10000 });
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
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200"><CardContent className="p-8 text-center space-y-4"><UserX className="h-12 w-12 text-blue-600 mx-auto" /><h2 className="text-xl font-semibold text-gray-900">Accede a tu Panel Personal</h2><p className="text-gray-600 max-w-md mx-auto">Inicia sesión con tu cuenta de Google para ver tu progreso, puntos, insignias y canjear premios exclusivos.</p><Button onClick={signInWithGoogle} className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"><LogIn className="h-4 w-4 mr-2" />Iniciar Sesión con Google</Button></CardContent></Card>
            </div>
        );
    }

    if (isGamificationLoading || isLoadingData) {
        return (
            <div className="flex items-center justify-center p-8"><div className="text-center"><RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary" /><p className="mt-2 text-gray-600">Sincronizando tu progreso...</p></div></div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between"><h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1><Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Usuario Registrado</Badge></div>
            <Tabs defaultValue="resumen" className="space-y-6">
                <TabsList className="grid w-full grid-cols-6"><TabsTrigger value="resumen">Resumen</TabsTrigger><TabsTrigger value="premios">Premios</TabsTrigger><TabsTrigger value="insignias">Insignias</TabsTrigger><TabsTrigger value="reclamados">Reclamados</TabsTrigger><TabsTrigger value="capsulas">Cápsulas</TabsTrigger><TabsTrigger value="perfil">Perfil</TabsTrigger></TabsList>
                <TabsContent value="resumen" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-90">Puntos Totales</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{points}</div><p className="text-xs opacity-75 mt-1">Nivel {level}</p></CardContent></Card>
                        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-90">Logros Obtenidos</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{earnedBadges.length}</div><p className="text-xs opacity-75 mt-1">Badges conseguidos</p></CardContent></Card>
                        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-90">Premios Canjeados</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{redeemedPrizes.length}</div><p className="text-xs opacity-75 mt-1">Total canjeados</p></CardContent></Card>
                        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white"><CardHeader className="pb-2"><CardTitle className="text-sm font-medium opacity-90">Cápsulas Completas</CardTitle></CardHeader><CardContent><div className="text-2xl font-bold">{userCapsules.length}</div><p className="text-xs opacity-75 mt-1">Finalizadas</p></CardContent></Card>
                    </div>
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><TrendingUp className="h-5 w-5" />Progreso de Nivel</CardTitle></CardHeader><CardContent><div className="space-y-4"><div className="flex justify-between items-center"><span className="text-sm font-medium">Nivel {level} → {level + 1}</span><span className="text-sm text-gray-600">{points} / {getNextLevelPoints(level)} puntos</span></div><Progress value={getCurrentLevelProgress()} className="h-2" /><p className="text-xs text-gray-600">{getNextLevelPoints(level) - points} puntos para el siguiente nivel</p></div></CardContent></Card>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5" />Próximo Hito</CardTitle></CardHeader><CardContent className="space-y-4"><div><div className="flex items-center justify-between mb-2 text-sm"><span>Próximo hito: {nextMilestone.name}</span><span className="font-semibold">{nextMilestone.points} pts</span></div><Progress value={progressToNext} className="h-3" /></div><div className="text-center p-3 rounded-lg bg-background/50"><Gift className="h-6 w-6 mx-auto mb-1 text-green-500" /><div className="text-2xl font-bold">{PRIZES.filter(p => p.points <= points).length}</div><div className="text-xs text-muted-foreground">Premios Disponibles</div></div></CardContent></Card>
                        <Card><CardHeader><CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Últimas Insignias</CardTitle></CardHeader><CardContent>{earnedBadges.length > 0 ? (<div className="space-y-3">{earnedBadges.slice(0, 3).map((badge) => (<div key={badge.code} className="flex items-center gap-3"><div className="text-2xl">{badge.icon}</div><div className="flex-1"><p className="text-sm font-medium">{badge.name}</p><p className="text-xs text-gray-600">{badge.description}</p></div></div>))}{earnedBadges.length > 3 && (<p className="text-xs text-gray-500 text-center">+{earnedBadges.length - 3} insignias más</p>)}</div>) : (<p className="text-sm text-gray-600 text-center py-4">Aún no has obtenido insignias</p>)}</CardContent></Card>
                    </div>
                </TabsContent>
                <TabsContent value="premios" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{PRIZES.map((prize) => (<Card key={prize.id} className={`overflow-hidden transition-all hover:shadow-lg ${points < prize.points ? "opacity-60" : ""}`}><div className="aspect-[4/3] relative overflow-hidden bg-muted"><img src={prize.image} alt={prize.name} className="w-full h-full object-cover" />{prize.stock <= 5 && (<Badge variant="destructive" className="absolute top-2 right-2 text-xs">¡Solo {prize.stock}!</Badge>)}</div><CardHeader className="pb-2"><CardTitle className="text-sm line-clamp-2">{prize.name}</CardTitle></CardHeader><CardContent className="space-y-2"><p className="text-xs text-muted-foreground line-clamp-2">{prize.description}</p><div className="flex items-center justify-between text-xs"><div className="flex items-center gap-1 text-primary font-bold"><Trophy className="h-3 w-3" /><span>{prize.points} pts</span></div><Badge variant="outline" className="text-xs">Stock: {prize.stock}</Badge></div><Button className="w-full text-xs py-2" disabled={points < prize.points} variant={points >= prize.points ? "default" : "outline"} onClick={() => handleRedeemClick(prize)}>{points >= prize.points ? "Canjear" : `Faltan ${prize.points - points} pts`}</Button></CardContent></Card>))}</div>
                </TabsContent>
                <TabsContent value="insignias" className="space-y-6">
                    {earnedBadges.length > 0 && (<div><h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><Award className="h-5 w-5 text-primary" />Insignias Obtenidas ({earnedBadges.length})</h3><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{earnedBadges.map((badge) => (<Card key={badge.code} className="text-center p-4 hover:shadow-lg transition-all"><div className="text-5xl mb-2">{badge.icon}</div><h4 className="font-semibold mb-1">{badge.name}</h4><p className="text-xs text-muted-foreground">{badge.description}</p></Card>))}</div></div>)}
                    <div><h3 className="text-xl font-semibold mb-4 text-muted-foreground flex items-center gap-2"><Award className="h-5 w-5" />Por Desbloquear ({Object.keys(AVAILABLE_BADGES).length - earnedBadges.length})</h3><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Object.values(AVAILABLE_BADGES).filter((b) => !badges.includes(b.code)).map((badge) => (<Card key={badge.code} className="text-center p-4 opacity-50 grayscale hover:opacity-70 transition-all"><div className="text-5xl mb-2">{badge.icon}</div><h4 className="font-semibold mb-1">{badge.name}</h4><p className="text-xs text-muted-foreground">{badge.description}</p></Card>))}</div></div>
                </TabsContent>
                <TabsContent value="reclamados" className="space-y-6">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5" />Mis Premios Canjeados</CardTitle></CardHeader><CardContent>{redeemedPrizes.length > 0 ? (<div className="space-y-4">{redeemedPrizes.map((prize) => (<div key={prize.id} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"><div className="flex-1"><h4 className="font-medium text-gray-900">{prize.prize_name}</h4><div className="flex items-center gap-4 mt-2"><p className="text-sm text-gray-600">Canjeado: {new Date(prize.redeemed_at).toLocaleDateString('es-ES')}</p><p className="text-sm text-blue-600 font-medium">{prize.prize_points} puntos</p><Badge variant={prize.status === 'delivered' ? 'default' : 'outline'}>{prize.status}</Badge></div></div><div className="text-right"><p className="text-sm text-gray-500">Código:</p><p className="text-lg font-mono font-bold text-blue-600">{prize.validation_code}</p></div></div>))}</div>) : (<div className="text-center py-8"><Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" /><p className="text-gray-600">No has canjeado ningún premio aún.</p></div>)}</CardContent></Card>
                </TabsContent>
                <TabsContent value="capsulas" className="space-y-4">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><Target className="h-5 w-5" />Cápsulas Completadas</CardTitle></CardHeader><CardContent>{userCapsules.length > 0 ? (<div className="space-y-4">{userCapsules.map((capsule) => (<div key={capsule.id} className="p-4 border rounded-lg hover:bg-gray-50"><h4 className="font-medium">{capsule.capsule_name}</h4><p className="text-sm text-gray-500">Completada el {new Date(capsule.completed_at!).toLocaleDateString('es-ES')}</p></div>))}</div>) : (<div className="text-center py-12"><Target className="h-16 w-16 text-gray-400 mx-auto mb-4" /><h3 className="text-lg font-semibold text-gray-700">No hay cápsulas completadas</h3></div>)}</CardContent></Card>
                </TabsContent>
                <TabsContent value="perfil" className="space-y-4">
                    <Card><CardHeader><CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Mi Perfil</CardTitle></CardHeader><CardContent className="space-y-6"><div className="grid grid-cols-1 md:grid-cols-2 gap-6"><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700">Nombre</label><p className="text-gray-900">{userProfile.name}</p></div><div><label className="block text-sm font-medium text-gray-700">Email</label><p className="text-gray-900">{userProfile.email}</p></div></div><div className="space-y-4"><div><label className="block text-sm font-medium text-gray-700">Nivel</label><p className="text-2xl font-bold text-blue-600">{level}</p></div><div><label className="block text-sm font-medium text-gray-700">Miembro desde</label><p className="text-gray-900">{new Date(userProfile.created_at).toLocaleDateString('es-ES')}</p></div></div></div><div className="pt-4 border-t"><Button className="w-full" onClick={() => setShowEditProfileModal(true)}><Star className="h-4 w-4 mr-2" />Editar Perfil</Button></div></CardContent></Card>
                </TabsContent>
            </Tabs>

            <Dialog open={showRedeemModal} onOpenChange={setShowRedeemModal}>
                <DialogContent className="sm:max-w-md"><DialogHeader><DialogTitle className="flex items-center gap-2 text-xl"><Gift className="h-6 w-6 text-primary" />Confirmar Canje</DialogTitle><DialogDescription>Estás a punto de canjear tu premio</DialogDescription></DialogHeader>{selectedPrize && (<div className="space-y-4 py-4"><div className="flex items-start gap-4"><img src={selectedPrize.image} alt={selectedPrize.name} className="w-20 h-20 object-cover rounded-lg" /><div className="flex-1"><h4 className="font-semibold">{selectedPrize.name}</h4><p className="text-sm text-muted-foreground mt-1">{selectedPrize.description}</p><div className="flex items-center gap-1 text-primary font-bold mt-2"><Trophy className="h-4 w-4" /><span>{selectedPrize.points} puntos</span></div></div></div><div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4"><p className="text-sm font-medium mb-2">Tu código de validación será:</p><p className="text-2xl font-mono font-bold text-center py-2 bg-background rounded">{validationCode}</p><p className="text-xs text-muted-foreground mt-2 text-center">Guarda este código para reclamar tu premio.</p></div><div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3"><p className="text-xs text-center">Se descontarán <strong>{selectedPrize.points} puntos</strong> de tu saldo actual ({points} pts)</p></div></div>)}<DialogFooter className="flex gap-2"><Button variant="outline" onClick={() => { setShowRedeemModal(false); setSelectedPrize(null); }} className="flex-1"><X className="h-4 w-4 mr-2" />Cancelar</Button><Button onClick={confirmRedeem} className="flex-1 bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"><CheckCircle2 className="h-4 w-4 mr-2" />Confirmar</Button></DialogFooter></DialogContent>
            </Dialog>

            <EditProfileModal open={showEditProfileModal} onOpenChange={setShowEditProfileModal} profile={userProfile} onProfileUpdate={handleProfileUpdate} />
        </div>
    );
}
