#!/usr/bin/env node

/**
 * 📊 Vérification d'état du projet - Architecture RESTful
 * 
 * Ce script vérifie que tous les fichiers nécessaires sont en place
 * et donne un rapport du statut de l'implémentation
 */

const fs = require('fs');
const path = require('path');

// Couleurs pour le terminal
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log(`\n${colors.bold}${colors.blue}📊 Vérification d'état - Architecture RESTful${colors.reset}\n`);

// Fichiers à vérifier
const filesToCheck = [
  // API Routes
  { path: 'src/app/api/quizzes/route.js', type: 'API', desc: 'GET/POST /api/quizzes' },
  { path: 'src/app/api/quizzes/[id]/route.js', type: 'API', desc: 'GET/PUT/DELETE /api/quizzes/:id' },
  { path: 'src/app/api/generate-quiz/route.js', type: 'API', desc: 'POST /api/generate-quiz' },
  
  // Pages Frontend
  { path: 'src/app/quizzes/page.js', type: 'Page', desc: 'GET /quizzes (liste + modal)' },
  { path: 'src/app/quizzes/[id]/page.js', type: 'Page', desc: 'GET /quizzes/:id (affichage)' },
  { path: 'src/app/quizzes/[id]/edit/page.js', type: 'Page', desc: 'GET /quizzes/:id/edit' },
  { path: 'src/app/quizzes/[id]/preview/page.js', type: 'Page', desc: 'GET /quizzes/:id/preview' },
  
  // Composants
  { path: 'src/components/SurveyPreview.js', type: 'Component', desc: 'Affichage read-only' },
  { path: 'src/components/SurveyEditor.js', type: 'Component', desc: 'Édition SurveyJS' },
  { path: 'src/components/AIGeneratorModal.js', type: 'Component', desc: 'Modal génération IA' },
  
  // Service Client
  { path: 'src/lib/quizApiClient.js', type: 'Service', desc: 'Client API REST' },
  
  // Documentation
  { path: 'doc/ARCHITECTURE.md', type: 'Doc', desc: 'Documentation technique' },
  { path: 'doc/CHANGEMENTS.md', type: 'Doc', desc: 'Changements effectués' },
  { path: 'doc/README_ARCHITECTURE.md', type: 'Doc', desc: 'Vue rapide' },
  { path: 'doc/VALIDATION.md', type: 'Doc', desc: 'Checklist validation' },
  { path: 'doc/MIGRATION.md', type: 'Doc', desc: 'Guide migration' },
  { path: 'doc/RECAP.md', type: 'Doc', desc: 'Résumé final' },
  { path: 'doc/INDEX.md', type: 'Doc', desc: 'Index documentation' }
];

// Vérifier les fichiers
let present = 0;
let missing = 0;
const byType = {};

filesToCheck.forEach(file => {
  const fullPath = path.join(__dirname, file.path);
  const exists = fs.existsSync(fullPath);
  
  if (!byType[file.type]) byType[file.type] = { present: 0, missing: 0 };
  
  if (exists) {
    console.log(`${colors.green}✅${colors.reset} ${file.path}`);
    console.log(`   ${file.desc}\n`);
    present++;
    byType[file.type].present++;
  } else {
    console.log(`${colors.red}❌${colors.reset} ${file.path}`);
    console.log(`   ${file.desc}\n`);
    missing++;
    byType[file.type].missing++;
  }
});

// Résumé
console.log(`${colors.bold}${colors.blue}════════════════════════════════════════${colors.reset}\n`);
console.log(`${colors.bold}Résumé par type:${colors.reset}\n`);

Object.entries(byType).forEach(([type, stats]) => {
  const total = stats.present + stats.missing;
  const percentage = Math.round((stats.present / total) * 100);
  const status = percentage === 100 ? `${colors.green}✅${colors.reset}` : `${colors.yellow}⚠️${colors.reset}`;
  
  console.log(`${status} ${type.padEnd(12)} : ${stats.present}/${total} (${percentage}%)`);
});

console.log(`\n${colors.bold}${colors.blue}════════════════════════════════════════${colors.reset}\n`);

// Status global
if (missing === 0) {
  console.log(`${colors.green}${colors.bold}✅ TOUS LES FICHIERS SONT PRÉSENTS${colors.reset}\n`);
  console.log(`${colors.green}Total: ${present}/${present} fichiers${colors.reset}\n`);
  console.log(`${colors.bold}Prochaines étapes:${colors.reset}`);
  console.log(`1. npm install`);
  console.log(`2. npx prisma migrate dev`);
  console.log(`3. npm run dev`);
  console.log(`4. Consulter doc/INDEX.md pour la documentation\n`);
} else {
  console.log(`${colors.red}${colors.bold}❌ FICHIERS MANQUANTS${colors.reset}\n`);
  console.log(`${colors.red}Manquants: ${missing}/${present + missing} fichiers${colors.reset}\n`);
  console.log(`${colors.yellow}⚠️  Veuillez créer les fichiers manquants avant de continuer${colors.reset}\n`);
}

// Informations du projet
console.log(`${colors.bold}📊 Informations du projet:${colors.reset}\n`);
console.log(`Architecture    : RESTful (API REST + Next.js App Router)`);
console.log(`Endpoints API   : 6 (GET/POST/PUT/DELETE quizzes)`);
console.log(`Pages Frontend  : 4 (/quizzes, /:id, /:id/edit, /:id/preview)`);
console.log(`Composants      : 3 (SurveyPreview, SurveyEditor, AIGeneratorModal)`);
console.log(`Service Client  : 1 (quizApiClient.js)`);
console.log(`Documentation   : 7 fichiers\n`);

console.log(`${colors.bold}Ressources:${colors.reset}\n`);
console.log(`📚 doc/INDEX.md              - Commencez ici pour la navigation`);
console.log(`📖 doc/ARCHITECTURE.md       - Documentation technique complète`);
console.log(`🔄 doc/MIGRATION.md          - Guide de migration du code existant`);
console.log(`✅ doc/VALIDATION.md         - Checklist et points de test`);
console.log(`🎉 doc/RECAP.md              - Résumé final\n`);

console.log(`${colors.bold}${colors.green}Status: ${missing === 0 ? '✨ READY' : '⚠️  INCOMPLETE'}${colors.reset}\n`);
