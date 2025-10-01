"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, ArrowLeft, Sparkles, TrendingUp, DollarSign, Users, Building2, Leaf } from "lucide-react";
import Image from "next/image";

export default function PlanosPage() {
  const [tipoUsuario, setTipoUsuario] = useState<"proprietario" | "corretor">("proprietario");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/portal" className="mr-4">
              <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800 hover:bg-green-50">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center">
              <Image 
                src="/images/fazendeiro-ia-logo.png" 
                alt="Logo Fazendeiro IA" 
                width={32} 
                height={32} 
                className="bg-white rounded-lg p-1 mr-2" 
                unoptimized
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900 flex items-center">
                  <span className="bg-gradient-to-r from-green-600 to-green-800 text-transparent bg-clip-text">Fazendeiro IA</span>
                </h1>
                <p className="text-xs text-gray-500">Planos e Preços</p>
              </div>
            </div>
          </div>
          <Link href="/login">
            <Button className="bg-green-700 hover:bg-green-800">Área do Anunciante</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 overflow-x-hidden">
        {/* Seletor de Tipo de Usuário */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-xs sm:text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4 mr-2" />
            40% de Desconto em Todos os Planos
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Escolha Seu Plano Ideal
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            No Fazendeiro IA você anuncia sua terra direto para compradores realmente interessados em propriedades rurais.
          </p>

          {/* Toggle de Tipo de Usuário */}
          <div className="inline-flex flex-col sm:flex-row gap-2 sm:gap-0 rounded-lg border border-gray-200 p-1 bg-white shadow-sm">
            <button
              onClick={() => setTipoUsuario("proprietario")}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium transition-all ${
                tipoUsuario === "proprietario"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Users className="h-4 w-4 inline mr-2" />
              Sou Proprietário
            </button>
            <button
              onClick={() => setTipoUsuario("corretor")}
              className={`px-4 sm:px-6 py-2.5 sm:py-3 rounded-md font-medium transition-all ${
                tipoUsuario === "corretor"
                  ? "bg-green-600 text-white shadow-md"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <Building2 className="h-4 w-4 inline mr-2" />
              Sou Corretor/Imobiliária
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
            <div className="text-green-600 text-3xl sm:text-5xl font-bold mb-2">+10 mil</div>
            <div className="text-gray-600 font-medium">visitas mensais</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
            <div className="text-green-600 text-3xl sm:text-5xl font-bold mb-2">+50 mil</div>
            <div className="text-gray-600 font-medium">anúncios visualizados</div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-green-100">
            <div className="text-green-600 text-3xl sm:text-5xl font-bold mb-2">+R$ 3Bi</div>
            <div className="text-gray-600 font-medium">em imóveis anunciados</div>
          </div>
        </div>

        {/* Planos para Proprietários */}
        {tipoUsuario === "proprietario" && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Para Proprietários</h3>
              <p className="text-lg text-gray-600">Plano Único Fazendeiro IA</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <Card className="border-2 border-green-500 shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <CardTitle className="text-xl sm:text-2xl mb-2">Plano Único</CardTitle>
                      <CardDescription className="text-green-100">
                        Perfeito para quem quer vender ou arrendar uma propriedade
                      </CardDescription>
                    </div>
                    <Badge className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1">
                      40% OFF
                    </Badge>
                  </div>
                  
                  <div className="flex items-baseline">
                    <span className="text-3xl sm:text-5xl font-bold">R$ 297</span>
                    <span className="ml-3 text-green-100 line-through text-sm sm:text-base">R$ 495</span>
                  </div>
                  <p className="text-green-100 text-xs sm:text-sm mt-2">Pagamento único • Sem mensalidades</p>
                </div>

                <CardContent className="p-6 sm:p-8">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">1 anúncio completo</span>
                        <p className="text-sm text-gray-600">Com fotos, descrição detalhada e localização no mapa</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">1 pagamento único</span>
                        <p className="text-sm text-gray-600">Sem surpresas, sem renovações automáticas</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">7 dias de tráfego pago</span>
                        <p className="text-sm text-gray-600">Impulsionamento inicial para máximo alcance</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Ativo até vender</span>
                        <p className="text-sm text-gray-600">Seu anúncio fica no ar até você concluir a negociação</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Assistente IA para cadastro</span>
                        <p className="text-sm text-gray-600">Criação guiada do anúncio em minutos</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Check className="h-5 w-5 text-green-600 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Sem comissão na venda</span>
                        <p className="text-sm text-gray-600">Você negocia direto com o comprador</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-green-800 font-medium">
                      💰 Valor promocional com 40% de desconto nos primeiros planos.
                    </p>
                  </div>
                </CardContent>

                <CardFooter className="p-6 sm:p-8 pt-0">
                  <Link href="/login" className="w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white py-6 text-lg font-semibold shadow-lg">
                      Começar Agora
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}

        {/* Planos para Corretores */}
        {tipoUsuario === "corretor" && (
          <div className="mb-16">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">Para Corretores e Imobiliárias</h3>
              <p className="text-lg text-gray-600">
                Planos múltiplos já com 40% de desconto em todos os pacotes
              </p>
              <p className="text-md text-gray-500 mt-2">
                Mais anúncios, mais alcance e compradores segmentados para você
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
              {/* Plano Básico */}
              <Card className="border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-xl">
                <CardHeader className="bg-gray-50 p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl mb-2">Básico</CardTitle>
                  <CardDescription>Ideal para começar</CardDescription>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-4xl font-bold text-gray-900">R$ 597</span>
                    <span className="text-gray-500 line-through ml-2 text-sm sm:text-base">R$ 995</span>
                    <p className="text-xs sm:text-sm text-gray-600 mt-1">/mês</p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm">Até 5 anúncios ativos</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm">Painel de gestão</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm">Relatórios básicos</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm">Suporte por email</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 sm:p-6 pt-0">
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50">
                      Escolher Básico
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Plano Profissional - DESTAQUE */}
              <Card className="border-2 border-green-500 shadow-2xl md:transform md:-translate-y-4 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <Badge className="bg-yellow-400 text-yellow-900 text-sm font-bold px-4 py-1">
                    MAIS POPULAR
                  </Badge>
                </div>
                <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl mb-2">Profissional</CardTitle>
                  <CardDescription className="text-green-100">Melhor custo-benefício</CardDescription>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-4xl font-bold">R$ 1.197</span>
                    <span className="text-green-100 line-through ml-2 text-sm sm:text-base">R$ 1.995</span>
                    <p className="text-xs sm:text-sm text-green-100 mt-1">/mês</p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Até 15 anúncios ativos</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Destaque nos resultados</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Painel completo de gestão</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Relatórios avançados</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Suporte prioritário</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Badge verificado</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 sm:p-6 pt-0">
                  <Link href="/login" className="w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700 py-6 text-lg font-semibold shadow-lg">
                      Começar Agora
                    </Button>
                  </Link>
                </CardFooter>
              </Card>

              {/* Plano Premium */}
              <Card className="border-2 border-gray-200 hover:border-green-500 transition-all hover:shadow-xl">
                <CardHeader className="bg-gradient-to-r from-gray-900 to-gray-800 text-white p-4 sm:p-6">
                  <CardTitle className="text-xl sm:text-2xl mb-2">Premium</CardTitle>
                  <CardDescription className="text-gray-300">Máximo desempenho</CardDescription>
                  <div className="mt-4">
                    <span className="text-2xl sm:text-4xl font-bold">R$ 2.397</span>
                    <span className="text-gray-300 line-through ml-2 text-sm sm:text-base">R$ 3.995</span>
                    <p className="text-xs sm:text-sm text-gray-300 mt-1">/mês</p>
                  </div>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Anúncios ilimitados</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Prioridade máxima</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Tráfego pago contínuo</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">API de integração</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Gerente de conta dedicado</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Suporte 24/7</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-5 w-5 text-green-600 mr-2" />
                      <span className="text-sm font-medium">Badge Premium destacado</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-4 sm:p-6 pt-0">
                  <Link href="/login" className="w-full">
                    <Button variant="outline" className="w-full border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white">
                      Escolher Premium
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}

        {/* Destaque do Plano Único */}
        {tipoUsuario === "proprietario" && (
          <div className="bg-gradient-to-r from-green-700 to-green-900 text-white rounded-2xl p-8 mb-16">
            <div className="flex items-center mb-4">
              <Leaf className="h-8 w-8 mr-3" />
              <h3 className="text-2xl font-bold">Por que o Plano Único?</h3>
            </div>
            <p className="text-lg text-green-100 leading-relaxed">
              Você paga uma única vez e o seu anúncio fica ativo até vender ou arrendar sua propriedade.
              Sem mensalidades, sem renovações, sem surpresas. Simples assim! 🌾
            </p>
          </div>
        )}

        {/* FAQ */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Dúvidas Frequentes</h3>
            <p className="text-lg text-gray-600">Tudo o que você precisa saber sobre o Fazendeiro IA</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="space-y-4">
              <AccordionItem value="item-1" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold hover:text-green-700">
                  O Fazendeiro IA é uma imobiliária?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Não. Somos um portal de anúncios especializado em imóveis rurais. Aqui você anuncia e encontra 
                  propriedades de forma simples, direta e segura.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold hover:text-green-700">
                  Fazendeiro IA recebe comissão?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Não! Você paga apenas o plano (com desconto de 40%) e negocia diretamente com o comprador interessado. 
                  Toda a negociação é feita entre você e o cliente.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold hover:text-green-700">
                  Contratei o Plano Único. Ele vai sair do ar em quanto tempo?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  O Plano Único fica ativo até você vender o seu imóvel rural. Não há prazo de validade! 
                  Apenas quando você concluir a venda, o anúncio será removido.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold hover:text-green-700">
                  O Fazendeiro IA vende minha terra pra mim?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Nós damos a visibilidade que sua terra precisa. Os interessados entram em contato direto com você 
                  para negociar. Você mantém total controle da negociação.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold hover:text-green-700">
                  Quantas pessoas acessam os anúncios do Fazendeiro IA por mês?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Atualmente, estamos crescendo rápido, com cerca de 10 mil acessos mensais e dezenas de milhares 
                  de visualizações de anúncios. Nossa meta é multiplicar esse número a cada mês com investimento em 
                  tráfego e tecnologia de IA.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-6" className="bg-white rounded-lg border border-gray-200 px-6">
                <AccordionTrigger className="text-left font-semibold hover:text-green-700">
                  Por que anunciar meu imóvel rural no Fazendeiro IA? Vale a pena?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  <div className="space-y-3">
                    <p className="font-medium text-gray-900">Vale sim, e muito:</p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Foco exclusivo em imóveis rurais</strong> – público 100% segmentado.</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Visibilidade crescente</strong> – estamos construindo uma base sólida de compradores.</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Segurança e transparência</strong> – contato direto com o interessado.</span>
                      </li>
                      <li className="flex items-start">
                        <Check className="h-4 w-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                        <span><strong>Custo-benefício</strong> – com 40% de desconto, o retorno de uma única venda 
                        cobre facilmente o valor do anúncio.</span>
                      </li>
                    </ul>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* CTA Final */}
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-4">Pronto para Começar?</h3>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Cadastre seu anúncio agora e comece a receber contatos de compradores interessados!
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-white text-green-800 hover:bg-gray-100 px-8 py-6 text-lg font-semibold shadow-xl">
              <Sparkles className="h-5 w-5 mr-2" />
              Criar Minha Conta Grátis
            </Button>
          </Link>
          <p className="text-sm text-green-200 mt-4">Sem cartão de crédito • Cadastro em 2 minutos</p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <Image 
                  src="/images/fazendeiro-ia-logo.png" 
                  alt="Logo Fazendeiro IA" 
                  width={32} 
                  height={32} 
                  className="h-8 w-8 object-contain mr-2"
                  unoptimized
                />
                <span className="text-xl font-bold">Fazendeiro IA</span>
              </div>
              <p className="text-gray-400 text-sm">
                A plataforma inteligente para imóveis rurais no Brasil.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Plataforma</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/portal" className="hover:text-white">Buscar Propriedades</Link></li>
                <li><Link href="/planos" className="hover:text-white">Planos</Link></li>
                <li><Link href="/portal/sobre" className="hover:text-white">Sobre</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/contato" className="hover:text-white">Contato</Link></li>
                <li><Link href="/ajuda" className="hover:text-white">Central de Ajuda</Link></li>
                <li><Link href="/termos" className="hover:text-white">Termos de Uso</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Contato</h3>
              <div className="space-y-2 text-sm text-gray-400">
                <p>contato@fazendeiroia.com.br</p>
                <p>(11) 4321-1234</p>
                <p>São Paulo, SP</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Fazendeiro IA. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

