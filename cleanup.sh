#!/bin/bash

# ⚡ Script de nettoyage - Architecture RESTful
# Supprime les dossiers et fichiers obsolètes

echo "🧹 Nettoyage de l'ancienne architecture..."

# Dossiers à supprimer
FOLDERS_TO_DELETE=(
    "src/app/quiz"
    "src/app/api/quiz"
)

# Fichiers à supprimer
FILES_TO_DELETE=(
    "src/lib/quizService.js"
)

# Supprimer les dossiers
for folder in "${FOLDERS_TO_DELETE[@]}"; do
    if [ -d "$folder" ]; then
        echo "❌ Suppression du dossier: $folder"
        rm -rf "$folder"
    fi
done

# Supprimer les fichiers
for file in "${FILES_TO_DELETE[@]}"; do
    if [ -f "$file" ]; then
        echo "❌ Suppression du fichier: $file"
        rm "$file"
    fi
done

echo "✅ Nettoyage terminé !"
echo ""
echo "📝 Fichiers de documentation créés :"
echo "   • ARCHITECTURE.md        - Guide complet de l'architecture"
echo "   • CHANGEMENTS.md         - Détail des changements effectués"
echo "   • README_ARCHITECTURE.md - Vue rapide du projet"
echo "   • VALIDATION.md          - Checklist de validation"
echo "   • cleanup.sh             - Ce script"
echo ""
echo "🚀 Prochaines étapes :"
echo "   1. npm install"
echo "   2. npx prisma migrate dev"
echo "   3. npm run dev"
echo "   4. Consulter ARCHITECTURE.md pour la documentation complète"
