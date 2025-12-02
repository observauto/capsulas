import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/context/GamificationContext';
import { useAuth } from '@/context/AuthContext';
import { AVAILABLE_BADGES } from '@/lib/gamification';
import { LogIn, UserX, Flame, Gift, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import EditProfileModal from './EditProfileModal';
import { buildUserScopedKey, readUserScopedJSON, writeUserScopedJSON } from '@/lib/user-storage';
import { listFullCapsules, getCapsuleProgress } from '@/lib/capsulesRepo';
import { useOnlyFavorites } from '@/context/OnlyFavoritesContext';
import { UnifiedFooter } from '@/components/UnifiedFooter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

// New Components
import { DashboardStats } from './dashboard/DashboardStats';
import { DashboardLevelProgress } from './dashboard/DashboardLevelProgress';
import { DashboardCapsules } from './dashboard/DashboardCapsules';
import { DashboardPrizes } from './dashboard/DashboardPrizes';
import { DashboardProfile } from './dashboard/DashboardProfile';
import { RedeemModal } from './dashboard/RedeemModal';
import { PRIZES, BASE_USER_PROFILE } from './dashboard/constants';
import { CapsuleProgress, RedeemedPrize, Prize, UserProfile } from './dashboard/types';

const USER_PROFILE_KEY = 'userProfile';
const COMPLETED_CAPSULES_KEY = 'completed_capsules';
const REDEEMED_PRIZES_KEY = 'redeemedPrizes';

// Función para cargar perfil desde localStorage por usuario
const loadUserProfile = (userId?: string | null): UserProfile => {
    try {
        const savedProfile = readUserScopedJSON<UserProfile>(USER_PROFILE_KEY, userId, USER_PROFILE_KEY);
        if (savedProfile) {
            return { ...BASE_USER_PROFILE, ...savedProfile };
        }
    } catch (error) {
        console.error('Error loading profile from localStorage:', error);
    }
    return BASE_USER_PROFILE;
};

// Función para cargar cápsulas (completadas y en progreso)
const loadUserCapsules = (userId?: string | null): CapsuleProgress[] => {
    try {
        const userCapsules: CapsuleProgress[] = [];
        const allCapsules = listFullCapsules();

        // Cargar lista de completadas para referencia rápida (legacy/backup)
        const completedRaw = localStorage.getItem('completed_capsules');
        let completedList: Array<{ slug: string, completedAt: string }> = [];
        if (completedRaw) {
            try { completedList = JSON.parse(completedRaw); } catch { }
        }

        allCapsules.forEach((capsule, index) => {
            // 1. Obtener progreso del repositorio central (mismo que usa WizardMode)
            const progress = getCapsuleProgress(capsule.slug);

            // 2. Determinar si está completada
            // Prioridad: 1. Repo (completed=true), 2. Lista legacy, 3. Quiz pasado
            let isCompleted = progress.completed || !!completedList.find(c => c.slug === capsule.slug) || progress.quizCompleted;

            // Determinar fecha de completado
            let completedAt = progress.completedAt
                ? new Date(progress.completedAt).toISOString()
                : (completedList.find(c => c.slug === capsule.slug)?.completedAt);

            // 3. Determinar si tiene progreso parcial
            const hasProgress =
                progress.completedSections.length > 0 ||
                progress.quizCompleted ||
                isCompleted;

            if (hasProgress) {
                // Calcular porcentaje real
                let percentage = 100;
                if (!isCompleted) {
                    const totalSteps = (capsule.sections?.length || 0) + (capsule.quiz ? 1 : 0);
                    const completedSteps = progress.completedSections.length + (progress.quizCompleted ? 1 : 0);
                    percentage = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;
                    // FIX: Removed the 99% cap logic here
                }

                userCapsules.push({
                    id: `user-capsule-${index}`,
                    slug: capsule.slug,
                    capsule_name: capsule.title,
                    section_name: capsule.sections?.[0]?.title || 'General',
                    progress_percentage: percentage,
                    completed_at: completedAt,
                    last_accessed: new Date().toISOString(),
                    time_spent_minutes: 15 + (progress.completedSections.length * 5)
                });
            }
        });

        return userCapsules;
    } catch (error) {
        console.error('Error loading user capsules:', error);
        return [];
    }
};

// PREMIOS REDIMIDOS - Sistema de persistencia con Supabase
import { supabase } from "@/lib/supabase";

const loadRedeemedPrizes = async (userId?: string | null): Promise<RedeemedPrize[]> => {
    if (!userId) return [];
    try {
        const { data, error } = await supabase
            .from('redeemed_prizes')
            .select('*')
            .eq('user_id', userId)
            .order('redeemed_at', { ascending: false });

        if (error) {
            console.error('Error loading prizes from Supabase:', error);
            return [];
        }
        return data as RedeemedPrize[];
    } catch (error) {
        console.error('Error loading redeemed prizes:', error);
        return [];
    }
};

const saveRedeemedPrizeToSupabase = async (prize: RedeemedPrize, userId: string): Promise<boolean> => {
    try {
        const { error } = await supabase
            .from('redeemed_prizes')
            .insert([{
                user_id: userId,
                prize_id: prize.prize_id,
                prize_name: prize.prize_name,
                prize_points: prize.prize_points,
                validation_code: prize.validation_code,
                redeemed_at: prize.redeemed_at,
                status: prize.status
            }]);

        if (error) {
            console.error('Error saving prize to Supabase:', error);
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error saving prize:', error);
        return false;
    }
};

export default function UnificadoDashboard() {
    const { user, signInWithGoogle } = useAuth();
    const activeUserId = user?.id ?? null;
    const navigate = useNavigate();
    const { favorites } = useOnlyFavorites();
    const { points, badges, subtractPoints } = useGamification();
    const [searchParams, setSearchParams] = useSearchParams();
    const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'resumen');
    const [puntosSubTab, setPuntosSubTab] = useState('premios');
    const [capsuleFilter, setCapsuleFilter] = useState<'all' | 'in_progress' | 'completed' | 'favorites'>('all');

    // Sincronizar tab con URL cuando cambia el parámetro
    React.useEffect(() => {
        const tabFromUrl = searchParams.get('tab');
        if (tabFromUrl && tabFromUrl !== activeTab) {
            setActiveTab(tabFromUrl);
        }

        const filterFromUrl = searchParams.get('filter');
        if (filterFromUrl && ['all', 'in_progress', 'completed', 'favorites'].includes(filterFromUrl)) {
            setCapsuleFilter(filterFromUrl as 'all' | 'in_progress' | 'completed' | 'favorites');
        }
    }, [searchParams]);

    // Actualizar URL cuando cambia el tab manual
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        setSearchParams({ tab: value });
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const [redeemedPrizes, setRedeemedPrizes] = useState<RedeemedPrize[]>([]);
    const [showRedeemModal, setShowRedeemModal] = useState(false);
    const [selectedPrize, setSelectedPrize] = useState<Prize | null>(null);
    const [validationCode, setValidationCode] = useState("");

    // Estados para el perfil
    const [userProfile, setUserProfile] = useState<UserProfile>(() => {
        const local = loadUserProfile(activeUserId);
        if (user) {
            return {
                ...local,
                name: user.name || local.name,
                email: user.email || local.email,
                avatar: user.avatar_url || local.avatar,
            };
        }
        return local;
    });
    const [showEditProfileModal, setShowEditProfileModal] = useState(false);

    // Estados para cápsulas de usuario (dinámico)
    const [userCapsules, setUserCapsules] = useState<CapsuleProgress[]>(() => loadUserCapsules(activeUserId));

    React.useEffect(() => {
        const local = loadUserProfile(activeUserId);
        if (user) {
            setUserProfile({
                ...local,
                name: user.name || local.name,
                email: user.email || local.email,
                avatar: user.avatar_url || local.avatar,
            });
        } else {
            setUserProfile(local);
        }

        if (activeUserId) {
            loadRedeemedPrizes(activeUserId).then(prizes => setRedeemedPrizes(prizes));
        } else {
            setRedeemedPrizes([]);
        }
        setUserCapsules(loadUserCapsules(activeUserId));
    }, [activeUserId, user]);

    // Listeners for storage updates
    React.useEffect(() => {
        const capsulesKey = buildUserScopedKey(COMPLETED_CAPSULES_KEY, activeUserId);
        const handleStorageChange = (event?: StorageEvent) => {
            if (event && event.key && event.key !== capsulesKey) return;
            setUserCapsules(loadUserCapsules(activeUserId));
        };
        const handleCustomUpdate = () => handleStorageChange();
        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('gamification:update', handleCustomUpdate);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('gamification:update', handleCustomUpdate);
        };
    }, [activeUserId]);

    const earnedBadges = React.useMemo(() => {
        return badges.map(code => {
            const badge = AVAILABLE_BADGES[code];
            if (badge) return badge;
            return {
                code,
                name: code,
                description: "Insignia obtenida",
                icon: "🏅",
            };
        });
    }, [badges]);

    const handleProfileUpdate = (updatedProfile: any) => {
        setUserProfile(prev => ({ ...prev, ...updatedProfile }));
        writeUserScopedJSON(USER_PROFILE_KEY, updatedProfile, activeUserId);
    };

    const getNextLevelPoints = (currentLevel: number) => currentLevel * 100;

    const getCurrentLevelProgress = () => {
        const currentPoints = points;
        const currentLevel = userProfile.level;
        const currentLevelPoints = (currentLevel - 1) * 100;
        const nextLevelPoints = currentLevel * 100;
        const progress = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
        return Math.min(100, Math.max(0, progress));
    };

    const getNextMilestone = () => {
        if (points < 100) return { points: 100, name: "Principiante" };
        if (points < 500) return { points: 500, name: "Intermedio" };
        if (points < 1000) return { points: 1000, name: "Experto" };
        return { points: 2000, name: "Maestro" };
    };

    const nextMilestone = getNextMilestone();
    const progressToNext = ((points % nextMilestone.points) / nextMilestone.points) * 100;
    const canRedeem = (prizePoints: number) => points >= prizePoints;

    const generateValidationCode = () => Math.random().toString(36).substring(2, 10).toUpperCase();

    const handleRedeemClick = (prize: Prize) => {
        setSelectedPrize(prize);
        setValidationCode(generateValidationCode());
        setShowRedeemModal(true);
    };

    const confirmRedeem = async () => {
        if (!selectedPrize) return;
        try {
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

            if (activeUserId) {
                saveRedeemedPrizeToSupabase(newRedeemedPrize, activeUserId);
            }

            window.dispatchEvent(new CustomEvent('prizes:redeem', {
                detail: { prize: newRedeemedPrize, totalCount: updatedPrizes.length }
            }));

            setShowRedeemModal(false);
            toast({
                title: "¡Premio Canjeado!",
                description: `Tu código de validación: ${validationCode}. Guárdalo para reclamar tu premio.`,
                duration: 10000,
            });
            setSelectedPrize(null);
            setValidationCode("");
            setPuntosSubTab('reclamados');
        } catch (error) {
            console.error('Error redeeming prize:', error);
            toast({
                title: "Error",
                description: "No se pudo canjear el premio. Intenta de nuevo.",
                variant: "destructive"
            });
        }
    };

    const isAuthenticated = !!user;

    // Componente para usuarios no registrados - Dashboard Público
    const PublicDashboard = () => (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Cápsulas Observauto</h1>
                    <p className="text-gray-600 mt-1">Explora nuestro sistema de aprendizaje gamificado</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Acceso Público</Badge>
                </div>
            </div>

            <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                <CardContent className="p-6">
                    <div className="text-center space-y-4">
                        <UserX className="h-12 w-12 text-blue-600 mx-auto" />
                        <h2 className="text-xl font-semibold text-gray-900">Inicia sesión para ver tu progreso personal</h2>
                        <p className="text-gray-600">Accede con tu cuenta para ver tus puntos, insignias, premios y cápsulas en progreso</p>
                        <Button onClick={signInWithGoogle} className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white hover:from-[#1C3B71]/90 hover:to-[#D70102]/90">
                            <LogIn className="h-4 w-4 mr-2" />
                            Iniciar Sesión
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Reusing DashboardPrizes logic partially for public view or just simple list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Gift className="h-5 w-5 text-primary" />Premios Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {PRIZES.slice(0, 4).map((prize) => (
                                <div key={prize.id} className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow">
                                    <img src={prize.image} alt={prize.name} className="w-16 h-16 object-cover rounded-lg" />
                                    <div className="flex-1">
                                        <h4 className="font-medium text-sm">{prize.name}</h4>
                                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{prize.description}</p>
                                    </div>
                                </div>
                            ))}
                            <p className="text-xs text-gray-500 text-center">+{PRIZES.length - 4} premios más disponibles</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-primary" />Insignias Posibles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-3">
                            {Object.values(AVAILABLE_BADGES).slice(0, 8).map((badge) => (
                                <div key={badge.code} className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow">
                                    <div className="text-3xl mb-2">{badge.icon}</div>
                                    <h4 className="font-medium text-sm mb-1">{badge.name}</h4>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
            <UnifiedFooter />
        </div>
    );

    if (!isAuthenticated) return <PublicDashboard />;

    return (
        <div className="container mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
                    <p className="text-gray-600 mt-1">Bienvenido, {user?.name || userProfile.name}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Usuario Registrado</Badge>
                </div>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-auto md:grid-cols-4">
                    <TabsTrigger value="resumen">Resumen</TabsTrigger>
                    <TabsTrigger value="premios">Puntos y Premios</TabsTrigger>
                    <TabsTrigger value="capsulas">Cápsulas</TabsTrigger>
                    <TabsTrigger value="perfil">Perfil</TabsTrigger>
                </TabsList>

                <TabsContent value="resumen" className="space-y-6">
                    <DashboardStats
                        points={points}
                        userLevel={userProfile.level}
                        badgesCount={earnedBadges.length}
                        pendingPrizesCount={redeemedPrizes.filter(p => !p.status || p.status === 'pending').length}
                        deliveredPrizesCount={redeemedPrizes.filter(p => p.status === 'delivered').length}
                    />
                    <DashboardLevelProgress
                        userLevel={userProfile.level}
                        points={points}
                        nextLevelPoints={getNextLevelPoints(userProfile.level)}
                        progress={getCurrentLevelProgress()}
                        pointsToNext={getNextLevelPoints(userProfile.level) - points}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Flame className="h-5 w-5" />Próximo Hito</CardTitle>
                            </CardHeader>
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
                                    <div className="text-2xl font-bold">{PRIZES.filter(p => canRedeem(p.points)).length}</div>
                                    <div className="text-xs text-muted-foreground">Premios Disponibles</div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5" />Últimas Insignias</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {earnedBadges.length > 0 ? (
                                    <div className="space-y-3">
                                        {earnedBadges.slice(0, 3).map((badge) => (
                                            <div key={badge.code} className="flex items-center gap-3">
                                                <div className="text-2xl">{badge.icon}</div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">{badge.name}</p>
                                                    <p className="text-xs text-gray-600">{badge.description}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-600 text-center py-4">Aún no has obtenido insignias</p>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="premios" className="space-y-6">
                    <DashboardPrizes
                        prizes={PRIZES}
                        redeemedPrizes={redeemedPrizes}
                        earnedBadges={earnedBadges}
                        points={points}
                        activeSubTab={puntosSubTab}
                        setActiveSubTab={setPuntosSubTab}
                        onRedeemClick={handleRedeemClick}
                    />
                </TabsContent>

                <TabsContent value="capsulas" className="space-y-4">
                    <DashboardCapsules
                        userCapsules={userCapsules}
                        favorites={favorites}
                        filter={capsuleFilter}
                        setFilter={setCapsuleFilter}
                    />
                </TabsContent>

                <TabsContent value="perfil" className="space-y-4">
                    <DashboardProfile
                        userProfile={userProfile}
                        points={points}
                        onEditClick={() => setShowEditProfileModal(true)}
                    />
                </TabsContent>
            </Tabs>

            <RedeemModal
                open={showRedeemModal}
                onOpenChange={setShowRedeemModal}
                selectedPrize={selectedPrize}
                validationCode={validationCode}
                userPoints={points}
                onConfirm={confirmRedeem}
                onCancel={() => {
                    setShowRedeemModal(false);
                    setSelectedPrize(null);
                    setValidationCode("");
                }}
            />

            <EditProfileModal
                open={showEditProfileModal}
                onOpenChange={setShowEditProfileModal}
                profile={userProfile}
                onProfileUpdate={handleProfileUpdate}
            />

            <UnifiedFooter />
        </div>
    );
}
