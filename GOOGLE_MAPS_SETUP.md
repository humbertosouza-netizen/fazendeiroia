# Configuração das APIs de Mapas

## 🔑 APIs Utilizadas

### 1. SearchAPI.io (Validação de Endereços)
- **URL**: https://www.searchapi.io/
- **Endpoint**: `https://www.searchapi.io/api/v1/search?engine=google_maps`
- **Uso**: Validar endereços e obter coordenadas GPS
- **API Key configurada**: `ZYqv9r8Rkp26fniSRxoos6nu`

### 2. Google Maps Embed API (Exibição de Mapas)
- **URL**: https://console.cloud.google.com/
- **Endpoint**: `https://www.google.com/maps/embed/v1/place`
- **Uso**: Exibir mapas interativos nas páginas
- **API Key configurada**: `AIzaSyBS27qunzM9LAcaoZOFAIhUr9WG58K3MRY`

## 📋 Configuração Atual

### SearchAPI.io
```typescript
const apiKey = "ZYqv9r8Rkp26fniSRxoos6nu";
const url = `https://www.searchapi.io/api/v1/search?
  engine=google_maps&
  q=${endereco}&
  api_key=${apiKey}`;
```

### Google Maps Embed
```typescript
const apiKey = "AIzaSyBS27qunzM9LAcaoZOFAIhUr9WG58K3MRY";
const url = `https://www.google.com/maps/embed/v1/place?
  key=${apiKey}&
  q=${coordenadas}`;
```

## 🎯 Uso no Sistema

### Cadastro de Anúncios com IA
- O agente solicita o endereço completo
- Valida automaticamente no Google Maps
- Obtém coordenadas (latitude, longitude)
- Salva no banco de dados

### Página de Detalhes
- Exibe mapa interativo na aba "Localização"
- Botões para:
  - 📍 Abrir no Google Maps
  - 🧭 Como Chegar (rotas)

## 💰 Custos
- **Geocoding API**: $5 por 1.000 requisições
- **Maps Embed API**: GRATUITA
- **Maps JavaScript API**: $7 por 1.000 carregamentos
- **Crédito mensal**: $200 grátis (suficiente para ~40.000 geocodificações)

## 🔒 Segurança
- ✅ Use restrições de HTTP Referrer
- ✅ Restrinja as APIs usadas
- ✅ Monitore o uso no console
- ❌ NUNCA exponha a chave em repositórios públicos

## 📚 Documentação Oficial
- https://developers.google.com/maps/documentation
- https://developers.google.com/maps/documentation/geocoding
- https://developers.google.com/maps/documentation/embed

