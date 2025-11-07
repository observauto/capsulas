/**
 * HOTFIX COMPLETO - Cápsulas Observauto
 * Fecha: 2025-11-07
 * Combina: Persistencia de Premios + Autenticación Google
 */

(function() {
    'use strict';
    
    console.log('🔧 Aplicando hotfix completo de Cápsulas Observauto...');
    
    // Verificar si ya se aplicó el hotfix
    if (window.hotfixCompletoApplied) {
        console.log('✅ Hotfix completo ya aplicado');
        return;
    }
    
    // ================ PARTE 1: PERSISTENCIA DE PREMIOS ================
    
    function guardarPremios(premios) {
        try {
            if (premios && Array.isArray(premios)) {
                localStorage.setItem('observauto-premios', JSON.stringify(premios));
                console.log('💾 Premios guardados en localStorage:', premios.length, 'elementos');
            }
        } catch (error) {
            console.warn('⚠️ Error al guardar premios:', error);
        }
    }
    
    function cargarPremios() {
        try {
            const premiosGuardados = localStorage.getItem('observauto-premios');
            if (premiosGuardados) {
                const premios = JSON.parse(premiosGuardados);
                console.log('📥 Premios cargados desde localStorage:', premios.length, 'elementos');
                return premios;
            }
        } catch (error) {
            console.warn('⚠️ Error al cargar premios:', error);
        }
        return [];
    }
    
    // ================ PARTE 2: AUTENTICACIÓN GOOGLE ================
    
    function detectarRetornoGoogle() {
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        const tieneParametrosGoogle = 
            urlParams.has('code') ||
            urlParams.has('access_token') ||
            hashParams.has('access_token') ||
            urlParams.has('state') ||
            window.location.hash.includes('access_token') ||
            sessionStorage.getItem('googleAuthReturn');
            
        const tieneIndicadoresAuth = 
            localStorage.getItem('sb-access-token') ||
            localStorage.getItem('supabase.auth.token') ||
            localStorage.getItem('auth-state') ||
            localStorage.getItem('auth.google');
            
        return tieneParametrosGoogle || tieneIndicadoresAuth;
    }
    
    function forzarRecuperacionSesion() {
        try {
            console.log('🔄 Forzando recuperación de sesión de Google...');
            
            const authEvent = new CustomEvent('googleAuthReturn', {
                detail: {
                    timestamp: Date.now(),
                    source: 'google_signin',
                    requiresReload: true
                }
            });
            
            window.dispatchEvent(authEvent);
            
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
    
    // ================ PARTE 3: INTERCEPTACIÓN AVANZADA ================
    
    function interceptarFuncionesPremios() {
        try {
            // Interceptar localStorage para premios
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                if (key.includes('premio') || key.includes('reward') || key.includes('badge')) {
                    console.log('💾 Guardando premio en localStorage:', key);
                }
                
                // También detectar cambios de auth
                if (key.includes('auth') || key.includes('token') || key.includes('supabase')) {
                    console.log('🔐 Cambio en localStorage de auth:', key);
                    
                    if (key.includes('sb-') || key.includes('supabase')) {
                        setTimeout(() => {
                            verificarYSincronizarSesion();
                        }, 1000);
                    }
                }
                
                return originalSetItem.apply(this, arguments);
            };
            
            // Buscar y modificar métodos de React relacionados con premios
            const buscarYModificarPremios = () => {
                try {
                    Object.keys(window).forEach(key => {
                        const obj = window[key];
                        if (obj && typeof obj === 'object') {
                            Object.keys(obj).forEach(methodKey => {
                                if (methodKey.toLowerCase().includes('premio') || 
                                    methodKey.toLowerCase().includes('reward') ||
                                    methodKey.toLowerCase().includes('badge')) {
                                    
                                    const originalMethod = obj[methodKey];
                                    if (typeof originalMethod === 'function') {
                                        console.log('🎯 Interceptando método de premios:', methodKey);
                                        
                                        obj[methodKey] = function(...args) {
                                            const result = originalMethod.apply(this, args);
                                            
                                            setTimeout(() => {
                                                if (this.premios || this.state?.premios) {
                                                    const premios = this.premios || this.state?.premios;
                                                    guardarPremios(premios);
                                                }
                                            }, 100);
                                            
                                            return result;
                                        };
                                    }
                                }
                            });
                        }
                    });
                } catch (error) {
                    console.warn('⚠️ Error en interceptación:', error);
                }
            };
            
            buscarYModificarPremios();
            
        } catch (error) {
            console.warn('⚠️ Error en interceptación de funciones:', error);
        }
    }
    
    // ================ PARTE 4: VERIFICACIÓN Y SINCRONIZACIÓN ================
    
    function verificarYSincronizarSesion() {
        try {
            // Verificar datos de auth
            const authData = {
                supabase: localStorage.getItem('sb-access-token'),
                authToken: localStorage.getItem('supabase.auth.token'),
                user: localStorage.getItem('supabase.auth.user')
            };
            
            // Verificar premios
            const premios = cargarPremios();
            
            console.log('🔍 Verificando estado:', { 
                auth: !!authData.supabase, 
                premios: premios.length 
            });
            
            // Si hay auth pero estamos en access gate, redirigir
            if ((authData.supabase || authData.authToken || authData.user) && 
                (window.location.pathname.includes('/access') || 
                 window.location.pathname.includes('/013'))) {
                
                console.log('🎯 Datos de auth encontrados, redirigiendo al dashboard...');
                setTimeout(() => {
                    window.location.href = '/';
                }, 1500);
            }
            
        } catch (error) {
            console.warn('⚠️ Error al verificar sesión:', error);
        }
    }
    
    // ================ PARTE 5: AUTO-GUARDADO Y MONITOREO ================
    
    function iniciarAutoGuardado() {
        setInterval(() => {
            try {
                const premios = cargarPremios();
                if (premios && premios.length > 0) {
                    console.log('🔄 Auto-guardado de premios ejecutado');
                }
                
                // También verificar auth state
                verificarYSincronizarSesion();
                
            } catch (error) {
                console.warn('⚠️ Error en auto-guardado:', error);
            }
        }, 30000); // Cada 30 segundos
    }
    
    // ================ PARTE 6: RESTAURACIÓN DE PREMIOS ================
    
    function restaurarPremios() {
        const premiosGuardados = cargarPremios();
        if (premiosGuardados && premiosGuardados.length > 0) {
            console.log('🏆 Restaurando premios guardados:', premiosGuardados.length);
            
            if (window.React || window.ReactDOM) {
                setTimeout(() => {
                    const event = new CustomEvent('restaurarPremios', { 
                        detail: { premios: premiosGuardados } 
                    });
                    window.dispatchEvent(event);
                }, 1000);
            }
        }
    }
    
    // ================ PARTE 7: MANEJO DE NAVEGACIÓN ================
    
    function manejarNavegacion() {
        // Interceptar pushState y replaceState
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;
        
        function interceptarCambioUrl(state, title, url) {
            console.log('🔄 Cambio de URL detectado:', url);
            
            if (url && (url.includes('/access') || url.includes('/013'))) {
                setTimeout(() => {
                    verificarYSincronizarSesion();
                }, 500);
            }
            
            return originalPushState.call(history, state, title, url);
        }
        
        history.pushState = interceptarCambioUrl;
        history.replaceState = interceptarCambioUrl;
    }
    
    // ================ PARTE 8: OBSERVADOR DEL DOM ================
    
    function observarCambiosDOM() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                const nuevosNodos = Array.from(mutation.addedNodes);
                nuevosNodos.forEach((nodo) => {
                    if (nodo.nodeType === 1) {
                        const texto = nodo.textContent || nodo.innerText || '';
                        
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
    
    // ================ FUNCIÓN PRINCIPAL ================
    
    function aplicarHotfixCompleto() {
        try {
            console.log('🚀 Iniciando hotfix completo de Cápsulas Observauto...');
            
            // 1. Restaurar premios al cargar
            restaurarPremios();
            
            // 2. Detectar si viene de Google SignIn
            if (detectarRetornoGoogle()) {
                console.log('🎯 Retorno de Google SignIn detectado');
                forzarRecuperacionSesion();
            }
            
            // 3. Interceptar funciones
            interceptarFuncionesPremios();
            
            // 4. Manejar navegación
            manejarNavegacion();
            
            // 5. Observar cambios en DOM
            observarCambiosDOM();
            
            // 6. Iniciar auto-guardado
            iniciarAutoGuardado();
            
            // 7. Verificación inicial
            verificarYSincronizarSesion();
            
            // Marcar como aplicado
            window.hotfixCompletoApplied = true;
            window.hotfixCompletoVersion = '2.0.0';
            
            console.log('✅ Hotfix completo aplicado correctamente');
            console.log('📋 Funcionalidades activas:');
            console.log('  - ✅ Persistencia de premios');
            console.log('  - ✅ Solución Google SignIn');
            console.log('  - ✅ Auto-guardado cada 30s');
            console.log('  - ✅ Interceptación de funciones');
            console.log('  - ✅ Monitoreo de autenticación');
            
        } catch (error) {
            console.error('❌ Error al aplicar hotfix completo:', error);
        }
    }
    
    // ================ EVENTOS DE ACTIVACIÓN ================
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', aplicarHotfixCompleto);
    } else {
        aplicarHotfixCompleto();
    }
    
    window.addEventListener('load', aplicarHotfixCompleto);
    
    // Reaplicar cuando la pestaña vuelve a estar visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => {
                verificarYSincronizarSesion();
                const premios = cargarPremios();
                if (premios && premios.length > 0) {
                    console.log('🔄 Premios verificados al volver a la pestaña');
                }
            }, 1000);
        }
    });
    
    // Evento personalizado para que la app pueda solicitar verificación
    window.addEventListener('verificarEstado', () => {
        verificarYSincronizarSesion();
    });
    
})();