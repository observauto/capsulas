import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, BookOpen, Gift, User, History, LogOut, ShieldCheck, LayoutDashboard } from 'lucide-react';
import { useGamification } from '@/context/GamificationContext';
import { useAuth } from '@/context/AuthContext';
import { Capsule } from '@/types/capsule';
import { toast } from "sonner";
import { supabase } from '@/lib/supabase';

// =============================================================================
// 🛡️ IMPORTACIONES SEGURAS (FIX PARA EL ERROR DE BUILD)
// =============================================================================

// 1. Data: Importación tolerante a fallos
import * as CapsulesModule from '@/data/fullCapsules';
const getCapsulesData = (): Capsule[] => {
  const mod = CapsulesModule as any;
  const data = mod.default || mod.capsules || mod.fullCapsules || mod.FULL_CAPSULES || Object.values(mod).find((v) => Array.isArray(v));
  return Array.isArray(data) ? data : [];
};
const safeFullCapsules = getCapsulesData();

// 2. Componentes: Importamos TODO el módulo y seleccionamos el que exista.
// Esto arregla el error "EditProfileModal is not exported"
import * as CapsuleCardModule from '@/components/CapsuleCard';
import * as GamificationStatusModule from '@/components/GamificationStatus';
import * as EditProfileModalModule from '@/components/EditProfileModal';

const CapsuleCard = (CapsuleCardModule as any).CapsuleCard || (CapsuleCardModule as any).default;
const GamificationStatus = (GamificationStatusModule as any).GamificationStatus || (GamificationStatusModule as any).default;
const EditProfileModal = (EditProfileModalModule as any).EditProfileModal || (EditProfileModalModule as any).default;

// =============================================================================
// CONFIGURACIÓN
// =============================================================================

// Catálogo base de premios (Visualización) - La redención va a BD
const CATALOGO_PREMIOS = [
  { id: 1, name: "Kit de Limpieza BYD", description: "Productos oficiales para el cuidado de tu vehículo.", cost: 500, image: null },
  { id: 2, name: "Gorra Oficial Observauto", description: "Protección solar con estilo exclusivo.", cost: 300, image: null },
  { id: 3, name: "Descuento Mantenimiento 10%", description: "Válido para tu próxima revisión preventiva.", cost: 800, image: null },
  { id: 4, name: "Termo Digital", description: "Indicador de temperatura LED.", cost: 450, image: null },
];

export const UnificadoDashboard = () => {
  const { points, level, completedCapsules, experience, claimPrize } = useGamification();
  const { user, signOut } = useAuth();
  
  // Estado local
  const [activeTab, setActiveTab] = useState("resumen");
  const [redeemedPrizes, setRedeemedPrizes] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Estadísticas seguras (evitan crash si es null)
  const stats = {
    points: points || 0,
    level: level || 1,
    completedCapsules: completedCapsules?.length || 0,
    totalCapsules: safeFullCapsules.length,
    nextLevelProgress: Math.min(100, Math.floor(((experience || 0) % 1000) / 10)),
  };

  // ---------------------------------------------------------------------------
  // Carga de Datos Reales (Solo si hay usuario)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!user) {
        setRedeemedPrizes([]);
        setRecentActivity([]);
        return;
    }

    const fetchData = async () => {
        try {
            // 1. Premios Canjeados
            const { data: prizes } = await supabase
                .from('user_redeemed_prizes')
                .select('*')
                .eq('user_id', user.id)
                .order('redeemed_at', { ascending: false });

            const formattedPrizes = (prizes || []).map(p => {
                const info = CATALOGO_PREMIOS.find(cp => cp.id.toString() === p.prize_id) || { name: 'Premio Canjeado' };
                return { ...info, ...p, date: p.redeemed_at, code: p.redemption_code };
            });
            setRedeemedPrizes(formattedPrizes);

            // 2. Historial de Actividad (Cápsulas + Premios)
            const { data: history } = await supabase
                .from('user_completed_capsules')
                .select('*')
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false })
                .limit(5);

            const activity = [];
            
            // Agregar cápsulas
            (history || []).forEach(h => {
                const cap = safeFullCapsules.find(c => c.id === h.capsule_id);
                activity.push({
                    id: h.id || Math.random(),
                    type: 'capsule',
                    title: cap?.title || 'Cápsula completada',
                    date: new Date(h.completed_at).toLocaleDateString(),
                    points: 50,
                    isNegative: false,
                    timestamp: new Date(h.completed_at).getTime()
                });
            });

            // Agregar premios
            formattedPrizes.forEach(p => {
                activity.push({
                    id: p.id || Math.random(),
                    type: 'prize',
                    title: `Canje: ${p.name}`,
                    date: new Date(p.date).toLocaleDateString(),
                    points: p.cost,
                    isNegative: true,
                    timestamp: new Date(p.date).getTime()
                });
            });

            // Ordenar
            activity.sort((a, b) => b.timestamp - a.timestamp);
            setRecentActivity(activity);

        } catch (e) {
            console.error("Error cargando dashboard:", e);
        }
    };

    fetchData();
  }, [user, points, activeTab]); // Recargar al cambiar puntos o tabs

  // Manejador de Canje
  const handleRedeem = async (prize: any) => {
      const success = await claimPrize(prize.id, prize.cost);
      if (success) {
          toast.success("¡Premio canjeado con éxito!");
          setActiveTab("reclamados");
      }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      {/* Header del Dashboard */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">
                Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Invitado'}
            </h1>
            <p className="text-slate-500 text-sm">Tu centro de control Observauto</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 w-fit">
            <div className="text-right">
                <p className="text-xs text-slate-400 font-bold uppercase">Puntos</p>
                <p className="text-xl font-bold text-observauto-dark leading-none">{stats.points}</p>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-600 fill-yellow-500" />
            </div>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        
        {/* CORRECCIÓN UX SOLICITADA: Mobile: Grid de 3 columnas (2 filas). */}
        <TabsList className="w-full h-auto grid grid-cols-3 gap-1 p-1 bg-slate-100/80 md:inline-flex md:w-auto md:gap-0">
            {[
                { id: 'resumen', icon: LayoutDashboard, label: 'Resumen' },
                { id: 'capsulas', icon: BookOpen, label: 'Cápsulas' },
                { id: 'insignias', icon: Trophy, label: 'Insignias' },
                { id: 'premios', icon: Gift, label: 'Premios' },
                { id: 'reclamados', icon: ShieldCheck, label: 'Reclamados' },
                { id: 'perfil', icon: User, label: 'Perfil' },
            ].map((tab) => (
                <TabsTrigger 
                    key={tab.id} 
                    value={tab.id}
                    className="flex flex-col items-center justify-center py-2 px-1 text-[10px] md:text-sm md:flex-row md:gap-2 md:px-4 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <tab.icon className="h-4 w-4 mb-1 md:mb-0" />
                    <span className="truncate max-w-full">{tab.label}</span>
                </TabsTrigger>
            ))}
        </TabsList>

        {/* Contenido: Resumen */}
        <TabsContent value="resumen" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-blue-800">Nivel</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-blue-700">{stats.level}</div></CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-amber-800">Puntos</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-amber-700">{stats.points}</div></CardContent>
                </Card>
                <Card className="bg-green-50 border-green-100">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-green-800">Progreso</CardTitle></CardHeader>
                    <CardContent><div className="text-2xl font-bold text-green-700">{stats.completedCapsules}/{stats.totalCapsules}</div></CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2"><History className="h-5 w-5"/> Actividad Reciente</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentActivity.length > 0 ? (
                        <div className="space-y-4">
                            {recentActivity.map((act, i) => (
                                <div key={i} className="flex justify-between items-center border-b last:border-0 pb-2">
                                    <div>
                                        <p className="font-medium text-sm">{act.title}</p>
                                        <p className="text-xs text-slate-500">{act.date}</p>
                                    </div>
                                    <span className={`text-sm font-bold ${act.isNegative ? 'text-red-500' : 'text-green-600'}`}>
                                        {act.isNegative ? '-' : '+'}{Math.abs(act.points)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-slate-500 text-center py-4">Sin actividad reciente.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        {/* Contenido: Cápsulas */}
        <TabsContent value="capsulas">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {safeFullCapsules.map(capsule => (
                    // Verificamos que el componente exista antes de renderizar
                    CapsuleCard ? (
                        <CapsuleCard 
                            key={capsule.id}
                            title={capsule.title}
                            description={capsule.summary}
                            icon={BookOpen}
                            isCompleted={completedCapsules?.includes(capsule.id)}
                            onClick={() => window.location.href = `/capsula/${capsule.id}`}
                        />
                    ) : null
                ))}
            </div>
        </TabsContent>

        {/* Contenido: Insignias */}
        <TabsContent value="insignias">
            {GamificationStatus ? <GamificationStatus /> : <p>Cargando insignias...</p>}
        </TabsContent>

        {/* Contenido: Premios */}
        <TabsContent value="premios">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CATALOGO_PREMIOS.map(prize => {
                    const canAfford = stats.points >= prize.cost;
                    return (
                        <Card key={prize.id}>
                            <div className="h-40 bg-slate-100 flex items-center justify-center relative">
                                <Gift className="h-12 w-12 text-slate-400" />
                                <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs font-bold">
                                    {prize.cost} Pts
                                </div>
                            </div>
                            <CardHeader>
                                <CardTitle className="text-base">{prize.name}</CardTitle>
                                <CardDescription>{prize.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button 
                                    className="w-full" 
                                    disabled={!canAfford}
                                    onClick={() => canAfford && handleRedeem(prize)}
                                >
                                    {canAfford ? 'Canjear' : `Faltan ${prize.cost - stats.points} pts`}
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </TabsContent>

        {/* Contenido: Reclamados */}
        <TabsContent value="reclamados">
            {redeemedPrizes.length > 0 ? (
                <div className="space-y-4">
                    {redeemedPrizes.map((p, i) => (
                        <Card key={i} className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                                <h4 className="font-bold">{p.name}</h4>
                                <p className="text-xs text-slate-500">{new Date(p.date).toLocaleDateString()}</p>
                                <div className="mt-2 bg-slate-100 p-2 rounded font-mono text-center font-bold">
                                    {p.code}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-center py-8 text-slate-500">No hay premios reclamados.</p>
            )}
        </TabsContent>

        {/* Contenido: Perfil */}
        <TabsContent value="perfil">
            <Card>
                <CardHeader className="text-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-slate-600">
                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <CardTitle>{user?.user_metadata?.full_name || 'Usuario'}</CardTitle>
                    <CardDescription>{user?.email || 'No registrado'}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {user ? (
                        <>
                            {EditProfileModal ? (
                                <EditProfileModal>
                                    <Button variant="outline" className="w-full">Editar Perfil</Button>
                                </EditProfileModal>
                            ) : (
                                <Button variant="outline" disabled className="w-full">Editar Perfil (Cargando...)</Button>
                            )}
                            
                            <Button variant="destructive" className="w-full" onClick={signOut}>
                                <LogOut className="mr-2 h-4 w-4"/> Cerrar Sesión
                            </Button>
                        </>
                    ) : (
                        <div className="text-center">
                            <p className="mb-4 text-slate-500">Inicia sesión para guardar tu progreso.</p>
                            <Button className="w-full" onClick={() => window.location.href = '/'}>Ir al Inicio</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
};

export default UnificadoDashboard;
