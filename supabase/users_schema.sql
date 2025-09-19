-- Tabela para armazenar informações adicionais de usuários
CREATE TABLE usuarios (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- Trigger para atualizar o campo updated_at automaticamente
CREATE TRIGGER update_usuarios_updated_at
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para permitir que qualquer usuário veja todos os usuários
-- Isso é para desenvolvimento, em produção você pode querer restringir
CREATE POLICY "Qualquer pessoa pode ver todos os usuários (desenvolvimento)"
ON usuarios FOR SELECT
USING (true);

-- Política para permitir que qualquer usuário veja seu próprio perfil
CREATE POLICY "Usuários podem ver seu próprio perfil"
ON usuarios FOR SELECT
USING (auth.uid() = id);

-- Política para permitir que administradores atualizem qualquer usuário
CREATE POLICY "Administradores podem atualizar qualquer usuário"
ON usuarios FOR UPDATE
USING (auth.uid() IN (
  SELECT id FROM auth.users WHERE role = 'admin'
));

-- Política para permitir que usuários atualizem seu próprio perfil
CREATE POLICY "Usuários podem atualizar seu próprio perfil"
ON usuarios FOR UPDATE
USING (auth.uid() = id);

-- Política para permitir inserções sem autenticação (para desenvolvimento)
CREATE POLICY "Permitir inserções sem autenticação (desenvolvimento)"
ON usuarios FOR INSERT
WITH CHECK (true);

-- Função para atualizar o último acesso do usuário
CREATE OR REPLACE FUNCTION update_ultimo_acesso()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE usuarios
  SET ultimo_acesso = NOW()
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 