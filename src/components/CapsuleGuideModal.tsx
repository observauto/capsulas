"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { BookOpen, Navigation, Layout, Trophy, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react"

interface CapsuleGuideModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const guideSteps = [
  {
    icon: BookOpen,
    title: "Bienvenido a las Cápsulas de Aprendizaje",
    description:
      "Las cápsulas son unidades de contenido educativo diseñadas para que aprendas sobre vehículos de forma interactiva y efectiva.",
    content: [
      "Cada cápsula contiene información detallada sobre un tema específico",
      "El contenido está organizado en secciones fáciles de seguir",
      "Puedes avanzar a tu propio ritmo y revisar el contenido cuando quieras",
    ],
  },
  {
    icon: Navigation,
    title: "Navegación Intuitiva",
    description: "Navega por el contenido de forma sencilla usando el índice flotante y los controles de navegación.",
    content: [
      "Usa el índice lateral para saltar entre secciones",
      "Las secciones completadas se marcan automáticamente",
      "Puedes volver atrás en cualquier momento para repasar",
    ],
  },
  {
    icon: Layout,
    title: "Dos Modos de Visualización",
    description: "Elige el modo que mejor se adapte a tu estilo de aprendizaje.",
    content: [
      "Modo Artículo: Lee todo el contenido de forma continua",
      "Modo Wizard: Avanza paso a paso con navegación guiada",
      "Cambia entre modos en cualquier momento",
    ],
  },
  {
    icon: Trophy,
    title: "Progreso y Gamificación",
    description: "Gana puntos y desbloquea logros mientras aprendes.",
    content: [
      "Completa secciones para ganar puntos de experiencia",
      "Desbloquea logros especiales al completar cápsulas",
      "Sube de nivel y compite en la tabla de clasificación",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Quiz Final",
    description: "Demuestra lo que has aprendido con un quiz al final de cada cápsula.",
    content: [
      "Responde preguntas sobre el contenido de la cápsula",
      "Obtén retroalimentación inmediata sobre tus respuestas",
      "Completa el quiz para marcar la cápsula como finalizada",
    ],
  },
]

export function CapsuleGuideModal({ open, onOpenChange }: CapsuleGuideModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [dontShowAgain, setDontShowAgain] = useState(false)

  const handleNext = () => {
    if (currentStep < guideSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleFinish = () => {
    if (dontShowAgain) {
      localStorage.setItem("capsule-guide-seen", "true")
    }
    onOpenChange(false)
    setCurrentStep(0)
  }

  const currentStepData = guideSteps[currentStep]
  const Icon = currentStepData.icon

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Guía de Uso</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress indicators */}
          <div className="flex justify-center gap-2">
            {guideSteps.map((_, index) => (
              <div
                key={index}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep ? "w-8 bg-primary" : index < currentStep ? "w-2 bg-primary/50" : "w-2 bg-muted"
                }`}
              />
            ))}
          </div>

          {/* Step content */}
          <div className="space-y-4 min-h-[300px]">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">{currentStepData.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Paso {currentStep + 1} de {guideSteps.length}
                </p>
              </div>
            </div>

            <p className="text-base leading-relaxed">{currentStepData.description}</p>

            <ul className="space-y-2">
              {currentStepData.content.map((item, index) => (
                <li key={index} className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Don't show again checkbox */}
          {currentStep === guideSteps.length - 1 && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id="dont-show"
                checked={dontShowAgain}
                onCheckedChange={(checked) => setDontShowAgain(checked as boolean)}
              />
              <label
                htmlFor="dont-show"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                No mostrar esta guía de nuevo
              </label>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between pt-4 border-t">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>

            {currentStep < guideSteps.length - 1 ? (
              <Button onClick={handleNext}>
                Siguiente
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button onClick={handleFinish}>
                Comenzar
                <CheckCircle2 className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}