-- Script para verificar imagens do anúncio específico
-- Execute este script no Supabase SQL Editor

-- Verificar se existem imagens para o anúncio
SELECT 
  ai.*,
  a.titulo as anuncio_titulo
FROM anuncio_imagens ai
LEFT JOIN anuncios a ON a.id = ai.anuncio_id
WHERE ai.anuncio_id = '44b170fe-3b9e-45df-97ae-4008190544b6'
ORDER BY ai.ordem;

-- Verificar se o anúncio existe
SELECT 
  id,
  titulo,
  categoria,
  preco,
  status,
  created_at
FROM anuncios 
WHERE id = '44b170fe-3b9e-45df-97ae-4008190544b6';

-- Verificar todas as imagens na tabela
SELECT 
  ai.id,
  ai.anuncio_id,
  ai.url,
  ai.ordem,
  ai.created_at,
  a.titulo as anuncio_titulo
FROM anuncio_imagens ai
LEFT JOIN anuncios a ON a.id = ai.anuncio_id
ORDER BY ai.created_at DESC
LIMIT 10;

-- Verificar se o bucket 'anuncios' existe no storage
SELECT * FROM storage.buckets WHERE id = 'anuncios';
