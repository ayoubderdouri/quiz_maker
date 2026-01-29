# Quiz Maker - Architecture RESTful

## 🎯 Vue rapide

Application **Next.js** pour créer et gérer des quiz avec **SurveyJS**, utilisant une architecture **REST propre**.

```
/quizzes           → Liste + Modal création (IA ou manuelle)
/quizzes/:id       → Affichage du quiz (read-only)
/quizzes/:id/edit  → Édition avec SurveyJS Creator
/quizzes/:id/preview → Prévisualisation (read-only)

API REST:
GET    /api/quizzes          → Liste
POST   /api/quizzes          → Création
GET    /api/quizzes/:id      → Détail
PUT    /api/quizzes/:id      → Mise à jour
DELETE /api/quizzes/:id      → Suppression
POST   /api/generate-quiz    → Génération IA
```

---

## 🚀 Démarrage rapide

### Installation
```bash
npm install
npx prisma migrate dev
npm run dev
```

### Variables d'environnement
```env
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="sk-..."
```

---

## 📚 Documentation complète

**Voir [ARCHITECTURE.md](./ARCHITECTURE.md)** pour :
- 📋 Détail des endpoints API
- 🎨 Structure des pages frontend
- 🧩 Composants réutilisables
- 📡 Service client unifié
- 🗂️ Schéma Prisma

**Voir [CHANGEMENTS.md](./CHANGEMENTS.md)** pour :
- ✅ Changements effectués
- 🔄 Migration des appels
- 📝 Fichiers modifiés/créés
- 🚀 Prochaines étapes

---

## 🏗️ Architecture en 3 minutes

### Couche API (Backend)
```javascript
// src/app/api/quizzes/route.js
export async function GET()  { /* liste */ }
export async function POST() { /* création */ }

// src/app/api/quizzes/[id]/route.js
export async function GET()    { /* détail */ }
export async function PUT()    { /* maj */ }
export async function DELETE() { /* suppression */ }

// src/app/api/generate-quiz/route.js
export async function POST() { /* IA */ }
```

### Couche Service Client (Middleware)
```javascript
// src/lib/quizApiClient.js
export async function getAllQuizzes() { ... }
export async function getQuizById(id) { ... }
export async function createQuiz() { ... }
export async function updateQuiz() { ... }
export async function deleteQuiz() { ... }
export async function generateQuizWithAI() { ... }
```

### Couche Présentation (Frontend)
```javascript
// src/app/quizzes/page.js
// Liste + Modal AIGeneratorModal

// src/app/quizzes/[id]/page.js
// Affichage avec SurveyPreview (read-only)

// src/app/quizzes/[id]/edit/page.js
// Édition avec SurveyEditor (Creator)

// src/app/quizzes/[id]/preview/page.js
// Prévisualisation avec SurveyPreview (read-only)
```

---

## 🧩 Composants principaux

| Composant | Lieu | Rôle |
|-----------|------|------|
| `AIGeneratorModal` | Modal (modale dialog) | Génération IA + création quiz |
| `SurveyPreview` | Pages [id] & preview | Affichage read-only SurveyJS |
| `SurveyEditor` | Page [id]/edit | Édition SurveyJS Creator |
| `Header` | Sidebar, Layout | Barre de navigation |
| `Sidebar` | Layout | Menu latéral |

---

## 🔌 Flux de données

### Cas d'usage : Créer un quiz via IA
```mermaid
Modal AIGeneratorModal
  ↓ (saisie prompt)
POST /api/generate-quiz
  ↓ (retour surveyData)
POST /api/quizzes
  ↓ (sauvegarde BD)
onSuccess()
  ↓ (recharge liste)
Affichage /quizzes
```

### Cas d'usage : Éditer un quiz
```
Page /quizzes/:id/edit
  ↓ (chargement initial)
GET /api/quizzes/:id
  ↓ (affichage Creator)
SurveyEditor
  ↓ (modification)
onClick "Enregistrer"
  ↓
PUT /api/quizzes/:id
  ↓ (sauvegarde)
Message succès
```

---

## ✅ Checklist validité REST

- ✅ Ressource unique plurielle : `/quizzes`
- ✅ Méthodes HTTP standard : GET/POST/PUT/DELETE
- ✅ Pas de verbes dans les URL
- ✅ Codes HTTP corrects (201, 404, etc.)
- ✅ Pagination sur GET
- ✅ Pas de pages `/create` hors ressource
- ✅ JSON uniforme : `{ success, data, error }`
- ✅ Service client centralisé
- ✅ Composants réutilisables

---

## 🧪 Testing

### Test des endpoints
```bash
# Liste
curl http://localhost:3000/api/quizzes

# Créer
curl -X POST http://localhost:3000/api/quizzes \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Desc"}'

# Détail
curl http://localhost:3000/api/quizzes/:id

# Mettre à jour
curl -X PUT http://localhost:3000/api/quizzes/:id \
  -H "Content-Type: application/json" \
  -d '{"title":"Nouveau titre"}'

# Supprimer
curl -X DELETE http://localhost:3000/api/quizzes/:id
```

### Test des pages
- [ ] http://localhost:3000/quizzes
- [ ] http://localhost:3000/quizzes/:id
- [ ] http://localhost:3000/quizzes/:id/edit
- [ ] http://localhost:3000/quizzes/:id/preview

---

## 📦 Dépendances clés

```json
{
  "next": "16.1.6",
  "react": "19.2.3",
  "@prisma/client": "^6.16.0",
  "survey-core": "^2.5.8",
  "survey-creator-react": "^2.5.8",
  "survey-react-ui": "^2.5.8",
  "lucide-react": "^0.563.0",
  "axios": "^1.13.4"
}
```

---

## 🔐 Sécurité (À implémenter)

- [ ] Validation des entrées (zod/yup)
- [ ] Rate limiting sur API
- [ ] CORS configuration
- [ ] Authentication (JWT/NextAuth)
- [ ] Authorization (roles)
- [ ] Input sanitization

---

## 📈 Roadmap future

- [ ] Pagination côté frontend
- [ ] Tri et filtrage avancés
- [ ] Tags et catégories
- [ ] Partage de quiz
- [ ] Analytics et statistiques
- [ ] Versioning des quiz
- [ ] Export (PDF, CSV)
- [ ] Import depuis autres sources
- [ ] Collaboration temps réel

---

## 📞 Support

Voir [ARCHITECTURE.md](./ARCHITECTURE.md) pour plus de détails techniques.

---

**Version :** 1.0.0 (Architecture RESTful)  
**Dernière mise à jour :** 2026-01-29
