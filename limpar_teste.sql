-- Script para limpar a imagem de teste e preparar para teste real
-- Execute este script no Supabase SQL Editor

-- Remover a imagem de teste
DELETE FROM anuncio_imagens 
WHERE anuncio_id = '44b170fe-3b9e-45df-97ae-4008190544b6';

-- Verificar se foi removida
SELECT * FROM anuncio_imagens 
WHERE anuncio_id = '44b170fe-3b9e-45df-97ae-4008190544b6';
