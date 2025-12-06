-- ========================================
-- SCRIPT DE NETTOYAGE COMPLET
-- OMEGA24 CONSULTING
-- ========================================
-- 
-- Ce script SUPPRIME TOUTES LES DONNÉES sans réinsérer les valeurs par défaut
-- Utilisez ce script si vous voulez repartir de zéro
-- 
-- ⚠️ ATTENTION : Action IRRÉVERSIBLE !
-- ========================================

-- Supprimer TOUT le contenu de la table
DELETE FROM kv_store_27d76fd3;

-- Vérification
SELECT COUNT(*) as "Nombre d'éléments restants" FROM kv_store_27d76fd3;

-- Résultat attendu : 0
