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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
  Link as LinkIcon,
  Facebook,
  Twitter,
  MessageCircle as WhatsAppIcon,
  Copy,
  DollarSign,
  Landmark,
  Square,
  CheckCircle2,
  Tractor as TractorIcon,
  Camera
} from "lucide-react";
import anunciosService, { Anuncio, FazendaDetalhes, AnuncioImagem } from "@/services/anunciosService";
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
  const [imagens, setImagens] = useState<AnuncioImagem[]>([]);
  const [carregandoImagens, setCarregandoImagens] = useState(true);
  const [favoritado, setFavoritado] = useState(false);
  const [modalMensagem, setModalMensagem] = useState(false);
  const [compartilharAberto, setCompartilharAberto] = useState(false);
  
  const anuncioId = Array.isArray(params.id) ? params.id[0] : params.id;
  
  // Verificar se está favoritado ao carregar
  useEffect(() => {
    const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
    setFavoritado(favoritos.includes(anuncioId));
  }, [anuncioId]);
  
  // Imagem padrão única para quando não há imagens reais
  const imagemPadrao = {
    url: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1932&auto=format&fit=crop", 
    alt: "Imagem padrão da fazenda"
  };
  
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
  
  // Controles da galeria - usar apenas imagens reais ou imagem padrão única
  const imagensParaExibir = imagens.length > 0 ? imagens : [imagemPadrao];
  
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === imagensParaExibir.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? imagensParaExibir.length - 1 : prevIndex - 1
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
        
        // Carregar imagens do anúncio
        if (detalhes.id) {
          setCarregandoImagens(true);
          try {
            console.log("🔍 Buscando imagens para anúncio ID:", detalhes.id);
            const imagensAnuncio = await anunciosService.getImagensAnuncio(detalhes.id);
            console.log("📸 Imagens encontradas:", imagensAnuncio);
            setImagens(imagensAnuncio);
          } catch (error) {
            console.error("❌ Erro ao carregar imagens do anúncio:", error);
          } finally {
            setCarregandoImagens(false);
          }
          
          // Incrementar visualizações
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

  // Função para favoritar/desfavoritar
  const toggleFavorito = () => {
    setFavoritado(!favoritado);
    // Aqui você pode implementar a lógica para salvar no localStorage ou banco de dados
    if (!favoritado) {
      // Adicionar aos favoritos
      const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      if (!favoritos.includes(anuncioId)) {
        favoritos.push(anuncioId);
        localStorage.setItem('favoritos', JSON.stringify(favoritos));
      }
    } else {
      // Remover dos favoritos
      const favoritos = JSON.parse(localStorage.getItem('favoritos') || '[]');
      const novosFavoritos = favoritos.filter((id: string) => id !== anuncioId);
      localStorage.setItem('favoritos', JSON.stringify(novosFavoritos));
    }
  };

  // Função para abrir modal de mensagem
  const abrirMensagem = () => {
    setModalMensagem(true);
  };

  // Funções de compartilhamento
  const compartilharWhatsApp = () => {
    const url = window.location.href;
    const texto = `Olha essa propriedade incrível que encontrei: ${anuncio?.titulo}\n${url}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank');
  };

  const compartilharFacebook = () => {
    const url = window.location.href;
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const compartilharTwitter = () => {
    const url = window.location.href;
    const texto = `Confira: ${anuncio?.titulo}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(texto)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  const copiarLink = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('✅ Link copiado para a área de transferência!');
    setCompartilharAberto(false);
  };

  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente - Mobile First */}
      <header className="bg-gradient-to-r from-green-700 to-green-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto py-3 md:py-4 px-4 sm:px-6 lg:px-8">
          {/* Mobile Layout */}
          <div className="md:hidden">
            <div className="flex items-center justify-between mb-3">
              <Link href="/portal" className="flex items-center">
                <Button variant="ghost" size="icon" className="text-white hover:bg-green-800 h-10 w-10">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex space-x-2">
                <DropdownMenu open={compartilharAberto} onOpenChange={setCompartilharAberto}>
                  <DropdownMenuTrigger asChild>
                    <Button size="sm" variant="ghost" className="text-white hover:bg-green-800 p-2">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem onClick={compartilharWhatsApp} className="cursor-pointer">
                      <WhatsAppIcon className="h-4 w-4 mr-2 text-green-600" />
                      Compartilhar no WhatsApp
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={compartilharFacebook} className="cursor-pointer">
                      <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                      Compartilhar no Facebook
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={compartilharTwitter} className="cursor-pointer">
                      <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                      Compartilhar no Twitter
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={copiarLink} className="cursor-pointer">
                      <Copy className="h-4 w-4 mr-2 text-gray-600" />
                      Copiar Link
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Link href="/login">
                  <Button size="sm" variant="outline" className="bg-transparent text-white border-white hover:bg-green-800 text-xs px-2 py-1">
                    Anunciante
                  </Button>
                </Link>
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight mb-1">
                {anuncio.titulo}
              </h1>
              <p className="flex items-center text-sm text-green-100">
                <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                <span className="truncate">
                  {anuncio.detalhes?.cidade || "Localização não informada"}, 
                  {anuncio.detalhes?.estado || ""}
                </span>
              </p>
            </div>
          </div>
          
          {/* Desktop Layout */}
          <div className="hidden md:flex justify-between items-center">
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
            <Button size="sm" variant="ghost" className="text-white hover:bg-green-800">
              <Share2 className="h-4 w-4 mr-2" />
              Compartilhar
            </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={compartilharWhatsApp} className="cursor-pointer">
                    <WhatsAppIcon className="h-4 w-4 mr-2 text-green-600" />
                    Compartilhar no WhatsApp
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={compartilharFacebook} className="cursor-pointer">
                    <Facebook className="h-4 w-4 mr-2 text-blue-600" />
                    Compartilhar no Facebook
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={compartilharTwitter} className="cursor-pointer">
                    <Twitter className="h-4 w-4 mr-2 text-blue-400" />
                    Compartilhar no Twitter
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={copiarLink} className="cursor-pointer">
                    <Copy className="h-4 w-4 mr-2 text-gray-600" />
                    Copiar Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            <Link href="/login">
              <Button size="sm" variant="outline" className="bg-transparent text-white border-white hover:bg-green-800">
                Área do Anunciante
              </Button>
            </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-4 md:py-8 px-4 sm:px-6 lg:px-8">
        {/* Galeria e Informações Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8 mb-6 md:mb-8">
          {/* Galeria */}
          <div className="lg:col-span-2 bg-white rounded-lg md:rounded-xl overflow-hidden shadow-lg">
            <div className="image-container relative h-[250px] md:h-[400px] max-h-[400px] overflow-hidden" style={{ maxHeight: '400px' }}>
              {/* Imagem principal */}
              {carregandoImagens ? (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando imagens...</p>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={imagensParaExibir[currentImageIndex]?.url || imagemPadrao.url} 
                    alt={imagensParaExibir[currentImageIndex]?.url ? `Imagem ${currentImageIndex + 1} da fazenda` : imagemPadrao.alt} 
                    className="w-full h-full object-cover max-h-[400px]"
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: 'auto',
                      maxHeight: '400px'
                    }}
                  />
                </div>
              )}
              
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
              <div className="absolute inset-0 flex items-center justify-between px-2 md:px-4 pointer-events-none">
                <Button 
                  onClick={prevImage} 
                  variant="outline" 
                  size="icon" 
                  className="bg-white/90 hover:bg-white text-green-900 rounded-full h-8 w-8 md:h-10 md:w-10 pointer-events-auto shadow-md"
                >
                  <ChevronLeft className="h-4 w-4 md:h-6 md:w-6" />
                </Button>
                <Button 
                  onClick={nextImage} 
                  variant="outline" 
                  size="icon" 
                  className="bg-white/90 hover:bg-white text-green-900 rounded-full h-8 w-8 md:h-10 md:w-10 pointer-events-auto shadow-md"
                >
                  <ChevronRight className="h-4 w-4 md:h-6 md:w-6" />
                </Button>
              </div>
              
              {/* Contador de imagens */}
              <div className="absolute bottom-2 md:bottom-4 right-2 md:right-4 bg-black/70 text-white px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium z-10">
                <div className="flex items-center">
                  <Camera className="h-3 w-3 md:h-4 md:w-4 mr-1" />
                  {currentImageIndex + 1}/{imagensParaExibir.length}
                </div>
              </div>
            </div>
            
            {/* Miniaturas */}
            <div className="flex p-2 md:p-3 gap-1 md:gap-2 bg-gray-50 overflow-x-auto">
              {imagensParaExibir.map((img, index) => (
                <div 
                  key={index} 
                  className={`w-16 h-16 md:w-20 md:h-20 rounded-md overflow-hidden cursor-pointer transition flex-shrink-0
                              ${index === currentImageIndex ? 'ring-2 ring-green-600' : 'opacity-70 hover:opacity-100'}`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <img 
                    src={img.url} 
                    alt={img.url ? `Miniatura ${index + 1}` : img.alt} 
                    className="w-full h-full object-cover" 
                  />
                </div>
              ))}
            </div>
          </div>
          
          {/* Informações Principais */}
          <div>
            <Card className="shadow-lg border-0 mb-4">
              <CardHeader className="pb-2 border-b">
                <CardTitle className="text-2xl md:text-3xl font-bold text-green-900 flex items-center">
                  <DollarSign className="h-6 w-6 md:h-7 md:w-7 text-green-700 mr-1 flex-shrink-0" />
                  <span className="break-words">{anuncio.preco}</span>
                </CardTitle>
                <CardDescription className="flex items-center text-green-700 text-base md:text-lg">
                  <Tag className="h-4 w-4 md:h-5 md:w-5 mr-2 flex-shrink-0" />
                  {anuncio.detalhes?.tipo_oferta === 'venda' ? 'Venda' : 'Arrendamento'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-5 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                  <div className="flex items-center">
                    <Square className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-700 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Área Total</p>
                      <p className="font-medium text-sm md:text-base">{anuncio.detalhes?.area || "?"} hectares</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <TractorIcon className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-700 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Finalidade</p>
                      <p className="font-medium text-sm md:text-base">{anuncio.detalhes?.finalidade || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-700 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Documentação</p>
                      <p className="font-medium text-sm md:text-base">{anuncio.detalhes?.documentacao || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Landmark className="h-4 w-4 md:h-5 md:w-5 mr-2 text-green-700 flex-shrink-0" />
                    <div>
                      <p className="text-xs md:text-sm text-gray-500">Distância</p>
                      <p className="font-medium text-sm md:text-base">{anuncio.detalhes?.distancia || "?"} km</p>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 text-xs md:text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                    <span className="truncate">Publicado: {new Date(anuncio.datapublicacao).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="h-3 w-3 md:h-4 md:w-4 mr-1 flex-shrink-0" />
                    <span>{anuncio.visualizacoes} visualizações</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-2 md:space-y-3 pt-0">
                <Button 
                  className="w-full bg-green-700 hover:bg-green-800 h-12 md:h-10"
                  onClick={() => setLeadModalOpen(true)}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Entrar em contato
                </Button>
                <div className="grid grid-cols-2 gap-2 md:gap-3 w-full">
                  <Button 
                    variant="outline" 
                    className={`w-full h-10 text-sm ${
                      favoritado 
                        ? 'border-red-200 text-red-700 hover:bg-red-50 bg-red-50' 
                        : 'border-green-200 text-green-700 hover:bg-green-50'
                    }`}
                    onClick={toggleFavorito}
                  >
                    <Heart className={`h-4 w-4 mr-1 md:mr-2 ${favoritado ? 'fill-current' : ''}`} />
                    <span className="hidden md:inline">
                      {favoritado ? 'Favoritado' : 'Favoritar'}
                    </span>
                    <span className="md:hidden">
                      {favoritado ? 'Fav ✓' : 'Fav'}
                    </span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full border-green-200 text-green-700 hover:bg-green-50 h-10 text-sm"
                    onClick={abrirMensagem}
                  >
                    <Mail className="h-4 w-4 mr-1 md:mr-2" />
                    <span className="hidden md:inline">Mensagem</span>
                    <span className="md:hidden">Msg</span>
                  </Button>
                </div>
              </CardFooter>
            </Card>
            
            {/* Corretor/Anunciante */}
            <Card className="shadow-md border-0">
              <CardHeader className="pb-3">
                <CardTitle className="text-base md:text-lg">Anunciante</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                {carregandoAnunciante ? (
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-200 rounded-full animate-pulse"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-3 md:h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                      <div className="h-2 md:h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 md:space-x-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700 font-bold text-sm md:text-lg">
                        {anunciante ? obterIniciais(anunciante.nome) : "??"}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm md:text-base truncate">
                        {anunciante ? anunciante.nome : "Anunciante não disponível"}
                      </p>
                      <p className="text-xs md:text-sm text-gray-500 truncate">
                        {anunciante?.plano === "Premium" ? "Anunciante Premium" : "Corretor especializado"}
                      </p>
                      {anunciante?.plano === "Premium" && (
                        <p className="text-xs md:text-sm text-green-600 mt-1">Anunciante verificado</p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Tabs de Detalhes */}
        <Tabs defaultValue="detalhes" className="mt-6 md:mt-8">
          <TabsList className="bg-white w-full grid grid-cols-3 p-1 rounded-t-xl shadow-md mb-1 h-10 md:h-11">
            <TabsTrigger 
              value="detalhes" 
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs md:text-sm"
            >
              Detalhes
            </TabsTrigger>
            <TabsTrigger 
              value="estruturas"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs md:text-sm"
            >
              Estruturas
            </TabsTrigger>
            <TabsTrigger 
              value="localizacao"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-xs md:text-sm"
            >
              Localização
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="detalhes" className="mt-0">
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-green-900 text-base md:text-lg">Detalhes da Propriedade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 md:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="bg-green-50 p-2 md:p-3 rounded-full flex-shrink-0">
                      <Droplets className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-500">Recurso Hídrico</p>
                      <p className="font-medium text-sm md:text-base truncate">{anuncio.detalhes?.recurso_hidrico || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="bg-green-50 p-2 md:p-3 rounded-full flex-shrink-0">
                      <Zap className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-500">Energia</p>
                      <p className="font-medium text-sm md:text-base truncate">{anuncio.detalhes?.energia || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="bg-green-50 p-2 md:p-3 rounded-full flex-shrink-0">
                      <Mountain className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-500">Tipo de Solo</p>
                      <p className="font-medium text-sm md:text-base truncate">{anuncio.detalhes?.tipo_solo || "Não informado"}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 md:space-x-3">
                    <div className="bg-green-50 p-2 md:p-3 rounded-full flex-shrink-0">
                      <FileText className="h-4 w-4 md:h-5 md:w-5 text-green-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs md:text-sm font-medium text-gray-500">Documentação</p>
                      <p className="font-medium text-sm md:text-base truncate">{anuncio.detalhes?.documentacao || "Não informado"}</p>
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
              <CardHeader className="pb-3">
                <CardTitle className="text-green-900 text-base md:text-lg flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-green-600" />
                  Localização da Propriedade
                </CardTitle>
              </CardHeader>
              <CardContent>
                {anuncio.detalhes?.coordenadas ? (
                  <div className="space-y-4">
                    {/* Mapa do Google Maps sem necessidade de API Key */}
                    <div className="rounded-lg overflow-hidden border border-gray-200 shadow-md">
                      <iframe
                        width="100%"
                        height="400"
                        frameBorder="0"
                        style={{ border: 0 }}
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${anuncio.detalhes.coordenadas}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        allowFullScreen
                      ></iframe>
                    </div>
                    
                    {/* Informações da Localização */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm font-semibold text-green-800 mb-1">
                            📍 Coordenadas GPS
                          </div>
                          <div className="text-xs text-gray-600">
                            {anuncio.detalhes.coordenadas}
                          </div>
                        </div>
                        <Badge className="bg-green-600">Localização Verificada</Badge>
                      </div>
                    </div>
                    
                    {/* Botões de ação do mapa */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${anuncio.detalhes.coordenadas}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button className="w-full bg-green-600 hover:bg-green-700">
                          <MapPin className="h-4 w-4 mr-2" />
                          Abrir no Google Maps
                        </Button>
                      </a>
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${anuncio.detalhes.coordenadas}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button variant="outline" className="w-full border-green-600 text-green-700 hover:bg-green-50">
                          <svg className="h-4 w-4 mr-2" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                          </svg>
                          Como Chegar
                        </Button>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg h-80 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 font-medium mb-2">
                        Localização Aproximada
                      </p>
                      <p className="text-sm text-gray-500">
                        As coordenadas exatas não foram informadas pelo anunciante
                    </p>
                  </div>
                </div>
                )}
                
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
        
      </main>

      {/* Modal de Mensagem */}
      <Dialog open={modalMensagem} onOpenChange={setModalMensagem}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Enviar Mensagem</DialogTitle>
            <DialogDescription>
              Envie uma mensagem direta para o anunciante sobre esta propriedade.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nomeMsg">Seu nome</Label>
              <Input id="nomeMsg" placeholder="Seu nome completo" />
                </div>
            <div>
              <Label htmlFor="emailMsg">E-mail</Label>
              <Input id="emailMsg" type="email" placeholder="seu@email.com" />
                  </div>
            <div>
              <Label htmlFor="telefoneMsg">Telefone</Label>
              <Input id="telefoneMsg" placeholder="(11) 99999-9999" />
          </div>
            <div>
              <Label htmlFor="assuntoMsg">Assunto</Label>
              <Input id="assuntoMsg" placeholder="Interesse na propriedade" />
        </div>
            <div>
              <Label htmlFor="mensagemMsg">Mensagem</Label>
              <Textarea 
                id="mensagemMsg" 
                placeholder="Olá! Tenho interesse em saber mais sobre esta propriedade..."
                className="min-h-[120px]"
              />
            </div>
            <div className="flex space-x-2">
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => {
                  // Aqui você pode implementar o envio da mensagem
                  alert('Mensagem enviada com sucesso! O anunciante entrará em contato em breve.');
                  setModalMensagem(false);
                }}
              >
                <Mail className="h-4 w-4 mr-2" />
                Enviar
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setModalMensagem(false)}
              >
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
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
              <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-green-400 to-green-600 text-transparent bg-clip-text">Fazendeiro IA</h3>
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
                Email: contato@fazendeiroia.com.br<br />
                Telefone: (11) 4321-1234
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Fazendeiro IA. Todos os direitos reservados.</p>
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