# OMEGA 24 CONSULTING - Site Web

Site web professionnel pour l'agence de voyage OMEGA 24 CONSULTING.

## 🎨 Charte Graphique

### Couleurs Principales
- **Bleu Foncé**: `#002F6C` - Stabilité, confiance, professionnalisme
- **Bleu Clair**: `#4DA6FF` - Modernité, ouverture, technologie
- **Blanc**: `#FFFFFF` - Pureté, transparence, neutralité
- **Gris Clair**: `#F4F4F4` - Fond neutre

### Typographie
- **Police principale**: Times New Roman Bold (logo et titres)
- **Police secondaire**: Arial / Open Sans / Lato (textes courants)

## 📁 Structure du Projet

```
/
├── App.tsx                      # Composant principal
├── components/
│   ├── Header.tsx              # En-tête avec navigation
│   ├── Hero.tsx                # Section d'accueil
│   ├── Services.tsx            # Section services
│   ├── ServiceCard.tsx         # Carte de service individuelle
│   ├── ServiceEditor.tsx       # Modal d'édition/ajout de service
│   ├── About.tsx               # Section à propos
│   ├── Contact.tsx             # Section contact
│   └── Footer.tsx              # Pied de page
└── styles/
    └── globals.css             # Styles globaux
```

## ✨ Fonctionnalités

### 1. Navigation
- Menu responsive avec version mobile
- Scroll fluide vers les sections
- Logo OMEGA 24 CONSULTING

### 2. Section Héro
- Bannière d'accueil attractive
- Statistiques clés (destinations, clients, etc.)
- Boutons d'action

### 3. Gestion des Services
- **Affichage**: Grille de cartes de services
- **Ajout**: Bouton "Ajouter un service" ouvre un modal
- **Modification**: Cliquer sur l'icône d'édition (visible au survol)
- **Suppression**: Cliquer sur l'icône de suppression (avec confirmation)

#### Informations d'un service:
- Titre
- Description
- Image (URL)
- Prix (optionnel)
- Caractéristiques incluses (liste)

### 4. Section À Propos
- Présentation de l'agence
- Valeurs et mission
- Points forts (expertise, réseau, etc.)

### 5. Section Contact
- Formulaire de contact complet
- Informations de contact (téléphone, email, adresse)
- Horaires d'ouverture
- Toast de confirmation à l'envoi

### 6. Footer
- Informations de l'entreprise
- Liens rapides
- Réseaux sociaux
- Contact

## 🔧 Comment Modifier

### Ajouter un Service
1. Cliquer sur le bouton "Ajouter un service"
2. Remplir le formulaire:
   - Titre du service
   - Description
   - URL de l'image (utiliser Unsplash.com pour des images gratuites)
   - Prix (optionnel)
   - Caractéristiques (cliquer sur "Ajouter" pour plus de lignes)
3. Cliquer sur "Ajouter"

### Modifier un Service
1. Survoler une carte de service
2. Cliquer sur l'icône d'édition (crayon)
3. Modifier les informations
4. Cliquer sur "Mettre à jour"

### Supprimer un Service
1. Survoler une carte de service
2. Cliquer sur l'icône de suppression (poubelle)
3. Confirmer la suppression

### Personnaliser les Couleurs
Les couleurs sont utilisées de manière cohérente dans tout le site:
- `bg-[#002F6C]` : Arrière-plan bleu foncé
- `bg-[#4DA6FF]` : Arrière-plan bleu clair
- `text-[#002F6C]` : Texte bleu foncé
- `text-[#4DA6FF]` : Texte bleu clair
- `bg-[#F4F4F4]` : Arrière-plan gris clair

Pour changer une couleur globalement, utilisez la fonction de recherche et remplacement dans votre éditeur.

### Modifier le Contenu

#### Header
Fichier: `/components/Header.tsx`
- Modifier les liens de navigation
- Changer le logo

#### Hero
Fichier: `/components/Hero.tsx`
- Modifier le titre et la description
- Changer les statistiques (150+ destinations, 5000+ clients, etc.)
- Modifier l'image de fond

#### About
Fichier: `/components/About.tsx`
- Modifier la description de l'entreprise
- Changer les valeurs et la mission
- Modifier l'image

#### Contact
Fichier: `/components/Contact.tsx`
- Modifier les informations de contact (téléphone, email, adresse)
- Changer les horaires d'ouverture

#### Footer
Fichier: `/components/Footer.tsx`
- Modifier les liens et informations
- Changer les liens des réseaux sociaux

## 📝 Services par Défaut

Le site est livré avec 4 services exemples:
1. **Voyages d'Affaires** - Organisation complète de déplacements professionnels
2. **Séjours Balnéaires** - Packages tout compris vers les plus belles plages
3. **Circuits Touristiques** - Circuits organisés pour découvrir le monde
4. **Voyages sur Mesure** - Service de personnalisation complète

Ces services peuvent être modifiés ou supprimés via l'interface d'administration.

## 🎯 Conseils pour les Images

- Utiliser **Unsplash.com** pour des images de haute qualité gratuites
- Recherches suggérées:
  - "travel destination"
  - "beach resort"
  - "business travel"
  - "tourism"
  - "vacation"
- Format recommandé: 1920x1080px ou supérieur
- Taille optimale: moins de 500KB pour de meilleures performances

## 🚀 Prochaines Étapes Suggérées

1. **Base de données**: Connecter une base de données pour persister les services
2. **Authentification**: Ajouter une connexion admin pour protéger l'édition
3. **Formulaire de réservation**: Ajouter un système de réservation en ligne
4. **Galerie photos**: Créer une galerie de destinations
5. **Blog**: Ajouter une section blog/actualités
6. **Multilingue**: Ajouter support pour plusieurs langues
7. **Témoignages**: Ajouter une section avis clients

## 📞 Support

Pour toute question ou assistance, contactez l'équipe de développement.

---

**OMEGA 24 CONSULTING** - Votre partenaire voyage de confiance
