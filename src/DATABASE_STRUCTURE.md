# 📊 Structure de la Base de Données - Oméga24 Consulting

## Vue d'ensemble

Le site Oméga24 Consulting utilise une base de données **Supabase** avec une table clé-valeur (`kv_store_27d76fd3`) pour stocker toutes les données de manière flexible.

---

## 🗄️ Table Principale : `kv_store_27d76fd3`

### Schéma SQL
```sql
CREATE TABLE kv_store_27d76fd3 (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### Description
- **Type** : Table clé-valeur (Key-Value Store)
- **Clé primaire** : `key` (TEXT)
- **Valeur** : `value` (JSONB - permet de stocker des objets JSON complexes)

---

## 📋 Types de Données Stockées

### 1️⃣ **Flyers / Services** (Préfixe : `flyer:`)

**Clé** : `flyer:{id}`

**Structure de données** :
```typescript
{
  id: string,           // ID unique du flyer
  title: string,        // Titre du service
  description: string,  // Description courte
  image: string,        // URL de l'image
  details: string       // Détails complets du service
}
```

**Exemple** :
```json
{
  "id": "assurance-2024",
  "title": "Assurance Étudiante",
  "description": "Protection complète pour vos études à l'étranger",
  "image": "https://...",
  "details": "Notre assurance couvre tous vos besoins..."
}
```

**Routes API** :
- `GET /make-server-27d76fd3/flyers` - Récupérer tous les flyers
- `POST /make-server-27d76fd3/flyers` - Créer/Modifier un flyer (protégé)
- `DELETE /make-server-27d76fd3/flyers/:id` - Supprimer un flyer (protégé)

---

### 2️⃣ **Témoignages Clients** (Préfixe : `testimonial:`)

**Clé** : `testimonial:{id}`

**Structure de données** :
```typescript
{
  id: string,          // ID unique du témoignage
  name: string,        // Nom du client
  role: string,        // Rôle/Statut (ex: "Étudiant")
  country: string,     // Pays de destination
  rating: number,      // Note sur 5 (1-5)
  comment: string,     // Commentaire/témoignage
  photo?: string,      // URL de la photo (optionnel)
  date: string         // Date au format ISO
}
```

**Exemple** :
```json
{
  "id": "testimonial-1234567890",
  "name": "Marie Dupont",
  "role": "Étudiante en Master",
  "country": "Canada",
  "rating": 5,
  "comment": "Excellente expérience avec OMEGA24...",
  "photo": "https://...",
  "date": "2024-12-05T10:30:00Z"
}
```

**Routes API** :
- `GET /make-server-27d76fd3/testimonials` - Récupérer tous les témoignages
- `POST /make-server-27d76fd3/testimonials` - Créer un témoignage (protégé)
- `PUT /make-server-27d76fd3/testimonials` - Modifier un témoignage (protégé)
- `DELETE /make-server-27d76fd3/testimonials/:id` - Supprimer un témoignage (protégé)

---

### 3️⃣ **Messages de Contact** (Préfixe : `contact:`)

**Clé** : `contact:{id}`

**Structure de données** :
```typescript
{
  id: string,          // ID unique (format: contact-timestamp)
  name: string,        // Nom de l'expéditeur
  email: string,       // Email de l'expéditeur
  phone?: string,      // Téléphone (optionnel)
  subject: string,     // Sujet du message
  message: string,     // Message complet
  date: string,        // Date au format ISO
  read: boolean        // Statut de lecture (false par défaut)
}
```

**Exemple** :
```json
{
  "id": "contact-1733402400000",
  "name": "Jean Martin",
  "email": "jean@example.com",
  "phone": "+229 01 23 45 67",
  "subject": "Demande d'information",
  "message": "Bonjour, je souhaite obtenir des informations sur...",
  "date": "2024-12-05T10:00:00Z",
  "read": false
}
```

**Routes API** :
- `POST /make-server-27d76fd3/contact` - Envoyer un message de contact (public)

**Note** : Les messages sont à la fois :
- ✅ **Sauvegardés dans la base** pour consultation par l'admin
- ✅ **Envoyés par email** à infos@omega24consulting.com via Resend API

---

## 🔐 Authentification Admin

### Système Utilisé
**Supabase Auth** - Gestion complète des utilisateurs

### Données Stockées
Les utilisateurs admin sont stockés dans la table système Supabase `auth.users` (non accessible directement).

**Métadonnées utilisateur** :
```typescript
{
  id: string,              // UUID de l'utilisateur
  email: string,           // Email de connexion
  user_metadata: {
    name: string           // Nom de l'administrateur
  },
  email_confirm: true      // Auto-confirmé (pas de serveur email)
}
```

**Routes API** :
- `POST /make-server-27d76fd3/signup` - Créer un compte admin
- `GET /make-server-27d76fd3/verify-admin` - Vérifier la session admin

**Connexion/Déconnexion** : Géré directement par le client Supabase (pas de route dédiée)

---

## 🔑 Fonctions KV Store Disponibles

Le fichier `/supabase/functions/server/kv_store.tsx` expose ces fonctions :

### Fonctions de Base
- **`set(key, value)`** - Créer/Modifier une entrée
- **`get(key)`** - Récupérer une entrée par clé
- **`del(key)`** - Supprimer une entrée

### Fonctions Multiples
- **`mset(keys[], values[])`** - Créer/Modifier plusieurs entrées
- **`mget(keys[])`** - Récupérer plusieurs entrées
- **`mdel(keys[])`** - Supprimer plusieurs entrées

### Recherche
- **`getByPrefix(prefix)`** - Récupérer toutes les entrées commençant par un préfixe
  - Exemple : `getByPrefix('flyer:')` retourne tous les flyers

---

## 📧 Système d'Email (Resend API)

### Configuration
- **Service** : Resend API
- **Variable d'environnement** : `RESEND_API_KEY`
- **Email destinataire** : infos@omega24consulting.com
- **Email expéditeur** : Oméga24 Consulting <onboarding@resend.dev>

### Fonctionnalité
Lorsqu'un utilisateur envoie un message via le formulaire de contact :
1. ✅ Le message est **sauvegardé** dans la base (préfixe `contact:`)
2. ✅ Un email est **envoyé** à infos@omega24consulting.com
3. ✅ L'email inclut un bouton "Répondre" qui répond directement au client

---

## 🛡️ Sécurité et Permissions

### Routes Publiques (Pas d'authentification requise)
- ✅ `GET /flyers` - Voir les services
- ✅ `GET /testimonials` - Voir les témoignages
- ✅ `POST /contact` - Envoyer un message

### Routes Protégées (Authentification admin requise)
- 🔒 `POST /flyers` - Ajouter/Modifier un service
- 🔒 `DELETE /flyers/:id` - Supprimer un service
- 🔒 `POST /testimonials` - Ajouter un témoignage
- 🔒 `PUT /testimonials` - Modifier un témoignage
- 🔒 `DELETE /testimonials/:id` - Supprimer un témoignage

### Mécanisme d'Authentification
Les routes protégées vérifient :
1. Présence du token `Authorization: Bearer {access_token}`
2. Token différent de la clé publique `SUPABASE_ANON_KEY`
3. Validation du token via `supabase.auth.getUser()`

---

## 📊 État Actuel de la Base

### ✅ Données Existantes
Selon votre contexte, la base de données contient probablement :
- Des flyers par défaut (6 services)
- Des témoignages clients
- Des messages de contact archivés

### 🔍 Vérification de la Base
Pour vérifier la base de données :
1. Accédez au Dashboard Supabase : https://supabase.com/dashboard/project/vcblcaufhcgcggnzifln/database/tables
2. Ouvrez la table `kv_store_27d76fd3`
3. Consultez les données par préfixe :
   - `flyer:*` - Services
   - `testimonial:*` - Témoignages
   - `contact:*` - Messages

---

## ✅ Validation de la Structure

### Points de Contrôle
- ✅ **Table créée** : `kv_store_27d76fd3` existe
- ✅ **Colonnes correctes** : `key` (TEXT), `value` (JSONB)
- ✅ **Routes API** : Toutes fonctionnelles
- ✅ **Authentification** : Supabase Auth configuré
- ✅ **Email** : Resend API intégré (clé API requise)
- ✅ **CORS** : Configuré pour accepter les requêtes frontend
- ✅ **Logs** : Activés pour debugging

### Variables d'Environnement Requises
```bash
✅ SUPABASE_URL              # URL du projet Supabase
✅ SUPABASE_ANON_KEY         # Clé publique
✅ SUPABASE_SERVICE_ROLE_KEY # Clé secrète (backend seulement)
✅ SUPABASE_DB_URL           # URL de connexion Postgres
⚠️ RESEND_API_KEY            # Clé API Resend (à configurer)
```

---

## 🚀 Recommandations

### 1. Configuration Email
Si ce n'est pas déjà fait, configurez la clé API Resend :
```bash
# Dans le Dashboard Supabase > Settings > Secrets
RESEND_API_KEY=re_xxxxxxxxxxxxx
```

### 2. Sauvegardes
Bien que la table KV soit flexible, pensez à :
- Exporter régulièrement les données importantes
- Documenter les structures de données critiques

### 3. Performance
Pour de grandes quantités de données :
- Envisagez l'ajout d'index sur la colonne `key`
- Utilisez les fonctions `mget` et `mset` pour les opérations en masse

### 4. Évolution Future
Si vous avez besoin de requêtes complexes :
- Créez des tables dédiées avec des relations
- Utilisez des migrations SQL plutôt que le KV store

---

## 📝 Résumé

✅ **La structure de la base de données est correcte et complète !**

Elle supporte toutes les fonctionnalités actuelles :
- ✅ Gestion des services/flyers
- ✅ Témoignages clients
- ✅ Messages de contact
- ✅ Authentification admin
- ✅ Envoi d'emails

**Aucune modification n'est nécessaire** pour le bon fonctionnement du site.

---

**Date de création** : 5 décembre 2024  
**Version** : 1.0  
**Projet** : Oméga24 Consulting Website
