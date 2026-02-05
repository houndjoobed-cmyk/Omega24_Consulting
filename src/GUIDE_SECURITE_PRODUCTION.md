# 🔐 GUIDE DE SÉCURITÉ POUR LA PRODUCTION

## ⚠️ IMPORTANCE CRITIQUE

Ce document détaille les mesures de sécurité **OBLIGATOIRES** avant de mettre le site OMEGA24 CONSULTING en production. Ne pas suivre ces étapes expose votre site à des risques de :

- 🚨 Piratage et vol de données
- 🚨 Injection de code malveillant
- 🚨 Spam et abus du formulaire de contact
- 🚨 Accès non autorisé à l'administration
- 🚨 Fuite de données clients
- 🚨 Attaques DDoS et surcharge serveur

---

## 📋 Checklist de Sécurité Pré-Production

### Niveau 1 : CRITIQUE (Obligatoire)
- [ ] Variables d'environnement sécurisées
- [ ] HTTPS/SSL activé
- [ ] Row Level Security (RLS) configuré
- [ ] Mots de passe admin forts
- [ ] Rate limiting activé
- [ ] CORS restreint aux domaines autorisés
- [ ] Validation des données côté serveur

### Niveau 2 : IMPORTANT (Fortement Recommandé)
- [ ] Protection CSRF
- [ ] Logs et monitoring
- [ ] Backups automatiques
- [ ] Protection anti-spam (Recaptcha)
- [ ] Email de domaine personnalisé
- [ ] Politique de confidentialité

### Niveau 3 : OPTIMISATION (Recommandé)
- [ ] WAF (Web Application Firewall)
- [ ] CDN configuré
- [ ] Audit de sécurité externe
- [ ] Tests de pénétration

---

## 🔒 1. Sécurisation des Variables d'Environnement

### Problème Actuel
Les clés API Supabase sont **hardcodées** dans `/utils/supabase/info.tsx` :
```typescript
export const projectId = 'vcblcaufhcgcggnzifln';
export const publicAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

❌ **DANGER :** Ces clés sont visibles dans le code source du site !

### Solution

#### Étape 1 : Créer un fichier `.env.production`

```env
# .env.production
VITE_SUPABASE_URL=https://vcblcaufhcgcggnzifln.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZjYmxjYXVmaGNnY2dnbnppZmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI2NDE3ODEsImV4cCI6MjA0ODIxNzc4MX0.W-C9vCfXFbFZAOYRPCK8MQnxZPMdyIDf9tJVZqwL-hE
NODE_ENV=production
```

#### Étape 2 : Modifier `/utils/supabase/info.tsx`

```typescript
// Utiliser les variables d'environnement
export const projectId = import.meta.env.VITE_SUPABASE_URL
  ?.split('//')[1]
  ?.split('.')[0] || 'vcblcaufhcgcggnzifln';

export const publicAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Vérification en développement
if (!import.meta.env.VITE_SUPABASE_ANON_KEY && import.meta.env.DEV) {
  console.warn('⚠️ VITE_SUPABASE_ANON_KEY non définie');
}
```

#### Étape 3 : Ajouter au `.gitignore`

```gitignore
# Variables d'environnement
.env.local
.env.production
.env*.local
*.env

# Secrets
secrets.json
config.local.js
```

#### Étape 4 : Configurer sur Vercel/Netlify

**Vercel :**
1. Dashboard > Projet > Settings > Environment Variables
2. Ajouter :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Sélectionner `Production` uniquement
4. Save et Redeploy

**Netlify :**
1. Site Settings > Environment > Environment Variables
2. Ajouter les mêmes variables
3. Redéployer

---

## 🛡️ 2. Row Level Security (RLS) Supabase

### Pourquoi c'est Critique
Sans RLS, **n'importe qui** peut lire/écrire dans votre base de données en utilisant la clé publique `SUPABASE_ANON_KEY`.

### Activation RLS

#### Étape 1 : Activer RLS sur la table

```sql
-- Dans Supabase SQL Editor
-- Dashboard > SQL Editor > New Query

-- Activer RLS
ALTER TABLE kv_store_27d76fd3 ENABLE ROW LEVEL SECURITY;
```

#### Étape 2 : Créer les Politiques de Sécurité

```sql
-- 1. LECTURE PUBLIQUE pour flyers et testimonials
CREATE POLICY "Public read flyers and testimonials"
ON kv_store_27d76fd3
FOR SELECT
USING (
  key LIKE 'flyer:%' 
  OR key LIKE 'testimonial:%'
);

-- 2. LECTURE ADMIN pour les contacts
CREATE POLICY "Admin read contacts"
ON kv_store_27d76fd3
FOR SELECT
USING (
  key LIKE 'contact:%' 
  AND auth.uid() IS NOT NULL
);

-- 3. ÉCRITURE ADMIN uniquement
CREATE POLICY "Admin write all"
ON kv_store_27d76fd3
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin update all"
ON kv_store_27d76fd3
FOR UPDATE
USING (auth.uid() IS NOT NULL)
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Admin delete all"
ON kv_store_27d76fd3
FOR DELETE
USING (auth.uid() IS NOT NULL);
```

#### Étape 3 : Tester les Politiques

```sql
-- Test 1 : Lecture publique (doit fonctionner)
SELECT * FROM kv_store_27d76fd3 WHERE key LIKE 'flyer:%';

-- Test 2 : Écriture publique (doit ÉCHOUER)
INSERT INTO kv_store_27d76fd3 (key, value) 
VALUES ('test:1', '{"test": true}');
-- Erreur attendue : "new row violates row-level security policy"

-- Test 3 : Se connecter comme admin puis réessayer
-- Doit fonctionner
```

#### Étape 4 : Vérifier dans le Dashboard

1. Database > Tables > `kv_store_27d76fd3`
2. Cliquer sur l'icône 🛡️ (RLS)
3. Vérifier que RLS est `Enabled`
4. Voir la liste des politiques

---

## 🚦 3. Rate Limiting (Limitation de Débit)

### Objectif
Empêcher les attaques par force brute et le spam.

### Configuration Supabase (Basique)

1. Dashboard > Settings > API
2. Configurer :
   - **Anonymous requests :** 100 req/min
   - **Authenticated requests :** 200 req/min
3. Activer `IP-based rate limiting`

### Configuration Edge Function (Avancé)

Modifier `/supabase/functions/server/index.tsx` :

```typescript
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';

const app = new Hono();

// Simple rate limiter en mémoire (pour démo)
const requestCounts = new Map<string, { count: number; resetTime: number }>();

const rateLimit = (limit: number, windowMs: number) => {
  return async (c: any, next: any) => {
    const ip = c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'unknown';
    const now = Date.now();
    const key = `${ip}:${c.req.path}`;

    let record = requestCounts.get(key);
    if (!record || now > record.resetTime) {
      record = { count: 0, resetTime: now + windowMs };
    }

    record.count++;
    requestCounts.set(key, record);

    if (record.count > limit) {
      return c.json({ 
        error: 'Trop de requêtes. Veuillez réessayer dans quelques minutes.' 
      }, 429);
    }

    await next();
  };
};

// Appliquer sur les endpoints sensibles
app.post('/make-server-27d76fd3/contact', 
  rateLimit(5, 60000), // 5 requêtes par minute
  async (c) => {
    // ... code existant
  }
);

app.post('/make-server-27d76fd3/signup', 
  rateLimit(3, 3600000), // 3 requêtes par heure
  async (c) => {
    // ... code existant
  }
);
```

### Alternative : Utiliser Upstash Rate Limit

```typescript
import { Ratelimit } from 'npm:@upstash/ratelimit';
import { Redis } from 'npm:@upstash/redis';

const redis = new Redis({
  url: Deno.env.get('UPSTASH_REDIS_URL'),
  token: Deno.env.get('UPSTASH_REDIS_TOKEN'),
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '60 s'),
});

// Dans l'endpoint
const identifier = c.req.header('x-forwarded-for') || 'anonymous';
const { success } = await ratelimit.limit(identifier);

if (!success) {
  return c.json({ error: 'Rate limit exceeded' }, 429);
}
```

---

## 🔐 4. Mots de Passe Admin Sécurisés

### Règles Obligatoires

Un mot de passe admin doit contenir :
- ✅ Minimum 16 caractères
- ✅ Majuscules et minuscules
- ✅ Chiffres
- ✅ Caractères spéciaux (@, #, $, %, &, *)
- ✅ Pas de mots du dictionnaire
- ✅ Pas d'informations personnelles (nom, date de naissance)

### Générateur de Mot de Passe

Utiliser un gestionnaire de mots de passe :
- 1Password : https://1password.com/
- LastPass : https://www.lastpass.com/
- Bitwarden (gratuit) : https://bitwarden.com/

**Exemple de mot de passe fort :**
```
Omega24#Secure@2025!Consulting$
```

### Changement de Mot de Passe Régulier

1. Tous les 3 mois minimum
2. Immédiatement si suspicion de compromission
3. Ne jamais réutiliser un ancien mot de passe

### Authentification à Deux Facteurs (2FA)

**Activer 2FA sur Supabase :**
1. Dashboard Supabase > Settings > Auth
2. `Additional Providers` > Activer `Email OTP` ou `SMS`
3. Modifier l'Edge Function pour vérifier le code OTP

---

## 🌐 5. Configuration HTTPS et SSL

### Vérification SSL

1. Ouvrir le site en production
2. Vérifier le cadenas 🔒 dans la barre d'adresse
3. Cliquer dessus > "Connexion sécurisée"
4. Vérifier le certificat (valide, non expiré)

### Forcer HTTPS (si hébergement custom)

#### Nginx
```nginx
server {
    listen 80;
    server_name omega24consulting.com www.omega24consulting.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name omega24consulting.com www.omega24consulting.com;
    
    ssl_certificate /etc/letsencrypt/live/omega24consulting.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/omega24consulting.com/privkey.pem;
    
    # Configurations SSL recommandées
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;
    
    # HSTS (optionnel)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # ...
}
```

#### Apache
```apache
<VirtualHost *:80>
    ServerName omega24consulting.com
    Redirect permanent / https://omega24consulting.com/
</VirtualHost>

<VirtualHost *:443>
    ServerName omega24consulting.com
    
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/omega24consulting.com/cert.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/omega24consulting.com/privkey.pem
    SSLCertificateChainFile /etc/letsencrypt/live/omega24consulting.com/chain.pem
    
    # ...
</VirtualHost>
```

### Let's Encrypt (Certificat SSL Gratuit)

```bash
# Installer Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtenir un certificat
sudo certbot --nginx -d omega24consulting.com -d www.omega24consulting.com

# Renouvellement automatique (cron)
sudo crontab -e
# Ajouter :
0 3 * * * certbot renew --quiet
```

---

## 🛡️ 6. Protection CSRF (Cross-Site Request Forgery)

### Implémenter un Token CSRF

#### Backend : Générer le Token

Modifier `/supabase/functions/server/index.tsx` :

```typescript
import { Hono } from 'npm:hono';
import { csrf } from 'npm:hono/csrf';

const app = new Hono();

// Middleware CSRF
app.use('*', csrf({
  origin: ['https://omega24consulting.com', 'https://www.omega24consulting.com'],
}));

// OU manuel :
app.get('/make-server-27d76fd3/csrf-token', (c) => {
  const token = crypto.randomUUID();
  // Stocker en session ou JWT
  return c.json({ csrfToken: token });
});

// Vérifier dans les POST/PUT/DELETE
app.post('/make-server-27d76fd3/*', async (c, next) => {
  const csrfToken = c.req.header('X-CSRF-Token');
  const expectedToken = /* récupérer depuis session */;
  
  if (csrfToken !== expectedToken) {
    return c.json({ error: 'CSRF token invalid' }, 403);
  }
  
  await next();
});
```

#### Frontend : Inclure le Token

```typescript
// Dans AuthContext.tsx
const [csrfToken, setCsrfToken] = useState('');

useEffect(() => {
  // Récupérer au chargement
  fetch(`${API_URL}/csrf-token`)
    .then(res => res.json())
    .then(data => setCsrfToken(data.csrfToken));
}, []);

// Dans les requêtes
fetch(url, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': csrfToken,
  },
  body: JSON.stringify(data),
});
```

---

## 🚫 7. Validation des Données (Zod)

### Installer Zod dans l'Edge Function

Modifier `/supabase/functions/server/index.tsx` :

```typescript
import { z } from 'npm:zod';

// Schéma de validation Contact
const ContactSchema = z.object({
  name: z.string()
    .min(2, 'Nom trop court')
    .max(100, 'Nom trop long')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Caractères invalides'),
  
  email: z.string()
    .email('Email invalide')
    .max(255),
  
  phone: z.string()
    .regex(/^\+?[0-9\s-]+$/, 'Téléphone invalide')
    .optional(),
  
  subject: z.string()
    .min(3, 'Sujet trop court')
    .max(200, 'Sujet trop long'),
  
  message: z.string()
    .min(10, 'Message trop court')
    .max(2000, 'Message trop long'),
});

// Schéma Flyer
const FlyerSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(200),
  description: z.string().min(10).max(1000),
  image: z.string().url('URL d\'image invalide'),
  details: z.array(z.string()).optional(),
});

// Schéma Testimonial
const TestimonialSchema = z.object({
  id: z.string(),
  name: z.string().min(2).max(100),
  role: z.string().min(2).max(100),
  country: z.string().min(2).max(100),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10).max(1000),
  photo: z.string().url().optional(),
  date: z.string(),
});

// Utilisation dans l'endpoint
app.post('/make-server-27d76fd3/contact', async (c) => {
  try {
    const body = await c.req.json();
    
    // Validation
    const validation = ContactSchema.safeParse(body);
    if (!validation.success) {
      return c.json({ 
        error: 'Données invalides', 
        details: validation.error.errors 
      }, 400);
    }
    
    const data = validation.data;
    // ... suite du code avec data validée
    
  } catch (error) {
    return c.json({ error: 'Erreur serveur' }, 500);
  }
});
```

### Sanitization (Nettoyage)

```typescript
import { escape } from 'npm:html-escaper';

const sanitize = (str: string): string => {
  return escape(str.trim());
};

// Appliquer sur toutes les entrées utilisateur
const safeName = sanitize(data.name);
const safeMessage = sanitize(data.message);
```

---

## 🤖 8. Protection Anti-Spam (reCAPTCHA)

### Étape 1 : Obtenir les Clés reCAPTCHA

1. Aller sur https://www.google.com/recaptcha/admin
2. Créer un nouveau site :
   - **Label :** OMEGA24 CONSULTING
   - **reCAPTCHA type :** v2 "I'm not a robot"
   - **Domains :** omega24consulting.com
3. Copier :
   - Site Key (publique)
   - Secret Key (privée)

### Étape 2 : Ajouter au Formulaire

Modifier `/components/Contact.tsx` :

```typescript
import ReCAPTCHA from 'react-google-recaptcha';

export function Contact() {
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  
  const handleCaptchaChange = (token: string | null) => {
    setCaptchaToken(token);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!captchaToken) {
      toast.error('Veuillez valider le CAPTCHA');
      return;
    }
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...formData,
        captchaToken,
      }),
    });
    
    // ...
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* ... champs existants ... */}
      
      <ReCAPTCHA
        sitekey="VOTRE_SITE_KEY_PUBLIQUE"
        onChange={handleCaptchaChange}
      />
      
      <Button type="submit" disabled={!captchaToken}>
        Envoyer
      </Button>
    </form>
  );
}
```

### Étape 3 : Vérifier Côté Backend

```typescript
app.post('/make-server-27d76fd3/contact', async (c) => {
  const { captchaToken, ...data } = await c.req.json();
  
  // Vérifier le CAPTCHA
  const captchaResponse = await fetch(
    'https://www.google.com/recaptcha/api/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${Deno.env.get('RECAPTCHA_SECRET_KEY')}&response=${captchaToken}`,
    }
  );
  
  const captchaData = await captchaResponse.json();
  
  if (!captchaData.success) {
    return c.json({ error: 'Validation CAPTCHA échouée' }, 400);
  }
  
  // ... suite du traitement
});
```

---

## 📊 9. Monitoring et Logs

### Sentry (Monitoring d'Erreurs)

#### Installation

```bash
npm install @sentry/react
```

#### Configuration

Modifier `/App.tsx` :

```typescript
import * as Sentry from '@sentry/react';

// Initialiser Sentry
Sentry.init({
  dsn: 'https://YOUR_SENTRY_DSN@sentry.io/PROJECT_ID',
  environment: import.meta.env.MODE, // 'development' ou 'production'
  tracesSampleRate: 1.0, // 100% des transactions tracées
  replaysSessionSampleRate: 0.1, // 10% des sessions enregistrées
  replaysOnErrorSampleRate: 1.0, // 100% des sessions avec erreur
});

// Wrapper l'app
export default Sentry.withProfiler(App);
```

#### Capturer les Erreurs

```typescript
try {
  // Code risqué
} catch (error) {
  Sentry.captureException(error);
  console.error(error);
}
```

### Supabase Logs

1. Dashboard > Logs > Edge Functions
2. Filtrer par :
   - Level : `error`
   - Function : `make-server-27d76fd3`
3. Configurer des alertes :
   - Settings > Integrations > Webhooks
   - Envoyer vers Slack, Discord, ou email

### Uptime Monitoring

**UptimeRobot (Gratuit) :**
1. S'inscrire sur https://uptimerobot.com/
2. Créer un nouveau monitor :
   - Type : HTTPS
   - URL : https://omega24consulting.com
   - Interval : 5 minutes
3. Configurer les alertes :
   - Email + SMS
   - Si le site est down > 2 minutes

---

## 💾 10. Backups et Sauvegarde

### Supabase Backups Automatiques

1. Dashboard > Settings > Database
2. Activer `Point in Time Recovery` (PITR)
   - Permet de restaurer à n'importe quel moment des 7 derniers jours
3. Plan Gratuit : Backups quotidiens (rétention 7 jours)
4. Plan Pro : PITR + rétention 30 jours

### Backup Manuel Régulier

#### Via Supabase CLI

```bash
# Export complet
supabase db dump -f backup_$(date +%Y%m%d).sql

# Export table spécifique
supabase db dump -f backup_kv_store.sql --table kv_store_27d76fd3
```

#### Script de Backup Automatique (Linux/Mac)

Créer `/scripts/backup.sh` :

```bash
#!/bin/bash

# Configuration
BACKUP_DIR="$HOME/backups/omega24"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/omega24_backup_$DATE.sql"
RETENTION_DAYS=30

# Créer le dossier si nécessaire
mkdir -p "$BACKUP_DIR"

# Exporter la base
supabase db dump -f "$BACKUP_FILE"

# Compresser
gzip "$BACKUP_FILE"

# Supprimer les backups de plus de 30 jours
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

# Envoyer sur cloud (optionnel)
# rclone copy "$BACKUP_FILE.gz" remote:omega24-backups/

echo "✅ Backup créé : $BACKUP_FILE.gz"
```

#### Cron Job (Automatisation)

```bash
# Éditer crontab
crontab -e

# Ajouter : Backup tous les jours à 3h du matin
0 3 * * * /path/to/scripts/backup.sh >> /var/log/omega24_backup.log 2>&1
```

### Backup sur Cloud

**Avec rclone (Google Drive, Dropbox, etc.) :**

```bash
# Installer rclone
curl https://rclone.org/install.sh | sudo bash

# Configurer
rclone config

# Copier les backups
rclone copy ~/backups/omega24 googledrive:omega24-backups
```

---

## 🔥 11. WAF (Web Application Firewall)

### Cloudflare (Gratuit)

1. **S'inscrire sur Cloudflare :**
   - https://www.cloudflare.com/

2. **Ajouter votre site :**
   - Entrer : `omega24consulting.com`
   - Sélectionner le plan Gratuit

3. **Changer les DNS :**
   - Copier les nameservers Cloudflare
   - Les configurer chez votre registrar de domaine

4. **Activer les protections :**
   - SSL/TLS : `Full (strict)`
   - Firewall Rules :
     - Bloquer les pays à risque (optionnel)
     - Bloquer les User-Agents malveillants
   - Rate Limiting : Configurer des règles
   - DDoS Protection : Activée par défaut

### Règles Firewall Cloudflare

**Exemple de règles :**

```
# Bloquer les bots malveillants
(cf.client.bot) and (not cf.verified_bot_category in {"Search Engine Crawler" "AI Crawler"})

# Limiter les requêtes au formulaire de contact
(http.request.uri.path contains "/contact") and (http.request.method eq "POST") and (rate(60s) > 3)

# Bloquer certains pays (si applicable)
(ip.geoip.country in {"CN" "RU" "KP"})
```

---

## 🎯 12. Checklist Finale de Mise en Production

### Avant le Déploiement

- [ ] ✅ Variables d'environnement configurées (Vercel/Netlify)
- [ ] ✅ RLS activé sur `kv_store_27d76fd3`
- [ ] ✅ Rate limiting configuré (Supabase + Edge Function)
- [ ] ✅ Validation Zod implémentée côté backend
- [ ] ✅ CSRF protection ajoutée
- [ ] ✅ reCAPTCHA configuré sur formulaire de contact
- [ ] ✅ Compte admin créé avec mot de passe fort
- [ ] ✅ Clé API Resend configurée dans Supabase Secrets
- [ ] ✅ Email de domaine personnalisé configuré
- [ ] ✅ HTTPS/SSL activé et testé
- [ ] ✅ Certificat SSL valide (pas d'erreur)
- [ ] ✅ CORS restreint aux domaines autorisés
- [ ] ✅ Sentry ou monitoring configuré
- [ ] ✅ Backups automatiques activés
- [ ] ✅ Logs Supabase vérifiés et configurés
- [ ] ✅ Tests de pénétration basiques effectués

### Après le Déploiement

- [ ] ✅ Tester toutes les fonctionnalités en production
- [ ] ✅ Vérifier l'envoi d'emails (formulaire de contact)
- [ ] ✅ Tester la connexion admin
- [ ] ✅ Tester l'ajout/modification de flyers
- [ ] ✅ Tester l'ajout/modification de témoignages
- [ ] ✅ Vérifier les performances (temps de chargement)
- [ ] ✅ Tester sur mobile (responsive)
- [ ] ✅ Vérifier le SEO (métadonnées, sitemap)
- [ ] ✅ Configurer Google Analytics (optionnel)
- [ ] ✅ Soumettre à Google Search Console
- [ ] ✅ Ajouter une page "Politique de Confidentialité"
- [ ] ✅ Ajouter une page "Mentions Légales"
- [ ] ✅ Configurer les alertes Uptime (UptimeRobot)
- [ ] ✅ Documenter les identifiants admin (coffre-fort)

### Maintenance Continue

- [ ] 🔁 Vérifier les logs chaque semaine
- [ ] 🔁 Changer le mot de passe admin tous les 3 mois
- [ ] 🔁 Mettre à jour les dépendances npm tous les mois
- [ ] 🔁 Vérifier les backups tous les mois
- [ ] 🔁 Renouveler le certificat SSL (automatique avec Let's Encrypt)
- [ ] 🔁 Audit de sécurité tous les 6 mois

---

## 🆘 En Cas de Compromission

### Signes d'une Attaque

- 🚨 Connexions admin suspectes dans les logs
- 🚨 Modifications non autorisées du contenu
- 🚨 Pics de trafic inhabituels
- 🚨 Emails non sollicités envoyés depuis votre compte
- 🚨 Alertes de sécurité Supabase

### Actions Immédiates

1. **Changer TOUS les mots de passe :**
   - Admin Supabase
   - Comptes admin du site
   - Email infos@omega24consulting.com
   - Resend API

2. **Révoquer les tokens :**
   - Supabase Dashboard > Settings > API > Reset Anon Key
   - Régénérer les clés API Resend

3. **Restaurer depuis un backup :**
   ```bash
   supabase db reset
   # Puis restaurer
   psql < backup_last_good.sql
   ```

4. **Analyser les logs :**
   - Supabase Logs > Filtrer par `error` et `suspicious`
   - Identifier l'origine de l'attaque (IP, méthode)

5. **Bloquer l'attaquant :**
   - Ajouter l'IP dans le firewall Cloudflare
   - Signaler à Supabase si c'est une faille de leur côté

6. **Communiquer :**
   - Informer les clients si des données ont été compromises
   - Respecter le RGPD (notification dans les 72h)

---

## 📞 Contacts d'Urgence

- **Supabase Support :** https://supabase.com/dashboard/support/new
- **Resend Support :** support@resend.com
- **Cloudflare Support :** https://dash.cloudflare.com/support

---

## 🎓 Ressources de Sécurité

- **OWASP Top 10 :** https://owasp.org/www-project-top-ten/
- **Supabase Security Best Practices :** https://supabase.com/docs/guides/platform/security
- **Web.dev Security :** https://web.dev/secure/
- **Mozilla Observatory :** https://observatory.mozilla.org/ (scanner de sécurité)

---

## ✅ Conclusion

En appliquant **TOUTES** ces mesures de sécurité, le site OMEGA24 CONSULTING sera :
- ✅ Protégé contre les attaques courantes (XSS, CSRF, injection SQL)
- ✅ Résistant au spam et aux bots
- ✅ Sécurisé avec HTTPS/SSL
- ✅ Monitoré en temps réel
- ✅ Sauvegardé régulièrement
- ✅ Prêt pour la production ! 🚀

**⚠️ NE PAS NÉGLIGER LA SÉCURITÉ - C'EST VITAL !**

---

**Document rédigé le :** 26 Novembre 2025  
**Version :** 1.0  
**Contact :** infos@omega24consulting.com
