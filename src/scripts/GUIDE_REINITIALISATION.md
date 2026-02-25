# 🔄 GUIDE DE RÉINITIALISATION DE LA BASE DE DONNÉES

## 📋 Options Disponibles

### Option 1 : Réinitialisation Complète (Recommandé)
Supprime toutes les données et réinsère les flyers et témoignages par défaut.
- ✅ 3 flyers (Assurance, Billeterie, Localisation)
- ✅ 3 témoignages d'exemple
- ✅ Base de données propre avec données de démo

**Fichier :** `reset-database.sql`

### Option 2 : Nettoyage Complet
Supprime TOUT sans rien réinsérer.
- ⚠️ Table complètement vide
- Utile pour repartir à zéro

**Fichier :** `clear-database.sql`

### Option 3 : Sauvegarde Avant Réinitialisation
Crée un backup de vos données actuelles avant de réinitialiser.
- 💾 Sauvegarde toutes les données
- Peut être restauré plus tard

**Fichier :** `backup-database.sql`

---

## 🚀 Méthode 1 : Via Supabase Dashboard (Facile)

### Étape 1 : Faire un Backup (Optionnel mais Recommandé)

1. **Aller sur Supabase Dashboard :**
   - URL : https://supabase.com/dashboard/project/vcblcaufhcgcggnzifln
   - Se connecter

2. **Ouvrir SQL Editor :**
   - Menu de gauche : `SQL Editor`
   - Cliquer `New Query`

3. **Copier le script de backup :**
   - Ouvrir `/scripts/backup-database.sql`
   - Copier tout le contenu
   - Coller dans SQL Editor

4. **Exécuter :**
   - Cliquer `Run` (ou Ctrl + Enter)
   - Copier tous les résultats affichés
   - Sauvegarder dans un fichier texte sur votre PC
   - Nommer : `backup_omega24_[DATE].txt`

### Étape 2 : Réinitialiser la Base

1. **Nouvelle Query dans SQL Editor :**
   - Cliquer `New Query`

2. **Copier le script de réinitialisation :**
   - Ouvrir `/scripts/reset-database.sql`
   - Copier tout le contenu
   - Coller dans SQL Editor

3. **Exécuter :**
   - Cliquer `Run`
   - ⏳ Attendre quelques secondes

4. **Vérifier les résultats :**
   ```
   ✅ nombre_flyers: 3
   ✅ nombre_testimonials: 3
   ✅ total: 6
   ```

### Étape 3 : Vérifier sur le Site

1. Ouvrir le site : http://localhost:5173/ (ou version en ligne)
2. Rafraîchir la page (F5 ou Ctrl + R)
3. Vérifier :
   - Section Services : 3 affiches par défaut
   - Section Témoignages : 3 témoignages
4. ✅ La base est réinitialisée !

---

## 💻 Méthode 2 : Via Supabase CLI (Avancé)

### Prérequis
```bash
# Installer Supabase CLI
npm install -g supabase

# Se connecter
supabase login

# Lier le projet
supabase link --project-ref vcblcaufhcgcggnzifln
```

### Étape 1 : Backup

```bash
# Export complet
supabase db dump -f backup_$(date +%Y%m%d).sql

# Vérifier
ls -lh backup_*.sql
```

### Étape 2 : Réinitialiser

```bash
# Exécuter le script de réinitialisation
supabase db execute -f scripts/reset-database.sql

# Ou nettoyage complet
supabase db execute -f scripts/clear-database.sql
```

### Étape 3 : Vérifier

```bash
# Compter les entrées
supabase db execute -c "SELECT COUNT(*) FROM kv_store_27d76fd3;"

# Voir les flyers
supabase db execute -c "SELECT key, value->>'title' FROM kv_store_27d76fd3 WHERE key LIKE 'flyer:%';"
```

---

## 🔧 Méthode 3 : Via l'API (Programmation)

### Créer un Endpoint de Réinitialisation (Admin)

Ajouter dans `/supabase/functions/server/index.tsx` :

```typescript
// Endpoint de réinitialisation (ADMIN ONLY)
app.post('/make-server-27d76fd3/reset-database', async (c) => {
  try {
    // Vérifier authentification admin
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    if (!accessToken || accessToken === Deno.env.get('SUPABASE_ANON_KEY')) {
      return c.json({ error: 'Authentification admin requise' }, 401);
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !user?.id) {
      return c.json({ error: 'Session invalide' }, 401);
    }

    // Supprimer toutes les données
    await kv.mdel(
      (await kv.getByPrefix('')).map(item => item.key)
    );

    // Réinsérer les flyers par défaut
    const defaultFlyers = [
      {
        id: '1',
        title: 'Services d\'Assurance',
        description: 'Oméga24 Consulting, votre partenaire de proximité pour tous vos besoins en assurance.',
        image: 'figma:asset/68477f6f95a84425423fe12251a74d2fd17f1ce2.png',
        details: [
          'Assurance Santé & Vie',
          'Assurance Voyage',
          'Assurance Auto et Moto',
          'Assurance Multirisque Habitation',
          'Assurance à Responsabilité Civile Scolaire'
        ]
      },
      {
        id: '2',
        title: 'Service de Billeterie',
        description: 'Offres en OR avec les meilleures compagnies aériennes.',
        image: 'figma:asset/c57cb368d0fcbe717e89feafe155bc280d522dc2.png',
        details: [
          'Congo Airways', 'Qatar Airways', 'Ethiopian Airlines',
          'Brussels Airlines', 'Air France', 'Turkish Airlines'
        ]
      },
      {
        id: '3',
        title: 'Où Sommes-Nous',
        description: 'Notre siège social à Gbèdjromèdé.',
        image: 'figma:asset/1ea55cc09f74c36daa5ac5718db259bf90a61dae.png',
        details: [
          'Adresse : Gbèdjromèdé',
          'Téléphone : +229 01 41 312 222',
          'Email : infos@omega24consulting.com'
        ]
      }
    ];

    for (const flyer of defaultFlyers) {
      await kv.set(`flyer:${flyer.id}`, flyer);
    }

    return c.json({ 
      success: true, 
      message: 'Base de données réinitialisée',
      flyers: defaultFlyers.length 
    });

  } catch (error: any) {
    console.error('Reset error:', error);
    return c.json({ error: error.message }, 500);
  }
});
```

### Utiliser l'Endpoint

```bash
# Avec curl
curl -X POST https://vcblcaufhcgcggnzifln.supabase.co/functions/v1/make-server-27d76fd3/reset-database \
  -H "Authorization: Bearer VOTRE_TOKEN_ADMIN" \
  -H "Content-Type: application/json"

# Réponse attendue :
# {"success": true, "message": "Base de données réinitialisée", "flyers": 3}
```

---

## 📊 Vérification des Données

### Via SQL Editor

```sql
-- Voir tout le contenu
SELECT 
  key,
  value->>'title' as titre,
  value->>'name' as nom,
  jsonb_pretty(value) as contenu
FROM kv_store_27d76fd3
ORDER BY key;

-- Statistiques
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE key LIKE 'flyer:%') as flyers,
  COUNT(*) FILTER (WHERE key LIKE 'testimonial:%') as testimonials,
  COUNT(*) FILTER (WHERE key LIKE 'contact:%') as contacts
FROM kv_store_27d76fd3;
```

### Via l'Application

1. Ouvrir le site web
2. Section Services : Vérifier les 3 affiches
3. Section Témoignages : Vérifier les 3 témoignages
4. Tester l'ajout d'une nouvelle affiche (si admin connecté)

---

## 🆘 Résolution de Problèmes

### Problème : "Permission denied" lors de l'exécution SQL

**Cause :** Vous n'avez pas les droits d'écriture

**Solution :**
1. Vérifier que vous êtes connecté comme Owner du projet
2. Ou utiliser Service Role Key (dans Settings > API)
3. Désactiver temporairement RLS :
   ```sql
   ALTER TABLE kv_store_27d76fd3 DISABLE ROW LEVEL SECURITY;
   -- Exécuter votre script
   ALTER TABLE kv_store_27d76fd3 ENABLE ROW LEVEL SECURITY;
   ```

### Problème : Les données ne s'affichent pas sur le site

**Cause :** Cache du navigateur ou erreur API

**Solution :**
1. Vider le cache : Ctrl + Shift + R (ou Cmd + Shift + R sur Mac)
2. Ouvrir la console (F12) et vérifier les erreurs
3. Vérifier dans l'onglet Network que l'API retourne les données
4. Redémarrer le serveur de dev : `npm run dev`

### Problème : Erreur "kv_store_27d76fd3 does not exist"

**Cause :** La table n'existe pas (projet différent ?)

**Solution :**
1. Vérifier le nom de la table dans Database > Tables
2. Créer la table si elle n'existe pas :
   ```sql
   CREATE TABLE kv_store_27d76fd3 (
     key TEXT NOT NULL PRIMARY KEY,
     value JSONB NOT NULL
   );
   ```

---

## 📦 Restauration depuis un Backup

Si vous avez fait un backup et voulez restaurer :

### Méthode 1 : Copier-Coller les Commandes

1. Ouvrir votre fichier de backup
2. Copier toutes les lignes `INSERT INTO kv_store_27d76fd3...`
3. SQL Editor > New Query
4. Coller et exécuter

### Méthode 2 : Via CLI

```bash
# Restaurer depuis un fichier SQL
supabase db execute -f backup_20241126.sql
```

---

## ⚠️ Avertissements Importants

### 🚨 AVANT de Réinitialiser en Production

1. **TOUJOURS faire un backup complet**
2. **Informer les utilisateurs** si le site est déjà en ligne
3. **Choisir une heure creuse** (la nuit par exemple)
4. **Tester sur un environnement de staging** d'abord

### 🔒 Sécurité

- Ne JAMAIS exposer l'endpoint de réinitialisation au public
- Toujours vérifier l'authentification admin
- Logger toutes les réinitialisations
- Conserver les backups pendant au moins 30 jours

---

## 📋 Checklist de Réinitialisation

- [ ] ✅ Backup créé et sauvegardé
- [ ] ✅ Script de réinitialisation choisi
- [ ] ✅ Exécution dans Supabase SQL Editor
- [ ] ✅ Vérification des données dans la table
- [ ] ✅ Rafraîchissement du site web
- [ ] ✅ Test de toutes les fonctionnalités
- [ ] ✅ Vérification des flyers affichés
- [ ] ✅ Vérification des témoignages affichés
- [ ] ✅ Test ajout/modification (si admin)

---

## 📞 Support

Si vous rencontrez des problèmes :
1. Consulter la section "Résolution de Problèmes"
2. Vérifier les logs Supabase (Dashboard > Logs)
3. Contacter : infos@omega24consulting.com

---

**Date :** 26 Novembre 2025  
**Version :** 1.0
