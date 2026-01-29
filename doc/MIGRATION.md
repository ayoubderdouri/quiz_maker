# 🔄 Guide de migration - Mise à jour des imports

## 📋 Vue d'ensemble

Ce guide vous aide à migrer les imports depuis l'ancienne architecture vers la nouvelle.

---

## ❌ Anciens imports → ✅ Nouveaux imports

### Service Client

#### ❌ Avant (Ancien)
```javascript
import { 
  getAllQuizzes, 
  deleteQuiz, 
  createQuizStructure 
} from '@/lib/quizService';
```

#### ✅ Après (Nouveau)
```javascript
import { 
  getAllQuizzes, 
  getQuizById,
  createQuiz, 
  updateQuiz,
  deleteQuiz,
  generateQuizWithAI
} from '@/lib/quizApiClient';
```

### Composants

#### ❌ Avant (Pas de composants réutilisables)
```javascript
// Logique SurveyJS intégrée dans les pages
// Pas d'export de composants réutilisables
```

#### ✅ Après (Nouveaux composants)
```javascript
import SurveyPreview from '@/components/SurveyPreview';
import SurveyEditor from '@/components/SurveyEditor';
import AIGeneratorModal from '@/components/AIGeneratorModal';
```

---

## 📍 Exemples par fichier

### Page : quizzes/page.js

#### ❌ Avant
```javascript
import { getAllQuizzes, deleteQuiz } from '@/lib/quizService';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';

export default function QuizzesPage() {
  // ...
  const handleDelete = async (id) => {
    const result = await deleteQuiz(id);
    // ...
  };
  // ...
  <button onClick={() => router.push('/quiz/create')}>
    Create Quiz
  </button>
}
```

#### ✅ Après
```javascript
import { getAllQuizzes, deleteQuiz } from '@/lib/quizApiClient';
import AIGeneratorModal from '@/components/AIGeneratorModal';
import { Plus, Trash2, Edit, Eye } from 'lucide-react';

export default function QuizzesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleDelete = async (id) => {
    const result = await deleteQuiz(id);
    // ...
  };
  
  const handleGenerateSuccess = () => {
    loadQuizzes();
    setIsModalOpen(false);
  };
  
  return (
    <>
      <AIGeneratorModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleGenerateSuccess}
      />
      <button onClick={() => setIsModalOpen(true)}>
        Create Quiz
      </button>
    </>
  );
}
```

---

### Page : quizzes/[id]/page.js (Nouvelle)

```javascript
import { getQuizById } from '@/lib/quizApiClient';
import SurveyPreview from '@/components/SurveyPreview';
import { useParams } from 'next/navigation';

export default function QuizViewPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const quiz = await getQuizById(id);
    setQuiz(quiz);
  }, [id]);

  return (
    <>
      <h1>{quiz.title}</h1>
      <SurveyPreview surveyData={quiz.surveyData} />
    </>
  );
}
```

---

### Page : quizzes/[id]/edit/page.js (Nouvelle)

```javascript
import { getQuizById, updateQuiz } from '@/lib/quizApiClient';
import SurveyEditor from '@/components/SurveyEditor';

export default function QuizEditPage() {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    const quiz = await getQuizById(id);
    setQuiz(quiz);
  }, [id]);

  const handleSave = async (finalSurveyData) => {
    const result = await updateQuiz(id, {
      surveyData: finalSurveyData
    });
    if (result.success) {
      setQuiz(result.data);
    }
  };

  return (
    <SurveyEditor
      initialData={quiz.surveyData}
      onSave={handleSave}
    />
  );
}
```

---

### Composant : AIGeneratorModal.js (Refactorisé)

#### ❌ Avant
```javascript
import { X, Upload, Sparkles } from 'lucide-react';

export default function AIGeneratorModal({ isOpen, onClose, onGenerate }) {
  const handleSubmit = () => {
    if (!prompt.trim()) {
      alert('Veuillez entrer un prompt');
      return;
    }

    onGenerate({
      prompt,
      niveau,
      files
    });

    // Reset
    setPrompt('');
    setNiveau('intermediate');
    setFiles([]);
    onClose();
  };
}
```

#### ✅ Après
```javascript
import { X, Upload, Sparkles, Loader } from 'lucide-react';
import { generateQuizWithAI, createQuiz } from '@/lib/quizApiClient';

export default function AIGeneratorModal({ isOpen, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!prompt.trim()) {
      setError('Veuillez entrer une description');
      return;
    }

    setLoading(true);

    try {
      // Étape 1 : Générer via IA
      const generateResult = await generateQuizWithAI(prompt, niveau, files);
      if (!generateResult.success) throw new Error(generateResult.error);

      // Étape 2 : Créer le quiz
      const createResult = await createQuiz(
        generateResult.surveyData.title,
        generateResult.surveyData.description,
        generateResult.surveyData
      );
      if (!createResult.success) throw new Error(createResult.error);

      // Succès
      setPrompt('');
      setNiveau('intermediate');
      setFiles([]);
      onClose();
      onSuccess(); // ← Recharge la liste parent

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
}
```

---

### Fonction helper (Nouvelle)

#### ✅ Utiliser quizApiClient.js

```javascript
// ❌ Ne pas utiliser
import { countSurveyQuestions } from '@/lib/quizService';

// ✅ Utiliser
import { getQuizById } from '@/lib/quizApiClient';
// Le comptage est automatique via normalizeQuiz()
const quiz = await getQuizById(id);
console.log(quiz.totalQuestions); // ← Déjà compté
```

---

## 🔗 Mappage des routes

### Routes API

| Ancienne | Nouvelle | Méthode |
|----------|----------|---------|
| `/api/quiz` | `/api/quizzes` | GET |
| `/api/quiz` | `/api/quizzes` | POST |
| `/api/quiz/:id` | `/api/quizzes/:id` | GET |
| `/api/quiz/:id` | `/api/quizzes/:id` | PUT |
| `/api/quiz/:id` | `/api/quizzes/:id` | DELETE |
| `/api/generate-quiz` | `/api/generate-quiz` | POST |

### Routes pages

| Ancienne | Nouvelle |
|----------|----------|
| `/quizzes` | `/quizzes` ✅ |
| `/quiz/create` | Modal sur `/quizzes` ✅ |
| `/quiz/:id` | `/quizzes/:id` ✅ |
| `/quiz/edit/:id` | `/quizzes/:id/edit` ✅ |
| — | `/quizzes/:id/preview` ✅ |

---

## 📦 Changements de structure

### Ancienne structure de quiz

```javascript
{
  id: "uuid",
  title: "Quiz",
  description: "Desc",
  surveyData: { /* SurveyJS */ },
  metadata: {
    totalQuestions: 5,
    totalResponses: 0,
    averageScore: 0
  },
  __persisted: true // ❌ Ancien flag
}
```

### Nouvelle structure (normalisée)

```javascript
{
  id: "uuid",
  title: "Quiz",
  description: "Desc",
  status: "draft",
  surveyData: { /* SurveyJS */ },
  createdAt: "ISO string",
  updatedAt: "ISO string",
  totalQuestions: 5, // ✅ Calculé automatiquement
  metadata: {
    totalQuestions: 5,
    createdAt: "ISO string",
    updatedAt: "ISO string"
  }
}
```

---

## 🔧 Checklist migration

### Pour chaque page/composant qui utilisait quizService

- [ ] Remplacer `import { ... } from '@/lib/quizService'`
- [ ] Par `import { ... } from '@/lib/quizApiClient'`
- [ ] Vérifier les appels de fonction (signatures changées)
- [ ] Mettre à jour les routes (pluriel `/quizzes`)
- [ ] Tester les appels API
- [ ] Supprimer les imports inutilisés
- [ ] Exécuter linter

### Pour les routes `/quiz/*`

- [ ] Migrer vers `/quizzes/*`
- [ ] Utiliser les nouveaux chemins dans router.push()
- [ ] Tester les liens de navigation

### Pour les composants SurveyJS

- [ ] Créer SurveyPreview.js si besoin d'affichage read-only
- [ ] Créer SurveyEditor.js si besoin d'édition
- [ ] Importer et utiliser dans les pages

---

## 🚀 Script de migration

Si vous avez beaucoup de fichiers, vous pouvez utiliser find/replace :

```bash
# Remplacer tous les imports du service client
find src -name "*.js" -type f -exec sed -i \
  "s|from '@/lib/quizService'|from '@/lib/quizApiClient'|g" {} \;

# Remplacer les routes /quiz par /quizzes
find src -name "*.js" -type f -exec sed -i \
  "s|/quiz/|/quizzes/|g" {} \;
```

---

## ✅ Vérification post-migration

```bash
# 1. Vérifier que tous les imports sont corrects
grep -r "from '@/lib/quizService'" src/

# 2. Vérifier qu'il y a des imports vers le nouveau client
grep -r "from '@/lib/quizApiClient'" src/

# 3. Lancer le build
npm run build

# 4. Lancer les tests
npm test

# 5. Tester localement
npm run dev
```

---

## 📝 Exemples complets

### Afficher la liste des quiz

```javascript
// ❌ Ancien
import { getAllQuizzes } from '@/lib/quizService';

useEffect(() => {
  getAllQuizzes().then(quizzes => setQuizzes(quizzes));
}, []);

// ✅ Nouveau
import { getAllQuizzes } from '@/lib/quizApiClient';

useEffect(() => {
  getAllQuizzes().then(quizzes => setQuizzes(quizzes));
}, []);
// Aucun changement d'appel, juste l'import !
```

### Créer un quiz

```javascript
// ❌ Ancien
POST /api/quiz
Body: { data: { title, description, surveyData } }

// ✅ Nouveau
const result = await createQuiz(title, description, surveyData);
// Automatiquement :
// POST /api/quizzes
// Body: { title, description, surveyData, status }
```

### Mettre à jour un quiz

```javascript
// ❌ Ancien
PUT /api/quiz/:id
Body: { data: { surveyData } }

// ✅ Nouveau
const result = await updateQuiz(id, { surveyData });
// Automatiquement :
// PUT /api/quizzes/:id
// Body: { surveyData, updatedAt }
```

---

## 🎓 Conseils

1. **Testez après chaque changement** - Ne pas faire tous les changements d'un coup
2. **Utilisez git pour tracker** - `git diff` aide à voir les changements
3. **Lisez la documentation** - [ARCHITECTURE.md](./ARCHITECTURE.md) explique chaque fonction
4. **Consultez les exemples** - Les pages créées sont des exemples d'utilisation
5. **Vérifiez les types** - Les nouvelles fonctions retournent `{ success, data, error }`

---

## ❓ Questions fréquentes

**Q: Puis-je utiliser l'ancien quizService.js?**  
R: Non, utilisez quizApiClient.js

**Q: Les signatures de fonction ont changé?**  
R: Oui, consultez [ARCHITECTURE.md - Service Client](./ARCHITECTURE.md#-service-client-unifié)

**Q: Qu'est-ce qu'AIGeneratorModal prend en paramètres?**  
R: `isOpen`, `onClose`, `onSuccess` (pas `onGenerate`)

**Q: Comment appeler POST /api/generate-quiz?**  
R: `await generateQuizWithAI(prompt, niveau, files)`

**Q: Les routes API ont changé d'URL?**  
R: Oui, de `/api/quiz` → `/api/quizzes` (pluriel)

---

**Bonne migration ! 🚀**
