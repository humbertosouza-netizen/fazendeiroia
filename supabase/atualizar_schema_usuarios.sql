-- Opção 1: Remover a restrição de chave estrangeira da tabela usuarios
-- ATENÇÃO: Isso deve ser usado apenas em ambiente de desenvolvimento/teste
-- Em produção, você deve manter a integridade referencial

-- Primeiro, remover a função que depende da tabela usuarios
DROP FUNCTION IF EXISTS get_all_usuarios();

-- Criar uma tabela temporária para preservar os dados
CREATE TABLE usuarios_temp AS SELECT * FROM usuarios;

-- Em seguida, eliminar a tabela original
DROP TABLE usuarios;

-- Recriar a tabela sem a restrição de chave estrangeira
CREATE TABLE usuarios (
  id UUID PRIMARY KEY, -- Removida a referência a auth.users
  nome TEXT NOT NULL,
  email TEXT,
  avatar_url TEXT,
  telefone TEXT,
  status TEXT DEFAULT 'Ativo',
  plano TEXT DEFAULT 'Básico',
  ultimo_acesso TIMESTAMP WITH TIME ZONE,
  data_cadastro TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Copiar os dados da tabela temporária
INSERT INTO usuarios SELECT * FROM usuarios_temp;

-- Eliminar a tabela temporária
DROP TABLE usuarios_temp;

-- Recriar as políticas RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer usuário veja todos os usuários
CREATE POLICY "Qualquer pessoa pode ver todos os usuários (desenvolvimento)"
ON usuarios FOR SELECT
USING (true);

-- Política para permitir que qualquer usuário crie usuários (para desenvolvimento)
CREATE POLICY "Permitir inserções sem autenticação (desenvolvimento)"
ON usuarios FOR INSERT
WITH CHECK (true);

-- Política para permitir atualizações (para desenvolvimento)
CREATE POLICY "Permitir atualizações sem autenticação (desenvolvimento)"
ON usuarios FOR UPDATE
USING (true);

-- Criar trigger para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Recriar a função get_all_usuarios
CREATE OR REPLACE FUNCTION get_all_usuarios()
RETURNS SETOF usuarios
LANGUAGE sql
SECURITY DEFINER -- Isso faz a função executar com as permissões do criador
AS $$
  SELECT * FROM usuarios ORDER BY nome;
$$;

-- Habilite acesso anônimo à função
GRANT EXECUTE ON FUNCTION get_all_usuarios TO anon;
GRANT EXECUTE ON FUNCTION get_all_usuarios TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_usuarios TO service_role; 