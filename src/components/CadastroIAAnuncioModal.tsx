"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles } from "lucide-react";
import anunciosService, { Anuncio, FazendaDetalhes } from "@/services/anunciosService";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (anuncio: Anuncio | null) => void;
};

type ChatMessage = { role: "assistant" | "user"; content: string };

const CAMPOS_ORDEM: Array<keyof (Anuncio & FazendaDetalhes) | 'endereco_completo'> = [
  "titulo",
  "endereco_completo",
  "finalidade",
  "area",
  "tipo_oferta",
  "preco",
  "recurso_hidrico",
  "energia",
  "tipo_solo",
  "documentacao",
  "estruturas",
];

const SUGESTOES: Record<string, string[]> = {
  finalidade: ["Pecuária", "Agricultura", "Misto", "Lazer"],
  tipo_oferta: ["venda", "arrendamento"],
  estado: ["SP", "MG", "GO", "MT", "BA", "PR"],
  recurso_hidrico: ["Rio", "Nascente", "Açude", "Poço artesiano", "Córrego", "Lagoa"],
  energia: ["Rede Elétrica", "Energia Solar", "Gerador", "Sem energia"],
  documentacao: ["Regular", "Em regularização", "Pendente", "Irregular"],
  tipo_solo: ["Arenoso", "Argiloso", "Misto", "Pedregoso", "Fértil"],
  estruturas: ["Sede", "Casa de Funcionários", "Galpão", "Curral", "Cercas", "Cocheiras", "Piscina", "Barracão"],
};

function extrairNumero(texto: string): number | null {
  const n = texto.replace(/[^0-9.,]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
  const parsed = parseFloat(n);
  return Number.isFinite(parsed) ? parsed : null;
}

// Função para converter números escritos por extenso para numérico
function converterTextoParaNumero(texto: string): number | null {
  const textoLimpo = texto.toLowerCase().trim();
  
  // Mapeamento de números por extenso
  const numeros = {
    'zero': 0, 'um': 1, 'dois': 2, 'três': 3, 'quatro': 4, 'cinco': 5,
    'seis': 6, 'sete': 7, 'oito': 8, 'nove': 9, 'dez': 10,
    'onze': 11, 'doze': 12, 'treze': 13, 'quatorze': 14, 'quinze': 15,
    'dezesseis': 16, 'dezessete': 17, 'dezoito': 18, 'dezenove': 19, 'vinte': 20,
    'trinta': 30, 'quarenta': 40, 'cinquenta': 50, 'sessenta': 60,
    'setenta': 70, 'oitenta': 80, 'noventa': 90,
    'cem': 100, 'mil': 1000, 'milhão': 1000000, 'milhões': 1000000,
    'bilhão': 1000000000, 'bilhões': 1000000000
  };
  
  // Se já é um número, retornar
  const numeroDireto = extrairNumero(texto);
  if (numeroDireto !== null) {
    return numeroDireto;
  }
  
  // Processar texto por extenso
  let resultado = 0;
  let valorAtual = 0;
  
  // Dividir em palavras e processar
  const palavras = textoLimpo.split(/\s+/);
  
  for (let i = 0; i < palavras.length; i++) {
    const palavra = palavras[i];
    
    if (numeros[palavra] !== undefined) {
      const valor = numeros[palavra];
      
      if (valor >= 1000000) { // milhão, bilhão
        valorAtual *= valor;
        resultado += valorAtual;
        valorAtual = 0;
      } else if (valor >= 1000) { // mil
        valorAtual *= valor;
        resultado += valorAtual;
        valorAtual = 0;
      } else if (valor >= 100) { // cem
        valorAtual = (valorAtual || 1) * valor;
      } else { // unidades e dezenas
        valorAtual += valor;
      }
    }
  }
  
  resultado += valorAtual;
  
  return resultado > 0 ? resultado : null;
}

export default function CadastroIAAnuncioModal({ open, onOpenChange, onCreated }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [confirmando, setConfirmando] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [dados, setDados] = useState<Partial<Anuncio & FazendaDetalhes & { endereco_completo?: string }>>({
    categoria: "Fazenda",
    status: "Ativo",
    tipo_oferta: "venda",
  });
  const [imagensSelecionadas, setImagensSelecionadas] = useState<FileList | null>(null);
  const [estruturasSelecionadas, setEstruturasSelecionadas] = useState<string[]>([]);
  const [recursosHidricosSelecionados, setRecursosHidricosSelecionados] = useState<string[]>([]);
  const [energiasSelecionadas, setEnergiasSelecionadas] = useState<string[]>([]);
  const [solosSelecionados, setSolosSelecionados] = useState<string[]>([]);
  const [finalidadesSelecionadas, setFinalidadesSelecionadas] = useState<string[]>([]);
  const [coordenadas, setCoordenadas] = useState<string>("");
  const [validandoEndereco, setValidandoEndereco] = useState(false);

  const campoAtual = CAMPOS_ORDEM[currentIndex];

  useEffect(() => {
    if (open) {
      // inicia a conversa
      setMessages([
        {
          role: "assistant",
          content:
            "Olá! Vou te ajudar a cadastrar a fazenda rapidinho. Primeiro, qual é o título/nome do anúncio?",
        },
      ]);
      setDados({ categoria: "Fazenda", status: "Ativo", tipo_oferta: "venda" });
      setCurrentIndex(0);
      setInput("");
      setLoading(false);
      setConfirmando(false);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const perguntaDoCampo = useMemo(() => {
    const perguntas: Record<string, string> = {
      titulo: "Qual título você deseja para o anúncio?",
      endereco_completo: "📍 Por favor, informe o endereço completo da propriedade (será usado para localização no Google Maps). Ex: 'Rodovia BR-153, Km 45, Zona Rural, Cassilândia - MS'",
      finalidade: "Quais as finalidades da propriedade? (Pecuária, Agricultura, Misto, Lazer)",
      area: "Qual a área aproximada em hectares?",
      tipo_oferta: "É venda ou arrendamento?",
      preco: "Qual o preço desejado? (ex.: 1.500.000 ou um milhão e quinhentos mil)",
      recurso_hidrico: "Possui rio, nascente, açude ou outro recurso hídrico? ⚠️ OBRIGATÓRIO",
      energia: "Qual tipo de energia existe no local? (Rede Elétrica, Solar, etc.) ⚠️ OBRIGATÓRIO",
      tipo_solo: "Qual o tipo de solo predominante?",
      documentacao: "Como está a documentação? (Regular, Em regularização, etc.) ⚠️ OBRIGATÓRIO",
      estruturas: "Quais estruturas existem na propriedade? (Selecione todas que se aplicam) ⚠️ OBRIGATÓRIO",
    };
    return perguntas[campoAtual as string];
  }, [campoAtual]);

  function registrarRespostaUsuario(valor: string) {
    setMessages((prev) => [...prev, { role: "user", content: valor }]);
  }

  // Função para validar endereço e obter coordenadas usando SearchAPI
  async function validarEnderecoGoogleMaps(endereco: string): Promise<{valido: boolean, coordenadas?: string, mensagem?: string}> {
    try {
      setValidandoEndereco(true);
      
      // Usar SearchAPI.io para Google Maps
      const apiKey = process.env.NEXT_PUBLIC_SEARCHAPI_KEY || "ZYqv9r8Rkp26fniSRxoos6nu";
      const url = `https://www.searchapi.io/api/v1/search?engine=google_maps&q=${encodeURIComponent(endereco)}&api_key=${apiKey}`;
      
      console.log('🗺️ Validando endereço via SearchAPI:', endereco);
      console.log('🔑 Usando API Key:', apiKey.substring(0, 10) + '...');
      console.log('🔗 URL:', url);
      
      const response = await fetch(url);
      
      if (!response.ok) {
        console.error('❌ Erro HTTP:', response.status, response.statusText);
        return {
          valido: false,
          mensagem: `❌ Erro ao conectar com a API (HTTP ${response.status}). Tente novamente.`
        };
      }
      
      const data = await response.json();
      
      console.log('📡 Resposta da SearchAPI:', data);
      
      // SearchAPI retorna os resultados do Google Maps em data.local_results ou data.place_results
      if (data.local_results && data.local_results.length > 0) {
        const resultado = data.local_results[0];
        
        // Obter coordenadas do primeiro resultado
        const lat = resultado.gps_coordinates?.latitude;
        const lng = resultado.gps_coordinates?.longitude;
        
        if (lat && lng) {
          const coordenadasStr = `${lat},${lng}`;
          
          console.log('✅ Coordenadas obtidas:', coordenadasStr);
          console.log('📍 Local encontrado:', resultado.title);
          
          setCoordenadas(coordenadasStr);
          
          return {
            valido: true,
            coordenadas: coordenadasStr,
            mensagem: `✅ Endereço validado!\n📍 ${resultado.title || endereco}\n${resultado.address || ''}`,
            resultado: resultado // Incluir resultado completo para extração de cidade/estado
          };
        }
      }
      
      // Se não encontrou resultados
      console.error('❌ Nenhum resultado encontrado');
      console.error('📡 Data completo:', JSON.stringify(data, null, 2));
      
      return {
        valido: false,
        mensagem: `❌ Não consegui localizar esse endereço.\n\nPor favor, tente um endereço mais específico.\n\nExemplos:\n• "Fazenda em Cassilândia, MS"\n• "Rodovia BR-153, Km 45, Cassilândia - MS"\n• "Zona Rural de Uberaba, MG"`
      };
    } catch (error) {
      console.error("❌ Erro ao validar endereço:", error);
      return {
        valido: false,
        mensagem: "❌ Erro ao conectar com a API de localização. Por favor, tente novamente."
      };
    } finally {
      setValidandoEndereco(false);
    }
  }

  // Função para extrair cidade e estado do endereço validado
  function extrairCidadeEstado(endereco: string, validacao: any): { cidade: string, estado: string } {
    console.log('🔍 Extraindo cidade/estado de:', { endereco, validacao });
    
    // Tentar extrair do resultado da API primeiro
    if (validacao?.resultado?.address) {
      const address = validacao.resultado.address;
      console.log('🔍 Address da API:', address);
      
      // Procurar por padrões como "Cidade - Estado" ou "Cidade, Estado"
      const match = address.match(/([^,]+?)\s*[-–]\s*([A-Z]{2})|([^,]+),\s*([A-Z]{2})/);
      if (match) {
        const cidade = (match[1] || match[3] || '').trim();
        const estado = (match[2] || match[4] || '').trim();
        console.log('✅ Extraído da API:', { cidade, estado });
        return { cidade, estado };
      }
      
      // Tentar extrair do título da API também
      if (validacao.resultado.title) {
        const title = validacao.resultado.title;
        console.log('🔍 Title da API:', title);
        const titleMatch = title.match(/([^,]+?)\s*[-–]\s*([A-Z]{2})|([^,]+),\s*([A-Z]{2})/);
        if (titleMatch) {
          const cidade = (titleMatch[1] || titleMatch[3] || '').trim();
          const estado = (titleMatch[2] || titleMatch[4] || '').trim();
          console.log('✅ Extraído do title da API:', { cidade, estado });
          return { cidade, estado };
        }
      }
    }
    
    // Tentar extrair da mensagem de validação (que contém o endereço formatado)
    if (validacao?.mensagem) {
      const mensagem = validacao.mensagem;
      console.log('🔍 Mensagem de validação:', mensagem);
      
      // Procurar por padrões como "Chapadão do Sul - State of Mato Grosso do Sul"
      const mensagemMatch = mensagem.match(/([^,]+?)\s*-\s*State of ([^,]+)/i);
      if (mensagemMatch) {
        const cidade = mensagemMatch[1].trim();
        const estadoCompleto = mensagemMatch[2].trim();
        // Converter estado completo para sigla
        const estadoSigla = converterEstadoParaSigla(estadoCompleto);
        console.log('✅ Extraído da mensagem:', { cidade, estado: estadoSigla });
        return { cidade, estado: estadoSigla };
      }
    }
    
    // Fallback: extrair do endereço original
    console.log('🔍 Extraindo do endereço original:', endereco);
    const match = endereco.match(/([^,]+?)\s*[-–]\s*([A-Z]{2})|([^,]+),\s*([A-Z]{2})/);
    if (match) {
      const cidade = (match[1] || match[3] || '').trim();
      const estado = (match[2] || match[4] || '').trim();
      console.log('✅ Extraído do endereço:', { cidade, estado });
      return { cidade, estado };
    }
    
    // Se não conseguir extrair, usar valores padrão
    console.log('⚠️ Não foi possível extrair cidade/estado');
    return { cidade: '', estado: '' };
  }

  // Função para converter nome completo do estado para sigla
  function converterEstadoParaSigla(estadoCompleto: string): string {
    const estados: { [key: string]: string } = {
      'mato grosso do sul': 'MS',
      'mato grosso': 'MT',
      'minas gerais': 'MG',
      'são paulo': 'SP',
      'rio de janeiro': 'RJ',
      'paraná': 'PR',
      'santa catarina': 'SC',
      'rio grande do sul': 'RS',
      'goiás': 'GO',
      'bahia': 'BA',
      'pernambuco': 'PE',
      'ceará': 'CE',
      'pará': 'PA',
      'amazonas': 'AM',
      'acre': 'AC',
      'rondônia': 'RO',
      'roraima': 'RR',
      'amapá': 'AP',
      'tocantins': 'TO',
      'maranhão': 'MA',
      'piauí': 'PI',
      'alagoas': 'AL',
      'sergipe': 'SE',
      'distrito federal': 'DF'
    };
    
    const estadoLower = estadoCompleto.toLowerCase().trim();
    return estados[estadoLower] || estadoCompleto;
  }

  async function avancar(valor: string) {
    const normalizado = valor.trim();
    let novoValor: any = normalizado;

    // Validar endereço com Google Maps
    if (campoAtual === "endereco_completo") {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "🔍 Validando endereço no Google Maps..." },
      ]);
      
      const validacao = await validarEnderecoGoogleMaps(normalizado);
      
      if (!validacao.valido) {
        setMessages((prev) => [
          ...prev.slice(0, -1), // Remove mensagem de "validando"
          { role: "assistant", content: validacao.mensagem || "Endereço inválido. Tente novamente." },
        ]);
        return; // Não avança se endereço inválido
      }
      
      setMessages((prev) => [
        ...prev.slice(0, -1), // Remove mensagem de "validando"
        { role: "assistant", content: validacao.mensagem || "Endereço validado!" },
      ]);
      
      // Extrair cidade e estado automaticamente do endereço validado
      const { cidade, estado } = extrairCidadeEstado(normalizado, validacao);
      
      // Adicionar cidade e estado automaticamente aos dados
      if (cidade) {
        setDados((d) => ({ ...d, cidade }));
      }
      if (estado) {
        setDados((d) => ({ ...d, estado }));
      }
      
      novoValor = normalizado;
    }

    if (campoAtual === "area") {
      const num = extrairNumero(normalizado);
      if (num !== null) novoValor = num;
    }
    if (campoAtual === "preco") {
      // Entrada só numérica formatada no onChange. Remover separadores e formatar como moeda.
      const apenasDigitos = normalizado.replace(/\D/g, "");
      const num = apenasDigitos ? Number(apenasDigitos) : null;
      if (num !== null) {
        novoValor = `R$ ${num.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;
      }
    }
    if (campoAtual === "estruturas") {
      // Para estruturas, vamos usar as selecionadas
      novoValor = estruturasSelecionadas;
    }
    if (campoAtual === "recurso_hidrico") {
      // Para recursos hídricos, vamos usar as selecionadas
      novoValor = recursosHidricosSelecionados;
    }
    if (campoAtual === "energia") {
      // Para energia, vamos usar as selecionadas
      novoValor = energiasSelecionadas;
    }
    if (campoAtual === "tipo_solo") {
      // Para solo, vamos usar as selecionadas
      novoValor = solosSelecionados;
    }
    if (campoAtual === "finalidade") {
      // Para finalidade, vamos usar as selecionadas
      novoValor = finalidadesSelecionadas;
    }

    setDados((d) => ({ ...d, [campoAtual]: novoValor }));

    const proximo = currentIndex + 1;
    if (proximo < CAMPOS_ORDEM.length) {
      setCurrentIndex(proximo);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Perfeito! " + perguntaDoCampoProximo(proximo) },
      ]);
    } else {
      // Final das perguntas: mostrar resumo e pedir confirmação
      setConfirmando(true);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Ótimo! Agora preciso que você selecione as imagens da propriedade. Isso é OBRIGATÓRIO para o cadastro." },
      ]);
    }
  }

  function perguntaDoCampoProximo(index: number) {
    const c = CAMPOS_ORDEM[index];
    const map: Record<string, string> = {
      titulo: "Qual título você deseja para o anúncio?",
      endereco_completo: "📍 Por favor, informe o endereço completo da propriedade (será usado para localização no Google Maps). Ex: 'Rodovia BR-153, Km 45, Zona Rural, Cassilândia - MS'",
      finalidade: "Quais as finalidades da propriedade? (Pecuária, Agricultura, Misto, Lazer)",
      area: "Qual a área aproximada em hectares?",
      tipo_oferta: "É venda ou arrendamento?",
      preco: "Qual o preço desejado? (ex.: 1.500.000 ou um milhão e quinhentos mil)",
      recurso_hidrico: "Possui rio, nascente, açude ou outro recurso hídrico? ⚠️ OBRIGATÓRIO",
      energia: "Qual tipo de energia existe no local? (Rede Elétrica, Solar, etc.) ⚠️ OBRIGATÓRIO",
      tipo_solo: "Qual o tipo de solo predominante?",
      documentacao: "Como está a documentação? (Regular, Em regularização, etc.) ⚠️ OBRIGATÓRIO",
      estruturas: "Quais estruturas existem na propriedade? (Selecione todas que se aplicam) ⚠️ OBRIGATÓRIO",
    };
    return map[c as string];
  }

  async function handleSend() {
    if (!input.trim() || loading) return;
    const texto = input.trim();
    setInput("");
    registrarRespostaUsuario(texto);
    setLoading(true);
    try {
      // Para tornar fluido, não chamamos IA a cada passo; usamos roteiro guiado.
      await new Promise((r) => setTimeout(r, 300));
      avancar(texto);
    } finally {
      setLoading(false);
    }
  }

  async function confirmarCadastro() {
    // Validações obrigatórias
    if (!dados.endereco_completo || String(dados.endereco_completo).trim() === "") {
      alert("⚠️ Campo OBRIGATÓRIO: Endereço completo deve ser preenchido!");
      return;
    }
    if (!coordenadas || coordenadas.trim() === "") {
      alert("⚠️ Endereço não foi validado no Google Maps! Por favor, verifique o endereço informado.");
      return;
    }
    if (!dados.recurso_hidrico || (Array.isArray(dados.recurso_hidrico) ? dados.recurso_hidrico.length === 0 : String(dados.recurso_hidrico).trim() === "")) {
      alert("⚠️ Campo OBRIGATÓRIO: Recurso Hídrico deve ser preenchido!");
      return;
    }
    if (!dados.energia || (Array.isArray(dados.energia) ? dados.energia.length === 0 : String(dados.energia).trim() === "")) {
      alert("⚠️ Campo OBRIGATÓRIO: Energia deve ser preenchido!");
      return;
    }
    if (!dados.documentacao || String(dados.documentacao).trim() === "") {
      alert("⚠️ Campo OBRIGATÓRIO: Documentação deve ser preenchido!");
      return;
    }
    if (!dados.estruturas || !Array.isArray(dados.estruturas) || dados.estruturas.length === 0) {
      alert("⚠️ Campo OBRIGATÓRIO: Pelo menos uma estrutura deve ser selecionada!");
      return;
    }
    if (!imagensSelecionadas || imagensSelecionadas.length === 0) {
      alert("⚠️ Campo OBRIGATÓRIO: Pelo menos uma imagem deve ser selecionada!");
      return;
    }

    setLoading(true);
    try {
      const anuncio: Anuncio = {
        titulo: String(dados.titulo || "Fazenda"),
        categoria: String(dados.categoria || "Fazenda"),
        preco: String(dados.preco || "R$ 0,00"),
        status: "Ativo",
        visualizacoes: 0,
        datapublicacao: new Date().toISOString(),
      };
      const detalhes: FazendaDetalhes = {
        anuncio_id: "",
        estado: String(dados.estado || ""),
        regiao: String(dados.regiao || ""),
        finalidade: Array.isArray(dados.finalidade) ? dados.finalidade.join(", ") : String(dados.finalidade || ""),
        area: Number(dados.area || 0),
        cidade: String(dados.cidade || ""),
        distancia: Number(dados.distancia || 0),
        acesso: String(dados.acesso || ""),
        coordenadas: coordenadas || "",
        recurso_hidrico: Array.isArray(dados.recurso_hidrico) ? dados.recurso_hidrico.join(", ") : String(dados.recurso_hidrico || ""),
        energia: Array.isArray(dados.energia) ? dados.energia.join(", ") : String(dados.energia || ""),
        tipo_solo: Array.isArray(dados.tipo_solo) ? dados.tipo_solo.join(", ") : String(dados.tipo_solo || ""),
        documentacao: String(dados.documentacao || ""),
        estruturas: Array.isArray(dados.estruturas) ? (dados.estruturas as string[]) : [],
        tipo_oferta: (dados.tipo_oferta as "venda" | "arrendamento") || "venda",
      };

      const created = await anunciosService.criarAnuncio(anuncio, detalhes);
      
      // Upload das imagens se houver
      if (imagensSelecionadas && imagensSelecionadas.length > 0 && created?.id) {
        try {
          await anunciosService.uploadImagensAnuncio(imagensSelecionadas, created.id);
        } catch (error) {
          console.error("Erro no upload das imagens:", error);
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Anúncio criado, mas houve erro ao enviar imagens. Você pode adicioná-las depois na edição." },
          ]);
          onCreated?.(created as any);
          onOpenChange(false);
          return;
        }
      }
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "✅ Cadastro realizado com sucesso! Anúncio e imagens foram salvos." },
      ]);
      onCreated?.(created as any);
      onOpenChange(false);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Opa, aconteceu um erro ao cadastrar. Pode tentar novamente?" },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function QuickReplies() {
    const chaves = SUGESTOES[campoAtual as string];
    if (!chaves || confirmando) return null;
    
    if (campoAtual === "estruturas") {
      return (
        <div className="space-y-3 pt-2">
          <div className="text-sm text-gray-600">
            Selecione todas as estruturas que existem na propriedade:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {chaves.map((s) => (
              <label key={s} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={estruturasSelecionadas.includes(s)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEstruturasSelecionadas(prev => [...prev, s]);
                    } else {
                      setEstruturasSelecionadas(prev => prev.filter(item => item !== s));
                    }
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={() => {
              if (estruturasSelecionadas.length === 0) {
                alert("Por favor, selecione pelo menos uma estrutura!");
                return;
              }
              registrarRespostaUsuario(estruturasSelecionadas.join(", "));
              avancar(estruturasSelecionadas.join(", "));
            }}
            disabled={estruturasSelecionadas.length === 0}
            className="w-full bg-green-700 hover:bg-green-800"
          >
            Continuar ({estruturasSelecionadas.length} selecionadas)
          </Button>
        </div>
      );
    }

    if (campoAtual === "recurso_hidrico") {
      return (
        <div className="space-y-3 pt-2">
          <div className="text-sm text-gray-600">
            Selecione todos os recursos hídricos disponíveis:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {chaves.map((s) => (
              <label key={s} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recursosHidricosSelecionados.includes(s)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setRecursosHidricosSelecionados(prev => [...prev, s]);
                    } else {
                      setRecursosHidricosSelecionados(prev => prev.filter(item => item !== s));
                    }
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={() => {
              if (recursosHidricosSelecionados.length === 0) {
                alert("Por favor, selecione pelo menos um recurso hídrico!");
                return;
              }
              registrarRespostaUsuario(recursosHidricosSelecionados.join(", "));
              avancar(recursosHidricosSelecionados.join(", "));
            }}
            disabled={recursosHidricosSelecionados.length === 0}
            className="w-full bg-green-700 hover:bg-green-800"
          >
            Continuar ({recursosHidricosSelecionados.length} selecionados)
          </Button>
        </div>
      );
    }

    if (campoAtual === "energia") {
      return (
        <div className="space-y-3 pt-2">
          <div className="text-sm text-gray-600">
            Selecione todos os tipos de energia disponíveis:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {chaves.map((s) => (
              <label key={s} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={energiasSelecionadas.includes(s)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setEnergiasSelecionadas(prev => [...prev, s]);
                    } else {
                      setEnergiasSelecionadas(prev => prev.filter(item => item !== s));
                    }
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={() => {
              if (energiasSelecionadas.length === 0) {
                alert("Por favor, selecione pelo menos um tipo de energia!");
                return;
              }
              registrarRespostaUsuario(energiasSelecionadas.join(", "));
              avancar(energiasSelecionadas.join(", "));
            }}
            disabled={energiasSelecionadas.length === 0}
            className="w-full bg-green-700 hover:bg-green-800"
          >
            Continuar ({energiasSelecionadas.length} selecionados)
          </Button>
        </div>
      );
    }

    if (campoAtual === "tipo_solo") {
      return (
        <div className="space-y-3 pt-2">
          <div className="text-sm text-gray-600">
            Selecione todos os tipos de solo presentes:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {chaves.map((s) => (
              <label key={s} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={solosSelecionados.includes(s)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSolosSelecionados(prev => [...prev, s]);
                    } else {
                      setSolosSelecionados(prev => prev.filter(item => item !== s));
                    }
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={() => {
              if (solosSelecionados.length === 0) {
                alert("Por favor, selecione pelo menos um tipo de solo!");
                return;
              }
              registrarRespostaUsuario(solosSelecionados.join(", "));
              avancar(solosSelecionados.join(", "));
            }}
            disabled={solosSelecionados.length === 0}
            className="w-full bg-green-700 hover:bg-green-800"
          >
            Continuar ({solosSelecionados.length} selecionados)
          </Button>
        </div>
      );
    }

    if (campoAtual === "finalidade") {
      return (
        <div className="space-y-3 pt-2">
          <div className="text-sm text-gray-600">
            Selecione todas as finalidades da propriedade:
          </div>
          <div className="grid grid-cols-2 gap-2">
            {chaves.map((s) => (
              <label key={s} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={finalidadesSelecionadas.includes(s)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setFinalidadesSelecionadas(prev => [...prev, s]);
                    } else {
                      setFinalidadesSelecionadas(prev => prev.filter(item => item !== s));
                    }
                  }}
                  className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm">{s}</span>
              </label>
            ))}
          </div>
          <Button
            onClick={() => {
              if (finalidadesSelecionadas.length === 0) {
                alert("Por favor, selecione pelo menos uma finalidade!");
                return;
              }
              registrarRespostaUsuario(finalidadesSelecionadas.join(", "));
              avancar(finalidadesSelecionadas.join(", "));
            }}
            disabled={finalidadesSelecionadas.length === 0}
            className="w-full bg-green-700 hover:bg-green-800"
          >
            Continuar ({finalidadesSelecionadas.length} selecionadas)
          </Button>
        </div>
      );
    }
    
    return (
      <div className="flex flex-wrap gap-2 pt-2">
        {chaves.map((s) => (
          <Badge
            key={s}
            className="cursor-pointer bg-green-50 text-green-700 hover:bg-green-100"
            onClick={() => {
              registrarRespostaUsuario(s);
              avancar(s);
            }}
          >
            {s}
          </Badge>
        ))}
      </div>
    );
  }

  function Resumo() {
    if (!confirmando) return null;
    return (
      <div className="mt-3 space-y-3">
        <div className="text-sm bg-gray-50 border rounded p-3 space-y-1">
          <div><span className="text-gray-500">Título:</span> <strong>{dados.titulo as any}</strong></div>
          <div><span className="text-gray-500">Endereço:</span> <strong>{dados.endereco_completo as any}</strong></div>
          {coordenadas && (
            <div className="bg-green-50 border border-green-200 rounded p-3 mt-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-700 text-xs font-semibold">✅ Localização validada no Google Maps</span>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${coordenadas}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-xs underline"
                >
                  Ver no mapa 🗺️
                </a>
              </div>
              <div className="text-xs text-gray-600">
                📍 Coordenadas: {coordenadas}
              </div>
              
              {/* Preview do mapa */}
              <div className="mt-3 rounded overflow-hidden border border-green-300">
                <iframe
                  width="100%"
                  height="150"
                  frameBorder="0"
                  style={{ border: 0 }}
                  referrerPolicy="no-referrer-when-downgrade"
                  src={`https://maps.google.com/maps?q=${coordenadas}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
          <div><span className="text-gray-500">Cidade/UF:</span> <strong>{dados.cidade as any} / {dados.estado as any}</strong></div>
          <div><span className="text-gray-500">Finalidade:</span> <strong>{Array.isArray(dados.finalidade) ? dados.finalidade.join(", ") : dados.finalidade as any}</strong></div>
          <div><span className="text-gray-500">Área:</span> <strong>{dados.area as any} ha</strong></div>
          <div><span className="text-gray-500">Oferta:</span> <strong>{dados.tipo_oferta as any}</strong></div>
          <div>
            <span className="text-gray-500">Preço:</span>{" "}
            <strong>
              {(() => {
                const precoTexto = String(dados.preco || "");
                const precoNum = converterTextoParaNumero(precoTexto) ?? extrairNumero(precoTexto);
                return precoNum !== null
                  ? `R$ ${precoNum.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                  : precoTexto;
              })()}
            </strong>
          </div>
          <div><span className="text-gray-500">Água:</span> <strong>{Array.isArray(dados.recurso_hidrico) ? dados.recurso_hidrico.join(", ") : dados.recurso_hidrico as any}</strong></div>
          <div><span className="text-gray-500">Energia:</span> <strong>{Array.isArray(dados.energia) ? dados.energia.join(", ") : dados.energia as any}</strong></div>
          <div><span className="text-gray-500">Solo:</span> <strong>{Array.isArray(dados.tipo_solo) ? dados.tipo_solo.join(", ") : dados.tipo_solo as any}</strong></div>
          <div><span className="text-gray-500">Documentação:</span> <strong>{dados.documentacao as any}</strong></div>
          <div><span className="text-gray-500">Estruturas:</span> <strong>{Array.isArray(dados.estruturas) ? dados.estruturas.join(", ") : dados.estruturas as any}</strong></div>
        </div>
        
        {/* Seção de Upload de Imagens */}
        <div className="text-sm bg-blue-50 border border-blue-200 rounded p-3">
          <div className="font-medium text-blue-800 mb-2">📸 Imagens da Propriedade (OBRIGATÓRIO)</div>
          <div className="text-blue-600 text-xs mb-3">
            Selecione pelo menos uma imagem da propriedade para o anúncio.
          </div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => setImagensSelecionadas(e.target.files)}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagensSelecionadas && imagensSelecionadas.length > 0 && (
            <div className="mt-2 text-green-600 text-xs">
              ✅ {imagensSelecionadas.length} imagem(ns) selecionada(s)
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <Sparkles className="h-5 w-5" /> Cadastrar com Agente IA
          </DialogTitle>
          <DialogDescription>
            Vou te fazer perguntas simples para preencher o formulário automaticamente. No fim, você confirma e eu salvo no sistema.
          </DialogDescription>
        </DialogHeader>

        <div ref={scrollRef} className="max-h-[50vh] overflow-y-auto pr-1">
          <div className="space-y-3">
            {messages.map((m, idx) => (
              <div key={idx} className={m.role === "assistant" ? "text-sm" : "text-sm text-right"}>
                <div className={
                  m.role === "assistant"
                    ? "inline-block bg-gray-50 border rounded px-3 py-2"
                    : "inline-block bg-green-600 text-white rounded px-3 py-2"
                }>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          {!confirmando && (
            <div className="mt-3">
              <div className="text-xs text-gray-500 mb-1">{perguntaDoCampo}</div>
              <QuickReplies />
            </div>
          )}
          <Resumo />
        </div>

        {!confirmando ? (
          <div className="flex items-center gap-2 pt-2">
            <Input
              placeholder={campoAtual === 'preco' ? 'Digite apenas números (ex.: 1500000)' : 'Digite sua resposta...'}
              inputMode={campoAtual === 'preco' ? 'numeric' : undefined}
              value={input}
              onChange={(e) => {
                let valor = e.target.value;
                if (campoAtual === 'preco') {
                  // manter apenas dígitos
                  const digitos = valor.replace(/\D/g, '');
                  // formatar com separador de milhar conforme digita
                  const numero = digitos ? Number(digitos) : 0;
                  valor = digitos ? numero.toLocaleString('pt-BR') : '';
                }
                setInput(valor);
              }}
              onKeyDown={(e) => {
                if (campoAtual === 'preco') {
                  // permitir apenas controle, backspace, delete e dígitos
                  const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End', 'Enter'];
                  if (!allowed.includes(e.key) && !/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                  }
                }
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend} disabled={loading || !input.trim()} className="bg-green-700 hover:bg-green-800">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enviar"}
            </Button>
          </div>
        ) : (
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Voltar</Button>
            </DialogClose>
            <Button 
              onClick={confirmarCadastro} 
              disabled={loading || !imagensSelecionadas || imagensSelecionadas.length === 0} 
              className="bg-green-700 hover:bg-green-800"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Cadastrando...
                </>
              ) : (
                <>
                  {!imagensSelecionadas || imagensSelecionadas.length === 0 ? (
                    "⚠️ Selecione as imagens primeiro"
                  ) : (
                    `✅ Confirmar e Cadastrar (${imagensSelecionadas.length} imagens)`
                  )}
                </>
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}


