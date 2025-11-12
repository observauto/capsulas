import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Trophy, Star, Target, Award, Clock, TrendingUp, BarChart3, Activity } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Componentes adicionales para el journey completo
import UserTimeline from './UserTimeline';
import CompletedCapsules from './CompletedCapsules';
import RedeemedRewards from './RedeemedRewards';
import AdvancedStats from './AdvancedStats';
import RecentActivity from './RecentActivity';
import ExecutiveSummary from './ExecutiveSummary';
import EnhancedCapsules from './EnhancedCapsules';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  points: number;
  level: number;
  avatar_url?: string;
}

interface Achievement {
  id: string;
  achievement_code: string;
  title: string;
  description: string;
  badge_icon?: string;
  points_reward: number;
  category?: string;
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

interface CapsuleProgress {
  id: string;
  capsule_name: string;
  section_name: string;
  progress_percentage: number;
  completed_at?: string;
  last_accessed: string;
  time_spent_minutes: number;
}

export default function Panel1EndUserDashboard() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);
  const [capsuleProgress, setCapsuleProgress] = useState<CapsuleProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Cargar perfil de usuario
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (profile) {
        setUserProfile(profile);
      } else {
        // Crear perfil si no existe - CORREGIDO: incluir points y level
        const newProfile = {
          user_id: user?.id,
          email: user?.email,
          name: user?.user_metadata?.full_name || user?.email?.split('@')[0],
          role: 'end_user',
          points: 0,    // ✅ CORREGIDO: inicializar en 0
          level: 1      // ✅ CORREGIDO: inicializar en nivel 1
        };

        const { data: createdProfile } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createdProfile) {
          setUserProfile(createdProfile);
        }
      }

      // ✅ NUEVA FUNCIONALIDAD: Limpiar datos inconsistentes del usuario
      await cleanupUserData(user?.id);

      // Cargar logros del usuario
      const { data: achievements } = await supabase
        .from('user_achievements')
        .select(`
          *,
          achievement:achievements(
            id,
            achievement_code,
            title,
            description,
            badge_icon,
            points_reward,
            category
          )
        `)
        .eq('user_id', user?.id);

      if (achievements) {
        setUserAchievements(achievements);
      }

      // Cargar progreso de cápsulas
      const { data: capsules } = await supabase
        .from('capsule_progress')
        .select('*')
        .eq('user_id', user?.id)
        .order('last_accessed', { ascending: false });

      if (capsules) {
        setCapsuleProgress(capsules);
      }

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getNextLevelPoints = (currentLevel: number) => {
    // Fórmula para calcular puntos necesarios para el siguiente nivel
    return currentLevel * 100; // Ejemplo: nivel 1 = 100pts, nivel 2 = 200pts, etc.
  };

  // ✅ NUEVA FUNCIÓN: Limpiar datos inconsistentes del usuario
  const cleanupUserData = async (userId?: string) => {
    if (!userId || !userProfile) return;

    try {
      console.log('[DASHBOARD] Iniciando limpieza de datos inconsistentes...');
      
      let hasChanges = false;
      let cleanedPoints = userProfile.points;
      let cleanedLevel = userProfile.level;

      // Regla 1: Si tiene 0 puntos, debe estar en nivel 1
      if (cleanedPoints === 0 && cleanedLevel > 1) {
        console.log('[DASHBOARD] Corrigiendo nivel inconsistente:', cleanedLevel, '→ 1');
        cleanedLevel = 1;
        hasChanges = true;
      }

      // Regla 2: Calcular nivel correcto basado en puntos
      const correctLevel = Math.floor(cleanedPoints / 100) + 1;
      if (cleanedLevel !== correctLevel) {
        console.log('[DASHBOARD] Corrigiendo nivel por cálculo:', cleanedLevel, '→', correctLevel);
        cleanedLevel = correctLevel;
        hasChanges = true;
      }

      // Aplicar correcciones a la base de datos
      if (hasChanges) {
        const { error } = await supabase
          .from('user_profiles')
          .update({
            points: cleanedPoints,
            level: cleanedLevel,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', userId);

        if (!error) {
          console.log('[DASHBOARD] Perfil actualizado con datos corregidos');
          setUserProfile(prev => prev ? {
            ...prev,
            points: cleanedPoints,
            level: cleanedLevel
          } : null);
        } else {
          console.error('[DASHBOARD] Error actualizando perfil:', error);
        }
      }

      // Regla 3: Limpiar progreso falso de cápsulas de programación
      const fakeCapsuleNames = [
        'Introducción a React Hooks',
        'JavaScript Async/Await', 
        'CSS Flexbox Mastery',
        'TypeScript Fundamentals',
        'Vue.js Components',
        'Node.js Express',
        'Database Design',
        'API REST Design'
      ];

      const { error: deleteError } = await supabase
        .from('capsule_progress')
        .delete()
        .eq('user_id', userId)
        .in('capsule_name', fakeCapsuleNames);

      if (!deleteError) {
        console.log('[DASHBOARD] Progreso falso de cápsulas eliminado');
      }

      console.log('[DASHBOARD] Limpieza de datos completada');

    } catch (error) {
      console.error('[DASHBOARD] Error en limpieza de datos:', error);
    }
  };

  const getCurrentLevelProgress = () => {
    // Usar puntos del contexto de gamificación para cálculo más preciso
    const currentPoints = userProfile?.points || 0;
    const currentLevel = userProfile?.level || 1;
    const currentLevelPoints = (currentLevel - 1) * 100;
    const nextLevelPoints = currentLevel * 100;
    const progress = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  // Calcular nivel actual basado en puntos de gamificación
  const currentLevel = userProfile?.level || 1;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Personal</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, {userProfile?.name || user?.email}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            {userProfile?.role === 'end_user' ? 'Usuario' : userProfile?.role}
          </Badge>
        </div>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Puntos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userProfile?.points || 0}</div>
            <p className="text-xs opacity-75 mt-1">
              Nivel {userProfile?.level || 1}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Logros Obtenidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userAchievements.length}</div>
            <p className="text-xs opacity-75 mt-1">
              Badges conseguidos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Cápsulas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {capsuleProgress.filter(c => !c.completed_at).length}
            </div>
            <p className="text-xs opacity-75 mt-1">
              En progreso
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Tiempo Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(capsuleProgress.reduce((sum, c) => sum + c.time_spent_minutes, 0) / 60)}h
            </div>
            <p className="text-xs opacity-75 mt-1">
              Horas de estudio
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progreso del Nivel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progreso de Nivel
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">
                Nivel {userProfile?.level || 1} → {userProfile?.level ? userProfile.level + 1 : 2}
              </span>
              <span className="text-sm text-gray-600">
                {userProfile?.points || 0} / {getNextLevelPoints(userProfile?.level || 1)} puntos
              </span>
            </div>
            <Progress value={getCurrentLevelProgress()} className="h-2" />
            <p className="text-xs text-gray-600">
              {getNextLevelPoints(userProfile?.level || 1) - (userProfile?.points || 0)} puntos para el siguiente nivel
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Tabs de Contenido */}
      <Tabs defaultValue="summary" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="summary">Resumen</TabsTrigger>
          <TabsTrigger value="capsules">Cápsulas</TabsTrigger>
          <TabsTrigger value="completed">Completadas</TabsTrigger>
          <TabsTrigger value="rewards">Premios</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
        </TabsList>

        {/* Resumen Ejecutivo */}
        <TabsContent value="summary" className="space-y-4">
          <ExecutiveSummary />
        </TabsContent>

        {/* Cápsulas Mejoradas */}
        <TabsContent value="capsules" className="space-y-4">
          <EnhancedCapsules />
        </TabsContent>

        {/* Cápsulas Completadas */}
        <TabsContent value="completed" className="space-y-4">
          <CompletedCapsules limit={10} />
        </TabsContent>

        {/* Premios Reclamados */}
        <TabsContent value="rewards" className="space-y-4">
          <RedeemedRewards limit={10} />
        </TabsContent>

        {/* Timeline Completo */}
        <TabsContent value="timeline" className="space-y-4">
          <UserTimeline limit={20} />
        </TabsContent>

        {/* Actividad Reciente */}
        <TabsContent value="activity" className="space-y-4">
          <RecentActivity limit={15} />
        </TabsContent>

        {/* Estadísticas Avanzadas */}
        <TabsContent value="stats" className="space-y-4">
          <AdvancedStats />
        </TabsContent>

        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Mi Perfil
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre
                    </label>
                    <p className="text-gray-900">{userProfile?.name || 'No especificado'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{userProfile?.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <Badge variant="outline">
                      {userProfile?.role === 'end_user' ? 'Usuario Final' : userProfile?.role}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel Actual
                    </label>
                    <p className="text-2xl font-bold text-blue-600">{userProfile?.level || 1}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Puntos Totales
                    </label>
                    <p className="text-2xl font-bold text-green-600">{userProfile?.points || 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Miembro desde
                    </label>
                    <p className="text-gray-900">
                      {userProfile?.created_at ? new Date(userProfile.created_at).toLocaleDateString('es-ES') : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="pt-4 border-t">
                <Button variant="outline" className="w-full">
                  Editar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}