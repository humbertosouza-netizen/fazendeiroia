-- Schema para tabelas do banco de dados Supabase

-- Tabela de visualizações
CREATE TABLE IF NOT EXISTS visualizacoes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
  data_visualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_usuario TEXT,
  sessao_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para tabela de visualizações
CREATE INDEX IF NOT EXISTS idx_visualizacoes_anuncio_id ON visualizacoes(anuncio_id);
CREATE INDEX IF NOT EXISTS idx_visualizacoes_data ON visualizacoes(data_visualizacao);

-- Tabela de leads
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  anuncio_id UUID NOT NULL REFERENCES anuncios(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT,
  mensagem TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'novo',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para tabela de leads
CREATE INDEX IF NOT EXISTS idx_leads_anuncio_id ON leads(anuncio_id);
CREATE INDEX IF NOT EXISTS idx_leads_data ON leads(data_criacao);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);

-- Trigger para atualizar campo updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE PROCEDURE update_updated_at_column();

-- Função para incrementar visualizações de um anúncio
CREATE OR REPLACE FUNCTION increment_anuncio_visualizacao()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE anuncios
  SET visualizacoes = COALESCE(visualizacoes, 0) + 1
  WHERE id = NEW.anuncio_id;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger para incrementar visualizações automaticamente
CREATE TRIGGER increment_anuncio_visualizacao_trigger
AFTER INSERT ON visualizacoes
FOR EACH ROW
EXECUTE PROCEDURE increment_anuncio_visualizacao(); 