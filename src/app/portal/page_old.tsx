"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowLeft, Tractor, Wheat, Leaf, Trees, ChevronRight, MessageCircle } from "lucide-react";
import anunciosService, { Anuncio } from "@/services/anunciosService";
import ChatBuscaFazenda from "@/components/ChatBuscaFazenda";
import Image from "next/image";

export default function PortalPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [chatAberto, setChatAberto] = useState(false);
  
  // Carregar anúncios do Supabase
  useEffect(() => {
    const carregarAnuncios = async () => {
      setCarregando(true);
      try {
        const data = await anunciosService.getAnuncios();
        // Filtramos para mostrar apenas anúncios ativos no portal
        const anunciosAtivos = data?.filter(anuncio => anuncio.status === "Ativo") || [];
        setAnuncios(anunciosAtivos);
      } catch (error) {
        console.error("Erro ao carregar anúncios:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarAnuncios();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      {/* Header estilo Apple */}
      <header className="bg-white bg-opacity-80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:py-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center">
            <Link href="/" className="mr-2 sm:mr-4">
              <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-300">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <span className="bg-gradient-to-r from-green-600 to-green-800 text-transparent bg-clip-text">Fazendeiro IA</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Tecnologia e tradição para encontrar sua propriedade ideal</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/planos">
              <Button variant="ghost" size="sm" className="text-green-700 hover:bg-green-50 text-sm whitespace-nowrap">
                💎 Planos
              </Button>
            </Link>
          <Link href="/login">
              <Button variant="outline" size="sm" className="border-green-600 text-green-700 hover:bg-green-50 text-sm whitespace-nowrap">
                Área do Anunciante
              </Button>
          </Link>
          </div>
        </div>
      </header>
      
      {/* Principal */}
      <main className="flex-1 flex flex-col">
        {carregando ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-center max-w-md mx-auto px-4 py-12">
              <div className="relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="h-16 w-16 animate-spin text-green-500" />
                </div>
                <div className="relative h-24 flex items-center justify-center">
                  <Tractor className="h-24 w-24 text-gray-200" />
                </div>
              </div>
              <h2 className="mt-6 text-2xl font-bold text-gray-900">Preparando o terreno...</h2>
              <p className="mt-3 text-lg text-gray-600">Nosso Fazendeiro IA está se conectando ao banco de propriedades rurais para melhor atendê-lo.</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col">
            {/* Banner informativo */}
            <div className="relative overflow-hidden">
              {/* Fundo do banner com gradiente e padrão */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-800 to-green-900">
                <div className="absolute inset-0" style={{ 
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundSize: '30px 30px' 
                }}></div>
              </div>

              <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-6 md:py-10 relative">
                {/* Elementos decorativos - ocultando em telas muito pequenas */}
                <div className="absolute right-0 top-0 bottom-0 opacity-10 hidden sm:flex">
                  <Wheat className="h-32 sm:h-48 w-32 sm:w-48 text-white transform -rotate-12" />
                  <Trees className="h-40 sm:h-56 w-40 sm:w-56 text-white transform translate-x-8" />
                </div>
                <div className="absolute -bottom-6 -left-10 opacity-10 hidden sm:block">
                  <Tractor className="h-24 sm:h-32 w-24 sm:w-32 text-white transform rotate-6" />
                </div>
                
                <div className="max-w-2xl relative z-10">
                  {/* Badge Inovação - ajustada para telas pequenas */}
                  <div className="inline-flex items-center mb-3 sm:mb-4 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full bg-white bg-opacity-80 backdrop-blur-sm shadow-md">
                    <span className="flex h-2 sm:h-2.5 w-2 sm:w-2.5 rounded-full bg-green-400 mr-1.5 sm:mr-2"></span>
                    <span className="text-black font-bold text-xs sm:text-sm tracking-wide" style={{
                      textShadow: '0 0 5px rgba(0,255,0,0.3), 0 0 10px rgba(0,255,0,0.2)'
                    }}>
                      Inovação no Agronegócio
                    </span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white flex flex-wrap items-center gap-2 sm:gap-3">
                    Conheça o <span className="underline decoration-green-400 decoration-2 sm:decoration-4 underline-offset-4 flex items-center gap-1 sm:gap-2">
                      <Image 
                        src="/images/fazendeiro-ia-logo.png" 
                        alt="Logo Fazendeiro IA" 
                        width={28} 
                        height={28} 
                        className="bg-white rounded-lg p-1 object-contain" 
                        unoptimized
                      /> Fazendeiro IA
                    </span>
                  </h2>
                  <p className="mt-2 sm:mt-3 text-base sm:text-lg text-green-100 opacity-90">
                    Um assistente virtual especializado que combina inteligência artificial avançada com conhecimento profundo 
                    do mercado de propriedades rurais para encontrar o imóvel ideal para você.
                  </p>
                  
                  {/* Features com ícones - melhor distribuição para mobile */}
                  <div className="mt-5 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1.5 rounded-md bg-green-800 bg-opacity-60">
                        <Leaf className="h-5 w-5 text-white" style={{
                          filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 5px rgba(255,255,255,0.5))'
                        }} />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-white">Busca inteligente personalizada</p>
                        <p className="mt-1 text-green-100 opacity-80">Descreva em linguagem natural o que procura</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1.5 rounded-md bg-green-800 bg-opacity-60">
                        <Leaf className="h-5 w-5 text-white" style={{
                          filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 5px rgba(255,255,255,0.5))'
                        }} />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-white">Análise de requisitos específicos</p>
                        <p className="mt-1 text-green-100 opacity-80">Encontre propriedades que atendam exatamente suas necessidades</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1.5 rounded-md bg-green-800 bg-opacity-60">
                        <MessageCircle className="h-5 w-5 text-white" style={{
                          filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 5px rgba(255,255,255,0.5))'
                        }} />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-white">Conversação natural e intuitiva</p>
                        <p className="mt-1 text-green-100 opacity-80">Chat amigável que entende suas necessidades</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 p-1.5 rounded-md bg-green-800 bg-opacity-60">
                        <Leaf className="h-5 w-5 text-white" style={{
                          filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 5px rgba(255,255,255,0.5))'
                        }} />
                      </div>
                      <div className="ml-3">
                        <p className="font-medium text-white">Interface conversacional natural</p>
                        <p className="mt-1 text-green-100 opacity-80">Converse naturalmente como faria com um especialista</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* CTA - ajustando para mobile */}
                  <div className="mt-6 sm:mt-8 flex flex-wrap gap-3 sm:gap-4 items-center">
                    <button
                      className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-lg bg-white text-green-800 hover:bg-gray-100 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-800 shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
                      onClick={() => setChatAberto(true)}
                    >
                      <MessageCircle className="h-5 w-5" />
                      Conversar com o Fazendeiro IA
                    </button>
                    <Link href="/portal/sobre" className="text-xs sm:text-sm font-medium text-green-200 hover:text-white flex items-center">
                      Saiba mais sobre o Fazendeiro IA
                      <ChevronRight className="ml-1 h-3 w-3 sm:h-4 sm:w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Seção de Propriedades */}
            <div className="bg-gray-50 py-16">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header da Seção */}
                <div className="text-center mb-12">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-4">
                    <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2"></span>
                    {anuncios.length} Propriedades Disponíveis
                  </div>
                  <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                    Encontre Sua Propriedade Ideal
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Explore nossa seleção exclusiva de propriedades rurais ou converse com nosso assistente IA 
                    para encontrar a opção perfeita para você
                  </p>
                </div>
                
                {/* Grid de Cards Premium */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {anuncios.map((anuncio) => (
                    <Link key={anuncio.id} href={`/portal/anuncio/${anuncio.id}`}>
                      <div className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 h-full transform hover:-translate-y-2">
                        {/* Imagem com Overlay */}
                        <div className="relative h-56 bg-gradient-to-br from-green-600 via-green-700 to-green-900 overflow-hidden">
                          {/* Pattern de Fundo */}
                          <div className="absolute inset-0 opacity-10">
                            <div className="absolute inset-0" style={{
                              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                              backgroundSize: '30px 30px'
                            }}></div>
                          </div>
                          
                          {/* Ícone Central */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full p-8 transform group-hover:scale-110 transition-transform duration-500">
                              <Tractor className="h-16 w-16 text-white" />
                            </div>
                          </div>
                          
                          {/* Badge de Status */}
                          <div className="absolute top-4 right-4">
                            <Badge className="bg-white text-green-800 shadow-md font-semibold">
                              {anuncio.categoria}
                            </Badge>
                          </div>
                          
                          {/* Tipo de Oferta */}
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-900 bg-opacity-80 text-white backdrop-blur-sm">
                              {anuncio.detalhes?.tipo_oferta === 'venda' ? '💰 Venda' : '🔄 Arrendamento'}
                            </span>
                          </div>
                        </div>
                        
                        {/* Conteúdo do Card */}
                        <div className="p-6">
                          {/* Título */}
                          <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-green-700 transition-colors">
                            {anuncio.titulo}
                          </h3>
                          
                          {/* Localização */}
                          <div className="flex items-center text-gray-600 mb-4">
                            <svg className="h-5 w-5 mr-2 text-green-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                              <path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <span className="text-sm font-medium">
                              {anuncio.detalhes?.cidade}, {anuncio.detalhes?.estado}
                            </span>
                          </div>
                          
                          {/* Informações em Grid */}
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center text-gray-500 text-xs mb-1">
                                <Wheat className="h-3 w-3 mr-1" />
                                Área
                              </div>
                              <div className="text-sm font-bold text-gray-900">
                                {anuncio.detalhes?.area || "?"} ha
                              </div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center text-gray-500 text-xs mb-1">
                                <Leaf className="h-3 w-3 mr-1" />
                                Finalidade
                              </div>
                              <div className="text-sm font-bold text-gray-900 truncate">
                                {anuncio.detalhes?.finalidade || "Diversos"}
                              </div>
                            </div>
                          </div>
                          
                          {/* Preço e CTA */}
                          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                            <div>
                              <div className="text-xs text-gray-500 mb-1">Preço</div>
                              <div className="text-2xl font-bold text-green-700">
                                {anuncio.preco}
                              </div>
                            </div>
                            <div className="bg-green-600 text-white rounded-full p-3 transform group-hover:scale-110 group-hover:bg-green-700 transition-all duration-300">
                              <ChevronRight className="h-5 w-5" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                
                {/* Estado Vazio */}
                {anuncios.length === 0 && (
                  <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
                    <div className="bg-gray-100 rounded-full p-8 inline-block mb-6">
                      <Tractor className="h-20 w-20 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">
                      Nenhuma Propriedade Disponível
                    </h3>
                    <p className="text-gray-600 text-lg mb-8">
                      Novas propriedades serão adicionadas em breve. Volte mais tarde!
                    </p>
                    <Button 
                      onClick={() => setChatAberto(true)}
                      className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-full"
                    >
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Falar com Fazendeiro IA
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer moderno estilo Apple */}
      <footer className="bg-gray-900 text-white py-12">
        {/* Elementos decorativos no fundo */}
        <div className="absolute inset-0 overflow-hidden z-0 opacity-5">
          <div className="absolute top-0 left-10">
            <Wheat className="h-64 w-64 text-green-500 transform -rotate-12" />
          </div>
          <div className="absolute bottom-0 right-10">
            <Trees className="h-72 w-72 text-green-500" />
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 relative z-10">
          {/* Logo e mensagem da marca */}
          <div className="flex flex-col items-center text-center mb-8 pb-8 sm:mb-10 sm:pb-10 border-b border-gray-800">
            <div className="flex items-center mb-4">
              <Image 
                src="/images/fazendeiro-ia-logo.png" 
                alt="Logo Fazendeiro IA" 
                width={32} 
                height={32} 
                className="bg-white rounded-lg p-1 mr-2" 
                unoptimized
              />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">
                Fazendeiro IA
              </h2>
            </div>
            <p className="max-w-2xl text-gray-400 mx-auto">
              A união perfeita entre tecnologia de ponta e conhecimento rural para ajudar você a encontrar 
              a propriedade rural ideal para investimento, produção ou lazer.
            </p>
          </div>

          {/* Links e informações - melhor organização no mobile */}
          <div className="grid grid-cols-1 gap-8 sm:gap-4 md:grid-cols-4 md:gap-8">
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold mb-4 text-green-400 flex items-center">
                <span className="bg-green-800 bg-opacity-60 p-1.5 rounded-md mr-2 flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-white" style={{
                    filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 5px rgba(255,255,255,0.5))'
                  }} />
                </span>
                Sobre o Fazendeiro IA
              </h3>
              <p className="text-gray-300 max-w-md mb-6">
                Nosso portal utiliza inteligência artificial de ponta para conectar compradores a propriedades 
                rurais que atendem suas necessidades específicas. A tecnologia a serviço do campo.
              </p>
              <div className="flex space-x-6">
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <span className="sr-only">LinkedIn</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">
                  <span className="sr-only">YouTube</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-4 sm:gap-0">
              <div>
                <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-green-400 flex items-center">
                  <span className="bg-green-800 bg-opacity-60 p-1.5 rounded-md mr-2 flex items-center justify-center">
                    <Wheat className="h-5 w-5 text-white" style={{
                      filter: 'drop-shadow(0 0 3px rgba(255,255,255,0.8)) drop-shadow(0 0 5px rgba(255,255,255,0.5))'
                    }} />
                  </span>
                  Links Rápidos
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  <li>
                    <Link href="/" className="text-gray-300 hover:text-green-400 transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-2 text-green-500" />
                      Página Inicial
                    </Link>
                  </li>
                  <li>
                    <Link href="/login" className="text-gray-300 hover:text-green-400 transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-2 text-green-500" />
                      Área do Anunciante
                    </Link>
                  </li>
                  <li>
                    <Link href="/portal" className="text-gray-300 hover:text-green-400 transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-2 text-green-500" />
                      Buscar Propriedades
                    </Link>
                  </li>
                  <li>
                    <Link href="/portal/sobre" className="text-gray-300 hover:text-green-400 transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-2 text-green-500" />
                      Sobre o Fazendeiro IA
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-gray-300 hover:text-green-400 transition-colors flex items-center">
                      <ChevronRight className="h-3 w-3 mr-2 text-green-500" />
                      Fale Conosco
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3 sm:mb-4 text-green-400">Contato</h3>
                <ul className="space-y-2 sm:space-y-3 text-gray-300 text-sm">
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    contato@portalfazendas.com.br
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    (11) 4321-1234
                  </li>
                  <li className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    São Paulo, SP - Brasil
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-6 sm:pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Fazendeiro IA. Todos os direitos reservados.</p>
            <p className="mt-2 text-sm">
              Combinando inovação tecnológica e conhecimento rural para o futuro do agronegócio.
            </p>
          </div>
        </div>
      </footer>

      {/* Botão Flutuante do Chat IA */}
      <button
        onClick={() => setChatAberto(true)}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-full p-4 md:p-5 shadow-lg hover:shadow-xl transition-all duration-300 z-50 flex items-center gap-3 group animate-pulse-subtle hover:animate-none"
        aria-label="Abrir chat de busca inteligente"
      >
        <MessageCircle className="h-6 w-6 md:h-7 md:w-7" />
        <span className="hidden md:group-hover:inline-block text-sm font-medium pr-2 animate-fade-in">
          Buscar com IA 🌾
        </span>
      </button>

      {/* Componente de Chat */}
      <ChatBuscaFazenda open={chatAberto} onOpenChange={setChatAberto} />
    </div>
  );
} 