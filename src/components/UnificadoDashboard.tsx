import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useGamification } from '@/context/GamificationContext';
import { useAuth } from '@/context/AuthContext';
import { AVAILABLE_BADGES } from '@/lib/gamification';
import { Trophy, Star, Target, Award, Clock, TrendingUp, Gift, CheckCircle2, X, Flame, LogIn, UserX } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import EditProfileModal from './EditProfileModal';

// Datos base - SIN PROGRESO FALSO
const BASE_USER_PROFILE = {
  id: '1',
  user_id: 'demo-user',
  email: 'usuario@demo.com',
  name: 'Usuario Demo',
  role: 'end_user',
  level: 1, // ← CAMBIADO: Nivel 1 (no hay puntos)
  created_at: '2024-01-15T10:00:00Z',
  phone: '',
  location: '',
  bio: ''
};

// Función para cargar perfil desde localStorage
const loadUserProfile = (): typeof BASE_USER_PROFILE => {
  try {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      return { ...BASE_USER_PROFILE, ...JSON.parse(savedProfile) };
    }
  } catch (error) {
    console.error('Error loading profile from localStorage:', error);
  }
  return BASE_USER_PROFILE;
};

interface Achievement {
  id: string;
  achievement_code: string;
  title: string;
  description: string;
  badge_icon?: string;
  points_reward: number;
  category?: string;
}

interface UserAchievement {
  id: string;
  achievement_id: string;
  earned_at: string;
  achievement?: Achievement;
}

interface CapsuleProgress {
  id: string;
  capsule_name: string;
  section_name: string;
  progress_percentage: number;
  completed_at?: string;
  last_accessed: string;
  time_spent_minutes: number;
}

interface RedeemedPrize {
  id: string;
  prize_id: string;
  prize_name: string;
  prize_points: number;
  validation_code: string;
  redeemed_at: string;
  status: 'pending' | 'delivered' | 'cancelled';
}

const PRIZES = [
  {
    id: "1",
    name: "Chaqueta Observauto Premium",
    description: "Chaqueta exclusiva de la marca patrocinadora con tecnología térmica",
    points: 1000,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    stock: 5,
    category: "premium",
  },
  {
    id: "2",
    name: "Power Bank Observauto 20,000mAh",
    description: "Carga rápida, diseño compacto, perfecto para viajes",
    points: 500,
    image: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400",
    stock: 15,
    category: "tech",
  },
  {
    id: "3",
    name: "Kit de Herramientas Automotriz",
    description: "Set profesional de 50 piezas para mantenimiento vehicular",
    points: 800,
    image: "https://images.unsplash.com/photo-1530124566582-a618bc2615dc?w=400",
    stock: 8,
    category: "tools",
  },
  {
    id: "4",
    name: "Audífonos Bluetooth Premium",
    description: "Cancelación de ruido activa, 30 horas de batería",
    points: 600,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    stock: 12,
    category: "tech",
  },
  {
    id: "5",
    name: "Mochila Observauto Tech",
    description: "Mochila antirrobo con puerto USB y compartimento para laptop",
    points: 400,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400",
    stock: 20,
    category: "accessories",
  },
  {
    id: "6",
    name: "Smartwatch Deportivo",
    description: "Monitor de ritmo cardíaco, GPS integrado, resistente al agua",
    points: 1200,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400",
    stock: 3,
    category: "premium",
  },
  {
    id: "7",
    name: "Termo Inteligente 500ml",
    description: "Mantiene temperatura 12h, pantalla LED, recargable USB",
    points: 300,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400",
    stock: 25,
    category: "accessories",
  },
  {
    id: "8",
    name: "Llavero Observauto Premium",
    description: "Llavero metálico de lujo con acabado cromado",
    points: 100,
    image: "https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=400",
    stock: 50,
    category: "accessories",
  },
];

// Función para cargar cápsulas completadas desde localStorage
const loadUserCapsules = (): CapsuleProgress[] => {
  try {
    const completedCapsules = JSON.parse(localStorage.getItem('completed_capsules') || '[]');
    const userCapsules: CapsuleProgress[] = [];
    
    completedCapsules.forEach((capsuleSlug: string, index: number) => {
      // Mapeo de slugs a nombres reales de cápsulas
      const capsuleMap: { [key: string]: { name: string; section: string } } = {
        'camion-flota-empresarial': { name: 'Camión Flota Empresarial', section: 'Gestión de Flotas' },
        'gas-natural-vehicular': { name: 'Gas Natural Vehicular', section: 'GNV Systems' },
        'identifica-modelos-automotrices': { name: 'Identifica Modelos Automotrices', section: 'Identificación' },
        'seguridad-vial-consejos': { name: 'Seguridad Vial Consejos', section: 'Seguridad' },
        'metodos-financiacion': { name: 'Métodos Financiación', section: 'Financiamiento' },
        'mantenimiento-basico': { name: 'Mantenimiento Básico', section: 'Cambio de aceite' },
        'sistemas-electricos': { name: 'Sistemas Eléctricos', section: 'Batería y alternador' },
        'neumaticos': { name: 'Neumáticos', section: 'Inspección y rotación' },
        'frenos': { name: 'Frenos', section: 'Pastillas y discos' }
      };
      
      const capsuleInfo = capsuleMap[capsuleSlug];
      if (capsuleInfo) {
        userCapsules.push({
          id: `user-capsule-${index}`,
          capsule_name: capsuleInfo.name,
          section_name: capsuleInfo.section,
          progress_percentage: 100,
          completed_at: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
          last_accessed: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
          time_spent_minutes: 45 + (index * 10) // Tiempo variable basado en el orden
        });
      }
    });
    
    return userCapsules;
  } catch (error) {
    console.error('Error loading user capsules:', error);
    return [];
  }
};

// CÁPSULAS EN PROGRESO - Cargadas dinámicamente
let USER_CAPSULES: CapsuleProgress[] = loadUserCapsules();

export default function UnificadoDashboard() {
  const { user, signInWithGoogle } = useAuth();
  const { points, badges, subtractPoints } = useGamification();
  // CORRECCIÓN GLOBAL: Cargar premios desde localStorage
  const [redeemedPrizes, setRedeemedPrizes] = useState<RedeemedPrize[]>(() => {
    try {
      const savedPrizes = localStorage.getItem('oa_redeemed_prizes');
      if (savedPrizes) {
        const prizes = JSON.parse(savedPrizes);
        console.log('[UNIFICADO_DASHBOARD] Premios redimidos cargados:', prizes.length);
        return prizes;
      }
    } catch (error) {
      console.error('Error loading redeemed prizes from localStorage:', error);
    }
    return [];
  });
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<typeof PRIZES[0] | null>(null);
  const [validationCode, setValidationCode] = useState("");
  
  // Estados para el perfil
  const [userProfile, setUserProfile] = useState(() => loadUserProfile());
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  
  // Estados para cápsulas de usuario (dinámico)
  const [userCapsules, setUserCapsules] = useState<CapsuleProgress[]>(() => loadUserCapsules());

  // Actualizar cápsulas cuando cambien en localStorage
  React.useEffect(() => {
    const handleStorageChange = () => {
      setUserCapsules(loadUserCapsules());
    };

    // Escuchar cambios en localStorage
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar cambios personalizados de gamificación
    window.addEventListener('gamification:update', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('gamification:update', handleStorageChange);
    };
  }, []);

  // CORRECCIÓN GLOBAL: Sincronizar premios redimidos entre pestañas
  React.useEffect(() => {
    const handlePrizeStorageChange = (event: StorageEvent) => {
      if (event.key === 'oa_redeemed_prizes') {
        try {
          const updatedPrizes = event.newValue ? JSON.parse(event.newValue) : [];
          console.log('[UNIFICADO_DASHBOARD] Premios sincronizados desde otra pestaña:', updatedPrizes.length);
          setRedeemedPrizes(updatedPrizes);
        } catch (error) {
          console.error('Error syncing prizes from localStorage:', error);
        }
      }
    };

    // Escuchar cambios en localStorage para premios
    window.addEventListener('storage', handlePrizeStorageChange);
    
    // Escuchar cambios personalizados de premios
    window.addEventListener('prizes:update', handlePrizeStorageChange);

    return () => {
      window.removeEventListener('storage', handlePrizeStorageChange);
      window.removeEventListener('prizes:update', handlePrizeStorageChange);
    };
  }, []);

  const earnedBadges = React.useMemo(() => {
    return badges.map(code => {
      const badge = AVAILABLE_BADGES[code];
      if (badge) return badge;
      return {
        code,
        name: code,
        description: "Insignia obtenida",
        icon: "🏅",
      };
    });
  }, [badges]);

  // Función para actualizar el perfil del usuario
  const handleProfileUpdate = (updatedProfile: typeof userProfile) => {
    setUserProfile(updatedProfile);
    localStorage.setItem('userProfile', JSON.stringify(updatedProfile));
  };

  // Datos mock para logros (basados en badges obtenidos)
  const userAchievements: UserAchievement[] = earnedBadges.map((badge, index) => ({
    id: `mock-achievement-${index}`,
    achievement_id: badge.code,
    earned_at: new Date(Date.now() - (index * 24 * 60 * 60 * 1000)).toISOString(),
    achievement: {
      id: `mock-achievement-${index}`,
      achievement_code: badge.code,
      title: badge.name,
      description: badge.description,
      badge_icon: badge.icon,
      points_reward: 50,
      category: "general"
    }
  }));

  const getNextLevelPoints = (currentLevel: number) => {
    return currentLevel * 100;
  };

  const getCurrentLevelProgress = () => {
    const currentPoints = points;
    const currentLevel = userProfile.level;
    const currentLevelPoints = (currentLevel - 1) * 100;
    const nextLevelPoints = currentLevel * 100;
    const progress = ((currentPoints - currentLevelPoints) / (nextLevelPoints - currentLevelPoints)) * 100;
    return Math.min(100, Math.max(0, progress));
  };

  const getNextMilestone = () => {
    if (points < 100) return { points: 100, name: "Principiante" };
    if (points < 500) return { points: 500, name: "Intermedio" };
    if (points < 1000) return { points: 1000, name: "Experto" };
    return { points: 2000, name: "Maestro" };
  };

const nextMilestone = getNextMilestone();
  const progressToNext = ((points % nextMilestone.points) / nextMilestone.points) * 100;

  const canRedeem = (prizePoints: number) => points >= prizePoints;

  const generateValidationCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleRedeemClick = (prize: typeof PRIZES[0]) => {
    setSelectedPrize(prize);
    setValidationCode(generateValidationCode());
    setShowRedeemModal(true);
  };

  const confirmRedeem = async () => {
    if (!selectedPrize) return;

    try {
      // Subtract points using the gamification context
      subtractPoints(selectedPrize.points);

      // Crear mock de premio canjeado
      const newRedeemedPrize: RedeemedPrize = {
        id: `redeemed-${Date.now()}`,
        prize_id: selectedPrize.id,
        prize_name: selectedPrize.name,
        prize_points: selectedPrize.points,
        validation_code: validationCode,
        redeemed_at: new Date().toISOString(),
        status: 'pending'
      };

      // Agregar a la lista local
      setRedeemedPrizes(prev => {
        const newPrizes = [newRedeemedPrize, ...prev];
        // CORRECCIÓN GLOBAL: Guardar premios en localStorage
        try {
          localStorage.setItem('oa_redeemed_prizes', JSON.stringify(newPrizes));
          console.log('[UNIFICADO_DASHBOARD] Premios guardados en localStorage:', newPrizes.length);
        } catch (error) {
          console.error('Error saving redeemed prizes to localStorage:', error);
        }
        return newPrizes;
      });

      // Close modal
      setShowRedeemModal(false);

      // Show success toast
      toast({
        title: "¡Premio Canjeado!",
        description: `Tu código de validación: ${validationCode}. Guárdalo para reclamar tu premio.`,
        duration: 10000,
      });
      
      // Reset
      setSelectedPrize(null);
      setValidationCode("");
    } catch (error) {
      console.error('Errorredeeming prize:', error);
      toast({
        title: "Error",
        description: "No se pudo canjear el premio. Intenta de nuevo.",
        variant: "destructive"
      });
    }
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = !!user;

  // Componente para mostrar restricciones en tabs que requieren autenticación
  const RestrictionMessage = ({ title, description }: { title: string; description: string }) => (
    <Card className="bg-gradient-to-r from-gray-50 to-blue-50 border-gray-200">
      <CardContent className="p-8">
        <div className="text-center space-y-4">
          <UserX className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="text-xl font-semibold text-gray-700">{title}</h3>
          <p className="text-gray-600">{description}</p>
          <div className="pt-2">
            <Button 
              onClick={signInWithGoogle}
              className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión para Acceder
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  // Componente para usuarios no registrados - Dashboard Público
  const PublicDashboard = () => (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cápsulas Observauto</h1>
          <p className="text-gray-600 mt-1">
            Explora nuestro sistema de aprendizaje gamificado
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Acceso Público
          </Badge>
        </div>
      </div>

      {/* Mensaje de inicio de sesión */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <UserX className="h-12 w-12 text-blue-600 mx-auto" />
            <h2 className="text-xl font-semibold text-gray-900">
              Inicia sesión para ver tu progreso personal
            </h2>
            <p className="text-gray-600">
              Accede con tu cuenta para ver tus puntos, insignias, premios y cápsulas en progreso
            </p>
            <Button 
              onClick={signInWithGoogle}
              className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white hover:from-[#1C3B71]/90 hover:to-[#D70102]/90"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Información pública disponible */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Premios Disponibles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-primary" />
              Premios Disponibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PRIZES.slice(0, 4).map((prize) => (
                <div key={prize.id} className="flex items-center gap-3 p-3 border rounded-lg hover:shadow-md transition-shadow">
                  <img
                    src={prize.image}
                    alt={prize.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{prize.name}</h4>
                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                      {prize.description}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center gap-1 text-primary font-bold text-sm">
                        <Trophy className="h-3 w-3" />
                        <span>{prize.points} pts</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        Stock: {prize.stock}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-xs text-gray-500 text-center">
                +{PRIZES.length - 4} premios más disponibles
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Insignias Posibles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Insignias Posibles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(AVAILABLE_BADGES).slice(0, 8).map((badge) => (
                <div
                  key={badge.code}
                  className="text-center p-3 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-2">{badge.icon}</div>
                  <h4 className="font-medium text-sm mb-1">{badge.name}</h4>
                  <p className="text-xs text-gray-600">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-500 text-center mt-4">
              +{Object.keys(AVAILABLE_BADGES).length - 8} insignias más disponibles
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cómo Ganar Puntos */}
      <Card className="bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            ¿Cómo ganar puntos?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-sm">
                  <strong>10 puntos</strong> por cada sección de cápsula completada
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-sm">
                  <strong>50-100 puntos</strong> por completar el quiz final (según tu calificación)
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-sm">
                  <strong>50 puntos extra</strong> por completar una cápsula completa
                </p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                <p className="text-sm">
                  <strong>Insignias especiales</strong> por logros únicos
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to action final */}
      <Card className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white">
        <CardContent className="p-6">
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold">¡Comienza tu viaje de aprendizaje!</h3>
            <p className="text-blue-100">
              Inicia sesión para acceder a tu panel personal y comenzar a acumular puntos
            </p>
            <Button 
              onClick={signInWithGoogle}
              variant="secondary"
              className="bg-white text-[#1C3B71] hover:bg-blue-50"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Iniciar Sesión con Google
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Si no está autenticado, mostrar dashboard público
  if (!isAuthenticated) {
    return <PublicDashboard />;
  }

  if (false) { // Removido loading state para datos mock
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mi Panel</h1>
          <p className="text-gray-600 mt-1">
            Bienvenido, {user?.name || userProfile.name}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Usuario Registrado
          </Badge>
        </div>
      </div>

      {/* Tabs Principales - Solo para usuarios autenticados */}
      <Tabs defaultValue="resumen" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="premios">Premios</TabsTrigger>
          <TabsTrigger value="insignias">Insignias</TabsTrigger>
          <TabsTrigger value="reclamados">Reclamados</TabsTrigger>
          <TabsTrigger value="capsulas">Cápsulas</TabsTrigger>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
        </TabsList>

        {/* Tab Resumen */}
        <TabsContent value="resumen" className="space-y-6">
          {/* Estadísticas Principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Puntos Totales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{points}</div>
                <p className="text-xs opacity-75 mt-1">
                  Nivel {userProfile.level}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Logros Obtenidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userAchievements.length}</div>
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
                <div className="text-2xl font-bold">{redeemedPrizes.length}</div>
                <p className="text-xs opacity-75 mt-1">
                  Total canjeados
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium opacity-90">Tiempo Total</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(userCapsules.reduce((sum, c) => sum + c.time_spent_minutes, 0) / 60)}h
                </div>
                <p className="text-xs opacity-75 mt-1">
                  Horas de estudio
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progreso del Nivel */}
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
                    Nivel {userProfile.level} → {userProfile.level + 1}
                  </span>
                  <span className="text-sm text-gray-600">
                    {points} / {getNextLevelPoints(userProfile.level)} puntos
                  </span>
                </div>
                <Progress value={getCurrentLevelProgress()} className="h-2" />
                <p className="text-xs text-gray-600">
                  {getNextLevelPoints(userProfile.level) - points} puntos para el siguiente nivel
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Resumen de Progreso */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5" />
                  Próximo Hito
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2 text-sm">
                    <span>Próximo nivel: {nextMilestone.name}</span>
                    <span className="font-semibold">{nextMilestone.points} pts</span>
                  </div>
                  <Progress value={progressToNext} className="h-3" />
                </div>
                <div className="text-center p-3 rounded-lg bg-background/50">
                  <Gift className="h-6 w-6 mx-auto mb-1 text-green-500" />
                  <div className="text-2xl font-bold">
                    {PRIZES.filter(p => canRedeem(p.points)).length}
                  </div>
                  <div className="text-xs text-muted-foreground">Premios Disponibles</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Últimas Insignias
                </CardTitle>
              </CardHeader>
              <CardContent>
                {earnedBadges.length > 0 ? (
                  <div className="space-y-3">
                    {earnedBadges.slice(0, 3).map((badge) => (
                      <div key={badge.code} className="flex items-center gap-3">
                        <div className="text-2xl">{badge.icon}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{badge.name}</p>
                          <p className="text-xs text-gray-600">{badge.description}</p>
                        </div>
                      </div>
                    ))}
                    {earnedBadges.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{earnedBadges.length - 3} insignias más
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-gray-600 text-center py-4">
                    Aún no has obtenido insignias
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab Premios */}
        <TabsContent value="premios" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRIZES.map((prize) => {
              const canRedeemPrize = canRedeem(prize.points);
              const isLowStock = prize.stock <= 5;

              return (
                <Card
                  key={prize.id}
                  className={`overflow-hidden transition-all hover:shadow-lg ${
                    !canRedeemPrize ? "opacity-60" : ""
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
                      onClick={() => handleRedeemClick(prize)}
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

        {/* Tab Insignias */}
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

        {/* Tab Reclamados */}
        <TabsContent value="reclamados" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                Mis Premios Canjeados
              </CardTitle>
            </CardHeader>
            <CardContent>
              {redeemedPrizes.length > 0 ? (
                <div className="space-y-4">
                  {redeemedPrizes.map((prize) => (
                    <div
                      key={prize.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{prize.prize_name}</h4>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm text-gray-600">
                            Canjeado: {new Date(prize.redeemed_at).toLocaleDateString('es-ES')}
                          </p>
                          <p className="text-sm text-blue-600 font-medium">
                            {prize.prize_points} puntos
                          </p>
                          <Badge 
                            variant={
                              prize.status === 'delivered' ? 'default' :
                              prize.status === 'pending' ? 'outline' : 'destructive'
                            }
                          >
                            {prize.status === 'delivered' ? 'Entregado' :
                             prize.status === 'pending' ? 'Pendiente' : 'Cancelado'}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Código:</p>
                        <p className="text-lg font-mono font-bold text-blue-600">
                          {prize.validation_code}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No has canjeado ningún premio aún</p>
                  <p className="text-sm text-gray-500 mt-1">
                    ¡Explora los premios disponibles y canjea tus primeros puntos!
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Cápsulas */}
        <TabsContent value="capsulas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Progreso de Cápsulas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {userCapsules.length > 0 ? (
                <div className="space-y-4">
                  {userCapsules.map((capsule) => (
                    <div
                      key={capsule.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{capsule.capsule_name}</h4>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            capsule.completed_at 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {capsule.completed_at ? 'Completada' : 'En progreso'}
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
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    No hay cápsulas en progreso
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Las cápsulas que inicies y completes aparecerán aquí
                  </p>
                  <p className="text-sm text-gray-500">
                    Aún no has comenzado ninguna cápsula de aprendizaje
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Perfil */}
        <TabsContent value="perfil" className="space-y-4">
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
                    <p className="text-gray-900">{user?.name || userProfile.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">{user?.email || userProfile.email}</p>
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
                  onClick={() => setShowEditProfileModal(true)}
                >
                  <Star className="h-4 w-4 mr-2" />
                  Editar Perfil
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Confirmación de Canje */}
      <Dialog open={showRedeemModal} onOpenChange={setShowRedeemModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Gift className="h-6 w-6 text-primary" />
              Confirmar Canje
            </DialogTitle>
            <DialogDescription>
              Estás a punto de canjear tu premio
            </DialogDescription>
          </DialogHeader>
          
          {selectedPrize && (
            <div className="space-y-4 py-4">
              <div className="flex items-start gap-4">
                <img
                  src={selectedPrize.image}
                  alt={selectedPrize.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h4 className="font-semibold">{selectedPrize.name}</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {selectedPrize.description}
                  </p>
                  <div className="flex items-center gap-1 text-primary font-bold mt-2">
                    <Trophy className="h-4 w-4" />
                    <span>{selectedPrize.points} puntos</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Tu código de validación será:</p>
                <p className="text-2xl font-mono font-bold text-center py-2 bg-background rounded">
                  {validationCode}
                </p>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Llama al <strong>01-800-OBSERVA</strong> con este código para reclamar tu premio
                </p>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-xs text-center">
                  Se descontarán <strong>{selectedPrize.points} puntos</strong> de tu saldo actual ({points} pts)
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowRedeemModal(false);
                setSelectedPrize(null);
                setValidationCode("");
              }}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={confirmRedeem}
              className="flex-1 bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Confirmar Canje
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Edición de Perfil */}
      <EditProfileModal
        open={showEditProfileModal}
        onOpenChange={setShowEditProfileModal}
        profile={userProfile}
        onProfileUpdate={handleProfileUpdate}
      />
    </div>
  );
}