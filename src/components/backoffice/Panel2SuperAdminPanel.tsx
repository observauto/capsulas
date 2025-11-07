import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { 
  Users, 
  Award, 
  Target, 
  Settings, 
  BarChart3, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  UserPlus,
  Gift,
  Crown,
  TrendingUp,
  UserCheck,
  Database,
  Activity as ActivityIcon
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Componentes adicionales para admin
import UserTimeline from './UserTimeline';
import AdvancedStats from './AdvancedStats';
import RecentActivity from './RecentActivity';
import ExecutiveSummary from './ExecutiveSummary';

interface UserProfile {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: string;
  points: number;
  level: number;
  created_at: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points_cost: number;
  type: string;
  is_active: boolean;
  created_by?: string;
  created_at: string;
}

interface Achievement {
  id: string;
  achievement_code: string;
  title: string;
  description: string;
  achievement_type: string;
  points_reward: number;
  badge_icon?: string;
  is_active: boolean;
}

export default function Panel2SuperAdminPanel() {
  const { user } = useAuth();
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPoints: 0,
    averageLevel: 0,
    activeCapsules: 0
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Estados para modales
  const [showUserModal, setShowUserModal] = useState(false);
  const [showRewardModal, setShowRewardModal] = useState(false);
  const [showAchievementModal, setShowAchievementModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      // Verificar permisos de admin
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user?.id)
        .single();

      if (profile?.role !== 'admin') {
        toast({
          title: "Acceso Denegado",
          description: "Solo los administradores pueden acceder a este panel",
          variant: "destructive"
        });
        return;
      }

      // Cargar todos los datos
      await Promise.all([
        loadUserProfiles(),
        loadRewards(),
        loadAchievements(),
        loadStats()
      ]);

    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos administrativos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfiles = async () => {
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setUserProfiles(data);
    }
  };

  const loadRewards = async () => {
    const { data } = await supabase
      .from('rewards')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setRewards(data);
    }
  };

  const loadAchievements = async () => {
    const { data } = await supabase
      .from('achievements')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setAchievements(data);
    }
  };

  const loadStats = async () => {
    try {
      // Estadísticas básicas
      const [usersResult, rewardsResult] = await Promise.all([
        supabase.from('user_profiles').select('*'),
        supabase.from('user_profiles').select('points, level')
      ]);

      if (usersResult.data && rewardsResult.data) {
        const totalPoints = rewardsResult.data.reduce((sum, user) => sum + user.points, 0);
        const averageLevel = rewardsResult.data.length > 0 
          ? rewardsResult.data.reduce((sum, user) => sum + user.level, 0) / rewardsResult.data.length 
          : 0;

        setStats({
          totalUsers: usersResult.data.length,
          totalPoints,
          averageLevel: Math.round(averageLevel * 10) / 10,
          activeCapsules: 0 // Se calculará cuando tengamos datos de cápsulas
        });
      }
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;

      await loadUserProfiles();
      toast({
        title: "Éxito",
        description: "Rol de usuario actualizado correctamente"
      });
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el rol del usuario",
        variant: "destructive"
      });
    }
  };

  const createReward = async (rewardData: any) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .insert({
          ...rewardData,
          created_by: user?.id
        });

      if (error) throw error;

      await loadRewards();
      setShowRewardModal(false);
      toast({
        title: "Éxito",
        description: "Recompensa creada correctamente"
      });
    } catch (error) {
      console.error('Error creating reward:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la recompensa",
        variant: "destructive"
      });
    }
  };

  const updateReward = async (rewardId: string, updates: any) => {
    try {
      const { error } = await supabase
        .from('rewards')
        .update(updates)
        .eq('id', rewardId);

      if (error) throw error;

      await loadRewards();
      setShowRewardModal(false);
      toast({
        title: "Éxito",
        description: "Recompensa actualizada correctamente"
      });
    } catch (error) {
      console.error('Error updating reward:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la recompensa",
        variant: "destructive"
      });
    }
  };

  const toggleRewardStatus = async (rewardId: string, currentStatus: boolean) => {
    await updateReward(rewardId, { is_active: !currentStatus });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando panel administrativo...</p>
        </div>
      </div>
    );
  }

  const filteredUsers = userProfiles.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">
            Gestión completa de la plataforma
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
            <Crown className="h-3 w-3 mr-1" />
            Administrador
          </Badge>
        </div>
      </div>

      {/* Estadísticas Globales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Total Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs opacity-75 mt-1">
              Usuarios registrados
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Puntos Totales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPoints.toLocaleString()}</div>
            <p className="text-xs opacity-75 mt-1">
              Sistema de puntos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Nivel Promedio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageLevel}</div>
            <p className="text-xs opacity-75 mt-1">
              Nivel de usuarios
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium opacity-90">Cápsulas Activas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeCapsules}</div>
            <p className="text-xs opacity-75 mt-1">
              Contenido disponible
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs de Administración */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="users">Usuarios</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
          <TabsTrigger value="achievements">Logros</TabsTrigger>
          <TabsTrigger value="analytics">Analíticas</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="activity">Actividad</TabsTrigger>
        </TabsList>

        {/* Gestión de Usuarios */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Gestión de Usuarios
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar usuarios..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Puntos</TableHead>
                    <TableHead>Nivel</TableHead>
                    <TableHead>Registro</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="font-medium">{user.name || 'Sin nombre'}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Select
                          value={user.role}
                          onValueChange={(value) => updateUserRole(user.user_id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="end_user">Usuario</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="sponsor">Sponsor</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {user.points}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          {user.level}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString('es-ES')}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="text-red-600">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Recompensas */}
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Gestión de Recompensas
                </CardTitle>
                <Dialog open={showRewardModal} onOpenChange={setShowRewardModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Nueva Recompensa
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Nueva Recompensa</DialogTitle>
                    </DialogHeader>
                    <RewardForm onSave={createReward} onCancel={() => setShowRewardModal(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rewards.map((reward) => (
                  <Card key={reward.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={reward.is_active}
                            onCheckedChange={() => toggleRewardStatus(reward.id, reward.is_active)}
                          />
                          <Button size="sm" variant="ghost">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                          {reward.points_cost} puntos
                        </Badge>
                        <Badge variant={reward.is_active ? "default" : "secondary"}>
                          {reward.is_active ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Gestión de Logros */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Gestión de Logros
                </CardTitle>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Logro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">{achievement.title}</CardTitle>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
                          {achievement.points_reward} pts
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline">
                          {achievement.achievement_type}
                        </Badge>
                        <Button size="sm" variant="ghost">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analíticas */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Distribución de Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['end_user', 'admin', 'sponsor'].map((role) => {
                    const count = userProfiles.filter(u => u.role === role).length;
                    const percentage = userProfiles.length > 0 ? (count / userProfiles.length) * 100 : 0;
                    return (
                      <div key={role} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="capitalize">
                            {role === 'end_user' ? 'Usuarios' : role === 'admin' ? 'Administradores' : 'Sponsors'}
                          </span>
                          <span>{count} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Estadísticas de Puntos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Promedio de puntos:</span>
                    <span className="font-semibold">
                      {userProfiles.length > 0 
                        ? Math.round(stats.totalPoints / userProfiles.length)
                        : 0
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Máximo de puntos:</span>
                    <span className="font-semibold">
                      {Math.max(...userProfiles.map(u => u.points), 0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Usuarios con puntos &gt; 100:</span>
                    <span className="font-semibold">
                      {userProfiles.filter(u => u.points > 100).length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Timeline de Actividades */}
        <TabsContent value="timeline" className="space-y-4">
          <UserTimeline limit={25} />
        </TabsContent>

        {/* Actividad Reciente */}
        <TabsContent value="activity" className="space-y-4">
          <RecentActivity limit={30} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Componente de formulario para crear recompensas
function RewardForm({ onSave, onCancel }: { onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points_cost: 0,
    type: 'digital',
    is_active: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
      </div>
      <div>
        <Label htmlFor="points_cost">Costo en Puntos</Label>
        <Input
          id="points_cost"
          type="number"
          min="1"
          value={formData.points_cost}
          onChange={(e) => setFormData({ ...formData, points_cost: parseInt(e.target.value) || 0 })}
          required
        />
      </div>
      <div>
        <Label htmlFor="type">Tipo</Label>
        <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="digital">Digital</SelectItem>
            <SelectItem value="physical">Físico</SelectItem>
            <SelectItem value="discount">Descuento</SelectItem>
            <SelectItem value="access">Acceso</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Crear Recompensa
        </Button>
      </div>
    </form>
  );
}