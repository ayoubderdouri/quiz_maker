```
╔════════════════════════════════════════════════════════════════════════╗
║                                                                        ║
║          📊 FLUX DE DONNÉES - Architecture RESTful (Quiz Maker)       ║
║                                                                        ║
╚════════════════════════════════════════════════════════════════════════╝
```

---

## 🎯 Cas d'usage 1: Créer un quiz via IA

```
┌─────────────────────────────────────────────────────────────────┐
│ Utilisateur clique "Créer un Quiz"                              │
└────────────────┬────────────────────────────────────────────────┘
                 │
                 ▼
         ┌──────────────────┐
         │ AIGeneratorModal │
         │    (s'ouvre)     │
         └────────┬─────────┘
                  │
    ┌─────────────┴──────────────┐
    │ Utilisateur saisit:        │
    │ - Prompt                   │
    │ - Niveau (beginner, etc.)  │
    │ - Fichiers PDF (optionnel) │
    └─────────────┬──────────────┘
                  │
                  ▼
         ┌─────────────────────────┐
         │ POST /api/generate-quiz │ ← Appel IA (OpenAI)
         └────────┬────────────────┘
                  │
                  ▼ (retour surveyData)
         ┌──────────────────────────┐
         │ POST /api/quizzes        │ ← Création en BD
         │ {                        │
         │   title,                 │
         │   description,           │
         │   surveyData             │
         │ }                        │
         └────────┬─────────────────┘
                  │
                  ▼ (201 Created)
         ┌─────────────────┐
         │ Quiz créé en BD  │
         └────────┬────────┘
                  │
                  ▼
         ┌──────────────────────┐
         │ onSuccess() callback  │
         │ Recharge liste        │
         └────────┬─────────────┘
                  │
                  ▼
    ┌─────────────────────────────┐
    │ Modal se ferme              │
    │ Liste se met à jour         │
    │ Nouveau quiz apparaît       │
    └─────────────────────────────┘
```

---

## 🎯 Cas d'usage 2: Afficher un quiz

```
┌──────────────────────────────────────┐
│ Utilisateur clique "Voir"             │
└────────────┬──────────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │ Navigation vers    │
    │ /quizzes/:id       │
    └────────┬───────────┘
             │
             ▼
  ┌──────────────────────────────────┐
  │ Composant [id]/page.js s'ouvre   │
  └────────┬─────────────────────────┘
           │
           ▼
  ┌─────────────────────────────────┐
  │ useEffect lance:                 │
  │ getQuizById(id)                  │
  │ GET /api/quizzes/:id             │
  └────────┬────────────────────────┘
           │
           ▼ (200 OK + quiz data)
  ┌──────────────────────────────────┐
  │ setState(quiz)                    │
  └────────┬─────────────────────────┘
           │
           ▼
  ┌──────────────────────────────────────┐
  │ Rendu:                               │
  │ - Titre, Description                 │
  │ - <SurveyPreview surveyData={...} />  │
  │ - Bouton Retour                      │
  └──────────────────────────────────────┘
           │
           ▼
  ┌─────────────────────────────────┐
  │ Utilisateur voit le quiz en      │
  │ lecture seule                    │
  └─────────────────────────────────┘
```

---

## 🎯 Cas d'usage 3: Éditer un quiz

```
┌──────────────────────────────────────┐
│ Utilisateur clique "Éditer"           │
└────────────┬──────────────────────────┘
             │
             ▼
    ┌────────────────────┐
    │ Navigation vers    │
    │ /quizzes/:id/edit  │
    └────────┬───────────┘
             │
             ▼
  ┌────────────────────────────────┐
  │ Composant edit/page.js s'ouvre │
  └────────┬─────────────────────┘
           │
           ▼
  ┌────────────────────────────────┐
  │ useEffect lance:                │
  │ getQuizById(id)                 │
  │ GET /api/quizzes/:id            │
  └────────┬──────────────────────┘
           │
           ▼ (200 OK + quiz data)
  ┌──────────────────────────────────┐
  │ setState(quiz)                    │
  │ setHasChanges(false)              │
  └────────┬──────────────────────┘
           │
           ▼
  ┌──────────────────────────────────────┐
  │ Rendu:                               │
  │ - Titre "Éditer: [title]"            │
  │ - <SurveyEditor initialData={...} /> │
  │ - Bouton "Enregistrer"               │
  └──────────────────────────────────────┘
           │
           ▼
  ┌─────────────────────────────────┐
  │ Utilisateur modifie le quiz     │
  │ onChange() → setHasChanges(true)│
  └────────┬────────────────────────┘
           │
           ▼
  ┌──────────────────────────────────┐
  │ Utilisateur clique "Enregistrer" │
  └────────┬─────────────────────────┘
           │
           ▼
  ┌──────────────────────────────────────────┐
  │ handleSave() lance:                      │
  │ updateQuiz(id, {surveyData, ...})        │
  │ PUT /api/quizzes/:id                     │
  │ {surveyData, title, description, ...}    │
  └────────┬─────────────────────────────────┘
           │
           ▼ (200 OK + updated quiz)
  ┌─────────────────────────────────────┐
  │ setState(updatedQuiz)                │
  │ setHasChanges(false)                 │
  │ Alert("Quiz sauvegardé !")           │
  └─────────────────────────────────────┘
           │
           ▼
  ┌─────────────────────────────────┐
  │ Utilisateur voit la confirmation│
  │ Quiz mis à jour en BD            │
  └─────────────────────────────────┘
```

---

## 🎯 Cas d'usage 4: Supprimer un quiz

```
┌──────────────────────────────────────┐
│ Utilisateur clique "Supprimer"        │
└────────────┬──────────────────────────┘
             │
             ▼
  ┌──────────────────────────────────┐
  │ Confirmation: "Êtes-vous sûr ?"  │
  └────────┬─────────────────────────┘
           │ (Oui)
           ▼
  ┌────────────────────────────────┐
  │ deleteQuiz(id) lance:           │
  │ DELETE /api/quizzes/:id         │
  └────────┬─────────────────────┘
           │
           ▼ (200 OK)
  ┌──────────────────────────────────┐
  │ Quiz supprimé de la BD            │
  └────────┬──────────────────────────┘
           │
           ▼
  ┌──────────────────────────────────┐
  │ loadQuizzes() relance:            │
  │ getAllQuizzes()                   │
  │ GET /api/quizzes                  │
  └────────┬──────────────────────────┘
           │
           ▼ (200 OK + liste mise à jour)
  ┌──────────────────────────────────┐
  │ setState(quizzes)                 │
  │ Quiz supprimé disparaît du UI     │
  └──────────────────────────────────┘
```

---

## 📊 Vue d'architecture globale

```
┌────────────────────────────────────────────────────────────────┐
│                     FRONTEND (Next.js)                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Page: List   │  │ Page: View   │  │ Page: Edit   │         │
│  │ /quizzes     │  │ /quizzes/:id │  │ /:id/edit    │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                 │
│         └─────────────────┴─────────────────┘                 │
│                      │                                        │
│           ┌──────────▼──────────┐                            │
│           │  quizApiClient.js   │                            │
│           │  (Service Client)   │                            │
│           ├─────────────────────┤                            │
│           │ • getAllQuizzes()   │                            │
│           │ • getQuizById()     │                            │
│           │ • createQuiz()      │                            │
│           │ • updateQuiz()      │                            │
│           │ • deleteQuiz()      │                            │
│           │ • generateQuizWithAI()                           │
│           └──────────┬──────────┘                            │
│                      │                                        │
└──────────────────────┼────────────────────────────────────────┘
                       │ (API REST calls)
┌──────────────────────▼────────────────────────────────────────┐
│                   BACKEND (Next.js API)                       │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐ │
│  │ GET /quizzes    │  │ POST /quizzes   │  │ PUT /quizzes  │ │
│  │ (liste)         │  │ (créer)         │  │ (update)      │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬──────┘ │
│           │                    │                   │         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌───────────────┐ │
│  │ GET /quizzes    │  │ DELETE /quizzes │  │ POST /generate│ │
│  │ /:id (détail)   │  │ /:id (delete)   │  │ (IA)          │ │
│  └────────┬────────┘  └────────┬────────┘  └────────┬──────┘ │
│           │                    │                   │         │
│           └────────────────────┴───────────────────┘         │
│                      │                                        │
│           ┌──────────▼──────────┐                            │
│           │   Prisma ORM        │                            │
│           │   (Database)        │                            │
│           └──────────┬──────────┘                            │
│                      │                                        │
└──────────────────────┼────────────────────────────────────────┘
                       │
┌──────────────────────▼────────────────────────────────────────┐
│                DATABASE (SQLite/PostgreSQL)                   │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌────────────────────────────────┐                          │
│  │  Quiz Table                    │                          │
│  ├────────────────────────────────┤                          │
│  │ id        UUID primary         │                          │
│  │ data      JSON                 │                          │
│  │           {                    │                          │
│  │             title: string      │                          │
│  │             description: string│                          │
│  │             surveyData: JSON   │                          │
│  │             status: string     │                          │
│  │             createdAt: ISO     │                          │
│  │             updatedAt: ISO     │                          │
│  │           }                    │                          │
│  └────────────────────────────────┘                          │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Flux de requête/réponse

### Requête
```
┌─────────────────────┐
│ Frontend (React)    │
│ Page or Component   │
└──────────┬──────────┘
           │
           ▼ (appel)
  ┌────────────────────────────┐
  │ Service Client             │
  │ quizApiClient.js           │
  │ (normalisation)            │
  └──────────┬─────────────────┘
             │
             ▼ (fetch)
  ┌────────────────────────────┐
  │ HTTP Request               │
  │ POST /api/quizzes/123      │
  │ Content-Type: application/json
  │ Body: { ... }              │
  └──────────┬─────────────────┘
             │
             ▼ (network)
  ┌────────────────────────────┐
  │ Next.js Server             │
  │ Route Handler              │
  │ /app/api/quizzes/[id]      │
  └──────────┬─────────────────┘
             │
             ▼ (Prisma)
  ┌────────────────────────────┐
  │ Database                   │
  │ SQLite / PostgreSQL        │
  └──────────────────────────────┘
```

### Réponse
```
  ┌────────────────────────────┐
  │ Database                   │
  │ Retour: record             │
  └──────────┬─────────────────┘
             │
             ▼ (JSON)
  ┌────────────────────────────┐
  │ Next.js Server             │
  │ HTTP Response              │
  │ Status: 200                │
  │ Body: { success, data }    │
  └──────────┬─────────────────┘
             │
             ▼ (network)
  ┌────────────────────────────┐
  │ Service Client             │
  │ normalizeQuiz()            │
  │ Retour: normalized object  │
  └──────────┬─────────────────┘
             │
             ▼ (return)
  ┌────────────────────────────┐
  │ Frontend (React)           │
  │ setState(quiz)             │
  │ Rendu UI                   │
  └────────────────────────────┘
```

---

## 🌐 Interactions utilisateur

### Page /quizzes
```
┌─────────────────────────────────────────┐
│           /quizzes (Liste)              │
├─────────────────────────────────────────┤
│                                         │
│  [Bouton: Créer un Quiz]                │
│         │                               │
│         └─► AIGeneratorModal s'ouvre   │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │ Quiz 1 | [Voir] [Éditer] [Supp] │   │
│  ├─────────────────────────────────┤   │
│  │ Quiz 2 | [Voir] [Éditer] [Supp] │   │
│  ├─────────────────────────────────┤   │
│  │ Quiz 3 | [Voir] [Éditer] [Supp] │   │
│  └─────────────────────────────────┘   │
│         │       │        │              │
│         │       │        └─► DELETE     │
│         │       └─────► /quizzes/:id/edit
│         └───────► /quizzes/:id           │
│                                         │
└─────────────────────────────────────────┘
```

### Page /quizzes/:id
```
┌────────────────────────────────────┐
│    /quizzes/:id (Affichage)        │
├────────────────────────────────────┤
│                                    │
│  [Retour]                          │
│                                    │
│  Titre du Quiz                     │
│  Description du Quiz               │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  SurveyPreview (read-only)   │  │
│  │                              │  │
│  │  Question 1: [...]           │  │
│  │  Question 2: [...]           │  │
│  │  Question 3: [...]           │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

### Page /quizzes/:id/edit
```
┌────────────────────────────────────┐
│   /quizzes/:id/edit (Édition)      │
├────────────────────────────────────┤
│                                    │
│  [Retour]  Éditer: [Titre]         │
│  [Enregistrer]                     │
│                                    │
│  ┌──────────────────────────────┐  │
│  │  SurveyEditor (Creator)      │  │
│  │  [Toolbox] [Properties]      │  │
│  │                              │  │
│  │  (Édition complète)          │  │
│  │                              │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

---

## 📊 État de données

```
Component State:

quizzes: [{
  id: "uuid-1",
  title: "Quiz JS",
  description: "Fondamentaux",
  status: "draft",
  surveyData: { pages: [...], elements: [...] },
  totalQuestions: 5,
  metadata: {...}
}, ...]

selectedQuiz: {
  id: "uuid-1",
  title: "Quiz JS",
  ...
}

isModalOpen: boolean
loading: boolean
saving: boolean
error: string | null
hasChanges: boolean
```

---

**Flux et interactions mappées !** 🗺️
