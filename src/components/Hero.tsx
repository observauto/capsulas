import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface HeroProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const Hero = ({ searchQuery, onSearchChange }: HeroProps) => {
  return (
    <section className="relative hero-stripes max-w-6xl mx-auto mt-2 rounded-3xl bg-[#F7F9FF]/90 backdrop-blur border border-border/50 p-8 text-center overflow-hidden">
      <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
        Cápsulas Observauto
      </h1>
      <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
        Micro-lecciones para agudizar tu percepción del mundo automotor.
      </p>
      
      <div className="mt-4 max-w-md mx-auto hidden sm:block">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar cápsulas..."
            className="pl-10"
          />
        </div>
      </div>
    </section>
  );
};
