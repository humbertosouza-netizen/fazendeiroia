import OpenAI from 'openai';
import { Anuncio } from './anunciosService';

// Variável para controlar se devemos usar modo de emulação (sem chamadas reais à API)
const USE_EMULATION_MODE = true;

// Chave da API (não será usada no modo emulação)
const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY || "";

let openaiClient: OpenAI;

/**
 * Inicializa o cliente OpenAI se ainda não estiver inicializado
 */
const getOpenAIClient = () => {
  // No modo emulação, retornamos um cliente OpenAI falso
  if (USE_EMULATION_MODE) {
    console.log("Usando modo de emulação - sem chamadas reais à API OpenAI");
    return null;
  }

  // Verificar se o cliente já existe
  if (!openaiClient) {
    try {
      // Tentar obter do ambiente primeiro
      let apiKey = typeof window !== 'undefined' ? 
        (window as any).__NEXT_DATA__?.props?.pageProps?.openaiApiKey ||
        process.env.NEXT_PUBLIC_OPENAI_API_KEY : 
        process.env.NEXT_PUBLIC_OPENAI_API_KEY;
      
      // Se não encontrar, usar chave fixa como fallback (apenas para desenvolvimento)
      if (!apiKey) {
        console.warn("Variável de ambiente não encontrada, usando chave fixa (apenas para desenvolvimento)");
        apiKey = OPENAI_API_KEY;
      }
      
      console.log("Inicializando cliente OpenAI...");
      
      // Inicializar o cliente com a configuração correta para API atualizada
      openaiClient = new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true, // Necessário para usar no navegador
      });
      
      console.log("Cliente OpenAI inicializado com sucesso");
    } catch (error) {
      console.error("Erro ao inicializar cliente OpenAI:", error);
      
      // Fallback crítico - último recurso - tentar criar sem configurações adicionais
      try {
        openaiClient = new OpenAI({
          apiKey: OPENAI_API_KEY,
          dangerouslyAllowBrowser: true,
        });
        console.log("Cliente OpenAI inicializado com fallback de emergência");
      } catch (fallbackError) {
        console.error("Falha total na inicialização do cliente OpenAI:", fallbackError);
      }
    }
  }
  return openaiClient;
};

// Prompt do sistema para o Fazendeiro IA
const SYSTEM_PROMPT = `Você é o Fazendeiro IA, um assistente especializado em propriedades rurais brasileiras.
Seu objetivo é ajudar pessoas a encontrarem fazendas, sítios e chácaras ideais para compra ou arrendamento.

INSTRUÇÕES IMPORTANTES:
1. Sempre converse de forma amigável e casual, como um fazendeiro experiente conversando com um amigo.
2. Use termos do campo e do meio rural quando apropriado.
3. Guie a conversa para obter informações relevantes para a busca:
   - Tipo de propriedade (fazenda, sítio, chácara)
   - Localização desejada (estado, região)
   - Tamanho da propriedade (em hectares)
   - Finalidade (agricultura, pecuária, lazer, etc.)
   - Recursos hídricos importantes (rio, nascente, açude)
   - Infraestrutura necessária (energia, casa sede, currais)
   - Faixa de preço
4. Faça perguntas de acompanhamento para refinar a busca, mas não sobrecarregue o usuário com muitas perguntas de uma só vez.
5. Quando identificar uma propriedade adequada, destaque seus principais diferenciais.
6. Se o usuário fornecer poucos detalhes, faça perguntas para entender melhor o que procuram.

PERSONALIDADE:
- Simpático e acolhedor
- Conhecedor do meio rural
- Paciente e prestativo
- Usa ocasionalmente expressões típicas do interior e do campo

Evite:
- Ser excessivamente formal
- Usar termos técnicos demais
- Fazer suposições sem base nas informações fornecidas pelo usuário

Responda sempre em português brasileiro.`;

/**
 * Função que emula a busca de anúncios sem usar a API OpenAI
 */
const emularBuscaAnuncios = (query: string, anuncios: Anuncio[]): Anuncio[] => {
  console.log("Emulando busca de anúncios com a query:", query);
  
  // Convertemos a query para minúsculo para comparação case-insensitive
  const queryLower = query.toLowerCase();
  
  // Lista de palavras-chave que procuramos nos anúncios
  const keywords: {[key: string]: string[]} = {
    tipos: ['fazenda', 'sítio', 'sitio', 'chácara', 'chacara', 'propriedade', 'terreno', 'terra'],
    estados: ['sp', 'são paulo', 'sao paulo', 'mg', 'minas', 'minas gerais', 'rj', 'rio de janeiro', 
              'pr', 'paraná', 'parana', 'sc', 'santa catarina', 'rs', 'rio grande do sul', 'ba', 'bahia'],
    finalidades: ['pecuária', 'pecuaria', 'gado', 'agricultura', 'plantar', 'plantação', 'plantacao', 
                  'lazer', 'morar', 'moradia', 'investimento'],
    recursos: ['rio', 'nascente', 'água', 'agua', 'açude', 'acude', 'lago', 'lagoa', 'irrigação', 'irrigacao'],
    tamanhos: ['pequeno', 'pequena', 'médio', 'media', 'médio', 'medio', 'grande', 'hectare', 'alqueire', 'metro']
  };
  
  // Pontuação para cada anúncio baseado na correspondência com a query
  const scores = anuncios.map(anuncio => {
    let score = 0;
    const anuncioStr = JSON.stringify(anuncio).toLowerCase();
    
    // Verificar correspondência para cada categoria de palavras-chave
    for (const category in keywords) {
      for (const keyword of keywords[category]) {
        if (queryLower.includes(keyword) && anuncioStr.includes(keyword)) {
          score += 5; // Pontos por correspondência direta
        }
      }
    }
    
    // Pontos extras para correspondências específicas
    if (anuncio.categoria && queryLower.includes(anuncio.categoria.toLowerCase())) {
      score += 10;
    }
    
    if (anuncio.detalhes?.estado && queryLower.includes(anuncio.detalhes.estado.toLowerCase())) {
      score += 10;
    }
    
    if (anuncio.detalhes?.cidade && queryLower.includes(anuncio.detalhes.cidade.toLowerCase())) {
      score += 15;
    }
    
    if (anuncio.detalhes?.finalidade && queryLower.includes(anuncio.detalhes.finalidade.toLowerCase())) {
      score += 10;
    }
    
    return { anuncio, score };
  });
  
  // Ordenar por pontuação decrescente e pegar os 3 melhores resultados
  const sortedResults = scores
    .sort((a, b) => b.score - a.score)
    .map(item => item.anuncio)
    .slice(0, 3);
    
  console.log(`Emulação encontrou ${sortedResults.length} resultados relevantes`);
  
  return sortedResults;
};

/**
 * Função que emula as respostas do chat sem usar a API OpenAI
 */
const emularRespostaChat = (messages: { role: string, content: string }[]): string => {
  console.log("Emulando resposta do chat");
  
  // Obter a última mensagem do usuário
  const lastUserMessage = [...messages].reverse().find(m => m.role === 'user')?.content || '';
  
  // Respostas pré-definidas baseadas em palavras-chave
  const responses: { keywords: string[], response: string }[] = [
    {
      keywords: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite', 'e aí', 'eai'],
      response: 'Olá! Que prazer ter você por aqui! Sou o Fazendeiro IA, seu assistente para encontrar a propriedade rural dos seus sonhos. Me conte o que você está procurando? Que tipo de propriedade te interessa?'
    },
    {
      keywords: ['fazenda', 'pecuária', 'pecuaria', 'gado', 'boi'],
      response: 'Entendi que você está interessado em uma fazenda para pecuária! Ótima escolha! Temos várias opções interessantes. Qual região do país você prefere? E quanto ao tamanho da propriedade, tem alguma área específica em mente?'
    },
    {
      keywords: ['sítio', 'sitio', 'pequeno', 'pequena', 'chácara', 'chacara'],
      response: 'Perfeito! Estou vendo que você busca uma propriedade menor como sítio ou chácara. Isso é ótimo para quem quer um lugar tranquilo no campo sem precisar administrar uma área muito grande. Você pretende usar para moradia, lazer, ou algum tipo de produção rural? E qual região tem interesse?'
    },
    {
      keywords: ['são paulo', 'sao paulo', 'sp', 'interior'],
      response: 'O interior de São Paulo é uma região excelente para propriedades rurais! Ótima infraestrutura, acesso fácil e terras de qualidade. Que tipo de atividade você pretende desenvolver na propriedade? Agricultura, pecuária ou é mais para lazer e moradia?'
    },
    {
      keywords: ['minas', 'mg', 'minas gerais'],
      response: 'Minas Gerais é um estado maravilhoso para propriedades rurais! Terras férteis, belas paisagens e muita tradição no campo. Você procura algo perto de alguma cidade específica? E quanto às características do terreno, prefere áreas mais planas ou com relevo mais acidentado?'
    },
    {
      keywords: ['água', 'agua', 'rio', 'nascente', 'açude', 'acude'],
      response: 'Entendo que recursos hídricos são importantes para você! Realmente, uma propriedade com água é um verdadeiro tesouro. Temos algumas opções com rios, nascentes e açudes. Você tem preferência por algum tipo específico de recurso hídrico? E quanto à localização e tamanho da propriedade?'
    },
    {
      keywords: ['investimento', 'retorno', 'valorização'],
      response: 'Vejo que você está pensando como um bom investidor! Propriedades rurais podem ser excelentes para diversificação de investimentos. As áreas que mais tendem a valorizar são aquelas próximas a centros urbanos em expansão ou em regiões com forte desenvolvimento agrícola. Tem alguma região específica em mente? E quanto ao tipo de propriedade e tamanho?'
    },
    {
      keywords: ['preço', 'preco', 'valor', 'quanto custa', 'barato'],
      response: 'O valor das propriedades rurais varia bastante conforme a localização, tamanho e infraestrutura. Para ajudar na sua busca, qual seria sua faixa de orçamento aproximada? E quais características são imprescindíveis para você na propriedade?'
    },
    {
      keywords: ['agricultura', 'plantar', 'plantação', 'plantacao', 'lavoura', 'cultivo'],
      response: 'Entendi que você tem interesse em agricultura! Que bom! Precisamos encontrar uma terra com solo adequado para o tipo de cultura que você pretende. Já tem alguma cultura específica em mente? E em termos de localização e tamanho da área, tem alguma preferência?'
    },
    {
      keywords: ['grande', 'extensa', 'hectares', 'alqueires'],
      response: 'Pelo que entendi, você está procurando uma propriedade de porte maior. Excelente! Para propriedades maiores, precisamos considerar acesso, logística e aptidão do solo. Qual seria a principal finalidade desta propriedade? E tem alguma região de preferência?'
    }
  ];
  
  // Verificar correspondências com as palavras-chave
  for (const responseItem of responses) {
    for (const keyword of responseItem.keywords) {
      if (lastUserMessage.toLowerCase().includes(keyword.toLowerCase())) {
        return responseItem.response;
      }
    }
  }
  
  // Resposta padrão se nenhuma palavra-chave corresponder
  return 'Entendi seu interesse! Para ajudar a encontrar a propriedade ideal para você, poderia me dar mais detalhes? Qual tipo de propriedade rural você procura (fazenda, sítio, chácara)? Em qual região do país? E qual seria a finalidade principal (agricultura, pecuária, lazer)?';
};

const openaiService = {
  /**
   * Busca anúncios com base na descrição feita pelo usuário
   * @param userQuery Consulta do usuário em linguagem natural
   * @param anuncios Lista de anúncios disponíveis para busca
   * @returns Array de anúncios correspondentes à consulta
   */
  async buscarAnunciosPorDescricao(userQuery: string, anuncios: Anuncio[]): Promise<Anuncio[]> {
    // Se estamos no modo de emulação, usamos nossa função local
    if (USE_EMULATION_MODE) {
      return emularBuscaAnuncios(userQuery, anuncios);
    }

    try {
      const client = getOpenAIClient();
      
      // Preparar os dados para enviar ao modelo
      const anunciosData = anuncios.map(anuncio => ({
        id: anuncio.id,
        titulo: anuncio.titulo,
        categoria: anuncio.categoria,
        preco: anuncio.preco,
        estado: anuncio.detalhes?.estado || 'Não informado',
        cidade: anuncio.detalhes?.cidade || 'Não informada',
        area: anuncio.detalhes?.area || 0,
        finalidade: anuncio.detalhes?.finalidade || 'Não informada',
        acesso: anuncio.detalhes?.acesso || 'Não informado',
        recursos: {
          hidrico: anuncio.detalhes?.recurso_hidrico || 'Não informado',
          energia: anuncio.detalhes?.energia || 'Não informada',
          solo: anuncio.detalhes?.tipo_solo || 'Não informado',
          estruturas: anuncio.detalhes?.estruturas || [],
          topografia: anuncio.detalhes?.topografia || 'Não informada'
        },
        area_aberta: anuncio.detalhes?.area_aberta,
        area_reserva: anuncio.detalhes?.area_reserva,
        capacidade_pasto: anuncio.detalhes?.capacidade_pasto,
        tipo_oferta: anuncio.detalhes?.tipo_oferta,
        documentacao: anuncio.detalhes?.documentacao,
        distancia: anuncio.detalhes?.distancia,
        periodo_arrendamento: anuncio.detalhes?.periodo_arrendamento,
        descricao: anuncio.detalhes?.descricao || 'Sem descrição disponível'
      }));
      
      // Converter para JSON para enviar ao modelo
      const anunciosJSON = JSON.stringify(anunciosData);
      
      // Prompt de busca
      const buscaPrompt = `Analise cuidadosamente os anúncios de propriedades rurais a seguir e identifique as que melhor correspondem à busca do cliente.

ANÚNCIOS DISPONÍVEIS:
${anunciosJSON}

BUSCA DO CLIENTE:
"${userQuery}"

INSTRUÇÕES:
1. Analise as palavras-chave e o contexto da busca do cliente
2. Verifique todas as propriedades e suas características
3. Priorize correspondências com:
   - Tipo de propriedade mencionado (fazenda, sítio, chácara)
   - Localização mencionada (estado, cidade, região)
   - Tamanho/área compatível
   - Finalidade compatível (pecuária, agricultura, lazer)
   - Recursos e características específicas mencionadas

4. Para cada propriedade, calcule um score de relevância com base na correspondência com a busca

5. Retorne APENAS os IDs das 3 propriedades mais relevantes, em formato de array JSON [id1, id2, id3]
   Se houver menos de 3 correspondências relevantes, retorne apenas as que forem realmente adequadas.

6. Não inclua explicações ou texto adicional, apenas o array JSON com os IDs.`;

      // Enviar consulta para o modelo
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo", // Modelo disponível para a conta
        messages: [
          { role: "system", content: "Você é um especialista em análise e busca de propriedades rurais." },
          { role: "user", content: buscaPrompt }
        ],
        temperature: 0.3,
        response_format: { type: "json_object" },
      });
      
      // Extrair a resposta do modelo
      const responseText = response.choices[0].message.content?.trim() || '{"ids":[]}';
      let idArray: string[] = [];
      
      try {
        // Tentar extrair a array de IDs da resposta
        const jsonResponse = JSON.parse(responseText);
        idArray = jsonResponse.ids || [];
        
        // Fallback caso a resposta não siga o formato esperado
        if (!idArray.length && typeof jsonResponse === 'object') {
          // Tentar encontrar qualquer array na resposta
          for (const key in jsonResponse) {
            if (Array.isArray(jsonResponse[key]) && jsonResponse[key].length) {
              idArray = jsonResponse[key];
              break;
            }
          }
        }
      } catch (e) {
        console.error("Erro ao processar resposta da OpenAI:", e);
        console.log("Resposta original:", responseText);
        
        // Tentativa de extrair array por regex se o JSON parsing falhou
        const match = responseText.match(/\[(.*?)\]/);
        if (match && match[1]) {
          idArray = match[1].split(',').map(id => id.trim().replace(/"/g, ''));
        }
      }
      
      // Filtrar anúncios com base nos IDs retornados
      const anunciosFiltrados = anuncios.filter(anuncio => idArray.includes(anuncio.id || ''));
      
      // Se nenhum anúncio for encontrado, retorne alguns como alternativa
      if (anunciosFiltrados.length === 0 && anuncios.length > 0) {
        return anuncios.slice(0, 3);
      }
      
      return anunciosFiltrados;
    } catch (error) {
      console.error("Erro ao consultar a OpenAI:", error);
      // Em caso de erro, retornamos resultados usando nossa função de emulação
      return emularBuscaAnuncios(userQuery, anuncios);
    }
  },
  
  /**
   * Gera uma resposta de chat baseada na interação com o usuário
   * @param messageHistory Histórico de mensagens da conversa
   * @param anuncios Lista de anúncios disponíveis para referência
   * @returns Resposta do assistente
   */
  async gerarRespostaChat(
    messageHistory: {role: 'system' | 'user' | 'assistant', content: string}[],
    anuncios: Anuncio[]
  ): Promise<string> {
    // Se estamos no modo de emulação, usamos nossa função local
    if (USE_EMULATION_MODE) {
      return emularRespostaChat(messageHistory);
    }

    try {
      const client = getOpenAIClient();
      
      // Preparar contexto resumido dos anúncios disponíveis
      const anunciosResumo = anuncios.map(a => 
        `ID: ${a.id}
         Tipo: ${a.categoria}
         Título: ${a.titulo}
         Preço: ${a.preco}
         Localização: ${a.detalhes?.cidade || '?'}, ${a.detalhes?.estado || '?'}
         Área: ${a.detalhes?.area || '?'} hectares
         Finalidade: ${a.detalhes?.finalidade || '?'}
         Recursos: água (${a.detalhes?.recurso_hidrico || '?'}), energia (${a.detalhes?.energia || '?'})
         Tipo de solo: ${a.detalhes?.tipo_solo || '?'}
         Estruturas: ${a.detalhes?.estruturas?.join(', ') || 'Não informado'}
         Oferta: ${a.detalhes?.tipo_oferta || 'Venda'}`
      ).join('\n\n');
      
      // Adicionar contexto no início da conversa se ainda não existir
      let messages = [...messageHistory];
      
      if (!messages.some(m => m.role === 'system')) {
        // Adicionar o prompt do sistema com o contexto dos anúncios
        messages.unshift({
          role: 'system',
          content: `${SYSTEM_PROMPT}\n\nPROPRIEDADES DISPONÍVEIS NO SISTEMA:\n${anunciosResumo}`
        });
      }
      
      // Gerar resposta
      const response = await client.chat.completions.create({
        model: "gpt-3.5-turbo", // Modelo disponível para a conta
        messages,
        temperature: 0.7,
        max_tokens: 800,
      });
      
      return response.choices[0].message.content || "Desculpe, não consegui processar sua solicitação.";
    } catch (error) {
      console.error("Erro ao gerar resposta de chat:", error);
      // Em caso de erro, retornamos uma resposta usando nossa função de emulação
      return emularRespostaChat(messageHistory);
    }
  }
};

export default openaiService; 