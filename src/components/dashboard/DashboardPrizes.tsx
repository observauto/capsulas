import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Trophy, Award, CheckCircle2 } from 'lucide-react';
import { Prize, RedeemedPrize, UserAchievement } from './types';
import { AVAILABLE_BADGES } from '@/lib/gamification';

interface DashboardPrizesProps {
    prizes: Prize[];
    redeemedPrizes: RedeemedPrize[];
    earnedBadges: { code: string; name: string; description: string; icon: string }[];
    points: number;
    activeSubTab: string;
    setActiveSubTab: (tab: string) => void;
    onRedeemClick: (prize: Prize) => void;
}

export const DashboardPrizes: React.FC<DashboardPrizesProps> = ({
    prizes,
    redeemedPrizes,
    earnedBadges,
    points,
    activeSubTab,
    setActiveSubTab,
    onRedeemClick
}) => {
    const canRedeem = (prizePoints: number) => points >= prizePoints;

    return (
        <Tabs value={activeSubTab} onValueChange={setActiveSubTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="premios">Premios</TabsTrigger>
                <TabsTrigger value="insignias">Insignias</TabsTrigger>
                <TabsTrigger value="reclamados">Reclamados</TabsTrigger>
            </TabsList>

            {/* Sub-Tab: Premios */}
            <TabsContent value="premios" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {prizes.sort((a, b) => a.points - b.points).map((prize) => {
                        const canRedeemPrize = canRedeem(prize.points);
                        const isLowStock = prize.stock <= 5;

                        return (
                            <Card
                                key={prize.id}
                                className={`overflow-hidden transition-all hover:shadow-lg ${!canRedeemPrize ? "opacity-60" : ""
                                    }`}
                            >
                                <div className="aspect-[4/3] relative overflow-hidden bg-muted">
                                    <img
                                        src={prize.image}
                                        alt={prize.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {isLowStock && (
                                        <Badge
                                            variant="destructive"
                                            className="absolute top-2 right-2 text-xs"
                                        >
                                            ¡Solo {prize.stock}!
                                        </Badge>
                                    )}
                                </div>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-sm line-clamp-2">
                                        {prize.name}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    <p className="text-xs text-muted-foreground line-clamp-2">
                                        {prize.description}
                                    </p>
                                    <div className="flex items-center justify-between text-xs">
                                        <div className="flex items-center gap-1 text-primary font-bold">
                                            <Trophy className="h-3 w-3" />
                                            <span>{prize.points} pts</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs">
                                            Stock: {prize.stock}
                                        </Badge>
                                    </div>
                                    <Button
                                        className="w-full text-xs py-2"
                                        disabled={!canRedeemPrize}
                                        variant={canRedeemPrize ? "default" : "outline"}
                                        onClick={() => onRedeemClick(prize)}
                                    >
                                        {canRedeemPrize
                                            ? "Canjear"
                                            : `Faltan ${prize.points - points} pts`}
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Información sobre cómo ganar puntos */}
                <Card className="bg-primary/5">
                    <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Gift className="h-5 w-5" />
                            ¿Cómo ganar puntos?
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                            <p>
                                <strong>10 puntos</strong> por cada sección de cápsula completada
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                            <p>
                                <strong>50-100 puntos</strong> por completar el quiz final (según tu calificación)
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                            <p>
                                <strong>50 puntos extra</strong> por completar una cápsula completa
                            </p>
                        </div>
                        <div className="flex items-start gap-2">
                            <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                            <p>
                                <strong>Insignias especiales</strong> por logros únicos
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* Sub-Tab: Insignias */}
            <TabsContent value="insignias" className="space-y-6">
                {earnedBadges.length > 0 && (
                    <div>
                        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            Insignias Obtenidas ({earnedBadges.length})
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {earnedBadges.map((badge) => (
                                <Card
                                    key={badge.code}
                                    className="text-center p-4 hover:shadow-lg transition-all"
                                >
                                    <div className="text-5xl mb-2">{badge.icon}</div>
                                    <h4 className="font-semibold mb-1">{badge.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {badge.description}
                                    </p>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h3 className="text-xl font-semibold mb-4 text-muted-foreground flex items-center gap-2">
                        <Award className="h-5 w-5" />
                        Por Desbloquear ({Object.keys(AVAILABLE_BADGES).length - earnedBadges.length})
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {Object.values(AVAILABLE_BADGES)
                            .filter(
                                (badge) =>
                                    !earnedBadges.some((earned) => earned.code === badge.code)
                            )
                            .map((badge) => (
                                <Card
                                    key={badge.code}
                                    className="text-center p-4 opacity-50 grayscale hover:opacity-70 transition-all"
                                >
                                    <div className="text-5xl mb-2">{badge.icon}</div>
                                    <h4 className="font-semibold mb-1">{badge.name}</h4>
                                    <p className="text-xs text-muted-foreground">
                                        {badge.description}
                                    </p>
                                </Card>
                            ))}
                    </div>
                </div>
            </TabsContent>

            {/* Sub-Tab: Reclamados */}
            <TabsContent value="reclamados" className="space-y-4">
                {/* Premios Canjeados (Pending) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Gift className="h-5 w-5" />
                            Premios Canjeados (Pendientes de Entrega)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[40vh] overflow-y-auto">
                        {/* FIX: Relaxed filter to include missing status as pending */}
                        {redeemedPrizes.filter(p => !p.status || p.status === 'pending').length > 0 ? (
                            <div className="space-y-2">
                                {redeemedPrizes.filter(p => !p.status || p.status === 'pending').map((prize) => (
                                    <div
                                        key={prize.id}
                                        className="flex items-center justify-between p-3 border rounded-lg bg-yellow-50 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm">{prize.prize_name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-xs text-gray-600">
                                                    {new Date(prize.redeemed_at).toLocaleDateString('es-ES')}
                                                </p>
                                                <p className="text-xs text-blue-600 font-medium">
                                                    {prize.prize_points} pts
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Código:</p>
                                            <p className="text-sm font-mono font-bold text-blue-600">
                                                {prize.validation_code}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <Gift className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600">No tienes premios canjeados pendientes</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Premios Reclamados (Delivered) */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <CheckCircle2 className="h-5 w-5" />
                            Premios Reclamados (Entregados)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="max-h-[40vh] overflow-y-auto">
                        {redeemedPrizes.filter(p => p.status === 'delivered').length > 0 ? (
                            <div className="space-y-2">
                                {redeemedPrizes.filter(p => p.status === 'delivered').map((prize) => (
                                    <div
                                        key={prize.id}
                                        className="flex items-center justify-between p-3 border rounded-lg bg-green-50 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex-1">
                                            <h4 className="font-medium text-gray-900 text-sm">{prize.prize_name}</h4>
                                            <div className="flex items-center gap-3 mt-1">
                                                <p className="text-xs text-gray-600">
                                                    {new Date(prize.redeemed_at).toLocaleDateString('es-ES')}
                                                </p>
                                                <p className="text-xs text-green-600 font-medium">
                                                    ✓ Entregado
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Código:</p>
                                            <p className="text-sm font-mono font-bold text-green-600">
                                                {prize.validation_code}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <CheckCircle2 className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                                <p className="text-sm text-gray-600">No has reclamado premios aún</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
};
