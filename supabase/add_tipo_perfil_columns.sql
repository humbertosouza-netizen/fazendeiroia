-- Adicionar colunas para tipo de perfil, CRECI e CPF à tabela usuarios existente
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS tipo_perfil TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS creci TEXT;
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS cpf TEXT;

-- Comentários nas colunas para documentação
COMMENT ON COLUMN usuarios.tipo_perfil IS 'Tipo de perfil do usuário: corretor, imobiliaria ou proprietario';
COMMENT ON COLUMN usuarios.creci IS 'Número de registro CRECI para corretores ou imobiliárias';
COMMENT ON COLUMN usuarios.cpf IS 'CPF para proprietários de imóveis'; 