import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Award, 
  Target, 
  Gift, 
  Star, 
  Clock, 
  CheckCircle,
  Calendar,
  Filter,
  TrendingUp,
  User,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface TimelineEvent {
  id: string;
  type: 'capsule_completed' | 'achievement_earned' | 'level_up' | 'reward_redeemed' | 'session_completed' | 'capsule_started';
  title: string;
  description: string;
  timestamp: string;
  data: any;
}

interface UserTimelineProps {
  userId?: string;
  limit?: number;
}

export default function UserTimeline({ userId, limit = 20 }: UserTimelineProps) {
  const { user } = useAuth();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [stats, setStats] = useState({
    totalEvents: 0,
    thisWeek: 0,
    completionRate: 0,
    averageSessionTime: 0
  });

  useEffect(() => {
    if (user || userId) {
      loadTimelineData();
    }
  }, [user, userId]);

  const loadTimelineData = async () => {
    try {
      setLoading(true);
      const targetUserId = userId || user?.id;

      if (!targetUserId) return;

      // Datos mock para demostración - en producción estos vendrían de la base de datos
      const mockEvents: TimelineEvent[] = [
        {
          id: '1',
          type: 'capsule_completed',
          title: 'Cápsula Completada',
          description: 'Terminaste "Fundamentos de React" con 95% de aciertos',
          timestamp: '2024-11-03T10:30:00Z',
          data: { capsuleName: 'Fundamentos de React', score: 95, timeSpent: 45 }
        },
        {
          id: '2',
          type: 'achievement_earned',
          title: 'Logro Obtenido',
          description: '¡Primer Quizz Completado! Has demostrado tu compromiso con el aprendizaje.',
          timestamp: '2024-11-03T09:15:00Z',
          data: { achievementName: 'Primer Quizz Completado', points: 50 }
        },
        {
          id: '3',
          type: 'level_up',
          title: 'Subida de Nivel',
          description: '¡Felicidades! Has avanzado al nivel 3',
          timestamp: '2024-11-02T16:20:00Z',
          data: { newLevel: 3, pointsRequired: 250 }
        },
        {
          id: '4',
          type: 'reward_redeemed',
          title: 'Premio Canjeado',
          description: 'Canjeaste "Certificado de Finalización" por 100 puntos',
          timestamp: '2024-11-02T14:00:00Z',
          data: { rewardName: 'Certificado de Finalización', pointsCost: 100 }
        },
        {
          id: '5',
          type: 'session_completed',
          title: 'Sesión de Estudio',
          description: 'Completaste 30 minutos de estudio en "JavaScript Avanzado"',
          timestamp: '2024-11-02T11:45:00Z',
          data: { duration: 30, capsuleName: 'JavaScript Avanzado' }
        },
        {
          id: '6',
          type: 'capsule_started',
          title: 'Cápsula Iniciada',
          description: 'Comenzaste "Introducción a TypeScript"',
          timestamp: '2024-11-02T09:00:00Z',
          data: { capsuleName: 'Introducción a TypeScript' }
        }
      ];

      setEvents(mockEvents);
      
      // Calcular estadísticas
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const thisWeekEvents = mockEvents.filter(event => 
        new Date(event.timestamp) >= weekAgo
      );

      const completedCapsules = mockEvents.filter(event => 
        event.type === 'capsule_completed'
      ).length;

      const totalSessionTime = mockEvents
        .filter(event => event.type === 'session_completed')
        .reduce((sum, event) => sum + (event.data?.duration || 0), 0);

      setStats({
        totalEvents: mockEvents.length,
        thisWeek: thisWeekEvents.length,
        completionRate: (completedCapsules / Math.max(mockEvents.filter(e => e.type === 'capsule_started').length, 1)) * 100,
        averageSessionTime: totalSessionTime / Math.max(mockEvents.filter(e => e.type === 'session_completed').length, 1)
      });

    } catch (error) {
      console.error('Error loading timeline data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'capsule_completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'achievement_earned':
        return <Award className="h-4 w-4 text-yellow-600" />;
      case 'level_up':
        return <Star className="h-4 w-4 text-purple-600" />;
      case 'reward_redeemed':
        return <Gift className="h-4 w-4 text-blue-600" />;
      case 'session_completed':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'capsule_started':
        return <Target className="h-4 w-4 text-blue-600" />;
      default:
        return <Activity className="h-4 w-4 text-gray-600" />;
    }
  };

  const getEventColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'capsule_completed':
        return 'bg-green-50 border-green-200';
      case 'achievement_earned':
        return 'bg-yellow-50 border-yellow-200';
      case 'level_up':
        return 'bg-purple-50 border-purple-200';
      case 'reward_redeemed':
        return 'bg-blue-50 border-blue-200';
      case 'session_completed':
        return 'bg-orange-50 border-orange-200';
      case 'capsule_started':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);

  const displayEvents = limit ? filteredEvents.slice(0, limit) : filteredEvents;

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas de la Timeline */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.totalEvents}</div>
            <p className="text-sm text-gray-600">Eventos Totales</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.thisWeek}</div>
            <p className="text-sm text-gray-600">Esta Semana</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{Math.round(stats.completionRate)}%</div>
            <p className="text-sm text-gray-600">Tasa Completación</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{Math.round(stats.averageSessionTime)}m</div>
            <p className="text-sm text-gray-600">Tiempo Promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <Button
          size="sm"
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
        >
          Todos
        </Button>
        <Button
          size="sm"
          variant={filter === 'capsule_completed' ? 'default' : 'outline'}
          onClick={() => setFilter('capsule_completed')}
        >
          Completados
        </Button>
        <Button
          size="sm"
          variant={filter === 'achievement_earned' ? 'default' : 'outline'}
          onClick={() => setFilter('achievement_earned')}
        >
          Logros
        </Button>
        <Button
          size="sm"
          variant={filter === 'level_up' ? 'default' : 'outline'}
          onClick={() => setFilter('level_up')}
        >
          Niveles
        </Button>
        <Button
          size="sm"
          variant={filter === 'reward_redeemed' ? 'default' : 'outline'}
          onClick={() => setFilter('reward_redeemed')}
        >
          Premios
        </Button>
      </div>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Historial de Actividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          {displayEvents.length > 0 ? (
            <div className="space-y-4">
              {displayEvents.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Línea conectora */}
                  {index < displayEvents.length - 1 && (
                    <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
                  )}
                  
                  <div className={`flex gap-4 p-4 border rounded-lg ${getEventColor(event.type)}`}>
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center">
                        {getEventIcon(event.type)}
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {event.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(event.timestamp).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      
                      {/* Datos adicionales según el tipo */}
                      {event.type === 'capsule_completed' && event.data && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>{event.data.capsuleName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            <span>{event.data.score}% aciertos</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.data.timeSpent} min</span>
                          </div>
                        </div>
                      )}
                      
                      {event.type === 'achievement_earned' && event.data && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            <span>+{event.data.points} puntos</span>
                          </div>
                        </div>
                      )}
                      
                      {event.type === 'level_up' && event.data && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>Nivel {event.data.newLevel}</span>
                          </div>
                        </div>
                      )}
                      
                      {event.type === 'reward_redeemed' && event.data && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Gift className="h-3 w-3" />
                            <span>{event.data.pointsCost} puntos</span>
                          </div>
                        </div>
                      )}
                      
                      {event.type === 'session_completed' && event.data && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{event.data.duration} minutos</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-3 w-3" />
                            <span>{event.data.capsuleName}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No hay actividades para mostrar</p>
              <p className="text-sm text-gray-500 mt-1">
                Comienza a estudiar para ver tu historial aquí
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}