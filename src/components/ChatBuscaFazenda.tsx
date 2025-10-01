"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import anunciosService, { Anuncio } from "@/services/anunciosService";
import Link from "next/link";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ChatMessage = { role: "assistant" | "user"; content: string };

type FiltrosBusca = {
  estado?: string;
  cidade?: string;
  finalidade?: string;
  precoMax?: number;
  areaMin?: number;
  tipo_oferta?: 'venda' | 'arrendamento';
};

const MENSAGEM_INICIAL = `Olá! Sou o Fazendeiro IA 🌾

Estou aqui para te ajudar a encontrar a propriedade rural perfeita! 

Pode me contar o que você está procurando? Por exemplo:
• "Quero uma fazenda para gado em Minas Gerais"
• "Procuro um sítio pequeno perto de São Paulo"
• "Busco terra para agricultura no sul do país"

Me fale sobre o que você precisa que eu vou buscar as melhores opções!`;

const ESTADOS_SIGLAS: Record<string, string> = {
  'sp': 'SP', 'são paulo': 'SP', 'sao paulo': 'SP',
  'mg': 'MG', 'minas': 'MG', 'minas gerais': 'MG',
  'rj': 'RJ', 'rio': 'RJ', 'rio de janeiro': 'RJ',
  'go': 'GO', 'goiás': 'GO', 'goias': 'GO',
  'mt': 'MT', 'mato grosso': 'MT',
  'ms': 'MS', 'mato grosso do sul': 'MS',
  'pr': 'PR', 'paraná': 'PR', 'parana': 'PR',
  'rs': 'RS', 'rio grande do sul': 'RS',
  'ba': 'BA', 'bahia': 'BA',
  'sc': 'SC', 'santa catarina': 'SC',
};

export default function ChatBuscaFazenda({ open, onOpenChange }: Props) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [filtros, setFiltros] = useState<FiltrosBusca>({});
  const [resultados, setResultados] = useState<Anuncio[]>([]);
  const [buscaRealizada, setBuscaRealizada] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      // Inicia a conversa
      setMessages([
        {
          role: "assistant",
          content: MENSAGEM_INICIAL,
        },
      ]);
      setFiltros({});
      setResultados([]);
      setBuscaRealizada(false);
    }
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  // Extrair informações da mensagem do usuário
  const analisarMensagem = (mensagem: string): FiltrosBusca => {
    const texto = mensagem.toLowerCase();
    const filtrosExtraidos: FiltrosBusca = {};

    // Detectar estado
    for (const [key, sigla] of Object.entries(ESTADOS_SIGLAS)) {
      if (texto.includes(key)) {
        filtrosExtraidos.estado = sigla;
        break;
      }
    }

    // Detectar cidade (palavras que podem ser cidades)
    const palavrasCidade = mensagem.split(' ').filter(p => 
      p.length > 3 && 
      !['para', 'com', 'uma', 'fazenda', 'sitio', 'chacara', 'gado', 'plantar'].includes(p.toLowerCase())
    );
    if (palavrasCidade.length > 0) {
      filtrosExtraidos.cidade = palavrasCidade[0];
    }

    // Detectar finalidade
    if (texto.includes('gado') || texto.includes('pecuária') || texto.includes('pecuaria') || texto.includes('boi') || texto.includes('vaca')) {
      filtrosExtraidos.finalidade = 'Pecuária';
    } else if (texto.includes('agricultura') || texto.includes('plantar') || texto.includes('plantação') || texto.includes('lavoura')) {
      filtrosExtraidos.finalidade = 'Agricultura';
    } else if (texto.includes('lazer') || texto.includes('descanso') || texto.includes('fim de semana')) {
      filtrosExtraidos.finalidade = 'Lazer';
    } else if (texto.includes('misto') || texto.includes('mista')) {
      filtrosExtraidos.finalidade = 'Misto';
    }

    // Detectar tipo de oferta
    if (texto.includes('arrendamento') || texto.includes('arrendar') || texto.includes('alugar') || texto.includes('aluguel')) {
      filtrosExtraidos.tipo_oferta = 'arrendamento';
    } else if (texto.includes('comprar') || texto.includes('compra') || texto.includes('venda')) {
      filtrosExtraidos.tipo_oferta = 'venda';
    }

    // Detectar valores numéricos
    const numeros = mensagem.match(/\d+/g);
    if (numeros) {
      const valores = numeros.map(n => parseInt(n));
      
      // Se tem número grande, provavelmente é preço
      const numeroGrande = valores.find(v => v > 1000);
      if (numeroGrande) {
        filtrosExtraidos.precoMax = numeroGrande;
      }
      
      // Se tem número pequeno, pode ser área
      const numeroPequeno = valores.find(v => v > 0 && v < 10000);
      if (numeroPequeno && numeroPequeno !== numeroGrande) {
        filtrosExtraidos.areaMin = numeroPequeno;
      }
    }

    return filtrosExtraidos;
  };

  // Verificar se tem informações suficientes para buscar
  const temInformacoesSuficientes = (filtros: FiltrosBusca): boolean => {
    return !!(filtros.estado || filtros.cidade || filtros.finalidade || filtros.tipo_oferta);
  };

  // Gerar resposta natural da IA
  const gerarRespostaNatural = (filtrosNovos: FiltrosBusca, mensagemUsuario: string): string => {
    const texto = mensagemUsuario.toLowerCase();
    
    // Saudações
    if (texto.includes('oi') || texto.includes('olá') || texto.includes('bom dia') || texto.includes('boa tarde')) {
      return "Olá! Que bom ter você aqui! 😊\n\nPode me contar o que você está procurando? Qual tipo de propriedade rural te interessa?";
    }

    // Se extraiu informações, confirmar e perguntar se quer buscar ou dar mais detalhes
    if (temInformacoesSuficientes(filtrosNovos)) {
      let resposta = "Entendi! ";
      
      if (filtrosNovos.finalidade) {
        resposta += `Você está procurando uma propriedade para ${filtrosNovos.finalidade.toLowerCase()}`;
      }
      if (filtrosNovos.estado) {
        resposta += ` no estado de ${filtrosNovos.estado}`;
      }
      if (filtrosNovos.cidade) {
        resposta += `, região de ${filtrosNovos.cidade}`;
      }
      if (filtrosNovos.tipo_oferta) {
        resposta += ` para ${filtrosNovos.tipo_oferta}`;
      }
      if (filtrosNovos.areaMin) {
        resposta += ` com pelo menos ${filtrosNovos.areaMin} hectares`;
      }
      
      resposta += ".\n\nJá posso buscar para você ou gostaria de especificar mais alguma coisa? (Digite 'buscar' para eu procurar agora)";
      
      return resposta;
    }

    // Se não extraiu nada relevante, pedir mais informações
    return "Hmm, não consegui identificar exatamente o que você procura. 🤔\n\nPode me dar mais detalhes? Por exemplo:\n• Em qual estado ou cidade?\n• Para que vai usar a propriedade? (pecuária, agricultura, lazer)\n• Prefere comprar ou arrendar?";
  };

  const buscarFazendas = async (filtrosBusca: FiltrosBusca) => {
    setBuscando(true);
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: "🔍 Perfeito! Deixa eu buscar as melhores opções para você..." },
    ]);

    try {
      // Buscar todos os anúncios ativos
      const todosAnuncios = await anunciosService.getAnuncios();
      const anunciosAtivos = todosAnuncios?.filter(anuncio => anuncio.status === "Ativo") || [];

      // Aplicar filtros
      let anunciosFiltrados = anunciosAtivos;

      if (filtrosBusca.estado) {
        anunciosFiltrados = anunciosFiltrados.filter(
          a => a.detalhes?.estado?.toUpperCase() === filtrosBusca.estado?.toUpperCase()
        );
      }

      if (filtrosBusca.cidade) {
        anunciosFiltrados = anunciosFiltrados.filter(
          a => a.detalhes?.cidade?.toLowerCase().includes(filtrosBusca.cidade?.toLowerCase() || "")
        );
      }

      if (filtrosBusca.finalidade) {
        anunciosFiltrados = anunciosFiltrados.filter(
          a => a.detalhes?.finalidade?.toLowerCase().includes(filtrosBusca.finalidade?.toLowerCase() || "")
        );
      }

      if (filtrosBusca.tipo_oferta) {
        anunciosFiltrados = anunciosFiltrados.filter(
          a => a.detalhes?.tipo_oferta === filtrosBusca.tipo_oferta
        );
      }

      if (filtrosBusca.precoMax) {
        anunciosFiltrados = anunciosFiltrados.filter(a => {
          const preco = parseInt(a.preco?.replace(/[^0-9]/g, "") || "0");
          return preco <= (filtrosBusca.precoMax || 0);
        });
      }

      if (filtrosBusca.areaMin) {
        anunciosFiltrados = anunciosFiltrados.filter(
          a => (a.detalhes?.area || 0) >= (filtrosBusca.areaMin || 0)
        );
      }

      setResultados(anunciosFiltrados);
      setBuscaRealizada(true);

      // Mostrar resultado
      if (anunciosFiltrados.length === 0) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `😔 Infelizmente não encontrei fazendas disponíveis na região de ${filtrosBusca.cidade || filtrosBusca.estado} com os critérios que você informou.\n\nMas não desanime! Novas propriedades são cadastradas regularmente. Gostaria de:\n\n1. Tentar uma nova busca com critérios diferentes?\n2. Ver todas as fazendas disponíveis no portal?`,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: `🎉 Ótima notícia! Encontrei ${anunciosFiltrados.length} fazenda(s) que correspondem ao que você procura!\n\nVeja abaixo as propriedades selecionadas especialmente para você:`,
          },
        ]);
      }
    } catch (error) {
      console.error("Erro ao buscar fazendas:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Ops! Ocorreu um erro ao buscar as fazendas. Pode tentar novamente?",
        },
      ]);
    } finally {
      setBuscando(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading || buscando || buscaRealizada) return;
    
    const texto = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: texto }]);
    setLoading(true);

    // Simular delay de digitação
    await new Promise(resolve => setTimeout(resolve, 800));

    // Analisar a mensagem do usuário
    const filtrosExtraidos = analisarMensagem(texto);
    const novosFiltros = { ...filtros, ...filtrosExtraidos };
    setFiltros(novosFiltros);

    // Verificar se o usuário pediu para buscar
    if (texto.toLowerCase().includes('buscar') || texto.toLowerCase().includes('busque') || texto.toLowerCase().includes('procurar') || texto.toLowerCase().includes('mostre')) {
      if (temInformacoesSuficientes(novosFiltros)) {
        setLoading(false);
        buscarFazendas(novosFiltros);
        return;
      } else {
        const resposta = "Para fazer a busca, preciso de pelo menos uma informação sobre:\n• Localização (estado ou cidade)\n• Finalidade da propriedade\n• Se é compra ou arrendamento\n\nPode me dar mais detalhes?";
        setMessages((prev) => [...prev, { role: "assistant", content: resposta }]);
        setLoading(false);
        return;
      }
    }

    // Gerar resposta natural
    const resposta = gerarRespostaNatural(novosFiltros, texto);
    setMessages((prev) => [...prev, { role: "assistant", content: resposta }]);
    setLoading(false);
  };

  const reiniciarBusca = () => {
    setMessages([
      {
        role: "assistant",
        content: MENSAGEM_INICIAL,
      },
    ]);
    setFiltros({});
    setResultados([]);
    setBuscaRealizada(false);
  };

  // Sugestões rápidas contextuais
  const SugestoesRapidas = () => {
    if (buscaRealizada || buscando || messages.length > 3) return null;

    const sugestoes = [
      "Fazenda para pecuária em MG",
      "Sítio perto de SP",
      "Terra para agricultura no MT",
      "Propriedade para lazer"
    ];

    return (
      <div className="flex flex-wrap gap-2 pt-3">
        <div className="text-xs text-gray-500 w-full mb-1">💡 Sugestões:</div>
        {sugestoes.map((s) => (
          <Badge
            key={s}
            className="cursor-pointer bg-green-50 text-green-700 hover:bg-green-100 transition-all border border-green-200"
            onClick={() => {
              setInput(s);
            }}
          >
            {s}
          </Badge>
        ))}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <MessageCircle className="h-5 w-5" /> Fazendeiro IA - Busca Inteligente
          </DialogTitle>
          <DialogDescription>
            Converse comigo e eu vou encontrar a fazenda perfeita para você!
          </DialogDescription>
        </DialogHeader>

        <div ref={scrollRef} className="flex-1 overflow-y-auto pr-2 space-y-3 min-h-[400px] max-h-[500px]">
          {messages.map((m, idx) => (
            <div key={idx} className={m.role === "assistant" ? "text-sm" : "text-sm text-right"}>
              <div
                className={
                  m.role === "assistant"
                    ? "inline-block bg-gray-50 border rounded-lg px-4 py-3 max-w-[85%]"
                    : "inline-block bg-green-600 text-white rounded-lg px-4 py-3 max-w-[85%]"
                }
              >
                <div className="whitespace-pre-line">{m.content}</div>
              </div>
            </div>
          ))}

          {!buscaRealizada && !buscando && <SugestoesRapidas />}

          {buscando && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-green-600" />
              <span className="ml-2 text-gray-600">Buscando fazendas...</span>
            </div>
          )}

          {/* Resultados da busca */}
          {buscaRealizada && resultados.length > 0 && (
            <div className="space-y-3 mt-4">
              {resultados.map((anuncio) => (
                <Link key={anuncio.id} href={`/portal/anuncio/${anuncio.id}`}>
                  <div className="border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer bg-white">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-gray-900">{anuncio.titulo}</h3>
                      <Badge className="bg-green-600">{anuncio.preco}</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>📍 {anuncio.detalhes?.cidade}, {anuncio.detalhes?.estado}</p>
                      <p>🌾 {anuncio.detalhes?.finalidade} • {anuncio.detalhes?.area} ha</p>
                      <p className="text-xs text-gray-500">{anuncio.detalhes?.tipo_oferta === 'venda' ? 'Venda' : 'Arrendamento'}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {buscaRealizada ? (
          <div className="flex gap-2 pt-4 border-t">
            <Button onClick={reiniciarBusca} variant="outline" className="flex-1">
              🔄 Nova Busca
            </Button>
            <Button onClick={() => onOpenChange(false)} className="flex-1 bg-green-700 hover:bg-green-800">
              ✅ Fechar
            </Button>
          </div>
        ) : (
          <div className="space-y-2 pt-4 border-t">
            {/* Botão de buscar se já tem info suficiente */}
            {temInformacoesSuficientes(filtros) && !buscando && (
              <Button
                onClick={() => buscarFazendas(filtros)}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
              >
                🔍 Buscar Propriedades Agora
              </Button>
            )}
            
            {/* Input de mensagem */}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Digite sua mensagem..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                disabled={loading || buscando}
              />
              <Button
                onClick={handleSend}
                disabled={loading || !input.trim() || buscando}
                size="icon"
                className="bg-green-700 hover:bg-green-800"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
