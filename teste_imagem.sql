-- Script para inserir uma imagem de teste diretamente no banco
-- Execute este script no Supabase SQL Editor

-- Inserir uma imagem de teste para o anúncio
INSERT INTO anuncio_imagens (anuncio_id, url, ordem)
VALUES (
  '44b170fe-3b9e-45df-97ae-4008190544b6',
  'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop',
  0
);

-- Verificar se foi inserida
SELECT * FROM anuncio_imagens 
WHERE anuncio_id = '44b170fe-3b9e-45df-97ae-4008190544b6'
ORDER BY ordem;
