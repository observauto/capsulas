import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FullCapsule, Section, QuizResult } from "@/types/capsule";
import { Quiz } from "./Quiz";
import { markSectionCompleted, getCapsuleProgress, submitQuiz } from "@/lib/capsulesRepo";
import { useGamification } from "@/context/GamificationContext";
import { toast } from "@/hooks/use-toast";

interface WizardModeProps {
  capsule: FullCapsule;
  onComplete: () => void;
}

export const WizardMode: React.FC<WizardModeProps> = ({ capsule, onComplete }) => {
  const { awardCapsulePoints, grantBadge, grantBadges } = useGamification();
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Load progress on mount
  useEffect(() => {
    const progress = getCapsuleProgress(capsule.slug);
    setCompletedSteps(progress.completedSections);
    setQuizCompleted(progress.quizCompleted);
  }, [capsule.slug]);

  // Filter out quiz intro sections to show them separately
  const contentSections = capsule.sections.filter(s => s.type !== 'quizIntro');
  const quizIntroSection = capsule.sections.find(s => s.type === 'quizIntro');

  const totalSteps = contentSections.length + (capsule.quiz ? 1 : 0);
  const isLastSection = currentStep === contentSections.length - 1;
  const isQuizStep = currentStep === contentSections.length;

  const currentSection: Section | null = currentStep < contentSections.length
    ? contentSections[currentStep]
    : null;

  const progressPercent = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    // Mark current section as completed
    const safeCompletedSteps = Array.isArray(completedSteps) ? completedSteps : [];
    if (currentSection && !safeCompletedSteps.includes(currentSection.id)) {
      markSectionCompleted(capsule.slug, currentSection.id);
      setCompletedSteps([...safeCompletedSteps, currentSection.id]);

      setCompletedSteps([...safeCompletedSteps, currentSection.id]);

      // Award points for completing section (unique ID per section)
      awardCapsulePoints(`${capsule.slug}_section_${currentSection.id}`, 10);
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleQuizComplete = async (result: QuizResult) => {
    // IMPORTANTE: Guardar el resultado del quiz en capsul esRepo
    const answers = Array(capsule.quiz?.length || 0).fill(0); // Mock answers, no importa para guardar
    submitQuiz(capsule.slug, answers); // Esto guardará quizCompleted=true y marcará como completada si tienen todas las secciones

    setQuizCompleted(true);

    // Award points based on score + bonus
    const totalPoints = result.scorePercent + 50;

    const { success, message } = await awardCapsulePoints(capsule.slug, totalPoints);
    if (!success && message) {
      toast({
        title: "Límite de puntos alcanzado",
        description: message,
      });
    } else if (success) {
      toast({
        title: "¡Cápsula Completada!",
        description: `Has ganado ${totalPoints} puntos.`,
      });
    }

    // Grant badges
    if (result.badgesGranted.length > 0) {
      grantBadges(result.badgesGranted);
    }

    // Grant completion badges
    grantBadge("first_capsule");
    grantBadge("quick_learner");
  };

  const renderSectionContent = (section: Section) => {
    return (
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-xl md:text-2xl">{section.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {section.content}
            </p>
          </div>

          {section.tips && section.tips.length > 0 && (
            <div className="mt-6 space-y-2">
              {section.tips.map((tip, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10"
                >
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{tip}</p>
                </div>
              ))}
            </div>
          )}

          {section.mediaUrl && (
            <div className="mt-6">
              <img
                src={section.mediaUrl}
                alt={section.title}
                className="w-full rounded-lg"
              />
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="sticky top-20 z-10 bg-background/95 backdrop-blur-sm border-b pb-3 -mx-4 px-4 pt-3">
        <div className="space-y-2">
          <Progress value={progressPercent} className="h-2" />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Paso {currentStep + 1} de {totalSteps}</span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="min-h-[300px] py-4">
        {currentSection ? (
          renderSectionContent(currentSection)
        ) : isQuizStep && capsule.quiz ? (
          <div>
            {quizIntroSection && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-xl md:text-2xl">{quizIntroSection.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    {quizIntroSection.content}
                  </p>
                </CardContent>
              </Card>
            )}
            <Quiz questions={capsule.quiz} onComplete={handleQuizComplete} />
          </div>
        ) : null}
      </div>

      {/* Navigation */}
      <div className="sticky bottom-0 bg-background/95 backdrop-blur-sm border-t pt-3 -mx-4 px-4 pb-3">
        <div className="flex items-center justify-between gap-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentStep === 0}
            size="sm"
            className="shrink-0"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Anterior</span>
          </Button>

          {!isQuizStep ? (
            <Button
              onClick={handleNext}
              size="sm"
              className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white shrink-0"
            >
              <span className="hidden sm:inline">{isLastSection && capsule.quiz ? "Ir al Quiz" : "Siguiente"}</span>
              <span className="sm:hidden">Sig.</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : quizCompleted ? (
            <Button
              onClick={onComplete}
              size="sm"
              className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white shrink-0"
            >
              <span className="hidden sm:inline">Completar</span>
              <CheckCircle2 className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <div className="w-20 shrink-0" />
          )}
        </div>
      </div>
    </div>
  );
};
