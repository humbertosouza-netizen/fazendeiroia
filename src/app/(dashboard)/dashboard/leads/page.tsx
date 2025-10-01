"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, Filter, CheckCircle, Clock, X, AlertTriangle } from "lucide-react";
import leadsService, { Lead } from "@/services/leadsService";
import anunciosService, { Anuncio } from "@/services/anunciosService";
import LeadMessageModal from "@/components/LeadMessageModal";

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [anuncios, setAnuncios] = useState<{[key: string]: Anuncio}>({});
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [termo, setTermo] = useState("");
  const [statusFiltrado, setStatusFiltrado] = useState<string>("todos");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        // Carregar leads
        const dadosLeads = await leadsService.getLeads();
        setLeads(dadosLeads);
        setFilteredLeads(dadosLeads);
        
        // Carregar anúncios para poder mapear os IDs com os títulos
        const dadosAnuncios = await anunciosService.getAnuncios();
        const anunciosMap: {[key: string]: Anuncio} = {};
        dadosAnuncios.forEach(anuncio => {
          if (anuncio.id) {
            anunciosMap[anuncio.id] = anuncio;
          }
        });
        setAnuncios(anunciosMap);
      } catch (error) {
        console.error("Erro ao carregar leads:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, []);
  
  useEffect(() => {
    // Aplicar filtros quando alterados
    aplicarFiltros();
  }, [termo, statusFiltrado, leads]);
  
  const aplicarFiltros = () => {
    let resultados = [...leads];
    
    // Filtrar por termo de busca
    if (termo) {
      const termoBusca = termo.toLowerCase();
      resultados = resultados.filter(lead => 
        lead.nome.toLowerCase().includes(termoBusca) ||
        lead.email.toLowerCase().includes(termoBusca) ||
        lead.telefone.toLowerCase().includes(termoBusca) ||
        lead.mensagem.toLowerCase().includes(termoBusca) ||
        (anuncios[lead.anuncio_id]?.titulo || "").toLowerCase().includes(termoBusca)
      );
    }
    
    // Filtrar por status
    if (statusFiltrado !== "todos") {
      resultados = resultados.filter(lead => lead.status === statusFiltrado);
    }
    
    setFilteredLeads(resultados);
  };
  
  const atualizarStatusLead = async (leadId: string, novoStatus: 'novo' | 'contatado' | 'convertido' | 'perdido') => {
    try {
      // Atualizar status no servidor
      await leadsService.atualizarStatusLead(leadId, novoStatus);
      
      // Atualizar estado local
      const leadsAtualizados = leads.map(lead => {
        if (lead.id === leadId) {
          return { ...lead, status: novoStatus };
        }
        return lead;
      });
      
      setLeads(leadsAtualizados);
    } catch (error) {
      console.error("Erro ao atualizar status do lead:", error);
    }
  };
  
  const handleOpenModal = (lead: Lead) => {
    setSelectedLead(lead);
    setModalOpen(true);
  };
  
  // Configuração de cores e ícones para os status
  const statusConfig = {
    novo: {
      icon: <Clock className="h-4 w-4" />,
      className: "bg-blue-100 text-blue-800"
    },
    contatado: {
      icon: <AlertTriangle className="h-4 w-4" />,
      className: "bg-yellow-100 text-yellow-800"
    },
    convertido: {
      icon: <CheckCircle className="h-4 w-4" />,
      className: "bg-green-100 text-green-800"
    },
    perdido: {
      icon: <X className="h-4 w-4" />,
      className: "bg-red-100 text-red-800"
    }
  };
  
  // Formatação de data
  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Gerenciamento de Leads</h1>
        <Badge className="px-2.5 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs bg-green-600 text-white">
          {leads.length} leads no total
        </Badge>
      </div>
      
      {/* Filtros e busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar por nome, email ou anúncio..."
                className="pl-9"
                value={termo}
                onChange={(e) => setTermo(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-500">Status:</span>
              <Select value={statusFiltrado} onValueChange={setStatusFiltrado}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="novo">Novos</SelectItem>
                  <SelectItem value="contatado">Contatados</SelectItem>
                  <SelectItem value="convertido">Convertidos</SelectItem>
                  <SelectItem value="perdido">Perdidos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Tabela de leads */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Lista de Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {carregando ? (
            <div className="text-center py-10">
              <div className="inline-block h-6 w-6 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-green-600"></div>
              <p className="mt-2 text-sm text-gray-500">Carregando leads...</p>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Nenhum lead encontrado com os filtros aplicados.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium">Lead</th>
                    <th className="text-left py-3 px-4 font-medium">Anúncio</th>
                    <th className="text-left py-3 px-4 font-medium">Data</th>
                    <th className="text-left py-3 px-4 font-medium">Status</th>
                    <th className="text-right py-3 px-4 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{lead.nome}</p>
                          <div className="flex flex-col text-xs text-gray-500">
                            <span>{lead.email}</span>
                            <span>{lead.telefone}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium">
                          {anuncios[lead.anuncio_id]?.titulo || "Anúncio não encontrado"}
                        </span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        {formatarData(lead.data_criacao)}
                      </td>
                      <td className="py-3 px-4">
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs ${statusConfig[lead.status as keyof typeof statusConfig].className}`}>
                          {statusConfig[lead.status as keyof typeof statusConfig].icon}
                          <span className="ml-1 capitalize">
                            {lead.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center">
                          <Select 
                            value={lead.status}
                            onValueChange={(value) => atualizarStatusLead(lead.id!, value as 'novo' | 'contatado' | 'convertido' | 'perdido')}
                          >
                            <SelectTrigger className="w-32 h-8 text-xs">
                              <SelectValue placeholder="Atualizar status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="novo">Novo</SelectItem>
                              <SelectItem value="contatado">Contatado</SelectItem>
                              <SelectItem value="convertido">Convertido</SelectItem>
                              <SelectItem value="perdido">Perdido</SelectItem>
                            </SelectContent>
                          </Select>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="ml-2 h-8"
                            onClick={() => handleOpenModal(lead)}
                          >
                            Ver mensagem
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Estatísticas */}
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-medium">Resumo por Status</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {['novo', 'contatado', 'convertido', 'perdido'].map((status) => {
              const count = leads.filter(lead => lead.status === status).length;
              const percentage = Math.round((count / (leads.length || 1)) * 100);
              
              return (
                <div key={status} className="flex items-center p-4 border rounded-lg">
                  <div className={`p-2 rounded-full ${statusConfig[status as keyof typeof statusConfig].className}`}>
                    {statusConfig[status as keyof typeof statusConfig].icon}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium capitalize">{status}</p>
                    <div className="flex items-baseline">
                      <p className="text-2xl font-semibold">{count}</p>
                      <p className="ml-2 text-xs text-gray-500">{percentage}%</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Modal para exibir mensagem do lead */}
      <LeadMessageModal 
        lead={selectedLead} 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
      />
    </div>
  );
} 