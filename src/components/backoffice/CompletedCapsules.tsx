import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle, 
  Clock, 
  Trophy, 
  Target, 
  Calendar,
  Star,
  Award,
  Download,
  Filter,
  SortDesc,
  TrendingUp,
  Timer,
  Zap
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface CompletedCapsule {
  id: string;
  capsuleName: string;
  sectionName: string;
  completedAt: string;
  finalScore: number;
  timeSpent: number;
  attempts: number;
  certificate?: boolean;
  badge?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  sponsorId?: string;
}

interface CompletedCapsulesProps {
  userId?: string;
  limit?: number;
}

export default function CompletedCapsules({ userId, limit }: CompletedCapsulesProps) {
  const { user } = useAuth();
  const [completedCapsules, setCompletedCapsules] = useState<CompletedCapsule[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'score' | 'time'>('date');
  const [stats, setStats] = useState({
    totalCompleted: 0,
    averageScore: 0,
    totalTime: 0,
    certificatesEarned: 0,
    weeklyAverage: 0
  });

  useEffect(() => {
    if (user || userId) {
      loadCompletedCapsules();
    }
  }, [user, userId]);

  const loadCompletedCapsules = async () => {
    try {
      setLoading(true);

      // Datos mock para demostración - en producción vendrían de la base de datos
      const mockData: CompletedCapsule[] = [
        {
          id: '1',
          capsuleName: 'Fundamentos de React',
          sectionName: 'Componentes y JSX',
          completedAt: '2024-11-03T10:30:00Z',
          finalScore: 95,
          timeSpent: 45,
          attempts: 1,
          certificate: true,
          badge: 'React Expert',
          category: 'Frontend',
          difficulty: 'medium'
        },
        {
          id: '2',
          capsuleName: 'JavaScript Avanzado',
          sectionName: 'Closures y Promises',
          completedAt: '2024-11-02T16:20:00Z',
          finalScore: 88,
          timeSpent: 60,
          attempts: 2,
          certificate: true,
          badge: 'JS Advanced',
          category: 'Programming',
          difficulty: 'hard'
        },
        {
          id: '3',
          capsuleName: 'Introducción a TypeScript',
          sectionName: 'Tipos Básicos',
          completedAt: '2024-11-01T14:15:00Z',
          finalScore: 92,
          timeSpent: 35,
          attempts: 1,
          certificate: false,
          badge: 'TypeScript Basics',
          category: 'Programming',
          difficulty: 'easy'
        },
        {
          id: '4',
          capsuleName: 'CSS Flexbox y Grid',
          sectionName: 'Layout Responsive',
          completedAt: '2024-10-31T11:45:00Z',
          finalScore: 85,
          timeSpent: 50,
          attempts: 1,
          certificate: false,
          badge: 'CSS Layout Master',
          category: 'Frontend',
          difficulty: 'medium'
        },
        {
          id: '5',
          capsuleName: 'Node.js Fundamentals',
          sectionName: 'Express y Middleware',
          completedAt: '2024-10-30T09:30:00Z',
          finalScore: 78,
          timeSpent: 75,
          attempts: 3,
          certificate: false,
          badge: 'Node.js Novice',
          category: 'Backend',
          difficulty: 'hard'
        }
      ];

      setCompletedCapsules(mockData);

      // Calcular estadísticas
      const totalScore = mockData.reduce((sum, capsule) => sum + capsule.finalScore, 0);
      const totalTime = mockData.reduce((sum, capsule) => sum + capsule.timeSpent, 0);
      const certificates = mockData.filter(capsule => capsule.certificate).length;
      
      // Calcular promedio semanal (últimos 30 días)
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      const recentCompleted = mockData.filter(capsule => 
        new Date(capsule.completedAt) >= thirtyDaysAgo
      );
      const weeklyAverage = (recentCompleted.length / 4.3); // 4.3 semanas en 30 días

      setStats({
        totalCompleted: mockData.length,
        averageScore: Math.round(totalScore / mockData.length),
        totalTime: totalTime,
        certificatesEarned: certificates,
        weeklyAverage: Math.round(weeklyAverage * 10) / 10
      });

    } catch (error) {
      console.error('Error loading completed capsules:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty: CompletedCapsule['difficulty']) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const filteredCapsules = filter === 'all' 
    ? completedCapsules 
    : completedCapsules.filter(capsule => 
        capsule.category.toLowerCase() === filter.toLowerCase() ||
        capsule.difficulty === filter
      );

  const sortedCapsules = [...filteredCapsules].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
      case 'score':
        return b.finalScore - a.finalScore;
      case 'time':
        return b.timeSpent - a.timeSpent;
      default:
        return 0;
    }
  });

  const displayCapsules = limit ? sortedCapsules.slice(0, limit) : sortedCapsules;

  const categories = [...new Set(completedCapsules.map(c => c.category))];
  const difficulties = ['easy', 'medium', 'hard'];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.totalCompleted}</div>
            <p className="text-sm text-gray-600">Completadas</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.averageScore}%</div>
            <p className="text-sm text-gray-600">Promedio</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{Math.round(stats.totalTime / 60)}h</div>
            <p className="text-sm text-gray-600">Tiempo Total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{stats.certificatesEarned}</div>
            <p className="text-sm text-gray-600">Certificados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{stats.weeklyAverage}</div>
            <p className="text-sm text-gray-600">Semanal</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y Ordenación */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            Todas
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              size="sm"
              variant={filter === category ? 'default' : 'outline'}
              onClick={() => setFilter(category)}
            >
              {category}
            </Button>
          ))}
          {difficulties.map(difficulty => (
            <Button
              key={difficulty}
              size="sm"
              variant={filter === difficulty ? 'default' : 'outline'}
              onClick={() => setFilter(difficulty)}
            >
              {difficulty === 'easy' ? 'Fácil' : difficulty === 'medium' ? 'Medio' : 'Difícil'}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'score' | 'time')}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="date">Ordenar por fecha</option>
            <option value="score">Ordenar por puntuación</option>
            <option value="time">Ordenar por tiempo</option>
          </select>
        </div>
      </div>

      {/* Lista de Cápsulas Completadas */}
      <div className="space-y-4">
        {displayCapsules.map((capsule) => (
          <Card key={capsule.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">{capsule.capsuleName}</h3>
                    </div>
                    <Badge variant="outline">{capsule.category}</Badge>
                    <Badge className={getDifficultyColor(capsule.difficulty)}>
                      {capsule.difficulty === 'easy' ? 'Fácil' : 
                       capsule.difficulty === 'medium' ? 'Medio' : 'Difícil'}
                    </Badge>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{capsule.sectionName}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className={`text-2xl font-bold ${getScoreColor(capsule.finalScore)}`}>
                        {capsule.finalScore}%
                      </div>
                      <p className="text-sm text-gray-600">Puntuación Final</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{capsule.timeSpent}m</div>
                      <p className="text-sm text-gray-600">Tiempo Invertido</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{capsule.attempts}</div>
                      <p className="text-sm text-gray-600">Intento{capsule.attempts > 1 ? 's' : ''}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {new Date(capsule.completedAt).getDate()}
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(capsule.completedAt).toLocaleDateString('es-ES', { 
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Completada el {new Date(capsule.completedAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    
                    {capsule.certificate && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Award className="h-3 w-3 mr-1" />
                        Certificado Obtenido
                      </Badge>
                    )}
                    
                    {capsule.badge && (
                      <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                        <Star className="h-3 w-3 mr-1" />
                        {capsule.badge}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Target className="h-4 w-4 mr-2" />
                    Revisar
                  </Button>
                </div>
              </div>
              
              {/* Barra de progreso visual del rendimiento */}
              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Rendimiento</span>
                  <span className="text-sm text-gray-600">{capsule.finalScore}%</span>
                </div>
                <Progress 
                  value={capsule.finalScore} 
                  className={`h-2 ${getScoreColor(capsule.finalScore)}`}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {displayCapsules.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay cápsulas completadas</p>
          <p className="text-sm text-gray-500 mt-1">
            Completa tu primera cápsula para ver tu progreso aquí
          </p>
        </div>
      )}
    </div>
  );
}