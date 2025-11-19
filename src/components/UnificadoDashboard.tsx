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
// 🛡️ ESTRATEGIA DE IMPORTACIÓN BLINDADA (BULLETPROOF IMPORTS)
// Importamos todo el módulo para detectar dinámicamente la exportación correcta
// y evitar errores de compilación o runtime "undefined".
// =============================================================================

// 1. Data: Detecta si es export default, capsules, fullCapsules, etc.
import * as CapsulesModule from '@/data/fullCapsules';
const getCapsulesData = (): Capsule[] => {
  const module = CapsulesModule as any;
  const data = module.default || module.capsules || module.fullCapsules || module.FULL_CAPSULES || module.data || Object.values(module).find(val => Array.isArray(val));
  return Array.isArray(data) ? data : [];
};
const safeFullCapsules = getCapsulesData();

// 2. Componentes: Detecta si es export default o export const
import * as CapsuleCardModule from '@/components/CapsuleCard';
import * as GamificationStatusModule from '@/components/GamificationStatus';

const CapsuleCard = (CapsuleCardModule as any).CapsuleCard || (CapsuleCardModule as any).default;
const GamificationStatus = (GamificationStatusModule as any).GamificationStatus || (GamificationStatusModule as any).default;

// =============================================================================

// Sub-componentes internos (Optimizados para seguridad de renderizado)
const ResumenTab = ({ stats, recentActivity }: { stats: any, recentActivity: any[] }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    {/* Stats Grid */}
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

    {/* Recent Activity */}
    <Card className="shadow-sm border-slate-200">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
            <History className="h-5 w-5 text-slate-500" />
            Actividad Reciente
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
                     activity.type === 'quiz' ? <Star className="h-4 w-4 text-amber-600" /> :
                     <Trophy className="h-4 w-4 text-blue-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                    <p className="text-xs text-slate-500">{activity.date}</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-green-600">+{activity.points} pts</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <p>Aún no tienes actividad registrada.</p>
            <Button variant="link" className="mt-2 text-blue-600">Comenzar una cápsula</Button>
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
          // Protección: Si el componente no cargó, no renderizamos para evitar crash
          if (!CapsuleCard) return null; 
          return (
            <CapsuleCard 
              key={capsule.id} 
              title={capsule.title} // Asumiendo props de la versión vieja/nueva compatibles
              description={capsule.summary || capsule.description} // Compatibilidad de props
              icon={BookOpen}
              capsule={capsule} // Pasamos el objeto completo por si acaso
              isFavorite={false} 
              onToggleFavorite={() => {}}
              onExplore={() => window.location.href = `/capsulas/${capsule.slug || capsule.id}`}
              onClick={() => window.location.href = `/capsula/${capsule.id}`} // Compatibilidad
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
       {GamificationStatus ? <GamificationStatus /> : <p className="text-center text-slate-400">Componente de insignias cargando...</p>}
   </div>
);

const PremiosTab = ({ availablePrizes, onRedeem }: { availablePrizes: any[], onRedeem: (prize: any) => void }) => (
  <div className="space-y-6 animate-in fade-in duration-500">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {availablePrizes.map((prize) => (
        <Card key={prize.id} className="overflow-hidden hover:shadow-md transition-shadow border-slate-200">
          <div className="h-48 bg-slate-100 relative">
             <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                <Gift className="h-12 w-12" />
             </div>
             {prize.image && <img src={prize.image} alt={prize.name} className="w-full h-full object-cover" />}
             <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">
                {prize.cost} Pts
             </div>
          </div>
          <CardHeader>
            <CardTitle className="text-lg">{prize.name}</CardTitle>
            <CardDescription>{prize.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
                className="w-full bg-observauto-dark hover:bg-observauto-dark/90"
                onClick={() => onRedeem(prize)}
            >
                Canjear Recompensa
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
    {(!availablePrizes || availablePrizes.length === 0) && (
        <div className="text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-200">
            <Gift className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No hay premios disponibles en este momento.</p>
        </div>
    )}
  </div>
);

const ReclamadosTab = ({ redeemedPrizes }: { redeemedPrizes: any[] }) => (
    <div className="space-y-6 animate-in fade-in duration-500">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Mis Premios Canjeados</h3>
      <div className="grid grid-cols-1 gap-4">
        {redeemedPrizes && redeemedPrizes.length > 0 ? (
          redeemedPrizes.map((item, index) => (
            <Card key={index} className="border-l-4 border-l-green-500 shadow-sm">
              <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                 <div>
                    <h4 className="font-bold text-lg text-slate-900">{item.prizeName}</h4>
                    <p className="text-sm text-slate-500">Canjeado el: {new Date(item.date).toLocaleDateString()}</p>
                    <div className="mt-2 bg-slate-100 px-3 py-1 rounded text-xs font-mono text-slate-600 inline-block">
                        CÓDIGO: {item.code || 'PENDIENTE'}
                    </div>
                 </div>
                 <Button variant="outline" size="sm" className="text-green-600 border-green-200 hover:bg-green-50">
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Ver Instrucciones
                 </Button>
              </CardContent>
            </Card>
          ))
        ) : (
           <div className="text-center py-12">
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
                    <p className="font-medium text-slate-900">Noviembre 2025</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Estado</p>
                    <p className="font-medium text-green-600 flex items-center justify-center gap-1">
                        <ShieldCheck className="h-3 w-3" /> Activo
                    </p>
                </div>
            </div>

            <div className="space-y-3 pt-4">
                <Button variant="outline" className="w-full" onClick={onEditProfile}>
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

export const UnificadoDashboard = () => {
  const { points, level, completedCapsules: completedIds, experience, claimPrize } = useGamification();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState("resumen");
  const [redeemedPrizes, setRedeemedPrizes] = useState<any[]>([]);

  // Safe stats calculation
  const stats = {
    points: points || 0,
    level: level || 1,
    completedCapsules: completedIds?.length || 0,
    totalCapsules: (safeFullCapsules || []).length,
    nextLevelProgress: Math.min(100, Math.floor(((experience || 0) % 1000) / 10)),
  };

  const recentActivity = [
    { type: 'capsule', title: 'Historia de los EVs', date: 'Hace 2 horas', points: 50 },
    { type: 'quiz', title: 'Quiz: Motores Eléctricos', date: 'Hace 1 día', points: 100 },
  ];

  const availablePrizes = [
    { id: 1, name: "Kit de Limpieza BYD", description: "Mantén tu vehículo impecable", cost: 500, image: null },
    { id: 2, name: "Gorra Oficial Observauto", description: "Estilo y protección solar", cost: 300, image: null },
  ];

  useEffect(() => {
    const fetchRedeemed = async () => {
        if (!user) return;
        
        try {
            const { data, error } = await supabase
                .from('user_redeemed_prizes')
                .select('*')
                .eq('user_id', user.id)
                .order('redeemed_at', { ascending: false });

            if (error) throw error;
            
            if (data) {
                setRedeemedPrizes(data.map(d => ({
                    prizeName: d.prize_id, 
                    date: d.redeemed_at,
                    code: d.redemption_code
                })));
            }
        } catch (e) {
            console.error("Error fetching prizes:", e);
        }
    };

    fetchRedeemed();
  }, [user, activeTab]);

  const handleRedeem = async (prize: any) => {
      const success = await claimPrize(prize.id, prize.cost);
      if (success) {
          toast.success(`¡Has canjeado: ${prize.name}!`, {
              description: "Revisa la pestaña 'Reclamados' para ver tu código.",
          });
          setActiveTab("reclamados"); 
      } else {
          toast.error("No tienes suficientes puntos para este premio.");
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
            UX FIX: NAVEGACIÓN RESPONSIVA (Móvil: 2 filas de 3, Escritorio: Flex)
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
                    key={tab.id} 
                    value={tab.id}
                    className="flex flex-col items-center gap-1 px-1 py-2 text-xs md:flex-row md:gap-2 md:px-4 md:py-2.5 md:text-sm whitespace-nowrap data-[state=active]:bg-white data-[state=active]:text-observauto-dark data-[state=active]:shadow-sm transition-all duration-200"
                >
                    <tab.icon className="h-4 w-4 md:h-4 md:w-4" />
                    <span>{tab.label}</span>
                </TabsTrigger>
            ))}
            </TabsList>
        </div>

        <TabsContent value="resumen" className="focus-visible:outline-none">
            <ResumenTab stats={stats} recentActivity={recentActivity} />
        </TabsContent>

        <TabsContent value="capsulas" className="focus-visible:outline-none">
            <CapsulasTab completedCapsules={completedIds} />
        </TabsContent>

        <TabsContent value="insignias" className="focus-visible:outline-none">
            <InsigniasTab />
        </TabsContent>

        <TabsContent value="premios" className="focus-visible:outline-none">
            <PremiosTab availablePrizes={availablePrizes} onRedeem={handleRedeem} />
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
                    if (btn) btn.click();
                    else console.log("Modal trigger not found (Edit Profile)");
                }} 
            />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UnificadoDashboard;
