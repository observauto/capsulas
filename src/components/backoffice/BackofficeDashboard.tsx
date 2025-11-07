import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/context/AuthContext';
import { useGamification } from '@/context/GamificationContext';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import Panel1EndUserDashboard from './Panel1EndUserDashboard';
import Panel2SuperAdminPanel from './Panel2SuperAdminPanel';
import Panel3SponsorDashboard from './Panel3SponsorDashboard';
import { 
  User, 
  Crown, 
  Star, 
  Shield,
  BarChart3,
  Users,
  Award,
  Target,
  Settings,
  ArrowLeft,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  points: number;
  level: number;
}

interface BackofficeDashboardProps {
  onBack?: () => void;
}

export default function BackofficeDashboard({ onBack }: BackofficeDashboardProps) {
  const { user } = useAuth();
  const { points: gamificationPoints } = useGamification();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setProfileError(null);
      
      console.log('[DASHBOARD] Cargando perfil para:', user.id, user.email);

      // Esperar un momento para que la sincronización termine
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Intentar cargar perfil existente por user_id
      let { data: profile, error: fetchError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      console.log('[DASHBOARD] Resultado de búsqueda:', { profile, fetchError });

      if (fetchError && fetchError.code !== 'PGRST116') {
        // Error diferente a "no encontrado"
        console.error('[DASHBOARD] Error al cargar perfil:', fetchError);
        setProfileError(`Error de base de datos: ${fetchError.message}`);
        return;
      }

      if (profile) {
        console.log('[DASHBOARD] Perfil cargado exitosamente:', profile);
        setUserProfile(profile);
        setProfileError(null);
        return;
      }

      // Si no existe perfil, mostrar error
      console.error('[DASHBOARD] No se encontró perfil para el usuario');
      setProfileError('No se encontró tu perfil. La sincronización podría estar en proceso.');
      
    } catch (error: any) {
      console.error('[DASHBOARD] Error inesperado al cargar perfil:', error);
      setProfileError(`Error inesperado: ${error?.message || 'Desconocido'}`);
    } finally {
      setLoading(false);
      setIsRetrying(false);
    }
  };

  const handleRetryProfile = async () => {
    setIsRetrying(true);
    await loadUserProfile();
  };

  // Verificar si el usuario está autenticado
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }

  // Si no hay usuario autenticado, mostrar mensaje de error y botón para ir al home
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Acceso Restringido
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                Debes iniciar sesión para acceder a tu panel
              </AlertDescription>
            </Alert>
            <p className="text-sm text-gray-600">
              Esta sección es solo para usuarios registrados. Por favor, inicia sesión con tu cuenta para acceder al panel de control.
            </p>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Ir al Inicio
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si no hay perfil después de cargar, mostrar error
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center p-8">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Error al cargar perfil
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>
                {profileError || 'No se pudo cargar tu perfil. La sincronización podría estar en proceso.'}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={handleRetryProfile} 
              disabled={isRetrying}
              className="w-full"
            >
              {isRetrying ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Reintentando...
                </>
              ) : (
                <>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reintentar
                </>
              )}
            </Button>
            <p className="text-sm text-gray-500 mt-4">
              Si el problema persiste, intenta cerrar sesión y volver a iniciar sesión.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Usar datos del perfil cargado
  const currentPoints = userProfile.points;
  const currentLevel = userProfile.level;

  const getRoleConfig = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          title: 'Panel de Administración',
          icon: Crown,
          color: 'bg-red-500',
          description: 'Gestión completa de la plataforma',
          tabs: [
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'admin', label: 'Administración', icon: Settings }
          ]
        };
      case 'sponsor':
        return {
          title: 'Dashboard de Sponsor',
          icon: Star,
          color: 'bg-purple-500',
          description: 'Estadísticas de tus cápsulas',
          tabs: [
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'sponsor', label: 'Sponsor Panel', icon: Target }
          ]
        };
      default:
        return {
          title: 'Mi Dashboard',
          icon: User,
          color: 'bg-blue-500',
          description: 'Tu progreso personal',
          tabs: [
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'dashboard', label: 'Mi Panel', icon: User }
          ]
        };
    }
  };

  const roleConfig = getRoleConfig(userProfile.role);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Alerta de error de perfil */}
      {profileError && (
        <div className="bg-yellow-50 border-b border-yellow-200">
          <div className="container mx-auto px-6 py-3">
            <Alert className="border-yellow-300 bg-yellow-50">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="flex items-center justify-between">
                <span className="text-yellow-800">
                  {profileError}. Usando perfil temporal - algunos datos pueden no guardarse permanentemente.
                </span>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleRetryProfile}
                  disabled={isRetrying}
                  className="ml-4"
                >
                  {isRetrying ? (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                      Reintentando...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Reintentar
                    </>
                  )}
                </Button>
              </AlertDescription>
            </Alert>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onBack && (
                <Button variant="ghost" size="sm" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Volver
                </Button>
              )}
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 ${roleConfig.color} rounded-lg flex items-center justify-center text-white`}>
                  <roleConfig.icon className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">{roleConfig.title}</h1>
                  <p className="text-sm text-gray-600">{roleConfig.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                <p className="text-xs text-gray-600">{userProfile.email}</p>
              </div>
              <Badge 
                variant="outline" 
                className={`${roleConfig.color.replace('bg-', 'bg-').replace('500', '50')} text-gray-700 border-gray-200`}
              >
                {userProfile.role === 'admin' ? 'Administrador' : 
                 userProfile.role === 'sponsor' ? 'Sponsor' : 'Usuario'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-fit">
            {roleConfig.tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Welcome Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Bienvenido a tu Panel de Control
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">
                    {userProfile.role === 'admin' 
                      ? 'Como administrador, puedes gestionar usuarios, recompensas, logros y configurar la plataforma completa.'
                      : userProfile.role === 'sponsor'
                      ? 'Como sponsor, puedes ver estadísticas detalladas de tus cápsulas y el progreso de los usuarios.'
                      : 'Aquí puedes ver tu progreso personal, logros obtenidos y el avance en tus cápsulas.'
                    }
                  </p>
                  
                  {userProfile.role !== 'admin' && userProfile.role !== 'sponsor' && (
                    <div className="grid grid-cols-2 gap-4 pt-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{currentPoints}</div>
                        <div className="text-sm text-gray-600">Puntos Totales</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{currentLevel}</div>
                        <div className="text-sm text-gray-600">Nivel Actual</div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2 pt-4">
                    {userProfile.role === 'admin' && (
                      <Button 
                        onClick={() => setActiveTab('admin')}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Ir a Panel Admin
                      </Button>
                    )}
                    {userProfile.role === 'sponsor' && (
                      <Button 
                        onClick={() => setActiveTab('sponsor')}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Star className="h-4 w-4 mr-2" />
                        Ir a Panel Sponsor
                      </Button>
                    )}
                    {userProfile.role === 'end_user' && (
                      <Button 
                        onClick={() => setActiveTab('dashboard')}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Ver Mi Dashboard
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Role-specific Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información de tu Rol</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {userProfile.role === 'admin' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Gestión de usuarios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Recompensas y logros</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Configuración de cápsulas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Analíticas globales</span>
                      </div>
                    </div>
                  )}

                  {userProfile.role === 'sponsor' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Estadísticas de cápsulas</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Progreso de usuarios</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Engagement metrics</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-sm">Tasa de completación</span>
                      </div>
                    </div>
                  )}

                  {userProfile.role === 'end_user' && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Mi progreso personal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Logros obtenidos</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Cápsulas en progreso</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm">Estadísticas de aprendizaje</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="dashboard">
            <Panel1EndUserDashboard />
          </TabsContent>

          <TabsContent value="admin">
            <Panel2SuperAdminPanel />
          </TabsContent>

          <TabsContent value="sponsor">
            <Panel3SponsorDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}