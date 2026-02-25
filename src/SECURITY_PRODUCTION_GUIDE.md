# 🔐 GUIDE DE SÉCURITÉ ET PRODUCTION
## Site Web Oméga24 Consulting

---

**Version** : 1.0  
**Date** : Décembre 2024  
**Classification** : Confidentiel  
**Niveau de Sécurité** : Élevé

---

## 📑 TABLE DES MATIÈRES

1. [Vue d'Ensemble de la Sécurité](#1-vue-densemble-de-la-sécurité)
2. [Architecture de Sécurité](#2-architecture-de-sécurité)
3. [Gestion des Accès et Authentification](#3-gestion-des-accès-et-authentification)
4. [Sécurité des Données](#4-sécurité-des-données)
5. [Sécurité Réseau et Transport](#5-sécurité-réseau-et-transport)
6. [Gestion des Secrets](#6-gestion-des-secrets)
7. [Sécurité du Code](#7-sécurité-du-code)
8. [Monitoring et Détection d'Incidents](#8-monitoring-et-détection-dincidents)
9. [Plan de Réponse aux Incidents](#9-plan-de-réponse-aux-incidents)
10. [Conformité et Réglementations](#10-conformité-et-réglementations)
11. [Checklist de Déploiement en Production](#11-checklist-de-déploiement-en-production)
12. [Procédures d'Urgence](#12-procédures-durgence)

---

## 1. VUE D'ENSEMBLE DE LA SÉCURITÉ

### 1.1 Menaces Identifiées

| Menace | Probabilité | Impact | Priorité | Mitigation |
|--------|-------------|--------|----------|------------|
| **Injection SQL** | 🟢 Faible | 🔴 Critique | ✅ Haute | ORM + Prepared statements |
| **XSS (Cross-Site Scripting)** | 🟡 Moyenne | 🟠 Élevé | ✅ Haute | Sanitization React |
| **CSRF (Cross-Site Request Forgery)** | 🟢 Faible | 🟠 Élevé | ✅ Moyenne | JWT + SameSite cookies |
| **Brute Force Login** | 🟡 Moyenne | 🟠 Élevé | ✅ Haute | Rate limiting Supabase |
| **DDoS** | 🟡 Moyenne | 🔴 Critique | ✅ Haute | Vercel CDN + Cloudflare |
| **Fuites de données** | 🟢 Faible | 🔴 Critique | ✅ Haute | Chiffrement + RLS |
| **Vol de credentials** | 🟡 Moyenne | 🔴 Critique | ✅ Haute | Hashing bcrypt + 2FA |
| **Injection de code** | 🟢 Faible | 🔴 Critique | ✅ Haute | CSP + Input validation |

### 1.2 Principes de Sécurité Appliqués

#### Defense in Depth (Défense en Profondeur)
```
┌────────────────────────────────────────┐
│  1. Firewall & DDoS Protection (CDN)  │
├────────────────────────────────────────┤
│  2. HTTPS / TLS 1.3 Encryption         │
├────────────────────────────────────────┤
│  3. Authentication (JWT)               │
├────────────────────────────────────────┤
│  4. Authorization (RLS)                │
├────────────────────────────────────────┤
│  5. Input Validation                   │
├────────────────────────────────────────┤
│  6. Output Encoding                    │
├────────────────────────────────────────┤
│  7. Database Encryption                │
├────────────────────────────────────────┤
│  8. Audit Logging                      │
└────────────────────────────────────────┘
```

#### Least Privilege (Moindre Privilège)
- ✅ Utilisateurs publics : Lecture seule
- ✅ Utilisateurs authentifiés : Lecture + Écriture de leurs données
- ✅ Service Role : Accès complet (backend uniquement)
- ✅ Admin : Gestion complète via interface sécurisée

#### Zero Trust
- ✅ Toujours vérifier l'identité (JWT à chaque requête)
- ✅ Toujours valider les permissions (RLS)
- ✅ Toujours logger les actions sensibles

---

## 2. ARCHITECTURE DE SÉCURITÉ

### 2.1 Zones de Sécurité

```
┌─────────────────────────────────────────────────────────┐
│                    INTERNET (DMZ)                        │
│  ┌────────────────────────────────────────────────┐    │
│  │        Vercel CDN + Edge Network               │    │
│  │  (DDoS Protection, SSL Termination)            │    │
│  └──────────────────┬─────────────────────────────┘    │
│                     │ HTTPS Only                        │
└─────────────────────┼─────────────────────────────────┘
                      │
┌─────────────────────▼─────────────────────────────────┐
│             FRONTEND ZONE (Public)                     │
│  ┌────────────────────────────────────────────────┐   │
│  │  React Application (Static Assets)             │   │
│  │  - No sensitive data in code                   │   │
│  │  - ANON_KEY only (read access)                │   │
│  └────────────────────────────────────────────────┘   │
└─────────────────────┬─────────────────────────────────┘
                      │ REST API (JWT Token)
┌─────────────────────▼─────────────────────────────────┐
│          BACKEND ZONE (Authenticated)                  │
│  ┌────────────────────────────────────────────────┐   │
│  │  Supabase Edge Functions (Hono Server)         │   │
│  │  - Token Verification                          │   │
│  │  - Business Logic                              │   │
│  │  - SERVICE_ROLE_KEY only                       │   │
│  └────────────────┬───────────────────────────────┘   │
└───────────────────┼───────────────────────────────────┘
                    │ PostgreSQL Protocol (Encrypted)
┌───────────────────▼───────────────────────────────────┐
│            DATABASE ZONE (Private)                     │
│  ┌────────────────────────────────────────────────┐   │
│  │  PostgreSQL + RLS                              │   │
│  │  - Encryption at rest                          │   │
│  │  - Row Level Security                          │   │
│  │  - Audit logs                                  │   │
│  └────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

### 2.2 Flux de Sécurité

#### Requête Publique (Lecture)
```
User → HTTPS → Vercel CDN → React App → fetch() 
     ↓
     Supabase Edge Function → Verify ANON_KEY → KV Store → PostgreSQL
     ↓
     Return data (public only, via RLS)
```

#### Requête Admin (Écriture)
```
Admin → Login → Supabase Auth → JWT Token (access_token)
      ↓
      Action (Create/Update/Delete)
      ↓
      fetch() + Authorization: Bearer {token}
      ↓
      Edge Function → Verify JWT → Check user.id
      ↓
      IF valid: Execute query (RLS allows)
      ELSE: Return 401 Unauthorized
```

---

## 3. GESTION DES ACCÈS ET AUTHENTIFICATION

### 3.1 Authentification

#### Mécanisme
- **Fournisseur** : Supabase Auth
- **Méthode** : Email + Password
- **Tokens** : JWT (JSON Web Tokens)
- **Algorithme** : HS256 (HMAC SHA-256)
- **Durée de vie** : 1 heure (refresh possible)

#### Flux d'Authentification

```typescript
// 1. Inscription (backend)
POST /make-server-27d76fd3/signup
{
  email: "admin@omega24consulting.com",
  password: "StrongP@ssw0rd123!",  // Min 8 chars, 1 uppercase, 1 number, 1 special
  name: "Admin OMEGA24"
}

// Réponse
{
  success: true,
  user: {
    id: "uuid-xxxxx",
    email: "admin@omega24consulting.com"
  }
}

// 2. Connexion (frontend via Supabase Client)
const { data: { session }, error } = await supabase.auth.signInWithPassword({
  email: 'admin@omega24consulting.com',
  password: 'StrongP@ssw0rd123!'
});

// Session contient:
{
  access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // JWT
  refresh_token: "xxxxx",
  expires_in: 3600,
  user: { id, email, user_metadata }
}

// 3. Utilisation du token
fetch(url, {
  headers: {
    'Authorization': `Bearer ${session.access_token}`
  }
});
```

### 3.2 Politique des Mots de Passe

#### Exigences Minimales
- ✅ **Longueur** : 8 caractères minimum (12 recommandé)
- ✅ **Complexité** : 
  - Au moins 1 majuscule
  - Au moins 1 minuscule
  - Au moins 1 chiffre
  - Au moins 1 caractère spécial (@, !, #, etc.)
- ✅ **Blacklist** : Mots de passe courants interdits
- ✅ **Historique** : Pas de réutilisation des 5 derniers

#### Stockage
- ✅ **Hashing** : bcrypt (coût factor = 10)
- ✅ **Salt** : Unique par utilisateur
- ✅ **Jamais en clair** : Impossible de récupérer le mot de passe original

#### Rotation
- 🟡 **Recommandation** : Changer tous les 90 jours
- 🔴 **Obligatoire** : Immédiatement si compromission suspectée

### 3.3 Gestion des Sessions

#### Configuration
```typescript
// Durée de vie du token
const SESSION_LIFETIME = 3600; // 1 heure

// Auto-refresh avant expiration
const REFRESH_THRESHOLD = 300; // 5 minutes avant expiration

// Configuration Supabase
{
  autoRefreshToken: true,  // Refresh automatique
  persistSession: true,    // Persister dans localStorage
  detectSessionInUrl: true // Détection après email verification
}
```

#### Invalidation
```typescript
// Déconnexion (invalide le token côté serveur)
await supabase.auth.signOut();

// Effacement du localStorage
localStorage.removeItem('supabase.auth.token');

// Backend vérifie toujours la validité du token
const { data: { user }, error } = await supabase.auth.getUser(token);
if (error || !user) {
  return new Response('Unauthorized', { status: 401 });
}
```

### 3.4 Protection Brute Force

#### Rate Limiting (Supabase)
```
- Max 5 tentatives de connexion par IP / 15 minutes
- Blocage temporaire : 15 minutes
- Blocage permanent : Après 20 tentatives en 1 heure
```

#### Monitoring
```typescript
// Log des tentatives échouées
console.log('Failed login attempt:', {
  email: email,
  ip: request.headers.get('x-forwarded-for'),
  timestamp: new Date().toISOString(),
  reason: error.message
});

// Alerte si > 10 échecs en 5 minutes
```

#### Captcha (Recommandation Future)
```typescript
// Ajouter Google reCAPTCHA v3 après 3 échecs
// https://www.google.com/recaptcha/
```

---

## 4. SÉCURITÉ DES DONNÉES

### 4.1 Classification des Données

| Type | Sensibilité | Exemples | Chiffrement | Durée Conservation |
|------|-------------|----------|-------------|-------------------|
| **Publiques** | 🟢 Basse | Services, témoignages publics | Transit | Indéfinie |
| **Confidentielles** | 🟡 Moyenne | Messages de contact, emails | Transit + Rest | 3 ans |
| **Sensibles** | 🟠 Élevée | Mots de passe hashés | Transit + Rest + Hash | 10 ans |
| **Critiques** | 🔴 Critique | Clés API, Service Role Key | Transit + Rest + Vault | Indéfinie |

### 4.2 Chiffrement

#### En Transit (TLS/SSL)
```
✅ TLS 1.3 (préféré)
✅ TLS 1.2 (minimum accepté)
❌ TLS 1.1 et inférieur (désactivé)

Cipher Suites (ordre de préférence):
1. TLS_AES_256_GCM_SHA384
2. TLS_CHACHA20_POLY1305_SHA256
3. TLS_AES_128_GCM_SHA256
4. TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384
```

#### Au Repos (Database)
```
✅ Encryption at rest : AES-256
✅ Tablespace encryption : Activé (Supabase)
✅ Backup encryption : Activé automatiquement
```

#### Dans le Code
```typescript
// ❌ JAMAIS FAIRE ÇA
const apiKey = "sk_live_xxxxxxxxxxxxx"; // En dur dans le code

// ✅ TOUJOURS FAIRE ÇA
const apiKey = process.env.RESEND_API_KEY; // Variable d'environnement

// ❌ JAMAIS LOGGER DES DONNÉES SENSIBLES
console.log('User password:', password);

// ✅ TOUJOURS MASQUER
console.log('User password: ***REDACTED***');
```

### 4.3 Row Level Security (RLS)

#### Politiques Implémentées

```sql
-- 1. Lecture publique des données publiques
CREATE POLICY "public_read_access" 
ON kv_store_27d76fd3 
FOR SELECT 
TO public
USING (true);  -- Tous peuvent lire (filtré par application)

-- 2. Écriture réservée aux utilisateurs authentifiés
CREATE POLICY "authenticated_write_access" 
ON kv_store_27d76fd3 
FOR INSERT, UPDATE, DELETE 
TO authenticated
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

-- 3. Service role a tous les droits (backend seulement)
CREATE POLICY "service_role_full_access" 
ON kv_store_27d76fd3 
FOR ALL 
TO service_role
USING (true)
WITH CHECK (true);
```

#### Test de RLS

```sql
-- Se connecter en tant qu'utilisateur public
SET ROLE anon;

-- Essayer d'insérer (doit échouer)
INSERT INTO kv_store_27d76fd3 (key, value) 
VALUES ('test', '{}');
-- Erreur: new row violates row-level security policy

-- Essayer de lire (doit réussir)
SELECT * FROM kv_store_27d76fd3 LIMIT 1;
-- OK

-- Se connecter en tant que service_role
SET ROLE service_role;

-- Maintenant l'insertion fonctionne
INSERT INTO kv_store_27d76fd3 (key, value) 
VALUES ('test', '{}');
-- OK
```

### 4.4 Sauvegarde et Récupération

#### Stratégie de Backup

```
┌─────────────────────────────────────────┐
│  BACKUP STRATEGY (3-2-1 Rule)           │
├─────────────────────────────────────────┤
│  3 copies des données :                 │
│    1. Production Database (Supabase)    │
│    2. Daily backup (Supabase)           │
│    3. Weekly manual export (local)      │
├─────────────────────────────────────────┤
│  2 types de média :                     │
│    - Cloud (Supabase S3)                │
│    - Local (fichiers SQL)               │
├─────────────────────────────────────────┤
│  1 copie off-site :                     │
│    - Google Drive / Dropbox             │
└─────────────────────────────────────────┘
```

#### Fréquence

| Type | Fréquence | Rétention | Emplacement |
|------|-----------|-----------|-------------|
| **Snapshot** | Continu (WAL) | 7 jours | Supabase |
| **Daily** | 1x / jour (3h00) | 30 jours | Supabase S3 |
| **Weekly** | Dimanche | 12 semaines | Local + Cloud |
| **Monthly** | 1er du mois | 12 mois | Cloud externe |

#### Procédure de Backup Manuel

```bash
# 1. Export complet de la base
supabase db dump -f backup_$(date +%Y%m%d).sql

# 2. Export des secrets (séparé)
supabase secrets list > secrets_backup.txt

# 3. Compression
tar -czf omega24_backup_$(date +%Y%m%d).tar.gz backup_*.sql secrets_backup.txt

# 4. Chiffrement (optionnel mais recommandé)
openssl enc -aes-256-cbc -salt -in omega24_backup_*.tar.gz -out omega24_backup_*.tar.gz.enc

# 5. Upload vers stockage sécurisé
# Google Drive, Dropbox, AWS S3, etc.
```

#### Test de Restauration (Quarterly)

```bash
# 1. Créer un projet Supabase de test
supabase projects create omega24-test

# 2. Restaurer le backup
supabase db push --db-url "postgresql://..." < backup.sql

# 3. Vérifier l'intégrité
psql "postgresql://..." -c "SELECT COUNT(*) FROM kv_store_27d76fd3;"

# 4. Test fonctionnel
curl https://test-project.supabase.co/functions/v1/make-server-27d76fd3/health
```

### 4.5 Anonymisation et Suppression

#### Données Personnelles (RGPD)

```sql
-- Anonymiser un utilisateur
UPDATE auth.users 
SET 
  email = CONCAT('deleted_', id, '@deleted.local'),
  encrypted_password = 'DELETED',
  raw_user_meta_data = '{"deleted": true}'::jsonb
WHERE id = 'user-uuid';

-- Supprimer les messages de contact après 3 ans
DELETE FROM kv_store_27d76fd3
WHERE key LIKE 'contact:%'
  AND (value->>'date')::timestamp < NOW() - INTERVAL '3 years';

-- Anonymiser les témoignages à la demande
UPDATE kv_store_27d76fd3
SET value = jsonb_set(
  value,
  '{name}',
  '"Utilisateur Anonyme"'
)
WHERE key = 'testimonial:xxxxx';
```

---

## 5. SÉCURITÉ RÉSEAU ET TRANSPORT

### 5.1 HTTPS Stricte

#### Configuration

```typescript
// Headers de sécurité (Vercel automatique)
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Strict-Transport-Security",
          "value": "max-age=31536000; includeSubDomains; preload"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Permissions-Policy",
          "value": "geolocation=(), microphone=(), camera=()"
        }
      ]
    }
  ]
}
```

#### Redirection HTTP → HTTPS

```
✅ Automatique avec Vercel
✅ Tous les liens internes en https://
✅ Mixed content bloqué
```

### 5.2 Content Security Policy (CSP)

```html
<!-- Meta tag dans index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://esm.sh;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: https: blob:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://*.supabase.co https://api.resend.com;
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
">
```

### 5.3 CORS (Cross-Origin Resource Sharing)

```typescript
// Configuration backend (Hono)
app.use('*', cors({
  origin: [
    'https://omega24consulting.com',
    'https://www.omega24consulting.com',
    'https://omega24-consulting.vercel.app',
    'http://localhost:5173'  // Dev only
  ],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400  // 24h cache
}));
```

### 5.4 Protection DDoS

#### Niveau 1 : Vercel Edge Network
```
✅ Global CDN
✅ Automatic scaling
✅ DDoS mitigation (Layer 7)
✅ Rate limiting (1000 req/min par IP)
```

#### Niveau 2 : Supabase Rate Limiting
```
✅ Auth : 5 tentatives / 15 min
✅ API : 100 req/min par token
✅ Edge Functions : 500 req/min par IP
```

#### Niveau 3 : Cloudflare (Recommandé en Plus)
```bash
# Ajouter Cloudflare devant Vercel
1. Créer un compte Cloudflare
2. Ajouter votre domaine
3. Configurer les DNS vers Vercel
4. Activer "Under Attack Mode" si DDoS détecté
```

---

## 6. GESTION DES SECRETS

### 6.1 Classification des Secrets

| Secret | Sensibilité | Emplacement | Rotation |
|--------|-------------|-------------|----------|
| `SUPABASE_URL` | 🟢 Public | Frontend + Backend | Jamais |
| `SUPABASE_ANON_KEY` | 🟢 Public | Frontend + Backend | Annuelle |
| `SUPABASE_SERVICE_ROLE_KEY` | 🔴 Critique | Backend uniquement | Trimestrielle |
| `SUPABASE_DB_URL` | 🔴 Critique | Backend uniquement | Sur demande |
| `RESEND_API_KEY` | 🟠 Élevée | Backend uniquement | Annuelle |

### 6.2 Stockage Sécurisé

#### ❌ À NE JAMAIS FAIRE

```typescript
// Hardcoder les secrets
const apiKey = "sk_live_xxxxx";

// Commiter les secrets
git add .env
git commit -m "Add config"

// Logger les secrets
console.log('API Key:', process.env.RESEND_API_KEY);

// Exposer dans les erreurs
throw new Error(`Failed with key: ${apiKey}`);
```

#### ✅ BONNES PRATIQUES

```typescript
// 1. Variables d'environnement
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  throw new Error('RESEND_API_KEY not configured');
}

// 2. .gitignore obligatoire
// .env
// .env.local
// .env.production

// 3. Masquage dans les logs
const maskedKey = apiKey.substring(0, 7) + '***';
console.log('Using API key:', maskedKey);

// 4. Erreurs génériques
if (error) {
  console.error('API call failed:', error.message); // Pas de détails sensibles
  return { error: 'Service temporarily unavailable' };
}
```

### 6.3 Rotation des Secrets

#### Procédure

```bash
# Exemple : Rotation de RESEND_API_KEY

# 1. Générer une nouvelle clé sur Resend Dashboard
# New API Key: re_NEW_xxxxxxxxxxxxx

# 2. Ajouter la nouvelle clé (garder l'ancienne)
supabase secrets set RESEND_API_KEY=re_NEW_xxxxxxxxxxxxx

# 3. Redéployer
vercel --prod

# 4. Tester que tout fonctionne
curl -X POST 'https://site.com/contact' -d '{"name":"Test",...}'

# 5. Si OK : Révoquer l'ancienne clé sur Resend Dashboard

# 6. Documenter la rotation
echo "$(date): Rotated RESEND_API_KEY" >> secrets_rotation.log
```

#### Planning de Rotation

| Secret | Fréquence | Prochaine Date |
|--------|-----------|----------------|
| RESEND_API_KEY | Annuelle | 2025-12-01 |
| SUPABASE_ANON_KEY | Annuelle | 2025-12-01 |
| SERVICE_ROLE_KEY | Trimestrielle | 2025-03-01 |

### 6.4 Détection de Fuites

#### Outils Automatiques

```bash
# 1. git-secrets (prévention)
git secrets --scan

# 2. TruffleHog (détection)
trufflehog git https://github.com/votre-repo --only-verified

# 3. GitHub Secret Scanning (automatique sur repo public)
# Active par défaut
```

#### Surveillance Manuelle

```bash
# Chercher des patterns suspects dans le code
grep -r "sk_live" .
grep -r "api_key" .
grep -r "password.*=" .

# Vérifier l'historique Git
git log -p | grep -i "password\|secret\|api"
```

#### En Cas de Fuite Détectée

```bash
# 🚨 PROCÉDURE D'URGENCE

# 1. Révoquer IMMÉDIATEMENT le secret exposé
# - Resend Dashboard > API Keys > Revoke
# - Supabase Dashboard > Settings > API > Regenerate

# 2. Générer un nouveau secret

# 3. Mettre à jour dans tous les environnements
supabase secrets set SECRET_NAME=nouvelle_valeur

# 4. Redéployer
vercel --prod --force

# 5. Nettoyer l'historique Git (si committé)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all

git push origin --force --all

# 6. Notifier l'équipe

# 7. Analyser l'impact et monitorer les accès suspects
```

---

## 7. SÉCURITÉ DU CODE

### 7.1 Validation des Entrées

#### Frontend (React)

```typescript
// Validation des formulaires
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^\+?[0-9\s-()]+$/).optional(),
  subject: z.string().min(5).max(200),
  message: z.string().min(10).max(5000)
});

// Utilisation
try {
  const validated = contactSchema.parse(formData);
  // Envoyer validated (propre)
} catch (error) {
  // Afficher les erreurs
}
```

#### Backend (Hono)

```typescript
app.post('/contact', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validation stricte
    if (!body.name || typeof body.name !== 'string') {
      return c.json({ error: 'Invalid name' }, 400);
    }
    
    if (!body.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) {
      return c.json({ error: 'Invalid email' }, 400);
    }
    
    // Sanitization
    const cleanName = body.name.trim().substring(0, 100);
    const cleanEmail = body.email.trim().toLowerCase();
    const cleanMessage = body.message.trim().substring(0, 5000);
    
    // ... traitement avec données propres
  } catch (error) {
    return c.json({ error: 'Invalid request' }, 400);
  }
});
```

### 7.2 Protection XSS

#### Automatique avec React

```typescript
// React échappe automatiquement les variables
<div>{userInput}</div>  // Safe ! React échappe

// Mais attention avec dangerouslySetInnerHTML !
<div dangerouslySetInnerHTML={{ __html: userInput }} />  // ❌ DANGER !
```

#### Sanitization Manuelle (si nécessaire)

```typescript
import DOMPurify from 'dompurify';

// Nettoyer le HTML utilisateur
const cleanHTML = DOMPurify.sanitize(userInput, {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
  ALLOWED_ATTR: ['href']
});

<div dangerouslySetInnerHTML={{ __html: cleanHTML }} />  // ✅ Safe
```

### 7.3 Protection Injection SQL

```typescript
// ❌ VULNÉRABLE (mais pas utilisé dans notre app)
const query = `SELECT * FROM users WHERE email = '${userEmail}'`;

// ✅ SÉCURISÉ avec Supabase (requêtes préparées automatiques)
const { data, error } = await supabase
  .from('kv_store_27d76fd3')
  .select('*')
  .eq('key', userKey);  // Paramètre échappé automatiquement
```

### 7.4 Audit de Dépendances

```bash
# Vérifier les vulnérabilités
npm audit

# Résultat attendu:
# 0 vulnerabilities

# Si des vulnérabilités sont détectées :
npm audit fix

# Pour les vulnérabilités critiques non fixables :
npm audit fix --force  # ⚠️ Peut casser des choses
```

#### Outils Automatiques

```yaml
# .github/workflows/security.yml
name: Security Audit
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm audit --audit-level=high
```

### 7.5 Revue de Code

#### Checklist de Sécurité

Avant chaque merge :

- [ ] Pas de secrets hardcodés
- [ ] Validation des inputs
- [ ] Gestion des erreurs (pas de stack traces exposées)
- [ ] Pas de `console.log()` avec données sensibles
- [ ] Pas d'imports de modules inconnus
- [ ] Headers de sécurité présents
- [ ] Tests de sécurité passés

---

## 8. MONITORING ET DÉTECTION D'INCIDENTS

### 8.1 Logs de Sécurité

#### Types de Logs

```typescript
// 1. Authentification
console.log('[AUTH]', {
  event: 'login_success',
  user_id: user.id,
  ip: request.headers.get('x-forwarded-for'),
  timestamp: new Date().toISOString()
});

console.log('[AUTH]', {
  event: 'login_failed',
  email: email,
  reason: error.message,
  ip: request.headers.get('x-forwarded-for'),
  timestamp: new Date().toISOString()
});

// 2. Actions sensibles
console.log('[ADMIN]', {
  event: 'flyer_deleted',
  user_id: user.id,
  flyer_id: flyerId,
  timestamp: new Date().toISOString()
});

// 3. Erreurs de sécurité
console.log('[SECURITY]', {
  event: 'unauthorized_access',
  endpoint: request.url,
  ip: request.headers.get('x-forwarded-for'),
  timestamp: new Date().toISOString()
});

// 4. Erreurs système
console.error('[ERROR]', {
  event: 'database_error',
  error: error.message,  // Pas de détails sensibles !
  timestamp: new Date().toISOString()
});
```

#### Consultation des Logs

```bash
# Supabase Dashboard
# Logs > Edge Functions > Filter by severity

# Recherche d'incidents
# - Filtre : "SECURITY" ou "AUTH"
# - Période : Dernières 24h
# - Grouper par IP
```

### 8.2 Métriques de Sécurité

#### Dashboard (KPIs)

| Métrique | Seuil Normal | Seuil Alerte | Action |
|----------|--------------|--------------|--------|
| **Tentatives de login échouées** | < 10/heure | > 50/heure | Investiguer IP |
| **Requêtes 401 (Unauthorized)** | < 5% | > 10% | Vérifier auth |
| **Requêtes 5xx (Server errors)** | < 1% | > 5% | Vérifier backend |
| **Temps de réponse API** | < 500ms | > 2s | Optimiser |
| **Taux d'erreur email** | < 1% | > 5% | Vérifier Resend |

#### Alertes Automatiques

```typescript
// Exemple : Alerte si trop de 401
let unauthorizedCount = 0;
const ALERT_THRESHOLD = 50;
const RESET_INTERVAL = 3600000; // 1 heure

setInterval(() => {
  unauthorizedCount = 0;
}, RESET_INTERVAL);

app.use(async (c, next) => {
  await next();
  
  if (c.res.status === 401) {
    unauthorizedCount++;
    
    if (unauthorizedCount > ALERT_THRESHOLD) {
      // Envoyer alerte (email, Slack, etc.)
      await sendAlert({
        type: 'SECURITY',
        severity: 'HIGH',
        message: `${unauthorizedCount} unauthorized attempts in the last hour`,
        timestamp: new Date().toISOString()
      });
    }
  }
});
```

### 8.3 Détection d'Anomalies

#### Patterns Suspects

```typescript
// Indicateurs de compromission
const suspiciousPatterns = [
  // SQL Injection tentatives
  /(\bunion\b|\bselect\b.*\bfrom\b|\bdrop\b|\bdelete\b)/i,
  
  // XSS tentatives
  /<script[^>]*>|javascript:|onerror=/i,
  
  // Path Traversal
  /\.\.[\/\\]/,
  
  // Command Injection
  /[;&|`$()]/
];

function detectSuspiciousInput(input: string): boolean {
  return suspiciousPatterns.some(pattern => pattern.test(input));
}

// Utilisation
if (detectSuspiciousInput(userInput)) {
  console.log('[SECURITY]', {
    event: 'suspicious_input_detected',
    input: userInput.substring(0, 100), // Tronqué pour logs
    ip: request.headers.get('x-forwarded-for'),
    timestamp: new Date().toISOString()
  });
  
  return c.json({ error: 'Invalid input' }, 400);
}
```

---

## 9. PLAN DE RÉPONSE AUX INCIDENTS

### 9.1 Classification des Incidents

| Niveau | Gravité | Exemple | Temps de Réponse |
|--------|---------|---------|------------------|
| **P0** | 🔴 Critique | Site down, breach de données | < 15 minutes |
| **P1** | 🟠 Élevée | Auth compromise, API down | < 1 heure |
| **P2** | 🟡 Moyenne | Bug majeur, performance dégradée | < 4 heures |
| **P3** | 🟢 Basse | Bug mineur, amélioration | < 24 heures |

### 9.2 Procédure d'Incident P0 (Critique)

#### Phase 1 : Détection et Confinement (0-15 min)

```bash
# 1. IDENTIFIER l'incident
# Source : Logs, alertes, rapport utilisateur

# 2. ÉVALUER l'impact
# - Nombre d'utilisateurs affectés
# - Type de données compromises
# - Durée de l'exposition

# 3. CONTENIR immédiatement
# Si breach de données suspecté :
supabase projects pause omega24-consulting  # Mettre le projet en pause

# Si clé API compromise :
supabase secrets delete COMPROMISED_KEY
resend api-keys revoke KEY_ID

# Si attaque DDoS :
# Activer "Under Attack Mode" sur Cloudflare
```

#### Phase 2 : Investigation (15-60 min)

```bash
# 1. COLLECTER les logs
supabase functions logs --project-ref xxx --tail 1000 > incident_logs.txt

# 2. ANALYSER les accès
# - IPs suspectes
# - Endpoints ciblés
# - Patterns d'attaque

# 3. IDENTIFIER la cause
# - Vulnérabilité exploitée
# - Configuration erronée
# - Erreur humaine
```

#### Phase 3 : Éradication (1-4h)

```bash
# 1. CORRIGER la vulnérabilité
# - Patch de code
# - Mise à jour de dépendance
# - Reconfiguration

# 2. RÉVOQUER les accès compromis
# - Réinitialiser mots de passe
# - Générer nouveaux tokens
# - Bloquer IPs malveillantes

# 3. VALIDER la correction
# - Tests de non-régression
# - Scan de vulnérabilités
# - Vérification logs
```

#### Phase 4 : Récupération (4-24h)

```bash
# 1. RESTAURER le service
supabase projects resume omega24-consulting

# 2. VÉRIFIER l'intégrité des données
# Comparer avec dernier backup sain
psql "..." -c "SELECT COUNT(*) FROM kv_store_27d76fd3;"

# 3. MONITORER de près
# Surveiller les logs pendant 48h
```

#### Phase 5 : Post-Mortem (24-72h)

```markdown
# RAPPORT D'INCIDENT

## Résumé
- Date : YYYY-MM-DD HH:MM
- Durée : X heures
- Impact : X utilisateurs
- Gravité : P0 Critique

## Chronologie
- HH:MM : Détection
- HH:MM : Confinement
- HH:MM : Cause identifiée
- HH:MM : Correction appliquée
- HH:MM : Service restauré

## Cause Racine
[Description détaillée]

## Actions Correctives
1. Immédiat : [...]
2. Court terme : [...]
3. Long terme : [...]

## Leçons Apprises
- [...]
- [...]

## Prévention Future
- [...]
- [...]
```

### 9.3 Contacts d'Urgence

```yaml
# contacts_urgence.yml
incidents:
  p0_critique:
    - name: "Admin Principal"
      email: "admin@omega24consulting.com"
      phone: "+229 01 41 31 22 22"
      role: "Decision maker"
    
    - name: "Développeur Lead"
      email: "dev@omega24consulting.com"
      phone: "+229 01 90 57 42 42"
      role: "Technical response"
  
  services_externes:
    - name: "Supabase Support"
      email: "support@supabase.com"
      docs: "https://supabase.com/docs/guides/platform/going-into-prod"
    
    - name: "Vercel Support"
      email: "support@vercel.com"
      docs: "https://vercel.com/docs/security"
```

---

## 10. CONFORMITÉ ET RÉGLEMENTATIONS

### 10.1 RGPD (Règlement Général sur la Protection des Données)

#### Principes Appliqués

| Principe | Implémentation | Statut |
|----------|----------------|--------|
| **Licéité** | Consentement explicite formulaires | ✅ |
| **Limitation des finalités** | Usage défini dans politique | ✅ |
| **Minimisation** | Seulement données nécessaires | ✅ |
| **Exactitude** | Droit de rectification | ✅ |
| **Limitation de conservation** | 3 ans prospects, 10 ans compta | ✅ |
| **Intégrité** | Chiffrement + RLS | ✅ |
| **Responsabilité** | Documentation complète | ✅ |

#### Droits des Utilisateurs

```typescript
// Exemple : Répondre à une demande RGPD

// 1. DROIT D'ACCÈS (Article 15)
// L'utilisateur peut obtenir une copie de ses données
async function exportUserData(userId: string) {
  // Récupérer toutes les données liées à l'utilisateur
  const testimonials = await kv.getByPrefix('testimonial:');
  const userTestimonials = testimonials.filter(t => t.userId === userId);
  
  const contacts = await kv.getByPrefix('contact:');
  const userContacts = contacts.filter(c => c.email === userEmail);
  
  return {
    personal_data: userTestimonials,
    contact_history: userContacts,
    exported_at: new Date().toISOString()
  };
}

// 2. DROIT DE RECTIFICATION (Article 16)
// L'utilisateur peut corriger ses données
async function updateUserData(userId: string, updates: any) {
  // Valider les updates
  // Mettre à jour dans la base
  await kv.set(`testimonial:${id}`, updatedData);
}

// 3. DROIT À L'EFFACEMENT (Article 17)
// L'utilisateur peut demander la suppression
async function deleteUserData(userId: string) {
  // Supprimer ou anonymiser
  const testimonials = await kv.getByPrefix('testimonial:');
  for (const t of testimonials.filter(t => t.userId === userId)) {
    // Option 1 : Anonymiser
    t.name = 'Utilisateur Anonyme';
    t.email = 'deleted@deleted.local';
    await kv.set(`testimonial:${t.id}`, t);
    
    // Option 2 : Supprimer complètement
    // await kv.del(`testimonial:${t.id}`);
  }
}

// 4. DROIT À LA PORTABILITÉ (Article 20)
// Export au format structuré (JSON, CSV)
async function exportToJSON(userId: string) {
  const data = await exportUserData(userId);
  return JSON.stringify(data, null, 2);
}

async function exportToCSV(userId: string) {
  const data = await exportUserData(userId);
  // Convertir en CSV
  return convertToCSV(data);
}
```

#### Registre des Traitements

```markdown
# REGISTRE DES ACTIVITÉS DE TRAITEMENT

## Traitement 1 : Gestion des Contacts
- Responsable : Oméga24 Consulting
- Finalité : Répondre aux demandes de renseignements
- Catégories de données : Nom, email, téléphone, message
- Catégories de personnes : Prospects, clients
- Destinataires : Personnel OMEGA24, prestataires email (Resend)
- Transferts hors UE : Oui (États-Unis - Resend)
- Durée de conservation : 3 ans
- Mesures de sécurité : Chiffrement TLS, RLS, backups chiffrés

## Traitement 2 : Gestion des Témoignages
- Responsable : Oméga24 Consulting
- Finalité : Affichage de témoignages clients
- Catégories de données : Nom, pays, témoignage, photo (optionnel)
- Catégories de personnes : Clients
- Destinataires : Public (site web)
- Transferts hors UE : Non
- Durée de conservation : Jusqu'à retrait du consentement
- Mesures de sécurité : Consentement explicite, droit à l'effacement
```

### 10.2 Cookies et Trackers

#### Déclaration

```typescript
// Cookies utilisés (actuellement AUCUN cookie de tracking)
const cookies = {
  essential: [
    {
      name: 'supabase-auth-token',
      purpose: 'Authentification administrateur',
      duration: '1 heure',
      type: 'HttpOnly, Secure, SameSite=Strict',
      consent_required: false  // Cookie essentiel
    }
  ],
  analytics: [],  // Aucun pour le moment
  marketing: []   // Aucun
};
```

#### Banner de Consentement (À Implémenter si Ajout de Cookies)

```typescript
// Si vous ajoutez Google Analytics ou autre :
import CookieConsent from 'react-cookie-consent';

<CookieConsent
  location="bottom"
  buttonText="Accepter"
  declineButtonText="Refuser"
  enableDeclineButton
  cookieName="omega24-cookie-consent"
  style={{ background: "#002F6C" }}
  buttonStyle={{ background: "#4DA6FF", color: "#fff" }}
  expires={365}
  onAccept={() => {
    // Activer les cookies analytics
    window.gtag('consent', 'update', {
      analytics_storage: 'granted'
    });
  }}
  onDecline={() => {
    // Désactiver les cookies analytics
    window.gtag('consent', 'update', {
      analytics_storage: 'denied'
    });
  }}
>
  Ce site utilise des cookies pour améliorer votre expérience.{" "}
  <a href="/politique-de-confidentialite" style={{ color: "#4DA6FF" }}>
    En savoir plus
  </a>
</CookieConsent>
```

---

## 11. CHECKLIST DE DÉPLOIEMENT EN PRODUCTION

### 11.1 Pré-Déploiement

#### Configuration

- [ ] Variables d'environnement configurées (Vercel)
- [ ] Secrets configurés (Supabase)
- [ ] DNS configuré et propagé
- [ ] SSL/TLS activé et valide (A+ sur SSL Labs)
- [ ] Domaine personnalisé configuré
- [ ] Backups automatiques activés

#### Sécurité

- [ ] RLS activé sur toutes les tables
- [ ] Politiques RLS testées
- [ ] Headers de sécurité configurés
- [ ] CSP défini et testé
- [ ] Rate limiting activé
- [ ] Secrets rotés depuis le développement
- [ ] `.env` files jamais commités
- [ ] `npm audit` sans vulnérabilités critiques

#### Code

- [ ] Build de production réussi (`npm run build`)
- [ ] Tests passés (si existants)
- [ ] Pas de `console.log()` avec données sensibles
- [ ] Pas de commentaires `TODO` critiques
- [ ] Version Git taguée (ex: v1.0.0)

#### Documentation

- [ ] README.md à jour
- [ ] CHANGELOG.md créé
- [ ] Documentation API disponible
- [ ] Contacts d'urgence documentés

### 11.2 Déploiement

```bash
# 1. Tag de la version
git tag -a v1.0.0 -m "Release 1.0.0 - Production"
git push origin v1.0.0

# 2. Déploiement Vercel
vercel --prod

# 3. Vérification immédiate
curl -I https://omega24consulting.com
# Attendu : HTTP/2 200

# 4. Test des fonctionnalités critiques
# - Login admin
# - Formulaire de contact
# - CRUD flyers/testimonials
```

### 11.3 Post-Déploiement

#### Tests de Sécurité

- [ ] Scan SSL : https://www.ssllabs.com/ssltest/ (Objectif : A+)
- [ ] Scan headers : https://securityheaders.com (Objectif : A)
- [ ] Test OWASP Top 10 : https://observatory.mozilla.org
- [ ] Vérification RLS (tentative d'accès non autorisé)
- [ ] Test rate limiting (multiples requêtes)

#### Tests Fonctionnels

- [ ] Toutes les pages se chargent (pas de 404)
- [ ] Formulaire de contact envoie des emails
- [ ] Authentification admin fonctionne
- [ ] CRUD flyers fonctionne
- [ ] CRUD témoignages fonctionne
- [ ] Responsive mobile testé

#### Monitoring

- [ ] Vercel Analytics activé
- [ ] Supabase Logs configurés
- [ ] Alertes configurées (email/Slack)
- [ ] Dashboard de métriques créé

#### Communication

- [ ] Équipe notifiée du déploiement
- [ ] Client informé de la mise en production
- [ ] Documentation d'exploitation fournie

---

## 12. PROCÉDURES D'URGENCE

### 12.1 Site Compromis

```bash
# 🚨 ACTIONS IMMÉDIATES (< 5 minutes)

# 1. METTRE LE SITE HORS LIGNE
vercel --prod --force  # Redéployer une version saine
# OU
vercel remove production  # Supprimer complètement

# 2. CHANGER TOUS LES SECRETS
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=NEW_KEY
supabase secrets set RESEND_API_KEY=NEW_KEY

# 3. RÉVOQUER TOUS LES TOKENS D'AUTHENTIFICATION
# Supabase Dashboard > Authentication > Users
# Actions > Sign out all users

# 4. BLOQUER LES IPS MALVEILLANTES
# Cloudflare Dashboard > Security > WAF
# Créer règle : Block IP X.X.X.X

# 5. ANALYSER LES LOGS
supabase functions logs --tail 10000 > incident_$(date +%Y%m%d_%H%M%S).log

# 6. NOTIFIER
# - Équipe technique
# - Client
# - Autorités si nécessaire (CNIL en France)
```

### 12.2 Fuite de Données

```bash
# 🚨 PROCÉDURE BREACH DE DONNÉES

# 1. CONFIRMER LA FUITE (< 1h)
# - Quelles données ?
# - Combien de personnes affectées ?
# - Depuis quand ?
# - Comment ?

# 2. CONTENIR (< 2h)
# - Bloquer l'accès
# - Révoquer les credentials
# - Patcher la vulnérabilité

# 3. ÉVALUER L'IMPACT (< 4h)
# Données sensibles concernées :
# - Mots de passe : OUI/NON
# - Emails : OUI/NON
# - Messages privés : OUI/NON
# - Données financières : OUI/NON

# 4. NOTIFIER (< 72h si données sensibles)
# Email aux utilisateurs affectés :
```

**Template Email** :

```
Objet : Important : Incident de sécurité Oméga24 Consulting

Cher(e) utilisateur/trice,

Nous vous informons qu'un incident de sécurité a été détecté le [DATE] 
sur notre plateforme. Vos données suivantes ont potentiellement été exposées :
- [Liste des données]

ACTIONS IMMÉDIATES :
1. Changez votre mot de passe immédiatement
2. Activez l'authentification à deux facteurs (si disponible)
3. Surveillez vos comptes pour toute activité suspecte

ACTIONS PRISES PAR OMEGA24 :
- Vulnérabilité corrigée le [DATE]
- Tous les mots de passe réinitialisés
- Surveillance renforcée

Pour plus d'informations : security@omega24consulting.com

Cordialement,
L'équipe Oméga24 Consulting
```

### 12.3 Perte de Données

```bash
# 🚨 RESTAURATION D'URGENCE

# 1. IDENTIFIER LA PERTE
# - Table entière ?
# - Quelques entrées ?
# - Corruption ?

# 2. STOPPER TOUTE ÉCRITURE
supabase projects pause omega24-consulting

# 3. RESTAURER DEPUIS LE DERNIER BACKUP
# Option A : Backup Supabase automatique
# Dashboard > Database > Backups > Restore to [timestamp]

# Option B : Backup manuel
psql "postgresql://..." < backup_latest.sql

# 4. VÉRIFIER L'INTÉGRITÉ
psql "postgresql://..." -c "
  SELECT 
    SUBSTRING(key FROM '^[^:]+') as prefix,
    COUNT(*) as count
  FROM kv_store_27d76fd3
  GROUP BY prefix;
"

# Comparer avec les chiffres attendus

# 5. RELANCER LE SERVICE
supabase projects resume omega24-consulting

# 6. MONITORER DE PRÈS
# Surveiller les logs pendant 24h
```

### 12.4 Attaque DDoS

```bash
# 🚨 MITIGATION DDoS

# 1. CONFIRMER L'ATTAQUE
# Signes :
# - Spike massif de trafic
# - Latence élevée
# - Erreurs 503 (Service Unavailable)

# 2. ACTIVER CLOUDFLARE "UNDER ATTACK MODE"
# (si configuré)
# Cloudflare Dashboard > Overview > Under Attack

# 3. ANALYSER LE TRAFIC
# - IPs sources
# - Endpoints ciblés
# - User-agents

# 4. BLOQUER LES IPS MALVEILLANTES
# Vercel : Impossible directement
# Cloudflare : Firewall Rules > Block IP range X.X.X.0/24

# 5. ACTIVER RATE LIMITING STRICT
# Supabase Dashboard > Settings > API
# Réduire temporairement les limites

# 6. CONTACTER LE SUPPORT
# Vercel Support : support@vercel.com
# Cloudflare Support : Via Dashboard
```

---

## ✅ RÉSUMÉ SÉCURITÉ

### Points Forts

- ✅ **Architecture sécurisée** : Three-tier avec séparation stricte
- ✅ **Authentification robuste** : JWT + bcrypt + rate limiting
- ✅ **Chiffrement complet** : TLS 1.3 + AES-256
- ✅ **RLS activé** : Protection au niveau database
- ✅ **Monitoring actif** : Logs + alertes
- ✅ **Backups réguliers** : Automatiques + manuels
- ✅ **Conformité RGPD** : Politique complète + droits utilisateurs
- ✅ **Plan d'incident** : Procédures documentées

### Points d'Amélioration Recommandés

- 🟡 **2FA (Two-Factor Authentication)** : Ajouter pour les admins
- 🟡 **WAF (Web Application Firewall)** : Cloudflare en plus de Vercel
- 🟡 **Penetration Testing** : Audit externe annuel
- 🟡 **Bug Bounty Program** : Encourager la découverte de vulnérabilités
- 🟡 **SIEM (Security Information and Event Management)** : Centraliser les logs

### Niveau de Sécurité Global

```
🟢 Excellente base de sécurité
✅ Production-ready
⚠️ Amélioration continue recommandée
```

---

**Date** : Décembre 2024  
**Version** : 1.0  
**Classification** : Confidentiel  
**Prochaine Revue** : Mars 2025

**Contacts Sécurité** :
- 📧 security@omega24consulting.com
- 📞 +229 01 41 31 22 22

---

**🔐 LA SÉCURITÉ EST UNE RESPONSABILITÉ PARTAGÉE. RESTEZ VIGILANTS !**
