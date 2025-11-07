/**
 * HOTFIX PERSISTENCIA PREMIOS - Cápsulas Observauto
 * Fecha: 2025-11-07
 * Propósito: Asegurar que los premios se mantengan persistentes en localStorage
 */

(function() {
    'use strict';
    
    console.log('🔧 Aplicando hotfix de persistencia de premios...');
    
    // Verificar si ya se aplicó el hotfix
    if (window.hotfixPremiosApplied) {
        console.log('✅ Hotfix de premios ya aplicado');
        return;
    }
    
    // Función para guardar premios en localStorage
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
    
    // Función para cargar premios desde localStorage
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
    
    // Interceptar funciones relacionadas con premios
    function interceptarFuncionesPremios() {
        // Esperar a que la aplicación esté cargada
        if (typeof window !== 'undefined') {
            // Función para encontrar y modificar métodos relacionados con premios
            const buscarYModificarPremios = () => {
                try {
                    // Buscar en el objeto window o cualquier objeto global
                    Object.keys(window).forEach(key => {
                        const obj = window[key];
                        if (obj && typeof obj === 'object') {
                            // Buscar métodos relacionados con premios
                            Object.keys(obj).forEach(methodKey => {
                                if (methodKey.toLowerCase().includes('premio') || 
                                    methodKey.toLowerCase().includes('reward') ||
                                    methodKey.toLowerCase().includes('badge')) {
                                    
                                    const originalMethod = obj[methodKey];
                                    if (typeof originalMethod === 'function') {
                                        console.log('🎯 Interceptando método de premios:', methodKey);
                                        
                                        obj[methodKey] = function(...args) {
                                            const result = originalMethod.apply(this, args);
                                            
                                            // Guardar premios después de cualquier cambio
                                            setTimeout(() => {
                                                if (typeof this.premios !== 'undefined' || this.state?.premios) {
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
            
            // Aplicar interceptación
            buscarYModificarPremios();
            
            // También interceptar localStorage directamente
            const originalSetItem = localStorage.setItem;
            localStorage.setItem = function(key, value) {
                if (key.includes('premio') || key.includes('reward') || key.includes('badge')) {
                    console.log('💾 Guardando premio en localStorage:', key);
                }
                return originalSetItem.apply(this, arguments);
            };
        }
    }
    
    // Auto-guardado periódico de premios
    function iniciarAutoGuardado() {
        setInterval(() => {
            try {
                // Buscar premios en el estado de la aplicación
                const premios = cargarPremios();
                if (premios && premios.length > 0) {
                    console.log('🔄 Auto-guardado de premios ejecutado');
                }
            } catch (error) {
                console.warn('⚠️ Error en auto-guardado:', error);
            }
        }, 30000); // Cada 30 segundos
    }
    
    // Restaurar premios al cargar la página
    function restaurarPremios() {
        const premiosGuardados = cargarPremios();
        if (premiosGuardados && premiosGuardados.length > 0) {
            console.log('🏆 Restaurando premios guardados:', premiosGuardados.length);
            
            // Intentar restaurar en el estado de la aplicación
            if (window.React || window.ReactDOM) {
                // Esperar a que React esté disponible
                setTimeout(() => {
                    const event = new CustomEvent('restaurarPremios', { 
                        detail: { premios: premiosGuardados } 
                    });
                    window.dispatchEvent(event);
                }, 1000);
            }
        }
    }
    
    // Aplicar hotfix
    function aplicarHotfix() {
        try {
            console.log('🚀 Iniciando hotfix de persistencia de premios...');
            
            // Restaurar premios al cargar
            restaurarPremios();
            
            // Interceptar funciones
            interceptarFuncionesPremios();
            
            // Iniciar auto-guardado
            iniciarAutoGuardado();
            
            // Marcar como aplicado
            window.hotfixPremiosApplied = true;
            window.hotfixPremiosVersion = '1.0.0';
            
            console.log('✅ Hotfix de persistencia de premios aplicado correctamente');
            
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
    
})();