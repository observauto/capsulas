import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Panel1EndUserDashboard } from "@/components/backoffice/Panel1EndUserDashboard";
import { RedeemedRewards } from "@/components/backoffice/RedeemedRewards";
import { CompletedCapsules } from "@/components/backoffice/CompletedCapsules";
import { EditProfileModal } from "@/components/EditProfileModal";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, History, LayoutDashboard, User, GraduationCap } from "lucide-react";

export const UnificadoDashboard = () => {
  const { user, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  // Títulos dinámicos para el header según la pestaña activa
  const getTabTitle = () => {
    switch (activeTab) {
      case "overview": return "Resumen General";
      case "rewards": return "Catálogo de Premios";
      case "badges": return "Mis Insignias";
      case "redeemed": return "Historial de Canjes";
      case "capsules": return "Progreso de Cápsulas";
      case "profile": return "Mi Perfil";
      default: return "Mi Panel";
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-6xl space-y-6 animate-fade-in">
      {/* Header del Panel */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{getTabTitle()}</h1>
          <p className="text-muted-foreground mt-1">
            Bienvenido de nuevo, <span className="font-semibold text-observauto-blue">{userProfile?.display_name || user?.email?.split('@')[0] || 'Usuario'}</span>
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-1 text-sm font-medium bg-observauto-blue/10 text-observauto-blue border-observauto-blue/20">
          {userProfile?.role === 'admin' || userProfile?.role === 'superadmin' ? 'Administrador' : 'Usuario Registrado'}
        </Badge>
      </div>

      <Tabs defaultValue="overview" className="w-full space-y-6" onValueChange={setActiveTab}>
        
        {/* BARRA DE NAVEGACIÓN "ARMÓNICA" (MÓVIL: GRID 2 LÍNEAS / DESKTOP: LINEAL) */}
        <TabsList className="grid w-full grid-cols-3 gap-2 h-auto p-2 bg-muted/50 rounded-xl md:flex md:w-auto md:bg-muted md:gap-1">
          
          <TabsTrigger 
            value="overview" 
            className="flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-observauto-blue data-[state=active]:shadow-sm transition-all"
          >
            <LayoutDashboard className="w-4 h-4 md:mr-1" />
            <span className="truncate">Resumen</span>
          </TabsTrigger>

          <TabsTrigger 
            value="rewards" 
            className="flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-observauto-blue data-[state=active]:shadow-sm transition-all"
          >
            <Trophy className="w-4 h-4 md:mr-1" />
            <span className="truncate">Premios</span>
          </TabsTrigger>

          <TabsTrigger 
            value="badges" 
            className="flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-observauto-blue data-[state=active]:shadow-sm transition-all"
          >
            <Medal className="w-4 h-4 md:mr-1" />
            <span className="truncate">Insignias</span>
          </TabsTrigger>

          <TabsTrigger 
            value="redeemed" 
            className="flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-observauto-blue data-[state=active]:shadow-sm transition-all"
          >
            <History className="w-4 h-4 md:mr-1" />
            <span className="truncate">Reclamados</span>
          </TabsTrigger>

          <TabsTrigger 
            value="capsules" 
            className="flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-observauto-blue data-[state=active]:shadow-sm transition-all"
          >
            <GraduationCap className="w-4 h-4 md:mr-1" />
            <span className="truncate">Cápsulas</span>
          </TabsTrigger>

          <TabsTrigger 
            value="profile" 
            className="flex items-center justify-center gap-2 py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-observauto-blue data-[state=active]:shadow-sm transition-all"
          >
            <User className="w-4 h-4 md:mr-1" />
            <span className="truncate">Perfil</span>
          </TabsTrigger>

        </TabsList>

        {/* Contenido de las Pestañas */}
        
        <TabsContent value="overview" className="space-y-4 animate-fade-in">
          <Panel1EndUserDashboard />
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4 animate-fade-in">
           <Card>
            <CardHeader>
              <CardTitle>Catálogo de Premios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Aquí aparecerán los premios disponibles para canjear.</p>
            </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="badges" className="space-y-4 animate-fade-in">
          <Card>
            <CardHeader>
              <CardTitle>Mis Insignias</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Colección de insignias desbloqueadas.</p>
            </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="redeemed" className="space-y-4 animate-fade-in">
          <RedeemedRewards />
        </TabsContent>

        <TabsContent value="capsules" className="space-y-4 animate-fade-in">
          <CompletedCapsules />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4 animate-fade-in">
          <div className="max-w-2xl mx-auto">
             <EditProfileModal />
          </div>
        </TabsContent>

      </Tabs>
    </div>
  );
};