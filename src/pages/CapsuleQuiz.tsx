import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { getFullCapsuleBySlug } from "@/lib/capsulesRepo";
import { Quiz } from "@/components/Quiz";
import { QuizResult } from "@/types/capsule";
import { useGamification } from "@/context/GamificationContext";
import { recordQuizLite, getCapsuleProgressLite } from "@/lib/capsuleProgress";
import { Button } from "@/components/ui/button";

const CapsuleQuiz: React.FC = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [passed, setPassed] = useState<boolean | null>(null);
  const capsule = slug ? getFullCapsuleBySlug(slug) : null;
  const { addPoints, grantBadge, grantBadges } = useGamification();

  useEffect(() => {
    if (!capsule || !capsule.quiz) setNotFound(true);
    setLoading(false);
  }, [capsule]);

  const handleComplete = (result: QuizResult) => {
    // Otorgar puntos: porcentaje + bonus si aprueba
    addPoints(result.scorePercent);
    if (result.passed) addPoints(10);
    if (result.badgesGranted.length > 0) {
      grantBadges(result.badgesGranted);
    }
    if (slug) recordQuizLite(slug, { scorePercent: result.scorePercent, passed: result.passed });
    setSubmitted(true);
    setPassed(result.passed);
    if (result.passed) grantBadge("quiz_first_pass");
  };

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-12 flex items-center gap-3 text-sm text-muted-foreground">
      <Loader2 className="h-5 w-5 animate-spin" />Cargando quiz...
    </div>
  );

  if (notFound || !capsule?.quiz) return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6">
      <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
        <ArrowLeft className="h-4 w-4" />Volver
      </Button>
      <p className="text-sm text-muted-foreground">Quiz no disponible para esta cápsula.</p>
    </div>
  );

  const progress = getCapsuleProgressLite(capsule.slug);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/capsulas/${capsule.slug}`)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />Volver
          </Button>
          <h1 className="text-xl font-semibold tracking-tight">Quiz: {capsule.title}</h1>
        </div>
        {progress.quizBestScore !== undefined && (
          <div className="text-xs text-muted-foreground">
            Mejor puntaje: {progress.quizBestScore}% {progress.quizPassed && "• Aprobado"}
          </div>
        )}
      </div>

      <Quiz questions={capsule.quiz} onComplete={handleComplete} />

      {submitted && (
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to={`/capsulas/${capsule.slug}`}> 
            <Button variant="outline">Volver a la cápsula</Button>
          </Link>
          {passed === false && (
            <Button onClick={() => window.location.reload()} variant="default">
              Reintentar Quiz
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
export default CapsuleQuiz;