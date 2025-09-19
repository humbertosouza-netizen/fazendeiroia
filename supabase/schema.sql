-- Tabela para armazenar anúncios básicos
CREATE TABLE anuncios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  categoria TEXT NOT NULL,
  preco TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Ativo',
  visualizacoes INTEGER NOT NULL DEFAULT 0,
  dataPublicacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Função para atualizar o campo updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar updated_at quando o registro for modificado
CREATE TRIGGER update_anuncios_updated_at
BEFORE UPDATE ON anuncios
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela para armazenar detalhes específicos de fazendas
CREATE TABLE fazenda_detalhes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
  estado TEXT NOT NULL,
  regiao TEXT,
  finalidade TEXT,
  area NUMERIC(10,2),
  cidade TEXT,
  distancia NUMERIC(10,2),
  acesso TEXT,
  coordenadas TEXT,
  recurso_hidrico TEXT,
  energia TEXT,
  tipo_solo TEXT,
  documentacao TEXT,
  estruturas TEXT[], -- Array de estruturas selecionadas
  area_aberta NUMERIC(10,2),
  area_reserva NUMERIC(10,2),
  capacidade_pasto TEXT,
  topografia TEXT,
  descricao TEXT,
  tipo_oferta TEXT NOT NULL,
  periodo_arrendamento TEXT,
  valor_arrendamento NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger para atualizar updated_at quando o registro for modificado
CREATE TRIGGER update_fazenda_detalhes_updated_at
BEFORE UPDATE ON fazenda_detalhes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Tabela para armazenar imagens de anúncios
CREATE TABLE anuncio_imagens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  ordem INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas de segurança RLS (Row Level Security)

-- Habilitar RLS nas tabelas
ALTER TABLE anuncios ENABLE ROW LEVEL SECURITY;
ALTER TABLE fazenda_detalhes ENABLE ROW LEVEL SECURITY;
ALTER TABLE anuncio_imagens ENABLE ROW LEVEL SECURITY;

-- Políticas para a tabela anuncios
CREATE POLICY "Usuários podem ver todos os anúncios"
ON anuncios FOR SELECT
USING (true);

CREATE POLICY "Usuários só podem inserir seus próprios anúncios"
ON anuncios FOR INSERT
WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Usuários só podem atualizar seus próprios anúncios"
ON anuncios FOR UPDATE
USING (auth.uid() = usuario_id);

CREATE POLICY "Usuários só podem excluir seus próprios anúncios"
ON anuncios FOR DELETE
USING (auth.uid() = usuario_id);

-- Políticas para a tabela fazenda_detalhes
CREATE POLICY "Qualquer pessoa pode ver detalhes de fazendas"
ON fazenda_detalhes FOR SELECT
USING (true);

CREATE POLICY "Usuários podem inserir detalhes para seus anúncios"
ON fazenda_detalhes FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM anuncios
    WHERE anuncios.id = fazenda_detalhes.anuncio_id
    AND anuncios.usuario_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem atualizar detalhes de seus anúncios"
ON fazenda_detalhes FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM anuncios
    WHERE anuncios.id = fazenda_detalhes.anuncio_id
    AND anuncios.usuario_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem excluir detalhes de seus anúncios"
ON fazenda_detalhes FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM anuncios
    WHERE anuncios.id = fazenda_detalhes.anuncio_id
    AND anuncios.usuario_id = auth.uid()
  )
);

-- Políticas para a tabela anuncio_imagens
CREATE POLICY "Qualquer pessoa pode ver imagens de anúncios"
ON anuncio_imagens FOR SELECT
USING (true);

CREATE POLICY "Usuários podem inserir imagens para seus anúncios"
ON anuncio_imagens FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM anuncios
    WHERE anuncios.id = anuncio_imagens.anuncio_id
    AND anuncios.usuario_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem atualizar imagens de seus anúncios"
ON anuncio_imagens FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM anuncios
    WHERE anuncios.id = anuncio_imagens.anuncio_id
    AND anuncios.usuario_id = auth.uid()
  )
);

CREATE POLICY "Usuários podem excluir imagens de seus anúncios"
ON anuncio_imagens FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM anuncios
    WHERE anuncios.id = anuncio_imagens.anuncio_id
    AND anuncios.usuario_id = auth.uid()
  )
); 