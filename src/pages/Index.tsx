import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  BookOpenCheck,
  Monitor,
  FileText,
  Droplet,
  GaugeCircle,
  Car,
  Wrench,
  Info,
  AlertTriangle,
  Zap,
  Globe2,
  Compass,
  CalendarCheck,
  BatteryCharging,
  Truck,
  Fuel,
  LucideIcon,
} from "lucide-react";
import { CapsuleCard } from "@/components/CapsuleCard";
import { CapsuleModal } from "@/components/CapsuleModal";
import { Hero } from "@/components/Hero";
import { UnifiedFooter } from "@/components/UnifiedFooter";
import { AdSlot } from "@/components/AdSlot";
import { SubscriptionForm } from "@/components/SubscriptionForm";
import { Sponsor, FullCapsule } from "@/types/capsule";
import { Toaster } from "@/components/ui/toaster";
import { listFullCapsules, isCapsuleCompleted, getCapsuleProgress } from "@/lib/capsulesRepo";
import { useOnlyFavorites } from "@/context/OnlyFavoritesContext";

// Icon mapping para los slugs de fullCapsules
const SLUG_TO_ICON: Record<string, LucideIcon> = {
  'camion-flota-empresarial': Truck,
  'gas-natural-vehicular': Fuel,
  'identifica-modelos-automotrices': Car,
  'mecanica-basica-automotriz': Wrench,
  'seguridad-vial-consejos': AlertTriangle,
  'metodos-financiacion': FileText, // Using FileText as proxy for financial content
};

// Demo sponsors - easily extendable
const SPONSORS: Sponsor[] = [
  {
    name: "BYD",
    logoUrl: "/BYD-Logo-White-PNG.png",
    link: "https://www.byd.com",
    accentColor: "#00447c",
  },
  {
    name: "DFAC",
    logoUrl: "https://placehold.co/200x80/1C3B71/FFFFFF?text=DFAC",
    link: "https://www.dfac.com",
    accentColor: "#1C3B71",
  },
  {
    name: "VANTI",
    logoUrl: "https://placehold.co/200x80/D70102/FFFFFF?text=VANTI",
    link: "https://www.vanti.com.co",
    accentColor: "#D70102",
  },
];

const IndexPage = () => {
  const navigate = useNavigate();
  const {
    favorites,
    toggleFavorite,
    isFavorite,
    onlyFavorites,
    toggleOnlyFavorites
  } = useOnlyFavorites();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCapsule, setSelectedCapsule] = useState<FullCapsule | null>(null);
  const [loadTimestamp] = useState(new Date().toLocaleString("es-CO", {
    dateStyle: "long",
    timeStyle: "short",
  }));

  // 🎮 Usar fullCapsules para contenido completo
  const fullCapsules = listFullCapsules();

  // Filter capsules based on search query only (favorites filter is only in Dashboard)
  const filteredCapsules = useMemo(() => {
    let filtered = fullCapsules;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(capsule =>
        capsule.title.toLowerCase().includes(query) ||
        capsule.summary.toLowerCase().includes(query) ||
        capsule.slug.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [fullCapsules, searchQuery, onlyFavorites, isFavorite]);

  // Handle capsule exploration - navigate to full capsule page
  const handleExploreCapsule = (capsule: FullCapsule) => {
    navigate(`/capsulas/${capsule.slug}`);
  };

  const getCompletionStatus = (capsuleSlug: string): boolean => {
    return isCapsuleCompleted(capsuleSlug);
  };

  const getInProgressStatus = (capsuleSlug: string): boolean => {
    const progress = getCapsuleProgress(capsuleSlug);
    const isCompleted = isCapsuleCompleted(capsuleSlug);
    if (isCompleted) return false;
    return progress.completedSections.length > 0 || progress.quizCompleted;
  };

  // Create grid items with ads interspersed
  const gridItems = useMemo(() => {
    const items: Array<{
      type: "capsule" | "ad";
      data?: FullCapsule;
      id: string;
    }> = [];

    // Add capsules with ad slots
    filteredCapsules.forEach((capsule, index) => {
      items.push({
        type: "capsule",
        data: capsule,
        id: capsule.slug,
      });

      // Add ad after every 3rd capsule (and not after the last one)
      if ((index + 1) % 3 === 0 && index !== filteredCapsules.length - 1) {
        items.push({
          type: "ad",
          id: `ad-slot-${Math.floor(index / 3) + 1}`,
        });
      }
    });

    return items;
  }, [filteredCapsules]);

  return (
    <div className="min-h-screen hero-bg">
      <Hero searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main className="max-w-6xl mx-auto px-4 grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {gridItems.map((item) => {
          if (item.type === "ad") {
            return (
              <div key={item.id} className="sm:col-span-2 lg:col-span-3">
                <AdSlot slotId={item.id} />
              </div>
            );
          }

          const capsule = item.data!;
          const IconComponent = SLUG_TO_ICON[capsule.slug] || BookOpenCheck;

          return (
            <CapsuleCard
              key={capsule.slug}
              icon={IconComponent}
              title={capsule.title}
              description={capsule.summary}
              onExplore={() => handleExploreCapsule(capsule)}
              isFavorite={isFavorite(capsule.slug)}
              onToggleFavorite={() => toggleFavorite(capsule.slug)}
              isCompleted={getCompletionStatus(capsule.slug)}
              isInProgress={getInProgressStatus(capsule.slug)}
            />
          );
        })}
      </main>

      {/* Subscription Form */}
      <div className="max-w-6xl mx-auto px-4 py-10">
        <SubscriptionForm />
      </div>

      <UnifiedFooter lastLoadTimestamp={loadTimestamp} />

      <Toaster />
    </div>
  );
};

export default IndexPage;