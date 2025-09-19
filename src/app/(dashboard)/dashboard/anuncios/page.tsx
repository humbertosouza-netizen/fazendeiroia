"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit, Trash2, Search, Filter, ArrowUpDown, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
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
  const [modalExclusaoAberto, setModalExclusaoAberto] = useState(false);
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
        const novoAnuncioCompleto: Anuncio = {
          ...novoAnuncio,
          preco: novoAnuncio.preco ? `R$ ${novoAnuncio.preco}` : "R$ 0,00",
          visualizacoes: 0,
          datapublicacao: new Date().toLocaleDateString("pt-BR")
        };
        
        const detalhesCompletos: FazendaDetalhes = {
          ...detalhes as FazendaDetalhes,
          anuncio_id: "",  // Será preenchido pelo serviço
          tipo_oferta: tipoOferta as 'venda' | 'arrendamento'
        };
        
        const resultado = await anunciosService.criarAnuncio(novoAnuncioCompleto, detalhesCompletos);
        
        if (resultado) {
          toast({
            title: "Sucesso",
            description: "Anúncio criado com sucesso!",
          });
          
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
      // Buscar detalhes completos do anúncio
      const anuncioCompleto = await anunciosService.getAnuncioDetalhes(anuncio.id!);
      
      if (anuncioCompleto) {
        setAnuncioEmEdicao(anuncioCompleto);
        setModoEdicao(true);
        setModalAberto(true);
        
        // Definir o tipo de oferta com base nos detalhes
        if (anuncioCompleto.detalhes?.tipo_oferta) {
          setTipoOferta(anuncioCompleto.detalhes.tipo_oferta);
        } else {
          setTipoOferta("venda");
        }
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
  
  // Função para abrir o modal para criar novo anúncio
  const abrirNovoAnuncio = () => {
    setAnuncioEmEdicao(null);
    setModoEdicao(false);
    setModalAberto(true);
    setTipoOferta("venda");
  };
  
  // Função para abrir o modal de confirmação de exclusão
  const confirmarExclusao = (anuncio: Anuncio) => {
    setAnuncioParaExcluir(anuncio);
    setModalExclusaoAberto(true);
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
        <h1 className="text-2xl font-bold tracking-tight">Meus Anúncios</h1>
        <Button 
          className="flex items-center" 
          onClick={abrirNovoAnuncio}
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Criar Anúncio
        </Button>
      </div>
      
      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="ativos">Ativos</TabsTrigger>
          <TabsTrigger value="pausados">Pausados</TabsTrigger>
          <TabsTrigger value="vendidos">Vendidos</TabsTrigger>
        </TabsList>
        
        {/* Tab de Todos os Anúncios */}
        <TabsContent value="todos" className="space-y-4">
          <Card>
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
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => abrirEdicao(anuncio)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => confirmarExclusao(anuncio)}
                                >
                                  <Trash2 className="h-4 w-4" />
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
            <Card>
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
            
            <Card>
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
            
            <Card>
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
        </TabsContent>
        
        {/* Conteúdo para as outras abas... */}
      </Tabs>
      
      {/* Modal para criar ou editar anúncios */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
          <Card className="w-full max-w-3xl max-h-screen overflow-y-auto">
            <CardHeader>
              <CardTitle>{modoEdicao ? "Editar Anúncio" : "Cadastrar Fazenda"}</CardTitle>
              <CardDescription>
                {modoEdicao 
                  ? "Atualize as informações da sua fazenda" 
                  : "Preencha os detalhes da fazenda para venda ou arrendamento"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
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
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.estado || detalhes.estado}
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
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.regiao || detalhes.regiao}
                          onChange={(e) => handleDetalhesChange("regiao", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="finalidade">Finalidade</Label>
                        <Select
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.finalidade || detalhes.finalidade}
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
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.area || detalhes.area}
                          onChange={(e) => handleDetalhesChange("area", parseFloat(e.target.value))}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="preco">Preço (R$)</Label>
                        <Input 
                          id="preco" 
                          type="number" 
                          placeholder="Valor em reais" 
                          value={modoEdicao && anuncioEmEdicao 
                            ? anuncioEmEdicao.preco.replace("R$ ", "") 
                            : novoAnuncio.preco}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cidade">Cidade</Label>
                        <Input 
                          id="cidade" 
                          placeholder="Cidade onde está localizada" 
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.cidade || detalhes.cidade}
                          onChange={(e) => handleDetalhesChange("cidade", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="recurso_hidrico">Recurso Hídrico</Label>
                        <Select
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.recurso_hidrico || detalhes.recurso_hidrico}
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
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.energia || detalhes.energia}
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
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.tipo_solo || detalhes.tipo_solo}
                          onChange={(e) => handleDetalhesChange("tipo_solo", e.target.value)}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="documentacao">Documentação</Label>
                        <Select
                          value={modoEdicao && anuncioEmEdicao?.detalhes?.documentacao || detalhes.documentacao}
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
                                || detalhes.estruturas?.includes(estrutura.id)}
                              onCheckedChange={(checked) => handleEstruturaChange(estrutura.id, checked as boolean)}
                            />
                            <Label htmlFor={estrutura.id}>{estrutura.label}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Upload de Imagens */}
                    <div className="space-y-3 mt-4">
                      <Label>Imagens</Label>
                      <div className="border-2 border-dashed border-gray-300 p-4 rounded-md text-center">
                        <p className="text-sm text-gray-500 mb-2">
                          Arraste as imagens ou clique para fazer upload
                        </p>
                        <Input 
                          type="file" 
                          multiple 
                          className="w-full cursor-pointer" 
                          accept="image/*"
                          // Implementar lógica de upload posteriormente
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Demais seções do formulário... */}
                </>
              )}
            </CardContent>
            <div className="flex justify-end gap-2 p-6 pt-0">
              <Button variant="outline" onClick={() => setModalAberto(false)} disabled={salvando}>
                Cancelar
              </Button>
              <Button onClick={salvarAnuncio} disabled={salvando}>
                {salvando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : modoEdicao ? "Salvar Alterações" : "Publicar Anúncio"}
              </Button>
            </div>
          </Card>
        </div>
      )}

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