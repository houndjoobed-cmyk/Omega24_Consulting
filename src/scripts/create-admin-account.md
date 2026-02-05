# 👤 CRÉER UN COMPTE ADMINISTRATEUR

## 🔴 Problème : "Invalid login credentials"

Cette erreur apparaît parce qu'**aucun compte admin n'a encore été créé** dans votre base Supabase.

---

## ✅ Solution Rapide (Méthode 1 : Via Supabase Dashboard)

### Étape 1 : Aller sur Supabase

1. Ouvrir : https://supabase.com/dashboard/project/vcblcaufhcgcggnzifln
2. Se connecter avec votre compte Supabase

### Étape 2 : Créer un Utilisateur

1. **Menu de gauche :** Cliquer sur `Authentication` (🔐)
2. **Onglet :** `Users`
3. **Bouton vert :** Cliquer sur `Add User` (en haut à droite)
4. **Sélectionner :** `Create New User`

### Étape 3 : Remplir les Informations

**Formulaire à remplir :**

```
Email Address: admin@omega24consulting.com
Password: [Choisir un mot de passe fort]
```

**⚠️ IMPORTANT - Mot de passe fort :**
- Minimum 8 caractères (recommandé 12+)
- Majuscules + minuscules
- Chiffres
- Caractères spéciaux (@, #, $, %)

**Exemple :** `Omega24Admin@2025!`

### Étape 4 : Confirmer l'Email Automatiquement

1. **Cocher :** `Auto Confirm User` ✅
   - Cela évite d'avoir à confirmer l'email manuellement
2. **Cliquer :** `Create User`

### Étape 5 : Vérifier la Création

Vous devriez voir l'utilisateur apparaître dans la liste :
```
✅ admin@omega24consulting.com
   Status: Confirmed
   Created: Just now
```

### Étape 6 : Se Connecter au Site

1. Ouvrir votre site : http://localhost:5173/
2. Cliquer sur `Espace Admin` (en haut à droite)
3. Entrer :
   - Email : `admin@omega24consulting.com`
   - Mot de passe : Celui que vous avez créé
4. Cliquer `Se connecter`
5. ✅ Vous êtes maintenant connecté !

---

## 🔧 Solution Alternative (Méthode 2 : Via SQL)

### Étape 1 : Ouvrir SQL Editor

1. Dashboard Supabase > `SQL Editor`
2. Cliquer `New Query`

### Étape 2 : Exécuter ce Script

```sql
-- Créer un compte admin
-- ⚠️ REMPLACER l'email et le mot de passe !

SELECT auth.signup(
  json_build_object(
    'email', 'admin@omega24consulting.com',
    'password', 'VotreMotDePasseSecurisé123!',
    'email_confirm', true
  )::jsonb
);

-- Vérifier la création
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 1;
```

### Étape 3 : Remplacer les Valeurs

**Avant d'exécuter, modifiez :**
- `admin@omega24consulting.com` → Votre email
- `VotreMotDePasseSecurisé123!` → Votre mot de passe

### Étape 4 : Exécuter

1. Cliquer `Run` (ou Ctrl + Enter)
2. Vérifier dans les résultats que l'email est confirmé

---

## 🌐 Solution Avancée (Méthode 3 : Via l'API)

### Utiliser Postman ou curl

```bash
curl -X POST https://vcblcaufhcgcggnzifln.supabase.co/functions/v1/make-server-27d76fd3/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@omega24consulting.com",
    "password": "VotreMotDePasseSecurisé123!",
    "name": "Administrateur Principal"
  }'
```

**Réponse attendue :**
```json
{
  "success": true,
  "user": {
    "id": "uuid-xxx-xxx",
    "email": "admin@omega24consulting.com"
  }
}
```

---

## 🔍 Vérification

### Comment savoir si le compte est créé ?

#### Via Supabase Dashboard
1. Authentication > Users
2. Rechercher votre email
3. Vérifier que `email_confirmed_at` n'est PAS null

#### Via SQL
```sql
SELECT 
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@omega24consulting.com';
```

Résultat attendu :
```
email                          | email_confirmed_at      | created_at
admin@omega24consulting.com    | 2024-11-26 10:30:00    | 2024-11-26 10:30:00
```

---

## ❌ Erreurs Courantes

### Erreur : "User already registered"

**Cause :** Un compte avec cet email existe déjà

**Solution :**
1. Utiliser un autre email
2. Ou réinitialiser le mot de passe de l'email existant :
   ```sql
   -- Forcer un nouveau mot de passe
   UPDATE auth.users
   SET encrypted_password = crypt('NouveauMotDePasse123!', gen_salt('bf'))
   WHERE email = 'admin@omega24consulting.com';
   ```

### Erreur : "Password should be at least 6 characters"

**Cause :** Mot de passe trop court

**Solution :** Utiliser un mot de passe d'au moins 8 caractères (12+ recommandé)

### Erreur : "Email not confirmed"

**Cause :** L'email n'a pas été confirmé automatiquement

**Solution :**
```sql
-- Confirmer manuellement
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'admin@omega24consulting.com';
```

---

## 🔐 Sécurité du Mot de Passe

### ✅ BON Mot de Passe
```
Omega24Consulting@2025!
Admin#Omega24$Secure
MySecureP@ssw0rd2025!
```

### ❌ MAUVAIS Mot de Passe
```
123456
password
omega24
admin
```

### Générateur de Mot de Passe

Utiliser un de ces outils :
- **1Password :** https://1password.com/password-generator/
- **LastPass :** https://www.lastpass.com/features/password-generator
- **Bitwarden :** https://bitwarden.com/password-generator/

---

## 🔄 Réinitialiser le Mot de Passe

Si vous avez oublié votre mot de passe :

### Via Supabase Dashboard
1. Authentication > Users
2. Trouver votre utilisateur
3. Cliquer sur les `...` (menu)
4. Sélectionner `Send Password Reset Email`

### Via SQL
```sql
-- Définir un nouveau mot de passe directement
UPDATE auth.users
SET encrypted_password = crypt('NouveauMotDePasse123!', gen_salt('bf'))
WHERE email = 'admin@omega24consulting.com';
```

---

## 📊 Créer Plusieurs Comptes Admin

Si vous voulez créer plusieurs administrateurs :

```sql
-- Admin Principal
SELECT auth.signup(
  json_build_object(
    'email', 'admin@omega24consulting.com',
    'password', 'MotDePasse1!',
    'email_confirm', true
  )::jsonb
);

-- Admin Secondaire
SELECT auth.signup(
  json_build_object(
    'email', 'manager@omega24consulting.com',
    'password', 'MotDePasse2!',
    'email_confirm', true
  )::jsonb
);

-- Vérifier tous les admins
SELECT email, created_at FROM auth.users ORDER BY created_at DESC;
```

---

## 🎯 Checklist de Création

- [ ] ✅ Dashboard Supabase ouvert
- [ ] ✅ Menu Authentication > Users
- [ ] ✅ Clic sur "Add User"
- [ ] ✅ Email saisi (ex: admin@omega24consulting.com)
- [ ] ✅ Mot de passe fort créé (12+ caractères)
- [ ] ✅ Option "Auto Confirm User" cochée
- [ ] ✅ Utilisateur créé avec succès
- [ ] ✅ Email confirmé (email_confirmed_at rempli)
- [ ] ✅ Test de connexion sur le site effectué
- [ ] ✅ Connexion réussie !

---

## 📝 Sauvegarde des Identifiants

**⚠️ IMPORTANT :** Notez vos identifiants dans un endroit sûr !

```
=================================
COMPTE ADMIN OMEGA24 CONSULTING
=================================

Email: admin@omega24consulting.com
Mot de passe: [VOTRE_MOT_DE_PASSE]
Créé le: [DATE]

⚠️ Ne jamais partager ces identifiants
⚠️ Changer le mot de passe tous les 3 mois
=================================
```

**Recommandations :**
1. Utiliser un gestionnaire de mots de passe (1Password, Bitwarden)
2. Ne jamais envoyer le mot de passe par email
3. Changer régulièrement (tous les 3 mois)
4. Activer 2FA (authentification à deux facteurs) si possible

---

## 📞 Support

Si vous rencontrez toujours des problèmes :

1. Vérifier que le compte existe : Authentication > Users
2. Vérifier que l'email est confirmé
3. Essayer avec un autre navigateur (mode incognito)
4. Vider le cache : Ctrl + Shift + R
5. Consulter les logs : Supabase > Logs > Auth

---

## ✅ Après la Connexion

Une fois connecté, vous pourrez :

1. ✅ Ajouter/Modifier/Supprimer des affiches (Section Services)
2. ✅ Gérer les témoignages clients
3. ✅ Voir votre nom/email en haut à droite
4. ✅ Se déconnecter quand vous voulez

---

**Date :** 26 Novembre 2025  
**Version :** 1.0  
**Contact :** infos@omega24consulting.com
