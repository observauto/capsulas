import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Gift, 
  Package, 
  CheckCircle, 
  Clock, 
  Truck, 
  Calendar,
  Star,
  Award,
  Download,
  Filter,
  SortDesc,
  Eye,
  TruckIcon,
  MapPin,
  Phone,
  CreditCard
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface RedeemedReward {
  id: string;
  rewardTitle: string;
  rewardDescription: string;
  pointsCost: number;
  redeemedAt: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled';
  rewardType: 'digital' | 'physical' | 'discount' | 'access' | 'certificate';
  estimatedDelivery?: string;
  trackingNumber?: string;
  deliveryAddress?: string;
  contactInfo?: string;
  rewardImage?: string;
  category: string;
}

interface RedeemedRewardsProps {
  userId?: string;
  limit?: number;
}

export default function RedeemedRewards({ userId, limit }: RedeemedRewardsProps) {
  const { user } = useAuth();
  const [redeemedRewards, setRedeemedRewards] = useState<RedeemedReward[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'date' | 'points' | 'status'>('date');
  const [stats, setStats] = useState({
    totalRedeemed: 0,
    totalPointsSpent: 0,
    pendingDeliveries: 0,
    completedDeliveries: 0,
    averageValue: 0
  });

  useEffect(() => {
    if (user || userId) {
      loadRedeemedRewards();
    }
  }, [user, userId]);

  const loadRedeemedRewards = async () => {
    try {
      setLoading(true);

      // Datos mock para demostración - en producción vendrían de la base de datos
      const mockData: RedeemedReward[] = [
        {
          id: '1',
          rewardTitle: 'Certificado de Finalización - React Fundamentals',
          rewardDescription: 'Certificado oficial de finalización del curso de React Fundamentals',
          pointsCost: 100,
          redeemedAt: '2024-11-02T14:30:00Z',
          status: 'completed',
          rewardType: 'certificate',
          estimatedDelivery: '2024-11-02T14:30:00Z',
          rewardImage: '/api/placeholder/300/200',
          category: 'Certificado'
        },
        {
          id: '2',
          rewardTitle: 'Logo Personalizado Premium',
          rewardDescription: 'Logo profesional diseñado para tu marca personal',
          pointsCost: 250,
          redeemedAt: '2024-11-01T10:15:00Z',
          status: 'processing',
          rewardType: 'digital',
          estimatedDelivery: '2024-11-08T10:15:00Z',
          rewardImage: '/api/placeholder/300/200',
          category: 'Diseño'
        },
        {
          id: '3',
          rewardTitle: 'Libreta de Notas Personalizada',
          rewardDescription: 'Libreta de notas premium con tu nombre grabado',
          pointsCost: 150,
          redeemedAt: '2024-10-30T16:45:00Z',
          status: 'shipped',
          rewardType: 'physical',
          estimatedDelivery: '2024-11-05T16:45:00Z',
          trackingNumber: 'TR123456789',
          deliveryAddress: 'Calle Principal 123, Madrid, España',
          contactInfo: '+34 600 123 456',
          rewardImage: '/api/placeholder/300/200',
          category: 'Merchandise'
        },
        {
          id: '4',
          rewardTitle: '50% Descuento en Curso Avanzado',
          rewardDescription: 'Descuento del 50% en cualquier curso avanzado de la plataforma',
          pointsCost: 200,
          redeemedAt: '2024-10-28T11:20:00Z',
          status: 'delivered',
          rewardType: 'discount',
          estimatedDelivery: '2024-10-28T11:20:00Z',
          rewardImage: '/api/placeholder/300/200',
          category: 'Descuento'
        },
        {
          id: '5',
          rewardTitle: 'Taza Personalizada - Developer Edition',
          rewardDescription: 'Taza cerámica con diseño de desarrollador',
          pointsCost: 80,
          redeemedAt: '2024-10-25T09:00:00Z',
          status: 'completed',
          rewardType: 'physical',
          estimatedDelivery: '2024-10-30T09:00:00Z',
          trackingNumber: 'TR987654321',
          deliveryAddress: 'Calle Principal 123, Madrid, España',
          contactInfo: '+34 600 123 456',
          rewardImage: '/api/placeholder/300/200',
          category: 'Merchandise'
        },
        {
          id: '6',
          rewardTitle: 'Acceso Premium por 1 Mes',
          rewardDescription: 'Acceso completo a todas las funciones premium por 30 días',
          pointsCost: 300,
          redeemedAt: '2024-10-20T14:30:00Z',
          status: 'pending',
          rewardType: 'access',
          estimatedDelivery: '2024-10-21T14:30:00Z',
          rewardImage: '/api/placeholder/300/200',
          category: 'Acceso'
        }
      ];

      setRedeemedRewards(mockData);

      // Calcular estadísticas
      const totalPoints = mockData.reduce((sum, reward) => sum + reward.pointsCost, 0);
      const pending = mockData.filter(r => ['pending', 'processing', 'shipped'].includes(r.status)).length;
      const completed = mockData.filter(r => r.status === 'completed' || r.status === 'delivered').length;
      const avgValue = totalPoints / mockData.length;

      setStats({
        totalRedeemed: mockData.length,
        totalPointsSpent: totalPoints,
        pendingDeliveries: pending,
        completedDeliveries: completed,
        averageValue: Math.round(avgValue)
      });

    } catch (error) {
      console.error('Error loading redeemed rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: RedeemedReward['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'processing':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'shipped':
        return <TruckIcon className="h-4 w-4 text-purple-600" />;
      case 'delivered':
        return <Truck className="h-4 w-4 text-green-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'cancelled':
        return <Package className="h-4 w-4 text-red-600" />;
      default:
        return <Gift className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: RedeemedReward['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: RedeemedReward['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'completed': return 'Completado';
      case 'cancelled': return 'Cancelado';
      default: return 'Desconocido';
    }
  };

  const getRewardTypeIcon = (type: RedeemedReward['rewardType']) => {
    switch (type) {
      case 'digital': return <Download className="h-4 w-4" />;
      case 'physical': return <Package className="h-4 w-4" />;
      case 'discount': return <CreditCard className="h-4 w-4" />;
      case 'access': return <Star className="h-4 w-4" />;
      case 'certificate': return <Award className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const filteredRewards = filter === 'all' 
    ? redeemedRewards 
    : redeemedRewards.filter(reward => 
        reward.status === filter ||
        reward.rewardType === filter ||
        reward.category.toLowerCase() === filter.toLowerCase()
      );

  const sortedRewards = [...filteredRewards].sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return new Date(b.redeemedAt).getTime() - new Date(a.redeemedAt).getTime();
      case 'points':
        return b.pointsCost - a.pointsCost;
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return 0;
    }
  });

  const displayRewards = limit ? sortedRewards.slice(0, limit) : sortedRewards;

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'completed'];
  const types = ['digital', 'physical', 'discount', 'access', 'certificate'];
  const categories = [...new Set(redeemedRewards.map(r => r.category))];

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
            <Gift className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{stats.totalRedeemed}</div>
            <p className="text-sm text-gray-600">Total Canjeados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{stats.totalPointsSpent}</div>
            <p className="text-sm text-gray-600">Puntos Gastados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-orange-600">{stats.pendingDeliveries}</div>
            <p className="text-sm text-gray-600">Pendientes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">{stats.completedDeliveries}</div>
            <p className="text-sm text-gray-600">Completados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{stats.averageValue}</div>
            <p className="text-sm text-gray-600">Promedio</p>
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
            Todos
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
          
          {types.map(type => (
            <Button
              key={type}
              size="sm"
              variant={filter === type ? 'default' : 'outline'}
              onClick={() => setFilter(type)}
            >
              {type === 'digital' ? 'Digital' : 
               type === 'physical' ? 'Físico' : 
               type === 'discount' ? 'Descuento' : 
               type === 'access' ? 'Acceso' : 'Certificado'}
            </Button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'points' | 'status')}
            className="px-3 py-1 border rounded-md text-sm"
          >
            <option value="date">Ordenar por fecha</option>
            <option value="points">Ordenar por puntos</option>
            <option value="status">Ordenar por estado</option>
          </select>
        </div>
      </div>

      {/* Lista de Premios Canjeados */}
      <div className="space-y-4">
        {displayRewards.map((reward) => (
          <Card key={reward.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                {/* Imagen del premio */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center">
                    {reward.rewardImage ? (
                      <img 
                        src={reward.rewardImage} 
                        alt={reward.rewardTitle}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    ) : (
                      getRewardTypeIcon(reward.rewardType)
                    )}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1">{reward.rewardTitle}</h3>
                      <p className="text-gray-600 text-sm">{reward.rewardDescription}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusIcon(reward.status)}
                      <Badge className={getStatusColor(reward.status)}>
                        {getStatusText(reward.status)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{reward.pointsCost}</div>
                      <p className="text-sm text-gray-600">Puntos</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {new Date(reward.redeemedAt).getDate()}
                      </div>
                      <p className="text-sm text-gray-600">
                        {new Date(reward.redeemedAt).toLocaleDateString('es-ES', { 
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    {reward.estimatedDelivery && (
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {new Date(reward.estimatedDelivery).getDate()}
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(reward.estimatedDelivery).toLocaleDateString('es-ES', { 
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                    
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-600">{reward.category}</div>
                      <p className="text-sm text-gray-600">Categoría</p>
                    </div>
                  </div>
                  
                  {/* Información adicional según el tipo */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-600">
                        Canjeado el {new Date(reward.redeemedAt).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                    
                    {reward.estimatedDelivery && (
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          Entrega estimada: {new Date(reward.estimatedDelivery).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    )}
                    
                    {reward.trackingNumber && (
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">
                          Seguimiento: {reward.trackingNumber}
                        </span>
                      </div>
                    )}
                    
                    {reward.deliveryAddress && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{reward.deliveryAddress}</span>
                      </div>
                    )}
                    
                    {reward.contactInfo && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-600">{reward.contactInfo}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Botones de acción */}
                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  
                  {reward.status === 'shipped' && (
                    <Button size="sm" variant="outline">
                      <TruckIcon className="h-4 w-4 mr-2" />
                      Rastrear
                    </Button>
                  )}
                  
                  {reward.rewardType === 'digital' && reward.status === 'completed' && (
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {displayRewards.length === 0 && (
        <div className="text-center py-8">
          <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No hay premios canjeados</p>
          <p className="text-sm text-gray-500 mt-1">
            Canjea tu primer premio con los puntos obtenidos
          </p>
        </div>
      )}
    </div>
  );
}