import { supabase } from "./supabase";

/**
 * Valida un código de acceso utilizando la función RPC segura de Supabase.
 * @param code El código a validar.
 * @returns true si el código es válido y está activo, false en caso contrario.
 */
export async function validateAccessCode(code: string): Promise<boolean> {
    try {
        const { data, error } = await supabase.rpc('validate_access_code', {
            code_input: code,
        });

        if (error) {
            console.error('[SECURITY] Error validando código de acceso:', error);
            return false;
        }

        return !!data;
    } catch (error) {
        console.error('[SECURITY] Excepción validando código de acceso:', error);
        return false;
    }
}

/**
 * Verifica si un usuario ha alcanzado el límite de completaciones para una cápsula.
 * @param userId ID del usuario.
 * @param capsuleId ID de la cápsula.
 * @param maxTimes Número máximo de veces permitidas (por defecto 1).
 * @returns true si ha alcanzado el límite, false si puede recibir puntos.
 */
export async function checkCapsuleLimit(
    userId: string,
    capsuleId: string,
    maxTimes: number = 1
): Promise<boolean> {
    try {
        const { data, error } = await supabase.rpc('has_reached_capsule_limit', {
            p_user_id: userId,
            p_capsule_id: capsuleId,
            p_max_times: maxTimes,
        });

        if (error) {
            console.error('[SECURITY] Error verificando límite de cápsula:', error);
            // En caso de error, asumimos que NO ha alcanzado el límite para no bloquear al usuario,
            // pero logueamos el error. O podríamos ser restrictivos.
            // Por seguridad (fail-safe), si falla la verificación, mejor permitir (o denegar?).
            // Asumiremos denegar si hay error grave, pero aquí retornamos false (no ha alcanzado) para no frustrar.
            // Ajuste: Retornar true (ha alcanzado) si hay error podría bloquear injustamente.
            // Retornar false permite continuar.
            return false;
        }

        return !!data;
    } catch (error) {
        console.error('[SECURITY] Excepción verificando límite de cápsula:', error);
        return false;
    }
}

/**
 * Registra la completación de una cápsula para un usuario.
 * @param userId ID del usuario.
 * @param capsuleId ID de la cápsula.
 * @param points Puntos otorgados.
 */
export async function recordCapsuleCompletion(
    userId: string,
    capsuleId: string,
    points: number
): Promise<void> {
    try {
        const { error } = await supabase.from('user_capsule_completions').insert({
            user_id: userId,
            capsule_id: capsuleId,
            points_awarded: points,
        });

        if (error) {
            console.error('[SECURITY] Error registrando completación de cápsula:', error);
        }
    } catch (error) {
        console.error('[SECURITY] Excepción registrando completación de cápsula:', error);
    }
}
