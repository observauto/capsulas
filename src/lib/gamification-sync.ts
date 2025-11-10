import { supabase } from './supabase';
import { KEY_BADGES, KEY_POINTS } from './gamification-keys';

type AchievementRecord = {
  id: string;
  achievement_code: string;
};

type UserAchievementRecord = {
  achievement: AchievementRecord | null;
};

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

    const safeLocalPoints = Number.isFinite(localData.points) ? localData.points : 0;
    const remotePoints = existingProfile?.points ?? 0;

    // Mantener siempre el progreso más alto para evitar pérdidas de datos
    const finalPoints = Math.max(remotePoints, safeLocalPoints);

    if (existingProfile) {
      console.log('[EMERGENCY] Perfil existe - puntos remotos:', remotePoints);
      console.log('[EMERGENCY] Puntos locales considerados:', safeLocalPoints);
      console.log('[EMERGENCY] Puntos elegidos para sincronizar:', finalPoints);
    } else {
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

    // PASO 5: Sincronizar badges combinando los locales con los existentes
    const remoteBadges = await getUserBadgeCodes(userId);
    const combinedBadges = uniqueStrings([...remoteBadges, ...localData.badges]);

    const badgesMigrated = await syncBadgesCollection(userId, combinedBadges, remoteBadges);

    // PASO 6: Limpiar localStorage SOLO si es migración inicial (perfil nuevo)
    if (!existingProfile && safeLocalPoints > 0) {
      console.log('[EMERGENCY] Limpiando localStorage después de migración exitosa...');
      clearLocalGamificationData();
    } else if (existingProfile && safeLocalPoints > 0) {
      console.log('[EMERGENCY] localStorage NO limpiado - preservando datos locales');
    }

    console.log('=== [EMERGENCY] SINCRONIZACIÓN COMPLETADA EXITOSAMENTE ===');
    console.log('[EMERGENCY] Puntos migrados:', Math.max(0, finalPoints - remotePoints));
    console.log('[EMERGENCY] Badges migrados:', badgesMigrated);
    console.log('[EMERGENCY] Puntos finales en BD:', verifiedProfile.points);

    return {
      success: true,
      pointsMigrated: Math.max(0, finalPoints - remotePoints),
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
    const { data: existingProfile, error: fetchError } = await supabase
      .from('user_profiles')
      .select('user_id, email, name, role')
      .eq('user_id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error('[EMERGENCY] Error buscando perfil existente:', fetchError);
      return false;
    }

    if (existingProfile) {
      const updates: Record<string, string> = {};

      if (!existingProfile.email && userEmail) {
        updates.email = userEmail;
      }

      if (!existingProfile.name && userEmail) {
        updates.name = userEmail.split('@')[0];
      }

      if (!existingProfile.role) {
        updates.role = 'end_user';
      }

      if (Object.keys(updates).length > 0) {
        updates.updated_at = new Date().toISOString();

        const { error: updateError } = await supabase
          .from('user_profiles')
          .update(updates)
          .eq('user_id', userId);

        if (updateError) {
          console.error('[EMERGENCY] Error actualizando metadatos del perfil:', updateError);
          return false;
        }
      }

      console.log('[EMERGENCY] Perfil ya existía, sin sobrescribir puntos');
      return true;
    }

    const now = new Date().toISOString();
    const { error: insertError } = await supabase
      .from('user_profiles')
      .insert({
        user_id: userId,
        email: userEmail,
        name: userEmail.split('@')[0],
        role: 'end_user',
        points: 0,
        level: 1,
        created_at: now,
        updated_at: now,
      });

    if (insertError) {
      console.error('[EMERGENCY] Error insertando nuevo perfil:', insertError);
      return false;
    }

    console.log('[EMERGENCY] Perfil creado exitosamente');
    return true;
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
  achievements: UserAchievementRecord[];
  level: number;
} | null> {
  try {
    // Cargar perfil sin lanzar error cuando no existan filas
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('points, level')
      .eq('user_id', userId)
      .maybeSingle();

    if (profileError) {
      console.error('Error loading user profile from Supabase:', profileError);
      return null;
    }

    // Cargar achievements asociados
    const { data: userAchievements, error: achievementsError } = await supabase
      .from('user_achievements')
      .select(`
        *,
        achievement:achievements(*)
      `)
      .eq('user_id', userId);

    if (achievementsError) {
      console.error('Error loading user achievements from Supabase:', achievementsError);
      return null;
    }

    const badges = userAchievements?.map(
      ua => ua.achievement?.achievement_code
    ).filter((code): code is string => Boolean(code)) || [];

    return {
      points: profile?.points || 0,
      badges,
      achievements: userAchievements || [],
      level: profile?.level || 1
    };
  } catch (error) {
    console.error('Error loading gamification data from Supabase:', error);
    return null;
  }
}

/**
 * Actualiza puntos en Supabase
 */
export async function updatePointsInSupabase(
  userId: string,
  points: number,
  options?: {
    email?: string | null;
    name?: string | null;
  },
): Promise<boolean> {
  try {
    const level = Math.floor(points / 100) + 1;
    const timestamp = new Date().toISOString();

    const payload: Record<string, string | number> = {
      user_id: userId,
      points,
      level,
      updated_at: timestamp,
      role: 'end_user',
    };

    const email = options?.email ?? undefined;
    if (email) {
      payload.email = email;
    }

    const explicitName = options?.name ?? email?.split('@')[0];
    if (explicitName) {
      payload.name = explicitName;
    }

    const { error } = await supabase
      .from('user_profiles')
      .upsert(payload, { onConflict: 'user_id', ignoreDuplicates: false });

    if (error) {
      console.error('Error upserting points profile:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error updating points in Supabase:', error);
    return false;
  }
}

export async function updateBadgesInSupabase(userId: string, badges: string[]): Promise<number> {
  if (!badges.length) {
    return 0;
  }

  try {
    const uniqueBadges = uniqueStrings(badges);
    return syncBadgesCollection(userId, uniqueBadges);
  } catch (error) {
    console.error('Error updating badges in Supabase:', error);
    return 0;
  }
}

async function getUserBadgeCodes(userId: string): Promise<string[]> {
  try {
    const { data, error } = await supabase
      .from('user_achievements')
      .select(`
        achievement:achievements(achievement_code)
      `)
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching existing badges:', error);
      return [];
    }

    return (
      data?.map(record => record.achievement?.achievement_code).filter((code): code is string => Boolean(code)) || []
    );
  } catch (error) {
    console.error('Error fetching user badge codes:', error);
    return [];
  }
}

function uniqueStrings(values: string[]): string[] {
  return Array.from(new Set(values.filter((value): value is string => typeof value === 'string' && value.length > 0)));
}

async function syncBadgesCollection(
  userId: string,
  desiredBadges: string[],
  existingBadges?: string[],
): Promise<number> {
  const alreadyOwned = new Set(existingBadges ?? (await getUserBadgeCodes(userId)));
  const missingCodes = desiredBadges.filter(code => !alreadyOwned.has(code));

  if (!missingCodes.length) {
    return 0;
  }

  const { data: achievementRecords, error: achievementFetchError } = await supabase
    .from('achievements')
    .select('id, achievement_code')
    .in('achievement_code', missingCodes);

  if (achievementFetchError) {
    console.error('Error fetching achievement metadata:', achievementFetchError);
    return 0;
  }

  const achievementMap = new Map(achievementRecords?.map(record => [record.achievement_code, record.id] as const) || []);

  const newEntries = missingCodes
    .map(code => {
      const achievementId = achievementMap.get(code);
      if (!achievementId) return null;
      return {
        user_id: userId,
        achievement_id: achievementId,
        earned_at: new Date().toISOString(),
        times_earned: 1,
      };
    })
    .filter((entry): entry is {
      user_id: string;
      achievement_id: string;
      earned_at: string;
      times_earned: number;
    } => Boolean(entry));

  if (!newEntries.length) {
    return 0;
  }

  const { error: insertError } = await supabase.from('user_achievements').insert(newEntries);

  if (insertError) {
    console.error('Error inserting achievements:', insertError);
    return 0;
  }

  return newEntries.length;
}
