import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp } from 'lucide-react';

interface DashboardLevelProgressProps {
    userLevel: number;
    points: number;
    nextLevelPoints: number;
    progress: number;
    pointsToNext: number;
}

export const DashboardLevelProgress: React.FC<DashboardLevelProgressProps> = ({
    userLevel,
    points,
    nextLevelPoints,
    progress,
    pointsToNext
}) => {
    return (
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
                            Nivel {userLevel} → {userLevel + 1}
                        </span>
                        <span className="text-sm text-gray-600">
                            {points} / {nextLevelPoints} puntos
                        </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-gray-600">
                        {pointsToNext} puntos para el siguiente nivel
                    </p>
                </div>
            </CardContent>
        </Card>
    );
};
