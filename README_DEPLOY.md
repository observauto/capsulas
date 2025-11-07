# Cápsulas ObservAuto - Deploy a GitHub y Vercel

## 🚀 Guía Completa de Deploy

### Paso 1: Subir a GitHub

```bash
# 1. Inicializar repositorio
git init

# 2. Agregar todos los archivos
git add .

# 3. Hacer commit inicial
git commit -m "Initial commit: Cápsulas ObservAuto - Versión final con correcciones de premios"

# 4. Crear branch principal
git branch -M main

# 5. Agregar remoto (reemplaza con tu URL de GitHub)
git remote add origin https://github.com/tu-usuario/capsulas-observauto.git

# 6. Subir a GitHub
git push -u origin main
```

### Paso 2: Configurar Vercel

1. **Ir a [vercel.com](https://vercel.com)**
2. **Importar proyecto desde GitHub**
   - Click "New Project"
   - Seleccionar tu repositorio `capsulas-observauto`
   - Click "Import"

3. **Configurar variables de entorno** (Project Settings → Environment Variables):

```
VITE_SUPABASE_URL=https://tu-proyecto-id.supabase.co
VITE_SUPABASE_ANON_KEY=tu_clave_anonima_de_supabase
VITE_GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
```

4. **Configurar build settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`

5. **Click "Deploy"**

### Paso 3: Configurar Google OAuth

1. **Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. **Editar tu OAuth 2.0 Client ID**
4. **Authorized JavaScript origins**:
   - Agregar: `https://capsulas-kappa.vercel.app` (tu URL de Vercel)
5. **Guardar cambios**

### Paso 4: Configurar Supabase

1. **Supabase Dashboard**: Ir a tu proyecto
2. **Authentication** → **Settings**:
   - Site URL: `https://capsulas-kappa.vercel.app`
   - Redirect URLs: `https://capsulas-kappa.vercel.app`

### Paso 5: Verificar Deploy

Después del deploy, probar:

- [ ] Acceder con código "013"
- [ ] Google Sign-In funciona
- [ ] Puntos se guardan y persisten
- [ ] Premios redimidos se guardan correctamente
- [ ] Cambiar de pestaña no lose datos
- [ ] Recargar página mantiene toda la información

## 🔧 Configuración de Base de Datos

En tu proyecto de Supabase, ejecutar:

```sql
-- Tabla para perfiles de usuario
CREATE TABLE user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'end_user',
  points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🆕 Correcciones Implementadas en esta Versión

### ✅ Problema de Premios Redimidos RESUELTO
- **Problema**: Los premios se canjeaban pero no se guardabanpersistentemente
- **Solución**: Sistema completo de localStorage con sincronización automática
- **Funcionalidades**:
  - Los premios se guardan automáticamente al canjear
  - Persisten al recargar la página
  - Sincronización entre pestañas
  - Eventos personalizados para otros componentes

### ✅ Sincronización Mejorada
- Timeout de 30 segundos en autenticación
- Fallback automático a localStorage
- Manejo robusto de errores
- Limpieza de memoria apropiada

### ✅ Arquitectura Optimizada para Vercel
- Configuración completa de build
- Variables de entorno estructuradas
- Deploy automático desde GitHub
- Monitoreo de performance

## 🎯 Estado Final del Proyecto

- **✅ Google Sign-In**: Funcionando
- **✅ Persistencia de puntos**: Resuelto
- **✅ Persistencia de badges**: Resuelto
- **✅ Persistencia de premios**: **NUEVO - RESUELTO**
- **✅ Sincronización localStorage ↔ Supabase**: Funcionando
- **✅ Sistema de backoffice completo**: 3 niveles implementados
- **✅ 20+ cápsulas educativas**: Contenido completo
- **✅ Sistema de gamificación**: Puntos, badges, niveles, premios

## 📞 Soporte

Si hay problemas:

1. **Verificar variables de entorno** en Vercel
2. **Revisar logs** en Vercel Dashboard
3. **Comprobar configuración** de Google OAuth y Supabase
4. **Testing manual** en la URL de Vercel

---

**🎉 ¡Proyecto listo para producción en Vercel!** 🎉

**URL final**: `https://capsulas-kappa.vercel.app`  
**Código de acceso**: `013`
