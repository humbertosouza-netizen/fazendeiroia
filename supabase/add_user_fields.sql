-- Adicionar novos campos à tabela usuarios
-- Nome completo, relação com imóvel, telefone

-- Adicionar coluna nome_completo
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS nome_completo TEXT;

-- Adicionar coluna relacao_imovel (enum para as opções)
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS relacao_imovel TEXT;

-- Adicionar constraint para validar os valores permitidos
ALTER TABLE usuarios ADD CONSTRAINT check_relacao_imovel 
CHECK (relacao_imovel IN ('Corretor', 'Proprietario', 'Imobiliaria', 'Instituicao_financeira'));

-- Adicionar comentários para documentação
COMMENT ON COLUMN usuarios.nome_completo IS 'Nome completo do usuário';
COMMENT ON COLUMN usuarios.relacao_imovel IS 'Relação do usuário com imóveis: Corretor, Proprietario, Imobiliaria, Instituicao_financeira';

-- Atualizar registros existentes para ter valores padrão
UPDATE usuarios 
SET nome_completo = COALESCE(nome_completo, nome),
    relacao_imovel = COALESCE(relacao_imovel, 'Proprietario')
WHERE nome_completo IS NULL OR relacao_imovel IS NULL;

-- Tornar nome_completo obrigatório para novos registros
ALTER TABLE usuarios ALTER COLUMN nome_completo SET NOT NULL;
