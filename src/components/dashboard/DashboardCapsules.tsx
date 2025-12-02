import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Target, Star, Clock, ArrowRight } from 'lucide-react';
import { CapsuleProgress } from './types';
import { useNavigate } from 'react-router-dom';

interface DashboardCapsulesProps {
  userCapsules: CapsuleProgress[];
  favorites: string[];
  filter: 'all' | 'in_progress' | 'completed' | 'favorites';
  setFilter: (filter: 'all' | 'in_progress' | 'completed' | 'favorites') => void;
}

export const DashboardCapsules: React.FC<DashboardCapsulesProps> = ({
  userCapsules,
  favorites,
  filter,
  setFilter
}) => {
  const navigate = useNavigate();

  const getFilteredCapsules = (currentFilter: string) => {
    if (currentFilter === 'favorites') {
      return userCapsules.filter(c => favorites.includes(c.slug));
    }
    return userCapsules.filter(capsule => {
      const isCompleted = !!capsule.completed_at || capsule.progress_percentage === 100;
      if (currentFilter === 'completed') return isCompleted;
      if (currentFilter === 'in_progress') return !isCompleted;
      return true;
    });
  };

  const renderCapsuleList = (capsules: CapsuleProgress[]) => {
    if (capsules.length === 0) {
      return (
        <div className="text-center py-12">
          <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            No se encontraron cápsulas
          </h3>
          <p className="text-gray-600 mb-4">
            No hay cápsulas en esta sección
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {capsules.map((capsule) => {
          const isCompleted = !!capsule.completed_at || capsule.progress_percentage === 100;
          return (
            <div
              key={capsule.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{capsule.capsule_name}</h4>
                  <span className={`text-xs px-2 py-1 rounded-full ${isCompleted
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                    } `}>
                    {isCompleted ? 'Completada' : 'En progreso'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{capsule.section_name}</p>
                <Progress value={capsule.progress_percentage} className="h-2 mb-2" />
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{capsule.progress_percentage}% completado</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {capsule.time_spent_minutes} min
                  </span>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="ml-4 shrink-0"
                onClick={() => navigate(`/capsulas/${capsule.slug}`)}
              >
                <span className="hidden sm:inline">Ir a la cápsula</span>
                <ArrowRight className="h-4 w-4 sm:ml-2" />
              </Button>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Mis Cápsulas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={filter} onValueChange={(v) => setFilter(v as any)} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="in_progress">En Progreso</TabsTrigger>
            <TabsTrigger value="completed">Completadas</TabsTrigger>
            <TabsTrigger value="favorites">
              <Star className="h-3 w-3 mr-2" />
              Favoritos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderCapsuleList(getFilteredCapsules('all'))}
          </TabsContent>
          <TabsContent value="in_progress">
            {renderCapsuleList(getFilteredCapsules('in_progress'))}
          </TabsContent>
          <TabsContent value="completed">
            {renderCapsuleList(getFilteredCapsules('completed'))}
          </TabsContent>
          <TabsContent value="favorites">
            {renderCapsuleList(getFilteredCapsules('favorites'))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
