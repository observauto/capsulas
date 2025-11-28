import React, { useState, useEffect, useRef } from "react";
import { CheckCircle2, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FullCapsule, Section, QuizResult } from "@/types/capsule";
import { Quiz } from "./Quiz";
import { markSectionCompleted, getCapsuleProgress } from "@/lib/capsulesRepo";
import { useGamification } from "@/context/GamificationContext";
import { toast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface ArticleModeProps {
    capsule: FullCapsule;
    onComplete: () => void;
}

export const ArticleMode: React.FC<ArticleModeProps> = ({ capsule, onComplete }) => {
    const { awardCapsulePoints, grantBadge, grantBadges } = useGamification();
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeSection, setActiveSection] = useState<string | null>(null);
    const [completedSteps, setCompletedSteps] = useState<string[]>([]);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [indexOpen, setIndexOpen] = useState(false);
    const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
    const quizRef = useRef<HTMLDivElement | null>(null);
    const processedSectionsRef = useRef<Set<string>>(new Set()); // Track processed sections to avoid race conditions

    // Load progress on mount
    useEffect(() => {
        const progress = getCapsuleProgress(capsule.slug);
        setCompletedSteps(progress.completedSections);
        // Initialize processed ref with loaded progress
        processedSectionsRef.current = new Set(progress.completedSections);
        setQuizCompleted(progress.quizCompleted);
    }, [capsule.slug]);

    // Track scroll progress
    useEffect(() => {
        const handleScroll = () => {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const scrollable = documentHeight - windowHeight;
            const progress = (scrollTop / scrollable) * 100;
            setScrollProgress(Math.min(progress, 100));

            // Determine active section based on scroll position
            let currentSection: string | null = null;
            for (const section of capsule.sections) {
                const element = sectionRefs.current[section.id];
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        currentSection = section.id;

                        // Mark as completed if visible and not already completed
                        const safeCompletedSteps = Array.isArray(completedSteps) ? completedSteps : [];

                        // Check both state and ref to prevent race conditions
                        if (!safeCompletedSteps.includes(section.id) && !processedSectionsRef.current.has(section.id)) {
                            // Mark immediately in ref
                            processedSectionsRef.current.add(section.id);

                            markSectionCompleted(capsule.slug, section.id);
                            setCompletedSteps(prev => [...prev, section.id]);
                            // Usar ID único para la sección para evitar conflictos con el quiz principal
                            awardCapsulePoints(`${capsule.slug}_section_${section.id}`, 10);
                        }
                    }
                }
            }

            // Check if quiz is visible
            if (capsule.quiz && quizRef.current) {
                const rect = quizRef.current.getBoundingClientRect();
                if (rect.top <= 150) {
                    currentSection = "quiz";
                }
            }

            setActiveSection(currentSection);
        };

        window.addEventListener("scroll", handleScroll);
        handleScroll(); // Initial check

        return () => window.removeEventListener("scroll", handleScroll);
    }, [awardCapsulePoints, capsule.quiz, capsule.sections, capsule.slug, completedSteps]);

    const scrollToSection = (sectionId: string) => {
        if (sectionId === "quiz") {
            quizRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
            sectionRefs.current[sectionId]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }
        setIndexOpen(false);
    };

    const handleQuizComplete = async (result: QuizResult) => {
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
        grantBadge("thorough_reader");

        // 🎉 Celebración visual
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#1C3B71', '#D70102', '#FFD700']
        });
    };

    const renderSectionContent = (section: Section) => {
        return (
            <div
                key={section.id}
                id={`section-${section.id}`}
                ref={(el) => (sectionRefs.current[section.id] = el)}
                className="scroll-mt-24"
            >
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="text-2xl flex items-center gap-3">
                            {completedSteps.includes(section.id) && (
                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                            )}
                            <span>{section.title}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
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
            </div>
        );
    };

    const FloatingIndex = () => (
        <div className="space-y-2">
            <h3 className="font-semibold text-sm mb-3">Contenido</h3>
            <div className="space-y-1">
                {capsule.sections.map((section, index) => (
                    <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === section.id
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {completedSteps.includes(section.id) && (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            )}
                            <span className="flex-1 line-clamp-2">
                                {index + 1}. {section.title}
                            </span>
                        </div>
                    </button>
                ))}
                {capsule.quiz && (
                    <button
                        onClick={() => scrollToSection("quiz")}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${activeSection === "quiz"
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted"
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            {quizCompleted && (
                                <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                            )}
                            <span className="flex-1">
                                {capsule.sections.length + 1}. Quiz Final
                            </span>
                        </div>
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="relative">
            {/* Fixed Progress Bar */}
            <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b">
                <Progress value={scrollProgress} className="h-1 rounded-none" />
            </div>

            {/* Mobile Index Button */}
            <div className="lg:hidden fixed bottom-4 left-4 z-40">
                <Sheet open={indexOpen} onOpenChange={setIndexOpen}>
                    <SheetTrigger asChild>
                        <Button size="icon" className="rounded-full shadow-lg">
                            {indexOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80">
                        <div className="mt-6">
                            <FloatingIndex />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex gap-6">
                {/* Desktop Floating Index */}
                <aside className="hidden lg:block w-64 flex-shrink-0">
                    <div className="sticky top-20 bg-card border rounded-lg p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
                        <FloatingIndex />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 max-w-4xl">
                    <div className="pt-8">
                        {capsule.sections.map(renderSectionContent)}

                        {/* Quiz Section */}
                        {capsule.quiz && (
                            <div
                                ref={quizRef}
                                id="quiz-section"
                                className="scroll-mt-24 mb-8"
                            >
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-2xl flex items-center gap-3">
                                            {quizCompleted && (
                                                <CheckCircle2 className="h-6 w-6 text-green-500 flex-shrink-0" />
                                            )}
                                            <span>Quiz Final</span>
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Quiz questions={capsule.quiz} onComplete={handleQuizComplete} isCompleted={quizCompleted} />
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Completion Button - Solo redirige, no otorga puntos extra */}
                        {quizCompleted && (
                            <div className="flex justify-center pb-8">
                                <Button
                                    onClick={onComplete}
                                    size="lg"
                                    className="bg-gradient-to-r from-[#1C3B71] to-[#D70102] text-white"
                                >
                                    <CheckCircle2 className="h-5 w-5 mr-2" />
                                    Volver al Inicio
                                </Button>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};
