import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Clock, 
  Target, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Award,
  Zap,
  Timer,
  BookOpen,
  Users,
  Star,
  Flame,
  Trophy,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface AdvancedStats {
  totalStudyTime: number;
  capsulesCompleted: number;
  currentStreak: number;
  longestStreak: number;
  averageScore: number;
  weeklyCompletion: number[];
  monthlyProgress: number[];
  categoryStats: {
    name: string;
    completed: number;
    total: number;
    averageTime: number;
    averageScore: number;
  }[];
  dailyActivity: {
    date: string;
    studyTime: number;
    capsulesCompleted: number;
    achievements: number;
  }[];
  learningVelocity: number;
  consistencyScore: number;
  masteryLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  nextMilestone: {
    title: string;
    progress: number;
    remaining: number;
  };
}

interface AdvancedStatsProps {
  userId?: string;
  period?: 'week' | 'month' | 'quarter' | 'year';
}

export default function AdvancedStats({ userId, period = 'month' }: AdvancedStatsProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdvancedStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState<string>('overview');

  useEffect(() => {
    if (user || userId) {
      loadAdvancedStats();
    }
  }, [user, userId, period]);

  const loadAdvancedStats = async () => {
    try {
      setLoading(true);

      // Datos mock para demostración - en producción vendrían de la base de datos
      const mockStats: AdvancedStats = {
        totalStudyTime: 1247, // minutos
        capsulesCompleted: 23,
        currentStreak: 7,
        longestStreak: 15,
        averageScore: 87.3,
        weeklyCompletion: [3, 5, 2, 4, 6, 1, 3], // Últimos 7 días
        monthlyProgress: [2, 4, 6, 8, 12, 15, 18, 20, 22, 23], // Progreso mensual
        categoryStats: [
          { name: 'Frontend', completed: 8, total: 10, averageTime: 45, averageScore: 92 },
          { name: 'Backend', completed: 6, total: 8, averageTime: 52, averageScore: 85 },
          { name: 'DevOps', completed: 4, total: 6, averageTime: 38, averageScore: 89 },
          { name: 'Database', completed: 3, total: 5, averageTime: 41, averageScore: 83 },
          { name: 'Mobile', completed: 2, total: 4, averageTime: 35, averageScore: 88 }
        ],
        dailyActivity: [
          { date: '2024-11-03', studyTime: 45, capsulesCompleted: 1, achievements: 1 },
          { date: '2024-11-02', studyTime: 90, capsulesCompleted: 2, achievements: 2 },
          { date: '2024-11-01', studyTime: 30, capsulesCompleted: 1, achievements: 0 },
          { date: '2024-10-31', studyTime: 75, capsulesCompleted: 1, achievements: 1 },
          { date: '2024-10-30', studyTime: 120, capsulesCompleted: 3, achievements: 1 },
          { date: '2024-10-29', studyTime: 15, capsulesCompleted: 0, achievements: 0 },
          { date: '2024-10-28', studyTime: 60, capsulesCompleted: 1, achievements: 1 }
        ],
        learningVelocity: 2.3, // cápsulas por semana
        consistencyScore: 85, // 0-100
        masteryLevel: 'intermediate',
        nextMilestone: {
          title: 'Completar 25 cápsulas',
          progress: 23,
          remaining: 2
        }
      };

      setStats(mockStats);

    } catch (error) {
      console.error('Error loading advanced stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMasteryLevelColor = (level: AdvancedStats['masteryLevel']) => {
    switch (level) {
      case 'beginner': return 'text-green-600';
      case 'intermediate': return 'text-blue-600';
      case 'advanced': return 'text-purple-600';
      case 'expert': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getMasteryLevelText = (level: AdvancedStats['masteryLevel']) => {
    switch (level) {
      case 'beginner': return 'Principiante';
      case 'intermediate': return 'Intermedio';
      case 'advanced': return 'Avanzado';
      case 'expert': return 'Experto';
      default: return 'Desconocido';
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay estadísticas disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{formatTime(stats.totalStudyTime)}</div>
            <p className="text-sm text-gray-600">Tiempo Total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.capsulesCompleted}</div>
            <p className="text-sm text-gray-600">Completadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{stats.currentStreak}</div>
            <p className="text-sm text-gray-600">Racha Actual</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{stats.averageScore}%</div>
            <p className="text-sm text-gray-600">Promedio</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Activity className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-600">{stats.learningVelocity.toFixed(1)}</div>
            <p className="text-sm text-gray-600">Velocidad</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.consistencyScore}%</div>
            <p className="text-sm text-gray-600">Consistencia</p>
          </CardContent>
        </Card>
      </div>

      {/* Navegación de Métricas */}
      <div className="flex flex-wrap gap-2">
        <Badge
          variant={selectedMetric === 'overview' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedMetric('overview')}
        >
          Resumen
        </Badge>
        <Badge
          variant={selectedMetric === 'progress' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedMetric('progress')}
        >
          Progreso
        </Badge>
        <Badge
          variant={selectedMetric === 'categories' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedMetric('categories')}
        >
          Categorías
        </Badge>
        <Badge
          variant={selectedMetric === 'activity' ? 'default' : 'outline'}
          className="cursor-pointer"
          onClick={() => setSelectedMetric('activity')}
        >
          Actividad
        </Badge>
      </div>

      {/* Contenido de Métricas */}
      {selectedMetric === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nivel de Maestría */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Nivel de Maestría
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getMasteryLevelColor(stats.masteryLevel)} mb-2`}>
                  {getMasteryLevelText(stats.masteryLevel)}
                </div>
                <Progress value={85} className="h-3" />
                <p className="text-sm text-gray-600 mt-2">85% hacia Avanzado</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Racha más larga</span>
                  <Badge variant="outline">{stats.longestStreak} días</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Próximo hito</span>
                  <Badge variant="outline">{stats.nextMilestone.remaining} cápsulas</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximo Hito */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Próximo Hito
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 mb-3">
                  {stats.nextMilestone.title}
                </div>
                <Progress 
                  value={(stats.nextMilestone.progress / (stats.nextMilestone.progress + stats.nextMilestone.remaining)) * 100} 
                  className="h-3" 
                />
                <p className="text-sm text-gray-600 mt-2">
                  {stats.nextMilestone.progress} de {stats.nextMilestone.progress + stats.nextMilestone.remaining} completado
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-green-600">{stats.nextMilestone.progress}</div>
                  <div className="text-xs text-gray-600">Completado</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-orange-600">{stats.nextMilestone.remaining}</div>
                  <div className="text-xs text-gray-600">Restante</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedMetric === 'progress' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Progreso Semanal */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Actividad Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.weeklyCompletion.map((count, index) => {
                  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
                  const maxValue = Math.max(...stats.weeklyCompletion);
                  const percentage = maxValue > 0 ? (count / maxValue) * 100 : 0;
                  
                  return (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 text-sm text-gray-600">{days[index]}</div>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-8 text-sm font-medium">{count}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Progreso Mensual */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Tendencia Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Progreso Acumulado</span>
                  <span className="text-sm text-gray-600">{stats.capsulesCompleted} cápsulas</span>
                </div>
                <div className="h-32 flex items-end justify-between gap-1">
                  {stats.monthlyProgress.map((value, index) => {
                    const maxValue = Math.max(...stats.monthlyProgress);
                    const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
                    
                    return (
                      <div
                        key={index}
                        className="bg-blue-500 rounded-t flex-1 transition-all duration-300 hover:bg-blue-600"
                        style={{ height: `${height}%` }}
                        title={`Día ${index + 1}: ${value} cápsulas`}
                      ></div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Día 1</span>
                  <span>Día {stats.monthlyProgress.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {selectedMetric === 'categories' && (
        <div className="space-y-4">
          {stats.categoryStats.map((category, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                  <Badge variant="outline">
                    {category.completed}/{category.total} completadas
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {Math.round((category.completed / category.total) * 100)}%
                    </div>
                    <p className="text-sm text-gray-600">Progreso</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{category.averageScore}</div>
                    <p className="text-sm text-gray-600">Promedio</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{category.averageTime}m</div>
                    <p className="text-sm text-gray-600">Tiempo Prom.</p>
                  </div>
                </div>
                
                <Progress 
                  value={(category.completed / category.total) * 100} 
                  className="h-2" 
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {selectedMetric === 'activity' && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Actividad Diaria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.dailyActivity.map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-sm font-medium">
                        {new Date(day.date).toLocaleDateString('es-ES', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Timer className="h-4 w-4" />
                          <span>{formatTime(day.studyTime)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4" />
                          <span>{day.capsulesCompleted} cápsulas</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="h-4 w-4" />
                          <span>{day.achievements} logros</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {day.studyTime > 0 && (
                        <Badge variant={day.studyTime > 60 ? 'default' : 'outline'}>
                          {day.studyTime > 60 ? 'Excelente' : 'Bueno'}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}