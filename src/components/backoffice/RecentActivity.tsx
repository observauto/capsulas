import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  Clock, 
  Target, 
  Award, 
  Gift,
  CheckCircle,
  Play,
  Pause,
  Star,
  TrendingUp,
  User,
  Calendar,
  RefreshCw,
  Filter,
  Eye
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface RecentActivity {
  id: string;
  type: 'capsule_started' | 'capsule_completed' | 'quiz_started' | 'quiz_completed' | 
        'achievement_earned' | 'reward_redeemed' | 'level_up' | 'session_paused' | 'profile_updated';
  title: string;
  description: string;
  timestamp: string;
  userId: string;
  userName?: string;
  data: {
    capsuleName?: string;
    quizScore?: number;
    points?: number;
    level?: number;
    rewardName?: string;
    timeSpent?: number;
    avatar?: string;
  };
  priority: 'high' | 'medium' | 'low';
  status: 'success' | 'pending' | 'failed';
}

interface RecentActivityProps {
  userId?: string;
  limit?: number;
  showFilters?: boolean;
}

export default function RecentActivity({ userId, limit = 15, showFilters = true }: RecentActivityProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [isRealTime, setIsRealTime] = useState(true);

  useEffect(() => {
    if (user || userId) {
      loadRecentActivity();
      
      // Simular actividad en tiempo real
      const interval = setInterval(() => {
        if (isRealTime) {
          simulateNewActivity();
        }
      }, 30000); // Cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [user, userId, isRealTime]);

  const loadRecentActivity = async () => {
    try {
      setLoading(true);

      // Datos mock para demostración - en producción vendrían de la base de datos
      const mockActivities: RecentActivity[] = [
        {
          id: '1',
          type: 'capsule_completed',
          title: 'Cápsula Completada',
          description: 'Terminaste "Introducción a React Hooks" con 92% de aciertos',
          timestamp: '2024-11-04T09:30:00Z',
          userId: user?.id || 'user1',
          userName: user?.user_metadata?.full_name || 'Usuario',
          data: {
            capsuleName: 'Introducción a React Hooks',
            quizScore: 92,
            timeSpent: 35
          },
          priority: 'high',
          status: 'success'
        },
        {
          id: '2',
          type: 'achievement_earned',
          title: 'Logro Desbloqueado',
          description: '¡Has obtenido el badge "Maratonista del Conocimiento"!',
          timestamp: '2024-11-04T08:45:00Z',
          userId: user?.id || 'user1',
          userName: user?.user_metadata?.full_name || 'Usuario',
          data: {
            points: 100
          },
          priority: 'high',
          status: 'success'
        },
        {
          id: '3',
          type: 'capsule_started',
          title: 'Nueva Sesión Iniciada',
          description: 'Comenzaste a estudiar "JavaScript Async/Await"',
          timestamp: '2024-11-04T08:15:00Z',
          userId: user?.id || 'user1',
          userName: user?.user_metadata?.full_name || 'Usuario',
          data: {
            capsuleName: 'JavaScript Async/Await'
          },
          priority: 'medium',
          status: 'success'
        },
        {
          id: '4',
          type: 'quiz_completed',
          title: 'Quiz Finalizado',
          description: 'Completaste el quiz de "CSS Flexbox" con 88% de aciertos',
          timestamp: '2024-11-03T16:20:00Z',
          userId: user?.id || 'user1',
          userName: user?.user_metadata?.full_name || 'Usuario',
          data: {
            capsuleName: 'CSS Flexbox',
            quizScore: 88
          },
          priority: 'medium',
          status: 'success'
        },
        {
          id: '5',
          type: 'level_up',
          title: 'Subida de Nivel',
          description: '¡Felicitaciones! Has avanzado al nivel 4',
          timestamp: '2024-11-03T14:00:00Z',
          userId: user?.id || 'user1',
          userName: user?.user_metadata?.full_name || 'Usuario',
          data: {
            level: 4,
            points: 350
          },
          priority: 'high',
          status: 'success'
        },
        {
          id: '6',
          type: 'reward_redeemed',
          title: 'Premio Canjeado',
          description: 'Canjeaste "Certificado de Excelencia" por 150 puntos',
          timestamp: '2024-11-03T11:30:00Z',
          userId: user?.id || 'user1',
          userName: user?.user_metadata?.full_name || 'Usuario',
          data: {
            rewardName: 'Certificado de Excelencia',
            points: 150
          },
          priority: 'medium',
          status: 'success'
        },
        {
          id: '7',
          type: 'session_paused',
          title: 'Sesión Pausada',
          description: 'Pausaste tu estudio de "Node.js Fundamentals"',
          timestamp: '2024-11-03T10:45:00Z',
          userId: user?.id || 'user1',
          userName: user?.user_metadata?.full_name || 'Usuario',
          data: {
            capsuleName: 'Node.js Fundamentals',
            timeSpent: 25
          },
          priority: 'low',
          status: 'success'
        },
        {
          id: '8',
          type: 'profile_updated',
          title: 'Perfil Actualizado',
          description: 'Actualizaste tu información de perfil y avatar',
          timestamp: '2024-11-03T09:15:00Z',
          userId: user?.id || 'user1',
          userName: user?.user_metadata?.full_name || 'Usuario',
          data: {},
          priority: 'low',
          status: 'success'
        }
      ];

      setActivities(mockActivities);

    } catch (error) {
      console.error('Error loading recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const simulateNewActivity = () => {
    // Simular nueva actividad occasionally
    if (Math.random() < 0.3) { // 30% de probabilidad
      const activityTypes = ['capsule_started', 'quiz_completed', 'achievement_earned'];
      const randomType = activityTypes[Math.floor(Math.random() * activityTypes.length)] as RecentActivity['type'];
      
      const newActivity: RecentActivity = {
        id: `sim_${Date.now()}`,
        type: randomType,
        title: 'Nueva Actividad',
        description: 'Actividad simulada en tiempo real',
        timestamp: new Date().toISOString(),
        userId: user?.id || 'user1',
        userName: user?.user_metadata?.full_name || 'Usuario',
        data: {},
        priority: 'low',
        status: 'success'
      };

      setActivities(prev => [newActivity, ...prev].slice(0, limit));
    }
  };

  const getActivityIcon = (type: RecentActivity['type']) => {
    switch (type) {
      case 'capsule_completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'capsule_started':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'quiz_completed':
        return <Target className="h-4 w-4 text-purple-600" />;
      case 'quiz_started':
        return <Play className="h-4 w-4 text-orange-600" />;
      case 'achievement_earned':
        return <Award className="h-4 w-4 text-yellow-600" />;
      case 'reward_redeemed':
        return <Gift className="h-4 w-4 text-pink-600" />;
      case 'level_up':
        return <Star className="h-4 w-4 text-purple-600" />;
      case 'session_paused':
        return <Pause className="h-4 w-4 text-gray-600" />;
      case 'profile_updated':
        return <User className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityColor = (type: RecentActivity['type'], priority: RecentActivity['priority']) => {
    if (priority === 'high') return 'border-l-4 border-l-red-500';
    if (priority === 'medium') return 'border-l-4 border-l-yellow-500';
    return 'border-l-4 border-l-gray-300';
  };

  const getPriorityBadge = (priority: RecentActivity['priority']) => {
    switch (priority) {
      case 'high':
        return <Badge variant="destructive" className="text-xs">Alta</Badge>;
      case 'medium':
        return <Badge variant="default" className="text-xs bg-yellow-600">Media</Badge>;
      case 'low':
        return <Badge variant="outline" className="text-xs">Baja</Badge>;
    }
  };

  const getStatusColor = (status: RecentActivity['status']) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredActivities = filter === 'all' 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  const displayActivities = filteredActivities.slice(0, limit);

  const activityTypes = [
    'capsule_completed', 'capsule_started', 'quiz_completed', 'achievement_earned',
    'reward_redeemed', 'level_up', 'profile_updated', 'session_paused'
  ];

  const getActivityTypeLabel = (type: string) => {
    switch (type) {
      case 'capsule_completed': return 'Completada';
      case 'capsule_started': return 'Iniciada';
      case 'quiz_completed': return 'Quiz';
      case 'achievement_earned': return 'Logro';
      case 'reward_redeemed': return 'Premio';
      case 'level_up': return 'Nivel';
      case 'profile_updated': return 'Perfil';
      case 'session_paused': return 'Pausa';
      default: return 'Otra';
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / (1000 * 60));

    if (diffInMinutes < 1) return 'Ahora mismo';
    if (diffInMinutes < 60) return `${diffInMinutes} min`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-bold text-gray-900">Actividad Reciente</h2>
          {isRealTime && (
            <div className="flex items-center gap-1 text-sm text-green-600">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Tiempo real</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsRealTime(!isRealTime)}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRealTime ? 'animate-spin' : ''}`} />
            {isRealTime ? 'Activo' : 'Pausado'}
          </Button>
        </div>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{activities.length}</div>
            <p className="text-sm text-gray-600">Actividades</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {activities.filter(a => a.status === 'success').length}
            </div>
            <p className="text-sm text-gray-600">Exitosas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {activities.filter(a => a.type === 'capsule_completed').length}
            </div>
            <p className="text-sm text-gray-600">Completadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {activities.filter(a => a.type === 'achievement_earned').length}
            </div>
            <p className="text-sm text-gray-600">Logros</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          {activityTypes.map(type => (
            <Button
              key={type}
              size="sm"
              variant={filter === type ? 'default' : 'outline'}
              onClick={() => setFilter(type)}
            >
              {getActivityTypeLabel(type)}
            </Button>
          ))}
        </div>
      )}

      {/* Lista de actividades */}
      <Card>
        <CardContent className="p-0">
          {displayActivities.length > 0 ? (
            <div className="space-y-0">
              {displayActivities.map((activity, index) => (
                <div 
                  key={activity.id} 
                  className={`p-4 border-b last:border-b-0 hover:bg-gray-50 transition-colors ${getActivityColor(activity.type, activity.priority)}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icono */}
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getActivityIcon(activity.type)}
                      </div>
                    </div>
                    
                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900">{activity.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        </div>
                        
                        <div className="flex items-center gap-2 ml-4">
                          {getPriorityBadge(activity.priority)}
                          <span className={`text-xs ${getStatusColor(activity.status)}`}>
                            {activity.status === 'success' ? '✓' : 
                             activity.status === 'pending' ? '⏳' : '✗'}
                          </span>
                        </div>
                      </div>
                      
                      {/* Datos adicionales */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(activity.timestamp)}</span>
                        </div>
                        
                        {activity.data.capsuleName && (
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>{activity.data.capsuleName}</span>
                          </div>
                        )}
                        
                        {activity.data.quizScore && (
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{activity.data.quizScore}%</span>
                          </div>
                        )}
                        
                        {activity.data.points && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>+{activity.data.points} pts</span>
                          </div>
                        )}
                        
                        {activity.data.level && (
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            <span>Nivel {activity.data.level}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Botón de acción */}
                    <div className="flex-shrink-0">
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay actividad reciente</p>
              <p className="text-sm text-gray-500 mt-1">
                Tu actividad aparecerá aquí en tiempo real
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}