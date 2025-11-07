import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Clock, 
  Play, 
  CheckCircle, 
  Pause, 
  RotateCcw,
  Star,
  Trophy,
  Calendar,
  TrendingUp,
  Users,
  Activity,
  AlertCircle,
  Award,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';

interface EnhancedCapsule {
  id: string;
  capsuleName: string;
  sectionName: string;
  progress: number;
  status: 'not_started' | 'in_progress' | 'paused' | 'completed';
  lastAccessed: string;
  totalTime: number;
  estimatedTime: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  priority: 'high' | 'medium' | 'low';
  completionScore?: number;
  attempts: number;
  nextMilestone: {
    title: string;
    progress: number;
    target: number;
  };
  relatedCapsules: string[];
  achievements: Array<{
    id: string;
    title: string;
    earned: boolean;
  }>;
  sponsor?: {
    name: string;
    logo?: string;
  };
}

interface EnhancedCapsulesProps {
  userId?: string;
  showFilters?: boolean;
}

export default function EnhancedCapsules({ userId, showFilters = true }: EnhancedCapsulesProps) {
  const { user } = useAuth();
  const [capsules, setCapsules] = useState<EnhancedCapsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'progress' | 'date' | 'difficulty'>('progress');

  useEffect(() => {
    if (user || userId) {
      loadEnhancedCapsules();
    }
  }, [user, userId]);

  const loadEnhancedCapsules = async () => {
    try {
      setLoading(true);

      // SOLUCIÓN: Solo mostrar píldoras disponibles con progreso 0
      // El usuario dice que no ha completado ninguna cápsula
      const { data: availablePills, error: pillsError } = await supabase
        .from('pills')
        .select(`
          id,
          title,
          content,
          category,
          difficulty,
          estimated_time_minutes,
          section_name
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: true });

      if (pillsError) {
        console.error('Error loading pills:', pillsError);
        setCapsules([]);
        return;
      }

      // Solo mostrar las píldoras disponibles con progreso 0
      const enhancedCapsules: EnhancedCapsule[] = [];

      if (availablePills && availablePills.length > 0) {
        availablePills.forEach((pill) => {
          enhancedCapsules.push({
            id: `available_${pill.id}`,
            capsuleName: pill.title,
            sectionName: pill.section_name || 'Sección Principal',
            progress: 0, // TODO debe aparecer en ceros
            status: 'not_started',
            lastAccessed: new Date().toISOString(),
            totalTime: 0, // TODO debe aparecer en ceros
            estimatedTime: pill.estimated_time_minutes || 60,
            difficulty: (pill.difficulty as 'beginner' | 'intermediate' | 'advanced') || 'beginner',
            category: pill.category || 'General',
            priority: 'medium',
            attempts: 0, // TODO debe aparecer en ceros
            nextMilestone: {
              title: 'Iniciar primera sección',
              progress: 0,
              target: 3
            },
            relatedCapsules: [],
            achievements: [],
            sponsor: {
              name: 'BYD'
            }
          });
        });
      }

      console.log(`Cargando ${enhancedCapsules.length} cápsulas disponibles para el usuario`);
      setCapsules(enhancedCapsules);

    } catch (error) {
      console.error('Error loading enhanced capsules:', error);
      setCapsules([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: EnhancedCapsule['status']) => {
    switch (status) {
      case 'not_started':
        return <Target className="h-4 w-4 text-gray-400" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'paused':
        return <Pause className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: EnhancedCapsule['status']) => {
    switch (status) {
      case 'not_started': return 'bg-gray-100 text-gray-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: EnhancedCapsule['status']) => {
    switch (status) {
      case 'not_started': return 'No iniciada';
      case 'in_progress': return 'En progreso';
      case 'paused': return 'Pausada';
      case 'completed': return 'Completada';
      default: return 'Desconocido';
    }
  };

  const getDifficultyColor = (difficulty: EnhancedCapsule['difficulty']) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: EnhancedCapsule['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-400';
  };

  const formatTime = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const filteredCapsules = filter === 'all' 
    ? capsules 
    : capsules.filter(capsule => 
        capsule.status === filter ||
        capsule.difficulty === filter ||
        capsule.category.toLowerCase() === filter.toLowerCase() ||
        capsule.priority === filter
      );

  const sortedCapsules = [...filteredCapsules].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.capsuleName.localeCompare(b.capsuleName);
      case 'progress':
        return b.progress - a.progress;
      case 'date':
        return new Date(b.lastAccessed).getTime() - new Date(a.lastAccessed).getTime();
      case 'difficulty':
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      default:
        return 0;
    }
  });

  const statuses = ['not_started', 'in_progress', 'paused', 'completed'];
  const difficulties = ['beginner', 'intermediate', 'advanced'];
  const priorities = ['high', 'medium', 'low'];
  const categories = [...new Set(capsules.map(c => c.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{capsules.length}</div>
            <p className="text-sm text-gray-600">Total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Play className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">
              {capsules.filter(c => c.status === 'in_progress').length}
            </div>
            <p className="text-sm text-gray-600">En Progreso</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">
              {capsules.filter(c => c.status === 'completed').length}
            </div>
            <p className="text-sm text-gray-600">Completadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">
              {Math.round(capsules.reduce((sum, c) => sum + c.progress, 0) / capsules.length)}%
            </div>
            <p className="text-sm text-gray-600">Promedio</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Ordenación */}
      {showFilters && (
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
            >
              Todas
            </Button>
            
            {statuses.map(status => (
              <Button
                key={status}
                size="sm"
                variant={filter === status ? 'default' : 'outline'}
                onClick={() => setFilter(status)}
              >
                {getStatusText(status)}
              </Button>
            ))}
            
            {difficulties.map(difficulty => (
              <Button
                key={difficulty}
                size="sm"
                variant={filter === difficulty ? 'default' : 'outline'}
                onClick={() => setFilter(difficulty)}
              >
                {difficulty === 'beginner' ? 'Principiante' : 
                 difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
              </Button>
            ))}
          </div>
          
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1 border rounded-md text-sm"
            >
              <option value="progress">Ordenar por progreso</option>
              <option value="name">Ordenar por nombre</option>
              <option value="date">Ordenar por fecha</option>
              <option value="difficulty">Ordenar por dificultad</option>
            </select>
          </div>
        </div>
      )}

      {/* Lista de Cápsulas Mejorada */}
      <div className="space-y-4">
        {sortedCapsules.map((capsule) => (
          <Card key={capsule.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(capsule.status)}
                      <h3 className="text-lg font-semibold text-gray-900">{capsule.capsuleName}</h3>
                      <Badge className={getStatusColor(capsule.status)}>
                        {getStatusText(capsule.status)}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-3">{capsule.sectionName}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{capsule.category}</Badge>
                      <Badge className={getDifficultyColor(capsule.difficulty)}>
                        {capsule.difficulty === 'beginner' ? 'Principiante' : 
                         capsule.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                      </Badge>
                      <Badge className={getPriorityColor(capsule.priority)}>
                        Prioridad {capsule.priority === 'high' ? 'Alta' : 
                                   capsule.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                      {capsule.sponsor && (
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {capsule.sponsor.name}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button 
                      size="sm" 
                      variant={capsule.status === 'not_started' ? 'default' : 'outline'}
                    >
                      {capsule.status === 'not_started' ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Iniciar
                        </>
                      ) : capsule.status === 'completed' ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Revisar
                        </>
                      ) : capsule.status === 'paused' ? (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Continuar
                        </>
                      ) : (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pausar
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                
                {/* Barra de Progreso Mejorada */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Progreso General</span>
                    <span className="text-sm text-gray-600">{capsule.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(capsule.progress)}`}
                      style={{ width: `${capsule.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Métricas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-600">
                      {formatTime(capsule.totalTime)}
                    </div>
                    <p className="text-xs text-gray-600">Tiempo Invertido</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-orange-600">
                      {formatTime(capsule.estimatedTime)}
                    </div>
                    <p className="text-xs text-gray-600">Tiempo Estimado</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-600">{capsule.attempts}</div>
                    <p className="text-xs text-gray-600">Intentos</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-600">
                      {capsule.completionScore || '-'}
                      {capsule.completionScore && '%'}
                    </div>
                    <p className="text-xs text-gray-600">Puntuación</p>
                  </div>
                </div>
                
                {/* Próximo Hito */}
                {capsule.nextMilestone && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Próximo Hito</span>
                      <span className="text-xs text-gray-600">
                        {capsule.nextMilestone.progress}/{capsule.nextMilestone.target}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">{capsule.nextMilestone.title}</p>
                    <Progress 
                      value={(capsule.nextMilestone.progress / capsule.nextMilestone.target) * 100} 
                      className="h-2" 
                    />
                  </div>
                )}
                
                {/* Logros */}
                {capsule.achievements.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gray-500" />
                    <div className="flex gap-2">
                      {capsule.achievements.slice(0, 3).map((achievement, index) => (
                        <Badge 
                          key={index}
                          variant="outline" 
                          className={achievement.earned ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'}
                        >
                          {achievement.title}
                        </Badge>
                      ))}
                      {capsule.achievements.length > 3 && (
                        <Badge variant="outline" className="bg-gray-50">
                          +{capsule.achievements.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Información Adicional */}
                <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>Última actividad: {new Date(capsule.lastAccessed).toLocaleDateString('es-ES')}</span>
                    </div>
                    
                    {capsule.relatedCapsules.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>{capsule.relatedCapsules.length} relacionadas</span>
                      </div>
                    )}
                  </div>
                  
                  {capsule.totalTime > 0 && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Eficiencia: {Math.round((capsule.progress / capsule.totalTime) * 100)}%</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {sortedCapsules.length === 0 && (
        <div className="text-center py-8">
          <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay cápsulas para mostrar</p>
          <p className="text-sm text-gray-500 mt-1">
            Ajusta los filtros o explora nuevas cápsulas para aprender
          </p>
        </div>
      )}
    </div>
  );
}