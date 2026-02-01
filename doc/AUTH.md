# Guide d'Authentification - Quiz Maker

## 📋 Vue d'ensemble

L'authentification a été implémentée avec :
- **JWT (JSON Web Tokens)** pour la sécurité
- **bcryptjs** pour le hachage des mots de passe
- **Prisma** pour la gestion de la base de données

## 🗂️ Structure

### Routes API
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion d'un utilisateur

### Pages
- `/auth/login` - Page de connexion
- `/auth/register` - Page d'inscription

### Utilities
- `src/lib/authHelpers.js` - Gestion des tokens localStorage
- `src/lib/useAuth.js` - Hook React pour l'authentification
- `src/components/ProtectedRoute.js` - Composant pour protéger les routes
- `src/components/Header.js` - Header avec menu utilisateur

### Middleware
- `middleware.js` - Protección de routes côté serveur

## 🔐 Flux d'authentification

### Inscription
1. L'utilisateur remplit le formulaire (nom, email, mot de passe)
2. Les données sont envoyées à `/api/auth/register`
3. Le serveur valide les données et vérifie si l'email existe
4. Le mot de passe est hashé avec bcryptjs
5. L'utilisateur est créé dans la base de données
6. Un JWT est généré et renvoyé
7. Le token est sauvegardé dans localStorage
8. L'utilisateur est redirigé vers `/quizzes`

### Connexion
1. L'utilisateur remplit le formulaire (email, mot de passe)
2. Les données sont envoyées à `/api/auth/login`
3. Le serveur cherche l'utilisateur par email
4. Le mot de passe est comparé avec le hash
5. Un JWT est généré et renvoyé
6. Le token est sauvegardé dans localStorage
7. L'utilisateur est redirigé vers `/quizzes`

### Déconnexion
1. L'utilisateur clique sur "Déconnexion"
2. Le token et les données utilisateur sont supprimés de localStorage
3. L'utilisateur est redirigé vers `/auth/login`

## 📊 Modèle de données

### User
```prisma
model User {
  id        String    @id @default(uuid())
  email     String    @unique
  name      String
  password  String
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}
```

## 🚀 Installation et utilisation

### 1. Configuration
Assurez-vous que le fichier `.env.local` existe :
```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

### 2. Migration
```bash
npx prisma migrate dev --name add_user_model
```

### 3. Démarrer le serveur
```bash
npm run dev
```

### 4. Accéder à l'app
- Aller à `http://localhost:3000`
- Vous serez redirigé vers `/auth/login`
- Créer un compte ou vous connecter

## 🔒 Sécurité

- ✅ Les mots de passe sont hashés avec bcryptjs (10 rounds)
- ✅ Les emails sont uniques
- ✅ Validation côté serveur
- ✅ JWT avec expiration de 7 jours
- ✅ Middleware pour protéger les routes

## ⚙️ Configuration avancée

### Modifier l'expiration du JWT
Dans `src/app/api/auth/login/route.js` et `register/route.js` :
```javascript
const token = jwt.sign(
  { id: user.id, email: user.email },
  JWT_SECRET,
  { expiresIn: "7d" }  // Modifier cette valeur
);
```

### Modifier les routes protégées
Dans `middleware.js` :
```javascript
export const config = {
  matcher: [
    "/quizzes/:path*",
    "/results/:path*",
    "/api/quizzes/:path*"
  ],
};
```

## 🐛 Dépannage

### "Email ou mot de passe incorrect"
- Vérifiez que l'email existe
- Vérifiez que le mot de passe est correct

### Token expiré
- Le token expire après 7 jours
- L'utilisateur doit se reconnecter

### Erreur de migration
```bash
npx prisma migrate reset
npx prisma migrate dev --name add_user_model
```

## 📝 À faire

- [ ] Ajouter une fonctionnalité "Oublier mon mot de passe"
- [ ] Ajouter la vérification par email
- [ ] Ajouter l'authentification OAuth (Google, GitHub)
- [ ] Ajouter les logs d'authentification
