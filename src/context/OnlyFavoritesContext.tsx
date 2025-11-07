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
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('capsule_slug')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error loading favorites:', error);
        // Fallback to empty state on error
        setFavorites([]);
        return;
      }

      const favoriteSlugs = data.map(item => item.capsule_slug);
      setFavorites(favoriteSlugs);
      console.log('Favorites loaded from Supabase:', favoriteSlugs.length, 'items');
    } catch (error) {
      console.error('Error loading favorites:', error);
      // Fallback to empty state on network error
      setFavorites([]);
      toast({
        title: "Error de conexión",
        description: "No se pudieron cargar los favoritos. Verifica tu conexión a internet.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter toggle function
  const toggleOnlyFavorites = () => {
    setOnlyFavorites((prev) => !prev);
  };

  // Favorites management functions
  const toggleFavorite = async (capsuleSlug: string) => {
    // Check if user is logged in
    if (!user) {
      toast({
        title: "Inicio de sesión requerido",
        description: "Debes iniciar sesión para guardar favoritos.",
        variant: "destructive"
      });
      return;
    }

    try {
      const isCurrentlyFavorite = favorites.includes(capsuleSlug);

      if (isCurrentlyFavorite) {
        // Remove from favorites
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('capsule_slug', capsuleSlug);

        if (error) {
          console.error('Error removing favorite:', error);
          toast({
            title: "Error",
            description: "No se pudo eliminar el favorito. Intenta nuevamente.",
            variant: "destructive"
          });
          return;
        }

        // Update local state
        setFavorites(prev => prev.filter(slug => slug !== capsuleSlug));
        toast({
          title: "Favorito eliminado",
          description: "Se ha eliminado de tus favoritos.",
          variant: "default"
        });
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            capsule_slug: capsuleSlug
          });

        if (error) {
          console.error('Error adding favorite:', error);
          // Check if it's a duplicate error (unique constraint)
          if (error.code === '23505') {
            // The item is already a favorite, just update local state
            setFavorites(prev => [...prev, capsuleSlug]);
          } else {
            toast({
              title: "Error",
              description: "No se pudo guardar el favorito. Intenta nuevamente.",
              variant: "destructive"
            });
          }
          return;
        }

        // Update local state
        setFavorites(prev => [...prev, capsuleSlug]);
        toast({
          title: "Favorito guardado",
          description: "Se ha añadido a tus favoritos.",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error de conexión",
        description: "No se pudo procesar la acción. Verifica tu conexión a internet.",
        variant: "destructive"
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