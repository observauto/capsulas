import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/context/GamificationContext';
import { useAuth } from '@/context/AuthContext';
// Usamos importación segura para los badges
import { AVAILABLE_BADGES } from '@/lib/gamification';
import { Trophy, Star, Target, Award, Clock, TrendingUp, Gift, CheckCircle2, X, Flame, LogIn, UserX, BookOpen, LayoutDashboard, ShieldCheck, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { readUserScopedJSON, writeUserScopedJSON } from '@/lib/user-storage';

// ========================================================================================
// 🛡️ FIX TÉCNICO DE IMPORTACIONES
// ========================================================================================
// Detecta automáticamente cómo importar los archivos para evitar errores de compilación.

// 1. Componentes UI
import * as EditProfileModalModule from './EditProfileModal';
import * as CapsuleCardModule from './CapsuleCard';
import * as GamificationStatusModule from './GamificationStatus';

const EditProfileModal = (EditProfileModalModule as any).EditProfileModal || (EditProfileModalModule as any).default;
const CapsuleCard = (CapsuleCardModule as any).CapsuleCard || (CapsuleCardModule as any).default;
const GamificationStatus = (GamificationStatusModule as any).GamificationStatus || (GamificationStatusModule as any).default;

// 2. Datos (fullCapsules)
import * as CapsulesModule from '@/data/fullCapsules';
const getSafeCapsules = () => {
  const mod = CapsulesModule as any;
  return mod.default || mod.capsules || mod.fullCapsules || Object.values(mod).find((v) => Array.isArray(v)) || [];
};
const fullCapsules = getSafeCapsules();
// ========================================================================================


// Datos base - Lógica original intacta
const BASE_USER_PROFILE = {
  id: '1',
  user_id: 'demo-user',
  email: 'usuario@demo.com',
  name: 'Usuario Demo',
  role: 'end_user',
  level: 1,
  created_at: '2024-01-15T10:00:00Z',
  phone: '',
  cedula: ''
};

// Catálogo original de premios (Restaurado)
const CATALOGO_PREMIOS = [
  { id: 1, name: "Kit de Limpieza BYD", description: "Mantén tu vehículo impecable con productos oficiales.", cost: 500, image: null },
  { id: 2, name: "Gorra Oficial Observauto", description: "Protégete del sol con estilo.", cost: 300, image: null },
  { id: 3, name: "Mantenimiento Preventivo 10%", description: "Descuento en tu próxima revisión.", cost: 800, image: null },
  { id: 4, name: "Termo Inteligente", description: "Mantiene la temperatura y muestra grados.", cost: 450, image: null },
];

const UnificadoDashboard = () => {
  // Hooks originales
  const { points, level, completedCapsules, earnedBadges, experience, claimPrize } = useGamification();
  const { user, signOut } = useAuth();
  
  // Estados originales
  const [userProfile, setUserProfile] = useState(BASE_USER_PROFILE);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<any>(null);
  const [validationCode, setValidationCode] = useState("");
  const [redeemedPrizes, setRedeemedPrizes] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("resumen");

  // Carga de perfil (Lógica original)
  useEffect(() => {
    if (user) {
      setUserProfile(prev => ({
        ...prev,
        email: user.email || prev.email,
        name: user.user_metadata?.full_name || prev.name,
        user_id: user.id
      }));
      
      // Cargar premios canjeados usando la lógica local original
      const savedPrizes = readUserScopedJSON('redeemed_prizes', user.id);
      if (savedPrizes) {
        setRedeemedPrizes(savedPrizes);
      }
    }
  }, [user]);

  const handleProfileUpdate = (updatedProfile: any) => {
    setUserProfile(updatedProfile);
    toast({
      title: "Perfil actualizado",
      description: "Tu información ha sido guardada correctamente.",
    });
  };

  const handleRedeemClick = (prize: any) => {
    if (points >= prize.cost) {
      setSelectedPrize(prize);
      // Generar código
      const code = `OBS-${Math.floor(Math.random() * 10000)}-${prize.id}`;
      setValidationCode(code);
      setShowRedeemModal(true);
    } else {
      toast({
        variant: "destructive",
        title: "Puntos insuficientes",
        description: `Necesitas ${prize.cost - points} puntos más para canjear este premio.`
      });
    }
  };

  const confirmRedeem = async () => {
    if (!selectedPrize) return;

    const success = await claimPrize(selectedPrize.id, selectedPrize.cost);
    
    if (success) {
      const newRedeemedPrize = {
        ...selectedPrize,
        redeemedAt: new Date().toISOString(),
        code: validationCode
      };

      const updatedPrizes = [...redeemedPrizes, newRedeemedPrize];
      setRedeemedPrizes(updatedPrizes);
      
      // Guardado local original
      if (user) {
        writeUserScopedJSON('redeemed_prizes', updatedPrizes, user.id);
      }

      toast({
        title: "¡Premio Canjeado!",
        description: "Guarda tu código para reclamarlo.",
      });
      setShowRedeemModal(false);
      setSelectedPrize(null);
      setActiveTab("reclamados");
    }
  };

  // CORRECCIÓN BLINDADA CONTRA PANTALLA BLANCA:
  // Agregamos `?` y `||` para que nunca falle si los datos son undefined
  const stats = {
    points: points || 0,
    level: level || 1,
    completedCapsules: completedCapsules?.length || 0, // <-- AQUÍ ESTABA EL ERROR
    totalCapsules: fullCapsules?.length || 0,          // <-- Y AQUÍ
    nextLevelProgress: Math.min(100, Math.floor(((experience || 0) % 1000) / 10)),
  };

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-5xl animate-in fade-in duration-500">
      
      {/* Header de Usuario */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hola, {userProfile.name.split(' ')[0]}</h1>
          <p className="text-slate-500 text-sm flex items-center gap-2">
            {user ? <span className="flex items-center text-green-600"><CheckCircle2 className="h-3 w-3 mr-1"/> Sesión Activa</span> : "Modo Invitado"}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
             <div className="text-right hidden md:block">
                <p className="text-xs font-semibold text-slate-400 uppercase">Nivel {stats.level}</p>
                <p className="text-sm font-bold text-observauto-dark">{stats.points} Puntos</p>
             </div>
             <div className="h-12 w-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                <Trophy className="h-6 w-6 text-amber-600" />
             </div>
        </div>
      </div>

      {/* Tabs de Navegación */}
      <Tabs defaultValue="resumen" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        
        {/* CORRECCIÓN UX SOLICITADA: Grid móvil 3x2 */}
        <div className="w-full overflow-visible">
            <TabsList className="w-full h-auto grid grid-cols-3 gap-1 p-1 bg-slate-100/80 md:inline-flex md:w-auto md:gap-1">
                <TabsTrigger value="resumen" className="flex gap-2 items-center justify-center text-xs md:text-sm py-2 md:px-4">
                    <LayoutDashboard className="h-4 w-4" /> <span className="hidden md:inline">Resumen</span><span className="md:hidden">Resumen</span>
                </TabsTrigger>
                <TabsTrigger value="capsulas" className="flex gap-2 items-center justify-center text-xs md:text-sm py-2 md:px-4">
                    <BookOpen className="h-4 w-4" /> <span className="hidden md:inline">Cápsulas</span><span className="md:hidden">Cápsulas</span>
                </TabsTrigger>
                <TabsTrigger value="insignias" className="flex gap-2 items-center justify-center text-xs md:text-sm py-2 md:px-4">
                    <Award className="h-4 w-4" /> <span className="hidden md:inline">Insignias</span><span className="md:hidden">Insignias</span>
                </TabsTrigger>
                <TabsTrigger value="premios" className="flex gap-2 items-center justify-center text-xs md:text-sm py-2 md:px-4">
                    <Gift className="h-4 w-4" /> <span className="hidden md:inline">Premios</span><span className="md:hidden">Premios</span>
                </TabsTrigger>
                <TabsTrigger value="reclamados" className="flex gap-2 items-center justify-center text-xs md:text-sm py-2 md:px-4">
                    <ShieldCheck className="h-4 w-4" /> <span className="hidden md:inline">Reclamados</span><span className="md:hidden">Canjes</span>
                </TabsTrigger>
                <TabsTrigger value="perfil" className="flex gap-2 items-center justify-center text-xs md:text-sm py-2 md:px-4">
                    <User className="h-4 w-4" /> <span className="hidden md:inline">Perfil</span><span className="md:hidden">Perfil</span>
                </TabsTrigger>
            </TabsList>
        </div>

        {/* Contenido: Resumen */}
        <TabsContent value="resumen" className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Puntos Disponibles</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-observauto-dark flex items-center gap-2">
                            {stats.points} <Star className="h-5 w-5 text-yellow-500 fill-yellow-500"/>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Cápsulas Completadas</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
                            {stats.completedCapsules} <span className="text-sm text-slate-400 font-normal">/ {stats.totalCapsules}</span>
                        </div>
                        <Progress value={(stats.completedCapsules / (stats.totalCapsules || 1)) * 100} className="h-2 mt-2" />
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-slate-500">Insignias Ganadas</CardTitle></CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                            {earnedBadges?.length || 0} <Award className="h-5 w-5 text-purple-500"/>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {stats.completedCapsules === 0 && (
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-100">
                    <CardContent className="flex flex-col items-center py-8 text-center">
                        <BookOpen className="h-12 w-12 text-blue-400 mb-4" />
                        <h3 className="text-lg font-semibold text-blue-900">¡Comienza tu aprendizaje!</h3>
                        <p className="text-blue-700 mb-4 max-w-md">Explora nuestras cápsulas interactivas y gana puntos por cada lección completada.</p>
                        <Button onClick={() => setActiveTab('capsulas')} className="bg-blue-600 hover:bg-blue-700">
                            Ver Cápsulas Disponibles
                        </Button>
                    </CardContent>
                </Card>
            )}
        </TabsContent>

        {/* Contenido: Cápsulas */}
        <TabsContent value="capsulas">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {fullCapsules.map((capsule: any) => (
                    <CapsuleCard 
                        key={capsule.id}
                        title={capsule.title}
                        description={capsule.summary}
                        icon={BookOpen}
                        isCompleted={completedCapsules?.includes(capsule.id)}
                        onClick={() => window.location.href = `/capsula/${capsule.id}`}
                    />
                ))}
            </div>
        </TabsContent>

        {/* Contenido: Insignias */}
        <TabsContent value="insignias">
            <GamificationStatus />
        </TabsContent>

        {/* Contenido: Premios */}
        <TabsContent value="premios">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {CATALOGO_PREMIOS.map((prize) => (
                    <Card key={prize.id} className={points >= prize.cost ? "border-green-200 bg-green-50/30" : "opacity-90"}>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-lg">{prize.name}</CardTitle>
                                    <CardDescription className="mt-1">{prize.description}</CardDescription>
                                </div>
                                <Badge variant={points >= prize.cost ? "default" : "secondary"} className="ml-2 shrink-0">
                                    {prize.cost} Pts
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="bg-slate-100 h-32 rounded-lg mb-4 flex items-center justify-center text-slate-400">
                                <Gift className="h-10 w-10" />
                            </div>
                            <Button 
                                className="w-full" 
                                onClick={() => handleRedeemClick(prize)}
                                disabled={points < prize.cost}
                                variant={points >= prize.cost ? "default" : "outline"}
                            >
                                {points >= prize.cost ? "Canjear Ahora" : `Faltan ${prize.cost - points} pts`}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </TabsContent>

        {/* Contenido: Reclamados */}
        <TabsContent value="reclamados">
            {redeemedPrizes.length === 0 ? (
                <Card className="text-center py-12 border-dashed">
                    <CardContent>
                        <Gift className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-900">No hay premios reclamados</h3>
                        <p className="text-slate-500 mt-1">Completa cápsulas para ganar puntos y canjear recompensas.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {redeemedPrizes.map((prize, i) => (
                        <Card key={i} className="border-l-4 border-l-green-500">
                            <CardContent className="flex justify-between items-center p-6">
                                <div>
                                    <h4 className="font-bold text-lg">{prize.name}</h4>
                                    <p className="text-sm text-slate-500">Canjeado el {new Date(prize.redeemedAt).toLocaleDateString()}</p>
                                    <div className="mt-2 flex items-center gap-2">
                                        <Badge variant="outline" className="font-mono bg-slate-50 text-slate-700 border-slate-300">
                                            {prize.code}
                                        </Badge>
                                        <span className="text-xs text-green-600 font-medium flex items-center">
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> Válido
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xl font-bold text-green-700">-{prize.cost}</span>
                                    <span className="text-xs block text-slate-400">Puntos</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </TabsContent>

        {/* Contenido: Perfil */}
        <TabsContent value="perfil">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">
                            {userProfile.name.charAt(0)}
                        </div>
                        <div>
                            <CardTitle>{userProfile.name}</CardTitle>
                            <CardDescription>{userProfile.email}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-500 uppercase">User ID</span>
                            <p className="font-mono text-sm text-slate-700">{userProfile.user_id}</p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                            <span className="text-xs text-slate-500 uppercase">Rol</span>
                            <p className="font-medium text-slate-700 capitalize">{userProfile.role.replace('_', ' ')}</p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 pt-4">
                        <Button variant="outline" onClick={() => setShowEditProfileModal(true)} className="w-full justify-start">
                            <User className="mr-2 h-4 w-4" /> Editar Información Personal
                        </Button>
                        <Button variant="destructive" onClick={signOut} className="w-full justify-start">
                            <LogOut className="mr-2 h-4 w-4" /> Cerrar Sesión
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </TabsContent>

      </Tabs>

      {/* Modal de Canje */}
      <Dialog open={showRedeemModal} onOpenChange={setShowRedeemModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Canje</DialogTitle>
            <DialogDescription>
              ¿Estás seguro que deseas canjear tus puntos por este premio?
            </DialogDescription>
          </DialogHeader>
          
          {selectedPrize && (
            <div className="py-4 space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg">
                <Gift className="h-8 w-8 text-blue-500" />
                <div>
                  <h4 className="font-bold">{selectedPrize.name}</h4>
                  <p className="text-sm text-slate-500">{selectedPrize.cost} Puntos</p>
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-100 text-center">
                <p className="text-sm text-green-800 font-medium mb-2">Código de Validación Generado:</p>
                <code className="text-xl font-mono font-bold text-green-700 tracking-wider bg-white px-4 py-2 rounded border border-green-200 block w-fit mx-auto">
                  {validationCode}
                </code>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Llama al <strong>01-800-OBSERVA</strong> con este código para reclamar tu premio
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-xs text-center">
                  Se descontarán <strong>{selectedPrize.points} puntos</strong> de tu saldo actual ({points} pts)
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRedeemModal(false);
                setSelectedPrize(null);
                setValidationCode("");
              }}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={confirmRedeem}
              className="flex-1 bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirmar Canje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edición de Perfil */}
      <EditProfileModal
        open={showEditProfileModal}
        onOpenChange={setShowEditProfileModal}
        profile={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
};

export default UnificadoDashboard;
