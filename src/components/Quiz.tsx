import React, { useState } from "react";
import { CheckCircle2, XCircle, AlertCircle, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QuizQuestion, QuizResult } from "@/types/capsule";
import { QuizResultModal } from "./QuizResultModal";
import { RegistrationModal } from "./RegistrationModal";
import { useAuth } from "@/context/AuthContext";

interface QuizProps {
  questions: QuizQuestion[];
  onComplete: (result: QuizResult) => void;
  context?: string; // 'capsule' | 'standalone'
}

export const Quiz: React.FC<QuizProps> = ({ questions, onComplete, context = 'standalone' }) => {
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(questions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  
  // Contexto de autenticación
  const { user } = useAuth();

  const handleAnswerChange = (questionIndex: number, optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    // Verificar si el usuario está autenticado
    if (!user) {
      // Usuario no autenticado, mostrar modal de registro
      setShowRegistrationModal(true);
      return;
    }

    // Usuario autenticado, proceder con la lógica normal
    submitQuiz();
  };

  const handleContinueWithoutRegistration = () => {
    // Usuario anónimo completa quiz sin ganar puntos ni badges
    submitQuiz();
  };

  const submitQuiz = () => {
    // Count correct answers
    let correctCount = 0;
    questions.forEach((question, index) => {
      if (answers[index] === question.correctIndex) {
        correctCount++;
      }
    });

    const total = questions.length;
    const scorePercent = Math.round((correctCount / total) * 100);
    const passed = scorePercent >= 70;

    const quizResult: QuizResult = {
      scorePercent,
      correctCount,
      total,
      passed,
      badgesGranted: user && scorePercent === 100 ? ["quiz_master"] : [], // Solo otorga badge si está autenticado
    };

    setResult(quizResult);
    setSubmitted(true);
    
    // Show modal immediately without delay
    setShowResultModal(true);
    onComplete(quizResult);
  };

  const allAnswered = answers.every((answer) => answer !== null);

  const getQuestionStatus = (questionIndex: number): "correct" | "incorrect" | "unanswered" => {
    if (!submitted) return "unanswered";
    const userAnswer = answers[questionIndex];
    const correctAnswer = questions[questionIndex].correctIndex;
    return userAnswer === correctAnswer ? "correct" : "incorrect";
  };

  return (
    <>
      {result && (
        <QuizResultModal
          result={result}
          open={showResultModal}
          onOpenChange={setShowResultModal}
        />
      )}
      
      <div className="space-y-6">
      {!submitted ? (
        <>
          {/* Quiz Instructions */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Responde todas las preguntas y haz clic en "Enviar respuestas" para ver tus resultados.
              Necesitas 70% o más para aprobar.
            </AlertDescription>
          </Alert>

          {/* Questions */}
          {questions.map((question, questionIndex) => (
            <Card key={question.id}>
              <CardHeader>
                <CardTitle className="text-base flex items-start gap-2">
                  <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                    {questionIndex + 1}
                  </span>
                  <span className="flex-1">{question.question}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[questionIndex]?.toString() ?? ""}
                  onValueChange={(value) => handleAnswerChange(questionIndex, parseInt(value))}
                >
                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = answers[questionIndex] === optionIndex;
                      return (
                        <div
                          key={optionIndex}
                          className={`flex items-center space-x-3 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                            isSelected
                              ? "border-primary bg-gradient-to-r from-[#1C3B71]/10 to-[#D70102]/10 scale-[1.02] shadow-md"
                              : "border-border hover:border-primary/50 hover:bg-muted/50"
                          }`}
                        >
                          <RadioGroupItem
                            value={optionIndex.toString()}
                            id={`q${questionIndex}-opt${optionIndex}`}
                          />
                          <Label
                            htmlFor={`q${questionIndex}-opt${optionIndex}`}
                            className={`flex-1 cursor-pointer ${isSelected ? "font-semibold" : ""}`}
                          >
                            {option}
                          </Label>
                        </div>
                      );
                    })}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!allAnswered}
              size="lg"
              className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
            >
              Enviar respuestas
            </Button>
          </div>
        </>
      ) : (
        <>
          {/* Results Summary */}
          <Card className={result?.passed ? "border-green-500" : "border-yellow-500"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {result?.passed ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500" />
                ) : (
                  <AlertCircle className="h-6 w-6 text-yellow-500" />
                )}
                {result?.passed ? "¡Felicitaciones!" : "Resultado"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-center py-4">
                <div className="text-4xl font-bold text-primary mb-2">
                  {result?.scorePercent}%
                </div>
                <p className="text-muted-foreground">
                  {result?.correctCount} de {result?.total} preguntas correctas
                </p>
              </div>
              
              {result?.passed ? (
                <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-200">
                    ¡Has aprobado el quiz! {result.badgesGranted.length > 0 && "Has ganado una insignia."}
                  </AlertDescription>
                </Alert>
              ) : (
                <Alert className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
                  <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                    Necesitas 70% o más para aprobar. Revisa las respuestas incorrectas y vuelve a intentarlo.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Question Review */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Revisión de respuestas</h3>
            {questions.map((question, questionIndex) => {
              const status = getQuestionStatus(questionIndex);
              const userAnswer = answers[questionIndex];

              return (
                <Card
                  key={question.id}
                  className={
                    status === "correct"
                      ? "border-green-500/50"
                      : "border-red-500/50"
                  }
                >
                  <CardHeader>
                    <CardTitle className="text-base flex items-start gap-2">
                      {status === "correct" ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className="flex-1">{question.question}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isCorrect = optionIndex === question.correctIndex;
                        const isUserAnswer = optionIndex === userAnswer;

                        return (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              isCorrect
                                ? "bg-green-50 dark:bg-green-950 border-green-500"
                                : isUserAnswer
                                ? "bg-red-50 dark:bg-red-950 border-red-500"
                                : "bg-muted/30"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrect && (
                                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                              )}
                              {isUserAnswer && !isCorrect && (
                                <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                              )}
                              <span className={isCorrect || isUserAnswer ? "font-medium" : ""}>
                                {option}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <Alert>
                      <AlertDescription className="text-sm">
                        <strong>Explicación:</strong> {question.explanation}
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      )}
      </div>
      
      {/* Modal de registro para usuarios no autenticados */}
      <RegistrationModal
        open={showRegistrationModal}
        onOpenChange={setShowRegistrationModal}
        onContinue={handleContinueWithoutRegistration}
        context="quiz"
      />
    </>
  );
};
