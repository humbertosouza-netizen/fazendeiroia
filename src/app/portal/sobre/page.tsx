"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Tractor, 
  Wheat, 
  Home, 
  Users, 
  Target, 
  Shield, 
  Zap, 
  Globe, 
  MessageCircle,
  BarChart3,
  Heart,
  CheckCircle,
  Star,
  Award,
  TrendingUp,
  Building2,
  Leaf,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin
} from "lucide-react";

export default function SobrePage() {
  const [activeTab, setActiveTab] = useState("missao");

  const stats = [
    { label: "Propriedades Cadastradas", value: "500+", icon: <Home className="h-6 w-6" /> },
    { label: "Usuários Ativos", value: "2.500+", icon: <Users className="h-6 w-6" /> },
    { label: "Visualizações Mensais", value: "10.000+", icon: <BarChart3 className="h-6 w-6" /> },
    { label: "Estados Atendidos", value: "27", icon: <MapPin className="h-6 w-6" /> },
  ];

  const features = [
    {
      icon: <Zap className="h-8 w-8 text-green-600" />,
      title: "Busca Inteligente com IA",
      description: "Nossa IA entende linguagem natural e encontra propriedades que atendem exatamente ao que você procura."
    },
    {
      icon: <Target className="h-8 w-8 text-green-600" />,
      title: "Segmentação Específica",
      description: "Foco exclusivo em imóveis rurais - fazendas, sítios, chácaras e propriedades agrícolas."
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      description: "Plataforma segura e confiável com verificação de endereços via Google Maps."
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-green-600" />,
      title: "Atendimento Personalizado",
      description: "Chat inteligente que guia você na busca pela propriedade ideal."
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: "Cobertura Nacional",
      description: "Propriedades em todos os estados brasileiros, com foco em regiões produtivas."
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Crescimento Constante",
      description: "Base de dados em expansão com novas propriedades cadastradas diariamente."
    }
  ];

  const team = [
    {
      name: "Equipe de Desenvolvimento",
      role: "Tecnologia",
      description: "Especialistas em IA e desenvolvimento web"
    },
    {
      name: "Consultores Rurais",
      role: "Especialistas",
      description: "Profissionais com experiência em agronegócio"
    },
    {
      name: "Suporte ao Cliente",
      role: "Atendimento",
      description: "Equipe dedicada ao seu sucesso"
    }
  ];

  const tabs = [
    { id: "missao", label: "Nossa Missão", icon: <Target className="h-4 w-4" /> },
    { id: "tecnologia", label: "Tecnologia", icon: <Zap className="h-4 w-4" /> },
    { id: "equipe", label: "Equipe", icon: <Users className="h-4 w-4" /> },
    { id: "contato", label: "Contato", icon: <Phone className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-green-100">
        <div className="max-w-7xl mx-auto py-3 px-3 sm:py-4 sm:px-6 lg:px-8 flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center">
            <Link href="/portal" className="mr-2 sm:mr-4">
              <Button variant="ghost" size="icon" className="text-green-700 hover:text-green-800 hover:bg-green-50 transition-all duration-300">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                <span className="bg-gradient-to-r from-green-600 to-green-800 text-transparent bg-clip-text">Fazendeiro IA</span>
              </h1>
              <p className="text-xs sm:text-sm text-gray-500">Sobre nossa plataforma</p>
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

      {/* Hero Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 flex justify-center">
            <div className="inline-flex p-4 bg-white rounded-full shadow-lg">
              <Image 
                src="/images/fazendeiro-ia-logo.png" 
                alt="Logo Fazendeiro IA" 
                width={64} 
                height={64} 
                className="h-16 w-16 object-contain"
                unoptimized
              />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-6">
            <span className="block bg-gradient-to-r from-green-600 to-green-800 text-transparent bg-clip-text">
              Fazendeiro IA
            </span>
            <span className="block text-2xl sm:text-3xl text-gray-600 mt-2">
              Revolucionando o mercado de imóveis rurais
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            A primeira plataforma brasileira especializada em imóveis rurais com inteligência artificial, 
            conectando proprietários e compradores de forma inteligente e eficiente.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/portal">
              <Button size="lg" className="bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white px-8 py-3">
                <Home className="h-5 w-5 mr-2" />
                Buscar Propriedades
              </Button>
            </Link>
            <Link href="/planos">
              <Button size="lg" variant="outline" className="border-green-600 text-green-700 hover:bg-green-50 px-8 py-3">
                <Award className="h-5 w-5 mr-2" />
                Ver Planos
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4 text-green-600">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Conheça o Fazendeiro IA</h2>
            <p className="text-lg text-gray-600">Descubra como estamos transformando o mercado de imóveis rurais</p>
          </div>

          {/* Tabs Navigation */}
          <div className="flex flex-wrap justify-center mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 m-1 rounded-lg font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-green-50 hover:text-green-700'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {activeTab === "missao" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Missão</h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Democratizar o acesso ao mercado de imóveis rurais no Brasil, conectando proprietários 
                    e compradores através de tecnologia de ponta e inteligência artificial.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Heart className="h-5 w-5 text-green-600 mr-2" />
                      Nossos Valores
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Transparência total nas negociações</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Tecnologia a serviço do agronegócio</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Suporte especializado e personalizado</span>
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">Inovação constante na plataforma</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="h-5 w-5 text-green-600 mr-2" />
                      Nossa Visão
                    </h4>
                    <p className="text-gray-600 mb-4">
                      Ser a principal referência em plataformas de imóveis rurais no Brasil, 
                      reconhecida pela excelência tecnológica e pela qualidade do atendimento.
                    </p>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-800 font-medium">
                        "Conectando o campo ao futuro através da tecnologia"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "tecnologia" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Tecnologia</h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Utilizamos as mais avançadas tecnologias de IA e machine learning para 
                    revolucionar a experiência de busca e venda de imóveis rurais.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {features.map((feature, index) => (
                    <Card key={index} className="border-green-100 hover:shadow-lg transition-shadow duration-200">
                      <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                          {feature.icon}
                        </div>
                        <CardTitle className="text-lg">{feature.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-8 rounded-2xl">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4 text-center">
                    Tecnologias Utilizadas
                  </h4>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Inteligência Artificial</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Processamento de linguagem natural</li>
                        <li>• Machine learning para recomendações</li>
                        <li>• Análise de dados em tempo real</li>
                      </ul>
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900 mb-2">Integração de Dados</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Google Maps para localização</li>
                        <li>• APIs de validação de endereços</li>
                        <li>• Banco de dados em nuvem</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "equipe" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Equipe</h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Uma equipe multidisciplinar de especialistas apaixonados por tecnologia 
                    e agronegócio, trabalhando para transformar o mercado de imóveis rurais.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  {team.map((member, index) => (
                    <Card key={index} className="text-center border-green-100">
                      <CardHeader>
                        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <Users className="h-10 w-10 text-green-600" />
                        </div>
                        <CardTitle className="text-lg">{member.name}</CardTitle>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          {member.role}
                        </Badge>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>
                          {member.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="bg-green-50 p-8 rounded-2xl text-center">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">
                    Junte-se à nossa equipe
                  </h4>
                  <p className="text-gray-600 mb-6">
                    Estamos sempre em busca de talentos apaixonados por tecnologia e agronegócio.
                  </p>
                  <Button variant="outline" className="border-green-600 text-green-700 hover:bg-green-50">
                    <Mail className="h-4 w-4 mr-2" />
                    Enviar Currículo
                  </Button>
                </div>
              </div>
            )}

            {activeTab === "contato" && (
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Entre em Contato</h3>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    Estamos aqui para ajudar! Entre em contato conosco através dos canais abaixo.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Phone className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Telefone</h4>
                        <p className="text-gray-600">(11) 4321-1234</p>
                        <p className="text-sm text-gray-500">Segunda a Sexta, 8h às 18h</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Mail className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Email</h4>
                        <p className="text-gray-600">contato@fazendeiroia.com.br</p>
                        <p className="text-sm text-gray-500">Resposta em até 24h</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <MapPin className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">Endereço</h4>
                        <p className="text-gray-600">São Paulo, SP - Brasil</p>
                        <p className="text-sm text-gray-500">Atendimento online</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 p-6 rounded-2xl">
                    <h4 className="font-semibold text-gray-900 mb-4">Redes Sociais</h4>
                    <div className="flex space-x-4">
                      <Button variant="outline" size="icon" className="border-green-600 text-green-700 hover:bg-green-50">
                        <Facebook className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="border-green-600 text-green-700 hover:bg-green-50">
                        <Twitter className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="border-green-600 text-green-700 hover:bg-green-50">
                        <Instagram className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" className="border-green-600 text-green-700 hover:bg-green-50">
                        <Linkedin className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-600 mt-4">
                      Siga-nos para novidades e dicas sobre o mercado rural!
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-green-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Pronto para encontrar sua propriedade ideal?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já confiam no Fazendeiro IA para suas negociações rurais.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/portal">
              <Button size="lg" variant="secondary" className="bg-white text-green-700 hover:bg-gray-50 px-8 py-3">
                <Home className="h-5 w-5 mr-2" />
                Buscar Propriedades
              </Button>
            </Link>
            <Link href="/planos">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700 px-8 py-3">
                <Award className="h-5 w-5 mr-2" />
                Ver Planos
              </Button>
            </Link>
          </div>
        </div>
      </section>

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
                <li><Link href="/sobre" className="hover:text-white">Sobre</Link></li>
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
