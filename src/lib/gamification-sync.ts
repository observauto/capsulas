import { supabase } from './supabase';
import { KEY_POINTS, KEY_BADGES } from '@/context/GamificationContext';

export interface LocalGamificationData {
  points: number;
  badges: string[];
}

/**
 * Obtiene datos de gamificación desde localStorage
 */
export function getLocalGamificationData(): LocalGamificationData {
  try {
    const pointsStr = localStorage.getItem(KEY_POINTS);
    const badgesStr = localStorage.getItem(KEY_BADGES);
    
    console.log('[EMERGENCY] localStorage raw:', { pointsStr, badgesStr });
    
    const points = pointsStr ? Number(pointsStr) : 0;
    const badges = badgesStr ? JSON.parse(badgesStr) : [];
    
    return {
      points: Number.isFinite(points) ? points : 0,
      badges: Array.isArray(badges) ? badges : []
    };
  } catch (error) {
    console.error('[EMERGENCY] Error reading localStorage:', error);
    return { points: 0, badges: [] };
  }
}

/**
 * FUNCIÓN DE EMERGENCIA - Resetear puntos problemáticos
 * Solo usar si hay acumulación masiva de puntos por bugs
 */
export async function emergencyResetPoints(userId: string): Promise<{
  success: boolean;
  finalPoints: number;
  error?: string;
}> {
  console.log('[EMERGENCY] ¡INICIANDO RESET DE EMERGENCIA!');
  console.log('[EMERGENCY] User ID:', userId);

  try {
    // Resetear puntos a un valor razonable (ej: 500 puntos)
    const resetValue = 500;
    const newLevel = Math.floor(resetValue / 100) + 1;

    console.log('[EMERGENCY] Reseteando a:', resetValue, 'puntos');

    const { error } = await supabase
      .from('user_profiles')
      .update({
        points: resetValue,
        level: newLevel,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      throw new Error(`Reset failed: ${error.message}`);
    }

    // Limpiar localStorage también
    clearLocalGamificationData();

    console.log('[EMERGENCY] Reset completado exitosamente');
    return { success: true, finalPoints: resetValue };

  } catch (error: any) {
    console.error('[EMERGENCY] Error en reset:', error);
    return { success: false, finalPoints: 0, error: error.message };
  }
}

/**
 * Limpia datos de gamificación de localStorage
 */
export function clearLocalGamificationData() {
  try {
    console.log('[EMERGENCY] Limpiando localStorage...');
    localStorage.removeItem(KEY_POINTS);
    localStorage.removeItem(KEY_BADGES);
    console.log('[EMERGENCY] localStorage limpiado');
  } catch (error) {
    console.error('[EMERGENCY] Error clearing localStorage:', error);
  }
}

/**
 * SINCRONIZACIÓN FORZADA E INMEDIATA
 * Esta función se ejecuta SIEMPRE al hacer login y GARANTIZA que el perfil exista
 * CORREGIDO: Evita duplicación de puntos por doble sincronización
 */
export async function forceSyncToSupabase(userId: string, userEmail: string): Promise<{
  success: boolean;
  pointsMigrated: number;
  badgesMigrated: number;
  finalPoints: number;
  error?: string;
}> {
  console.log('=== [EMERGENCY] INICIANDO SINCRONIZACIÓN FORZADA ===');
  console.log('[EMERGENCY] User ID:', userId);
  console.log('[EMERGENCY] Email:', userEmail);

  try {
    // PASO 1: Leer datos locales
    const localData = getLocalGamificationData();
    console.log('[EMERGENCY] Datos locales:', localData);

    // PASO 2: Verificar perfil existente
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('id, user_id, points, level')
      .eq('user_id', userId)
      .maybeSingle();

    console.log('[EMERGENCY] Perfil existente:', existingProfile);
    console.log('[EMERGENCY] Error de búsqueda:', fetchError);

    // DECISIÓN CRÍTICA: ¿Qué hacer con los puntos?
    let finalPoints: number;
    
    if (existingProfile) {
      // CORREGIDO: Si el perfil existe, NO sumar puntos locales automáticamente
      // Esto evita la acumulación exponencial por doble sincronización
      finalPoints = existingProfile.points;
      
      console.log('[EMERGENCY] Perfil existe - usando puntos existentes:', finalPoints);
      console.log('[EMERGENCY] Puntos locales ignorados para evitar duplicación:', localData.points);
      
      // Solo mostrar toast informativo si hay puntos locales que se pierden
      if (localData.points > 0 && localData.points > 0) {
        console.log('[EMERGENCY] NOTA: Puntos locales no se migraron para evitar duplicación');
      }
    } else {
      // Si el perfil NO existe, es migración inicial - usar puntos locales
      finalPoints = localData.points;
      console.log('[EMERGENCY] Perfil nuevo - usando puntos locales:', finalPoints);
    }
    
    const newLevel = Math.floor(finalPoints / 100) + 1;

    console.log('[EMERGENCY] Puntos finales:', finalPoints);
    console.log('[EMERGENCY] Nuevo nivel:', newLevel);

    // PASO 3: UPSERT - Crear o actualizar perfil
    console.log('[EMERGENCY] Ejecutando UPSERT del perfil...');
    
    const { data: upsertedProfile, error: upsertError } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        email: userEmail,
        name: userEmail.split('@')[0],
        role: 'end_user',
        points: finalPoints,
        level: newLevel,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    console.log('[EMERGENCY] Resultado UPSERT:', upsertedProfile);
    console.log('[EMERGENCY] Error UPSERT:', upsertError);

    if (upsertError) {
      console.error('[EMERGENCY] ERROR CRÍTICO en UPSERT:', upsertError);
      throw new Error(`UPSERT failed: ${upsertError.message}`);
    }

    // PASO 4: VERIFICACIÓN - Leer el perfil de nuevo para confirmar
    console.log('[EMERGENCY] Verificando que el perfil se guardó...');
    
    const { data: verifiedProfile, error: verifyError } = await supabase
      .from('user_profiles')
      .select('points, level')
      .eq('user_id', userId)
      .single();

    console.log('[EMERGENCY] Perfil verificado:', verifiedProfile);
    console.log('[EMERGENCY] Error verificación:', verifyError);

    if (verifyError || !verifiedProfile) {
      console.error('[EMERGENCY] ERROR: No se pudo verificar el perfil');
      throw new Error('Verification failed');
    }

    if (verifiedProfile.points !== finalPoints) {
      console.error('[EMERGENCY] ERROR: Los puntos no coinciden!');
      console.error('[EMERGENCY] Esperado:', finalPoints, 'Obtenido:', verifiedProfile.points);
      throw new Error('Points mismatch');
    }

    console.log('[EMERGENCY] VERIFICACIÓN EXITOSA - Puntos confirmados:', verifiedProfile.points);

    // PASO 5: Migrar badges/achievements si existen Y el perfil es nuevo
    let badgesMigrated = 0;
    if (!existingProfile && localData.badges.length > 0) {
      console.log('[EMERGENCY] Migrando badges (perfil nuevo):', localData.badges);
      
      const { data: existingAchievements } = await supabase
        .from('achievements')
        .select('id, achievement_code')
        .in('achievement_code', localData.badges);

      if (existingAchievements && existingAchievements.length > 0) {
        const newAchievements = existingAchievements.map(achievement => ({
          user_id: userId,
          achievement_id: achievement.id,
          earned_at: new Date().toISOString(),
          times_earned: 1
        }));

        const { error: achievementError } = await supabase
          .from('user_achievements')
          .insert(newAchievements);

        if (!achievementError) {
          badgesMigrated = newAchievements.length;
          console.log('[EMERGENCY] Badges migrados:', badgesMigrated);
        }
      }
    } else if (existingProfile) {
      console.log('[EMERGENCY] Perfil existe - badges NO migrados para evitar duplicación');
    }

    // PASO 6: Limpiar localStorage SOLO si es migración inicial (perfil nuevo)
    if (!existingProfile && localData.points > 0) {
      console.log('[EMERGENCY] Limpiando localStorage después de migración exitosa...');
      clearLocalGamificationData();
    } else if (existingProfile && localData.points > 0) {
      console.log('[EMERGENCY] localStorage NO limpiado - preservando datos locales');
    }

    console.log('=== [EMERGENCY] SINCRONIZACIÓN COMPLETADA EXITOSAMENTE ===');
    console.log('[EMERGENCY] Puntos migrados:', !existingProfile ? localData.points : 0);
    console.log('[EMERGENCY] Badges migrados:', badgesMigrated);
    console.log('[EMERGENCY] Puntos finales en BD:', verifiedProfile.points);

    return {
      success: true,
      pointsMigrated: !existingProfile ? localData.points : 0,
      badgesMigrated,
      finalPoints: verifiedProfile.points
    };

  } catch (error: any) {
    console.error('=== [EMERGENCY] ERROR FATAL EN SINCRONIZACIÓN ===');
    console.error('[EMERGENCY] Error:', error);
    console.error('[EMERGENCY] Stack:', error?.stack);
    
    return {
      success: false,
      pointsMigrated: 0,
      badgesMigrated: 0,
      finalPoints: 0,
      error: error?.message || 'Error desconocido'
    };
  }
}

/**
 * GARANTIZAR PERFIL - Se ejecuta SIEMPRE al login
 * Crea el perfil si no existe, incluso sin datos locales
 */
export async function ensureUserProfile(userId: string, userEmail: string): Promise<boolean> {
  console.log('[EMERGENCY] Garantizando que el perfil exista...');
  
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .upsert({
        user_id: userId,
        email: userEmail,
        name: userEmail.split('@')[0],
        role: 'end_user',
        points: 0,
        level: 1,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    console.log('[EMERGENCY] Perfil garantizado:', profile);
    console.log('[EMERGENCY] Error:', error);

    return !error;
  } catch (error) {
    console.error('[EMERGENCY] Error garantizando perfil:', error);
    return false;
  }
}

/**
 * SINCRONIZACIÓN COMPLETA - Combina garantizar perfil + sincronizar datos
 */
export async function fullSync(userId: string, userEmail: string): Promise<{
  success: boolean;
  pointsMigrated: number;
  badgesMigrated: number;
  finalPoints: number;
  error?: string;
}> {
  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  SINCRONIZACIÓN COMPLETA - INICIO                          ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  // PASO 1: Garantizar que el perfil exista
  await ensureUserProfile(userId, userEmail);

  // PASO 2: Sincronizar datos locales
  const result = await forceSyncToSupabase(userId, userEmail);

  console.log('');
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║  SINCRONIZACIÓN COMPLETA - FIN                             ║');
  console.log('║  Estado:', result.success ? 'EXITOSO' : 'FALLIDO', '                                    ║');
  console.log('║  Puntos finales:', result.finalPoints, '                                   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');
  console.log('');

  return result;
}


/**
 * Carga datos de gamificación desde Supabase
 */
export async function loadGamificationDataFromSupabase(userId: string): Promise<{
  points: number;
  badges: string[];
  achievements: any[];
  level: number;
}> {
  try {
    // Cargar perfil
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('points, level')
      .eq('user_id', userId)
      .single();

    // Cargar achievements
    const { data: userAchievements } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId);

    const badges = userAchievements?.map(
      ua => ua.achievement?.achievement_code
    ).filter(Boolean) || [];

    return {
      points: profile?.points || 0,
      badges,
      achievements: userAchievements || [],
      level: profile?.level || 1
    };
  } catch (error) {
    console.error('Error loading gamification data from Supabase:', error);
    return {
      points: 0,
      badges: [],
      achievements: [],
      level: 1
    };
  }
}

/**
 * Actualiza puntos en Supabase
 */
export async function updatePointsInSupabase(userId: string, points: number): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({
        points,
        level: Math.floor(points / 100) + 1,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating points:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating points in Supabase:', error);
    return false;
  }
}
