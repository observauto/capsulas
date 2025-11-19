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
// 🛡️ ESTRATEGIA DE IMPORTACIÓN SEGURA
// Evita errores de compilación detectando automáticamente la exportación
// =============================================================================

// 1. Data Cápsulas
import * as CapsulesModule from '@/data/fullCapsules';
const getCapsulesData = (): Capsule[] => {
  const module = CapsulesModule as any;
  const data = module.default || module.capsules || module.fullCapsules || module.FULL_CAPSULES || module.data || Object.values(module).find(val => Array.isArray(val));
  return Array.isArray(data) ? data : [];
};
const safeFullCapsules = getCapsulesData();

// 2. Componentes UI
import * as CapsuleCardModule from '@/components/CapsuleCard';
import * as GamificationStatusModule from '@/components/GamificationStatus';

// Resolución segura de componentes (usa named o default según exista)
const CapsuleCard = (CapsuleCardModule as any).CapsuleCard || (CapsuleCardModule as any).default;
const GamificationStatus = (GamificationStatusModule as any).GamificationStatus || (GamificationStatusModule as any).default;

// =============================================================================
// 📦 CATÁLOGO DE PREMIOS BASE (Para redención real)
// Esto asegura que siempre haya premios visibles para canjear.
// =============================================================================
const CATALOGO_PREMIOS = [
  { id: 1, name: "Kit de Limpieza BYD", description: "Mantén tu vehículo impecable con productos oficiales.", cost: 500, image: null },
  { id: 2, name: "Gorra Oficial Observauto", description: "Protégete del sol con estilo.", cost: 300, image: null },
  { id: 3, name: "Mantenimiento Preventivo 10%", description: "Descuento en tu próxima revisión.", cost: 800, image: null },
  { id: 4, name: "Termo Inteligente", description: "Mantiene la temperatura y muestra grados.", cost: 450, image: null },
];

// =============================================================================
// 🧩 SUB-COMPONENTES (LÓGICA REAL)
// =============================================================================

const ResumenTab = ({ stats, recentActivity, loadingActivity }: { stats: any, recentActivity: any[], loadingActivity: boolean }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    {/* Grid de Estadísticas Principales */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-900">Nivel Actual</CardTitle>
          <Trophy className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-700">{stats?.level || 1}</div>
          <p className="text-xs text-blue-600 mt-1">{stats?.nextLevelProgress || 0}% para el siguiente nivel</p>
          <Progress value={stats?.nextLevelProgress || 0} className="h-2 mt-2 bg-blue-200" indicatorClassName="bg-blue-600" />
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-900">Puntos Totales</CardTitle>
          <Star className="h-4 w-4 text-amber-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-amber-700">{stats?.points || 0}</div>
          <p className="text-xs text-amber-600 mt-1">Puntos acumulados</p>
        </CardContent>
      </Card>
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-100 shadow-sm">
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

    {/* Actividad Reciente REAL (Desde DB) */}
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            Actividad Reciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loadingActivity ? (
           <div className="text-center py-8 text-slate-400">Cargando actividad...</div>
        ) : recentActivity && recentActivity.length > 0 ? (
          <div className="space-y-4">
            {recentActivity.map((activity, i) => (
              <div key={i} className="flex items-center justify-between border-b border-slate-100 last:border-0 pb-3 last:pb-0">
                <div className="flex items-center gap-3">
                  <div className="bg-slate-100 p-2 rounded-full">
                    {activity.type === 'capsule' ? <BookOpen className="h-4 w-4 text-slate-600" /> : 
                     activity.type === 'prize' ? <Gift className="h-4 w-4 text-purple-600" /> :
                     <Star className="h-4 w-4 text-amber-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${activity.points > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {activity.points > 0 ? '+' : ''}{activity.points} pts
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>Aún no tienes actividad registrada.</p>
            <Button variant="link" className="mt-2 text-blue-600" onClick={() => document.getElementById('tab-capsulas')?.click()}>
                Comenzar una cápsula
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  </div>
);

const CapsulasTab = ({ completedCapsules }: { completedCapsules: string[] }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-slate-900">Tu Biblioteca de Aprendizaje</h3>
      <span className="text-sm text-slate-500">{completedCapsules?.length || 0} de {(safeFullCapsules || []).length} completadas</span>
    </div>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {safeFullCapsules && safeFullCapsules.length > 0 ? (
        safeFullCapsules.map((capsule) => {
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
        })
      ) : (
        <div className="col-span-full text-center py-12 text-slate-500">
          <p>Cargando contenido educativo...</p>
        </div>
      )}
    </div>
  </div>
);

const InsigniasTab = () => (
   <div className="space-y-6 animate-in fade-in duration-500">
       {GamificationStatus ? <GamificationStatus /> : <p className="text-center text-slate-400">Cargando insignias...</p>}
   </div>
);

const PremiosTab = ({ onRedeem, points }: { onRedeem: (prize: any) => void, points: number }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {CATALOGO_PREMIOS.map((prize) => {
        const canAfford = points >= prize.cost;
        return (
            <Card key={prize.id} className={`overflow-hidden transition-all border-slate-200 ${canAfford ? 'hover:shadow-md' : 'opacity-80'}`}>
            <div className="h-48 bg-slate-100 relative">
                <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <Gift className="h-12 w-12" />
                </div>
                {prize.image && <img src={prize.image} alt={prize.name} className="w-full h-full object-cover" />}
                <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${canAfford ? 'bg-green-600 text-white' : 'bg-slate-600 text-white'}`}>
                    {prize.cost} Pts
                </div>
            </div>
            <CardHeader>
                <CardTitle className="text-lg">{prize.name}</CardTitle>
                <CardDescription>{prize.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button 
                    className={`w-full ${canAfford ? 'bg-observauto-dark hover:bg-observauto-dark/90' : 'bg-slate-300 cursor-not-allowed text-slate-500'}`}
                    onClick={() => canAfford && onRedeem(prize)}
                    disabled={!canAfford}
                >
                    {canAfford ? 'Canjear Recompensa' : `Faltan ${prize.cost - points} pts`}
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
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div>
                    <h4 className="font-bold text-lg text-slate-900">{item.prizeName}</h4>
                    <p className="text-sm text-slate-500">Canjeado el: {new Date(item.date).toLocaleDateString()}</p>
                    <div className="mt-3 flex items-center gap-2">
                         <span className="text-xs font-semibold text-slate-500 uppercase">Código de Validación:</span>
                         <code className="bg-slate-100 px-3 py-1 rounded text-sm font-mono text-observauto-dark font-bold border border-slate-200">
                             {item.code || 'GENERANDO...'}
                         </code>
                    </div>
                 </div>
                 <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50 shrink-0">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Instrucciones
                 </Button>
              </CardContent>
            </Card>
          ))
        ) : (
           <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
             <Gift className="h-10 w-10 text-slate-300 mx-auto mb-2" />
             <p className="text-slate-500">Aún no has canjeado premios.</p>
           </div>
        )}
      </div>
    </div>
);

const PerfilTab = ({ user, onLogout, onEditProfile }: { user: any, onLogout: () => void, onEditProfile: () => void }) => (
  <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-500">
    <Card className="shadow-md border-slate-200">
        <CardHeader className="text-center pb-2">
            <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm text-3xl font-bold text-blue-600">
                {user?.user_metadata?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <CardTitle className="text-2xl font-bold text-slate-900">
                {user?.user_metadata?.full_name || 'Usuario Observauto'}
            </CardTitle>
            <CardDescription>{user?.email}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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

            <div className="space-y-3 pt-4">
                <Button variant="outline" className="w-full" id="open-edit-profile" onClick={onEditProfile}>
                    Editar Información Personal
                </Button>
                <Button variant="destructive" className="w-full" onClick={onLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Cerrar Sesión
                </Button>
            </div>
        </CardContent>
    </Card>
  </div>
);

// =============================================================================
// 🚀 COMPONENTE PRINCIPAL: UnificadoDashboard
// =============================================================================

export const UnificadoDashboard = () => {
  const { points, level, completedCapsules: completedIds, experience, claimPrize } = useGamification();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("resumen");
  const [redeemedPrizes, setRedeemedPrizes] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [loadingActivity, setLoadingActivity] = useState(false);

  // Stats Seguros
  const stats = {
    points: points || 0,
    level: level || 1,
    completedCapsules: completedIds?.length || 0,
    totalCapsules: (safeFullCapsules || []).length,
    nextLevelProgress: Math.min(100, Math.floor(((experience || 0) % 1000) / 10)),
  };

  // 📡 FETCH DATA REAL (Actividad y Premios Canjeados)
  useEffect(() => {
    const fetchRealData = async () => {
        if (!user) return;
        setLoadingActivity(true);
        
        try {
            // 1. Traer premios canjeados (Tabla REAL)
            const { data: prizesData, error: prizesError } = await supabase
                .from('user_redeemed_prizes')
                .select('*')
                .eq('user_id', user.id)
                .order('redeemed_at', { ascending: false });

            if (prizesError) console.error("Error fetching prizes:", prizesError);

            // Mapear premios para la UI
            const formattedPrizes = (prizesData || []).map(d => {
                // Intentar buscar nombre en catálogo local si no hay tabla de premios unida
                const catalogItem = CATALOGO_PREMIOS.find(p => p.id.toString() === d.prize_id) || { name: `Premio #${d.prize_id}` };
                return {
                    prizeName: catalogItem.name,
                    date: d.redeemed_at,
                    code: d.redemption_code,
                    prizeId: d.prize_id,
                    cost: d.cost
                };
            });
            setRedeemedPrizes(formattedPrizes);

            // 2. Traer cápsulas completadas (Tabla REAL) para Actividad
            const { data: capsulesData, error: capsulesError } = await supabase
                .from('user_completed_capsules')
                .select('*')
                .eq('user_id', user.id)
                .order('completed_at', { ascending: false })
                .limit(5);

            if (capsulesError) console.error("Error fetching history:", capsulesError);

            // 3. Construir Actividad Reciente Mezclada
            const activityLog = [];
            
            // Agregar cápsulas
            (capsulesData || []).forEach(c => {
                const capInfo = safeFullCapsules.find(fc => fc.id === c.capsule_id) || { title: "Cápsula Completada" };
                activityLog.push({
                    type: 'capsule',
                    title: `Completaste: ${capInfo.title}`,
                    date: new Date(c.completed_at).toLocaleDateString(),
                    points: 50, // Puntos estimados por cápsula
                    timestamp: new Date(c.completed_at).getTime()
                });
            });

            // Agregar premios canjeados
            formattedPrizes.forEach(p => {
                activityLog.push({
                    type: 'prize',
                    title: `Canjeaste: ${p.prizeName}`,
                    date: new Date(p.date).toLocaleDateString(),
                    points: -p.cost, // Puntos negativos
                    timestamp: new Date(p.date).getTime()
                });
            });

            // Ordenar por fecha descendente
            activityLog.sort((a, b) => b.timestamp - a.timestamp);
            setRecentActivity(activityLog.slice(0, 5)); // Solo los últimos 5

        } catch (e) {
            console.error("Error general fetching data:", e);
        } finally {
            setLoadingActivity(false);
        }
    };

    fetchRealData();
  }, [user, activeTab, points]); // Recargar si cambian puntos o tab

  const handleRedeem = async (prize: any) => {
      const success = await claimPrize(prize.id, prize.cost);
      if (success) {
          toast.success(`¡Has canjeado: ${prize.name}!`, {
              description: "Revisa la pestaña 'Reclamados' para ver tu código.",
          });
          setActiveTab("reclamados"); 
      } else {
          // El toast de error ya sale desde el context
      }
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-6xl">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Hola, {user?.user_metadata?.full_name?.split(' ')[0] || 'Conductor'}</h1>
            <p className="text-slate-500">Bienvenido a tu centro de control.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded-full shadow-sm border border-slate-200 flex items-center gap-3">
            <div className="flex flex-col items-end">
                <span className="text-xs text-slate-400 font-semibold uppercase">Puntos Disponibles</span>
                <span className="text-xl font-bold text-observauto-dark">{points || 0}</span>
            </div>
            <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                <Star className="h-5 w-5 fill-yellow-500" />
            </div>
        </div>
      </div>

      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="space-y-8">
        {/* =================================================================================
            UX FIX DEFINITIVO: NAVEGACIÓN MÓVIL (2 Filas x 3 Botones)
            Clase: grid grid-cols-3 (Móvil) -> md:flex (Escritorio)
            ================================================================================= */}
        <div className="w-full overflow-visible pb-0">
            <TabsList className="w-full h-auto grid grid-cols-3 gap-1 p-1 bg-slate-100/80 backdrop-blur-sm md:inline-flex md:w-auto md:gap-0">
            {[
                { id: 'resumen', icon: LayoutDashboard, label: 'Resumen' },
                { id: 'capsulas', icon: BookOpen, label: 'Cápsulas' },
                { id: 'insignias', icon: Trophy, label: 'Insignias' },
                { id: 'premios', icon: Gift, label: 'Premios' },
                { id: 'reclamados', icon: ShieldCheck, label: 'Reclamados' },
                { id: 'perfil', icon: User, label: 'Perfil' },
            ].map((tab) => (
                <TabsTrigger 
                    id={`tab-${tab.id}`}
                    key={tab.id} 
                    value={tab.id}
                    className="flex flex-col items-center gap-1 px-1 py-3 text-xs md:flex-row md:gap-2 md:px-4 md:py-2.5 md:text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-observauto-dark data-[state=active]:shadow-sm transition-all duration-200"
                >
                    <tab.icon className="h-4 w-4 md:h-4 md:w-4" />
                    <span className="line-clamp-1">{tab.label}</span>
                </TabsTrigger>
            ))}
            </TabsList>
        </div>

        <TabsContent value="resumen" className="focus-visible:outline-none">
            <ResumenTab stats={stats} recentActivity={recentActivity} loadingActivity={loadingActivity} />
        </TabsContent>

        <TabsContent value="capsulas" className="focus-visible:outline-none">
            <CapsulasTab completedCapsules={completedIds} />
        </TabsContent>

        <TabsContent value="insignias" className="focus-visible:outline-none">
            <InsigniasTab />
        </TabsContent>

        <TabsContent value="premios" className="focus-visible:outline-none">
            <PremiosTab availablePrizes={CATALOGO_PREMIOS} onRedeem={handleRedeem} points={points} />
        </TabsContent>

        <TabsContent value="reclamados" className="focus-visible:outline-none">
            <ReclamadosTab redeemedPrizes={redeemedPrizes} />
        </TabsContent>

        <TabsContent value="perfil" className="focus-visible:outline-none">
            <PerfilTab 
                user={user} 
                onLogout={signOut} 
                onEditProfile={() => {
                    const btn = document.getElementById('open-edit-profile');
                    // Trigger manual si el ID no funciona directamente en el botón
                    if (btn) btn.click();
                }} 
            />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnificadoDashboard;
