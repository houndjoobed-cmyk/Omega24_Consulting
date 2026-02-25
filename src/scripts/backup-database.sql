-- ========================================
-- SCRIPT DE SAUVEGARDE (BACKUP)
-- Oméga24 Consulting
-- ========================================
-- 
-- Ce script crée une copie de sauvegarde de toutes les données
-- avant de faire une réinitialisation
-- 
-- Comment utiliser :
-- 1. Exécuter ce script d'abord
-- 2. Copier tous les résultats affichés
-- 3. Sauvegarder dans un fichier texte
-- 4. Ensuite, vous pouvez faire la réinitialisation
-- ========================================

-- Exporter toutes les données en format JSON
SELECT 
  key,
  value,
  'INSERT INTO kv_store_27d76fd3 (key, value) VALUES (' || 
  quote_literal(key) || ', ' || 
  quote_literal(value::text) || '::jsonb);' as restore_command
FROM kv_store_27d76fd3
ORDER BY key;

-- Statistiques
SELECT 
  '-- STATISTIQUES DU BACKUP' as info,
  COUNT(*) as total_entries,
  COUNT(*) FILTER (WHERE key LIKE 'flyer:%') as flyers,
  COUNT(*) FILTER (WHERE key LIKE 'testimonial:%') as testimonials,
  COUNT(*) FILTER (WHERE key LIKE 'contact:%') as contacts,
  NOW() as backup_date
FROM kv_store_27d76fd3;
