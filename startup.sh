#!/bin/bash

# 🚀 Script de démarrage - Quiz Maker (Architecture RESTful)

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║        🚀 Quiz Maker - Démarrage (Architecture RESTful)       ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Vérifications préalables
echo "📋 Vérifications préalables..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé"
    exit 1
fi

echo "✅ Node.js $(node -v)"
echo "✅ npm $(npm -v)"
echo ""

# Installation dépendances
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi
    echo "✅ Dépendances installées"
else
    echo "✅ Dépendances déjà installées"
fi
echo ""

# Migration Prisma
echo "🗄️  Migration de la base de données..."
if [ ! -f "prisma/dev.db" ]; then
    npx prisma migrate dev --name init
    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de la migration Prisma"
        exit 1
    fi
    echo "✅ Base de données initialisée"
else
    echo "✅ Base de données déjà initialisée"
fi
echo ""

# Vérification de l'état
echo "🔍 Vérification de l'implémentation..."
if node check-status.js | grep -q "INCOMPLETE"; then
    echo ""
    echo "⚠️  Certains fichiers sont manquants"
    echo "Veuillez consulter ARCHITECTURE.md"
else
    echo "✅ Tous les fichiers sont présents"
fi
echo ""

# Afficher les informations de démarrage
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║                   🎯 Prêt à démarrer ! 🎯                    ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

echo "📚 Documentation disponible :"
echo "   • INDEX.md              - Navigation complète"
echo "   • STATUS.md             - État du projet"
echo "   • ARCHITECTURE.md       - Documentation technique"
echo "   • README_ARCHITECTURE.md - Vue rapide"
echo ""

echo "🚀 Commandes disponibles :"
echo "   npm run dev             - Démarrer le serveur (port 3000)"
echo "   npm run build           - Build pour production"
echo "   npm start               - Démarrer en production"
echo "   npm run lint            - Vérifier le code"
echo ""

echo "🌐 URLs importantes :"
echo "   • http://localhost:3000/quizzes              - Liste des quiz"
echo "   • http://localhost:3000/quizzes/:id          - Affichage"
echo "   • http://localhost:3000/quizzes/:id/edit     - Édition"
echo "   • http://localhost:3000/quizzes/:id/preview  - Prévisualisation"
echo ""

echo "📡 API endpoints :"
echo "   • GET    /api/quizzes              - Lister"
echo "   • POST   /api/quizzes              - Créer"
echo "   • GET    /api/quizzes/:id          - Détail"
echo "   • PUT    /api/quizzes/:id          - Mettre à jour"
echo "   • DELETE /api/quizzes/:id          - Supprimer"
echo "   • POST   /api/generate-quiz        - Générer IA"
echo ""

# Option de démarrage
if [ "$1" == "--start" ] || [ "$1" == "-s" ]; then
    echo "🚀 Démarrage du serveur..."
    npm run dev
else
    echo "💡 Pour démarrer le serveur, exécutez :"
    echo "   npm run dev"
    echo ""
    echo "Ou relancez ce script avec --start :"
    echo "   bash startup.sh --start"
fi

echo ""
