#!/bin/bash

echo "🔍 Vérification de l'authentification..."
echo ""

# Vérifier npm
echo "✓ Dépendances installées:"
npm list bcryptjs jsonwebtoken 2>/dev/null | grep -E "bcryptjs|jsonwebtoken" || echo "  ⚠️  Packages à installer"

echo ""
echo "✓ Fichiers d'authentification créés:"
test -f src/app/api/auth/login/route.js && echo "  ✅ route.js (login)" || echo "  ❌ route.js (login)"
test -f src/app/api/auth/register/route.js && echo "  ✅ route.js (register)" || echo "  ❌ route.js (register)"
test -f src/app/auth/login/page.js && echo "  ✅ page.js (login)" || echo "  ❌ page.js (login)"
test -f src/app/auth/register/page.js && echo "  ✅ page.js (register)" || echo "  ❌ page.js (register)"
test -f src/lib/authHelpers.js && echo "  ✅ authHelpers.js" || echo "  ❌ authHelpers.js"
test -f src/lib/useAuth.js && echo "  ✅ useAuth.js" || echo "  ❌ useAuth.js"
test -f src/components/ProtectedRoute.js && echo "  ✅ ProtectedRoute.js" || echo "  ❌ ProtectedRoute.js"
test -f middleware.js && echo "  ✅ middleware.js" || echo "  ❌ middleware.js"

echo ""
echo "✓ Configuration:"
test -f .env.local && echo "  ✅ .env.local créé" || echo "  ❌ .env.local"
test -f prisma/schema.prisma && grep -q "model User" prisma/schema.prisma && echo "  ✅ User model dans schema.prisma" || echo "  ❌ User model"

echo ""
echo "✓ Base de données:"
test -d prisma/migrations && echo "  ✅ Dossier migrations existe" || echo "  ❌ Dossier migrations"

echo ""
echo "🚀 Prêt à démarrer! Commandes:"
echo "   npm run dev     - Démarrer le serveur en développement"
echo "   npm run build   - Construire pour la production"
echo "   npm run start   - Démarrer le serveur de production"
echo ""
echo "📖 Documentation:"
echo "   doc/AUTH.md     - Guide complet d'authentification"
