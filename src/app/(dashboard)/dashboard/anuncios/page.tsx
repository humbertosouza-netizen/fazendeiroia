"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import CadastroIAAnuncioModal from "@/components/CadastroIAAnuncioModal";
import VisualizarAnuncioModal from "@/components/VisualizarAnuncioModal";
import GerenciarImagens from "@/components/GerenciarImagens";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import anunciosService, { Anuncio, FazendaDetalhes } from "@/services/anunciosService";

export default function AnunciosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalAberto, setModalAberto] = useState(false);
  const [modalIAAberto, setModalIAAberto] = useState(false);
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
  const [modalVisualizacaoAberto, setModalVisualizacaoAberto] = useState(false);
  const [anuncioParaVisualizar, setAnuncioParaVisualizar] = useState<Anuncio | null>(null);
  const [imagensSelecionadas, setImagensSelecionadas] = useState<FileList | null>(null);
  const [uploadandoImagens, setUploadandoImagens] = useState(false);
  const [tipoAnuncio, setTipoAnuncio] = useState("fazenda");
  const [tipoOferta, setTipoOferta] = useState("venda");
  const [modoEdicao, setModoEdicao] = useState(false);
  const [anuncioEmEdicao, setAnuncioEmEdicao] = useState<any>(null);
  const [anuncioParaExcluir, setAnuncioParaExcluir] = useState<any>(null);
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  
  const [novoAnuncio, setNovoAnuncio] = useState<Anuncio>({
    titulo: "",
    categoria: "Fazenda",
    preco: "",
    status: "Ativo",
    visualizacoes: 0,
    datapublicacao: new Date().toLocaleDateString("pt-BR")
  });
  
  const [detalhes, setDetalhes] = useState<Partial<FazendaDetalhes>>({
    estado: "",
    regiao: "",
    finalidade: "Pecuária",
    area: 0,
    cidade: "",
    distancia: 0,
    acesso: "",
    recurso_hidrico: "",
    energia: "",
    tipo_solo: "",
    documentacao: "",
    estruturas: [],
    tipo_oferta: "venda",
  });
  
  const itemsPerPage = 5;
  
  // Carregar anúncios do Supabase quando a página for montada
  useEffect(() => {
    carregarAnuncios();
  }, []);
  
  // Função para carregar anúncios do Supabase
  const carregarAnuncios = async () => {
    setCarregando(true);
    try {
      const data = await anunciosService.getAnuncios();
      setAnuncios(data || []);
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar seus anúncios. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };
  
  // Funções para calcular estatísticas dinâmicas de anúncios
  const calcularAnunciosPorStatus = () => {
    const statusCounts = {
      Ativo: 0,
      Pausado: 0,
      Vendido: 0
    };
    
    anuncios.forEach(anuncio => {
      if (anuncio.status in statusCounts) {
        statusCounts[anuncio.status as keyof typeof statusCounts]++;
      }
    });
    
    return [
      { status: "Ativo", total: statusCounts.Ativo, color: "bg-green-500" },
      { status: "Pausado", total: statusCounts.Pausado, color: "bg-amber-500" },
      { status: "Vendido", total: statusCounts.Vendido, color: "bg-blue-500" },
    ];
  };
  
  const calcularCategoriasMaisPopulares = () => {
    const categoriaCounts: Record<string, number> = {};
    
    // Contar anúncios por categoria
    anuncios.forEach(anuncio => {
      if (anuncio.categoria) {
        categoriaCounts[anuncio.categoria] = (categoriaCounts[anuncio.categoria] || 0) + 1;
      }
    });
    
    // Converter em array e ordenar por quantidade (decrescente)
    const categoriasOrdenadas = Object.entries(categoriaCounts)
      .map(([categoria, total]) => ({ categoria, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 5); // Pegar as 5 mais populares
    
    // Associar cores às categorias
    const cores = ["bg-blue-500", "bg-purple-500", "bg-pink-500", "bg-green-500", "bg-orange-500"];
    
    return categoriasOrdenadas.map((item, index) => ({
      ...item,
      color: cores[index % cores.length] // Para garantir que não ficamos sem cores
    }));
  };
  
  const calcularVisualizacoes = () => {
    // Calcular total de visualizações
    const totalVisualizacoes = anuncios.reduce((sum, anuncio) => sum + (anuncio.visualizacoes || 0), 0);
    
    // Encontrar os 3 anúncios mais vistos
    const anunciosMaisVistos = [...anuncios]
      .sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
      .slice(0, 3)
      .map(anuncio => ({
        titulo: anuncio.titulo,
        visualizacoes: anuncio.visualizacoes || 0
      }));
      
    // Nota: Percentual de crescimento seria melhor calculado com dados históricos
    // Por enquanto, vamos usar um valor fictício ou calculado de outra forma
    const percentualCrescimento = 15; // Em uma implementação real, você calcularia isso
    
    return {
      total: totalVisualizacoes,
      maisVistos: anunciosMaisVistos,
      percentualCrescimento
    };
  };
  
  // Calcular as estatísticas
  const estatisticasStatus = calcularAnunciosPorStatus();
  const estatisticasCategorias = calcularCategoriasMaisPopulares();
  const estatisticasVisualizacoes = calcularVisualizacoes();
  
  // Filtragem de anúncios com base no termo de busca
  const filteredAnuncios = anuncios.filter(anuncio =>
    anuncio.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anuncio.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredAnuncios.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredAnuncios.length / itemsPerPage);
  
  // Status com cor
  const statusColors = {
    Ativo: "text-green-600 bg-green-50",
    Pausado: "text-amber-600 bg-amber-50",
    Vendido: "text-blue-600 bg-blue-50",
  };

  // Opções para os selects
  const estados = [
    "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", 
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
  ];
  
  const finalidades = [
    "Pecuária", "Agricultura", "Misto", "Lazer", "Cultivo de Grãos",
    "Fruticultura", "Silvicultura", "Outro"
  ];
  
  const recursosHidricos = [
    "Rio", "Açude", "Poço Artesiano", "Nascente", "Lago/Lagoa", "Córrego", "Não possui"
  ];
  
  const energias = [
    "Rede Elétrica", "Gerador", "Energia Solar", "Não possui"
  ];
  
  const estruturas = [
    { id: "sede", label: "Sede" },
    { id: "casaFuncionarios", label: "Casa de Funcionários" },
    { id: "galpao", label: "Galpão" },
    { id: "curral", label: "Curral" },
    { id: "cercas", label: "Cercas" },
    { id: "cocheiras", label: "Cocheiras" },
    { id: "piscina", label: "Piscina" },
    { id: "barracao", label: "Barracão" },
  ];
  
  const documentacoes = [
    "Regular", "Em Regularização", "Inventário", "CAR", "GEO"
  ];

  // Função para lidar com mudanças nos campos do formulário básico
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    
    if (modoEdicao && anuncioEmEdicao) {
      setAnuncioEmEdicao({
        ...anuncioEmEdicao,
        [id]: value
      });
    } else {
      setNovoAnuncio({
        ...novoAnuncio,
        [id]: value
      });
    }
  };
  
  // Função para lidar com mudanças nos campos do formulário de detalhes
  const handleDetalhesChange = (id: string, value: any) => {
    if (modoEdicao && anuncioEmEdicao?.detalhes) {
      setAnuncioEmEdicao({
        ...anuncioEmEdicao,
        detalhes: {
          ...anuncioEmEdicao.detalhes,
          [id]: value
        }
      });
    } else {
      setDetalhes({
        ...detalhes,
        [id]: value
      });
    }
  };
  
  // Função para lidar com mudanças em checkboxes de estruturas
  const handleEstruturaChange = (id: string, checked: boolean) => {
    let estruturas: string[] = [];
    
    if (modoEdicao && anuncioEmEdicao?.detalhes) {
      estruturas = [...(anuncioEmEdicao.detalhes.estruturas || [])];
    } else {
      estruturas = [...(detalhes.estruturas || [])];
    }
    
    if (checked) {
      estruturas.push(id);
    } else {
      estruturas = estruturas.filter(item => item !== id);
    }
    
    if (modoEdicao && anuncioEmEdicao?.detalhes) {
      setAnuncioEmEdicao({
        ...anuncioEmEdicao,
        detalhes: {
          ...anuncioEmEdicao.detalhes,
          estruturas
        }
      });
    } else {
      setDetalhes({
        ...detalhes,
        estruturas
      });
    }
  };
  
  // Função para salvar as alterações (atualizar ou criar)
  const salvarAnuncio = async () => {
    setSalvando(true);
    
    try {
      if (modoEdicao && anuncioEmEdicao) {
        // Atualizar anúncio existente
        const anuncioAtualizado: Partial<Anuncio> = {
          titulo: anuncioEmEdicao.titulo,
          categoria: anuncioEmEdicao.categoria,
          preco: anuncioEmEdicao.preco.startsWith("R$") 
            ? anuncioEmEdicao.preco 
            : `R$ ${anuncioEmEdicao.preco}`,
          status: anuncioEmEdicao.status
        };
        
        const detalhesAtualizados: Partial<FazendaDetalhes> = anuncioEmEdicao.detalhes 
          ? { 
              ...anuncioEmEdicao.detalhes,
              tipo_oferta: tipoOferta as 'venda' | 'arrendamento'
            }
          : {
              ...detalhes,
              tipo_oferta: tipoOferta as 'venda' | 'arrendamento'
            };
        
        const success = await anunciosService.atualizarAnuncio(
          anuncioEmEdicao.id,
          anuncioAtualizado,
          detalhesAtualizados
        );
        
        if (success) {
          toast({
            title: "Sucesso",
            description: "Anúncio atualizado com sucesso!",
          });
          await carregarAnuncios();
        } else {
          throw new Error("Não foi possível atualizar o anúncio");
        }
      } else {
        // Criar novo anúncio
        // Formatar preço corretamente
        const precoFormatado = novoAnuncio.preco 
          ? `R$ ${parseInt(novoAnuncio.preco).toLocaleString('pt-BR')}`
          : "R$ 0,00";
          
        const novoAnuncioCompleto: Anuncio = {
          ...novoAnuncio,
          preco: precoFormatado,
          visualizacoes: 0,
          datapublicacao: new Date().toLocaleDateString("pt-BR")
        };
        
        console.log('📝 Dados do anúncio a ser criado:', novoAnuncioCompleto);
        
        const detalhesCompletos: FazendaDetalhes = {
          ...detalhes as FazendaDetalhes,
          anuncio_id: "",  // Será preenchido pelo serviço
          tipo_oferta: tipoOferta as 'venda' | 'arrendamento'
        };
        
        const resultado = await anunciosService.criarAnuncio(novoAnuncioCompleto, detalhesCompletos);
        
        if (resultado && resultado.id) {
          console.log('✅ Anúncio criado com ID:', resultado.id);
          console.log('🖼️ Imagens selecionadas:', imagensSelecionadas?.length || 0);
          
          // Upload das imagens se houver
          if (imagensSelecionadas && imagensSelecionadas.length > 0) {
            console.log('🚀 Iniciando upload das imagens...');
            setUploadandoImagens(true);
            try {
              const uploadResultado = await anunciosService.uploadImagensAnuncio(imagensSelecionadas, resultado.id);
              
              if (uploadResultado.sucesso > 0) {
                toast({
                  title: "Sucesso",
                  description: `Anúncio criado e ${uploadResultado.sucesso} imagem(ns) enviada(s) com sucesso!`,
                });
              } else {
                toast({
                  title: "Sucesso",
                  description: "Anúncio criado com sucesso!",
                });
              }
              
              if (uploadResultado.erros.length > 0) {
                uploadResultado.erros.forEach(erro => 
                  toast({
                    title: "Aviso",
                    description: erro,
                    variant: "destructive",
                  })
                );
              }
            } catch (error) {
              console.error("Erro no upload das imagens:", error);
              toast({
                title: "Aviso",
                description: "Anúncio criado, mas houve erro ao enviar imagens.",
                variant: "destructive",
              });
            } finally {
              setUploadandoImagens(false);
            }
          } else {
            toast({
              title: "Sucesso",
              description: "Anúncio criado com sucesso!",
            });
          }
          
          // Resetar o formulário e carregar anúncios
          setNovoAnuncio({
            titulo: "",
            categoria: "Fazenda",
            preco: "",
            status: "Ativo",
            visualizacoes: 0,
            datapublicacao: new Date().toLocaleDateString("pt-BR")
          });
          
          setDetalhes({
            estado: "",
            regiao: "",
            finalidade: "Pecuária",
            area: 0,
            cidade: "",
            distancia: 0,
            acesso: "",
            recurso_hidrico: "",
            energia: "",
            tipo_solo: "",
            documentacao: "",
            estruturas: [],
            tipo_oferta: "venda",
          });
          
          setImagensSelecionadas(null);
          await carregarAnuncios();
        } else {
          throw new Error("Não foi possível criar o anúncio");
        }
      }
      
      setModalAberto(false);
    } catch (error) {
      console.error("Erro ao salvar anúncio:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o anúncio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setSalvando(false);
    }
  };

  // Função para abrir o modal para edição
  const abrirEdicao = async (anuncio: Anuncio) => {
    try {
      setCarregando(true);
      setImagensSelecionadas(null); // Limpar imagens selecionadas
      
      console.log('🔍 Carregando anúncio para edição:', anuncio.id);
      
      // Buscar detalhes completos do anúncio
      const anuncioCompleto = await anunciosService.getAnuncioDetalhes(anuncio.id!);
      
      console.log('📋 Anúncio completo carregado:', anuncioCompleto);
      console.log('📋 Detalhes da fazenda:', anuncioCompleto?.detalhes);
      
      if (anuncioCompleto) {
        setAnuncioEmEdicao(anuncioCompleto);
        setModoEdicao(true);
        setModalAberto(true);
        
        // Definir o tipo de oferta com base nos detalhes
        if (anuncioCompleto.detalhes?.tipo_oferta) {
          setTipoOferta(anuncioCompleto.detalhes.tipo_oferta);
          console.log('✅ Tipo de oferta definido:', anuncioCompleto.detalhes.tipo_oferta);
        } else {
          setTipoOferta("venda");
          console.log('⚠️ Tipo de oferta padrão definido: venda');
        }
        
        console.log('✅ Modal de edição aberto com dados carregados');
      } else {
        throw new Error("Não foi possível carregar os detalhes do anúncio");
      }
    } catch (error) {
      console.error("Erro ao abrir edição:", error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do anúncio para edição.",
        variant: "destructive",
      });
    } finally {
      setCarregando(false);
    }
  };
  
  
  // Função para abrir o modal de confirmação de exclusão
  const confirmarExclusao = (anuncio: Anuncio) => {
    setAnuncioParaExcluir(anuncio);
    setModalExclusaoAberto(true);
  };

  // Função para abrir o modal de visualização
  const visualizarAnuncio = (anuncio: Anuncio) => {
    setAnuncioParaVisualizar(anuncio);
    setModalVisualizacaoAberto(true);
  };

  // Função para abrir o anúncio no portal
  const verNoPortal = (anuncio: Anuncio) => {
    if (anuncio.id) {
      window.open(`/portal/anuncio/${anuncio.id}`, '_blank');
    }
  };
  
  // Função para excluir o anúncio
  const excluirAnuncio = async () => {
    if (!anuncioParaExcluir?.id) return;
    
    setExcluindo(true);
    try {
      const success = await anunciosService.excluirAnuncio(anuncioParaExcluir.id);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: "Anúncio excluído com sucesso!",
        });
        
        // Atualizar lista de anúncios
        await carregarAnuncios();
        
        // Ajustar a paginação se necessário
        if (currentPage > Math.ceil((anuncios.length - 1) / itemsPerPage) && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } else {
        throw new Error("Não foi possível excluir o anúncio");
      }
      
      setModalExclusaoAberto(false);
    } catch (error) {
      console.error("Erro ao excluir anúncio:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao excluir o anúncio. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setExcluindo(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Meus Anúncios</h1>
      </div>
      <div>
            <Button 
              onClick={() => setModalIAAberto(true)} 
              className="w-full md:w-auto h-9 px-3 text-sm bg-gradient-to-r from-green-600 to-green-700 text-white shadow-lg shadow-green-400/40 ring-2 ring-green-400/30 hover:ring-green-300/50 hover:shadow-green-300/70 transition-transform hover:scale-[1.02]"
            >
          🤖 Cadastrar propriedade com IA
        </Button>
      </div>
      
      <div className="space-y-4">
          <Card className="mobile-full-width">
            <CardHeader className="pb-2">
              <CardTitle>Gerenciar Anúncios</CardTitle>
              <CardDescription>
                Visualize, edite ou remova seus anúncios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Buscar por título ou categoria" 
                      className="pl-9"
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1); // Reset para a primeira página ao buscar
                      }}
                    />
                  </div>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[300px]">
                          <div className="flex items-center">
                            Título
                            <ArrowUpDown className="ml-2 h-4 w-4" />
                          </div>
                        </TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Preço</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Publicado em</TableHead>
                        <TableHead className="text-right">Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {carregando ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-10">
                            <div className="flex justify-center">
                              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                            </div>
                            <div className="mt-2 text-sm text-gray-500">
                              Carregando anúncios...
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : currentItems.length > 0 ? (
                        currentItems.map((anuncio) => (
                          <TableRow key={anuncio.id}>
                            <TableCell className="font-medium">{anuncio.titulo}</TableCell>
                            <TableCell>{anuncio.categoria}</TableCell>
                            <TableCell>{anuncio.preco}</TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                statusColors[anuncio.status as keyof typeof statusColors]
                              }`}>
                                {anuncio.status}
                              </span>
                            </TableCell>
                            <TableCell>{new Date(anuncio.datapublicacao).toLocaleDateString("pt-BR")}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end flex-wrap gap-2">
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => visualizarAnuncio(anuncio)}
                                >
                                  Ver resumo
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => verNoPortal(anuncio)}
                                >
                                  Ver no portal
                                </Button>
                                <Button 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => abrirEdicao(anuncio)}
                                >
                                  Editar
                                </Button>
                                <Button 
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => confirmarExclusao(anuncio)}
                                >
                                  Excluir
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-4">
                            {searchTerm ? "Nenhum anúncio encontrado com esse termo" : "Você ainda não tem anúncios cadastrados"}
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Paginação */}
                {filteredAnuncios.length > 0 && (
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Mostrando {indexOfFirstItem + 1} a {Math.min(indexOfLastItem, filteredAnuncios.length)} de {filteredAnuncios.length} anúncios
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="mobile-full-width">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Anúncios por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estatisticasStatus.map((item) => (
                    <div key={item.status} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${item.color} mr-2`}></div>
                        <span>{item.status}</span>
                      </div>
                      <span className="font-medium">{item.total}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mobile-full-width">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Categorias Populares</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {estatisticasCategorias.map((item) => (
                    <div key={item.categoria} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${item.color} mr-2`}></div>
                        <span>{item.categoria}</span>
                      </div>
                      <span className="font-medium">{item.total}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="mobile-full-width">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Visualizações Totais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{estatisticasVisualizacoes.total}</div>
                <p className="text-xs text-green-500 mt-1">+{estatisticasVisualizacoes.percentualCrescimento}% desde a semana passada</p>
                <div className="mt-4 space-y-2">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">Anúncios mais vistos</div>
                    {estatisticasVisualizacoes.maisVistos.map((item, index) => (
                      <div key={index} className="text-xs text-gray-500 flex justify-between">
                        <span>{item.titulo}</span>
                        <span>{item.visualizacoes} visualizações</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
      </div>
      
      {/* Modal para criar ou editar anúncios (estilo similar ao IA) */}
      <Dialog open={modalAberto} onOpenChange={setModalAberto}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-700">
              {modoEdicao ? "Editar Anúncio" : "Cadastrar Fazenda"}
            </DialogTitle>
            <DialogDescription>
              {modoEdicao
                ? "Atualize as informações da sua fazenda. Ao salvar, os dados serão refletidos no portal."
                : "Preencha os detalhes da fazenda para venda ou arrendamento."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
              {carregando ? (
                <div className="py-10 flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">Carregando dados do anúncio...</p>
                </div>
              ) : (
                <>
                  {/* Tipo de oferta */}
                  <div className="space-y-2">
                    <Label>Tipo de Oferta</Label>
                    <RadioGroup 
                      value={tipoOferta}
                      className="flex space-x-4"
                      onValueChange={setTipoOferta}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="venda" id="venda" />
                        <Label htmlFor="venda">Venda</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="arrendamento" id="arrendamento" />
                        <Label htmlFor="arrendamento">Arrendamento</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {/* Informações Básicas */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Informações Básicas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Nome da Fazenda</Label>
                        <Input 
                          id="titulo" 
                          placeholder="Nome da propriedade" 
                          value={modoEdicao && anuncioEmEdicao ? anuncioEmEdicao.titulo : novoAnuncio.titulo}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="estado">Estado</Label>
                        <Select
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.estado ? anuncioEmEdicao.detalhes.estado : detalhes.estado}
                          onValueChange={(value) => handleDetalhesChange("estado", value)}
                        >
                          <SelectTrigger id="estado">
                            <SelectValue placeholder="Selecione o estado" />
                          </SelectTrigger>
                          <SelectContent>
                            {estados.map((estado) => (
                              <SelectItem key={estado} value={estado}>
                                {estado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="regiao">Região</Label>
                        <Input 
                          id="regiao" 
                          placeholder="Região da propriedade" 
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.regiao ? anuncioEmEdicao.detalhes.regiao : detalhes.regiao}
                          onChange={(e) => handleDetalhesChange("regiao", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="finalidade">Finalidade</Label>
                        <Select
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.finalidade ? anuncioEmEdicao.detalhes.finalidade : detalhes.finalidade}
                          onValueChange={(value) => handleDetalhesChange("finalidade", value)}
                        >
                          <SelectTrigger id="finalidade">
                            <SelectValue placeholder="Selecione a finalidade" />
                          </SelectTrigger>
                          <SelectContent>
                            {finalidades.map((finalidade) => (
                              <SelectItem key={finalidade} value={finalidade}>
                                {finalidade}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="area">Área (ha)</Label>
                        <Input 
                          id="area" 
                          type="number" 
                          placeholder="Área em hectares" 
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.area ? anuncioEmEdicao.detalhes.area : detalhes.area}
                          onChange={(e) => handleDetalhesChange("area", parseFloat(e.target.value))}
                        />
                      </div>
                      
                     <div className="space-y-2">
                       <Label htmlFor="preco">Preço (R$)</Label>
                       <Input 
                         id="preco" 
                         type="text" 
                         placeholder="Ex: 1000000" 
                         value={modoEdicao && anuncioEmEdicao 
                           ? anuncioEmEdicao.preco.replace(/[R$\s.,]/g, "") 
                           : novoAnuncio.preco.replace(/[R$\s.,]/g, "")}
                         onChange={(e) => {
                           const valor = e.target.value.replace(/\D/g, ""); // Remove tudo que não é dígito
                           if (modoEdicao && anuncioEmEdicao) {
                             setAnuncioEmEdicao(prev => ({
                               ...prev,
                               preco: valor
                             }));
                           } else {
                             setNovoAnuncio(prev => ({
                               ...prev,
                               preco: valor
                             }));
                           }
                         }}
                       />
                       <p className="text-xs text-gray-500">
                         Digite apenas números (ex: 1000000 para R$ 1.000.000,00)
                       </p>
                     </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input 
                          id="cidade" 
                          placeholder="Cidade onde está localizada" 
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.cidade ? anuncioEmEdicao.detalhes.cidade : detalhes.cidade}
                          onChange={(e) => handleDetalhesChange("cidade", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recurso_hidrico">Recurso Hídrico</Label>
                        <Select
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.recurso_hidrico ? anuncioEmEdicao.detalhes.recurso_hidrico : detalhes.recurso_hidrico}
                          onValueChange={(value) => handleDetalhesChange("recurso_hidrico", value)}
                        >
                          <SelectTrigger id="recurso_hidrico">
                            <SelectValue placeholder="Selecione o recurso hídrico" />
                          </SelectTrigger>
                          <SelectContent>
                            {recursosHidricos.map((recurso) => (
                              <SelectItem key={recurso} value={recurso}>
                                {recurso}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="energia">Energia</Label>
                        <Select
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.energia ? anuncioEmEdicao.detalhes.energia : detalhes.energia}
                          onValueChange={(value) => handleDetalhesChange("energia", value)}
                        >
                          <SelectTrigger id="energia">
                            <SelectValue placeholder="Selecione o tipo de energia" />
                          </SelectTrigger>
                          <SelectContent>
                            {energias.map((energia) => (
                              <SelectItem key={energia} value={energia}>
                                {energia}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="tipo_solo">Tipo de Solo</Label>
                        <Input 
                          id="tipo_solo" 
                          placeholder="Descrição do tipo de solo" 
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.tipo_solo ? anuncioEmEdicao.detalhes.tipo_solo : detalhes.tipo_solo}
                          onChange={(e) => handleDetalhesChange("tipo_solo", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="documentacao">Documentação</Label>
                        <Select
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.documentacao ? anuncioEmEdicao.detalhes.documentacao : detalhes.documentacao}
                          onValueChange={(value) => handleDetalhesChange("documentacao", value)}
                        >
                          <SelectTrigger id="documentacao">
                            <SelectValue placeholder="Selecione o tipo de documentação" />
                          </SelectTrigger>
                          <SelectContent>
                            {documentacoes.map((doc) => (
                              <SelectItem key={doc} value={doc}>
                                {doc}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Estruturas (Checkboxes) */}
                    <div className="space-y-3 mt-4">
                      <Label>Estruturas</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {estruturas.map((estrutura) => (
                          <div key={estrutura.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={estrutura.id} 
                              checked={modoEdicao && anuncioEmEdicao?.detalhes?.estruturas?.includes(estrutura.id) 
                                ? anuncioEmEdicao.detalhes.estruturas.includes(estrutura.id)
                                : detalhes.estruturas?.includes(estrutura.id) || false}
                              onCheckedChange={(checked) => handleEstruturaChange(estrutura.id, checked as boolean)}
                            />
                            <Label htmlFor={estrutura.id}>{estrutura.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                   {/* Gerenciamento de Imagens */}
                   <div className="space-y-3 mt-4">
                     <Label>Imagens</Label>
                     
                     {modoEdicao && anuncioEmEdicao?.id ? (
                       <GerenciarImagens 
                         anuncioId={anuncioEmEdicao.id}
                         onImagensAtualizadas={() => {
                           console.log('Imagens atualizadas');
                         }}
                       />
                     ) : (
                       <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center">
                         <p className="text-sm text-gray-500 mb-2">
                           Arraste as imagens ou clique para fazer upload
                         </p>
                         <Input 
                           type="file" 
                           multiple 
                           className="w-full cursor-pointer" 
                           accept="image/*"
                           onChange={(e) => {
                             const files = e.target.files;
                             if (files && files.length > 0) {
                               setImagensSelecionadas(files);
                               console.log('Arquivos selecionados:', files.length, 'imagem(ns)');
                             }
                           }}
                         />
                         <p className="text-xs text-gray-400 mt-1">
                           Formatos aceitos: JPG, PNG, WebP. Máximo 5MB por imagem.
                         </p>
                         
                         {/* Preview das imagens selecionadas */}
                         {imagensSelecionadas && imagensSelecionadas.length > 0 && (
                           <div className="mt-4">
                             <p className="text-sm font-medium text-gray-700 mb-2">
                               Imagens selecionadas ({imagensSelecionadas.length}):
                             </p>
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                               {Array.from(imagensSelecionadas).map((file, index) => (
                                 <div key={index} className="relative">
                                   <img
                                     src={URL.createObjectURL(file)}
                                     alt={`Preview ${index + 1}`}
                                     className="w-full h-20 object-cover rounded border"
                                   />
                                   <div className="absolute top-1 right-1 bg-black bg-opacity-50 text-white text-xs px-1 rounded">
                                     {Math.round(file.size / 1024)}KB
                                   </div>
                                 </div>
                               ))}
                             </div>
                           </div>
                         )}
                         
                         {/* Indicador de upload */}
                         {uploadandoImagens && (
                           <div className="mt-4 flex items-center justify-center">
                             <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600 mr-2"></div>
                             <span className="text-sm text-gray-600">Enviando imagens...</span>
                           </div>
                         )}
                       </div>
                     )}
                   </div>
                  </div>
                  
                  {/* Demais seções do formulário... */}
                </>
              )}
          </div>

          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" disabled={salvando}>Cancelar</Button>
            </DialogClose>
            <Button onClick={salvarAnuncio} disabled={salvando} className="bg-green-700 hover:bg-green-800">
              {salvando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : modoEdicao ? "Salvar Alterações" : "Publicar Anúncio"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal IA */}
      <CadastroIAAnuncioModal
        open={modalIAAberto}
        onOpenChange={setModalIAAberto}
        onCreated={async () => {
          await carregarAnuncios();
        }}
      />

      {/* Modal de Visualização */}
      <VisualizarAnuncioModal
        anuncio={anuncioParaVisualizar}
        open={modalVisualizacaoAberto}
        onOpenChange={setModalVisualizacaoAberto}
      />

      {/* Modal de confirmação de exclusão */}
      {modalExclusaoAberto && anuncioParaExcluir && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Confirmar Exclusão</CardTitle>
              <CardDescription>
                Tem certeza que deseja excluir este anúncio? Esta ação não pode ser desfeita.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="font-medium">{anuncioParaExcluir.titulo}</p>
              <p className="text-sm text-gray-500">
                Preço: {anuncioParaExcluir.preco} | Categoria: {anuncioParaExcluir.categoria}
              </p>
            </CardContent>
            <div className="flex justify-end gap-2 p-6 pt-0">
              <Button 
                variant="outline" 
                onClick={() => setModalExclusaoAberto(false)}
                disabled={excluindo}
              >
                Cancelar
              </Button>
              <Button 
                variant="destructive" 
                onClick={excluirAnuncio}
                disabled={excluindo}
              >
                {excluindo ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Excluindo...
                  </>
                ) : "Excluir"}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
} 