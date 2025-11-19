import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  TrendingUp, 
  Target, 
  Award, 
  Clock, 
  Star,
  Trophy,
  Zap,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  CheckCircle,
  AlertTriangle,
  Flame,
  Brain,
  Rocket,
  Crown,
  Gift
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface ExecutiveSummary {
  overallProgress: {
    completedCapsules: number;
    totalCapsules: number;
    averageScore: number;
    totalStudyTime: number;
    currentLevel: number;
    totalPoints: number;
  };
  performanceMetrics: {
    consistencyScore: number;
    learningVelocity: number;
    engagementLevel: 'high' | 'medium' | 'low';
    masteryAreas: string[];
    improvementAreas: string[];
  };
  milestones: {
    next: {
      title: string;
      description: string;
      progress: number;
      target: number;
      estimatedCompletion: string;
    };
    recent: Array<{
      title: string;
      completedAt: string;
      type: 'capsule' | 'achievement' | 'level' | 'streak';
    }>;
  };
  insights: {
    strengths: string[];
    opportunities: string[];
    recommendations: string[];
    trends: 'improving' | 'stable' | 'declining';
  };
  goals: {
    weekly: { target: number; achieved: number; percentage: number };
    monthly: { target: number; achieved: number; percentage: number };
    yearly: { target: number; achieved: number; percentage: number };
  };
}

interface ExecutiveSummaryProps {
  userId?: string;
}

export default function ExecutiveSummary({ userId }: ExecutiveSummaryProps) {
  const { user } = useAuth();
  const [summary, setSummary] = useState<ExecutiveSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    if (user || userId) {
      loadExecutiveSummary();
    }
  }, [user, userId]);

  const loadExecutiveSummary = async () => {
    try {
      setLoading(true);

      // Datos mock para demostración - en producción vendrían de la base de datos
      const mockSummary: ExecutiveSummary = {
        overallProgress: {
          completedCapsules: 23,
          totalCapsules: 50,
          averageScore: 87.3,
          totalStudyTime: 1247, // minutos
          currentLevel: 4,
          totalPoints: 2840
        },
        performanceMetrics: {
          consistencyScore: 85,
          learningVelocity: 2.3, // cápsulas por semana
          engagementLevel: 'high',
          masteryAreas: ['Frontend Development', 'JavaScript Basics', 'CSS Layout'],
          improvementAreas: ['Backend Development', 'Database Design', 'Testing']
        },
        milestones: {
          next: {
            title: 'Completar 25 cápsulas',
            description: 'Alcanzar el hito de 25 cápsulas completadas',
            progress: 23,
            target: 25,
            estimatedCompletion: '2024-11-10'
          },
          recent: [
            {
              title: 'React Hooks Mastery',
              completedAt: '2024-11-03T10:30:00Z',
              type: 'capsule'
            },
            {
              title: '10-day Learning Streak',
              completedAt: '2024-11-02T23:59:00Z',
              type: 'streak'
            },
            {
              title: 'Level 4 Achiever',
              completedAt: '2024-11-01T16:20:00Z',
              type: 'level'
            }
          ]
        },
        insights: {
          strengths: [
            'Alta consistencia en el estudio diario',
            'Excelente rendimiento en cápsulas de frontend',
            'Mantiene racha de aprendizaje activa',
            'Puntajes promedio superiores al 85%'
          ],
          opportunities: [
            'Incrementar tiempo de estudio en backend',
            'Mejorar velocidad de completación',
            'Diversificar áreas de conocimiento',
            'Participar más en quizzes prácticos'
          ],
          recommendations: [
            'Considera enfocar en desarrollo backend',
            'Practica más casos de uso reales',
            'Establece metas diarias específicas',
            'Explora contenido de nivel avanzado'
          ],
          trends: 'improving'
        },
        goals: {
          weekly: { target: 3, achieved: 2, percentage: 67 },
          monthly: { target: 12, achieved: 9, percentage: 75 },
          yearly: { target: 150, achieved: 23, percentage: 15 }
        }
      };

      setSummary(mockSummary);

    } catch (error) {
      console.error('Error loading executive summary:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEngagementColor = (level: ExecutiveSummary['performanceMetrics']['engagementLevel']) => {
    switch (level) {
      case 'high': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getEngagementBg = (level: ExecutiveSummary['performanceMetrics']['engagementLevel']) => {
    switch (level) {
      case 'high': return 'bg-green-100';
      case 'medium': return 'bg-yellow-100';
      case 'low': return 'bg-red-100';
      default: return 'bg-gray-100';
    }
  };

  const getTrendIcon = (trend: ExecutiveSummary['insights']['trends']) => {
    switch (trend) {
      case 'improving': return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'stable': return <Activity className="h-5 w-5 text-blue-600" />;
      case 'declining': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTrendColor = (trend: ExecutiveSummary['insights']['trends']) => {
    switch (trend) {
      case 'improving': return 'text-green-600';
      case 'stable': return 'text-blue-600';
      case 'declining': return 'text-red-600';
      default: return 'text-gray-600';
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

  if (!summary) {
    return (
      <div className="text-center py-8">
        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">No hay datos disponibles para el resumen ejecutivo</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resumen Ejecutivo</h2>
          <p className="text-gray-600">Vista general de tu progreso y rendimiento</p>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon(summary.insights.trends)}
          <span className={`text-sm font-medium ${getTrendColor(summary.insights.trends)}`}>
            {summary.insights.trends === 'improving' ? 'Mejorando' :
             summary.insights.trends === 'stable' ? 'Estable' : 'Declinando'}
          </span>
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{summary.overallProgress.completedCapsules}</div>
            <p className="text-xs opacity-90">Completadas</p>
            <p className="text-xs opacity-75 mt-1">
              de {summary.overallProgress.totalCapsules} totales
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{summary.overallProgress.averageScore}%</div>
            <p className="text-xs opacity-90">Promedio</p>
            <p className="text-xs opacity-75 mt-1">Puntuación</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{formatTime(summary.overallProgress.totalStudyTime)}</div>
            <p className="text-xs opacity-90">Estudio</p>
            <p className="text-xs opacity-75 mt-1">Tiempo Total</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white">
          <CardContent className="p-4 text-center">
            <Crown className="h-6 w-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{summary.overallProgress.currentLevel}</div>
            <p className="text-xs opacity-90">Nivel</p>
            <p className="text-xs opacity-75 mt-1">Actual</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 mx-auto mb-2" />
            <div className="text-2xl font-bold">{summary.overallProgress.totalPoints}</div>
            <p className="text-xs opacity-90">Puntos</p>
            <p className="text-xs opacity-75 mt-1">Acumulados</p>
          </CardContent>
        </Card>

        <Card className={`${getEngagementBg(summary.performanceMetrics.engagementLevel)}`}>
          <CardContent className="p-4 text-center">
            <Zap className={`h-6 w-6 mx-auto mb-2 ${getEngagementColor(summary.performanceMetrics.engagementLevel)}`} />
            <div className={`text-2xl font-bold ${getEngagementColor(summary.performanceMetrics.engagementLevel)}`}>
              {summary.performanceMetrics.consistencyScore}%
            </div>
            <p className="text-xs text-gray-600">Consistencia</p>
            <p className="text-xs text-gray-500 mt-1">
              {summary.performanceMetrics.engagementLevel === 'high' ? 'Alto' :
               summary.performanceMetrics.engagementLevel === 'medium' ? 'Medio' : 'Bajo'} engagement
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Progreso General */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progreso de Objetivos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Objetivos de Aprendizaje
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Objetivo Semanal</span>
                    <span className="text-sm text-gray-600">
                      {summary.goals.weekly.achieved}/{summary.goals.weekly.target}
                    </span>
                  </div>
                  <Progress value={summary.goals.weekly.percentage} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">{summary.goals.weekly.percentage}% completado</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Objetivo Mensual</span>
                    <span className="text-sm text-gray-600">
                      {summary.goals.monthly.achieved}/{summary.goals.monthly.target}
                    </span>
                  </div>
                  <Progress value={summary.goals.monthly.percentage} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">{summary.goals.monthly.percentage}% completado</p>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Objetivo Anual</span>
                    <span className="text-sm text-gray-600">
                      {summary.goals.yearly.achieved}/{summary.goals.yearly.target}
                    </span>
                  </div>
                  <Progress value={summary.goals.yearly.percentage} className="h-2" />
                  <p className="text-xs text-gray-600 mt-1">{summary.goals.yearly.percentage}% completado</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Próximo Hito */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="h-5 w-5" />
                Próximo Hito
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {summary.milestones.next.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {summary.milestones.next.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progreso</span>
                    <span>
                      {summary.milestones.next.progress}/{summary.milestones.next.target}
                    </span>
                  </div>
                  <Progress 
                    value={(summary.milestones.next.progress / summary.milestones.next.target) * 100} 
                    className="h-3" 
                  />
                  <p className="text-xs text-gray-600">
                    Estimado para: {new Date(summary.milestones.next.estimatedCompletion).toLocaleDateString('es-ES')}
                  </p>
                </div>

                <Button className="w-full">
                  <Target className="h-4 w-4 mr-2" />
                  Ver Detalles
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Áreas de Maestría */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Áreas de Maestría
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {summary.performanceMetrics.masteryAreas.map((area, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm text-gray-700">{area}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Milestones Recientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Logros Recientes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.milestones.recent.map((milestone, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="flex-shrink-0 mt-1">
                      {milestone.type === 'capsule' && <Target className="h-4 w-4 text-blue-600" />}
                      {milestone.type === 'achievement' && <Award className="h-4 w-4 text-yellow-600" />}
                      {milestone.type === 'level' && <Crown className="h-4 w-4 text-purple-600" />}
                      {milestone.type === 'streak' && <Flame className="h-4 w-4 text-orange-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{milestone.title}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(milestone.completedAt).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insights y Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Recomendaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {summary.insights.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Insights Detallados */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-green-600" />
              Fortalezas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.insights.strengths.map((strength, index) => (
                <div key={index} className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{strength}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              Oportunidades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {summary.insights.opportunities.map((opportunity, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Target className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{opportunity}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}