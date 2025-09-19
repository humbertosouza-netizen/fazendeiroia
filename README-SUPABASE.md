# Configuração do Supabase para o Sistema de Anúncios

Este documento contém instruções para configurar o Supabase para o sistema de anúncios de fazendas.

## 1. Criando um Projeto no Supabase

1. Acesse [https://supabase.com/](https://supabase.com/) e faça login ou crie uma conta
2. Clique em "New Project" e configure seu projeto:
   - Nome do projeto: `nome-do-seu-projeto`
   - Senha do banco de dados: Crie uma senha forte
   - Região: Escolha a mais próxima geograficamente
3. Clique em "Create project" e aguarde a criação do projeto

## 2. Configurando as Tabelas no Supabase

Você pode configurar as tabelas de duas maneiras:

### Opção 1: Usando o Editor SQL

1. No dashboard do Supabase, vá para "SQL Editor"
2. Clique em "New Query"
3. Cole o conteúdo do arquivo `supabase/schema.sql` deste projeto
4. Clique em "Run" para executar o script

### Opção 2: Usando a Interface Table Editor

1. No dashboard do Supabase, vá para "Table Editor"
2. Crie manualmente cada tabela seguindo a estrutura definida no arquivo `supabase/schema.sql`

## 3. Configurando a Autenticação

1. No dashboard do Supabase, vá para "Authentication" > "Providers"
2. Habilite o provedor "Email" e configure de acordo com suas necessidades
3. Opcionalmente, habilite outros provedores de autenticação (Google, Facebook, etc.)

## 4. Configurando Armazenamento para Imagens

1. No dashboard do Supabase, vá para "Storage"
2. Crie um novo bucket chamado `anuncios-imagens`
3. Configure as políticas de acesso:
   - **Políticas para leitura pública**: Todos podem visualizar as imagens
   - **Políticas para escrita**: Apenas usuários autenticados podem fazer upload

## 5. Configurando o Projeto React

1. No dashboard do Supabase, vá para "Settings" > "API"
2. Obtenha o "Project URL" e a "anon public" key
3. Crie um arquivo `.env.local` na raiz do projeto com o seguinte conteúdo:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_projeto
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_public
```

## 6. Verificando a Configuração

Para verificar se a configuração está correta:

1. Execute a aplicação com `npm run dev`
2. Crie uma conta de usuário
3. Tente criar um anúncio de fazenda
4. Verifique se os dados estão sendo salvos corretamente no Supabase

## 7. Estrutura das Tabelas

### Tabela `anuncios`
Armazena as informações básicas dos anúncios:
- `id`: Identificador único do anúncio
- `usuario_id`: ID do usuário que criou o anúncio
- `titulo`: Título do anúncio
- `categoria`: Categoria do anúncio
- `preco`: Preço do imóvel
- `status`: Status do anúncio (Ativo, Pausado, Vendido)
- `visualizacoes`: Contador de visualizações
- `dataPublicacao`: Data de publicação do anúncio

### Tabela `fazenda_detalhes`
Armazena detalhes específicos de fazendas:
- `id`: Identificador único dos detalhes
- `anuncio_id`: ID do anúncio associado
- `estado`: Estado onde está localizada a fazenda
- `regiao`: Região/cidade da fazenda
- `finalidade`: Finalidade da fazenda (Pecuária, Agricultura, etc.)
- `area`: Área total em hectares
- Outros campos específicos para detalhes da fazenda

### Tabela `anuncio_imagens`
Armazena referências às imagens dos anúncios:
- `id`: Identificador único da imagem
- `anuncio_id`: ID do anúncio associado
- `url`: URL da imagem no Storage do Supabase
- `ordem`: Ordem de exibição da imagem

## 8. Segurança (RLS - Row Level Security)

As políticas de segurança já estão configuradas no script SQL para garantir que:
- Qualquer pessoa pode visualizar anúncios e seus detalhes
- Apenas o proprietário pode criar, editar ou excluir seus próprios anúncios

## 9. Troubleshooting

Se encontrar problemas com a conexão ao Supabase:
1. Verifique se as credenciais estão corretas no arquivo `.env.local`
2. Verifique se o servidor Supabase está funcionando corretamente
3. Verifique os logs do console para identificar erros específicos

---

Para mais informações, consulte a [documentação oficial do Supabase](https://supabase.com/docs). 