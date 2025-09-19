"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  ArrowLeft, 
  MapPin, 
  CalendarIcon, 
  Ruler, 
  Tag, 
  Phone, 
  Mail, 
  Eye, 
  Clock,
  Droplets,
  Zap,
  Mountain,
  FileText,
  Home,
  Warehouse,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
  DollarSign,
  Landmark,
  Square,
  CheckCircle2,
  Tractor as TractorIcon,
  Camera
} from "lucide-react";
import anunciosService, { Anuncio, FazendaDetalhes } from "@/services/anunciosService";
import LeadCaptureModal from "@/components/LeadCaptureModal";
import usuariosService, { Usuario } from "@/services/usuariosService";

export default function AnuncioDetalhesPage() {
  const params = useParams();
  const router = useRouter();
  const [anuncio, setAnuncio] = useState<Anuncio & {detalhes?: FazendaDetalhes} | null>(null);
  const [anunciante, setAnunciante] = useState<Usuario | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [carregandoAnunciante, setCarregandoAnunciante] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  
  // Imagens simuladas para galeria
  const mockImages = [
    { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop", alt: "Paisagem da fazenda 1" },
    { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop", alt: "Paisagem da fazenda 2" },
    { url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop", alt: "Paisagem da fazenda 3" },
  ];
  
  // Estruturas com ícones
  const estruturasMap: Record<string, {label: string, icon: React.ReactNode}> = {
    "sede": { label: "Sede", icon: <Home className="h-4 w-4 text-green-600" /> },
    "casaFuncionarios": { label: "Casa de Funcionários", icon: <Home className="h-4 w-4 text-green-600" /> },
    "galpao": { label: "Galpão", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
    "curral": { label: "Curral", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
    "cercas": { label: "Cercas", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
    "cocheiras": { label: "Cocheiras", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
    "piscina": { label: "Piscina", icon: <Droplets className="h-4 w-4 text-green-600" /> },
    "barracao": { label: "Barracão", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
  };
  
  const anuncioId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Controles da galeria
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === mockImages.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? mockImages.length - 1 : prevIndex - 1
    );
  };
  
  // Carregar detalhes do anúncio
  useEffect(() => {
    const carregarAnuncio = async () => {
      setCarregando(true);
      setErro(null);
      
      try {
        if (!anuncioId) {
          throw new Error("ID do anúncio não encontrado");
        }
        
        const detalhes = await anunciosService.getAnuncioDetalhes(anuncioId);
        
        if (!detalhes) {
          throw new Error("Anúncio não encontrado");
        }
        
        setAnuncio(detalhes);
        
        // Incrementar visualizações
        if (detalhes.id) {
          await anunciosService.incrementarVisualizacoes(detalhes.id);
        }
        
        // Carregar dados do anunciante se houver um usuario_id
        if (detalhes.usuario_id) {
          setCarregandoAnunciante(true);
          try {
            const dadosAnunciante = await usuariosService.getUsuario(detalhes.usuario_id);
            setAnunciante(dadosAnunciante);
          } catch (error) {
            console.error("Erro ao carregar dados do anunciante:", error);
          } finally {
            setCarregandoAnunciante(false);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar detalhes do anúncio:", error);
        setErro("Não foi possível carregar os detalhes do anúncio.");
      } finally {
        setCarregando(false);
      }
    };
    
    carregarAnuncio();
  }, [anuncioId]);
  
  // Se estiver carregando
  if (carregando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Carregando detalhes da propriedade...</p>
        </div>
      </div>
    );
  }
  
  // Se houver erro
  if (erro || !anuncio) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Propriedade não encontrada</h2>
          <p className="text-gray-600 mb-6">{erro || "O anúncio que você procura não existe ou foi removido."}</p>
          <Button asChild>
            <Link href="/portal">Voltar para a lista de propriedades</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Função para redirecionar para o WhatsApp após captura do lead
  const handleLeadCapture = (telefone: string) => {
    // Telefone do anunciante (poderia ser obtido dos dados do anúncio)
    const telefoneAnunciante = "5511987654321"; // Exemplo
    
    // Mensagem padrão para iniciar a conversa no WhatsApp
    const mensagemPadrao = `Olá! Vi seu anúncio "${anuncio?.titulo}" no portal Fazendeiro IA e tenho interesse.`;
    
    // Formatar a URL para abrir o WhatsApp
    const whatsappUrl = `https://wa.me/${telefoneAnunciante}?text=${encodeURIComponent(mensagemPadrao)}`;
    
    // Abrir o WhatsApp em uma nova janela
    window.open(whatsappUrl, '_blank');
  };

  // Função para obter as iniciais do nome do anunciante
  const obterIniciais = (nome: string) => {
    if (!nome) return "??";
    
    const partes = nome.split(' ');
    if (partes.length === 1) return partes[0].charAt(0).toUpperCase();
    
    return (partes[0].charAt(0) + partes[partes.length - 1].charAt(0)).toUpperCase();
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente */}
      <header className="bg-gradient-to-r from-green-700 to-green-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Link href="/portal" className="mr-4">
              <Button variant="ghost" size="icon" className="text-white hover:bg-green-800">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold truncate max-w-xl">
                {anuncio.titulo}
              </h1>
              <p className="flex items-center text-sm text-green-100">
                <MapPin className="h-4 w-4 mr-1" />
                {anuncio.detalhes?.cidade || "Localização não informada"}, 
                {anuncio.detalhes?.estado || ""}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="ghost" className="text-white hover:bg-green-800">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
            <Link href="/login">
              <Button size="sm" variant="outline" className="bg-transparent text-white border-white hover:bg-green-800">
                Área do Anunciante
              </Button>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Galeria e Informações Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Galeria */}
          <div className="lg:col-span-2 bg-white rounded-xl overflow-hidden shadow-lg">
            <div className="relative h-[450px]">
              {/* Imagem principal */}
              <img 
                src={mockImages[currentImageIndex].url} 
                alt={mockImages[currentImageIndex].alt} 
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge className="bg-green-600 hover:bg-green-700 text-white font-medium px-3 py-1">
                  {anuncio.categoria}
                </Badge>
                {anuncio.status === "Ativo" && (
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1">
                    Disponível
                  </Badge>
                )}
              </div>
              
              {/* Controles da galeria */}
              <div className="absolute inset-0 flex items-center justify-between px-4">
                <Button 
                  onClick={prevImage} 
                  variant="outline" 
                  size="icon" 
                  className="bg-white/80 hover:bg-white text-green-900 rounded-full h-10 w-10"
                >
                  <ChevronLeft className="h-6 w-6" />
                </Button>
                <Button 
                  onClick={nextImage} 
                  variant="outline" 
                  size="icon" 
                  className="bg-white/80 hover:bg-white text-green-900 rounded-full h-10 w-10"
                >
                  <ChevronRight className="h-6 w-6" />
                </Button>
              </div>
              
              {/* Contador de imagens */}
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                <div className="flex items-center">
                  <Camera className="h-4 w-4 mr-1" />
                  {currentImageIndex + 1}/{mockImages.length}
                </div>
              </div>
            </div>
            
            {/* Miniaturas */}
            <div className="flex p-3 gap-2 bg-gray-50">
              {mockImages.map((img, index) => (
                <div 
                  key={index} 
                  className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer transition 
                              ${index === currentImageIndex ? 'ring-2 ring-green-600' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img src={img.url} alt={img.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          
          {/* Informações Principais */}
          <div>
            <Card className="shadow-lg border-0 mb-4">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-3xl font-bold text-green-900 flex items-center">
                  <DollarSign className="h-7 w-7 text-green-700 mr-1" />
                  {anuncio.preco}
                </CardTitle>
                <CardDescription className="flex items-center text-green-700 text-lg">
                  <Tag className="h-5 w-5 mr-2" />
                  {anuncio.detalhes?.tipo_oferta === 'venda' ? 'Venda' : 'Arrendamento'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Square className="h-5 w-5 mr-2 text-green-700" />
                    <div>
                      <p className="text-sm text-gray-500">Área Total</p>
                      <p className="font-medium">{anuncio.detalhes?.area || "?"} hectares</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <TractorIcon className="h-5 w-5 mr-2 text-green-700" />
                    <div>
                      <p className="text-sm text-gray-500">Finalidade</p>
                      <p className="font-medium">{anuncio.detalhes?.finalidade || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-700" />
                    <div>
                      <p className="text-sm text-gray-500">Documentação</p>
                      <p className="font-medium">{anuncio.detalhes?.documentacao || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Landmark className="h-5 w-5 mr-2 text-green-700" />
                    <div>
                      <p className="text-sm text-gray-500">Distância</p>
                      <p className="font-medium">{anuncio.detalhes?.distancia || "?"} km</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>Publicado: {new Date(anuncio.datapublicacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    <span>{anuncio.visualizacoes} visualizações</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-3 pt-0">
                <Button 
                  className="w-full bg-green-700 hover:bg-green-800"
                  onClick={() => setLeadModalOpen(true)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Entrar em contato
                </Button>
                <div className="grid grid-cols-2 gap-3 w-full">
                  <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                    <Heart className="h-4 w-4 mr-2" />
                    Favoritar
                  </Button>
                  <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                    <Mail className="h-4 w-4 mr-2" />
                    Mensagem
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Corretor/Anunciante */}
            <Card className="shadow-md border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Anunciante</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {carregandoAnunciante ? (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-700 font-bold text-lg">
                        {anunciante ? obterIniciais(anunciante.nome) : "??"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">
                        {anunciante ? anunciante.nome : "Anunciante não disponível"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {anunciante?.plano === "Premium" ? "Anunciante Premium" : "Corretor especializado"}
                      </p>
                      {anunciante?.plano === "Premium" && (
                        <p className="text-sm text-green-600 mt-1">Anunciante verificado</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Tabs de Detalhes */}
        <Tabs defaultValue="detalhes" className="mt-8">
          <TabsList className="bg-white w-full grid grid-cols-3 p-1 rounded-t-xl shadow-md mb-1">
            <TabsTrigger 
              value="detalhes" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Detalhes
            </TabsTrigger>
            <TabsTrigger 
              value="estruturas"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Estruturas
            </TabsTrigger>
            <TabsTrigger 
              value="localizacao"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Localização
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="detalhes" className="mt-0">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-green-900">Detalhes da Propriedade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-3 rounded-full">
                      <Droplets className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Recurso Hídrico</p>
                      <p className="font-medium">{anuncio.detalhes?.recurso_hidrico || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-3 rounded-full">
                      <Zap className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Energia</p>
                      <p className="font-medium">{anuncio.detalhes?.energia || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-3 rounded-full">
                      <Mountain className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tipo de Solo</p>
                      <p className="font-medium">{anuncio.detalhes?.tipo_solo || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-3 rounded-full">
                      <FileText className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Documentação</p>
                      <p className="font-medium">{anuncio.detalhes?.documentacao || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-3 rounded-full">
                      <Ruler className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Área Total</p>
                      <p className="font-medium">{anuncio.detalhes?.area || "?"} hectares</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-3 rounded-full">
                      <Clock className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Acesso</p>
                      <p className="font-medium">{anuncio.detalhes?.acesso || "Não informado"}</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium text-green-900 mb-4">Descrição</h3>
                  <div className="bg-gray-50 p-6 rounded-lg text-gray-700 whitespace-pre-line">
                    {anuncio.detalhes?.descricao || 
                      `Propriedade rural com ${anuncio.detalhes?.area || "?"} hectares localizada em ${anuncio.detalhes?.cidade || "localização não informada"}, ${anuncio.detalhes?.estado || ""}.
                      
                      Finalidade principal: ${anuncio.detalhes?.finalidade || "Não informada"}.
                      
                      Entre em contato para mais informações sobre esta propriedade.`
                    }
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="estruturas" className="mt-0">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-green-900">Estruturas Disponíveis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {anuncio.detalhes?.estruturas && anuncio.detalhes.estruturas.length > 0 ? (
                    anuncio.detalhes.estruturas.map((estrutura) => (
                      <div 
                        key={estrutura} 
                        className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg
                                  border border-green-100 hover:bg-green-100 transition duration-200"
                      >
                        {estruturasMap[estrutura]?.icon || <Home className="h-5 w-5 text-green-600" />}
                        <span className="font-medium">{estruturasMap[estrutura]?.label || estrutura}</span>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 text-center py-12 bg-gray-50 rounded-lg">
                      <Warehouse className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Nenhuma estrutura informada para esta propriedade.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="localizacao" className="mt-0">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-green-900">Localização</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1569336415962-a4bd9f69c07a?q=80&w=2069&auto=format&fit=crop" 
                    alt="Mapa da localização" 
                    className="w-full h-full object-cover opacity-80" 
                  />
                  <div className="absolute flex flex-col items-center">
                    <MapPin className="h-8 w-8 text-green-700" />
                    <p className="bg-white/80 px-3 py-1 rounded-full text-sm font-medium text-green-900">
                      {anuncio.detalhes?.coordenadas ? 
                        "Localização Exata" : 
                        "Localização aproximada"}
                    </p>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cidade</p>
                      <p className="font-medium">{anuncio.detalhes?.cidade || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Estado</p>
                      <p className="font-medium">{anuncio.detalhes?.estado || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Região</p>
                      <p className="font-medium">{anuncio.detalhes?.regiao || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-50 p-2 rounded-full">
                      <MapPin className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Distância da cidade</p>
                      <p className="font-medium">{anuncio.detalhes?.distancia || "?"} km</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        {/* Propriedades relacionadas */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-green-900 mb-6">Propriedades Semelhantes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition duration-300">
                <div className="h-48 bg-gray-200 relative">
                  <img 
                    src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop" 
                    alt="Imagem da propriedade" 
                    className="w-full h-full object-cover" 
                  />
                  <Badge className="absolute top-3 left-3 bg-green-600 text-white">
                    Fazenda
                  </Badge>
                </div>
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg mb-1">Fazenda Exemplo {item}</h3>
                  <p className="text-gray-500 text-sm flex items-center mb-2">
                    <MapPin className="h-3 w-3 mr-1" />
                    Cidade Exemplo, UF
                  </p>
                  <div className="flex justify-between items-center mt-3">
                    <p className="font-bold text-green-700">R$ 1.500.000</p>
                    <p className="text-sm text-gray-500">120 hectares</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-16 relative">
        <div className="absolute inset-0 overflow-hidden z-0 opacity-5">
          <div className="absolute top-0 left-10">
            <TractorIcon className="h-64 w-64 text-green-500 transform -rotate-12" />
          </div>
          <div className="absolute bottom-0 right-10">
            <Home className="h-72 w-72 text-green-500" />
          </div>
        </div>
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">Portal de Fazendas</h3>
              <p className="text-gray-300">
                Encontre as melhores propriedades rurais para compra ou arrendamento.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">Links Rápidos</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-gray-300 hover:text-green-400 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-2 text-green-500" />
                  Página Inicial
                </Link></li>
                <li><Link href="/login" className="text-gray-300 hover:text-green-400 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-2 text-green-500" />
                  Área do Anunciante
                </Link></li>
                <li><Link href="/portal" className="text-gray-300 hover:text-green-400 flex items-center">
                  <ChevronRight className="h-3 w-3 mr-2 text-green-500" />
                  Buscar Propriedades
                </Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-400">Contato</h3>
              <p className="text-gray-300">
                Email: contato@portalfazendas.com.br<br />
                Telefone: (11) 4321-1234
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Portal de Fazendas. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modal de captura de leads */}
      <LeadCaptureModal
        anuncioId={anuncioId}
        anuncioTitulo={anuncio?.titulo || ""}
        open={leadModalOpen}
        onOpenChange={setLeadModalOpen}
        onLeadCapture={handleLeadCapture}
      />
    </div>
  );
} 