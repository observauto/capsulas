import { FullCapsule } from "@/types/capsule";

// Full capsule data - simulating future database content
// TODO: Replace with API calls to Lovable Cloud + PostgreSQL backend

export const FULL_CAPSULES: FullCapsule[] = [
  // Capsule NEW 1: Cómo elegir el camión adecuado (con gamificación) - DFAC
  {
    id: "camion_flota_full",
    slug: "camion-flota-empresarial",
    mode: "wizard",
    title: "Cómo elegir el modelo adecuado de camión para tu flota empresarial",
    summary: "Aprende a seleccionar el camión perfecto para tu operación: capacidad de carga, eficiencia, costos operativos y tecnología disponible en el mercado colombiano.",
    difficulty: "intermediate",
    sponsors: [
      {
        name: "DFAC | DONGFENG",
        logoUrl: "https://placehold.co/200x80/D70102/FFFFFF?text=DFAC",
        link: "https://www.dfac.com",
        accentColor: "#D70102",
      },
    ],
    sections: [
      {
        id: "intro_camion",
        order: 1,
        type: "intro",
        title: "La decisión correcta empieza aquí",
        content: "Elegir el camión adecuado para tu flota empresarial es una inversión crítica que impacta directamente la rentabilidad de tu operación. No se trata solo de capacidad de carga: eficiencia de combustible, mantenimiento, versatilidad y tecnología son factores determinantes. En esta cápsula aprenderás a evaluar cada aspecto para tomar la mejor decisión según tus necesidades específicas de transporte.",
      },
      {
        id: "concept_camion_1",
        order: 2,
        type: "concept",
        title: "Capacidad de carga: El punto de partida",
        content: "La capacidad de carga útil (payload) es el primer criterio de selección. Debes considerar no solo el peso máximo que transportarás, sino también el volumen. Un camión NPR puede manejar hasta 4.5 toneladas, ideal para distribución urbana. Los modelos NQR y NKR ofrecen entre 5-7 toneladas para operaciones medianas. Para cargas pesadas, los FTR y FSR manejan 8-12 toneladas. Recuerda: sobrecargar reduce vida útil del vehículo, aumenta consumo y puede generar multas. También considera la distribución de peso: ¿necesitas caja seca, refrigerada, plataforma o tanque? Cada configuración afecta el centro de gravedad y manejo del vehículo.",
      },
      {
        id: "concept_camion_2",
        order: 3,
        type: "concept",
        title: "Eficiencia de combustible: El costo oculto",
        content: "El combustible representa 30-40% del costo operativo total de una flota. Motores modernos con tecnología common rail y turbocompresor pueden alcanzar 8-12 km/galón en rutas mixtas. Factores que afectan consumo: peso de carga, aerodinámica del vehículo, estilo de conducción y mantenimiento. Camiones con transmisiones automatizadas o AMT optimizan cambios de marcha reduciendo consumo hasta 15%. Sistemas start-stop apagan motor en semáforos largos. Monitoreo telemático permite identificar conductores ineficientes y rutas que consumen más combustible. Hacer proyecciones precisas de consumo es vital: diferencias de 1 km/galón pueden significar millones en ahorro anual en flotas grandes.",
      },
      {
        id: "tips_camion_1",
        order: 4,
        type: "tips",
        title: "Tips para reducir costos operativos",
        content: "Optimiza tu flota con estas recomendaciones prácticas:",
        tips: [
          "Implementa programa de mantenimiento preventivo estricto: cambia aceite, filtros y revisa componentes según kilometraje, no 'cuando se dañe'",
          "Capacita conductores en técnicas de conducción eficiente: aceleraciones suaves, anticipación de frenadas, uso correcto de marchas",
          "Utiliza neumáticos de baja resistencia al rodamiento y mantén presión óptima (verificar semanalmente)",
          "Evalúa rutas regularmente con GPS/telemática para identificar optimizaciones que reduzcan kilómetros innecesarios",
          "Considera camiones con garantías extendidas y planes de servicio que incluyan mano de obra y repuestos",
        ],
      },
      {
        id: "concept_camion_3",
        order: 5,
        type: "concept",
        title: "Tecnología y conectividad: El futuro es ahora",
        content: "Los camiones modernos son computadoras sobre ruedas. Sistemas telemáticos permiten rastreo en tiempo real, diagnóstico remoto de fallas, análisis de comportamiento del conductor y planificación de mantenimiento predictivo. ABS y control de estabilidad son estándar, pero modelos premium ofrecen asistencia de frenado de emergencia, alerta de cambio de carril y cámaras 360°. Conectividad 4G permite actualizaciones OTA (over-the-air) del software del vehículo sin visitar taller. Dashboard digital reemplaza instrumentos analógicos mostrando información crítica: consumo instantáneo, nivel de DPF (filtro de partículas), temperatura de frenos. En Colombia, flotas grandes están adoptando IoT para gestión centralizada: saber cuántos kilómetros tiene cada unidad, cuándo necesita servicio, qué conductor la opera y su eficiencia en tiempo real.",
      },
      {
        id: "case_camion_1",
        order: 6,
        type: "case",
        title: "Caso práctico: Distribución urbana vs. Logística intermunicipal",
        content: "Analicemos dos escenarios. Escenario A: Empresa de bebidas con distribución en Bogotá. Necesitan múltiples paradas diarias, espacios reducidos, rampas de carga. Solución ideal: Camiones NPR (4-5 ton) con caja corta, radio de giro reducido, suspensión suave para proteger carga frágil. Motor diésel eficiente en ciudad (arranque/parada constante). Cabina cómoda porque conductor pasa 8+ horas dentro. Escenario B: Operador logístico con rutas Bogotá-Medellín-Cali. Necesitan máxima capacidad, eficiencia en carretera, durabilidad. Solución ideal: Camiones NQR o FTR (6-10 ton), caja larga, motor potente para pendientes, aerodinámica optimizada, transmisión con overdrive para autopista. Asientos con suspensión neumática y controles de crucero adaptativos para reducir fatiga en viajes largos. En ambos casos, servicio postventa cerca de rutas frecuentes es crítico.",
      },
      {
        id: "summary_camion",
        order: 7,
        type: "summary",
        title: "Resumen: La fórmula para elegir correctamente",
        content: "Has aprendido que elegir el camión ideal requiere analizar múltiples factores interconectados. Primero, define tu operación: ¿urbana o interurbana? ¿Carga general o especializada? Segundo, calcula capacidad real necesaria (peso y volumen) con margen de crecimiento. Tercero, proyecta costos operativos considerando combustible, mantenimiento, seguros y depreciación. Cuarto, evalúa tecnología disponible que optimice eficiencia y seguridad. Quinto, verifica disponibilidad de servicio postventa en tus rutas principales. DFAC | DONGFENG ofrece soluciones integrales con tecnología probada, eficiencia comprobada y respaldo local. La decisión correcta no es el camión más grande ni el más barato, sino el que maximiza tu retorno de inversión a largo plazo.",
      },
      {
        id: "quiz_intro_camion",
        order: 8,
        type: "quizIntro",
        title: "Evalúa tu conocimiento sobre selección de camiones",
        content: "Es momento de verificar que comprendiste los criterios clave para elegir el camión ideal para tu flota. Este quiz cubre capacidad, eficiencia, tecnología y casos prácticos. ¡Demuestra tu expertise!",
      },
    ],
    quiz: [
      {
        id: "qc1",
        order: 1,
        question: "¿Cuál es el rango de capacidad de carga típico de un camión NPR?",
        options: ["2-3 toneladas", "4-5 toneladas", "8-10 toneladas", "12-15 toneladas"],
        correctIndex: 1,
        explanation: "Los camiones NPR están diseñados para distribución urbana con capacidad de 4-5 toneladas, ideal para múltiples paradas y maniobras en espacios reducidos.",
      },
      {
        id: "qc2",
        order: 2,
        question: "¿Qué porcentaje del costo operativo total representa típicamente el combustible?",
        options: ["10-15%", "20-25%", "30-40%", "50-60%"],
        correctIndex: 2,
        explanation: "El combustible representa entre 30-40% del costo operativo total, por lo que elegir un camión eficiente impacta significativamente la rentabilidad.",
      },
      {
        id: "qc3",
        order: 3,
        question: "¿Qué tecnología permite el diagnóstico remoto de fallas en camiones modernos?",
        options: ["ABS", "GPS básico", "Sistemas telemáticos", "Control de crucero"],
        correctIndex: 2,
        explanation: "Los sistemas telemáticos conectan el camión a internet permitiendo diagnóstico remoto, rastreo en tiempo real, análisis de conducción y mantenimiento predictivo.",
      },
      {
        id: "qc4",
        order: 4,
        question: "Para distribución urbana con múltiples paradas, ¿qué característica es prioritaria?",
        options: ["Máxima velocidad", "Radio de giro reducido", "Caja larga", "Motor de alta potencia"],
        correctIndex: 1,
        explanation: "En distribución urbana, el radio de giro reducido es crítico para maniobrar en calles estrechas y espacios de carga limitados con facilidad.",
      },
    ],
  },

  // Capsule NEW 2: Gas Natural Vehicular (sin gamificación) - GNV Vanti
  {
    id: "gnv_transporte_full",
    slug: "gas-natural-vehicular",
    mode: "article",
    title: "Gas Natural Vehicular: Solución sostenible para transporte de carga",
    summary: "Descubre por qué el GNV es la alternativa más económica y ecológica para flotas de transporte de carga en Colombia: ahorro de combustible, reducción de emisiones y red de estaciones en crecimiento.",
    difficulty: "beginner",
    sponsors: [
      {
        name: "GNV | VANTI",
        logoUrl: "https://placehold.co/200x80/00447c/FFFFFF?text=VANTI+GNV",
        link: "https://www.grupovanti.com",
        accentColor: "#00447c",
      },
    ],
    sections: [
      {
        id: "intro_gnv",
        order: 1,
        type: "intro",
        title: "El futuro del transporte de carga ya llegó",
        content: "El Gas Natural Vehicular (GNV) está revolucionando el transporte de carga en Colombia. Con ahorros de hasta 50% en costos de combustible comparado con diésel, reducción significativa de emisiones contaminantes, y una infraestructura en expansión constante, el GNV se consolida como la alternativa más inteligente para flotas empresariales. Ya no es una tecnología experimental: grandes operadores logísticos están convirtiendo sus flotas completas a GNV con resultados comprobados.",
      },
      {
        id: "concept_gnv_1",
        order: 2,
        type: "concept",
        title: "¿Qué es el GNV y cómo funciona?",
        content: "El Gas Natural Vehicular es metano comprimido a alta presión (200-250 bar) almacenado en cilindros reforzados. A diferencia de GLP (gas licuado de petróleo), el GNV es más liviano que el aire y se disipa rápidamente en caso de fuga, haciéndolo más seguro. Los motores GNV son prácticamente idénticos a los de gasolina/diésel pero adaptados con inyectores especiales y sistema de almacenamiento de alta presión. Existen dos configuraciones: Dedicado (solo GNV) y Bi-combustible (GNV + gasolina/diésel). Para transporte de carga, lo ideal es dedicado para maximizar eficiencia. El proceso de combustión del gas natural es más limpio: produce hasta 25% menos CO2, 80% menos NOx, y prácticamente cero material particulado comparado con diésel. Esto no solo beneficia el medio ambiente, también reduce costos de mantenimiento del motor.",
      },
      {
        id: "concept_gnv_2",
        order: 3,
        type: "concept",
        title: "Ahorro económico real: Los números hablan",
        content: "El precio del GNV en Colombia es aproximadamente 40-50% inferior al diésel por equivalente energético. Ejemplo práctico: Un camión que recorre 5,000 km/mes consumiendo 500 litros de diésel ($13,000 pesos/litro) gasta $6,500,000 mensuales. El mismo camión en GNV consume equivalente a 550 kg de gas ($2,400 pesos/kg) = $1,320,000 mensuales. Ahorro mensual: $5,180,000. Ahorro anual: $62,160,000 por vehículo. En una flota de 10 camiones, eso es $621,600,000 al año. La conversión a GNV cuesta entre $30-50 millones dependiendo del tamaño del vehículo, lo que significa ROI (retorno de inversión) en 6-12 meses. Además, algunos municipios ofrecen descuentos en peajes y zonas de circulación preferencial para vehículos GNV. Importante: estos ahorros son sostenibles a largo plazo porque el precio del gas natural es más estable que los hidrocarburos líquidos, menos afectado por fluctuaciones internacionales.",
      },
      {
        id: "concept_gnv_3",
        order: 4,
        type: "concept",
        title: "Infraestructura de carga: Red en expansión",
        content: "Colombia cuenta con más de 700 estaciones de GNV a nivel nacional, concentradas en principales corredores logísticos: Bogotá-Medellín, Bogotá-Cali, Eje Cafetero. El tiempo de carga es comparable al diésel: llenar un tanque de 80 kg toma 5-8 minutos. Vanti, el principal operador, está expandiendo su red estratégicamente en zonas industriales y centros logísticos. Flotas grandes pueden instalar estaciones privadas (madre de abastecimiento) con suministro directo desde gasoducto, eliminando desplazamientos a estaciones públicas y reduciendo aún más costos. La presión del GNV (200-250 bar) permite autonomía real de 300-400 km en camiones medianos y 500-700 km en camiones pesados con tanques de mayor capacidad. Para rutas intermunicipales, planificar paradas estratégicas en estaciones GNV es sencillo con apps de navegación especializadas que muestran ubicación, disponibilidad y precios en tiempo real.",
      },
      {
        id: "concept_gnv_4",
        order: 5,
        type: "concept",
        title: "Impacto ambiental: Más que marketing verde",
        content: "El transporte de carga es responsable de 30% de emisiones de CO2 del sector transporte en Colombia. Migrar a GNV reduce significativamente esta huella: 25% menos CO2 (gas natural es CH4, combustión más eficiente). 80% menos NOx (óxidos de nitrógeno, causantes de smog y problemas respiratorios). Casi 0% material particulado (PM2.5 y PM10, principales contaminantes del diésel). 50% menos ruido (motores GNV son más silenciosos, importante en distribución urbana nocturna). Esto no solo cumple regulaciones ambientales cada vez más estrictas, también mejora imagen corporativa. Empresas logísticas con flotas GNV destacan su compromiso ambiental en licitaciones públicas y privadas, ganando puntos en evaluaciones ESG (Environmental, Social, Governance). Además, evitar zonas de restricción por contaminación (pico y placa ambiental) mejora disponibilidad operativa.",
      },
      {
        id: "concept_gnv_5",
        order: 6,
        type: "concept",
        title: "Mantenimiento: Motor más limpio, menos costos",
        content: "Los motores GNV requieren menos mantenimiento que diésel por varias razones: combustión más limpia reduce depósitos de carbonilla en cámara de combustión, pistones y válvulas. Aceite de motor se mantiene limpio por más tiempo, extendiendo intervalos de cambio de 10,000 a 15,000 km. No hay filtros de partículas (DPF) ni sistemas SCR de urea (AdBlue), eliminando componentes caros y problemáticos del diésel. Sistema de inyección más simple con menos componentes de precisión extrema. Los cilindros de GNV tienen vida útil de 15-20 años con inspecciones periódicas obligatorias. Componentes a vigilar: reguladores de presión (cada 100,000 km), válvulas de cilindros, mangueras de alta presión. El sistema de encendido requiere bujías de mayor calidad, pero duran 60,000-80,000 km. En flotas que operan 200,000+ km/año, la reducción en tiempos de taller se traduce en mayor disponibilidad del vehículo: menos downtime = más viajes = más ingresos.",
      },
      {
        id: "concept_gnv_6",
        order: 7,
        type: "concept",
        title: "Seguridad: Desmontando mitos",
        content: "Existe percepción errónea de que el GNV es peligroso. La realidad es opuesta: el gas natural es más liviano que el aire (densidad 0.6 vs 1.0), por lo que en caso de fuga se dispersa hacia arriba y se diluye rápidamente, a diferencia de gasolina/diésel que forman charcos. Los cilindros son tanques de alta resistencia fabricados con acero o fibra de carbono, probados a presiones 3x superiores a la operativa (600-750 bar). Múltiples válvulas de seguridad previenen sobrepresión o fuga descontrolada. Sistema automático de corte detiene flujo en caso de accidente o incendio. Temperatura de ignición del metano es 650°C vs 280°C del diésel (más difícil de encender accidentalmente). En Colombia, la instalación y mantenimiento de sistemas GNV está regulada por el Ministerio de Minas y Energía con inspecciones obligatorias. Flotas operando GNV por décadas reportan índices de accidentes relacionados con combustible menores que con hidrocarburos líquidos. La clave es seguir protocolos de mantenimiento y capacitar conductores en procedimientos correctos.",
      },
      {
        id: "summary_gnv",
        order: 8,
        type: "summary",
        title: "GNV: La decisión inteligente para tu flota",
        content: "El Gas Natural Vehicular no es el futuro, es el presente del transporte de carga sostenible en Colombia. Ofrece ahorro económico comprobado (40-50% en combustible), reducción ambiental significativa (25% menos CO2, 80% menos NOx), menor mantenimiento (aceite más limpio, sin DPF/SCR), infraestructura en expansión (700+ estaciones), y seguridad probada (cilindros certificados, gas más liviano que aire). El ROI es rápido (6-12 meses) y los ahorros son sostenibles a largo plazo. Vanti y otros operadores ofrecen asesoría completa para conversión de flotas, financiamiento y ubicación estratégica de estaciones. Ya sea distribución de última milla o logística intermunicipal, existe una solución GNV adaptada a tu operación. Convertir tu flota a GNV no solo mejora rentabilidad, también posiciona tu empresa como líder en responsabilidad ambiental. Es momento de hacer el cambio.",
      },
    ],
    // NO quiz - esta cápsula es solo informativa
  },

  // Capsule 1: Wizard Mode (Step-by-step tutorial)
  {
    id: "identifica_modelos_full",
    slug: "identifica-modelos",
    mode: "wizard",
    title: "Identifica modelos",
    summary: "Aprende a reconocer marcas, modelos y generaciones de vehículos con solo observar detalles clave como faros, parrillas y líneas de diseño.",
    difficulty: "beginner",
    sections: [
      {
        id: "intro_1",
        order: 1,
        type: "intro",
        title: "Bienvenido al mundo de la identificación automotriz",
        content: "En esta cápsula aprenderás a identificar vehículos como un experto. Cada auto tiene características únicas que lo distinguen, y con práctica, podrás reconocerlos al instante. Esta habilidad no solo te hará quedar bien en conversaciones, sino que también es práctica al momento de comprar un auto o simplemente disfrutar del automovilismo.",
      },
      {
        id: "concept_1",
        order: 2,
        type: "concept",
        title: "Faros delanteros: La firma de cada marca",
        content: "Los faros son la firma visual de cada fabricante. BMW es reconocido mundialmente por sus 'ojos de ángel' (Angel Eyes), anillos luminosos que rodean las luces principales. Mercedes-Benz se distingue por sus elegantes luces LED en forma de flecha o 'cejas', especialmente visibles en sus modelos más recientes. Audi revolucionó el diseño con su matriz LED característica, conocida como 'firma luminosa', que se ha convertido en icónica de la marca. Cada fabricante invierte millones en el diseño de faros porque saben que es uno de los primeros elementos que identificamos al ver un vehículo, incluso de noche o a la distancia.",
      },
      {
        id: "tips_1",
        order: 3,
        type: "tips",
        title: "Consejos para identificar faros",
        content: "Sigue estos tips para volverte un experto en identificación por faros:",
        tips: [
          "Observa la forma general: ¿Son angulosos o redondeados? Los autos deportivos suelen tener faros más agresivos y angulosos",
          "Mira la tecnología: LED, Xenón o halógeno. Los LEDs permiten diseños más creativos y distintivos",
          "Identifica la 'firma diurna' (DRL): Muchas marcas tienen un patrón único de luces diurnas que es su sello",
          "Compara entre generaciones: Los fabricantes evolucionan sus faros manteniendo elementos reconocibles",
          "Practica de noche: Las luces encendidas hacen más evidentes las características únicas de cada marca"
        ],
      },
      {
        id: "concept_2",
        order: 4,
        type: "concept",
        title: "Parrillas distintivas: La huella digital del auto",
        content: "La parrilla frontal es como una huella digital automotriz. Jeep mantiene sus legendarias siete ranuras verticales desde 1941, un diseño tan icónico que está registrado como marca. Alfa Romeo exhibe con orgullo su escudo triangular (Scudetto) con la cruz roja de Milán y la serpiente Visconti. BMW presenta sus característicos 'riñones' (Kidney Grille), que han crecido en tamaño con cada generación, generando debates apasionados entre puristas y modernistas. Algunos fabricantes iluminan sus parrillas, otros las cromán, y algunos las hacen activas (se abren y cierran según temperatura). Cada decisión de diseño tiene propósito: estética, aerodinámica y cooling del motor.",
      },
      {
        id: "case_1",
        order: 5,
        type: "case",
        title: "Caso práctico: Diferenciando BMW Serie 3",
        content: "Imagina que ves un BMW Serie 3 en la calle. ¿Cómo sabes si es un modelo 2010 o 2020? Los riñones son la primera pista: en el E90 (2005-2011) eran más pequeños y separados. En el F30 (2012-2019) crecieron y se conectaron levemente. En el G20 (2019-presente) son más grandes, más anchos y se integran más con el capó. Los faros también evolucionaron: el E90 tenía luces circulares 'Angel Eyes', el F30 adoptó LEDs más angulosos, y el G20 presenta una firma luminosa más afilada y agresiva. Estas diferencias sutiles pero consistentes te permiten identificar la generación exacta con un vistazo.",
      },
      {
        id: "concept_3",
        order: 6,
        type: "concept",
        title: "Emblemas y badges: Descifrando el código de rendimiento",
        content: "Los emblemas cuentan historias de ingeniería, rendimiento y herencia. 'AMG' en un Mercedes significa que fue preparado por los magos de Affalterbach, con motores más potentes y suspensión deportiva. 'M' en BMW (M3, M5, M8) indica que pasó por Motorsport Division, con motores high-revving y chasis track-ready. 'Type R' en Honda representa Racing, vehículos preparados para pista con tecnología de F1. 'RS' en Audi significa RennSport (Racing Sport), versiones extremas con motor central o tracción quattro reforzada. Incluso la posición del emblema importa: Mercedes centra su estrella en el capó en modelos clásicos, pero en versiones AMG prefiere la parrilla. Aprender a leer badges es como aprender otro idioma del mundo automotor.",
      },
      {
        id: "summary_1",
        order: 7,
        type: "summary",
        title: "Resumen: Conviértete en un identificador experto",
        content: "Has aprendido las tres claves para identificar cualquier vehículo: faros (la firma visual), parrillas (la huella digital) y emblemas (el lenguaje de rendimiento). Ahora sabes que BMW se reconoce por sus riñones y ojos de ángel, Mercedes por sus estrellas y flechas LED, Audi por su matriz LED distintiva. Entiendes que los badges AMG, M, Type R y RS no son solo adornos, sino indicadores de tecnología y rendimiento superiores. Con práctica constante, podrás identificar marca, modelo y hasta generación con un vistazo rápido. ¡El siguiente paso es practicar en la calle!",
      },
      {
        id: "quiz_intro_1",
        order: 8,
        type: "quizIntro",
        title: "Pon a prueba tus conocimientos",
        content: "Es momento de comprobar lo aprendido. El siguiente quiz evaluará tu capacidad para identificar vehículos basándote en faros, parrillas y emblemas. No te preocupes si no aciertas todas: la práctica hace al maestro. ¡Buena suerte!",
      },
    ],
    quiz: [
      {
        id: "q1",
        order: 1,
        question: "¿Qué marca es famosa por sus faros 'Angel Eyes' o 'ojos de ángel'?",
        options: ["Mercedes-Benz", "BMW", "Audi", "Volkswagen"],
        correctIndex: 1,
        explanation: "BMW es conocido mundialmente por sus faros Angel Eyes, anillos luminosos que rodean las luces principales y se han convertido en su firma distintiva.",
      },
      {
        id: "q2",
        order: 2,
        question: "Las legendarias siete ranuras verticales son características de:",
        options: ["Land Rover", "Jeep", "Toyota", "Ford"],
        correctIndex: 1,
        explanation: "Jeep mantiene sus siete ranuras verticales desde 1941, un diseño tan icónico que está registrado como marca comercial.",
      },
      {
        id: "q3",
        order: 3,
        question: "¿Qué significa el badge 'AMG' en un Mercedes-Benz?",
        options: [
          "Automatic Manual Gearbox",
          "Advanced Motion Guidance",
          "Affalterbach Motor Group (división de alto rendimiento)",
          "All-Wheel Motion Generator"
        ],
        correctIndex: 2,
        explanation: "AMG es la división de alto rendimiento de Mercedes-Benz, originalmente fundada en Affalterbach, que prepara vehículos con motores más potentes y tecnología deportiva.",
      },
      {
        id: "q4",
        order: 4,
        question: "¿Cuál es el apodo de la parrilla frontal de BMW?",
        options: ["Scudetto", "Riñones", "Estrella", "Matriz"],
        correctIndex: 1,
        explanation: "La parrilla de BMW se conoce como 'riñones' (Kidney Grille) por su forma característica, presente en todos sus modelos desde 1933.",
      },
      {
        id: "q5",
        order: 5,
        question: "La firma luminosa con matriz LED es característica de:",
        options: ["Audi", "BMW", "Mercedes-Benz", "Todas las anteriores"],
        correctIndex: 3,
        explanation: "Aunque Audi popularizó la tecnología de matriz LED y su firma luminosa distintiva, actualmente las tres marcas alemanas premium utilizan matrices LED con sus propias firmas visuales únicas.",
      },
    ],
  },

  // Capsule 2: Article Mode (Long-form with scroll)
  {
    id: "mecanica_basica_full",
    slug: "mecanica-basica",
    mode: "article",
    title: "Mecánica básica",
    summary: "Comprende cómo funciona un motor, qué hace la transmisión y por qué la suspensión es importante. Conocimiento esencial para todo conductor informado.",
    difficulty: "intermediate",
    sections: [
      {
        id: "intro_2",
        order: 1,
        type: "intro",
        title: "Introducción a la mecánica automotriz",
        content: "Un vehículo es una máquina compleja compuesta por miles de piezas que trabajan en armonía. Aunque no necesitas ser mecánico para conducir, entender los sistemas fundamentales te convierte en un conductor más informado, capaz de tomar mejores decisiones de mantenimiento y detectar problemas antes de que se vuelvan costosos. En esta cápsula exploraremos los seis sistemas esenciales que todo conductor debe conocer: motor, transmisión, frenos, suspensión, sistema eléctrico y enfriamiento. No es necesario conocimiento técnico previo, explicaremos todo desde cero de forma clara y práctica.",
      },
      {
        id: "concept_4",
        order: 2,
        type: "concept",
        title: "El corazón del auto: El motor",
        content: "El motor de combustión interna es una maravilla de ingeniería que convierte combustible líquido en movimiento. Funciona mediante el ciclo de cuatro tiempos, un proceso que se repite miles de veces por minuto: Admisión (entra mezcla de aire y combustible), Compresión (el pistón comprime la mezcla), Combustión (la chispa enciende la mezcla creando una explosión controlada), y Escape (los gases quemados salen). Este ciclo ocurre en cada cilindro de forma coordinada. Un motor de 4 cilindros es más económico y suave para uso diario. Uno de 6 cilindros ofrece balance entre potencia y refinamiento. Los V8 y V12 son el pináculo de suavidad y potencia, usados en autos de lujo y deportivos. Términos clave: Cilindrada es el volumen total de todos los cilindros (ej: 2.0L = 2000cc). Torque es la fuerza rotatoria disponible, importante para acelerar desde parado. Caballos de fuerza (HP) es la potencia máxima, importante para velocidad punta. Un motor bien entendido es un motor bien cuidado: cambios de aceite regulares, uso del combustible correcto y calentamiento apropiado prolongan su vida dramáticamente.",
      },
      {
        id: "concept_5",
        order: 3,
        type: "concept",
        title: "La transmisión: Traduciendo potencia a movimiento",
        content: "La transmisión es el puente entre motor y ruedas, modificando la relación de velocidad para optimizar rendimiento. Las transmisiones manuales te dan control total: eliges la marcha según necesidad (primera para arrancar con fuerza, quinta/sexta para autopista eficiente). Requieren coordinación embrague-acelerador pero son más económicas de mantener. Las automáticas tradicionales usan convertidor de torque y planeta de engranajes, cambiando suavemente sin intervención del conductor. CVT (Continuosly Variable Transmission) no tiene marchas fijas, usa poleas y correa para transiciones infinitamente suaves, maximizando eficiencia. Las transmisiones de doble embrague (DCT/DSG) combinan eficiencia de manual con comodidad de automática, pre-seleccionando la siguiente marcha para cambios ultra-rápidos (usadas en deportivos y premium). ¿Cuál es mejor? Depende: manual para control y costos bajos, automática para comodidad urbana, CVT para máxima eficiencia, doble embrague para rendimiento. Tips de cuidado: En automática, nunca cambies a P (parking) con el auto en movimiento. En manual, no apoyes el pie en el embrague mientras conduces. Cambia el fluido de transmisión según el manual del fabricante (típicamente 60,000-100,000 km). Una transmisión bien cuidada puede durar toda la vida del vehículo.",
      },
      {
        id: "concept_6",
        order: 4,
        type: "concept",
        title: "Sistema de frenos: Tu seguridad depende de ellos",
        content: "Los frenos convierten energía cinética (movimiento) en calor mediante fricción, deteniendo el vehículo de forma controlada. Funcionan hidráulicamente: cuando pisas el pedal, el líquido de frenos transmite presión a cada rueda instantáneamente. Los frenos de disco (usados al frente en todos los autos modernos) usan calibradores que presionan pastillas contra un disco metálico que gira con la rueda. Son superiores porque disipan calor mejor. Los frenos de tambor (aún usados atrás en autos económicos) usan zapatas que presionan desde adentro contra un tambor. Son más simples pero menos efectivos en frenadas intensas. ABS (Anti-lock Braking System) es fundamental para seguridad: detecta cuando una rueda está por bloquearse y modula la presión para mantener tracción, permitiéndote frenar y esquivar simultáneamente. Señales de problemas: Chirrido metálico = pastillas gastadas (cámbialas ya). Vibración al frenar = discos cristalizados o deformados (resurfacing o reemplazo). Pedal esponjoso = aire en el sistema (purga de frenos). Pedal que se va hasta el fondo = fuga de líquido (peligro, no conduzcas). El líquido de frenos debe cambiarse cada 2 años porque absorbe humedad, reduciendo su punto de ebullición y efectividad. Nunca escatimes en frenos: son tu seguro de vida.",
      },
      {
        id: "concept_7",
        order: 5,
        type: "concept",
        title: "Suspensión: Más allá del confort",
        content: "La suspensión es el sistema que mantiene las llantas en contacto constante con el pavimento mientras absorbe imperfecciones del camino. Su trabajo es triple: proporcionar comodidad, mantener control y preservar la integridad del vehículo. Los componentes clave son: Amortiguadores (shocks/struts) controlan el rebote de los resortes, evitando que el auto continúe rebotando después de un bache. Resortes (helicoidales o ballestas) soportan el peso del vehículo y absorben impactos iniciales. Barras estabilizadoras reducen inclinación en curvas, conectando ambos lados de la suspensión. Brazos de control y rótulas mantienen geometría correcta de las ruedas. Una suspensión calibrada balancea comodidad y manejo: demasiado suave = auto se mece y pierde control en curvas; demasiado dura = incomodidad y menor tracción en baches. Síntomas de suspensión desgastada: El auto continúa rebotando después de un bache (amortiguadores muertos). Desgaste irregular de llantas (alineación incorrecta por componentes desgastados). Ruidos metálicos en baches (bushings o rótulas gastados). El volante vibra a ciertas velocidades (balanceo necesario o componentes sueltos). Una suspensión en buen estado no solo mejora confort, también seguridad (mejor control en emergencias) y economía (menor desgaste de llantas y mejor aerodinámica).",
      },
      {
        id: "concept_8",
        order: 6,
        type: "concept",
        title: "Sistema eléctrico: El sistema nervioso del vehículo",
        content: "El sistema eléctrico es el cerebro y sistema nervioso del auto moderno. Tres componentes forman el triángulo eléctrico esencial: Batería almacena energía química (típicamente 12V) para arrancar el motor y alimentar accesorios cuando el motor está apagado. Las baterías modernas pueden durar 3-5 años con buen cuidado. Alternador es un generador que convierte energía mecánica del motor en electricidad, recargando la batería y alimentando todo mientras conduces. Genera 13.5-14.5V cuando funciona correctamente. Motor de arranque es un motor eléctrico potente que gira el motor de combustión hasta que arranca por sí mismo, demandando mucha corriente (200-400 amperes) por pocos segundos. Diagnóstico básico de problemas: Si el motor no arranca y escuchas 'clic-clic-clic' = batería descargada o conexiones flojas. Si no hay ningún sonido al girar la llave = motor de arranque muerto o fusible quemado. Si arranca pero la batería se descarga rápidamente = alternador no carga. Si las luces parpadean o se atenúan = voltaje bajo, revisar alternador y batería. Mantenimiento: Limpia terminales de batería de corrosión (pasta blanca/verde). Revisa tensión de banda del alternador. Nunca dejes luces encendidas con motor apagado por períodos largos. Si necesitas dar 'corriente' a una batería muerta: conecta cable rojo a positivos (+), negro a negativos (-), auto donante encendido, espera 5 minutos, arranca auto receptor. Autos modernos tienen docenas de computadoras (ECUs) que controlan todo desde inyección hasta climatización, todas dependientes de electricidad estable.",
      },
      {
        id: "concept_9",
        order: 7,
        type: "concept",
        title: "Sistema de enfriamiento: Controlando el infierno interno",
        content: "Un motor de combustión genera temperaturas de hasta 2000°C en las cámaras de combustión. Sin control, estas temperaturas destruirían el motor en minutos. El sistema de enfriamiento mantiene temperatura operativa ideal (90-100°C), suficiente para eficiencia pero segura para componentes. Componentes principales: Radiador es un intercambiador de calor que disipa calor del refrigerante al aire. Usa aletas finas y tubos para maximizar superficie de contacto. Bomba de agua (water pump) circula refrigerante constantemente entre motor y radiador, típicamente movida por banda del motor. Termostato es una válvula inteligente que permanece cerrada cuando el motor está frío (acelerando calentamiento) y se abre cuando alcanza temperatura operativa (permitiendo flujo al radiador). Refrigerante (coolant/antifreeze) no es solo agua: contiene aditivos que previenen congelamiento, ebullición, corrosión y lubrica la bomba. Debe cambiarse cada 2-5 años porque los aditivos se degradan. Ventilador(es) eléctrico se activan cuando refrigerante alcanza cierta temperatura, forzando aire a través del radiador incluso cuando el auto está detenido. Señales críticas de sobrecalentamiento: Indicador de temperatura en zona roja. Vapor saliendo del capó. Olor dulce (refrigerante quemándose). Pérdida notable de potencia. Si tu motor se sobrecalienta: Detente inmediatamente en lugar seguro. No abras el radiador con motor caliente (puede explotar). Deja enfriar 30+ minutos. Verifica nivel de refrigerante cuando esté frío. Si está bajo, puede haber fuga. Un motor sobrecalentado puede fundir pistones, deformar la cabeza del motor o romper el block: reparaciones de $12-32 millones de pesos. Prevención: revisa nivel de refrigerante mensualmente, reemplaza según schedule, inspecciona mangueras por grietas. Una falla eléctrica en el ventilador o termostato pegado cerrado son causas comunes y fáciles de prevenir.",
      },
      {
        id: "summary_2",
        order: 8,
        type: "summary",
        title: "Resumen: Domina los fundamentos mecánicos",
        content: "Ahora comprendes los seis sistemas críticos de tu vehículo. El motor convierte combustible en movimiento mediante el ciclo de cuatro tiempos. La transmisión adapta esa potencia para diferentes situaciones de manejo. Los frenos te detienen de forma segura usando presión hidráulica y fricción. La suspensión mantiene control y confort absorbiendo irregularidades. El sistema eléctrico alimenta todo mediante el triángulo batería-alternador-arranque. El enfriamiento previene daño térmico manteniendo temperatura óptima. Con este conocimiento puedes: mantener tu vehículo preventivamente, detectar problemas temprano ahorrando dinero, comunicarte efectivamente con mecánicos, y tomar decisiones informadas al comprar un auto. El siguiente paso es aplicar este conocimiento: abre el capó de tu auto, identifica estos sistemas, lee el manual del propietario y sigue el programa de mantenimiento. Un conductor informado es un conductor empoderado.",
      },
      {
        id: "quiz_intro_2",
        order: 9,
        type: "quizIntro",
        title: "Evalúa tu comprensión mecánica",
        content: "Es momento de poner a prueba tus conocimientos sobre los sistemas fundamentales del vehículo. Este quiz evaluará tu comprensión de motor, transmisión, frenos, suspensión, electricidad y enfriamiento. Cada pregunta tiene una explicación detallada para reforzar tu aprendizaje. ¡Adelante!",
      },
    ],
    quiz: [
      {
        id: "q2_1",
        order: 1,
        question: "¿Cuál es el orden correcto del ciclo de cuatro tiempos en un motor de combustión?",
        options: [
          "Combustión, Admisión, Compresión, Escape",
          "Admisión, Compresión, Combustión, Escape",
          "Compresión, Admisión, Escape, Combustión",
          "Admisión, Combustión, Compresión, Escape"
        ],
        correctIndex: 1,
        explanation: "El ciclo correcto es Admisión (entra aire/combustible), Compresión (se comprime la mezcla), Combustión (explosión controlada), Escape (salen gases). Este ciclo se repite miles de veces por minuto en cada cilindro.",
      },
      {
        id: "q2_2",
        order: 2,
        question: "¿Qué tipo de transmisión NO tiene marchas fijas y usa poleas con correa?",
        options: ["Manual", "Automática tradicional", "CVT", "Doble embrague"],
        correctIndex: 2,
        explanation: "CVT (Continuously Variable Transmission) no tiene marchas fijas, usa un sistema de poleas y correa que permite variaciones infinitas de relación, optimizando eficiencia de combustible.",
      },
      {
        id: "q2_3",
        order: 3,
        question: "¿Qué significa cuando el pedal de freno se siente 'esponjoso' o suave?",
        options: [
          "Las pastillas están gastadas",
          "Los discos están deformados",
          "Hay aire en el sistema hidráulico",
          "El líquido de frenos está sucio"
        ],
        correctIndex: 2,
        explanation: "Un pedal esponjoso indica aire en las líneas hidráulicas. El aire es compresible (el líquido no), causando pérdida de presión. Se soluciona purgando el sistema para eliminar el aire.",
      },
      {
        id: "q2_4",
        order: 4,
        question: "¿Cuál componente del triángulo eléctrico se encarga de recargar la batería mientras conduces?",
        options: ["Motor de arranque", "Alternador", "Batería", "ECU"],
        correctIndex: 1,
        explanation: "El alternador es un generador que convierte energía mecánica del motor en electricidad, recargando la batería y alimentando todos los sistemas eléctricos mientras el motor está en marcha.",
      },
      {
        id: "q2_5",
        order: 5,
        question: "¿Qué componente del sistema de enfriamiento permanece cerrado cuando el motor está frío para acelerar el calentamiento?",
        options: ["Radiador", "Bomba de agua", "Termostato", "Ventilador"],
        correctIndex: 2,
        explanation: "El termostato es una válvula inteligente que permanece cerrada cuando el motor está frío, bloqueando flujo al radiador para que el motor alcance temperatura operativa rápidamente. Se abre cuando detecta que el motor está caliente.",
      },
      {
        id: "q2_6",
        order: 6,
        question: "Si tu auto continúa rebotando después de pasar por un bache, ¿qué componente de la suspensión probablemente está desgastado?",
        options: ["Resortes", "Amortiguadores", "Barras estabilizadoras", "Rótulas"],
        correctIndex: 1,
        explanation: "Los amortiguadores (shocks/struts) controlan el rebote de los resortes. Si están desgastados, no pueden amortiguar efectivamente, permitiendo que el vehículo continúe rebotando después de absorber un impacto.",
      },
    ],
  },

  // Capsule 3: Informative only (no quiz/gamification)
  {
    id: "seguridad_vial_full",
    slug: "seguridad-vial",
    mode: "article",
    title: "Seguridad vial y conducción defensiva",
    summary: "Aprende técnicas de conducción defensiva, señales de tránsito fundamentales y cómo prevenir accidentes en diferentes condiciones de manejo.",
    difficulty: "beginner",
    sections: [
      {
        id: "intro_3",
        order: 1,
        type: "intro",
        title: "La importancia de la conducción defensiva",
        content: "La conducción defensiva no es solo seguir las reglas de tránsito, es anticiparse a situaciones peligrosas y estar preparado para reaccionar correctamente. Cada año, miles de accidentes se previenen gracias a conductores que aplican técnicas defensivas. En esta cápsula aprenderás los fundamentos de la seguridad vial, desde la posición correcta al volante hasta cómo reaccionar en condiciones climáticas adversas. No importa cuántos años tengas conduciendo, siempre hay algo nuevo que aprender sobre seguridad.",
      },
      {
        id: "concept_10",
        order: 2,
        type: "concept",
        title: "La posición correcta de manejo",
        content: "La ergonomía al conducir no es solo comodidad, es seguridad. Tu asiento debe estar a una distancia donde puedas pisar el freno a fondo sin estirar completamente la pierna (mantén una flexión de 120-130 grados en la rodilla). El respaldo debe estar entre 100-110 grados de inclinación, no reclinado como si estuvieras en la playa. Tus muñecas deben descansar cómodamente sobre el volante cuando extiendes los brazos completamente. La posición de manos en el volante ha evolucionado: antes se enseñaba '10 y 2' (como las manecillas del reloj), ahora se recomienda '9 y 3' porque los airbags modernos pueden lanzar tus manos a tu cara si están en posición alta. Los espejos deben ajustarse para minimizar puntos ciegos: el retrovisor debe mostrar completamente la ventana trasera, los laterales deben mostrar apenas un pedacito de tu auto y más del carril adyacente. Muchos conductores configuran incorrectamente los espejos laterales mostrando demasiado de su propio auto, creando puntos ciegos innecesarios. El reposacabezas debe estar a la altura de tus orejas o ligeramente arriba, previniendo latigazo cervical en impactos traseros.",
      },
      {
        id: "concept_11",
        order: 3,
        type: "concept",
        title: "Distancia de seguridad: La regla de los 3 segundos",
        content: "Mantener distancia adecuada del vehículo adelante es la técnica defensiva más importante. La regla de los 3 segundos es simple pero efectiva: cuando el auto adelante pasa un punto de referencia (un poste, señal, sombra), comienza a contar '1001, 1002, 1003'. Deberías pasar ese mismo punto después de terminar de contar. Si pasas antes, estás muy cerca. Esta distancia te da tiempo para reaccionar ante frenadas súbitas. Sin embargo, 3 segundos es para condiciones ideales (clima seco, visibilidad perfecta, pavimento en buen estado). En lluvia ligera, aumenta a 4 segundos. En lluvia intensa o neblina, 6-8 segundos. En nieve o hielo, 10+ segundos no es exagerado. ¿Por qué tanto? A 100 km/h recorres 28 metros por segundo. Si el auto adelante frena de emergencia, tu tiempo de reacción (identificar peligro + mover pie a freno) es típicamente 1.5 segundos. Durante ese tiempo ya recorriste 42 metros. Luego necesitas distancia de frenado, que en lluvia se duplica. Hacer cálculos mientras conduces es imposible, por eso la regla de los 3 segundos (ajustada según condiciones) es tan práctica. Conductores agresivos pueden meterse en tu espacio de seguridad; no te enojes, simplemente reduce velocidad para recuperar tu distancia. Tu seguridad vale más que 'ganar' contra un conductor imprudente.",
      },
      {
        id: "concept_12",
        order: 4,
        type: "concept",
        title: "Manejo en condiciones climáticas adversas",
        content: "Conducir bajo lluvia cambia todo. Los primeros 10-15 minutos de lluvia son los más peligrosos porque el agua mezcla aceites acumulados en el pavimento creando una capa resbaladiza. Reduce tu velocidad 10-15 km/h menos que el límite. Aumenta distancia de seguridad dramáticamente. Evita frenar y girar simultáneamente (las llantas no pueden hacer ambas cosas efectivamente al mismo tiempo). Si llueve intensamente y tu visibilidad es menor a 50 metros, activa luces intermitentes y busca un lugar seguro para detenerte (estación de servicio, parqueadero). Hydroplaning (aquaplaning) ocurre cuando tus llantas pierden contacto con el pavimento y 'flotan' sobre el agua, típicamente arriba de 80 km/h en lluvia intensa. Si sientes pérdida de tracción repentina: no frenes, no gires, suelta acelerador suavemente y mantén volante recto hasta recuperar agarre. En neblina, usa luces bajas (high beams rebotan en la niebla cegándote). Si la niebla es densa, sigue las líneas del carril más que los autos adelante. En tormentas eléctricas dentro del auto es seguro (actúa como jaula de Faraday), pero evita tocar partes metálicas. Si hay inundación en la vía, 15 cm de agua pueden hacer flotar tu auto, 60 cm pueden arrastrarlo. Nunca cruces inundaciones 'porque otros lo están haciendo'. Hielo negro (black ice) es invisible y mortal, común en puentes y áreas sombreadas en madrugadas frías. Si pierdes tracción en hielo: no frenes bruscamente, gira suavemente hacia donde quieres ir (no hacia donde el auto se está deslizando), acelera muy levemente para transferir peso a ruedas traseras. Si tu auto tiene ABS, frena firmemente (sentirás vibración, es normal). Sin ABS, frena en pulsos.",
      },
      {
        id: "concept_13",
        order: 5,
        type: "concept",
        title: "Puntos ciegos y cómo manejarlos",
        content: "Todos los vehículos tienen puntos ciegos, áreas que no puedes ver en espejos ni con visión periférica. Los puntos ciegos principales están a los costados traseros del auto, exactamente donde otros vehículos viajan frecuentemente. Un auto completo puede 'desaparecer' en tu punto ciego. Esto causa accidentes al cambiar de carril. La solución no es solo espejos: siempre haz shoulder check (girar rápidamente la cabeza para mirar sobre tu hombro) antes de cambiar de carril. Sí, los espejos bien ajustados minimizan puntos ciegos, pero nunca los eliminan completamente. Los vehículos grandes (SUVs, pickups, vans) tienen puntos ciegos enormes. Al conducirlos necesitas extra precaución. Tecnologías modernas ayudan: sensores de punto ciego (BSD - Blind Spot Detection) alertan con luz en espejo cuando hay vehículo en zona ciega. Cámaras de 360° muestran lo que rodea tu vehículo. Pero nunca dependas 100% de tecnología: sensores fallan, se ensucian, tienen retrasos. Desarrolla el hábito del shoulder check, especialmente antes de: cambiar de carril, incorporarte a autopista, salir de estacionamiento reversa. Cuando otros conductores están en TU punto ciego (ejemplo: vas en autopista y otro auto se queda a tu lado), acelera levemente o reduce para salir de esa zona. No permanezcas al lado de otros vehículos más tiempo del necesario. Al conducir motos, bicicletas o vehículos pequeños, asume que ESTÁS en el punto ciego de autos más grandes. Posiciónate donde te vean, usa luces diurnas, evita viajar al lado de camiones/buses.",
      },
      {
        id: "tips_3",
        order: 6,
        type: "tips",
        title: "Consejos de oro para conducción defensiva",
        content: "Estos consejos pueden salvarte la vida:",
        tips: [
          "Predice el comportamiento errático: Asume que otros conductores cometerán errores. Si ves un auto frenando erráticamente, aumenta tu distancia. Si alguien no usa direccionales, anticipa que puede cambiar de carril súbitamente.",
          "La regla de escape: Siempre deja espacio de escape. Al detenerte en semáforo, deja suficiente espacio adelante para ver las llantas traseras del auto de enfrente tocando el pavimento. Esto te permite maniobrar si alguien viene sin frenos por atrás.",
          "Intersecciones: el lugar más peligroso: La mayoría de accidentes ocurren en intersecciones. Incluso con luz verde, mira ambos lados antes de cruzar. Muchos accidentes fatales involucran alguien pasándose un rojo. 2 segundos de precaución vs. muerte: tú decides.",
          "Evita distracciones religiosa: Celular, comida, maquillaje, niños peleando atrás, discusiones intensas con pasajeros. A 100 km/h, mirar tu celular 3 segundos significa recorrer 83 metros CIEGO. ¿Pagarías $1000 por leer ese mensaje? Porque eso cuesta el golpe promedio. ¿Arriesgarías tu vida? Porque eso puede costar.",
          "La fatiga mata: Conducir cansado es tan peligroso como conducir ebrio. Microsueños (parpadeos de sueño de 2-3 segundos) ocurren sin que lo notes. Síntomas: bostezos frecuentes, ojos pesados, no recordar últimos kilómetros, salirte de carril. Solución: detente, toma café (toma 20-30 min en hacer efecto), camina, lávate la cara con agua fría, duerme 20 min. Abrir ventanas o música fuerte solo funcionan 5-10 minutos, son soluciones falsas.",
          "Alcohol cero: En Colombia el límite legal es 0.4 gramos de alcohol por litro de sangre, pero la recomendación de seguridad es CERO. Incluso una cerveza afecta juicio, coordinación y tiempos de reacción. Si bebiste, Uber/taxi/amigo designado. No hay excusas que valgan una vida.",
          "Mantén calma ante conductores agresivos: Alguien te cierra, te hace señas, acelera cuando intentas pasarlo. No respondas. No compitas. No te enojes. Ese conductor ya demostró mala toma de decisiones; no te metas en su juego. Reduce velocidad, déjalo ir. El cementerio está lleno de gente que 'tenía el derecho de paso'."
        ],
      },
      {
        id: "summary_3",
        order: 7,
        type: "summary",
        title: "Resumen: Conviértete en un conductor defensivo",
        content: "La conducción defensiva salva vidas, incluida la tuya. Ahora conoces la importancia de la posición correcta (ergonomía = seguridad), la regla de los 3 segundos ajustada por condiciones climáticas, técnicas para manejar bajo lluvia/neblina/hielo, gestión de puntos ciegos con shoulder checks, y comportamientos que previenen accidentes en intersecciones. Recuerda: el mejor accidente es el que nunca ocurre porque lo anticipaste. Conducir defensivo no te hace lento o miedoso, te hace inteligente y profesional. Grandes pilotos de carreras son maestros de conducción defensiva: anticipan, planean rutas de escape, controlan sus emociones. Tú no estás compitiendo contra nadie en la vía; tu único objetivo es llegar seguro. Comparte estos conocimientos con conductores nuevos en tu familia. La seguridad vial es responsabilidad de todos. ¡Practica estas técnicas cada vez que conduzcas hasta que se vuelvan segunda naturaleza!",
      },
    ],
    // No quiz for this capsule - purely informational
  },

  // Capsule 4: Métodos de financiación (Wizard Mode with gamification)
  {
    id: "metodos_financiacion_full",
    slug: "metodos-financiacion",
    mode: "wizard",
    title: "Métodos de financiación automotriz",
    summary: "Domina las opciones de financiamiento vehicular: crédito tradicional, leasing, renting y compra de contado. Aprende cuál se ajusta mejor a tu situación financiera.",
    difficulty: "intermediate",
    sections: [
      {
        id: "intro_4",
        order: 1,
        type: "intro",
        title: "Entendiendo las opciones de financiamiento",
        content: "Comprar un vehículo es una de las inversiones más importantes que harás en tu vida. La forma en que lo financias puede ahorrarte millones de pesos o costarte muchísimo más de lo necesario. En esta cápsula aprenderás las cuatro principales formas de adquirir un vehí culo: compra de contado, crédito tradicional, leasing operativo y renting. Cada una tiene ventajas y desventajas según tu situación financiera, uso previsto del vehículo y objetivos personales. Al final, sabrás exactamente cuál método se ajusta a tu perfil y cómo negociar las mejores condiciones.",
      },
      {
        id: "concept_14",
        order: 2,
        type: "concept",
        title: "Compra de contado: Libertad total, inversión inteligente",
        content: "Pagar el vehículo completamente en efectivo o transferencia es la forma más simple y, a largo plazo, la más económica. Ventajas inmediatas: No pagas intereses (ahorro de 20-40% del valor del vehículo en intereses durante vida de crédito típico). Mayor poder de negociación (vendedores prefieren efectivo y ofrecen mejores descuentos). Propiedad inmediata (puedes vender o modificar el vehículo sin restricciones). Sin deudas mensuales (tranquilidad financiera, sin riesgo de embargo). Documentación mínima (no necesitas demostrar ingresos o historial crediticio). Sin embargo, tiene consideraciones importantes: Requiere capital disponible significativo (liquidez). Oportunidad de costo: ese dinero podría invertirse generando retorno mayor a la tasa de interés del crédito. Menor liquidez temporal (inmovilizas un monto grande). Depreciación inmediata: apenas sales del concesionario, el auto perdió 10-15% de valor. ¿Cuándo es ideal? Si tienes el capital sin comprometer fondos de emergencia. Si odias deudas y priorizas tranquilidad. Si vas a mantener el vehículo largo plazo (8+ años). Si encontraste una oportunidad excepcional con descuento significativo por pago de contado. Si tu objetivo es minimizar costos totales de propiedad. Tips de negociación para pago de contado: Nunca reveles que pagarás de contado hasta después de negociar precio (concesionarios ganan comisión en financiamiento y pueden inflar precio). Negocia precio sobre factura/invoice, no sobre MSRP. Solicita descuentos adicionales por pago inmediato (5-10% es razonable). Verifica que no haya cargos ocultos (preparación, documentación, etc). Pide todo por escrito antes de comprometerte.",
      },
      {
        id: "concept_15",
        order: 3,
        type: "concept",
        title: "Crédito automotriz: Acceso inmediato con costos claros",
        content: "El crédito tradicional de vehículo es el método más común: pagas una cuota inicial (típicamente 10-30%) y financias el resto a plazos (24-72 meses). Características del crédito automotriz: Tasa de interés fija o variable (fija es preferible para predecir pagos). Cuotas mensuales constantes (incluyen capital + intereses + seguros obligatorios). El vehículo sirve como garantía (prenda) hasta liquidar la deuda. Propiedad diferida: técnicamente eres propietario, pero el banco tiene gravamen hasta completar pagos. Ventajas del crédito: Acceso inmediato sin capital completo. Preserva liquidez para emergencias o inversiones. Construye historial crediticio positivo. Pagos predecibles y presupuestables. Algunas entidades ofrecen periodos de gracia o cuotas extraordinarias. Desventajas: Costo total mayor (intereses suman 20-50% al precio original). Compromiso de largo plazo (3-6 años típicamente). Riesgo de quedar 'bajo el agua' (debes más de lo que vale el auto) en primeros años debido a depreciación acelerada. Penalidades por pagos tardíos pueden ser severas. Dificulta venta antes de liquidar (necesitas saldar para transferir propiedad limpia). Factores que afectan tu tasa de interés: Score crediticio (determinante principal: 700+ = excelentes tasas, <600 = tasas altas o rechazo). Cuota inicial (mayor cuota = menor riesgo para banco = mejor tasa). Plazo (plazos más cortos = tasas mejores pero cuotas más altas). Relación deuda-ingreso (idealmente tus deudas no deben exceder 40% de ingresos). Tipo de vehículo (nuevos obtienen mejores tasas que usados). Estrategias para optimizar tu crédito: Mejora tu score crediticio antes de aplicar (paga deudas, corrige errores en reporte). Da cuota inicial mayor (20-30% es ideal). Elige plazo más corto que puedas pagar cómodamente (36-48 meses es balance óptimo). Compara ofertas de múltiples entidades (bancos, cooperativas, concesionarios). Negocia tasa (sí, es negociable, especialmente si tienes buen crédito). Considera refinanciar después de 12-24 meses si tasas bajan o tu crédito mejora. Haz pagos adicionales al capital cuando sea posible (reduce intereses dramáticamente).",
      },
      {
        id: "concept_16",
        order: 4,
        type: "concept",
        title: "Leasing operativo: Flexibilidad para empresas y estrategas",
        content: "El leasing (arrendamiento financiero) es esencialmente 'alquilar con opción de compra'. Pagas por usar el vehículo durante período determinado (típicamente 2-4 años) con opción de comprarlo al final por valor residual predeterminado. Cómo funciona: Cuota inicial menor que crédito (típicamente 0-20%). Cuotas mensuales más bajas que crédito equivalente (solo pagas depreciación + intereses + servicios, no el valor completo). Al término del contrato tienes 3 opciones: Devolver el vehículo sin obligaciones adicionales. Comprar el vehículo pagando el valor residual (típicamente 30-50% del precio original). Renovar leasing con vehículo nuevo. Tipos de leasing: Leasing financiero: diseñado para que compres al final, incluye opción de compra ventajosa. Leasing operativo: diseñado para renovación continua, incluye mantenimientos y servicios. Ventajas del leasing: Cuotas mensuales significativamente menores que crédito. Renueva vehículo frecuentemente sin preocuparte por venta. Beneficios fiscales para empresas (cuotas deducibles como gasto operativo). Siempre conduces vehículo bajo garantía. Mantenimientos incluidos en muchos contratos. Desventajas: Restricciones de kilometraje (típicamente 15,000-25,000 km/año, excesos tienen penalidades costosas). Cargos por desgaste excesivo al devolver. No construyes equidad (no eres dueño). Difícil salir del contrato antes de término. Valor residual final puede no ser competitivo si decides comprar. ¿Para quién es ideal el leasing? Empresarios y profesionales independientes que pueden deducir gastos. Personas que priorizan conducir último modelo siempre. Usuarios con kilometraje predecible y moderado. Quienes no quieren preocuparse por venta del vehículo usado. Sectores profesionales donde imagen vehicular es importante (representantes comerciales, consultores). Consideraciones críticas antes de firmar leasing: Lee kilometraje permitido y penalidades por exceso (típicamente $2,000-4,000 pesos por km extra). Entiende definición de 'desgaste normal' vs 'desgaste excesivo'. Calcula costo total del leasing vs compra directa proyectado a 5-10 años. Verifica valor residual (si es muy bajo, excelente si planeas comprar; si es muy alto, pagarás mucho al final). Asegúrate que mantenimientos estén incluidos y con qué frecuencia. Pregunta sobre opción de compra anticipada (algunos contratos la permiten).",
      },
      {
        id: "concept_17",
        order: 5,
        type: "concept",
        title: "Renting vehicular: Todo incluido, máxima conveniencia",
        content: "El renting es arrendamiento puro sin opción de compra, diseñado para máxima conveniencia operativa. Pagas una cuota fija mensual que incluye TODO: uso del vehículo, mantenimientos preventivos, llantas, seguros, impuestos, asistencia en carretera, incluso vehículo de reemplazo durante servicios. Es como Netflix para autos: pagas una suscripción y usas sin preocuparte por nada más. Características del renting: Cuota mensual fija todo incluido (total predictibilidad presupuestaria). Contratos típicamente 12-48 meses. Sin cuota inicial o muy reducida. Incluye TODOS los servicios (mantenimientos, seguros, impuestos, asistencia). Renovación fácil al término. Ventajas: Cero sorpresas: sabes exactamente cuánto pagarás mensualmente. No te preocupas por mantenimientos, seguros, vencimientos. Gastos 100% deducibles para empresas (no es activo, es gasto). Flexibilidad de renovar o cambiar según necesidades. Siempre conduces vehículo nuevo y confiable. Desventajas: Cuota mensual más alta que leasing o crédito. Nunca eres propietario (no construyes equidad). Restricciones de kilometraje similares a leasing. Contratos pueden tener penalidades por terminación anticipada. Personalizaciones limitadas o prohibidas. Dependencia continua del proveedor. Renting vs Leasing vs Crédito - Comparación práctica: Imaginemos un vehículo de $120 millones. Crédito (48 meses, 12% interés, 20% cuota inicial): Cuota mensual: $2.5 millones. Total pagado: $120M + intereses $25M = $145 millones. Al final: eres propietario completo. Leasing (48 meses, valor residual 40%): Cuota mensual: $1.7 millones. Total pagado: $82 millones. Al final: opción de comprar por $48M o devolver. Total si compras: $130 millones. Renting (48 meses, todo incluido): Cuota mensual: $2.3 millones. Total pagado: $110 millones. Al final: devuelves y renuevas o terminas contrato. Valor adicional: $16-24M en mantenimientos/seguros ya incluidos. Análisis: Crédito termina siendo el más costoso ($145M) pero te quedas con el activo. Leasing es intermedio ($130M si compras) con flexibilidad. Renting parece más caro mensualmente pero considerando servicios incluidos, es competitivo y libre de sorpresas. ¿Cuándo elegir renting? Empresas que priorizan gastos predecibles. Flotas corporativas (múltiples vehículos). Ejecutivos con asignación de vehículo. Personas que no quieren involucrarse en mantenimientos/trámites. Usuarios que cambian de vehículo frecuentemente (cada 2-3 años). Startups y empresas en crecimiento (evitan inmovilizar capital en activos).",
      },
      {
        id: "case_4",
        order: 6,
        type: "case",
        title: "Caso práctico: ¿Cuál opción le conviene a cada perfil?",
        content: "Caso 1 - María, Freelancer exitosa: Ingresos variables $3000-5000/mes, ahorros $25,000, busca SUV de $35,000. Recomendación: Crédito con cuota inicial $15,000 (43%), financiar $20,000 en 36 meses. Razón: Sus ingresos variables hacen leasing/renting riesgosos (cuota fija puede ser problema en meses bajos). Alta cuota inicial minimiza intereses. 36 meses la libera rápido de deuda. Caso 2 - Empresa Tech, 15 empleados: Necesita 5 vehículos para equipo comercial, presupuesto $120,000, busca optimización fiscal. Recomendación: Renting corporativo. Razón: $120,000 en flota inmoviliza capital necesario para crecimiento. Renting permite deducir 100% como gasto operativo. Mantenimientos y seguros incluidos reducen carga administrativa. Renovación fácil cada 3 años mantiene imagen profesional. Caso 3 - Andrés, Médico empleado: Salario estable $6000/mes, buen crédito (760), quiere BMW $55,000, maneja 30,000 km/año. Recomendación: Crédito tradicional 60 meses con 25% cuota inicial. Razón: Alto kilometraje anual hace leasing prohibitivamente caro (penalidades). Ingresos estables soportan cuota cómoda. Buen crédito obtiene tasa preferencial. Propiedad permite manejar sin restricciones. Caso 4 - Carolina, Ejecutiva corporativa: Empresa da asignación $800/mes para vehículo, maneja 15,000 km/año, quiere actualizar cada 3 años. Recomendación: Leasing operativo. Razón: Asignación corporativa cubre cuota. Kilometraje dentro de límites estándar. Renovación cada 3 años alineada con su deseo. Mantenimientos incluidos eliminan gastos sorpresa. Caso 5 - Familia González: Ahorros $50,000, buscan minivan $40,000, planean mantenerla 10+ años. Recomendación: Compra de contado. Razón: Capital disponible sin comprometer emergencias. Uso prolongado maximiza ROI de compra. Eliminan $10,000-15,000 en intereses de crédito. Familia valora tranquilidad de no tener deudas.",
      },
      {
        id: "tips_4",
        order: 7,
        type: "tips",
        title: "Consejos de oro para financiamiento inteligente",
        content: "Estrategias que los vendedores no quieren que conozcas:",
        tips: [
          "Calcula el TCO (Total Cost of Ownership): No te enamores de cuotas bajas sin calcular costo total. Suma TODOS los costos durante vida útil prevista: precio + intereses + seguros + mantenimientos + combustible + depreciación. Sorpresa: el vehículo 'más barato' rara vez es el más económico a largo plazo.",
          "La regla 20/4/10 para créditos: Cuota inicial mínima 20%. Plazo máximo 4 años (48 meses). Pago mensual (incluyendo seguro) no debe exceder 10% de ingreso bruto. Ejemplo: ingresos $4000/mes → máximo $400/mes en auto. Esta regla previene sobre-endeudamiento automotriz, causa #1 de estrés financiero.",
          "Pre-aprueba tu crédito ANTES de visitar concesionarios: Aplica con tu banco/cooperativa antes de comprar. Sabrás cuánto calificas y a qué tasa. Tendrás poder de negociación (puedes comparar vs financiamiento del dealer). Evitas decisiones emocionales ('sí califica, firme aquí').",
          "Los seguros son NEGOCIABLES: Concesionarios incluyen seguros caros en financiamiento. Solicita cotización independiente de aseguradoras. Compara coberturas exactas (muchos incluyen coberturas innecesarias). Puedes ahorrar 30-50% consiguiendo tu propio seguro.",
          "Decodifica la trampa de 'pagos bajos': Vendedor pregunta '¿Cuánto puede pagar mensualmente?'. Tú dices '$500'. Ellos ajustan: extienden plazo a 72-84 meses, suben tasa de interés, inflan precio, agregan productos innecesarios. Resultado: pagas $500/mes pero total es $42,000 por auto de $28,000. NUNCA negocies por cuota mensual. Negocia precio total del vehículo, luego estructura financiamiento.",
          "Para leasing/renting: calcula costo por kilómetro: Suma todas las cuotas del contrato. Divide entre kilómetros permitidos. Ejemplo: $450/mes x 36 meses = $16,200. Kilometraje: 60,000 km. Costo: $0.27/km. Compara con alternativas considerando TODOS los beneficios incluidos. Si renting incluye mantenimientos/seguros, ajusta cálculo.",
          "El 'valor residual' es negociable en leasing: Vendedores fijan valor residual alto (beneficia a la compañía, mala para ti si compras al final). Negocia valor residual menor si SABES que comprarás el vehículo al término. Esto aumenta cuota mensual levemente pero reduce precio final dramáticamente.",
        ],
      },
      {
        id: "summary_4",
        order: 8,
        type: "summary",
        title: "Resumen: Financia inteligentemente tu próximo vehículo",
        content: "Ahora comprendes las cuatro vías principales para adquirir un vehículo. Compra de contado es ideal para quienes tienen capital y buscan minimizar costos totales. Crédito tradicional funciona para ingresos estables que quieren propiedad con acceso inmediato. Leasing operativo sirve empresarios y renovadores frecuentes que valoran flexibilidad. Renting conviene a quienes priorizan predictibilidad total y cero preocupaciones operativas. No existe 'el mejor método', existe el método correcto para TU situación. Considera: ingresos (estables vs variables), kilometraje anual, horizonte de propiedad, necesidades fiscales, tolerancia a deudas, y capital disponible. Aplica la regla 20/4/10 para créditos, calcula TCO siempre, pre-aprueba financiamiento, y nunca negocies por cuota mensual. Tu próxima compra vehicular será financieramente inteligente porque ahora tienes las herramientas para tomar la decisión correcta. ¡Es momento de aplicar este conocimiento!",
      },
      {
        id: "quiz_intro_4",
        order: 9,
        type: "quizIntro",
        title: "Demuestra tu dominio financiero automotriz",
        content: "Es hora de probar que comprendiste los métodos de financiamiento. Este quiz evaluará tu capacidad para elegir la opción correcta según diferentes escenarios, entender costos ocultos, y aplicar estrategias de negociación. Cada respuesta incluye explicación detallada para reforzar conceptos. ¡Adelante financiero!",
      },
    ],
    quiz: [
      {
        id: "q4_1",
        order: 1,
        question: "Un vehículo cuesta $30,000. Con crédito a 48 meses al 12% anual, ¿aproximadamente cuánto pagarás en INTERESES totales (sin considerar cuota inicial)?",
        options: ["$1,800", "$3,600", "$7,900", "$10,800"],
        correctIndex: 2,
        explanation: "A 12% anual en 48 meses sobre $30,000, los intereses totales son aproximadamente $7,900. Esto representa 26% adicional sobre el precio original. Por eso es crítico comparar tasa de interés y considerar cuota inicial alta y/o plazo corto.",
      },
      {
        id: "q4_2",
        order: 2,
        question: "Según la regla 20/4/10, si tus ingresos mensuales brutos son $5,000, ¿cuál es el pago mensual máximo recomendado para tu vehículo (incluyendo seguro)?",
        options: ["$500", "$1,000", "$250", "$750"],
        correctIndex: 0,
        explanation: "La regla 20/4/10 establece que el pago mensual no debe exceder 10% del ingreso bruto mensual. 10% de $5,000 = $500. Esta regla previene sobre-endeudamiento y mantiene finanzas saludables.",
      },
      {
        id: "q4_3",
        order: 3,
        question: "¿Cuál de estas NO es una ventaja del leasing operativo?",
        options: [
          "Cuotas mensuales más bajas que crédito equivalente",
          "Construyes equidad y propiedad del vehículo",
          "Puedes renovar vehículo frecuentemente",
          "Beneficios fiscales para empresas"
        ],
        correctIndex: 1,
        explanation: "En leasing NO construyes equidad ni propiedad. Pagas por usar el vehículo temporalmente. Esta es precisamente la principal desventaja del leasing: al final del contrato debes devolver o comprar por valor residual.",
      },
      {
        id: "q4_4",
        order: 4,
        question: "¿Qué método de financiamiento incluye mantenimientos, seguros, impuestos y asistencia en una sola cuota mensual?",
        options: ["Crédito tradicional", "Leasing operativo", "Renting", "Compra de contado"],
        correctIndex: 2,
        explanation: "El renting incluye TODO en la cuota mensual: uso del vehículo, mantenimientos, seguros, impuestos, asistencia. Es la opción 'todo incluido' que maximiza predictibilidad y minimiza sorpresas, ideal para empresas y ejecutivos.",
      },
      {
        id: "q4_5",
        order: 5,
        question: "María es freelancer con ingresos variables, tiene $25,000 ahorrados y busca un SUV de $35,000. ¿Qué opción es MÁS recomendable para su situación?",
        options: [
          "Renting a 48 meses",
          "Leasing con 0% cuota inicial",
          "Crédito con alta cuota inicial ($15,000) a 36 meses",
          "Compra 100% de contado agotando sus ahorros"
        ],
        correctIndex: 2,
        explanation: "Crédito con alta cuota inicial y plazo corto es ideal para María. Sus ingresos variables hacen riesgosas cuotas fijas de renting/leasing. Alta cuota inicial minimiza intereses y 36 meses la libera rápido. Comprar de contado agotaría sus ahorros eliminando colchón de emergencia (crítico para freelancers).",
      },
      {
        id: "q4_6",
        order: 6,
        question: "¿Cuál es la principal desventaja de comprar un vehículo completamente de contado?",
        options: [
          "Pagas intereses al banco",
          "No puedes modificar el vehículo",
          "Inmovilizas capital que podría generar retornos en inversiones",
          "Necesitas demostrar historial crediticio"
        ],
        correctIndex: 2,
        explanation: "El principal 'costo' de compra de contado es el costo de oportunidad: ese capital podría invertirse generando retorno (bolsa, negocio, bienes raíces). Si puedes invertir ese dinero con retorno >12% anual, matemáticamente es mejor financiar el auto. Sin embargo, muchos valoran la tranquilidad de no tener deudas.",
      },
      {
        id: "q4_7",
        order: 7,
        question: "En un contrato de leasing con límite de 15,000 km/año, manejas 22,000 km en el primer año. Si la penalidad es $0.80 por km excedente, ¿cuánto pagarás de penalidad?",
        options: ["$1,200", "$5,600", "$7,000", "$17,600"],
        correctIndex: 1,
        explanation: "Excediste 7,000 km (22,000 - 15,000). A $0.80 por km: 7,000 × $0.80 = $5,600 de penalidad. Esta es una trampa común del leasing: si no estimaste correctamente tu kilometraje, las penalidades pueden ser brutales. Siempre sobreestima tu kilometraje al negociar.",
      },
    ],
  },

  // Capsule 7: Detalles curiosos
  {
    id: "detalles_curiosos_full",
    slug: "detalles-curiosos-automotriz",
    mode: "wizard",
    title: "Detalles curiosos del mundo automotor",
    summary: "Datos fascinantes y anécdotas históricas del mundo automotor: desde el origen de los logos hasta récords mundiales que te sorprenderán.",
    difficulty: "basic",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/1E40AF/FFFFFF?text=Observauto",
        link: "https://observauto.co",
        accentColor: "#1E40AF",
      },
    ],
    sections: [
      {
        id: "intro_curiosos",
        order: 1,
        type: "intro",
        title: "El fascinante mundo detrás de cada auto",
        content: "¿Sabías que algunos logos automotrices cuentan historias increíbles? El mundo del automóvil está lleno de curiosidades que van mucho más allá de motores y ruedas. Desde récords imposibles hasta historias de marcas legendarias, cada vehículo lleva consigo anécdotas que han marcado la historia. Prepárate para descubrir datos que harán que mires tu auto con otros ojos.",
      },
      {
        id: "concept_curiosos_1",
        order: 2,
        type: "concept",
        title: "Logos con historia oculta",
        content: "El logo de Mercedes-Benz no es solo una estrella: representa la универсальность (versatilidad) terrestre, marítima y aérea de la empresa original. El anillo de Audi representa la fusión de cuatro compañías fundadoras. BMW no significa 'bolsillos profundos' como muchos creen, sino 'Bayerische Motoren Werke'. Toyota tiene una raíz que significa 'donde el arroz crece', recordando sus orígenes agrícolas. Renault tomó su nombre de los apellido de los tres hermanos fundadores: Louis, Marcel y Fernand.",
      },
      {
        id: "concept_curiosos_2",
        order: 3,
        type: "concept",
        title: "Récords que desafían la lógica",
        content: "El auto más rápido del mundo alcanzó 431 km/h en 2019 (Bugatti Chiron Super Sport). Pero el récord de consumo más eficiente lo tiene el Honda Accord Hybrid 2020: 48 mpg combinado en ciudad y carretera. El auto más antiguo en funcionamiento es un 1885 De Dion-Bouton que aún se usa en Francia. El Toyota Prius fue el primer híbrido masivo: más de 10 millones vendidos desde 1997. ¡El Tesla Model S Plaid acelera de 0-100 en menos de 2 segundos!",
      },
      {
        id: "tips_curiosos_1",
        order: 4,
        type: "tips",
        title: "Datos que impresionarán a tus amigos",
        content: "Usa estos datos en conversaciones automotoras:",
        bulletPoints: [
          "El Audi RS6 puede acelerar de 0-100 km/h en 3.6 segundos pero pesa 2 toneladas",
          "El Ferrari Testarossa de los años 80 costaba más de $1,200 millones en su época",
          "El primer carro autónomo de Google acumuló más de 2 millones de kilómetros antes de un accidente",
          "McLaren construyó el auto más rápido de F1 histórico: 398 km/h en recta",
          "El Lamborghini Countach tardó 7 años en diseñarse y aún es considerado futurista",
          "El Mazda RX-7 con motor Wankel consume menos combustible de lo que aparenta por su tamaño"
        ],
      },
      {
        id: "concept_curiosos_3",
        order: 5,
        type: "concept",
        title: "Tecnología oculta que no conocías",
        content: "Muchos autos modernos tienen funciones secretas que ni siquiera los propietarios conocen. Tesla tiene un 'Modo Wow' que permite aceleraciones instantáneas con toda la potencia disponible. Algunos BMW incluyen un sensor que detecta cuando estás escuchando música con auriculares y reduce automáticamente el volumen de las alertas. El Audi A4 tiene una función que puede detectar si estás conduitsdo somnoliento a través de micro-ajustes en el volante. Mercedes Benz incluye un 'Modo Oasis' que activa el sistema de renovación de aire interno cuando detecta mala calidad del aire exterior.",
      },
      {
        id: "tips_curiosos_2",
        order: 6,
        type: "tips",
        title: "Easter eggs automotrices",
        content: "Busca estos detalles sorpresa en tu auto:",
        bulletPoints: [
          "Los faros daytime de Audi se iluminan de forma incremental al encender",
          "Tesla Model X hace un show de luces sincronizadas al desbloquear",
          "BMW i8 muestra siluetas de pilotos famosos en la pantalla al iniciar",
          "Mercedes E-Class ajusta automáticamente la suspensión según tu perfil de conducción",
          "Ford Mustang Mach 1 incluye detalles cromados inspirados en los modelos originales de los 60s",
          "Porsche 911 GT3 RS tiene grabados de récords de Nürburgring en el motor"
        ],
      },
    ],
    quiz: {
      question: "¿Cuál es el origen real del logo de BMW?",
      options: [
        "Bolsillos Profundos (Big Money)",
        "Bayerische Motoren Werke",
        "Bavarian Motor Works",
        "Bismarck Manufacturing Wheels"
      ],
      correctIndex: 1,
      explanation: "BMW significa Bayerische Motoren Werke (Fábrica Bávara de Motores), claramente visible en su logo con colores azul y blanco que representan los colores de Baviera.",
    },
  },

  // Capsule 8: Testigos del Tablero (visual)
  {
    id: "testigos_tablero_visual_full",
    slug: "testigos-tablero-visual",
    mode: "wizard",
    title: "Testigos del Tablero (versión visual interactiva)",
    summary: "Guía visual interactiva de todas las luces del panel de instrumentos. Identifica rápidamente qué significa cada símbolo y qué tan urgente es atenderlo.",
    difficulty: "basic",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/1E40AF/FFFFFF?text=Observauto",
        link: "https://observauto.co",
        accentColor: "#1E40AF",
      },
    ],
    sections: [
      {
        id: "intro_testigos_visual",
        order: 1,
        type: "intro",
        title: "Tu dashboard dice mucho más de lo que imaginas",
        content: "Esa pequeña luz roja que aparece en tu tablero no es aleatoria. Cada símbolo tiene un significado específico y niveles de urgencia definidos. Aprende a 'leer' tu tablero como un verdadero experto y descubre cuándo una luz indica mantenimiento rutinario y cuándo requiere atención inmediata. Esta versión visual interactiva te ayudará a identificar instantáneamente cualquier indicador.",
      },
      {
        id: "concept_testigos_1",
        order: 2,
        type: "concept",
        title: "Sistema de colores: la regla de oro",
        content: "Los testigos del tablero usan un sistema universal de colores: VERDE/azul indica funcionamiento normal (luces de posición, intermitentes). AMARILLO/ámbar advierte problemas no urgentes (aceite bajo, líquido de frenos bajo). ROJO exige atención inmediata (sobrecalentamiento, presión de aceite crítica). ROJO intermitente indica situación de emergencia (pérdida de presión de aceite, sobrecalentamiento severo). El color es tu primera pista: nunca ignores las luces rojas, siempre revisa las amarillas en cuanto puedas, y despreocúpate de las verdes.",
      },
      {
        id: "concept_testigos_2",
        order: 3,
        type: "concept",
        title: "Símbolos críticos que debes conocer",
        content: "Algunas luces requieren conocimiento específico: El símbolo de batería indica falla del alternador o problemas eléctricos - no puedes seguir manejando mucho. La luz de aceite (cáncamo con gota) significa presión de aceite baja - peligro crítico de daño al motor. La temperatura (termómetro en agua) indica sobrecalentamiento - apaga motor inmediatamente. Airbag SRS (muñeco con círculo) significa falla del sistema de bolsas de aire. ABS (círculo con ABS) indica falla del sistema anti-bloqueo. ¿Ves un motor amarillo con llave inglesa? Es 'check engine' - permite seguir pero requiere diagnóstico rápido.",
      },
      {
        id: "tips_testigos_1",
        order: 4,
        type: "tips",
        title: "Protocolo de emergencia paso a paso",
        content: "Si aparece una luz roja mientras manejas:",
        bulletPoints: [
          "INMEDIATO: Reduce velocidad gradualmente, busca lugar seguro para parar",
          "ACEITE: Apaga motor inmediatamente - cada segundo cuenta",
          "TEMPERATURA: Para motor en lugar seguro - no abras el radiador caliente",
          "BATERÍA: No apagues motor hasta llegar al taller - alternador compensará",
          "ABS/AIRBAG: Conduce con precaución al taller más cercano",
          "Never ignores una luz roja en tráfico pesado o velocidad alta"
        ],
      },
      {
        id: "concept_testigos_3",
        order: 5,
        type: "concept",
        title: "Luces amarillas que no debes ignorar",
        content: "Las luces amarillas requieren atención pronta pero no son emergencias: Check Engine permite seguir manejando pero requiere diagnóstico - podría ser desde un tapón de gasolina flojo hasta sensor dañado. Inyección requiere inspección en taller - puede afectar performance y consumo. Filtro de partículas (Diesel) puede regenerarse con manejo en autopista. Suspensión electrónica indica sensor o amortiguador - no es crítico pero reduce confort. Siempre agenda revisión en 1-2 semanas máximo, antes pueden volverse críticas.",
      },
      {
        id: "tips_testigos_2",
        order: 6,
        type: "tips",
        title: "Memoriza estos patrones críticos",
        content: "Asociación mental para recordar:",
        bulletPoints: [
          "MOTOR + LLAVE = Apaga motor YA (sobrecalentamiento)",
          "BATERÍA + SIGNO + = Problema eléctrico - acelere al taller",
          "GOTA + PRESIÓN = Aceite bajo - para inmediatamente",
          "TERMÓMETRO + AGUA = Motor hirviendo - para motor",
          "CÍRCULO + ABS = Frenos sin ABS - conduce con precaución",
          "MUÑECO + CÍRCULO = Airbags deshabilitados - sin garantías de seguridad"
        ],
      },
    ],
    quiz: {
      question: "Si aparece una luz roja de temperatura del motor, ¿cuál es la acción correcta?",
      options: [
        "Acelerar para llegar más rápido al taller",
        "Seguir manejando hasta encontrar una gasolinera",
        "Parar el motor inmediatamente en lugar seguro",
        "Apagar y prender el motor para resetear"
      ],
      correctIndex: 2,
      explanation: "Una luz roja de temperatura indica sobrecalentamiento severo. Continuar manejando puede causar daño irreversible al motor por deformación de componentes. Debes parar el motor inmediatamente.",
    },
  },

  // Capsule 9: Movilidad Ecológica
  {
    id: "movilidad_ecologica_full",
    slug: "movilidad-ecologica-sostenible",
    mode: "wizard",
    title: "Movilidad Ecológica y sostenible",
    summary: "Explora alternativas sostenibles de transporte: vehículos híbridos, eléctricos, y prácticas de conducción eco-friendly que reducen tu huella de carbono.",
    difficulty: "intermediate",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/10B981/FFFFFF?text=Green+Mobility",
        link: "https://observauto.co",
        accentColor: "#10B981",
      },
    ],
    sections: [
      {
        id: "intro_eco_mobility",
        order: 1,
        type: "intro",
        title: "El futuro del transporte es sostenible",
        content: "La movilidad del siglo XXI va más allá de simplemente llegar del punto A al punto B. Los vehículos sostenibles están revolucionando cómo nos movemos, ofreciendo opciones que reducen significativamente nuestro impacto ambiental sin sacrificar comodidad ni performance. Desde híbridos hasta eléctricos puros, la tecnología verde ha madurado hasta ofrecer alternativas viables para todo tipo de conductores y necesidades.",
      },
      {
        id: "concept_eco_1",
        order: 2,
        type: "concept",
        title: "Vehículos híbridos: lo mejor de dos mundos",
        content: "Los híbridos combinan motor a combustión con eléctrico para optimizar eficiencia. Los 'mild hybrid' (MHEV) usan el motor eléctrico como asistente, mejorando consumo en arranques y aceleraciones. Los 'full hybrid' (HEV) pueden moverse solo con electricidad a bajas velocidades. Los 'plug-in hybrid' (PHEV) permiten cargas externas y mayor autonomía eléctrica (50-80 km). Ventajas: ahorro de combustible del 30-50%, menores emisiones, mantenimiento similar a autos convencionales. Desventajas: costo inicial mayor, batería tiene vida útil limitada (8-10 años), menos potencia en highway comparados con equivalentes a gasolina.",
      },
      {
        id: "concept_eco_2",
        order: 3,
        type: "concept",
        title: "Eléctrica pura: cero emisiones directas",
        content: "Los vehículos eléctricos (EV) eliminan completamente las emisiones directas del escape. Tecnología de baterías: Litio-ion con densidades energéticas cada vez mayores (300-500 Wh/kg). Autonomía típica: 300-600 km según modelo y condiciones. Carga rápida DC permite 80% en 20-40 minutos. Carga regular AC (hogar) toma 6-12 horas para carga completa. Costo por km: 70-80% menor que gasolina. Ventajas: operación silenciosa, aceleración instantánea, mantenimiento mínimo (sin cambios de aceite, filtros, bujías). Desventajas: tiempo de carga, autonomía limitada, infraestructura de carga en desarrollo, peso adicional de baterías.",
      },
      {
        id: "tips_eco_1",
        order: 4,
        type: "tips",
        title: "Conducción eco-friendly: tips que realmente funcionan",
        content: "Optimiza tu estilo de conducción para reducir consumo:",
        bulletPoints: [
          "ACELERACIÓN GRADUAL: Acelera suavemente como si tuvieras un huevo bajo el pedal",
          "VELOCIDAD CONSTANTE: Usa control de crucero en highway cuando sea seguro",
          "FRENADA REGENERATIVA: Aprovecha el frenado del motor para recargar batería",
          "PRE-CONDICIONAMIENTO: Calienta/enfría tu auto mientras está cargando",
          "RUTAS OPTIMIZADAS: Evita tráfico con apps que sugieren rutas más eficientes",
          "MANTENIMIENTO PREVENTIVO: Neumáticos inflados correctamente mejoran eficiencia hasta 3%"
        ],
      },
      {
        id: "concept_eco_3",
        order: 5,
        type: "concept",
        title: "Infraestructura y realidad colombiana",
        content: "En Colombia la infraestructura de carga aún está en desarrollo pero creciendo rápidamente. Las principales ciudades (Bogotá, Medellín, Cali) tienen redes de cargadores públicos en centros comerciales, hoteles y estaciones de servicio. Codelectr mantiene programa de movilidad eléctrica con incentivos fiscales. Los costos de electricidad en Colombia son competitivos: cargar un auto eléctrico en casa puede costar $15,000-25,000 pesos por carga completa vs $80,000-120,000 de tanque de gasolina equivalente. El gobierno ofrece exención de IVA para vehículos eléctricos hasta 2026. Desafíos: autonomía limitada para viajes largos, cargadores escasos en ciudades pequeñas, tiempo de carga vs repostaje rápido.",
      },
      {
        id: "tips_eco_2",
        order: 6,
        type: "tips",
        title: "Calidad del aire y tu contribución personal",
        content: "Tu elección de vehículo impacta directamente la calidad del aire local:",
        bulletPoints: [
          "Auto a gasolina promedio: 4.6 toneladas CO2/año",
          "Híbrido reduce emisiones ~40% vs equivalente a gasolina",
          "Eléctrico con energía renovable: 90% menos emisiones totales",
          "Combinar transporte público + auto ocasional reduce huella 60%",
          "Bicicleta eléctrica para recorridos <10 km: cero emisiones",
          "Car sharing eléctrico puede reemplazar necesidad de auto propio"
        ],
      },
    ],
    quiz: {
      question: "¿Cuál es el principal beneficio de un vehículo híbrido plug-in vs uno convencional?",
      options: [
        "Mayor potencia en todos los rangos de velocidad",
        "Capacidad de recorrer distancias cortas solo con electricidad",
        "Menor costo de mantenimiento a largo plazo",
        "Mejor performance en pista de carreras"
      ],
      correctIndex: 1,
      explanation: "Los vehículos híbridos plug-in (PHEV) pueden recorrer 50-80 km solo con electricidad, permitiendo trayectos diarios sin usar gasolina y reduciendo significativamente las emisiones locales.",
    },
  },

  // Capsule 10: El Arte de la Observación
  {
    id: "arte_observacion_full",
    slug: "arte-observacion-automotriz",
    mode: "wizard",
    title: "El Arte de la Observación vehicular",
    summary: "Desarrolla la habilidad de leer un vehículo como un experto. Aprende a identificar señales de buen o mal mantenimiento, intervenciones previas y el verdadero estado de un auto.",
    difficulty: "advanced",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/7C3AED/FFFFFF?text=Expert+Vision",
        link: "https://observauto.co",
        accentColor: "#7C3AED",
      },
    ],
    sections: [
      {
        id: "intro_observacion",
        order: 1,
        type: "intro",
        title: "Ver más allá de la superficie",
        content: "Cada vehículo cuenta una historia a través de sus detalles. Los expertos en automoción no solo miran las características obvias: desarrollan la habilidad de 'leer' entre líneas, identificar patrones sutiles que revelan el pasado del auto. Esta cápsula te enseñará a desarrollar esa percepción analítica que separa a un observador casual de un verdadero conocedor del mundo automotor.",
      },
      {
        id: "concept_obs_1",
        order: 2,
        type: "concept",
        title: "Análisis visual: las primeras pistas",
        content: "Todo comienza con una observación sistemática del exterior. Revisa la alineación de puertas, capó y maletero - discrepancias indican posibles accidentes. Los espacios uniformes entre paneles sugieren buena estructura original. Busca signos de repintado: diferencias en tono de color, especialmente alrededor de molduras. Los rines y llantas cuentan mucho: desgaste uneven indica problemas de alineación o suspensión. Un auto cuidado tendrá ventanas limpias sin rayones profundos, espejos bien alineados y luces sin fracturas o empañamiento interno.",
      },
      {
        id: "concept_obs_2",
        order: 3,
        type: "concept",
        title: "Interior: dónde se revela la verdad",
        content: "El interior nunca miente. Asientos desproporcionadamente gastados sugieren alto kilometraje real. Volantes con desgaste excesivo en posiciones específicas indican falta de rotación regular. Tapicería con holes o quemaduras habla de descuido. Revisa debajo de las alfombras: moisture stains revelan problemas de hermeticidad. Los pedales dicen mucho: desgaste excesivo sugiere kilometraje real alto, pedales nuevos con resto del auto usado pueden indicar odometer rollback. Olores: cigarette, mascotas, moisture indicam usos previos que deben considerarse en la negociación.",
      },
      {
        id: "tips_obs_1",
        order: 4,
        type: "tips",
        title: "Señales de alerta que no debes ignorar",
        content: "Aprende a identificar estos red flags:",
        bulletPoints: [
          "Soldaduras visibles en marcos de puertas = accidente estructural",
          "Repintado parcial de paneles = posible daño oculto",
          "Vidrios con fechas diferentes = reemplazo por accidente",
          "Corrosión en puntos críticos = problemas de mantenimiento",
          "Mecánica con polvo excesivo = falta de mantenimiento",
          "Documentos con fechas inconsistentes = posible alteración de odómetro"
        ],
      },
      {
        id: "concept_obs_3",
        order: 5,
        type: "concept",
        title: "Bajo el capó: el corazón que no puede mentir",
        content: "El motor revela más de lo que aparenta. Busca signs de oil leaks - stains brown/negro en el motor o en la parte inferior. Los belts en buen estado son uniformemente worn, no agrietados o glazed. Coolant reservoir debe estar limpio, sin rust o particulas. Battery terminals clean without corrosion buildup. Air filter revela problemas de mantenimiento. Engine mounts damaged cause excessive vibration. Los expertos listen al idle: rough idle indica misfires, excessive noise puede sugerir bearing problems o internal wear.",
      },
      {
        id: "tips_obs_2",
        order: 6,
        type: "tips",
        title: "Desarrolla tu ojo experto paso a paso",
        content: "Rutina de inspección que convierte casual en experto:",
        bulletPoints: [
          "PASO 1: Vista general - alineación, proportions, uniformidad",
          "PASO 2: Detalles cercanos - inconsistent wear patterns",
          "PASO 3: Prueba de manejo - noise, vibration, performance",
          "PASO 4: Documentación - VIN check, service history, ownership",
          "PASO 5: Comparison - similar models en showroom como reference",
          "PRACTICA CONSTANTE: Visit dealers, auctions, classic car shows"
        ],
      },
    ],
    quiz: {
      question: "¿Cuál es la primera señal visual que indica posible accidente estructural en un vehículo?",
      options: [
        "Rines con rayones",
        "Diferencias en alineación de paneles",
        "Luces empañadas",
        "Asientos gastados"
      ],
      correctIndex: 1,
      explanation: "Diferencias en alineación entre puertas, capó y maletero son indicadores tempranos de que el vehículo pudo haber sufrido un accidente que afectó su estructura original.",
    },
  },

  // Capsule 11: Mecánica para Curiosos
  {
    id: "mecanica_curiosos_full",
    slug: "mecanica-curiosos-diagnostico",
    mode: "wizard",
    title: "Mecánica para curiosos",
    summary: "Decodifica los sonidos y fluidos de tu vehículo. Aprende a identificar qué es normal y qué requiere atención inmediata en autos, motos y scooters.",
    difficulty: "intermediate",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/F59E0B/FFFFFF?text=Auto+Doctor",
        link: "https://observauto.co",
        accentColor: "#F59E0B",
      },
    ],
    sections: [
      {
        id: "intro_mecanica_curiosos",
        order: 1,
        type: "intro",
        title: "Convierte los misterios mecánicos en conocimiento",
        content: "Cada vehículo tiene su propio 'idioma' que solo los expertos aprenden a interpretar. Ruidos, vibraciones, colores de líquidos, patrones de humo... todo comunica información específica sobre el estado interno del motor y sistemas. Esta cápsula te enseña a convertir esos ruidos inquietantes en diagnósticos precisos, para que sepas cuándo actuar y cuándo simplemente observar.",
      },
      {
        id: "concept_mec_1",
        order: 2,
        type: "concept",
        title: "El diccionario de sonidos automotrices",
        content: "Cada ruido indica un problema específico: KNOCKING (como marbles en blender) sugiere detonación por baja octanaje o timing advance excesivo. WHISTLING agudo bajo el hood indica vacuum leak o PCV malfunction. GRINDING metal-to-metal en frenos = pads worn through, necesita reemplazo inmediato. WHIRRING/whining bajo carga sugiere bearing damaged en transmisión, diferencial o alternador. POPPING/background noise en acceleration indica ignition timing issues o spark plug problems. RATTLING metal bajo highway speeds puede ser heat shield loose o exhaust hanger broken.",
      },
      {
        id: "concept_mec_2",
        order: 3,
        type: "concept",
        title: "Líquidos que cuentan historias",
        content: "Los fluidos de tu auto revelan mucho más de lo que imaginas: ACEITE DE MOTOR color normal: amber claro a oscuro. Verde = contaminated con antifreeze (head gasket problem). Negro muy oscuro = overdue for oil change. SPARKLING metallic particles = internal wear, serious problem. LIQUIDO DE FRENOS normal: light amber, no dark particles. Dark black = brake pad dust, normal. Brown cloudy = moisture contamination, flush required. LIQUIDO DE DIRECCION normal: light amber. Pink = contamination con antifreeze, replace entire system. Coolant normal: green, blue, or orange depending type. Rust colored = corrosion, radiator or heater core failure. Milky white = oil contamination, serious head gasket or intake manifold leak.",
      },
      {
        id: "tips_mec_1",
        order: 4,
        type: "tips",
        title: "Sistema de alertas por colores",
        content: "Aprende a leer los warnings naturales de tu vehículo:",
        bulletPoints: [
          "VERDE/AMBER = Normal operation, no action needed",
          "YELLOW/ORANGE = Monitor closely, schedule maintenance",
          "RED/DARK = Immediate attention required",
          "SMOKE BLUE = Burning oil - check PCV and valve seals",
          "SMOKE WHITE = Coolant burning - serious head gasket issue",
          "SMOKE BLACK = Running rich - fuel system or air filter problem"
        ],
      },
      {
        id: "concept_mec_3",
        order: 5,
        type: "concept",
        title: "Vibraciones: el GPS interno de problemas",
        content: "Las vibraciones son el GPS más preciso para localizar problemas mecánicos: ENGINE SHAKE at idle = misfire en cylinder específico, plugs o coils. VIBRATION at highway speeds = tire balance o wheel bearing problem. STEERING WHEEL shake braking = warped brake rotors o caliper sticking. CAR PULLING to one side = brake pad sticking, uneven tire pressure, alignment issue. EXCESSIVE VIBRATION acceleration = CV joint damaged, transmission mount worn. RUMBLE at low speeds differential o axle shaft issue. Remember: vibration timing y frequency ofrecen clues exactas sobre el componente específico que necesita atención.",
      },
      {
        id: "tips_mec_2",
        order: 6,
        type: "tips",
        title: "Diario de síntomas: tu mejor herramienta",
        content: "Documenta estos detalles para un diagnóstico preciso:",
        bulletPoints: [
          "WHEN: Exact temperature, traffic conditions, load weight",
          "WHERE: Specific road type, speed range, RPM range",
          "HOW: Continuous, intermittent, getting worse over time",
          "SOUND: Clang, whine, grind, knock, whistle, rattle",
          "VISUAL: Smoke color, fluid leaks, warning lights",
          "TREND: Better in morning, worse after highway, better when cold"
        ],
      },
    ],
    quiz: {
      question: "Si observas humo azul provenientes del escape, ¿qué sistema está fallando?",
      options: [
        "Sistema de frenos",
        "Sistema de refrigeración",
        "Sistema de lubricación del motor",
        "Sistema eléctrico"
      ],
      correctIndex: 2,
      explanation: "El humo azul indica que aceite está siendo quemado en la cámara de combustión, típicamente por válvulas con sellos deteriorados o guías de válvulas desgastadas en el sistema de lubricación.",
    },
  },

  // Capsule 12: Lenguaje de Llantas
  {
    id: "lenguaje_llantas_full",
    slug: "lenguaje-llantas-neumaticos",
    mode: "wizard",
    title: "Lenguaje de llantas: lo que tus neumáticos te dicen",
    summary: "Las llantas narran la historia del vehículo. Aprende a leer patrones de desgaste, entender códigos grabados y determinar cuándo es momento de cambiarlas.",
    difficulty: "intermediate",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/EF4444/FFFFFF?text=Tire+Talk",
        link: "https://observauto.co",
        accentColor: "#EF4444",
      },
    ],
    sections: [
      {
        id: "intro_llantas",
        order: 1,
        type: "intro",
        title: "Cada llanta cuenta una historia",
        content: "Los neumáticos son el único punto de contacto entre tu vehículo y la carretera. Por eso, pocas partes revelan tanto sobre el cuidado y manejo de un auto como sus llantas. Cada patrón de desgaste cuenta una historia: ¿fueron rotadas regularmente? ¿El alineamiento es correcto? ¿El conductor acelera y frena suavemente? Aprender a leer estas señales te convertirá en un detective automotor capaz de descifrar el pasado de cualquier vehículo.",
      },
      {
        id: "concept_llanta_1",
        order: 2,
        type: "concept",
        title: "Decodificando los números: el código de tu llanta",
        content: "Cada llanta tiene grabado un código complejo que revela todas sus especificaciones: Ejemplo: 205/55R16 91H. 205 = ancho en milímetros (distance entre flancos). 55 = perfil o aspect ratio (height as % del width). R = radial construction. 16 = diámetro del rin en pulgadas. 91 = load index (capacidad de carga). H = speed rating (máxima velocidad segura). Load index 91 = 615 kg per tire. Speed rating H = hasta 210 km/h. N=140, P=150, Q=160, R=170, S=180, T=190, U=200, H=210, V=240, W=270, Y=300, Z= +300 km/h.",
      },
      {
        id: "concept_llanta_2",
        order: 3,
        type: "concept",
        title: "Patrones de desgaste: el diagnóstico visual",
        content: "Cada patrón indica un problema específico: FEATHERING (bordes afilados internos/externos) = toe misalignment, necesita alineación. CUPPING (scalloped pattern) = worn suspension components, shocks o bushings. CENTER WEAR = over-inflation, tires inflated over spec. SHOULDER WEAR (inside/outside) = under-inflation o camber misalignment. ONE-SIDED WEAR = toe-in or camber issue. CUP SHAPED Depression = bent rim o bearing problem. BALD SPOTS = misbalanced tire, needs rebalancing. ROAD HAZARD DAMAGE = punctures, cuts, impact breaks. Inner/Outer Shoulder Wear específicamente indica camber misalignment.",
      },
      {
        id: "tips_llanta_1",
        order: 4,
        type: "tips",
        title: "Señales de que tus llantas necesitan reemplazo",
        content: "No esperes hasta que sea demasiado tarde:",
        bulletPoints: [
          "TREAD DEPTH < 2/32 inch (6mm) - legal limit alcanzado",
          "CRACKING DRY ROT en sidewall - tire aging, replacement needed",
          "BULGES o BLISTERS en sidewall - internal damage, immediate danger",
          "PUNCTURES > 1/4 inch diameter - repair not recommended",
          "VIBRATION EXCESSIVE after balancing - internal damage possible",
          "AGE > 6-8 años regardless of tread - rubber deterioration"
        ],
      },
      {
        id: "concept_llanta_3",
        order: 5,
        type: "concept",
        title: "Mantenimiento preventivo: extiende la vida útil",
        content: "El cuidado correcto puede duplicar la vida de tus llantas: ROTACIÓN cada 8,000-10,000 km mantiene wear patterns uniform. Presión correcta (especificación manufacturer) = fuel efficiency + handling óptimo. ALINEACIÓN cada 15,000 km previene uneven wear. BALANCE cada 15,000 km o cuando feel vibration. Inspección visual monthly para damage, nails, bulges. Avoid CURBS = tire damage y wheel bent. STORE properly si usar seasonal tires: cool, dark, dry location, inflate to spec. Quality matters: tire age más importante que tread depth para safety.",
      },
      {
        id: "tips_llanta_2",
        order: 6,
        type: "tips",
        title: "Reading the road: entiende lo que manejas",
        content: "Interpretar feedback de tus llantas mejora driving safety:",
        bulletPoints: [
          "GOOD TRACTION: Tire grips firmly, no sliding en corners",
          "HANDLING RESPONSE: Car responds predictably a steering input",
          "BRAKING DISTANCE: Stops straight without pulling",
          "COMFORT LEVEL: Minimal vibration, quiet rolling",
          "WATER DISPLACEMENT: Good en wet conditions, no hydroplaning",
          "COLD WEATHER: Flexible rubber maintains grip en low temps"
        ],
      },
    ],
    quiz: {
      question: "Si observas desgaste en el centro de la banda de rodamiento de tus llantas, ¿qué problema tienen?",
      options: [
        "Presión de aire muy alta",
        "Presión de aire muy baja",
        "Desalineación",
        "Suspensión gastada"
      ],
      correctIndex: 0,
      explanation: "El desgaste en el centro indica over-inflation. Las llantas se abomban en el centro cuando están muy infladas, causando que solo el centro toque el suelo y se desgaste más rápidamente.",
    },
  },

  // Capsule 13: El ADN del Vehículo: VIN
  {
    id: "vin_vehiculo_full",
    slug: "vin-adn-vehiculo-identificacion",
    mode: "wizard",
    title: "El ADN del Vehículo: VIN Decodificado",
    summary: "El Número de Identificación Vehicular contiene información codificada sobre origen, fabricación y especificaciones. Aprende a descifrarlo y úsalo para verificar la historia completa del auto.",
    difficulty: "advanced",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/8B5CF6/FFFFFF?text=VIN+Decode",
        link: "https://observauto.co",
        accentColor: "#8B5CF6",
      },
    ],
    sections: [
      {
        id: "intro_vin",
        order: 1,
        type: "intro",
        title: "El fingerprint digital de tu vehículo",
        content: "El VIN (Vehicle Identification Number) es como el ADN de tu vehículo: un código único de 17 caracteres que revela su identidad completa. Fabricación, país de origen, marca, modelo, año, motor, transmisión, colores, características especiales... todo está codificado. Aprender a decodificar el VIN te convierte en un detective automotor capaz de verificar historial, detectar fraude y entender las características específicas de cualquier vehículo.",
      },
      {
        id: "concept_vin_1",
        order: 2,
        type: "concept",
        title: "Anatomía del VIN: cada posición cuenta",
        content: "Los 17 caracteres del VIN siguen un estándar internacional: CARACTERES 1-3 (WMI - World Manufacturer Identifier): 1=País, 2=Manufacturer, 3=Tipo de vehículo. CARACTERES 4-8 (VDS - Vehicle Descriptor Section): Descripción del vehículo, incluye modelo, versión, motor, transmisión, configuración. CARACTERES 9 (Check Digit): Verificación matemática para detectar errores. CARACTERES 10 (Model Year): A=1980, B=1981... Y=2000, 1=2001, 2=2002... 9=2009, luego secuencia se repite. CARACTERES 11 (Plant Code): Planta de fabricación específica. CARACTERES 12-17 (Serial Number): Número secuencial único del vehículo.",
      },
      {
        id: "concept_vin_2",
        order: 3,
        type: "concept",
        title: "Decodificación práctica: ejemplos reales",
        content: "Ejemplo BMW: WBA8B1C50GF123456. WBA = BMW Alemania (Bavaria). 8 = Serie 3. B = 328i. 1 = modelo year 2016. C = Leipzig plant. 50 = motor 2.0L Turbo. 6 = check digit. F = año 2015. 2 = segunda generación. Ejemplo Toyota: 5YFBURHE5FP123456. 5Y = Toyota Motor Corporation USA. F = Corolla. B = motor 1.8L. U = manual transmission. R = asiento Tipo A. H = config safety package. E = versión trim level. 5 = check digit. F = año 2015. P = Indiana plant. Cada manufacturer tiene sus propios códigos específicos.",
      },
      {
        id: "tips_vin_1",
        order: 4,
        type: "tips",
        title: "Cómo obtener información del VIN",
        content: "Fuentes confiables para descifrar VIN:",
        bulletPoints: [
          "DECODERS ONLINE: vin-decoder.com, autcheck.com, decode VIN online",
          "DEALER SERVICES: Many dealers provide free VIN lookup para prospects",
          "SERVICE RECORDS: Original paperwork, window sticker, insurance cards",
          "GOVERNMENT DATABASES: DMV records, insurance databases, police reports",
          "THIRD-PARTY SERVICES: Carfax, AutoCheck, vehicle history reports",
          "MANUFACTURER WEBSITES: BMWusa.com, toyota.com have VIN tools"
        ],
      },
      {
        id: "concept_vin_3",
        order: 5,
        type: "concept",
        title: "Fraude VIN: cómo detectarlo",
        content: "Señales de VIN alterado o fraudulento: VIN STAMPED mismatched con registration documents. NÚMEROS inconsistentes entre VIN physical y paperwork. MISSING VIN check digit. POSICIÓN incorrecta de characters según year code. WMI que no corresponde con brand claimed. REPLACED VIN plates en newer vehicles. MISSMATCH entre VIN y vehicle characteristics (engine size, transmission type). INTERVENED VIN etching visible under UV light. SOLICITA siempre independent verification si hay dudas sobre VIN authenticity.",
      },
      {
        id: "tips_vin_2",
        order: 6,
        type: "tips",
        title: "Uses prácticos del VIN knowledge",
        content: "Aprovecha el conocimiento del VIN para decisiones inteligentes:",
        bulletParts: [
          "VEHICLE HISTORY: Accidents, recalls, ownership records",
          "PARTS COMPATIBILITY: Ensure correct replacement parts ordering",
          "INSURANCE PRICING: Specific vehicle characteristics affect premiums",
          "TRADE-IN VALUE: Know exact specifications para proper valuation",
          "SERVICE TRACKING: Maintain accurate service records by VIN",
          "STOLEN VEHICLE CHECK: Verify VIN against stolen vehicle databases"
        ],
      },
    ],
    quiz: {
      question: "¿Qué representan los primeros 3 caracteres del VIN?",
      options: [
        "Color y trim level del vehículo",
        "World Manufacturer Identifier (WMI)",
        "Número de serie del motor",
        "Código de planta de ensamblaje"
      ],
      correctIndex: 1,
      explanation: "Los primeros 3 caracteres del VIN forman el WMI (World Manufacturer Identifier) que identifica el país, fabricante y tipo de vehículo. Es fundamental para decodificar la información básica del vehículo.",
    },
  },

  // Capsule 14: Fugas: Las Lágrimas del Auto
  {
    id: "fugas_lagrimas_auto_full",
    slug: "fugas-automotrices-diagnostico",
    mode: "wizard",
    title: "Fugas: Las Lágrimas del Auto",
    summary: "Un charco bajo tu auto no siempre es agua. Aprende a identificar fugas por color, textura y ubicación, y determina la gravedad de cada una.",
    difficulty: "intermediate",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/06B6D4/FFFFFF?text=Leak+Detection",
        link: "https://observauto.co",
        accentColor: "#06B6D4",
      },
    ],
    sections: [
      {
        id: "intro_fugas",
        order: 1,
        type: "intro",
        title: "Cada gota cuenta una historia",
        content: "Un vehículo no debería 'llorar' sin razón. Cada fluido que se escapa tiene su propio color, olor, ubicación y urgencia. Los expertos no solo identifican el tipo de fuga: determinan su origen exacto, gravedad y costo de reparación. Esta cápsula te enseña a convertir cada charco en el garage en información diagnóstica precisa para que sepas si puedes seguir manejando o necesitas parar inmediatamente.",
      },
      {
        id: "concept_fuga_1",
        order: 2,
        type: "concept",
        title: "Colores y texturas: el código de identificación",
        content: "Cada fluido automotive tiene características distintivas: ACEITE DE MOTOR color normal amber a dark brown, greasy texture, odor distintivo. LOCALIZACIÓN typical: motor, transmission, differential. Coolant color varies: green, blue, orange según type. Sweet smell = ethylene glycol poisoning hazard. WATER: clear, no smell, appears mostly after AC use o rain. GASOLINE: clear to amber, strong petroleum odor, extremely flammable. LIQUIDO DE FRENOS light amber, bitter taste if tasted (NOT recommended). POWER STEERING red to dark red, oil consistency. AC REFRIGERANT clear, sweet smell, appears en compressor area.",
      },
      {
        id: "concept_fuga_2",
        order: 3,
        type: "concept",
        title: "Ubicación estratégica: dónde buscar pistas",
        content: "La posición de las fugas revela su origen específico: FRONT CENTER/ENGINE AREA = oil pan, timing cover, valve cover gaskets. REAR/TRANSMISSION AREA = transmission seals, driveshaft u-joints. LEFT/RIGHT WHEEL AREA = brake caliper, wheel cylinder, ABS modulator. PASSENGER FOOTWELL = heater core, AC evaporator, firewall seals. UNDER TRANSMISSION = transmission pan, torque converter seals. DASHBOARD AREA = windshield washer fluid, HVAC issues. UNDER REAR SEATS = fuel tank, exhaust system. Patterns help locate exactly which component needs attention.",
      },
      {
        id: "tips_fuga_1",
        order: 4,
        type: "tips",
        title: "Niveles de urgencia: ¿cuándo parar?",
        content: "Aprende a priorizar según tipo y gravedad:",
        bulletPoints: [
          "ROJO CRÍTICO: Brake fluid, steering fluid, engine oil severely low",
          "AMARILLO URGENTE: Coolant, transmission fluid, significant oil leaks",
          "GREEN PRUDENT: Small oil drips, windshield washer fluid, AC refrigerant",
          "WHITE NORMAL: Water from AC, rain water, normal condensation",
          "NEVER ignore brake fluid leaks - safety critical",
          "Large oil puddles indicate internal engine damage"
        ],
      },
      {
        id: "concept_fuga_3",
        order: 5,
        type: "concept",
        title: "Diagnóstico avanzado: causas raíz",
        content: "Cada fuga tiene causes específicas: GASKET FAILURES: Often age-related, most common en high-mileage vehicles. Common gasket leaks: valve cover, oil pan, intake manifold, cylinder head. HOSES: Age, heat, pressure cause cracking, soft spots. Belts wear over time. SEALS: CV joint boots, transmission seals, differential seals. COOLING SYSTEM: Radiator corrosion, water pump seals, thermostat housing. ENGINE INTERNAL: Blown head gasket, cracked engine block, warped cylinder head - most expensive repairs.",
      },
      {
        id: "tips_fuga_2",
        order: 6,
        type: "tips",
        title: "Acciones inmediatas según el tipo de fuga",
        content: "Protocolo de emergencia por tipo de fluido:",
        bulletPoints: [
          "BRAKE FLUID: Stop immediately, tow to nearest shop",
          "COOLANT: Monitor temperature, add water if needed, reach service",
          "OIL: Check level, top off if low, schedule service within days",
          "FUEL: No smoking area, no flames, immediate professional attention",
          "POWER STEERING: Drive to service safely, avoid sharp turns",
          "AC REFRIGERANT: Minimal immediate danger but affects comfort"
        ],
      },
    ],
    quiz: {
      question: "Si encuentras un líquido azul dulce en el área del motor, ¿qué fluido es y qué acción tomar?",
      options: [
        "Aceite de motor - agregar más aceite",
        "Refrigerante (coolant) - peligroso si toca piel, necesita reparación",
        "Agua del aire acondicionado - normal",
        "Líquido de frenos - cambiar inmediatamente"
      ],
      correctIndex: 1,
      explanation: "El refrigerante (coolant) típicamente es azul, verde o naranja, tiene olor dulce y es tóxico si se ingiere o contacta la piel. Indica una fuga en el sistema de refrigeración que requiere reparación profesional.",
    },
  },

  // Capsule 15: Testigos del Tablero (completa)
  {
    id: "testigos_tablero_full",
    slug: "testigos-tablero-completo",
    mode: "wizard",
    title: "Testigos del Tablero: Guía Completa",
    summary: "Decodifica cada luz de advertencia de tu panel. Desde el temido 'Check Engine' hasta indicadores de mantenimiento rutinario.",
    difficulty: "basic",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/DC2626/FFFFFF?text=Dashboard+Lights",
        link: "https://observauto.co",
        accentColor: "#DC2626",
      },
    ],
    sections: [
      {
        id: "intro_testigos",
        order: 1,
        type: "intro",
        title: "Tu tablero: un sistema de comunicación vital",
        content: "Cada luz en tu tablero tiene un propósito específico. No son装饰: son warnings systems diseñados para proteger tu inversión y tu seguridad. Entender qué dice cada indicador puede significar la diferencia entre una visita rutinaria al taller y una reparación costosa por ignorar señales tempranas. Esta guía completa te enseña a interpretar cada luz como un verdadero experto.",
      },
      {
        id: "concept_test_1",
        order: 2,
        type: "concept",
        title: "Sistema de clasificación universal",
        content: "Todas las luces del tablero siguen una clasificación internacional: INFO (azul/verde): Funcionamiento normal, no action needed. CAUTION (amarillo/ámbar): Atención requerida pronto, pero no emergency. WARNING (rojo): Atención inmediata, potential safety hazard. Todos los manufacturers siguen estos standards: Toyota, BMW, Ford, Honda, Mercedes - todos usan colores similares para meanings similares. Un amber warning nunca debe ser ignored completamente, un red warning requiere acción inmediata.",
      },
      {
        id: "concept_test_2",
        order: 3,
        type: "concept",
        title: "Luces críticas de seguridad",
        content: "Algunas luces requieren conocimiento específico: BRAKE SYSTEM (red circle con !) = parking brake engaged o brake fluid low - jamás ignores. Esta luz significa que tu sistema de frenos no está funcionando correctamente. AIRBAG SRS (red circle con manikín) = sistema de bolsas de aire disabled - reduces dramatically tu protection en accidente. Esta luz indica que en caso de colisión, no tendrás protección de airbags. ABS (yellow circle con ABS) = sistema anti-bloqueo fails - reduces braking effectiveness especialmente en wet/slippery conditions.",
      },
      {
        id: "tips_test_1",
        order: 4,
        type: "tips",
        title: "Luces de motor: el check engine y amigos",
        content: "El temido check engine tiene diferentes causas:",
        bulletPoints: [
          "SOLID YELLOW: Major component fault, reduce speed to service",
          "BLINKING YELLOW: Misfire detected, drive carefully to service",
          "SOLID RED: Severe fault, stop engine when safe",
          "GREEN/YELLOW icons: Normal system operation",
          "YELLOW symbols: Non-critical maintenance reminders",
          "Always write down exact symbol and when it appears"
        ],
      },
      {
        id: "concept_test_3",
        order: 5,
        type: "concept",
        title: "Luces de mantenimiento rutinario",
        content: "No todas las luces significan problems serios: SERVICE REMINDER (wrench icon) = mantenimiento scheduled, oil change due. TIRE PRESSURE (flat tire icon) = tire pressure low en uno o más tires, check pressures. COOLANT TEMP (thermometer in water) = engine temperature high, stop when safe to prevent overheating. OIL PRESSURE (oil can) = oil pressure low, stop engine immediately to prevent damage. FUEL LOW (gas pump) = fuel level low, refuel soon. BATTERY (battery icon) = charging system failure, turn off unnecessary electrical loads.",
      },
      {
        id: "tips_test_2",
        order: 6,
        type: "tips",
        title: "Qué hacer inmediatamente según la luz",
        content: "Protocolo específico por color y tipo:",
        bulletPoints: [
          "RED SAFETY LIGHTS: Stop safely, turn off engine if possible",
          "AMBER WARNING LIGHTS: Monitor closely, service as soon as convenient",
          "BLINKING LIGHTS: Usually indicate active problems, seek service promptly",
          "GREEN INFO LIGHTS: Normal operation, no action required",
          "YELLOW SERVICE LIGHTS: Schedule maintenance, not emergency",
          "MULTIPLE LIGHTS: May indicate electrical system problems"
        ],
      },
    ],
    quiz: {
      question: "Si aparece una luz roja intermitente de 'check engine' mientras manejas, ¿cuál es la acción correcta?",
      options: [
        "Acelerar para llegar más rápido al taller",
        "Continuar normalmente hasta la próxima gasolinera",
        "Reducir velocidad y buscar servicio inmediatamente",
        "Apagar y prender el motor para resetear"
      ],
      correctIndex: 2,
      explanation: "Una luz roja intermitente de check engine indica un problema severo activo (como misfires que pueden dañar el convertidor catalítico). Debe manejarse con precaución directa al servicio.",
    },
  },

  // Capsule 16: Antes de salir de viaje
  {
    id: "antes_salir_viaje_full",
    slug: "antes-salir-viaje-checklist",
    mode: "wizard",
    title: "Antes de salir de viaje: Checklist completo",
    summary: "Checklist completo de seguridad pre-viaje. Revisiones básicas que pueden evitar varadas en carretera y garantizar un viaje tranquilo.",
    difficulty: "basic",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/059669/FFFFFF?text=Travel+Ready",
        link: "https://observauto.co",
        accentColor: "#059669",
      },
    ],
    sections: [
      {
        id: "intro_viaje",
        order: 1,
        type: "intro",
        title: "La preparación es la clave del viaje perfecto",
        content: "Un viaje exitoso comienza mucho antes de arrancar el motor. Las mejores aventuras automotrices son aquellas donde la preparación se combina con la emoción del camino. Este checklist completo te ayuda a identificar todos los aspectos críticos que pueden arruinar un viaje planificado. Desde la presión de llantas hasta la documentación necesaria, cada punto es una inversión en tu tranquilidad y safety.",
      },
      {
        id: "concept_viaje_1",
        order: 2,
        type: "concept",
        title: "Inspección exterior: primeros 5 minutos",
        content: "La inspección visual externa toma solo 5 minutos pero detecta 80% de problemas potenciales: VISUAL WALK-AROUND: Walk slowly around vehicle, look for damage, leaks, loose parts. TIRES: Check pressure en all tires con gauge, look for cuts, bulges, uneven wear. LIGHTS: Test headlights, tail lights, brake lights, turn signals, hazards. GLASS: Check windshield para chips/cracks, side mirrors alignment. LICENSE PLATES: Verify clear visibility, proper mounting. SPARE TIRE: Confirm tire is properly inflated, jack en proper location, all tools present.",
      },
      {
        id: "concept_viaje_2",
        order: 3,
        type: "concept",
        title: "Under the hood: fluidos vitales",
        content: "Motor bay inspection revealed critical fluid levels: ENGINE OIL: Park on level surface, warm engine, dipstick shows adequate level, normal color. COOLANT: Reservoir shows between MIN y MAX marks, no rust particles visible. BRAKE FLUID: Master cylinder reservoir adequate, no dark contamination. POWER STEERING: Reservoir shows proper level, no leaks visible around fittings. WINDSHIELD WASHER: Reservoir filled with proper fluid concentration. BATTERY: Terminals clean, no corrosion, connections tight. Belts show proper tension, no cracking visible.",
      },
      {
        id: "tips_viaje_1",
        order: 4,
        type: "tips",
        title: "Documentación esencial para viajar",
        content: "Never leave without these documents:",
        bulletPoints: [
          "DRIVER'S LICENSE: Current, unexpired, not suspended",
          "VEHICLE REGISTRATION: Current registration sticker, registration card",
          "INSURANCE POLICY: Current liability insurance, proof of insurance card",
          "OWNER'S MANUAL: Vehicle-specific maintenance y emergency procedures",
          "EMERGENCY CONTACTS: Roadside assistance numbers, insurance company",
          "REGISTRATION NUMBER: Write down VIN y license plate for emergencies"
        ],
      },
      {
        id: "concept_viaje_3",
        order: 5,
        type: "concept",
        title: "Emergency kit: preparation for the unexpected",
        content: "Prepare emergency supplies según your route y climate: BASIC TOOLKIT: Tire jack, lug wrench, basic tools, flashlight, jumper cables. EMERGENCY SUPPLIES: First aid kit, emergency triangles/flares, blanket, bottled water. CLIMATE-SPECIFIC: Ice scraper y de-icer (winter), sunscreen y hat (summer). MEDICAL: Prescription medications, basic pain relievers, any vehicle-specific medications. COMMUNICATION: Fully charged phone, car charger, emergency contact list. MONEY: Cash para tolls, emergencies, unexpected expenses.",
      },
      {
        id: "tips_viaje_2",
        order: 6,
        type: "tips",
        title: "Route planning: el GPS de la preparación",
        content: "Plan your route para minimize problems:",
        bulletPoints: [
          "ROUTE RESEARCH: Check traffic patterns, construction alerts, alternate routes",
          "FUEL STOPS: Identify gas stations, especially en rural areas",
          "WEATHER CONDITIONS: Check forecast para route y destination areas",
          "STOPOVER PLANNING: Schedule breaks every 2 hours to prevent fatigue",
          "EMERGENCY EXIT RESEARCH: Know rest stops, hospitals, police stations along route",
          "VEHICLE CONDITION: Service vehicle before long trips, especially pre-road trip tune-up"
        ],
      },
    ],
    quiz: {
      question: "Al hacer la inspección pre-viaje, ¿cuál es el mejor momento para revisar el aceite de motor?",
      options: [
        "Con motor frío, antes de arrancar",
        "Con motor caliente, después de conducir 15 minutos",
        "Con motor apagado, sin importancia el estado",
        "Solo necesito revisar el nivel visualmente"
      ],
      correctIndex: 1,
      explanation: "El aceite se lee correctamente con el motor caliente para asegurar que el aceite circula completamente y se drena de vuelta al cárter, dando una lectura precisa del nivel.",
    },
  },

  // Capsule 17: Mantenimiento Planificado
  {
    id: "mantenimiento_planificado_full",
    slug: "mantenimiento-planificado-preventivo",
    mode: "wizard",
    title: "Mantenimiento Planificado: La clave de la longevidad",
    summary: "La clave para extender la vida útil de tu vehículo. Cronograma de mantenimientos preventivos vs correctivos y cómo ahorrar a largo plazo.",
    difficulty: "intermediate",
    sponsors: [
      {
        name: "Observauto",
        logoUrl: "https://placehold.co/200x80/7C2D12/FFFFFF?text=Maintenance+Pro",
        link: "https://observauto.co",
        accentColor: "#7C2D12",
      },
    ],
    sections: [
      {
        id: "intro_mantenimiento",
        order: 1,
        type: "intro",
        title: "Mantenimiento vs Reparación: el diferencial que ahorra miles",
        content: "La diferencia entre un propietario inteligente y uno costoso se mide en mantenimiento preventivo. Los autos tratados con respeto y mantenidos sistemáticamente pueden superar los 300,000 km con relativa facilidad, mientras que aquellos neglectados necesitan reparaciones costosas antes de los 100,000 km. Esta cápsula te enseña a crear un plan de mantenimiento que maximiza tu inversión automotriz y minimiza gastos inesperados.",
      },
      {
        id: "concept_mant_1",
        order: 2,
        type: "concept",
        title: "Regla del tiempo vs kilometraje: ¿qué pesa más?",
        content: "Cada componente automotive tiene diferentes timing requirements: ENGINE OIL: Every 5,000-7,500 km (severe service) o 10,000-15,000 km (normal service). TIME factors: Oil oxidizes even unused, recommend change cada 6 months regardless km. ENGINE AIR FILTER: Every 15,000-30,000 km, más frequent si dusty conditions. TIME factors: Filters degrade even en storage, replace annually. BRAKE FLUID: Every 2 años, absorbs moisture causing corrosion. POWER STEERING FLUID: Every 40,000-60,000 km, more frequent si heavy use. COOLANT: Every 2-5 años depending type, not exceed maximum service life.",
      },
      {
        id: "concept_mant_2",
        order: 3,
        type: "concept",
        title: "Costos: preventivo vs correctivo",
        content: "Los números que cambian tu perspectiva: CAMBIO DE ACEITE: $320,000-480,000 vs REEMPLAZO DE MOTOR: $12-32 millones. PASTILLAS DE FRENO: $600,000-1,200,000 vs REEMPLAZO DE ROTORES: $1.6-3.2 millones. ROTACIÓN DE LLANTAS: $100,000-200,000 vs CORREA DE DISTRIBUCIÓN: $3.2-6 millones. FILTRO DE AIRE: $60,000-120,000 vs COMPRESOR A/C: $4.8-10 millones. LIMPIEZA DE MOTOR: $200,000-320,000 vs RECONSTRUCCIÓN DE MOTOR: $16-32 millones. La matemática es simple: $400,000 en mantenimiento previene $4 millones en reparaciones. Un auto con mantenimiento programado typical costs 50-70% less en total lifecycle compared to neglect.",
      },
      {
        id: "tips_mant_1",
        order: 4,
        type: "tips",
        title: "Cronograma inteligente personalizado",
        content: "Ajusta el schedule según tu driving pattern:",
        bulletPoints: [
          "CITY DRIVING: Service intervals 25% shorter (more stops/starts)",
          "HIGHWAY DRIVING: Standard intervals adequate",
          "EXTREME WEATHER: Adjust según temperature ranges",
          "TOWING/HEAVY LOAD: Reduce intervals by 30-40%",
          "STORAGE PERIODS: Pre-storage y post-storage procedures",
          "AGE FACTORS: Increase frequency después 100,000 km"
        ],
      },
      {
        id: "concept_mant_3",
        order: 5,
        type: "concept",
        title: "DIY vs Professional: dónde invertir tu tiempo",
        content: "Some maintenance tasks worth DIY, others require expertise: DIY VIABLE: Oil changes, air filters, wiper blades, tire rotation, basic inspections. PROFESSIONAL REQUIRED: Brake work, engine repairs, AC service, transmission work, electrical systems. CONSIDERATIONS: Your mechanical skill, available time, tool investment, warranty requirements. COST-BENEFIT: Calculate tool costs vs professional labor savings. Safety first: never attempt brake or steering work without proper expertise.",
      },
      {
        id: "tips_mant_2",
        order: 6,
        type: "tips",
        title: "Record keeping: la base del mantenimiento inteligente",
        content: "Document everything para maximize resale value:",
        bulletPoints: [
          "SERVICE RECEIPTS: Keep all maintenance y repair receipts",
          "REPLACEMENT PARTS: Record part numbers, brands, mileage at installation",
          "PERFORMANCE LOG: Note any changes en vehicle performance or sounds",
          "FUEL LOG: Track fuel efficiency trends para early problem detection",
          "APPOINTMENT SCHEDULE: Calendar reminders para upcoming services",
          "OWNER'S MANUAL: Follow manufacturer-specific requirements"
        ],
      },
    ],
    quiz: {
      question: "Si manejas principalmente en ciudad con muchas paradas y arranques, ¿cómo afecta el intervalo de cambio de aceite?",
      options: [
        "No hay diferencia, siempre es igual",
        "Debe ser 25% más frecuente debido al mayor estrés del motor",
        "Puede ser menos frecuente porque manejas menos",
        "Solo importa el tiempo, no los kilómetros"
      ],
      correctIndex: 1,
      explanation: "El manejo en ciudad con frecuentes arranques y paradas causa mayor estrés térmico y de carga al motor, requiriendo cambios de aceite 25% más frecuentes para mantener protección adecuada.",
    },
  },

  // Capsule 18: Vehículos eléctricos
  {
    id: "vehiculos_electricos_full",
    slug: "vehiculos-electricos-futuro-movilidad",
    mode: "wizard",
    title: "Vehículos eléctricos: La revolución de la movilidad",
    summary: "La revolución de la movilidad ya está aquí. Todo sobre vehículos eléctricos: tecnología de baterías, costos reales, infraestructura de carga y futuro en Colombia.",
    difficulty: "advanced",
    sponsors: [
      {
        name: "Tesla Colombia",
        logoUrl: "https://placehold.co/200x80/000000/FFFFFF?text=Tesla+Colombia",
        link: "https://tesla.com/colombia",
        accentColor: "#000000",
      },
    ],
    sections: [
      {
        id: "intro_electricos",
        order: 1,
        type: "intro",
        title: "El futuro ya llegó: movilidad sin emisiones",
        content: "Los vehículos eléctricos ya no son concepto futurista: son realidad presente que está transformando la industria automotriz global. Con más de 10 millones de unidades vendidas mundialmente y disponibilidad en Colombia, entender esta tecnología es esencial para cualquier entusiasta automotor. Esta cápsula desmitifica los EVs, analiza su viabilidad actual y proyecta su impacto en el ecosistema de transporte colombiano.",
      },
      {
        id: "concept_ele_1",
        order: 2,
        type: "concept",
        title: "Tecnología de baterías: el corazón eléctrico",
        content: "Las baterías de ion-litio son el breakthrough que hizo viable la movilidad masiva: COMPOSICIÓN: Anodos de grafito, cátodos de litio-níquel-manganeso-cobalto (NMC), electrolyte de litio en sal. DENSIDAD ENERGÉTICA: 250-300 Wh/kg, permitiendo 400-600 km de range. CICLOS DE VIDA: 1,000-2,000 ciclos completos (8-12 años typical use). DEGRADACIÓN: 2-3% anual loss en capacity, predictable decline. CARACTERÍSTICAS: No memory effect, fast charging capability, wide temperature operating range. SAFETY: Multiple failsafe systems, thermal management, crash protection. FUTURO: Lithium-sulfur (500+ Wh/kg), solid-state (1,000+ Wh/kg) promise 2x range improvement.",
      },
      {
        id: "concept_ele_2",
        order: 3,
        type: "concept",
        title: "Eficiencia y performance: myth vs reality",
        content: "Los EVs desafían preconceptions sobre performance y eficiencia: ACELERACIÓN: Entrega instantánea de torque significa 0-100 km/h en 3-5 segundos, comparable a autos deportivos. ENTREGA DE POTENCIA: Aceleración lineal, no requiere cambios, respuesta instantánea. EFICIENCIA: 85-95% conversión de energía vs 25-35% combustión interna. RECUPERACIÓN DE ENERGÍA: Frenado regenerativo recupera 15-25% energía durante conducción urbana. AUTONOMÍA REAL: 70-80% del rango anunciado en condiciones reales. IMPACTO CLIMÁTICO: 40-60% menor emisiones lifecycle vs vehículos gasolina, 90% menor cuando usa energía renovable.",
      },
      {
        id: "tips_ele_1",
        order: 4,
        type: "tips",
        title: "Carga y infraestructura: la nueva experiencia",
        content: "Entender el ecosystem de charging es crucial:",
        bulletPoints: [
          "NIVEL 1 (Hogar): 120V, 6-13 km de autonomía por hora, carga nocturna",
          "NIVEL 2 (Hogar/Público): 240V, 32-64 km por hora, carga pública típica",
          "DC RÁPIDA: 50-350kW, 80% carga en 20-40 minutos, corredores de autopista",
          "COSTO POR KM: $120-320 vs $400-600 gasolina (tarifas Colombia)",
          "RED DE CARGA: Tesla Supercharger, IONITY, ChargePoint, redes locales",
          "IMPACTO EN RED: Gestión inteligente de carga, potencial vehicle-to-grid"
        ],
      },
      {
        id: "concept_ele_3",
        order: 5,
        type: "concept",
        title: "Colombia: estado actual y proyecciones",
        content: "El mercado colombiano EV está en early adoption phase: CURRENT MODELS: Tesla Model 3/Y, BMW i3/i4, Nissan Leaf, Renault Zoe available through importers. GOVERNMENT INCENTIVES: VAT exemption hasta 2026, reduced import duties. INFRASTRUCTURA GROWTH: Chargers en Bogotá, Medellín, Cali, Bucaramanga. CHALLENGES: High import costs, limited service network, range anxiety para long trips. OPPORTUNITIES: Solar-powered charging, wind energy integration, urban delivery applications. PROJECTION: 5-10% market share by 2030, similar to global trends.",
      },
      {
        id: "tips_ele_2",
        order: 6,
        type: "tips",
        title: "Consideraciones de compra: factors de decisión",
        content: "Evaluate these aspects para EV ownership:",
        bulletPoints: [
          "DAILY DRIVING: 90% of trips < 100 miles, EV ideal para commuting",
          "HOME CHARGING: Essential para convenient ownership, garage requirement",
          "HIGHWAY FREQUENCY: Long trips require charging infrastructure research",
          "WEATHER CONSIDERATION: Cold weather reduces range 20-30%",
          "TOTAL COST: Evaluate electricity vs gasoline savings over 5-10 years",
          "RESALE VALUE: EVs hold value well, but technology evolves rapidly"
        ],
      },
    ],
    quiz: {
      question: "¿Cuál es la principal ventaja de las baterías de ion-litio sobre las tecnologías anteriores?",
      options: [
        "Son más baratas de producir",
        "No tienen degradación con el tiempo",
        "Combinan alta densidad energética con longevidad y carga rápida",
        "Pueden durar sin cargar por meses"
      ],
      correctIndex: 2,
      explanation: "Las baterías de ion-litio revolucionaron los EVs porque combinan múltiples ventajas: alta densidad energética para mayor autonomía, miles de ciclos de vida, capacidad de carga rápida y ausencia de memory effect.",
    },
  },

];
