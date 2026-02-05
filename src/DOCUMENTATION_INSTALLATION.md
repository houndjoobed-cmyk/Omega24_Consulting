# 📘 DOCUMENTATION D'INSTALLATION - OMEGA24 CONSULTING

## 📋 Table des Matières

1. [Prérequis](#prérequis)
2. [Installation sur PC Local](#installation-sur-pc-local)
3. [Configuration Supabase](#configuration-supabase)
4. [Configuration Resend (Emails)](#configuration-resend-emails)
5. [Déploiement en Production](#déploiement-en-production)
6. [Sécurité pour la Production](#sécurité-pour-la-production)
7. [Gestion des Comptes Admin](#gestion-des-comptes-admin)
8. [Maintenance et Monitoring](#maintenance-et-monitoring)
9. [Résolution de Problèmes](#résolution-de-problèmes)

---

## 🔧 Prérequis

### Matériel
- **PC/Mac/Linux** avec au minimum :
  - 4 GB RAM
  - 2 GB d'espace disque
  - Connexion Internet stable

### Logiciels Requis
1. **Node.js** (v18 ou supérieur)
   - Télécharger : https://nodejs.org/
   - Vérifier : `node --version`

2. **npm** (inclus avec Node.js)
   - Vérifier : `npm --version`

3. **Git** (optionnel, recommandé)
   - Télécharger : https://git-scm.com/
   - Vérifier : `git --version`

4. **Éditeur de code** (recommandé)
   - Visual Studio Code : https://code.visualstudio.com/
   - WebStorm, Sublime Text, ou autre

### Comptes à Créer
1. **Supabase** (déjà fait)
   - URL : https://supabase.com/dashboard/project/vcblcaufhcgcggnzifln
   - Projet ID : vcblcaufhcgcggnzifln

2. **Resend** (à créer)
   - URL : https://resend.com/signup
   - Service d'envoi d'emails

---

## 💻 Installation sur PC Local

### Étape 1 : Récupérer le Projet

#### Option A : Depuis Figma Make (Export)
1. Ouvrir Figma Make avec votre projet
2. Cliquer sur "Export" ou "Download"
3. Extraire le fichier ZIP dans un dossier de votre choix
   - Par exemple : `C:\Projects\omega24consulting` (Windows)
   - Ou : `~/Projects/omega24consulting` (Mac/Linux)

#### Option B : Depuis un dépôt Git (si configuré)
```bash
git clone https://votre-repo.git
cd omega24consulting
```

### Étape 2 : Ouvrir le Projet

1. Ouvrir **Visual Studio Code**
2. `Fichier` > `Ouvrir le dossier...`
3. Sélectionner le dossier `omega24consulting`

### Étape 3 : Installer les Dépendances

1. Ouvrir le **Terminal** dans VS Code :
   - Menu : `Terminal` > `Nouveau Terminal`
   - Ou raccourci : `Ctrl + ù` (Windows) / `Cmd + T` (Mac)

2. Exécuter la commande :
```bash
npm install
```

⏳ **Temps estimé :** 2-5 minutes (selon connexion Internet)

✅ **Vérification :** Un dossier `node_modules` doit être créé.

### Étape 4 : Configuration des Variables d'Environnement

1. Créer un fichier `.env.local` à la racine du projet :
```bash
# Windows (PowerShell)
New-Item .env.local

# Mac/Linux
touch .env.local
```

2. Ouvrir le fichier `.env.local` et ajouter :
```env
# Supabase Configuration (déjà configuré dans le projet)
VITE_SUPABASE_URL=https://vcblcaufhcgcggnzifln.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYmxjYXVmaGNnY2dnbnppZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2NDE3ODEsImV4cCI6MjA0ODIxNzc4MX0.W-C9vCfXFbFZAOYRPCK8MQnxZPMdyIDf9tJVZqwL-hE

# Environment
NODE_ENV=development
```

⚠️ **Note :** Les valeurs Supabase sont déjà codées dans `/utils/supabase/info.tsx`, donc ce fichier `.env.local` est optionnel pour le développement local.

### Étape 5 : Lancer le Serveur de Développement

```bash
npm run dev
```

✅ **Résultat attendu :**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Étape 6 : Ouvrir le Site

1. Ouvrir votre navigateur (Chrome, Firefox, Safari, Edge)
2. Aller sur : http://localhost:5173/
3. Le site OMEGA24 CONSULTING doit s'afficher ! 🎉

---

## 🔗 Configuration Supabase

### Vérification de la Configuration

✅ Votre projet Supabase est déjà configuré :
- **Project ID :** vcblcaufhcgcggnzifln
- **URL :** https://vcblcaufhcgcggnzifln.supabase.co
- **Anon Key :** Configurée dans le code

### Accès au Dashboard Supabase

1. **Se connecter :**
   - URL : https://supabase.com/dashboard/project/vcblcaufhcgcggnzifln
   - Utiliser vos identifiants Supabase

2. **Vérifier la Base de Données :**
   - Aller dans `Database` > `Tables`
   - Vérifier que la table `kv_store_27d76fd3` existe
   - Structure :
     ```sql
     CREATE TABLE kv_store_27d76fd3 (
       key TEXT NOT NULL PRIMARY KEY,
       value JSONB NOT NULL
     );
     ```

3. **Vérifier les Edge Functions :**
   - Aller dans `Edge Functions`
   - Vérifier que `make-server-27d76fd3` est déployée
   - Statut doit être : ✅ Active

### Tester l'API Backend

1. Ouvrir un navigateur ou Postman
2. Tester l'endpoint de santé :
```
GET https://vcblcaufhcgcggnzifln.supabase.co/functions/v1/make-server-27d76fd3/health
```

✅ **Réponse attendue :**
```json
{
  "status": "ok",
  "message": "Server is running"
}
```

---

## 📧 Configuration Resend (Emails)

### ⚠️ ÉTAPE OBLIGATOIRE POUR LES EMAILS

Sans cette configuration, le formulaire de contact **ne fonctionnera pas**.

### Étape 1 : Créer un Compte Resend

1. Aller sur : https://resend.com/signup
2. S'inscrire avec un email professionnel
3. Vérifier l'email de confirmation
4. Se connecter au dashboard

### Étape 2 : Obtenir la Clé API

1. Dans le dashboard Resend :
   - Aller dans `API Keys` (menu de gauche)
   - Cliquer sur `Create API Key`
   
2. **Configurer la clé :**
   - **Name :** `OMEGA24 Production`
   - **Permission :** `Full Access` (ou `Sending Access`)
   - Cliquer `Create`

3. **Copier la clé :**
   - Format : `re_xxxxxxxxxxxxxxxxxxxxxxxxxx`
   - ⚠️ **IMPORTANT :** Copier immédiatement, elle ne sera plus visible !
   - Sauvegarder dans un endroit sûr (gestionnaire de mots de passe)

### Étape 3 : Ajouter la Clé dans Supabase

1. **Aller sur Supabase Dashboard :**
   - URL : https://supabase.com/dashboard/project/vcblcaufhcgcggnzifln
   - Menu : `Settings` (⚙️ en bas à gauche)

2. **Aller dans `Edge Functions` :**
   - Menu : `Edge Functions` > `Settings` ou directement `Settings` > `Edge Functions`

3. **Ajouter un Secret :**
   - Cliquer sur `Add a new secret` ou `Manage secrets`
   - **Name :** `RESEND_API_KEY`
   - **Value :** Coller votre clé API Resend (`re_xxx...`)
   - Cliquer `Save`

4. **Redémarrer l'Edge Function :**
   - Aller dans `Edge Functions` > `make-server-27d76fd3`
   - Cliquer sur `Redeploy` ou attendre le redémarrage automatique

### Étape 4 : Tester l'Envoi d'Email

#### Via le Site Web
1. Ouvrir http://localhost:5173/ (ou version déployée)
2. Défiler jusqu'à la section `Contact`
3. Remplir le formulaire :
   - Nom : Test
   - Email : votre-email@example.com
   - Sujet : Test d'envoi
   - Message : Ceci est un test
4. Cliquer `Envoyer le message`
5. ✅ Notification de succès doit apparaître
6. Vérifier la réception dans info@omega24consulting.com

#### Via l'API Directement
```bash
# Utiliser curl (Terminal Mac/Linux) ou Postman
curl -X POST https://vcblcaufhcgcggnzifln.supabase.co/functions/v1/make-server-27d76fd3/contact \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYmxjYXVmaGNnY2dnbnppZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2NDE3ODEsImV4cCI6MjA0ODIxNzc4MX0.W-C9vCfXFbFZAOYRPCK8MQnxZPMdyIDf9tJVZqwL-hE" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test API",
    "message": "Message de test"
  }'
```

✅ **Réponse attendue :**
```json
{
  "success": true
}
```

### Configuration Avancée (Optionnel)

#### Domaine Email Personnalisé
1. Dans Resend Dashboard :
   - Aller dans `Domains`
   - Cliquer `Add Domain`
   - Entrer votre domaine : `omega24consulting.com`
   - Suivre les instructions pour configurer les enregistrements DNS

2. Modifier `/supabase/functions/server/email.tsx` :
```typescript
// Ligne 91 : Remplacer
from: 'OMEGA24 CONSULTING <onboarding@resend.dev>',
// Par :
from: 'OMEGA24 CONSULTING <noreply@omega24consulting.com>',
```

3. Redéployer l'Edge Function

---

## 🚀 Déploiement en Production

### Option 1 : Déploiement Automatique (Supabase + Vercel)

#### 1. Préparer le Projet pour le Build

```bash
npm run build
```

✅ Un dossier `dist` doit être créé avec les fichiers compilés.

#### 2. Déployer sur Vercel (Recommandé)

**A. Créer un compte Vercel :**
- URL : https://vercel.com/signup
- S'inscrire avec GitHub (recommandé)

**B. Installer Vercel CLI :**
```bash
npm install -g vercel
```

**C. Se connecter :**
```bash
vercel login
```

**D. Déployer :**
```bash
vercel --prod
```

Suivre les instructions :
- Project name : `omega24consulting`
- Framework : React
- Build Command : `npm run build`
- Output Directory : `dist`

✅ **URL de production :** https://omega24consulting.vercel.app (ou domaine personnalisé)

#### 3. Configurer les Variables d'Environnement sur Vercel

1. Aller sur Vercel Dashboard
2. Sélectionner le projet `omega24consulting`
3. `Settings` > `Environment Variables`
4. Ajouter :
```
VITE_SUPABASE_URL = https://vcblcaufhcgcggnzifln.supabase.co
VITE_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```
5. `Save` puis `Redeploy`

### Option 2 : Déploiement sur Netlify

```bash
# Installer Netlify CLI
npm install -g netlify-cli

# Se connecter
netlify login

# Déployer
netlify deploy --prod --dir=dist
```

### Option 3 : Hébergement Classique (cPanel, FTP)

1. Compiler le projet :
```bash
npm run build
```

2. Uploader le contenu du dossier `dist` vers votre serveur web
   - Via FTP (FileZilla)
   - Via cPanel File Manager

3. Configurer le serveur web :
   - Pointer le domaine vers le dossier uploadé
   - Configurer les redirections (SPA mode)

---

## 🔐 Sécurité pour la Production

### ⚠️ CRITIQUES - À FAIRE AVANT MISE EN LIGNE

### 1. Sécuriser les Clés API

#### A. Masquer les Clés Sensibles
Actuellement, les clés sont visibles dans le code frontend (`/utils/supabase/info.tsx`).

**Solution :**
1. Déplacer les clés dans des variables d'environnement :

**Créer `.env.production` :**
```env
VITE_SUPABASE_URL=https://vcblcaufhcgcggnzifln.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYmxjYXVmaGNnY2dnbnppZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2NDE3ODEsImV4cCI6MjA0ODIxNzc4MX0.W-C9vCfXFbFZAOYRPCK8MQnxZPMdyIDf9tJVZqwL-hE
```

2. Modifier `/utils/supabase/info.tsx` :
```typescript
export const projectId = import.meta.env.VITE_SUPABASE_URL?.split('//')[1]?.split('.')[0] || 'vcblcaufhcgcggnzifln';
export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'fallback-key';
```

3. Ajouter `.env.production` dans `.gitignore` :
```gitignore
.env.local
.env.production
.env*.local
```

#### B. Configurer Supabase RLS (Row Level Security)

1. **Activer RLS sur la table `kv_store_27d76fd3` :**
```sql
-- Dans Supabase SQL Editor
ALTER TABLE kv_store_27d76fd3 ENABLE ROW LEVEL SECURITY;

-- Politique : Lecture publique pour flyers et testimonials
CREATE POLICY "Public read access for flyers"
ON kv_store_27d76fd3 FOR SELECT
USING (key LIKE 'flyer:%' OR key LIKE 'testimonial:%');

-- Politique : Écriture réservée aux admins authentifiés
CREATE POLICY "Authenticated write access"
ON kv_store_27d76fd3 FOR ALL
USING (auth.uid() IS NOT NULL);
```

2. **Tester les politiques :**
   - Accès public : ✅ Lecture des flyers
   - Accès admin : ✅ Création/Modification/Suppression

### 2. Limiter les Requêtes (Rate Limiting)

#### A. Configurer Supabase Rate Limiting
1. Dashboard Supabase > `Settings` > `API`
2. Configurer les limites :
   - **Anonymous requests :** 100 req/min
   - **Authenticated requests :** 200 req/min

#### B. Ajouter Rate Limiting dans l'Edge Function
Modifier `/supabase/functions/server/index.tsx` :

```typescript
import { Hono } from 'npm:hono';
import { rateLimiter } from 'npm:hono/rate-limiter';

const app = new Hono();

// Rate limiter : 10 requêtes par minute
app.use('*', rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 10, // 10 requêtes
  standardHeaders: 'draft-6',
  keyGenerator: (c) => c.req.header('x-forwarded-for') || 'anonymous',
}));

// ... reste du code
```

### 3. Validation des Données Stricte

#### A. Backend - Ajouter Zod pour la Validation
```typescript
// Installer dans Edge Function
import { z } from 'npm:zod';

// Schema de validation pour le contact
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(3).max(200),
  message: z.string().min(10).max(2000),
});

// Dans l'endpoint /contact
app.post('/make-server-27d76fd3/contact', async (c) => {
  const body = await c.req.json();
  
  // Validation
  const validation = contactSchema.safeParse(body);
  if (!validation.success) {
    return c.json({ error: 'Données invalides', details: validation.error }, 400);
  }
  
  // ... suite du code
});
```

### 4. Protection CSRF

#### A. Ajouter un Token CSRF
1. Générer un token côté backend
2. Vérifier le token à chaque requête POST/PUT/DELETE

**Exemple simplifié :**
```typescript
// Dans AuthContext.tsx
const [csrfToken, setCsrfToken] = useState<string>('');

useEffect(() => {
  // Récupérer le token CSRF depuis le backend
  fetch('/api/csrf-token').then(res => res.json()).then(data => {
    setCsrfToken(data.token);
  });
}, []);

// Inclure dans les headers
headers: {
  'X-CSRF-Token': csrfToken,
}
```

### 5. HTTPS et SSL

✅ **Automatique avec Vercel/Netlify**

Pour hébergement custom :
1. Obtenir un certificat SSL (Let's Encrypt gratuit)
2. Configurer HTTPS sur le serveur
3. Rediriger HTTP vers HTTPS

### 6. Monitoring et Logs

#### A. Configurer Supabase Logs
1. Dashboard > `Logs` > `Edge Functions`
2. Activer les logs détaillés
3. Surveiller les erreurs

#### B. Ajouter Sentry (Monitoring d'Erreurs)
```bash
npm install @sentry/react
```

```typescript
// Dans App.tsx
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: 'https://YOUR_SENTRY_DSN',
  environment: 'production',
  tracesSampleRate: 1.0,
});
```

### 7. Backup et Sauvegarde

#### A. Activer les Backups Automatiques Supabase
1. Dashboard > `Settings` > `Database`
2. `Point in Time Recovery` (PITR) : Activer
3. Rétention : 7 jours minimum

#### B. Export Manuelle Régulière
```bash
# Export de la base de données
supabase db dump -f backup.sql

# Planifier un cron job (Linux/Mac)
0 2 * * * supabase db dump -f ~/backups/omega24_$(date +\%Y\%m\%d).sql
```

### 8. Checklist de Sécurité Finale

Avant la mise en production, vérifier :

- [ ] ✅ Clés API dans variables d'environnement (pas de hardcode)
- [ ] ✅ RLS activé sur toutes les tables sensibles
- [ ] ✅ Rate limiting configuré
- [ ] ✅ Validation des données côté serveur (Zod ou autre)
- [ ] ✅ HTTPS activé avec certificat SSL valide
- [ ] ✅ CORS configuré correctement (domaines autorisés uniquement)
- [ ] ✅ Logs et monitoring activés (Sentry + Supabase Logs)
- [ ] ✅ Backups automatiques configurés
- [ ] ✅ Tests de sécurité effectués (OWASP Top 10)
- [ ] ✅ Documentation admin créée
- [ ] ✅ Politique de confidentialité et CGU ajoutées au site
- [ ] ✅ Formulaires protégés contre le spam (Recaptcha optionnel)
- [ ] ✅ Email de confirmation configuré (domaine personnalisé)
- [ ] ✅ Comptes admin avec mots de passe forts
- [ ] ✅ Audit de sécurité effectué

---

## 👤 Gestion des Comptes Admin

### Créer le Premier Compte Admin

#### Méthode 1 : Via l'API Signup

**Utiliser Postman ou curl :**
```bash
curl -X POST https://vcblcaufhcgcggnzifln.supabase.co/functions/v1/make-server-27d76fd3/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@omega24consulting.com",
    "password": "MotDePasseTrèsSécurisé123!@#",
    "name": "Administrateur Principal"
  }'
```

✅ **Réponse attendue :**
```json
{
  "success": true,
  "user": {
    "id": "uuid-xxx",
    "email": "admin@omega24consulting.com"
  }
}
```

#### Méthode 2 : Via Supabase Dashboard

1. Aller sur https://supabase.com/dashboard/project/vcblcaufhcgcggnzifln
2. Menu `Authentication` > `Users`
3. Cliquer `Add User` > `Create New User`
4. Remplir :
   - Email : `admin@omega24consulting.com`
   - Password : Générer un mot de passe fort
   - Auto Confirm User : ✅ Oui
5. Cliquer `Create User`

### Se Connecter à l'Espace Admin

1. Ouvrir le site : http://localhost:5173/ (ou URL production)
2. Cliquer sur le bouton `Espace Admin` (en haut à droite)
3. Entrer :
   - Email : `admin@omega24consulting.com`
   - Mot de passe : Celui défini précédemment
4. Cliquer `Se connecter`
5. ✅ L'icône admin apparaît en haut à droite

### Gérer les Affiches (Flyers)

1. Défiler jusqu'à la section `Services`
2. Cliquer `Ajouter une affiche` ➕
3. Remplir le formulaire :
   - Titre : Nom du service
   - Description : Description courte
   - URL Image : Lien vers une image
   - Détails : Liste de points (ajouter avec +)
4. Cliquer `Sauvegarder`
5. ✅ L'affiche apparaît instantanément

**Modifier :**
- Cliquer sur `Modifier` ✏️ sur une affiche
- Faire les changements
- Sauvegarder

**Supprimer :**
- Cliquer sur `Supprimer` 🗑️
- Confirmer

### Gérer les Témoignages

1. Défiler jusqu'à la section `Témoignages`
2. Cliquer `Ajouter un Témoignage` ➕
3. Remplir :
   - Nom complet : Prénom + Nom
   - Rôle : Ex. "Étudiant en médecine"
   - Pays : "Canada", "France", etc.
   - Note : 1-5 étoiles
   - Photo : URL (optionnel)
   - Témoignage : Le message complet
4. Cliquer `Ajouter`
5. ✅ Le témoignage s'affiche immédiatement

### Se Déconnecter

1. Cliquer sur l'icône avatar (en haut à droite)
2. Sélectionner `Déconnexion`
3. ✅ Retour en mode visiteur

---

## 🛠️ Maintenance et Monitoring

### Tâches Régulières

#### Quotidien
- [ ] Vérifier les emails reçus (info@omega24consulting.com)
- [ ] Consulter les logs Supabase (erreurs)
- [ ] Vérifier la disponibilité du site (uptime)

#### Hebdomadaire
- [ ] Consulter les statistiques de contact
- [ ] Modérer les témoignages (si ajout public futur)
- [ ] Vérifier les performances (temps de chargement)

#### Mensuel
- [ ] Sauvegarder la base de données manuellement
- [ ] Mettre à jour les dépendances npm (`npm update`)
- [ ] Vérifier les logs d'erreurs Supabase
- [ ] Renouveler les certificats SSL (automatique normalement)

### Monitoring avec Supabase

1. **Dashboard Supabase :**
   - URL : https://supabase.com/dashboard/project/vcblcaufhcgcggnzifln
   - Onglet `Reports` : Voir les statistiques d'utilisation

2. **Edge Functions Logs :**
   - `Edge Functions` > `make-server-27d76fd3` > `Logs`
   - Filtrer par erreur : `level:error`

3. **Database Usage :**
   - `Settings` > `Usage`
   - Surveiller :
     - Nombre de requêtes
     - Stockage utilisé
     - Bandwidth

### Alertes Recommandées

Configurer des alertes pour :
- ✅ Downtime (site inaccessible)
- ✅ Erreurs 500 (serveur)
- ✅ Usage excessif de l'API
- ✅ Échec d'envoi d'email

**Services recommandés :**
- UptimeRobot (gratuit) : https://uptimerobot.com/
- Sentry (monitoring erreurs) : https://sentry.io/
- Supabase Notifications intégrées

---

## 🔍 Résolution de Problèmes

### Problème : Le site ne démarre pas localement

**Symptôme :**
```
npm run dev
Error: Cannot find module...
```

**Solution :**
```bash
# Supprimer node_modules et package-lock.json
rm -rf node_modules package-lock.json

# Réinstaller
npm install

# Relancer
npm run dev
```

---

### Problème : Les emails ne s'envoient pas

**Symptôme :**
- Message d'erreur "Email service not configured"
- Ou "Failed to send email"

**Vérification :**
1. La clé API Resend est-elle configurée dans Supabase ?
   - Dashboard > Edge Functions > Secrets > `RESEND_API_KEY`

2. La clé est-elle valide ?
   - Tester sur https://resend.com/api-keys

3. L'Edge Function a-t-elle été redéployée après ajout du secret ?
   - Redéployer : Edge Functions > make-server-27d76fd3 > Redeploy

**Test manuel :**
```bash
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer re_YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "onboarding@resend.dev",
    "to": ["info@omega24consulting.com"],
    "subject": "Test",
    "html": "<p>Test</p>"
  }'
```

---

### Problème : Impossible de se connecter en admin

**Symptôme :**
- "Email ou mot de passe incorrect"
- Ou "Session invalide"

**Solution :**

1. **Vérifier que le compte existe :**
   - Dashboard Supabase > Authentication > Users
   - L'email doit être listé

2. **Réinitialiser le mot de passe :**
   - Dans la liste Users, cliquer sur l'utilisateur
   - `Send password reset email`
   - Ou définir un nouveau mot de passe manuellement

3. **Vérifier que l'email est confirmé :**
   - Colonne `email_confirmed_at` ne doit pas être null
   - Si null : Cliquer sur l'utilisateur > `Confirm email`

---

### Problème : Les affiches ne se sauvegardent pas

**Symptôme :**
- Erreur "Authentification requise"
- Ou "Session invalide"

**Solution :**

1. **Se reconnecter :**
   - Déconnexion puis reconnexion

2. **Vérifier le token :**
   - Ouvrir la console du navigateur (F12)
   - Onglet `Console`
   - Taper : `localStorage.getItem('supabase.auth.token')`
   - Doit retourner un objet JSON avec `access_token`

3. **Vérifier les politiques RLS :**
   ```sql
   -- Dans Supabase SQL Editor
   SELECT * FROM pg_policies WHERE tablename = 'kv_store_27d76fd3';
   ```

---

### Problème : Erreur 404 sur les routes après déploiement

**Symptôme :**
- La page d'accueil fonctionne
- Le refresh sur une section donne erreur 404

**Solution (Vercel) :**
1. Créer `vercel.json` à la racine :
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

2. Redéployer

**Solution (Netlify) :**
1. Créer `netlify.toml` :
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Problème : Les images ne s'affichent pas

**Symptôme :**
- Icône d'image cassée
- Ou placeholder générique

**Vérification :**

1. **URL d'image valide ?**
   - Ouvrir l'URL dans un navigateur
   - Doit afficher l'image

2. **CORS autorisé ?**
   - Certains services bloquent les hotlinks
   - Solution : Héberger les images sur Supabase Storage

3. **Utiliser Supabase Storage :**
```typescript
// Upload d'image
const { data, error } = await supabase.storage
  .from('images')
  .upload('flyers/image.jpg', file);

// URL publique
const { data: { publicUrl } } = supabase.storage
  .from('images')
  .getPublicUrl('flyers/image.jpg');
```

---

### Problème : Performance lente

**Symptôme :**
- Chargement lent > 5 secondes
- Animations saccadées

**Optimisations :**

1. **Optimiser les images :**
   - Compresser avec TinyPNG : https://tinypng.com/
   - Utiliser WebP au lieu de PNG/JPG
   - Lazy loading activé (déjà dans ImageWithFallback)

2. **Activer le cache Supabase :**
```typescript
// Dans les requêtes fetch
headers: {
  'Cache-Control': 'public, max-age=3600', // 1 heure
}
```

3. **Minifier les assets :**
```bash
npm run build
# Déjà optimisé par Vite
```

---

### Besoin d'Aide Supplémentaire ?

#### Documentation Officielle
- **Supabase :** https://supabase.com/docs
- **React :** https://react.dev/
- **Tailwind CSS :** https://tailwindcss.com/docs
- **Resend :** https://resend.com/docs

#### Support
- **Email :** info@omega24consulting.com
- **WhatsApp :** +229 01 41 31 22 22

---

## 📊 Commandes Utiles

### Développement
```bash
npm run dev              # Lancer le serveur de dev
npm run build            # Compiler pour production
npm run preview          # Prévisualiser le build
```

### Supabase CLI (Avancé)
```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref vcblcaufhcgcggnzifln

# Déployer les Edge Functions
supabase functions deploy make-server-27d76fd3

# Voir les logs en direct
supabase functions logs make-server-27d76fd3 --follow

# Export de la base de données
supabase db dump -f backup.sql

# Reset de la base (DANGER)
supabase db reset
```

### Git (Gestion de Version)
```bash
git init                           # Initialiser Git
git add .                          # Ajouter tous les fichiers
git commit -m "Initial commit"     # Créer un commit
git branch -M main                 # Renommer la branche
git remote add origin URL          # Ajouter un remote
git push -u origin main            # Pousser vers GitHub
```

---

## 🎉 Conclusion

Vous avez maintenant toutes les informations pour :
- ✅ Installer le projet sur votre PC
- ✅ Configurer Supabase et Resend
- ✅ Déployer en production
- ✅ Sécuriser l'application
- ✅ Gérer le contenu admin
- ✅ Maintenir et monitorer le site

Le site OMEGA24 CONSULTING est maintenant prêt pour la production ! 🚀

---

**Document rédigé le :** 26 Novembre 2025  
**Version :** 1.0  
**Contact Support :** info@omega24consulting.com
