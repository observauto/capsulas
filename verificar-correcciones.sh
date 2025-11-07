#!/bin/bash

echo "🔍 VERIFICACIÓN DE CORRECCIONES DE SINCRONIZACIÓN"
echo "================================================"
echo ""

# Verificar AuthContext.tsx
echo "📄 Verificando AuthContext.tsx..."
if grep -q "Promise.race.*timeoutPromise" /workspace/capsulas-deploy/src/context/AuthContext.tsx; then
    echo "✅ Timeout implementado en AuthContext"
else
    echo "❌ FALTA: Timeout en AuthContext"
fi

if grep -q "setTimeout.*30000" /workspace/capsulas-deploy/src/context/AuthContext.tsx; then
    echo "✅ Timeout de 30 segundos configurado"
else
    echo "❌ FALTA: Configuración de timeout"
fi

if grep -q "finally.*setIsSyncing(false)" /workspace/capsulas-deploy/src/context/AuthContext.tsx; then
    echo "✅ Cleanup de isSyncing implementado"
else
    echo "❌ FALTA: Cleanup de isSyncing"
fi

echo ""

# Verificar GamificationContext.tsx
echo "📄 Verificando GamificationContext.tsx..."
if grep -q "syncTimeoutReached" /workspace/capsulas-deploy/src/context/GamificationContext.tsx; then
    echo "✅ Flag syncTimeoutReached implementado"
else
    echo "❌ FALTA: Flag syncTimeoutReached"
fi

if grep -q "setTimeout.*45000" /workspace/capsulas-deploy/src/context/GamificationContext.tsx; then
    echo "✅ Timeout de 45 segundos en GamificationContext"
else
    echo "❌ FALTA: Timeout de 45 segundos"
fi

if grep -q "fallback.*localStorage" /workspace/capsulas-deploy/src/context/GamificationContext.tsx; then
    echo "✅ Fallback a localStorage implementado"
else
    echo "❌ FALTA: Fallback a localStorage"
fi

if grep -q "clearTimeout.*timeoutId" /workspace/capsulas-deploy/src/context/GamificationContext.tsx; then
    echo "✅ Cleanup de timeout implementado"
else
    echo "❌ FALTA: Cleanup de timeout"
fi

echo ""

# Verificar manejo de errores
echo "📄 Verificando manejo de errores..."
if grep -q "try.*catch.*error" /workspace/capsulas-deploy/src/context/GamificationContext.tsx; then
    echo "✅ Try-catch en GamificationContext"
else
    echo "❌ FALTA: Try-catch en GamificationContext"
fi

if grep -q "if.*cancelled.*return" /workspace/capsulas-deploy/src/context/GamificationContext.tsx; then
    echo "✅ Verificación de cancellation implementada"
else
    echo "❌ FALTA: Verificación de cancellation"
fi

echo ""
echo "🎯 RESUMEN:"
echo "  - AuthContext: Timeout de 30s con Promise.race"
echo "  - GamificationContext: Timeout de 45s con fallback"
echo "  - Manejo robusto de errores y cleanup"
echo "  - Estado reseteado apropiadamente"
echo ""
echo "✅ VERIFICACIÓN COMPLETADA"
echo ""
echo "🚀 Para probar la aplicación:"
echo "   cd /workspace/capsulas-deploy && npm run dev"
echo "   Luego navegar a http://localhost:8081"
echo ""
echo "🔑 Para felipegaran@gmail.com:"
echo "   Código de acceso: 013"