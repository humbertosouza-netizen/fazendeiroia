-- Script para desabilitar RLS na tabela anuncio_imagens
-- Execute este script no Supabase SQL Editor

-- Desabilitar RLS na tabela anuncio_imagens
ALTER TABLE anuncio_imagens DISABLE ROW LEVEL SECURITY;

-- Verificar se foi desabilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'anuncio_imagens';
