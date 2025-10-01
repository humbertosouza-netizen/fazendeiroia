-- Script para verificar e ajustar políticas RLS
-- Execute este script no Supabase SQL Editor

-- Verificar políticas atuais da tabela anuncios
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'anuncios';

-- Verificar políticas da tabela anuncio_imagens
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'anuncio_imagens';

-- Verificar se RLS está habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename IN ('anuncios', 'anuncio_imagens');

-- Temporariamente desabilitar RLS para teste (CUIDADO: apenas para desenvolvimento)
-- ALTER TABLE anuncios DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE anuncio_imagens DISABLE ROW LEVEL SECURITY;
