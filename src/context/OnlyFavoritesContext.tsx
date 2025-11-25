import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { toast } from "@/hooks/use-toast";

interface OnlyFavoritesContextType {
  // Filter functionality
  onlyFavorites: boolean;
  toggleOnlyFavorites: () => void;

  // Favorites management
  favorites: string[];
  toggleFavorite: (capsuleSlug: string) => void;
  isFavorite: (capsuleSlug: string) => boolean;
  favoritesCount: number;
  loading: boolean;
}

const OnlyFavoritesContext = createContext<OnlyFavoritesContextType | undefined>(undefined);

interface OnlyFavoritesProviderProps {
  children: ReactNode;
}

export const OnlyFavoritesProvider: React.FC<OnlyFavoritesProviderProps> = ({ children }) => {
  // Filter state
  const [onlyFavorites, setOnlyFavorites] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    try {
      return JSON.parse(localStorage.getItem("capsule_onlyFavs") || "false");
    } catch {
      return false;
    }
  });

  // Favorites management
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Save filter preference to localStorage (this can remain local as it's just UI preference)
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("capsule_onlyFavs", JSON.stringify(onlyFavorites));
    }
  }, [onlyFavorites]);

  // Load favorites from Supabase when user changes
  useEffect(() => {
    if (user) {
      loadFavoritesFromSupabase();
    } else {
      // Clear favorites when user logs out
      setFavorites([]);
    }
  }, [user]);

  // Load favorites from Supabase
  const loadFavoritesFromSupabase = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('user_favorites')
        .select('capsule_slug')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        setFavorites(data.map(item => item.capsule_slug));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar tus favoritos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter toggle function
  const toggleOnlyFavorites = () => {
    setOnlyFavorites((prev) => !prev);
  };

  // Toggle favorite
  const toggleFavorite = async (capsuleSlug: string) => {
    if (!user) {
      toast({
        title: "Inicia sesión",
        description: "Debes iniciar sesión para guardar favoritos",
      });
      return;
    }

    const isFav = favorites.includes(capsuleSlug);

    // Optimistic update
    const newFavorites = isFav
      ? favorites.filter(slug => slug !== capsuleSlug)
      : [...favorites, capsuleSlug];

    setFavorites(newFavorites);

    try {
      if (isFav) {
        // Remove
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('capsule_slug', capsuleSlug);

        if (error) throw error;
      } else {
        // Add
        const { error } = await supabase
          .from('user_favorites')
          .insert([
            { user_id: user.id, capsule_slug: capsuleSlug }
          ]);

        if (error) throw error;
      }

      toast({
        title: isFav ? "Eliminado de favoritos" : "Guardado en favoritos",
        description: isFav
          ? "La cápsula se ha eliminado de tus favoritos"
          : "La cápsula se ha guardado en tus favoritos",
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert optimistic update
      setFavorites(favorites);
      toast({
        title: "Error",
        description: "No se pudo guardar, intente de nuevo",
        variant: "destructive",
      });
    }
  };

  const isFavorite = (capsuleSlug: string): boolean => {
    return favorites.includes(capsuleSlug);
  };

  const favoritesCount = favorites.length;

  return (
    <OnlyFavoritesContext.Provider value={{
      onlyFavorites,
      toggleOnlyFavorites,
      favorites,
      toggleFavorite,
      isFavorite,
      favoritesCount,
      loading
    }}>
      {children}
    </OnlyFavoritesContext.Provider>
  );
};

export const useOnlyFavorites = (): OnlyFavoritesContextType => {
  const context = useContext(OnlyFavoritesContext);
  if (context === undefined) {
    throw new Error("useOnlyFavorites must be used within an OnlyFavoritesProvider");
  }
  return context;
};