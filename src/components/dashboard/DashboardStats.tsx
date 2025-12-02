import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatsProps {
    points: number;
    userLevel: number;
    badgesCount: number;
    pendingPrizesCount: number;
    deliveredPrizesCount: number;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
    points,
    userLevel,
    badgesCount,
    pendingPrizesCount,
    deliveredPrizesCount
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Puntos Totales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{points}</div>
                    <p className="text-xs opacity-75 mt-1">
                        Nivel {userLevel}
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Logros Obtenidos</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{badgesCount}</div>
                    <p className="text-xs opacity-75 mt-1">
                        Badges conseguidos
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Premios Canjeados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{pendingPrizesCount}</div>
                    <p className="text-xs opacity-75 mt-1">
                        Pendientes de entrega
                    </p>
                </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium opacity-90">Premios Reclamados</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {deliveredPrizesCount}
                    </div>
                    <p className="text-xs opacity-75 mt-1">
                        Ya entregados
                    </p>
                </CardContent>
            </Card>
        </div>
    );
};
