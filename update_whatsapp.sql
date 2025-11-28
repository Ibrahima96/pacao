-- ============================================
-- Mise à jour du numéro WhatsApp
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor
-- pour mettre à jour le numéro WhatsApp
-- ============================================

UPDATE site_content 
SET value = '221779883924' 
WHERE key = 'whatsapp_number';
