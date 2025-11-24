* **Nombre del Proyecto:** El proyecto se llama **Cápsulas Observauto**. Todas las referencias a "Píldoras" deben ser eliminadas.  
* **Contenido:** El contenido es sobre "cápsulas de conocimiento" automotriz en general, no específicamente sobre vehículos eléctricos.  
* **Branding de Patrocinadores:** BYD es solo un *patrocinador* de cápsulas específicas, no el propietario global de la marca. Las referencias globales a BYD deben eliminarse.  
* **Diseño (Layout):** El diseño visual (colores, fuentes, logos) debe ser una restauración exacta del ZIP original (pildoras-observauto-visual-main).  
* **Tipografía:** La fuente principal debe ser **Inter**.  
* **Plataforma Técnica:** La aplicación debe usar React, Vite, Supabase (para todo el backend) y estar lista para ser desplegada en Vercel desde un repositorio de GitHub.  
* **Diseño Responsive:** El layout debe ser pulido y unificado para tablets y móviles.  
* **Contenido de Cápsulas:** La aplicación debe incluir las 18 cápsulas originales (confirmado en el ZIP).  
* **Autenticación (Capa 1 \- Gate):**  
  * Debe haber una barrera de acceso temporal (confirmada como AccessGate.tsx en el ZIP) que solicite el código **"013"** como *único* punto de entrada a todo el sitio.  
  * Esta pantalla NO debe mostrar opciones de Google Sign-in ni la guía de uso.  
  * Esta barrera debe ser permanente (hasta que se indique lo contrario) y tener un tiempo de sesión de 1 hora.  
  * Debe ser fácilmente activable/desactivable en el código para el lanzamiento futuro.  
* **Autenticación (Capa 2 \- Principal):**  
  * Solo después de ingresar el código "013", el usuario accede a la plataforma completa.  
  * El login con Google (confirmado como AuthContext.tsx y Navbar.tsx en el ZIP) es **opcional** y se usa para la gamificación (ganar puntos, badges, etc.).  
  * El botón de Google Sign-in debe estar en la barra de navegación (navbar).  
  * El botón debe incluir el logo de Google y el texto **"Entrar / Crear Cuenta"**.  
  * El estilo del botón debe ser cuadrado con bordes redondeados, idéntico a los otros botones del navbar (no en forma de píldora).  
  * Al hacer login, el **avatar (foto) del usuario** debe aparecer en el header.  
  * La pantalla de consentimiento de Google OAuth debe mostrar "Cápsulas Observauto", no la URL de Supabase.  
* **Experiencia de Usuario (UX) y Navegación:**  
  * **Guía de Uso (5 Pasos):**  
    * Debe existir una guía modal de 5 pasos.  
    * Debe mostrarse automáticamente *una sola vez* al usuario (después de pasar el gate "013").  
    * Después de la primera vez, solo debe ser accesible mediante un botón **"?"** en la barra de navegación (confirmado en Navbar.tsx).  
    * El botón duplicado "? guía de uso" que estaba en el home debe ser eliminado.  
  * **Flujo de Registro (Modal de Advertencia):**  
    * Los usuarios *no registrados* pueden ver y leer el contenido de las cápsulas.  
    * Debe aparecer un modal de advertencia/registro **al inicio** de una cápsula (no al final en el quiz).  
    * Este modal debe comunicar claramente que el registro es necesario para **"obtener premios, insignias y puntos"**.  
    * El botón de registro en este modal debe iniciar el flujo de Google Sign-in.  
    * Importante: Después de registrarse, el usuario debe **volver automáticamente a la cápsula** donde estaba.  
  * **Sistema de Favoritos:**  
    * El sistema de "Favoritos" (confirmado por OnlyFavoritesContext.tsx en el ZIP) debe ser completamente funcional.  
    * Los favoritos deben guardarse en el **perfil de Supabase** del usuario, no en localStorage.  
    * Los botones de "Solo Favoritos" de debajo del hero deben eliminarse.  
    * La funcionalidad debe unificarse en el botón **"Favoritos"** del navbar, que también debe mostrar un contador y navegar a la página de favoritos.  
  * **Diseciño del Navbar (Layout):**  
    * Debe eliminarse el icono duplicado de "Premios" (trofeo).  
    * El orden de los elementos (de izquierda a derecha) debe ser: **Avatar | Premios | Favoritos | Compartir | Switch Día/Noche | Guía (?) | Salir**.  
    * Debe eliminarse la franja blanca visible entre el navbar y el contenido/hero.  
* **Gamificación y Sistema de Puntos (Crítico):**  
  * **Reinicio Total:** Todo el sistema de puntos y gamificación (confirmado por GamificationContext.tsx) debe ser **borrado y reconstruido desde cero** para asegurar que no haya bugs.  
  * **Fuente de Verdad (¡MUY IMPORTANTE\!):**  
    * **Supabase** debe ser la única fuente de verdad para los puntos.  
    * Los puntos **no deben perderse** al salir y volver a entrar o al cambiar de pestaña.  
    * La barra de navegación (Navbar) debe actualizar los puntos **en tiempo real** (sin recargar) después de ganar o canjear puntos.  
  * **Lógica de Puntos:**  
    * El cálculo del nivel de usuario debe ser lógico y basarse en los puntos reales (ej. no Nivel 3 con 0 puntos).  
    * Las insignias (badges) deben asignarse correctamente.  
  * **Límites de Gamificación:**  
    * Un usuario solo puede recibir puntos por la misma cápsula un máximo de **dos veces** (limitado por email y documento de identidad).  
    * Un usuario solo puede canjear el mismo premio un máximo de **dos veces** (limitado por email y documento de identidad).  
  * **Incentivos de Patrocinador:**  
    * Algunos premios específicos solo pueden ser redimidos si el usuario ha completado cápsulas de patrocinadores específicos.  
* **Panel de Control Unificado (Dashboard de Usuario):**  
  * **Unificación (¡MUY IMPORTANTE\!):** Las secciones "Dashboard" (/backoffice) y "Premios" (/gamificacion) (ambas confirmadas en el ZIP) deben **fusionarse en un solo panel**.  
  * **Seguridad:** Este panel unificado solo debe ser visible para usuarios **logeados**.  
  * **Vista Pública (No Logeado):** Si un usuario no logeado accede, solo debe ver una versión pública que muestre "premios, insignias posibles y estructura de cómo ganar puntos", pero nada de datos personales.  
  * **Icono del Navbar:** El icono para acceder a este panel debe ser un icono de "Dashboard" (ej. LayoutDashboard), no el mismo icono de "Premios" (trofeo).  
  * **Funcionalidad de Pestañas (Tabs) del Panel Unificado:**  
    1. **Resumen:** Puntos, nivel, progreso general.  
    2. **Premios (Catálogo):** Los premios disponibles para canjear.  
    3. **Insignias:** Los badges que el usuario ha desbloqueado.  
    4. **Premios Canjeados (Historial):**  
       * Debe existir una pestaña para "Premios Canjeados" (o "Reclamados").  
       * Debe mostrar el historial de premios que el usuario ya canjeó.  
       * El usuario debe poder consultar su **código único de redención** aquí.  
       * Debe haber 4 estados de premios: disponibles, puntos por canjear, canjeados (con código) y reclamados (entregados por admin).  
    5. **Cápsulas (Progreso):**  
       * Debe mostrar **únicamente** las cápsulas "en progreso" o "completadas".  
       * Si el usuario no ha hecho ninguna, debe aparecer vacío o con un mensaje (no mostrar todas las cápsulas disponibles).  
    6. **Perfil (Editar Perfil):**  
       * El botón "Editar Perfil" debe ser funcional.  
       * Debe cargar los datos reales del usuario desde Google (no "Usuario Demo").  
       * Debe incluir campos obligatorios para canjear premios: **Teléfono** y **Documento de Identidad**.  
       * El campo de teléfono debe tener un **desplegable de país**.  
       * Se puede incentivar con puntos extra el rellenar más datos demográficos.  
  * **Ajustes de UI del Dashboard:**  
    * Eliminar el recuadro naranja de "Tiempo Total".  
    * Reemplazarlo por un recuadro de "Premios Obtenidos" (contador de premios canjeados).  
    * Debe incluir un "resumen de cuenta" o historial de todas las transacciones de puntos (ganancias y gastos).  
* **Backoffice (Admin y Sponsor):**  
  * Debe haber 3 niveles de backoffice (confirmados por la estructura backoffice/ en el ZIP): Usuario Final (ya descrito), Administrador General y Sponsor.  
  * **Administrador General:**  
    * Ver todos los usuarios y su progreso (avances por usuario).  
    * Gestionar (crear/editar) cápsulas, micro-cápsulas, niveles, secciones y premios.  
    * Gestionar un sistema de **Sponsors Globales** (para cambiar BYD) y espacios de pauta.  
    * Poder marcar un premio como **"entregado"** después de verificar el código único.  
  * **Sponsor (Cliente):**  
    * Ver estadísticas de sus cápsulas patrocinadas (visitas, progreso).  
    * Ver usuarios que han canjeado premios.  
* **Proceso de Desarrollo (Mandatorio):**  
  * **Base de Código Fuente (¡Importante\!):** El proyecto de referencia para todas las modificaciones es el archivo **BACKUP\_FINAL\_CAPSULAS\_OBSERVAUTO\_20251104\_110455.zip**. Este archivo es el más reciente, pero contiene errores que debemos solucionar.  
  * **No Dañar:** NUNCA dañar, modificar o eliminar funcionalidades que ya están aprobadas y funcionando.  
  * **No Cambiar Diseño:** NO cambiar diseño gráfico o colores a menos que sea solicitado explícitamente.  
  * **Backups (¡Crítico\!):** SIEMPRE hacer un backup completo de la versión funcional *antes* de cada nuevo deploy.  
  * **Control de Versiones (¡Crítico\!):** Conectar a GitHub (https://github.com/observauto/capsulas-observauto) y hacer un *commit* separado para cada cambio o arreglo, permitiendo hacer rollback a versiones estables.  
  * **Testing Limpio (¡Crítico\!):** ANTES de cada deploy de prueba, borrar todos los usuarios y datos de la base de datos de Supabase para testear desde cero.  
  * **Metodología:** Trabajar lento, paso a paso, con doble chequeo, y presentar un roadmap antes de iniciar cambios.