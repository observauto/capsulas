# Cápsulas Observauto - Deploy Package

## 🚀 Deploy en Vercel

Este paquete contiene la aplicación **Cápsulas Observauto** con el **hotfix de persistencia de premios** integrado.

### 📁 Estructura de Archivos

```
capsulas-observauto/
├── index.html                    # HTML principal con hotfix integrado
├── favicon.png                   # Icono de la aplicación
├── assets/
│   ├── index-xLpqPu_r.js        # JavaScript principal (802KB)
│   ├── index-DfLOpy3z.css       # Estilos principales (95KB)
│   └── hotfix-persistencia-premios.js # Hotfix de premios
├── vercel.json                   # Configuración de Vercel
├── .vercelignore                 # Archivos excluidos
└── README.md                     # Este archivo
```

## 🎯 Hotfix de Persistencia de Premios

### Características del Hotfix

- **✅ Auto-guardado**: Los premios se guardan automáticamente en localStorage
- **✅ Restauración**: Los premios se restauran al recargar la página
- **✅ Intercepción**: Intercepta funciones relacionadas con premios
- **✅ Monitoreo**: Auto-guardado cada 30 segundos
- **✅ Logs**: Consola detallada para debugging

### ¿Cómo Funciona?

1. **Guarda premios** en localStorage bajo la clave `observauto-premios`
2. **Intercepta funciones** relacionadas con premios
3. **Restaura automáticamente** premios al cargar la página
4. **Auto-guardado periódico** cada 30 segundos
5. **Eventos personalizados** para restauración

### Logs en Consola

Cuando el hotfix está activo, verás en la consola:
- `🔧 Aplicando hotfix de persistencia de premios...`
- `✅ Hotfix de persistencia de premios aplicado correctamente`
- `💾 Premios guardados en localStorage: X elementos`
- `📥 Premios cargados desde localStorage: X elementos`

## 🛠️ Deploy en Vercel

### Opción 1: Deploy Automático desde Git

1. Sube este código a tu repositorio Git
2. Conecta el repositorio en [Vercel](https://vercel.com)
3. Deploy automático

### Opción 2: Deploy Manual con Vercel CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Follow prompts, set project name to: capsulas-kappa
```

### Opción 3: Upload Manual en Vercel Dashboard

1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Select "Import Git Repository" o "Browse Files"
4. Sube todos los archivos de este paquete
5. Set project name: `capsulas-kappa`

## 🌐 URLs de Deploy

- **Producción**: https://capsulas-kappa.vercel.app/
- **Staging**: URL temporal durante deploy

## ✅ Verificación Post-Deploy

Después del deploy, verifica que:

1. ✅ La página carga correctamente
2. ✅ No hay errores en consola (F12)
3. ✅ Se ve el mensaje: `🔧 Aplicando hotfix de persistencia de premios...`
4. ✅ Los premios se mantienen al recargar la página

## 🐛 Solución de Problemas

### Si el hotfix no funciona:

1. **Verifica la consola** - debe aparecer el mensaje de hotfix
2. **Check localStorage** - ejecutar en consola: `localStorage.getItem('observauto-premios')`
3. **Verifica el archivo** - `/assets/hotfix-persistencia-premios.js` debe estar accesible

### Si hay errores 404:

- Verifica que `vercel.json` esté presente
- Check que las rutas en `vercel.json` coincidan con tu estructura

## 📊 Información Técnica

- **Framework**: React SPA (compilado con Vite)
- **Hotfix**: Vanilla JavaScript
- **Compatibilidad**: Modern browsers
- **Dependencias**: Ninguna adicional

## 🔄 Actualizaciones Futuras

Para futuras actualizaciones:

1. Reemplaza los archivos correspondientes
2. Mantén `hotfix-persistencia-premios.js` para preservar la funcionalidad
3. Verifica que `vercel.json` esté actualizado

---

**Deploy Date**: 2025-11-07  
**Hotfix Version**: 1.0.0  
**Project**: Cápsulas Observauto  
**Target URL**: https://capsulas-kappa.vercel.app/