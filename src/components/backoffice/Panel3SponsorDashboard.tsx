import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  BarChart3, 
  Users, 
  Clock, 
  TrendingUp, 
  Target, 
  Award,
  Eye,
  Calendar,
  Activity,
  CheckCircle,
  AlertCircle,
  Star,
  Activity as ActivityIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Componentes adicionales para sponsor
import UserTimeline from './UserTimeline';
import AdvancedStats from './AdvancedStats';
import RecentActivity from './RecentActivity';
import ExecutiveSummary from './ExecutiveSummary';

interface SponsorProfile {
  id: string;
  user_id: string;
  name: string;
  email: string;
  role: string;
}

interface CapsuleStats {
  capsule_name: string;
  section_name: string;
  total_users: number;
  active_users: number;
  completed_users: number;
  average_progress: number;
  average_time_minutes: number;
  completion_rate: number;
  engagement_score: number;
  last_activity: string;
}

interface UserProgress {
  user_id: string;
  user_name: string;
  user_email: string;
  capsule_name: string;
  section_name: string;
  progress_percentage: number;
  time_spent_minutes: number;
  completed_at?: string;
  last_accessed: string;
  engagement_level: 'high' | 'medium' | 'low';
}

export default function Panel3SponsorDashboard() {
  const { user } = useAuth();
  const [sponsorProfile, setSponsorProfile] = useState<SponsorProfile | null>(null);
  const [capsuleStats, setCapsuleStats] = useState<CapsuleStats[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [overallStats, setOverallStats] = useState({
    totalUsers: 0,
    totalCapsules: 0,
    averageEngagement: 0,
    completionRate: 0,
    averageSessionTime: 0
  });

  useEffect(() => {
    if (user) {
      loadSponsorData();
    }
  }, [user]);

  const loadSponsorData = async () => {
    try {
      setLoading(true);

      // Verificar permisos de sponsor
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (!profile || profile.role !== 'sponsor') {
        toast({
          title: "Acceso Denegado",
          description: "Solo los sponsors pueden acceder a este panel",
          variant: "destructive"
        });
        return;
      }

      setSponsorProfile(profile);

      // Cargar estadísticas de cápsulas
      await loadCapsuleStatistics();
      await loadUserProgress();
      await loadOverallStats();

    } catch (error) {
      console.error('Error loading sponsor data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos del dashboard",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCapsuleStatistics = async () => {
    try {
      // Obtener todos los progresos de cápsulas del sponsor
      const { data: progressData } = await supabase
        .from('capsule_progress')
        .select(`
          *,
          user_profile:user_profiles!capsule_progress_user_id_fkey(name, email)
        `)
        .eq('sponsor_id', user?.id);

      if (progressData) {
        // Agrupar estadísticas por cápsula y sección
        const statsMap = new Map<string, CapsuleStats>();

        progressData.forEach((progress) => {
          const key = `${progress.capsule_name}-${progress.section_name}`;
          
          if (!statsMap.has(key)) {
            statsMap.set(key, {
              capsule_name: progress.capsule_name,
              section_name: progress.section_name,
              total_users: 0,
              active_users: 0,
              completed_users: 0,
              average_progress: 0,
              average_time_minutes: 0,
              completion_rate: 0,
              engagement_score: 0,
              last_activity: progress.last_accessed
            });
          }

          const stat = statsMap.get(key)!;
          stat.total_users += 1;
          
          if (!progress.completed_at) {
            stat.active_users += 1;
          } else {
            stat.completed_users += 1;
          }
          
          stat.average_progress += progress.progress_percentage;
          stat.average_time_minutes += progress.time_spent_minutes;
          
          // Actualizar última actividad
          if (new Date(progress.last_accessed) > new Date(stat.last_activity)) {
            stat.last_activity = progress.last_accessed;
          }
        });

        // Calcular promedios y métricas
        const stats = Array.from(statsMap.values()).map(stat => {
          const validUsers = stat.total_users;
          stat.average_progress = validUsers > 0 ? Math.round(stat.average_progress / validUsers) : 0;
          stat.average_time_minutes = validUsers > 0 ? Math.round(stat.average_time_minutes / validUsers) : 0;
          stat.completion_rate = validUsers > 0 ? (stat.completed_users / validUsers) * 100 : 0;
          
          // Calcular engagement score (0-100)
          stat.engagement_score = Math.min(100, 
            (stat.average_progress * 0.4) + 
            (stat.completion_rate * 0.3) + 
            ((stat.average_time_minutes / 60) * 10) // Normalizar tiempo
          );

          return stat;
        });

        setCapsuleStats(stats);
      }
    } catch (error) {
      console.error('Error loading capsule statistics:', error);
    }
  };

  const loadUserProgress = async () => {
    try {
      const { data: progressData } = await supabase
        .from('capsule_progress')
        .select(`
          *,
          user_profile:user_profiles!capsule_progress_user_id_fkey(name, email)
        `)
        .eq('sponsor_id', user?.id)
        .order('last_accessed', { ascending: false })
        .limit(50);

      if (progressData) {
        const progressList: UserProgress[] = progressData.map(progress => ({
          user_id: progress.user_id,
          user_name: progress.user_profile?.name || 'Usuario',
          user_email: progress.user_profile?.email || '',
          capsule_name: progress.capsule_name,
          section_name: progress.section_name,
          progress_percentage: progress.progress_percentage,
          time_spent_minutes: progress.time_spent_minutes,
          completed_at: progress.completed_at,
          last_accessed: progress.last_accessed,
          engagement_level: getEngagementLevel(progress.progress_percentage, progress.time_spent_minutes)
        }));

        setUserProgress(progressList);
      }
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const loadOverallStats = async () => {
    try {
      const { data } = await supabase
        .from('capsule_progress')
        .select('*')
        .eq('sponsor_id', user?.id);

      if (data) {
        const totalUsers = new Set(data.map(p => p.user_id)).size;
        const totalCapsules = new Set(data.map(p => p.capsule_name)).size;
        const completed = data.filter(p => p.completed_at).length;
        const totalTime = data.reduce((sum, p) => sum + p.time_spent_minutes, 0);
        const averageProgress = data.length > 0 ? data.reduce((sum, p) => sum + p.progress_percentage, 0) / data.length : 0;

        setOverallStats({
          totalUsers,
          totalCapsules,
          averageEngagement: Math.round(averageProgress),
          completionRate: data.length > 0 ? (completed / data.length) * 100 : 0,
          averageSessionTime: data.length > 0 ? Math.round(totalTime / data.length) : 0
        });
      }
    } catch (error) {
      console.error('Error loading overall stats:', error);
    }
  };

  const getEngagementLevel = (progress: number, time: number): 'high' | 'medium' | 'low' => {
    const score = (progress * 0.6) + (time / 10);
    if (score >= 70) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
  };

  const getEngagementColor = (level: 'high' | 'medium' | 'low') => {
    switch (level) {
      case 'high': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando dashboard de sponsor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Sponsor</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, {sponsorProfile?.name || sponsorProfile?.email}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-purple-100 text-purple-700 border-purple-200">
            <Star className="h-3 w-3 mr-1" />
            Sponsor
          </Badge>
        </div>
      </div>

      {/* Estadísticas Generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalUsers}</div>
            <p className="text-xs opacity-75 mt-1">
              Usuarios activos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Cápsulas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.totalCapsules}</div>
            <p className="text-xs opacity-75 mt-1">
              Contenido creado
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageEngagement}%</div>
            <p className="text-xs opacity-75 mt-1">
              Promedio general
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Completación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(overallStats.completionRate)}%</div>
            <p className="text-xs opacity-75 mt-1">
              Tasa de éxito
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Tiempo Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallStats.averageSessionTime}m</div>
            <p className="text-xs opacity-75 mt-1">
              Por sesión
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Contenido */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="executive">Ejecutivo</TabsTrigger>
          <TabsTrigger value="capsules">Cápsulas</TabsTrigger>
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Rendimiento General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement Score</span>
                    <span className="font-semibold">{overallStats.averageEngagement}%</span>
                  </div>
                  <Progress value={overallStats.averageEngagement} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Tasa de Completación</span>
                    <span className="font-semibold">{Math.round(overallStats.completionRate)}%</span>
                  </div>
                  <Progress value={overallStats.completionRate} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Retención de Usuarios</span>
                    <span className="font-semibold">
                      {overallStats.totalUsers > 0 ? Math.round((overallStats.totalUsers / overallStats.totalCapsules) * 100) : 0}%
                    </span>
                  </div>
                  <Progress 
                    value={overallStats.totalUsers > 0 ? (overallStats.totalUsers / overallStats.totalCapsules) * 100 : 0} 
                    className="h-2" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {capsuleStats.slice(0, 5).map((stat, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{stat.capsule_name}</p>
                        <p className="text-xs text-gray-600">{stat.section_name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold">{stat.active_users} activos</p>
                        <p className="text-xs text-gray-600">
                          {Math.round(stat.engagement_score)}% engagement
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="capsules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Rendimiento por Cápsula
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {capsuleStats.map((stat, index) => (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{stat.capsule_name}</CardTitle>
                      <p className="text-sm text-gray-600">{stat.section_name}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Usuarios</p>
                          <p className="font-semibold">{stat.total_users}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Activos</p>
                          <p className="font-semibold text-blue-600">{stat.active_users}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Completaron</p>
                          <p className="font-semibold text-green-600">{stat.completed_users}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Tiempo Prom.</p>
                          <p className="font-semibold">{stat.average_time_minutes}m</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progreso Promedio</span>
                          <span>{stat.average_progress}%</span>
                        </div>
                        <Progress value={stat.average_progress} className="h-2" />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Badge 
                          variant="outline"
                          className={stat.engagement_score >= 70 ? 'bg-green-50 text-green-700' : 
                                    stat.engagement_score >= 40 ? 'bg-yellow-50 text-yellow-700' : 
                                    'bg-red-50 text-red-700'}
                        >
                          {Math.round(stat.engagement_score)}% Engagement
                        </Badge>
                        <Badge variant="outline">
                          {Math.round(stat.completion_rate)}% Completado
                        </Badge>
                      </div>
                      
                      <div className="text-xs text-gray-500 pt-2 border-t">
                        Última actividad: {new Date(stat.last_activity).toLocaleDateString('es-ES')}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Progreso de Usuarios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userProgress.slice(0, 20).map((progress, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{progress.user_name}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getEngagementColor(progress.engagement_level)}>
                            {progress.engagement_level === 'high' ? 'Alto' : 
                             progress.engagement_level === 'medium' ? 'Medio' : 'Bajo'}
                          </Badge>
                          {progress.completed_at && (
                            <Badge variant="outline" className="bg-green-50 text-green-700">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Completado
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {progress.capsule_name} - {progress.section_name}
                      </p>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span>Progreso: {progress.progress_percentage}%</span>
                          <span>Tiempo: {progress.time_spent_minutes} min</span>
                        </div>
                        <Progress value={progress.progress_percentage} className="h-1" />
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-xs text-gray-500">
                        {new Date(progress.last_accessed).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Distribución de Engagement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['high', 'medium', 'low'].map((level) => {
                    const count = userProgress.filter(p => p.engagement_level === level).length;
                    const percentage = userProgress.length > 0 ? (count / userProgress.length) * 100 : 0;
                    const colors = {
                      high: 'bg-green-500',
                      medium: 'bg-yellow-500', 
                      low: 'bg-red-500'
                    };
                    return (
                      <div key={level} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">
                            {level === 'high' ? 'Alto Engagement' : 
                             level === 'medium' ? 'Medio Engagement' : 'Bajo Engagement'}
                          </span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`${colors[level as keyof typeof colors]} h-2 rounded-full`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Actividad Temporal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Usuarios activos hoy:</span>
                    <span className="font-semibold">
                      {userProgress.filter(p => 
                        new Date(p.last_accessed).toDateString() === new Date().toDateString()
                      ).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Esta semana:</span>
                    <span className="font-semibold">
                      {userProgress.filter(p => {
                        const weekAgo = new Date();
                        weekAgo.setDate(weekAgo.getDate() - 7);
                        return new Date(p.last_accessed) >= weekAgo;
                      }).length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tiempo promedio por sesión:</span>
                    <span className="font-semibold">
                      {Math.round(userProgress.reduce((sum, p) => sum + p.time_spent_minutes, 0) / userProgress.length || 0)} min
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Tasa de retención:</span>
                    <span className="font-semibold">
                      {userProgress.length > 0 ? 
                        Math.round((userProgress.filter(p => p.time_spent_minutes > 30).length / userProgress.length) * 100) 
                        : 0}%
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Resumen Ejecutivo */}
        <TabsContent value="executive" className="space-y-4">
          <ExecutiveSummary />
        </TabsContent>

        {/* Timeline de Actividades */}
        <TabsContent value="timeline" className="space-y-4">
          <UserTimeline limit={15} />
        </TabsContent>

        {/* Actividad Reciente */}
        <TabsContent value="activity" className="space-y-4">
          <RecentActivity limit={20} />
        </TabsContent>
      </Tabs>
    </div>
  );
}