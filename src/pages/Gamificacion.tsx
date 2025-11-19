import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Award, Star, Gift, Flame, ArrowLeft, CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AVAILABLE_BADGES } from "@/lib/gamification";
import { Footer } from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { useGamification } from "@/context/GamificationContext";

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

export default function Gamificacion() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { points, badges, subtractPoints, reset } = useGamification();
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedPrize, setSelectedPrize] = useState<typeof PRIZES[0] | null>(null);
  const [validationCode, setValidationCode] = useState("");
  const [loadTimestamp] = useState(new Date().toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  }));
  const [showResetTools, setShowResetTools] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("resetPoints") === "1" || params.get("reset") === "points") {
      setShowResetTools(true);
    }
  }, []);

  const earnedBadges = useMemo(() => {
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

  const generateValidationCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  const handleRedeemClick = (prize: typeof PRIZES[0]) => {
    setSelectedPrize(prize);
    setValidationCode(generateValidationCode());
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (!selectedPrize) return;

    // Subtract points
    subtractPoints(selectedPrize.points);

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

  const handleResetPoints = async () => {
    await reset();
    toast({
      title: "Progreso reiniciado",
      description: "Tus puntos e insignias locales se restablecieron para esta demostración.",
    });
  };

  return (
    <div className="min-h-screen hero-bg">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver a cápsulas
        </Button>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-10 w-10 text-yellow-500" />
            <h1 className="text-4xl md:text-5xl font-bold">Premios y Gamificación</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Completa cápsulas, gana puntos y canjea increíbles premios de nuestros patrocinadores
          </p>
        </div>

        {/* Points Summary Card */}
        <Card className="mb-8 bg-gradient-to-br from-primary/10 via-background to-destructive/10 border-2">
          <CardHeader>
            <CardTitle className="flex items-center justify-between flex-wrap gap-4">
              <span className="flex items-center gap-2">
                <Flame className="h-6 w-6 text-orange-500" />
                Tu Progreso
              </span>
              <div className="text-4xl font-bold text-primary">
                {points} pts
              </div>
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center p-3 rounded-lg bg-background/50">
                <Award className="h-6 w-6 mx-auto mb-1 text-primary" />
                <div className="text-2xl font-bold">{earnedBadges.length}</div>
                <div className="text-xs text-muted-foreground">Insignias</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <Star className="h-6 w-6 mx-auto mb-1 text-yellow-500" />
                <div className="text-2xl font-bold">{Math.floor(points / 100)}</div>
                <div className="text-xs text-muted-foreground">Nivel</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <Gift className="h-6 w-6 mx-auto mb-1 text-green-500" />
                <div className="text-2xl font-bold">{PRIZES.filter(p => canRedeem(p.points)).length}</div>
                <div className="text-xs text-muted-foreground">Disponibles</div>
              </div>
              <div className="text-center p-3 rounded-lg bg-background/50">
                <Trophy className="h-6 w-6 mx-auto mb-1 text-purple-500" />
                <div className="text-2xl font-bold">0</div>
                <div className="text-xs text-muted-foreground">Canjeados</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {showResetTools && (
          <Card className="mb-8 border-dashed border-primary/40 bg-primary/5">
            <CardHeader>
              <CardTitle className="text-sm font-semibold flex items-center justify-between gap-3">
                <span>Herramienta de demo</span>
                <Badge variant="outline" className="uppercase tracking-wide text-[10px]">Solo local</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                Usa este botón para reiniciar los puntos y las insignias guardados en este navegador. Ideal para mostrar el
                recorrido completo desde cero.
              </p>
              <Button variant="destructive" onClick={handleResetPoints} className="w-full sm:w-auto">
                Reiniciar puntos locales
              </Button>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="prizes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
            <TabsTrigger value="prizes">Premios</TabsTrigger>
            <TabsTrigger value="badges">Insignias</TabsTrigger>
          </TabsList>

          {/* Prizes Tab */}
          <TabsContent value="prizes" className="space-y-6">
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

            {/* Information Card */}
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

          {/* Badges Tab */}
          <TabsContent value="badges" className="space-y-6">
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
        </Tabs>
      </div>

      {/* Redeem Modal */}
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

      <Footer lastLoadTimestamp={loadTimestamp} />
    </div>
  );
}
