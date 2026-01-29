# Architecture RESTful - Gestion des Quiz

## 📋 Vue d'ensemble

Cette application suit une **architecture REST stricte** pour la gestion des quiz avec SurveyJS.

### Principes clés

- ✅ **Une seule ressource REST** : `/api/quizzes` (pluriel)
- ✅ **Pas de pages `/create` ou `/edit` hors ressource** : la création se fait via modal
- ✅ **Routes numériques clairement séparées** : pages métier vs API REST
- ✅ **JSON SurveyJS unique** : partagé entre création, édition et prévisualisation
- ✅ **Service client unifié** : `quizApiClient.js` centralise tous les appels API

---

## 🔌 API REST - Backend

### 1. **GET /api/quizzes** - Liste des quiz
```
Requête  : GET /api/quizzes?skip=0&take=10
Réponse  : { success: true, data: [...], pagination: {...} }
Status   : 200 OK
```

**Exemple de réponse :**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid-1",
      "title": "Quiz JavaScript",
      "description": "Fondamentaux de JS",
      "status": "draft",
      "surveyData": { /* SurveyJS JSON */ },
      "createdAt": "2026-01-29T10:03:13.000Z",
      "updatedAt": "2026-01-29T10:03:13.000Z"
    }
  ],
  "pagination": {
    "total": 42,
    "skip": 0,
    "take": 10,
    "hasMore": true
  }
}
```

---

### 2. **POST /api/quizzes** - Créer un quiz
```
Requête  : POST /api/quizzes
Body     : { 
              title: "Quiz IA",
              description?: "Description du quiz",
              surveyData?: { /* SurveyJS JSON */ },
              status?: "draft"
           }
Réponse  : { success: true, data: {...} }
Status   : 201 Created
```

**Utilisé par :**
- Modal AIGeneratorModal (génération IA)
- Potentiellement un formulaire manuel de création

---

### 3. **GET /api/quizzes/:id** - Récupérer un quiz
```
Requête  : GET /api/quizzes/uuid-123
Réponse  : { success: true, data: {...} }
Status   : 200 OK | 404 Not Found
```

---

### 4. **PUT /api/quizzes/:id** - Mettre à jour un quiz
```
Requête  : PUT /api/quizzes/uuid-123
Body     : {
              title?: "Nouveau titre",
              description?: "Nouvelle description",
              surveyData?: { /* Données SurveyJS mises à jour */ },
              status?: "published"
           }
Réponse  : { success: true, data: {...} }
Status   : 200 OK | 404 Not Found
```

**Utilisé par :**
- Page `/quizzes/:id/edit` (enregistrement des modifications SurveyJS)

---

### 5. **DELETE /api/quizzes/:id** - Supprimer un quiz
```
Requête  : DELETE /api/quizzes/uuid-123
Réponse  : { success: true, message: "Quiz deleted successfully" }
Status   : 200 OK | 404 Not Found
```

---

### 6. **POST /api/generate-quiz** - Génération IA
```
Requête  : POST /api/generate-quiz
Body     : {
              prompt: "Créer un quiz sur la géographie...",
              niveau: "intermediate",
              files?: [/* PDF files */]
           }
Réponse  : { success: true, surveyData: {...} }
Status   : 200 OK
```

**Retourne :** JSON SurveyJS valide (à utiliser directement dans POST /api/quizzes)

---

## 🎨 Frontend - Pages (App Router)

### Structure des routes

```
src/app/
├── quizzes/
│   ├── page.js                    # GET /quizzes (liste + modal)
│   └── [id]/
│       ├── page.js                # GET /quizzes/:id (affichage read-only)
│       ├── edit/
│       │   └── page.js            # GET /quizzes/:id/edit (SurveyJS Creator)
│       └── preview/
│           └── page.js            # GET /quizzes/:id/preview (SurveyJS read-only)
└── api/
    └── quizzes/
        ├── route.js               # GET/POST /api/quizzes
        └── [id]/
            └── route.js           # GET/PUT/DELETE /api/quizzes/:id
```

---

### 1. **GET /quizzes** - Page principale
**Fichier :** `src/app/quizzes/page.js`

**Fonctionnalités :**
- 📋 Liste tous les quiz
- ➕ Bouton "Créer un Quiz" → modal AIGeneratorModal
- 👁️ Bouton "Voir" → `/quizzes/:id`
- ✏️ Bouton "Éditer" → `/quizzes/:id/edit`
- 🗑️ Bouton "Supprimer" → DELETE /api/quizzes/:id

**Appels API :**
- `getAllQuizzes()` : GET /api/quizzes
- `deleteQuiz(id)` : DELETE /api/quizzes/:id

---

### 2. **GET /quizzes/:id** - Affichage (read-only)
**Fichier :** `src/app/quizzes/[id]/page.js`

**Fonctionnalités :**
- 📄 Affiche le titre et la description
- 📊 Rendu SurveyJS en mode lecture seule (composant `SurveyPreview`)
- ← Bouton "Retour"

**Appels API :**
- `getQuizById(id)` : GET /api/quizzes/:id

---

### 3. **GET /quizzes/:id/edit** - Édition avec SurveyJS Creator
**Fichier :** `src/app/quizzes/[id]/edit/page.js`

**Fonctionnalités :**
- ✏️ Éditeur complet SurveyJS Creator
- 💾 Bouton "Enregistrer" → PUT /api/quizzes/:id
- ⚠️ Indicateur "Modifications non enregistrées"
- ← Bouton "Retour"

**Appels API :**
- `getQuizById(id)` : GET /api/quizzes/:id (initial)
- `updateQuiz(id, {...})` : PUT /api/quizzes/:id

---

### 4. **GET /quizzes/:id/preview** - Prévisualisation (read-only)
**Fichier :** `src/app/quizzes/[id]/preview/page.js`

**Fonctionnalités :**
- 📺 Rendu SurveyJS en mode lecture seule
- 🔒 Pas de modification possible
- ← Bouton "Retour"

**Appels API :**
- `getQuizById(id)` : GET /api/quizzes/:id

---

## 🧩 Composants réutilisables

### 1. **SurveyPreview.js**
Affiche un quiz en mode read-only avec SurveyJS.

**Props :**
- `surveyData` : objet JSON SurveyJS
- `onComplete` (optionnel) : callback après completion

**Usage :**
```jsx
<SurveyPreview 
  surveyData={quiz.surveyData}
  onComplete={(results) => console.log(results)}
/>
```

---

### 2. **SurveyEditor.js**
Composant d'édition avec SurveyJS Creator.

**Props :**
- `initialData` : JSON SurveyJS initial
- `onChange` : callback lors des changements
- `onSave` : callback lors de la sauvegarde

**Usage :**
```jsx
<SurveyEditor 
  initialData={quiz.surveyData}
  onChange={(data) => setQuizData(data)}
  onSave={(data) => updateQuiz(data)}
/>
```

---

### 3. **AIGeneratorModal.js**
Modal de création via IA.

**Props :**
- `isOpen` : booléen
- `onClose` : callback fermeture
- `onSuccess` : callback après succès

**Flow :**
1. Utilisateur saisit prompt + niveau
2. POST /api/generate-quiz → génère surveyData
3. POST /api/quizzes → crée quiz avec surveyData
4. Appel `onSuccess()` → recharge liste

---

## 📡 Service Client Unifié

**Fichier :** `src/lib/quizApiClient.js`

Centralise tous les appels API REST :

```javascript
// Liste
const quizzes = await getAllQuizzes(skip, take);

// Détail
const quiz = await getQuizById(id);

// Création
const { success, data, error } = await createQuiz(title, desc, surveyData);

// Mise à jour
const { success, data, error } = await updateQuiz(id, updates);

// Suppression
const { success, error } = await deleteQuiz(id);

// Génération IA
const { success, surveyData, error } = await generateQuizWithAI(prompt, niveau, files);
```

---

## 🗂️ Schéma Prisma

```prisma
model Quiz {
  id   String @id @default(uuid())
  data Json   // Contient : title, description, surveyData, status, createdAt, updatedAt
}
```

**Structure de `data` :**
```json
{
  "title": "Quiz JavaScript",
  "description": "Fondamentaux de JavaScript",
  "surveyData": { /* SurveyJS JSON complet */ },
  "status": "draft | published | archived",
  "createdAt": "ISO string",
  "updatedAt": "ISO string"
}
```

---

## ✅ Checklist d'intégration

- [x] Routes API REST correctes (`/api/quizzes`)
- [x] Service client unifié (`quizApiClient.js`)
- [x] Composants SurveyJS réutilisables
- [x] Modal centralisée pour création
- [x] Pages d'affichage, édition, prévisualisation
- [x] Gestion des erreurs
- [x] Indicateurs de chargement
- [x] Pas de page `/create` hors ressource
- [x] Pas de route API dupliquée

---

## 🚀 Prochaines améliorations

- [ ] Pagination côté frontend
- [ ] Tri et filtrage des quiz
- [ ] Tags et catégories
- [ ] Partage de quiz
- [ ] Analytics (nombre de réponses, scores)
- [ ] Versioning des quiz
- [ ] Backup/Export des quiz
