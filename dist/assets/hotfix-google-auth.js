/**
 * HOTFIX AUTENTICACIÓN GOOGLE - Cápsulas Observauto
 * Fecha: 2025-11-07
 * Propósito: Solucionar el problema de Google SignIn donde el usuario regresa al access gate
 */

(function() {
    'use strict';
    
    console.log('🔧 Aplicando hotfix de autenticación Google...');
    
    // Verificar si ya se aplicó el hotfix
    if (window.hotfixGoogleAuthApplied) {
        console.log('✅ Hotfix de autenticación Google ya aplicado');
        return;
    }
    
    // Detectar si viene de Google SignIn
    function detectarRetornoGoogle() {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Verificar parámetros típicos de Google OAuth
        const tieneParametrosGoogle = 
            urlParams.has('code') ||
            urlParams.has('access_token') ||
            hashParams.has('access_token') ||
            urlParams.has('state') ||
            window.location.hash.includes('access_token') ||
            sessionStorage.getItem('googleAuthReturn');
            
        // También verificar si hay indicadores en localStorage
        const tieneIndicadoresAuth = 
            localStorage.getItem('sb-access-token') ||
            localStorage.getItem('supabase.auth.token') ||
            localStorage.getItem('auth-state') ||
            localStorage.getItem('auth.google');
            
        return tieneParametrosGoogle || tieneIndicadoresAuth;
    }
    
    // Función para forzar la recarga de la sesión de autenticación
    function forzarRecuperacionSesion() {
        try {
            console.log('🔄 Forzando recuperación de sesión de Google...');
            
            // Disparar evento personalizado para que la app detecte la sesión
            const authEvent = new CustomEvent('googleAuthReturn', {
                detail: {
                    timestamp: Date.now(),
                    source: 'google_signin',
                    requiresReload: true
                }
            });
            
            window.dispatchEvent(authEvent);
            
            // Forzar recarga de la página si es necesario
            setTimeout(() => {
                if (window.location.pathname.includes('/access') || 
                    window.location.pathname.includes('/013')) {
                    
                    console.log('🔄 Recargando página para establecer sesión...');
                    window.location.reload();
                }
            }, 2000);
            
        } catch (error) {
            console.warn('⚠️ Error al forzar recuperación de sesión:', error);
        }
    }
    
    // Función para interceptar el flujo de autenticación
    function interceptarFlujoAuth() {
        try {
            // Interceptar localStorage para detectar cambios de auth
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                if (key.includes('auth') || key.includes('token') || key.includes('supabase')) {
                    console.log('💾 Cambio en localStorage de auth:', key);
                    
                    // Si detecta un token de Supabase, forzar verificación
                    if (key.includes('sb-') || key.includes('supabase')) {
                        setTimeout(() => {
                            verificarYSincronizarSesion();
                        }, 1000);
                    }
                }
                return originalSetItem.apply(this, arguments);
            };
            
            // Interceptar fetch para detectar llamadas de autenticación
            const originalFetch = window.fetch;
            window.fetch = function(...args) {
                const url = args[0];
                if (typeof url === 'string' && (url.includes('/auth/') || url.includes('signin'))) {
                    console.log('🌐 Llamada de autenticación detectada:', url);
                }
                return originalFetch.apply(this, args);
            };
            
        } catch (error) {
            console.warn('⚠️ Error al interceptar flujo de auth:', error);
        }
    }
    
    // Función para verificar y sincronizar sesión
    function verificarYSincronizarSesion() {
        try {
            // Verificar si hay tokens en localStorage
            const authData = {
                supabase: localStorage.getItem('sb-access-token'),
                authToken: localStorage.getItem('supabase.auth.token'),
                user: localStorage.getItem('supabase.auth.user')
            };
            
            console.log('🔍 Verificando datos de autenticación:', authData);
            
            // Si hay datos de auth pero estamos en access gate, redirigir
            if ((authData.supabase || authData.authToken || authData.user) && 
                (window.location.pathname.includes('/access') || 
                 window.location.pathname.includes('/013'))) {
                
                console.log('🎯 Datos de auth encontrados, redirigiendo al dashboard...');
                
                // Esperar un poco para que la app procese la auth
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
            
        } catch (error) {
            console.warn('⚠️ Error al verificar sesión:', error);
        }
    }
    
    // Función para manejar el estado de carga de la aplicación
    function manejarEstadoApp() {
        // Monitorear cambios en la URL
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        function interceptarCambioUrl(state, title, url) {
            console.log('🔄 Cambio de URL detectado:', url);
            
            // Si vamos a access gate pero hay auth, interceptar
            if (url && (url.includes('/access') || url.includes('/013'))) {
                setTimeout(() => {
                    verificarYSincronizarSesion();
                }, 500);
            }
            
            return originalPushState.call(history, state, title, url);
        }
        
        function interceptarReplaceUrl(state, title, url) {
            console.log('🔄 Reemplazo de URL detectado:', url);
            return originalReplaceState.call(history, state, title, url);
        }
        
        history.pushState = interceptarCambioUrl;
        history.replaceState = interceptarReplaceUrl;
    }
    
    // Función para observer cambios en el DOM
    function observarCambiosDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                // Buscar elementos relacionados con autenticación
                const nuevosNodos = Array.from(mutation.addedNodes);
                nuevosNodos.forEach((nodo) => {
                    if (nodo.nodeType === 1) { // Elemento
                        const texto = nodo.textContent || nodo.innerText || '';
                        
                        // Detectar si apareció contenido de access gate
                        if (texto.includes('Acceder') || texto.includes('código') || 
                            texto.includes('013') || nodo.className?.includes('access')) {
                            
                            setTimeout(() => {
                                verificarYSincronizarSesion();
                            }, 1000);
                        }
                    }
                });
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Función principal del hotfix
    function aplicarHotfix() {
        try {
            console.log('🚀 Iniciando hotfix de autenticación Google...');
            
            // Detectar si viene de Google SignIn
            if (detectarRetornoGoogle()) {
                console.log('🎯 Retorno de Google SignIn detectado');
                forzarRecuperacionSesion();
            }
            
            // Interceptar flujo de autenticación
            interceptarFlujoAuth();
            
            // Manejar estado de la aplicación
            manejarEstadoApp();
            
            // Observar cambios en el DOM
            observarCambiosDOM();
            
            // Verificación periódica
            setInterval(() => {
                verificarYSincronizarSesion();
            }, 3000); // Cada 3 segundos
            
            // Marcar como aplicado
            window.hotfixGoogleAuthApplied = true;
            window.hotfixGoogleAuthVersion = '1.0.0';
            
            console.log('✅ Hotfix de autenticación Google aplicado correctamente');
            
        } catch (error) {
            console.error('❌ Error al aplicar hotfix:', error);
        }
    }
    
    // Aplicar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarHotfix);
    } else {
        aplicarHotfix();
    }
    
    // También aplicar cuando la ventana esté cargada
    window.addEventListener('load', aplicarHotfix);
    
    // Aplicar también en el evento de visibilidad (cuando la pestaña vuelve a estar activa)
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => {
                verificarYSincronizarSesion();
            }, 1000);
        }
    });
    
})();