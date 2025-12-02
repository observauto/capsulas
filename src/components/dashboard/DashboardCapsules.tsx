import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
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

    // Filter logic
    let filteredCapsules: CapsuleProgress[] = [];

    if (filter === 'favorites') {
        // This logic assumes we have access to all capsules to filter favorites
        // For now, we'll filter from userCapsules and potentially need to fetch others if they are favorites but not started
        // However, to keep it simple and consistent with previous implementation:
        filteredCapsules = userCapsules.filter(c => favorites.includes(c.slug));
    } else {
        filteredCapsules = userCapsules.filter(capsule => {
            // FIX: Consider 100% progress as completed
            const isCompleted = !!capsule.completed_at || capsule.progress_percentage === 100;

            if (filter === 'completed') return isCompleted;
            if (filter === 'in_progress') return !isCompleted;
            return true;
        });
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Mis Cápsulas
                    </CardTitle>
                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={filter === 'all' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter('all')}
                        >
                            Todas
                        </Button>
                        <Button
                            variant={filter === 'in_progress' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter('in_progress')}
                            className={filter === 'in_progress' ? "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200" : ""}
                        >
                            En Progreso
                        </Button>
                        <Button
                            variant={filter === 'completed' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter('completed')}
                            className={filter === 'completed' ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-200" : ""}
                        >
                            Completadas
                        </Button>
                        <Button
                            variant={filter === 'favorites' ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter('favorites')}
                            className={filter === 'favorites' ? "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200" : ""}
                        >
                            <Star className="h-3 w-3 mr-1" />
                            Favoritos
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {filteredCapsules.length > 0 ? (
                    <div className="space-y-4">
                        {filteredCapsules.map((capsule) => {
                            // FIX: Ensure badge reflects 100% as completed
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
                                                }`}>
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
                ) : (
                    <div className="text-center py-12">
                        <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            No se encontraron cápsulas
                        </h3>
                        <p className="text-gray-600 mb-4">
                            {filter === 'favorites'
                                ? "No tienes cápsulas marcadas como favoritas"
                                : filter === 'completed'
                                    ? "Aún no has completado ninguna cápsula"
                                    : "No tienes cápsulas en este estado"}
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
