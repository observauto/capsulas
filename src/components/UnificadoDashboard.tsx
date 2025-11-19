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
// 🛡️ IMPORTACIONES SEGURAS Y BLINDADAS
// =============================================================================

// 1. Data Cápsulas
import * as CapsulesModule from '@/data/fullCapsules';
const getCapsulesData = (): Capsule[] => {
  const module = CapsulesModule as any;
  const data = module.default || module.capsules || module.fullCapsules || module.FULL_CAPSULES || module.data || Object.values(module).find(val => Array.isArray(val));
  return Array.isArray(data) ? data : [];
};
const safeFullCapsules = getCapsulesData();

// 2. Componentes UI (CapsuleCard, GamificationStatus, EditProfileModal)
import * as CapsuleCardModule from '@/components/CapsuleCard';
import * as GamificationStatusModule from '@/components/GamificationStatus';
import * as EditProfileModalModule from '@/components/EditProfileModal';

const CapsuleCard = (CapsuleCardModule as any).CapsuleCard || (CapsuleCardModule as any).default;
const GamificationStatus = (GamificationStatusModule as any).GamificationStatus || (GamificationStatusModule as any).default;
// Recuperamos el modal de edición de forma segura
const EditProfileModal = (EditProfileModalModule as any).EditProfileModal || (EditProfileModalModule as any).default;

// =============================================================================
// 🎁 CATÁLOGO DE PREMIOS BASE
// =============================================================================
const CATALOGO_PREMIOS = [
  { 
    id: 1, 
    name: "Kit de Limpieza BYD", 
    description: "Mantén tu vehículo impecable con productos oficiales.", 
    cost: 500, 
    image: null 
  },
  { 
    id: 2, 
    name: "Gorra Oficial Observauto", 
    description: "Protégete del sol con estilo.", 
    cost: 300, 
    image: null 
  },
  { 
    id: 3, 
    name: "Mantenimiento Preventivo 10%", 
    description: "Descuento en tu próxima revisión.", 
    cost: 800, 
    image: null 
  },
  { 
    id: 4, 
    name: "Termo Inteligente", 
    description: "Mantiene la temperatura y muestra grados.", 
    cost: 450, 
    image: null 
  },
];

// =============================================================================
// 🧩 SUB-COMPONENTES
// =============================================================================

const ResumenTab = ({ stats, recentActivity }: { stats: any, recentActivity: any[] }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-blue-50 border-blue-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Nivel Actual</CardTitle>
          <Trophy className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats?.level || 1}</div>
          <p className="text-xs text-blue-600 mt-1">Nivel de Experiencia</p>
        </CardContent>
      </Card>
      <Card className="bg-amber-50 border-amber-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-900">Puntos Totales</CardTitle>
          <Star className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{stats?.points || 0}</div>
          <p className="text-xs text-amber-600 mt-1">Disponibles para canje</p>
        </CardContent>
      </Card>
      <Card className="bg-green-50 border-green-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">Cápsulas</CardTitle>
          <BookOpen className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats?.completedCapsules || 0} / {stats?.totalCapsules || 0}</div>
          <p className="text-xs text-green-600 mt-1">Completadas</p>
        </CardContent>
      </Card>
    </div>

    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            Tu Historial Real
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-full">
                    {activity.type === 'capsule' ? <BookOpen className="h-4 w-4 text-slate-600" /> : 
                     <Gift className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${activity.isNegative ? 'text-red-500' : 'text-green-600'}`}>
                    {activity.isNegative ? '-' : '+'}{Math.abs(activity.points)} pts
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>No hay actividad reciente registrada en tu cuenta.</p>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

const CapsulasTab = ({ completedCapsules }: { completedCapsules: string[] }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">Tu Biblioteca</h3>
      <span className="text-sm text-slate-500">{completedCapsules?.length || 0} completadas</span>
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeFullCapsules.map((capsule) => {
          if (!CapsuleCard) return null;
          return (
            <CapsuleCard 
              key={capsule.id} 
              title={capsule.title} 
              description={capsule.summary || capsule.description} 
              icon={BookOpen}
              capsule={capsule}
              isFavorite={false} 
              onToggleFavorite={() => {}}
              onExplore={() => window.location.href = `/capsulas/${capsule.slug || capsule.id}`}
              onClick={() => window.location.href = `/capsula/${capsule.id}`} 
              isCompleted={completedCapsules?.includes(capsule.id)}
            />
          );
      })}
    </div>
  </div>
);

const PremiosTab = ({ onRedeem, points }: { onRedeem: (prize: any) => void, points: number }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <h3 className="text-lg font-semibold text-slate-900 mb-4">Catálogo de Recompensas</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {CATALOGO_PREMIOS.map((prize) => {
        const canAfford = points >= prize.cost;
        return (
            <Card key={prize.id} className="overflow-hidden border-slate-200">
            <div className="h-40 bg-slate-100 relative flex items-center justify-center">
                <Gift className="h-12 w-12 text-slate-400" />
                <div className="absolute top-2 right-2 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold">
                    {prize.cost} Pts
                </div>
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{prize.name}</CardTitle>
                <CardDescription className="text-xs">{prize.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button 
                    className="w-full bg-observauto-dark hover:bg-observauto-dark/90 disabled:bg-slate-200 disabled:text-slate-500"
                    onClick={() => canAfford && onRedeem(prize)}
                    disabled={!canAfford}
                >
                    {canAfford ? 'Canjear Ahora' : `Faltan ${prize.cost - points} pts`}
                </Button>
            </CardContent>
            </Card>
        );
      })}
    </div>
  </div>
);

const ReclamadosTab = ({ redeemedPrizes }: { redeemedPrizes: any[] }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Mis Premios Canjeados</h3>
      <div className="grid grid-cols-1 gap-4">
        {redeemedPrizes && redeemedPrizes.length > 0 ? (
          redeemedPrizes.map((item, index) => (
            <Card key={index} className="border-l-4 border-l-green-500 shadow-sm bg-white">
              <CardContent className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div>
                    <h4 className="font-bold text-base text-slate-900">{item.prizeName}</h4>
                    <p className="text-xs text-slate-500">Fecha: {new Date(item.date).toLocaleDateString()}</p>
                    <div className="mt-2 inline-block bg-slate-100 px-3 py-1 rounded border border-slate-200">
                         <span className="text-xs text-slate-500 mr-2">CÓDIGO:</span>
                         <span className="text-sm font-mono font-bold text-observauto-dark">{item.code}</span>
                    </div>
                 </div>
                 <Button variant="outline" size="sm">Ver Detalles</Button>
              </CardContent>
            </Card>
          ))
        ) : (
           <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
             <Gift className="h-8 w-8 text-slate-300 mx-auto mb-2" />
             <p className="text-sm text-slate-500">No has canjeado premios aún.</p>
           </div>
        )}
      </div>
    </div>
);

// 🛠️ Corrección Perfil: Usamos el EditProfileModal real
const PerfilTab = ({ user, onLogout }: { user: any, onLogout: () => void }) => (
  <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
    <Card className="shadow-md border-slate-200">
        <CardHeader className="text-center pb-2">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-blue-600">
                {user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <CardTitle className="text-xl font-bold text-slate-900">
                {user?.user_metadata?.full_name || 'Usuario'}
            </CardTitle>
            <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Miembro desde</p>
                    <p className="font-medium text-slate-900">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : '2025'}
                    </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Estado</p>
                    <p className="font-medium text-green-600 flex items-center justify-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Activo
                    </p>
                </div>
            </div>

            {/* BOTÓN CORREGIDO: Envuelto en el modal si existe, o fallback seguro */}
            {EditProfileModal ? (
                <EditProfileModal>
                    <Button variant="outline" className="w-full">
                        Editar Información Personal
                    </Button>
                </EditProfileModal>
            ) : (
                <Button variant="outline" className="w-full" disabled>
                    Editar Información (No disponible)
                </Button>
            )}

            <Button variant="destructive" className="w-full" onClick={onLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Cerrar Sesión
            </Button>
        </CardContent>
    </Card>
  </div>
);

// =============================================================================
// 🚀 DASHBOARD PRINCIPAL
// =============================================================================

export const UnificadoDashboard = () => {
  const { points, level, completedCapsules: completedIds, claimPrize } = useGamification();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("resumen");
  const [redeemedPrizes, setRedeemedPrizes] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  const stats = {
    points: points || 0,
    level: level || 1,
    completedCapsules: completedIds?.length || 0,
    totalCapsules: (safeFullCapsules || []).length,
  };

  // CARGAR DATOS REALES
  useEffect(() => {
    const loadRealData = async () => {
        if (!user) return;
        
        try {
            // 1. Premios Canjeados
            const { data: prizes, error: pError } = await supabase
                .from('user_redeemed_prizes')
                .select('*')
                .eq('user_id', user.id)
                .order('redeemed_at', { ascending: false });
            
            if (pError) throw pError;

            const formattedRedeemed = (prizes || []).map(p => {
                const details = CATALOGO_PREMIOS.find(cp => cp.id.toString() === p.prize_id) || { name: 'Premio' };
                return {
                    prizeName: details.name,
                    date: p.redeemed_at,
                    code: p.redemption_code,
                    cost: p.cost
                };
            });
            setRedeemedPrizes(formattedRedeemed);

            // 2. Historial de Cápsulas
            const { data: history, error: hError } = await supabase
                .from('user_completed_capsules')
                .select('*')
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false })
                .limit(5);

            if (hError) throw hError;

            // 3. Unificar Actividad
            const activity = [];
            (history || []).forEach(h => {
                const cap = safeFullCapsules.find(c => c.id === h.capsule_id);
                activity.push({
                    type: 'capsule',
                    title: cap ? cap.title : 'Cápsula completada',
                    date: new Date(h.completed_at).toLocaleDateString(),
                    points: 50,
                    isNegative: false,
                    timestamp: new Date(h.completed_at).getTime()
                });
            });

            formattedRedeemed.forEach(p => {
                activity.push({
                    type: 'prize',
                    title: `Canje: ${p.prizeName}`,
                    date: new Date(p.date).toLocaleDateString(),
                    points: p.cost,
                    isNegative: true,
                    timestamp: new Date(p.date).getTime()
                });
            });

            activity.sort((a, b) => b.timestamp - a.timestamp);
            setRecentActivity(activity);

        } catch (e) {
            console.error("Error cargando datos:", e);
        }
    };

    loadRealData();
  }, [user, activeTab, points]);

  const handleRedeem = async (prize: any) => {
      const success = await claimPrize(prize.id, prize.cost);
      if (success) {
          toast.success(`Canje exitoso: ${prize.name}`);
          setActiveTab("reclamados");
      }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold text-slate-900">Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Conductor'}</h1>
        </div>
        <div className="flex flex-col items-end bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200">
            <span className="text-xs text-slate-400 font-bold">MIS PUNTOS</span>
            <span className="text-xl font-bold text-observauto-dark flex items-center gap-2">
                {points || 0} <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            </span>
        </div>
      </div>

      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        {/* NAVEGACIÓN CORREGIDA: Grid 2 filas x 3 columnas en móvil */}
        <TabsList className="w-full h-auto grid grid-cols-3 gap-1 p-1 bg-slate-100 md:inline-flex md:w-auto md:gap-0">
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
                    className="flex flex-col items-center justify-center py-3 px-1 text-xs md:flex-row md:py-2 md:px-4 md:text-sm gap-1 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                    <tab.icon className="h-4 w-4" />
                    <span className="line-clamp-1">{tab.label}</span>
                </TabsTrigger>
            ))}
        </TabsList>

        <TabsContent value="resumen"><ResumenTab stats={stats} recentActivity={recentActivity} /></TabsContent>
        <TabsContent value="capsulas"><CapsulasTab completedCapsules={completedIds} /></TabsContent>
        <TabsContent value="insignias">
            {GamificationStatus ? <GamificationStatus /> : <p className="text-center text-slate-500">Cargando...</p>}
        </TabsContent>
        <TabsContent value="premios"><PremiosTab availablePrizes={CATALOGO_PREMIOS} onRedeem={handleRedeem} points={points || 0} /></TabsContent>
        <TabsContent value="reclamados"><ReclamadosTab redeemedPrizes={redeemedPrizes} /></TabsContent>
        <TabsContent value="perfil">
            <PerfilTab user={user} onLogout={signOut} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnificadoDashboard;
