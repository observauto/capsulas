// HOTFIX GLOBAL - PERSISTENCIA DE PREMIOS CANJEADOS
// Este hotfix corrige el problema de persistencia de premios en la aplicación

(function() {
    console.log('🔧 Aplicando hotfix de persistencia de premios...');
    
    // Función para guardar premios canjeados en localStorage
    function saveRedeemedPrizes(prizes) {
        try {
            const userData = JSON.parse(localStorage.getItem('observauto_user') || '{}');
            userData.redeemedPrizes = prizes;
            localStorage.setItem('observauto_user', JSON.stringify(userData));
            console.log('✅ Premios canjeados guardados en localStorage:', prizes);
            return true;
        } catch (error) {
            console.error('❌ Error al guardar premios canjeados:', error);
            return false;
        }
    }
    
    // Función para cargar premios canjeados del localStorage
    function loadRedeemedPrizes() {
        try {
            const userData = JSON.parse(localStorage.getItem('observauto_user') || '{}');
            return userData.redeemedPrizes || [];
        } catch (error) {
            console.error('❌ Error al cargar premios canjeados:', error);
            return [];
        }
    }
    
    // Función para integrar con el sistema de React
    function integrateWithReact() {
        // Buscar el estado de premios canjeados en React
        const prizeElements = document.querySelectorAll('[data-state="redeemed"], [class*="redeemed"], [class*="prize"]');
        
        if (window.React || window._reactInternalFiber) {
            // Intentar encontrar el estado de React
            console.log('🔍 Intentando integrar con React...');
        }
    }
    
    // Interceptar el localStorage.setItem para detectar cambios de premios
    const originalSetItem = localStorage.setItem;
    localStorage.setItem = function(key, value) {
        // Detectar cuando se guardan premios canjeados
        if (key === 'observauto_user' || key.includes('prize') || key.includes('redeemed')) {
            console.log('💾 Detectado cambio en premios:', { key, value });
            
            try {
                const data = JSON.parse(value);
                if (data.redeemedPrizes) {
                    console.log('🎁 Premios detectados en datos:', data.redeemedPrizes);
                }
            } catch (e) {
                // No es JSON válido
            }
        }
        
        // Llamar a la función original
        return originalSetItem.call(this, key, value);
    };
    
    // Función para sincronizar premios con la interfaz
    function syncPrizesWithUI() {
        const redeemedPrizes = loadRedeemedPrizes();
        
        // Buscar elementos de premios en la UI
        const prizeElements = document.querySelectorAll('.prize-card, [class*="prize"], [data-prize]');
        
        prizeElements.forEach(element => {
            const prizeId = element.getAttribute('data-prize-id') || element.id;
            if (prizeId && redeemedPrizes.includes(prizeId)) {
                // Marcar como canjeado
                element.classList.add('redeemed');
                const button = element.querySelector('button, [class*="button"]');
                if (button) {
                    button.textContent = 'Canjeado';
                    button.disabled = true;
                    button.classList.add('opacity-50', 'cursor-not-allowed');
                }
            }
        });
        
        console.log('🔄 Sincronización de premios completada');
    }
    
    // Monitorear cambios en el DOM
    const observer = new MutationObserver((mutations) => {
        let shouldSync = false;
        
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList') {
                // Detectar si se agregaron elementos de premios
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        const hasPrizeClass = node.className && (
                            node.className.includes('prize') || 
                            node.className.includes('redeem') ||
                            node.className.includes('canjear')
                        );
                        if (hasPrizeClass) {
                            shouldSync = true;
                        }
                    }
                });
            }
        });
        
        if (shouldSync) {
            setTimeout(syncPrizesWithUI, 100);
        }
    });
    
    // Iniciar monitoreo
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Intervalo de sincronización
    setInterval(syncPrizesWithUI, 2000);
    
    // Event listener para cambios en localStorage
    window.addEventListener('storage', (e) => {
        if (e.key === 'observauto_user') {
            setTimeout(syncPrizesWithUI, 100);
        }
    });
    
    // Función para usar desde la consola
    window.fixPremios = {
        // Ver premios actuales
        getRedeemed: () => {
            const prizes = loadRedeemedPrizes();
            console.log('🎁 Premios canjeados:', prizes);
            return prizes;
        },
        
        // Agregar premio manualmente
        addPrize: (prizeId) => {
            const prizes = loadRedeemedPrizes();
            if (!prizes.includes(prizeId)) {
                prizes.push(prizeId);
                saveRedeemedPrizes(prizes);
                console.log('✅ Premio agregado:', prizeId);
            } else {
                console.log('⚠️ Premio ya existe:', prizeId);
            }
            syncPrizesWithUI();
        },
        
        // Limpiar todos los premios
        clearPrizes: () => {
            saveRedeemedPrizes([]);
            console.log('🗑️ Todos los premios limpiados');
            syncPrizesWithUI();
        },
        
        // Forzar sincronización
        sync: () => {
            console.log('🔄 Sincronización forzada');
            syncPrizesWithUI();
        }
    };
    
    // Detectar si estamos en la página de gamificación
    if (window.location.pathname.includes('gamificacion') || 
        window.location.hash.includes('gamificacion') ||
        document.querySelector('[href*="gamificacion"]')) {
        
        // Sincronizar cuando la página esté lista
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(syncPrizesWithUI, 1000);
            });
        } else {
            setTimeout(syncPrizesWithUI, 1000);
        }
    }
    
    console.log('✅ Hotfix de persistencia de premios aplicado');
    console.log('📊 Premios actuales:', loadRedeemedPrizes());
    console.log('🛠️ Funciones disponibles: window.fixPremios');
    
    // Auto-ejecutar sincronización
    syncPrizesWithUI();
})();