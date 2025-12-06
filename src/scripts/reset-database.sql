-- ========================================
-- SCRIPT DE RÉINITIALISATION DE LA BASE DE DONNÉES
-- OMEGA24 CONSULTING
-- ========================================
-- 
-- Ce script permet de :
-- 1. Vider toutes les données de la table kv_store_27d76fd3
-- 2. Réinsérer les données par défaut (flyers)
-- 
-- ⚠️ ATTENTION : Cette action est IRRÉVERSIBLE !
-- Assurez-vous d'avoir un backup avant d'exécuter ce script.
-- 
-- Comment exécuter ce script :
-- 1. Aller sur Supabase Dashboard
-- 2. SQL Editor > New Query
-- 3. Copier-coller ce script
-- 4. Cliquer "Run"
-- ========================================

-- ÉTAPE 1 : Supprimer toutes les données
DELETE FROM kv_store_27d76fd3;

-- ÉTAPE 2 : Réinitialiser les flyers par défaut

-- Flyer 1 : Services d'Assurance
INSERT INTO kv_store_27d76fd3 (key, value) VALUES (
  'flyer:1',
  '{
    "id": "1",
    "title": "Services d''Assurance",
    "description": "OMEGA24 CONSULTING, votre partenaire de proximité pour tous vos besoins en assurance. Nous vous offrons une gamme complète de services d''assurance adaptés à vos besoins.",
    "image": "figma:asset/68477f6f95a84425423fe12251a74d2fd17f1ce2.png",
    "details": [
      "Assurance Santé & Vie - Protection complète pour vous et votre famille",
      "Assurance Voyage - Voyagez en toute sérénité",
      "Assurance Auto et Moto - Couverture optimale pour vos véhicules",
      "Assurance Multirisque Habitation - Protégez votre logement",
      "Assurance à Responsabilité Civile Scolaire - Sécurité pour vos enfants"
    ]
  }'::jsonb
);

-- Flyer 2 : Service de Billeterie
INSERT INTO kv_store_27d76fd3 (key, value) VALUES (
  'flyer:2',
  '{
    "id": "2",
    "title": "Service de Billeterie",
    "description": "Vous avez le visa mais le billet est cher pour vous ? Ne vous en faites pas pour votre billet. Nous avons des offres en OR avec les meilleures compagnies aériennes.",
    "image": "figma:asset/c57cb368d0fcbe717e89feafe155bc280d522dc2.png",
    "details": [
      "Tarifs compétitifs avec offres spéciales en OR",
      "Congo Airways - Vols vers l''Afrique Centrale",
      "Qatar Airways - Connexions mondiales",
      "Ethiopian Airlines - Premier transporteur africain",
      "Brussels Airlines - Vols vers l''Europe",
      "South African Airways - Réseau africain",
      "Singapore Airlines - Excellence asiatique",
      "Air France - Compagnie française de référence",
      "Turkish Airlines - Hub entre Europe et Asie",
      "Kenya Airways - The Pride of Africa",
      "Fly CAA - Vols régionaux"
    ]
  }'::jsonb
);

-- Flyer 3 : Où Sommes-Nous
INSERT INTO kv_store_27d76fd3 (key, value) VALUES (
  'flyer:3',
  '{
    "id": "3",
    "title": "Où Sommes-Nous",
    "description": "Retrouvez-nous facilement à notre siège social à Gbèdjromèdé. L''adresse du meilleur choix pour un avenir meilleur.",
    "image": "figma:asset/1ea55cc09f74c36daa5ac5718db259bf90a61dae.png",
    "details": [
      "Adresse : Gbèdjromèdé 2ème von à droite en quittant le carrefour 16 ampoules en allant vers le carrefour \"Vodafone\"",
      "Points de repère : Entre Carrefour Vodafone, Carrefour 16 ampoules, et Carrefour St Michel",
      "Téléphone : +229 01 41 312 222 / 01 90 574 242",
      "Email : omega24consulting@gmail.com",
      "Horaires : Lun-Ven 9h-18h, Sam 10h-16h"
    ]
  }'::jsonb
);

-- ÉTAPE 3 : Ajouter quelques témoignages d'exemple (optionnel)

INSERT INTO kv_store_27d76fd3 (key, value) VALUES (
  'testimonial:demo-1',
  '{
    "id": "demo-1",
    "name": "Marie Kouassi",
    "role": "Étudiante en Médecine",
    "country": "Canada",
    "rating": 5,
    "comment": "Grâce à OMEGA24 CONSULTING, j''ai pu réaliser mon rêve d''étudier la médecine au Canada. L''équipe a été très professionnelle et m''a accompagnée à chaque étape de mon projet.",
    "photo": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    "date": "2024-11-15T10:00:00Z"
  }'::jsonb
);

INSERT INTO kv_store_27d76fd3 (key, value) VALUES (
  'testimonial:demo-2',
  '{
    "id": "demo-2",
    "name": "Jean-Paul Mensah",
    "role": "Étudiant en Ingénierie",
    "country": "France",
    "rating": 5,
    "comment": "Service exceptionnel ! J''ai obtenu mon admission en école d''ingénieurs en France en moins de 3 mois. Je recommande vivement OMEGA24 CONSULTING.",
    "photo": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    "date": "2024-11-10T14:30:00Z"
  }'::jsonb
);

INSERT INTO kv_store_27d76fd3 (key, value) VALUES (
  'testimonial:demo-3',
  '{
    "id": "demo-3",
    "name": "Fatima Diallo",
    "role": "Étudiante en Commerce",
    "country": "Belgique",
    "rating": 5,
    "comment": "OMEGA24 m''a aidée non seulement pour l''admission universitaire, mais aussi pour trouver un logement et obtenir mon visa. Un accompagnement complet !",
    "photo": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
    "date": "2024-11-05T09:15:00Z"
  }'::jsonb
);

-- ========================================
-- VÉRIFICATION
-- ========================================

-- Compter les éléments insérés
SELECT 
  COUNT(*) FILTER (WHERE key LIKE 'flyer:%') as nombre_flyers,
  COUNT(*) FILTER (WHERE key LIKE 'testimonial:%') as nombre_testimonials,
  COUNT(*) as total
FROM kv_store_27d76fd3;

-- Afficher tous les éléments
SELECT 
  key, 
  value->>'title' as titre,
  value->>'name' as nom
FROM kv_store_27d76fd3
ORDER BY key;

-- ========================================
-- RÉSULTAT ATTENDU :
-- - 3 flyers (Services d'Assurance, Billeterie, Localisation)
-- - 3 témoignages (Marie, Jean-Paul, Fatima)
-- - Total : 6 entrées
-- ========================================
