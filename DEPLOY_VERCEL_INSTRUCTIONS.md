# Deploy Cápsulas ObservAuto en Vercel

## 📋 REQUISITOS PREVIOS

1. **Cuenta de Vercel**: [vercel.com](https://vercel.com)
2. **Supabase Project**: Crear proyecto en [supabase.com](https://supabase.com)
3. **Google Cloud Console**: Configurar OAuth para Google Sign-In

## 🚀 PASOS PARA DEPLOY

### 1. **Subir Proyecto a GitHub**
```bash
# Crear repositorio en GitHub y subir
git init
git add .
git commit -m "Initial commit: Cápsulas ObservAuto"
git branch -M main
git remote add origin YOUR_GITHUB_REPO_URL
git push -u origin main
```

### 2. **Configurar Variables de Entorno en Vercel**

En el dashboard de Vercel, ir a:
- Project → Settings → Environment Variables

**Variables Requeridas:**

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

### 3. **Configurar Google OAuth**

1. **Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
2. **APIs & Services** → **Credentials**
3. **OAuth 2.0 Client ID** → **Authorized JavaScript origins**
4. **Agregar**: `https://your-app.vercel.app`
5. **Guardar cambios**

### 4. **Configurar Supabase**

**1. Tabla user_profiles:**
```sql
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

-- RLS Policy
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON user_profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

**2. Configurar Authentication:**
- Authentication → Settings → Site URL: `https://your-app.vercel.app`
- Authentication → Settings → Redirect URLs: `https://your-app.vercel.app`

### 5. **Deploy en Vercel**

1. **Conectar GitHub**: Vercel → New Project → Import Git Repository
2. **Configurar Build Settings**:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. **Deploy**: Click "Deploy"
4. **Verificar**: Esperar build completo (~2-3 minutos)

## 🔧 CONFIGURACIÓN POST-DEPLOY

### **1. Actualizar Google OAuth**
Actualizar Authorized JavaScript origins en Google Cloud Console:
- Agregar la URL final de Vercel: `https://your-app.vercel.app`

### **2. Probar Funcionalidades**
- [ ] Código de acceso "013" funciona
- [ ] Google Sign-In exitoso
- [ ] Puntos se guardan y persisten
- [ ] Badges se otorgan correctamente
- [ ] Backoffice carga sin errores
- [ ] Cápsulas son accesibles
- [ ] Sistema de premios funciona

### **3. Verificar Console (F12)**
- [ ] Sin errores críticos de JavaScript
- [ ] Supabase connection exitosa
- [ ] Sincronización de datos funciona

## 🐛 TROUBLESHOOTING

### **Error: "supabase client not configured"**
**Solución**: Verificar variables de entorno en Vercel
```bash
# Verificar en Vercel Dashboard
Project → Settings → Environment Variables
```

### **Error: "Google Sign-In Failed"**
**Solución**: 
1. Verificar Google Client ID
2. Actualizar Authorized JavaScript origins
3. Verificar Redirect URLs en Supabase

### **Error: "Permission denied"**
**Solución**: 
1. Verificar RLS policies en Supabase
2. Revisar Row Level Security

### **Build fails in Vercel**
**Solución**: 
1. Verificar package.json dependencies
2. Revisar TypeScript errors locally
3. Verificar build command: `npm run build`

## 📊 MONITORING

### **Vercel Analytics**
- Ir a Project → Analytics
- Monitorear Core Web Vitals
- Revisar Error Tracking

### **Supabase Monitoring**
- Dashboard → Logs
- Revisar Authentication logs
- Verificar Database performance

## 🔄 ACTUALIZACIONES

### **Deploy automático**
- Push a main branch = deploy automático
- Preview deployments para pull requests

### **Variables de entorno**
- Cambios requieren redeploy manual
- Mantener consistencia entre environments

## ✅ CHECKLIST FINAL

- [ ] Proyecto subido a GitHub
- [ ] Variables de entorno configuradas
- [ ] Google OAuth configurado
- [ ] Supabase configurado
- [ ] Deploy exitoso en Vercel
- [ ] Funcionalidades probadas
- [ ] Performance verificada
- [ ] Error tracking activo

## 📞 SOPORTE

**Si hay problemas:**
1. Revisar logs en Vercel Dashboard
2. Verificar console del navegador
3. Comprobar variables de entorno
4. Revisar configuración de Google/Supabase

---

**🎉 ¡Deploy exitoso!** 🎉

**URL Final**: `https://your-app.vercel.app`
**Código de Acceso**: `013`
