import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';
import { UserProfile } from './types';

interface DashboardProfileProps {
    userProfile: UserProfile;
    points: number;
    onEditClick: () => void;
}

export const DashboardProfile: React.FC<DashboardProfileProps> = ({
    userProfile,
    points,
    onEditClick
}) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Mi Perfil
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre
                            </label>
                            <p className="text-gray-900">{userProfile.name}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <p className="text-gray-900">{userProfile.email}</p>
                        </div>
                        {userProfile.phone && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono
                                </label>
                                <p className="text-gray-900">{userProfile.phone}</p>
                            </div>
                        )}
                        {userProfile.location && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ubicación
                                </label>
                                <p className="text-gray-900">{userProfile.location}</p>
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Rol
                            </label>
                            <Badge variant="outline">
                                Usuario Final
                            </Badge>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nivel Actual
                            </label>
                            <p className="text-2xl font-bold text-blue-600">{userProfile.level}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Puntos Totales
                            </label>
                            <p className="text-2xl font-bold text-green-600">{points}</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Miembro desde
                            </label>
                            <p className="text-gray-900">
                                {new Date(userProfile.created_at).toLocaleDateString('es-ES')}
                            </p>
                        </div>
                        {userProfile.bio && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Biografía
                                </label>
                                <p className="text-gray-900 text-sm">{userProfile.bio}</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 border-t">
                    <Button
                        variant="default"
                        className="w-full bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
                        onClick={onEditClick}
                    >
                        <Star className="h-4 w-4 mr-2" />
                        Editar Perfil
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};
