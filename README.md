# Fazendeiro IA - Portal de Busca de Propriedades Rurais

Uma plataforma moderna para conectar compradores e vendedores de propriedades rurais, utilizando inteligência artificial para personalizar a busca e melhorar a experiência do usuário.

## 🚀 Recursos

- Design moderno com tema verde e identidade visual consistente
- Dashboard administrativo com métricas de desempenho
- Busca inteligente de propriedades rurais
- Sistema de leads e visualizações
- Gerenciamento de anúncios (ativos/inativos)
- Autenticação e perfis de usuário

## 🔧 Tecnologias

- Next.js 14
- Tailwind CSS
- Supabase (Autenticação e Banco de Dados)
- React Chart.js
- TypeScript

## 📋 Pré-requisitos

- Node.js 18+
- Conta no Supabase

## ⚙️ Configuração

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/fazendeiro-ia.git
cd fazendeiro-ia
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
Crie um arquivo `.env.local` na raiz do projeto com:
```
NEXT_PUBLIC_SUPABASE_URL=seu-url-do-supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-do-supabase
```

4. Configure o banco de dados no Supabase
- Acesse o painel administrativo do Supabase
- Vá para "SQL Editor"
- Execute o script SQL em `src/db/schema.sql` para criar as tabelas

## 🏃‍♂️ Executando o projeto

```bash
npm run dev
```

Acesse o site em http://localhost:3000

## 📱 Acessos do Sistema

### Portal de Acesso Público
- http://localhost:3000 - Página inicial
- http://localhost:3000/portal - Portal de busca de propriedades

### Área Restrita (requer login)
- http://localhost:3000/login - Página de login
- http://localhost:3000/register - Página de cadastro
- http://localhost:3000/dashboard - Dashboard principal
- http://localhost:3000/dashboard/anuncios - Gerenciamento de anúncios
- http://localhost:3000/dashboard/leads - Gerenciamento de leads

## 📊 Dashboard

O dashboard apresenta métricas-chave:
- Número de anúncios ativos
- Total de visualizações
- Leads gerados
- Taxa de conversão
- Ranking de anúncios mais visualizados
- Gráficos de desempenho mensal

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie sua feature branch (`git checkout -b feature/nome-da-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nome-da-feature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT - veja o arquivo LICENSE para detalhes.
