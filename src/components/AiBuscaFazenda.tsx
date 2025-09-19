"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Send, User, ChevronRight, Map, Home as HomeIcon, GanttChart, Wheat, Trees, Leaf } from "lucide-react";
import Image from "next/image";
import openaiService from "@/services/openaiService";
import { Anuncio } from "@/services/anunciosService";
import Link from "next/link";

// A chave da API será obtida das variáveis de ambiente

interface AiBuscaFazendaProps {
  anuncios: Anuncio[];
  onResultadosBusca?: (resultados: Anuncio[]) => void;
}

interface Mensagem {
  role: 'system' | 'user' | 'assistant';
  content: string;
  anuncios?: Anuncio[];
}

export default function AiBuscaFazenda({ anuncios, onResultadosBusca }: AiBuscaFazendaProps) {
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    {
      role: 'assistant',
      content: 'Olá, eu sou o Fazendeiro IA! 👨‍🌾 Estou aqui para ajudar você a encontrar a propriedade rural dos seus sonhos. Me conte o que você está procurando e eu encontrarei as melhores opções para você. \n\nPor exemplo, você pode dizer algo como:\n\n• "Procuro uma fazenda para pecuária em Minas Gerais"\n• "Quero um sítio próximo a São Paulo com nascente"\n• "Busco uma chácara pequena para plantar café"\n\nEntão, o que você está buscando hoje?'
    }
  ]);
  const [input, setInput] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Função para rolar o chat para baixo quando novas mensagens são adicionadas
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [mensagens]);
  
  // Função para enviar mensagem e obter resposta da IA
  const enviarMensagem = async () => {
    if (!input.trim() || carregando) return;
    
    const mensagemUsuario = input;
    setInput('');
    setCarregando(true);
    
    // Adicionar mensagem do usuário ao chat
    const novasMensagens = [
      ...mensagens,
      { role: 'user', content: mensagemUsuario }
    ];
    setMensagens(novasMensagens);
    
    try {
      console.log("Iniciando processamento da solicitação...");
      
      // Buscar anúncios baseados na descrição do usuário
      console.log("Buscando anúncios...");
      const resultados = await openaiService.buscarAnunciosPorDescricao(mensagemUsuario, anuncios);
      console.log(`Encontrados ${resultados.length} anúncios relevantes`);
      
      // Gerar resposta para o chat
      console.log("Gerando resposta para o chat...");
      const resposta = await openaiService.gerarRespostaChat(novasMensagens, anuncios);
      console.log("Resposta gerada com sucesso");
      
      // Adicionar resposta do assistente ao chat com os anúncios recomendados
      setMensagens([
        ...novasMensagens, 
        { 
          role: 'assistant', 
          content: resposta,
          anuncios: resultados.length > 0 ? resultados : undefined
        }
      ]);
      
      // Atualizar resultados no componente pai, se fornecido
      if (resultados.length > 0 && onResultadosBusca) {
        onResultadosBusca(resultados);
        setMostrarResultados(true);
      }
    } catch (error) {
      console.error('Erro ao processar a solicitação:', error);
      
      // Exibir mais detalhes do erro para depuração
      if (error instanceof Error) {
        console.error('Detalhes do erro:', error.message);
        console.error('Stack trace:', error.stack);
      }
      
      setMensagens([
        ...novasMensagens, 
        { 
          role: 'assistant', 
          content: 'Desculpe, ocorreu um erro ao conectar com a IA. Verifique o console para mais detalhes ou tente novamente mais tarde.' 
        }
      ]);
    } finally {
      setCarregando(false);
    }
  };
  
  // Função para lidar com o envio ao pressionar Enter
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      enviarMensagem();
    }
  };
  
  return (
    <div className="flex flex-col h-full min-h-[80vh] bg-gradient-to-b from-green-50 to-white">
      {/* Cabeçalho */}
      <header className="border-b border-green-100 bg-white bg-opacity-80 backdrop-blur-md py-3 sm:py-4 px-3 sm:px-6 flex items-center justify-center shadow-sm">
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="bg-gradient-to-br from-green-600 to-green-800 text-white p-1.5 sm:p-2 rounded-lg flex items-center justify-center">
            <Image 
              src="/images/fazendeiro-ia-logo.png" 
              alt="Logo Fazendeiro IA" 
              width={20} 
              height={20} 
              className="h-5 w-5 sm:h-6 sm:w-6 object-contain"
              unoptimized
            />
          </span>
          <h1 className="text-lg sm:text-xl font-semibold bg-gradient-to-r from-green-700 to-green-900 text-transparent bg-clip-text">Fazendeiro IA</h1>
        </div>
      </header>
      
      {/* Área principal */}
      <div className="flex-1 overflow-hidden flex flex-col relative">
        {/* Elementos decorativos */}
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
          <div className="absolute top-10 left-10 opacity-5">
            <Wheat className="h-32 w-32 text-green-800 transform -rotate-12" />
          </div>
          <div className="absolute bottom-10 right-10 opacity-5">
            <Trees className="h-40 w-40 text-green-800" />
          </div>
          <div className="absolute top-1/3 right-20 opacity-5">
            <Leaf className="h-24 w-24 text-green-700 transform rotate-45" />
          </div>
        </div>
        
        {/* Área de mensagens */}
        <div 
          ref={chatContainerRef}
          className="flex-1 p-2 sm:p-4 md:p-6 overflow-y-auto space-y-4 sm:space-y-6 relative z-10"
        >
          {mensagens.map((msg, index) => (
            <div key={index} className="max-w-4xl mx-auto w-full">
              <div 
                className={`flex items-start gap-2 sm:gap-4 ${
                  msg.role === 'user' ? 'justify-end md:justify-start' : ''
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 bg-gradient-to-br from-green-100 to-green-200 text-green-700 p-1.5 sm:p-2 rounded-lg shadow-sm flex items-center justify-center">
                    <Image 
                      src="/images/fazendeiro-ia-logo.png" 
                      alt="Logo Fazendeiro IA" 
                      width={16} 
                      height={16} 
                      className="h-4 w-4 sm:h-5 sm:w-5 object-contain"
                      unoptimized
                    />
                  </div>
                )}
                
                <div className={`flex-1 max-w-3xl space-y-1 sm:space-y-2 ${msg.role === 'assistant' ? 'bg-white border border-green-100 p-2 sm:p-4 rounded-lg shadow-sm' : ''}`}>
                  <div className={`font-medium text-xs sm:text-sm ${msg.role === 'assistant' ? 'text-green-800' : 'text-blue-700'}`}>
                    {msg.role === 'assistant' ? 'Fazendeiro IA' : 'Você'}
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    {msg.content.split('\n').map((line, i) => (
                      <p key={i} className={`mb-1 sm:mb-2 text-xs sm:text-sm ${msg.role === 'assistant' ? 'text-gray-800' : 'text-gray-700'}`}>
                        {line}
                      </p>
                    ))}
                  </div>
                  
                  {/* Mostrar cards de resultados quando houver anúncios na mensagem - versão mobile friendly */}
                  {msg.anuncios && msg.anuncios.length > 0 && (
                    <div className="mt-3 sm:mt-4 pt-2 sm:pt-4 border-t border-green-100">
                      <h3 className="text-xs sm:text-sm font-medium text-green-800 mb-2 sm:mb-3 flex items-center">
                        <Wheat className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-green-600" />
                        Propriedades que podem te interessar:
                      </h3>
                      <div className="grid grid-cols-1 gap-2 sm:gap-3">
                        {msg.anuncios.map(anuncio => (
                          <Link 
                            key={anuncio.id} 
                            href={`/portal/anuncio/${anuncio.id}`}
                            className="flex items-center p-2 sm:p-3 bg-white rounded-lg border border-green-100 hover:bg-green-50 hover:border-green-300 transition-colors shadow-sm"
                          >
                            <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 rounded-md bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center mr-2 sm:mr-3 text-green-700">
                              {anuncio.categoria === 'Fazenda' ? (
                                <GanttChart className="h-5 w-5 sm:h-6 sm:w-6" />
                              ) : anuncio.categoria === 'Sítio' ? (
                                <HomeIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                              ) : (
                                <Map className="h-5 w-5 sm:h-6 sm:w-6" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm sm:text-base text-gray-900 truncate">{anuncio.titulo}</h4>
                              <div className="flex flex-col sm:flex-row sm:items-center gap-0 sm:gap-3 text-xs sm:text-sm text-gray-600">
                                <span className="truncate">{anuncio.categoria} • {anuncio.detalhes?.area || '?'} hectares</span>
                                <span className="hidden sm:inline">•</span>
                                <span className="truncate">{anuncio.detalhes?.cidade || ''}, {anuncio.detalhes?.estado || ''}</span>
                              </div>
                            </div>
                            <div className="ml-2 sm:ml-3 text-green-700 font-medium text-xs sm:text-sm whitespace-nowrap">
                              {anuncio.preco}
                              <ChevronRight className="inline h-3 w-3 sm:h-4 sm:w-4 ml-1" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {msg.role === 'user' && (
                  <div className="flex-shrink-0 bg-blue-100 text-blue-600 p-1.5 sm:p-2 rounded-lg">
                    <User className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {carregando && (
            <div className="max-w-3xl mx-auto">
              <div className="flex items-start gap-2 sm:gap-4">
                <div className="flex-shrink-0 bg-gradient-to-br from-green-100 to-green-200 text-green-700 p-1.5 sm:p-2 rounded-lg shadow-sm flex items-center justify-center">
                  <Image 
                    src="/images/fazendeiro-ia-logo.png" 
                    alt="Logo Fazendeiro IA" 
                    width={16} 
                    height={16} 
                    className="h-4 w-4 sm:h-5 sm:w-5 object-contain"
                    unoptimized
                  />
                </div>
                <div className="py-2 sm:py-3 px-3 sm:px-4 bg-white border border-green-100 rounded-lg text-gray-600 flex items-center space-x-2 shadow-sm">
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-green-600" />
                  <span className="text-xs sm:text-sm">Analisando os melhores terrenos para você...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Área de input - versão mobile friendly */}
        <div className="border-t border-green-100 bg-white bg-opacity-90 backdrop-blur-md p-2 sm:p-4 md:px-6 md:py-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <form 
              className="flex space-x-1 sm:space-x-2 bg-white border border-green-200 rounded-lg focus-within:ring-2 focus-within:ring-green-500 focus-within:border-green-500 shadow-sm"
              onSubmit={(e) => {
                e.preventDefault();
                enviarMensagem();
              }}
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Descreva a propriedade rural que você procura..."
                disabled={carregando}
                className="flex-1 border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm"
              />
              <Button 
                type="submit"
                disabled={!input.trim() || carregando}
                variant="ghost"
                size="icon"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <Send className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </form>
            <p className="text-xs mt-1 sm:mt-2 text-center flex items-center justify-center text-gray-500">
              <Wheat className="h-2 w-2 sm:h-3 sm:w-3 mr-1 text-green-600" />
              Descreva em detalhes o que você procura em uma propriedade rural
              <Wheat className="h-2 w-2 sm:h-3 sm:w-3 ml-1 text-green-600" />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 