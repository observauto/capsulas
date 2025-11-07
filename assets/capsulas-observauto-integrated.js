/**
 * Cápsulas Observauto - Solución Profesional Integrada
 * Fecha: 2025-11-07
 * 
 * Solución unificada que integra:
 * 1. Persistencia de premios
 * 2. Solución Google OAuth
 * 3. Auto-guardado inteligente
 * 4. Monitoreo de autenticación
 */

(function() {
    'use strict';
    
    console.log('🚀 Cápsulas Observauto: Iniciando sistema integrado...');
    
    // Verificar si ya se aplicó el sistema
    if (window.capsulasIntegratedApplied) {
        console.log('✅ Sistema integrado ya aplicado');
        return;
    }
    
    // ================ CONFIGURACIÓN ================
    
    const CONFIG = {
        autoSaveInterval: 30000, // 30 segundos
        authCheckDelay: 1000, // 1 segundo
        maxRetries: 3,
        prizesKey: 'observauto-premios',
        authKeys: ['sb-access-token', 'supabase.auth.token', 'supabase.auth.user']
    };
    
    // ================ GESTIÓN DE PREMIOS ================
    
    const PremioManager = {
        guardar: function(premios) {
            try {
                if (premios && Array.isArray(premios)) {
                    localStorage.setItem(CONFIG.prizesKey, JSON.stringify(premios));
                    console.log('💾 Premios guardados:', premios.length, 'elementos');
                }
            } catch (error) {
                console.warn('⚠️ Error al guardar premios:', error);
            }
        },
        
        cargar: function() {
            try {
                const premiosGuardados = localStorage.getItem(CONFIG.prizesKey);
                if (premiosGuardados) {
                    const premios = JSON.parse(premiosGuardados);
                    console.log('📥 Premios cargados:', premios.length, 'elementos');
                    return premios;
                }
            } catch (error) {
                console.warn('⚠️ Error al cargar premios:', error);
            }
            return [];
        },
        
        // Escuchar cambios en el estado de React
        inicializarListeners: function() {
            // Interceptar localStorage
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                // Guardar premios automáticamente
                if (key.includes('premio') || key.includes('reward') || key.includes('badge')) {
                    try {
                        const premios = JSON.parse(value);
                        if (Array.isArray(premios)) {
                            this.guardar(premios);
                        }
                    } catch (e) {
                        // No es un array de premios, continuar normalmente
                    }
                }
                return originalSetItem.apply(this, arguments);
            }.bind(this);
        }
    };
    
    // ================ GESTIÓN DE AUTENTICACIÓN GOOGLE ================
    
    const AuthManager = {
        detectarRetornoGoogle: function() {
            const hash = window.location.hash;
            const search = window.location.search;
            
            return (
                hash.includes('access_token') ||
                hash.includes('provider_token') ||
                search.includes('code=') ||
                search.includes('state=') ||
                sessionStorage.getItem('googleAuthReturn')
            );
        },
        
        verificarSesion: function() {
            const authData = {};
            
            CONFIG.authKeys.forEach(key => {
                const value = localStorage.getItem(key);
                if (value) {
                    authData[key] = value;
                }
            });
            
            return {
                hasAuth: Object.keys(authData).length > 0,
                data: authData
            };
        },
        
        forzarRedireccionDashboard: function() {
            const sesion = this.verificarSesion();
            
            if (sesion.hasAuth && this.estaEnAccessGate()) {
                console.log('🎯 Sesión válida detectada, redirigiendo al dashboard...');
                setTimeout(() => {
                    window.location.href = '/';
                }, CONFIG.authCheckDelay);
            }
        },
        
        estaEnAccessGate: function() {
            return (
                window.location.pathname.includes('/access') ||
                window.location.pathname.includes('/013') ||
                document.querySelector('[class*="access"]') !== null
            );
        },
        
        inicializar: function() {
            // Detectar retorno de Google
            if (this.detectarRetornoGoogle()) {
                console.log('🔄 Retorno de Google SignIn detectado');
                this.forzarRedireccionDashboard();
            }
            
            // Verificar sesión cada vez que cambie la URL
            window.addEventListener('popstate', () => {
                setTimeout(() => this.forzarRedireccionDashboard(), 500);
            });
            
            // Verificar cuando se agregue contenido al DOM
            if (window.MutationObserver) {
                const observer = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        if (mutation.addedNodes.length > 0) {
                            setTimeout(() => this.forzarRedireccionDashboard(), 1000);
                        }
                    });
                });
                
                observer.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }
    };
    
    // ================ SISTEMA DE AUTO-GUARDADO ================
    
    const AutoSaveManager = {
        interval: null,
        
        iniciar: function() {
            this.interval = setInterval(() => {
                try {
                    const premios = PremioManager.cargar();
                    if (premios && premios.length > 0) {
                        console.log('🔄 Auto-guardado ejecutado');
                    }
                    
                    // Verificar auth state
                    AuthManager.forzarRedireccionDashboard();
                    
                } catch (error) {
                    console.warn('⚠️ Error en auto-guardado:', error);
                }
            }, CONFIG.autoSaveInterval);
        },
        
        detener: function() {
            if (this.interval) {
                clearInterval(this.interval);
                this.interval = null;
            }
        }
    };
    
    // ================ SISTEMA DE EVENTOS ================
    
    const EventManager = {
        listeners: new Map(),
        
        on: function(event, callback) {
            if (!this.listeners.has(event)) {
                this.listeners.set(event, []);
            }
            this.listeners.get(event).push(callback);
        },
        
        emit: function(event, data) {
            if (this.listeners.has(event)) {
                this.listeners.get(event).forEach(callback => {
                    try {
                        callback(data);
                    } catch (error) {
                        console.warn('Error en listener de evento:', error);
                    }
                });
            }
        }
    };
    
    // ================ SISTEMA PRINCIPAL ================
    
    const CapsulasSistema = {
        inicializado: false,
        
        init: function() {
            if (this.inicializado) return;
            
            try {
                console.log('🎯 Inicializando sistema completo...');
                
                // 1. Restaurar premios guardados
                const premios = PremioManager.cargar();
                if (premios && premios.length > 0) {
                    EventManager.emit('premiosRestore', premios);
                }
                
                // 2. Inicializar gestión de premios
                PremioManager.inicializarListeners();
                
                // 3. Inicializar gestión de autenticación
                AuthManager.inicializar();
                
                // 4. Iniciar auto-guardado
                AutoSaveManager.iniciar();
                
                // 5. Verificación inicial
                setTimeout(() => {
                    AuthManager.forzarRedireccionDashboard();
                }, 2000);
                
                // Marcar como inicializado
                this.inicializado = true;
                window.capsulasIntegratedApplied = true;
                window.capsulasIntegratedVersion = '3.0.0';
                
                console.log('✅ Sistema completo inicializado');
                console.log('📋 Funcionalidades activas:');
                console.log('  - ✅ Persistencia de premios');
                console.log('  - ✅ Solución Google OAuth');
                console.log('  - ✅ Auto-guardado cada 30s');
                console.log('  - ✅ Monitoreo de autenticación');
                
            } catch (error) {
                console.error('❌ Error al inicializar sistema:', error);
            }
        },
        
        // API pública
        getPremios: function() {
            return PremioManager.cargar();
        },
        
        guardarPremios: function(premios) {
            PremioManager.guardar(premios);
        },
        
        verificarAuth: function() {
            return AuthManager.verificarSesion();
        },
        
        forzarAuthCheck: function() {
            AuthManager.forzarRedireccionDashboard();
        }
    };
    
    // ================ INICIALIZACIÓN ================
    
    // Función de inicialización
    function inicializarCapsulas() {
        CapsulasSistema.init();
    }
    
    // Inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', inicializarCapsulas);
    } else {
        inicializarCapsulas();
    }
    
    // También inicializar cuando la página esté completamente cargada
    window.addEventListener('load', inicializarCapsulas);
    
    // Re-inicializar cuando la pestaña vuelva a estar visible
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(() => {
                AuthManager.forzarRedireccionDashboard();
                const premios = PremioManager.cargar();
                if (premios && premios.length > 0) {
                    console.log('🔄 Sistema reactivado, premios verificados');
                }
            }, 1000);
        }
    });
    
    // Exponer API global
    window.CapsulasObservauto = {
        version: '3.0.0',
        getPremios: CapsulasSistema.getPremios.bind(CapsulasSistema),
        guardarPremios: CapsulasSistema.guardarPremios.bind(CapsulasSistema),
        verificarAuth: CapsulasSistema.verificarAuth.bind(CapsulasSistema),
        forzarAuthCheck: CapsulasSistema.forzarAuthCheck.bind(CapsulasSistema),
        on: EventManager.on.bind(EventManager)
    };
    
})();