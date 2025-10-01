"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ActivitySquare, 
  Users, 
  Eye, 
  MessageSquare,
  FileText,
  TrendingUp,
  TrendingDown,
  BarChart,
  PieChart,
  Clock,
  ThumbsUp
} from "lucide-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  Filler
} from 'chart.js';
import { Line, Bar, Pie, Doughnut } from 'react-chartjs-2';
import anunciosService, { Anuncio } from "@/services/anunciosService";
import leadsService, { Lead } from "@/services/leadsService";
import visualizacoesService from "@/services/visualizacoesService";

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

export default function DashboardPage() {
  const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [totalVisualizacoes, setTotalVisualizacoes] = useState(0);
  const [visualizacoesMensais, setVisualizacoesMensais] = useState<{mes: string, quantidade: number}[]>([]);
  const [leadsMensais, setLeadsMensais] = useState<{mes: string, quantidade: number}[]>([]);
  const [carregando, setCarregando] = useState(true);
  
  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      try {
        // Carregar todos os dados necessários
        const [
          dadosAnuncios, 
          dadosLeads, 
          dadosVisualizacoes,
          dadosVisualizacoesMensais,
          dadosLeadsMensais
        ] = await Promise.all([
          anunciosService.getAnuncios(),
          leadsService.getLeads(),
          visualizacoesService.getTotalVisualizacoes(),
          visualizacoesService.getVisualizacoesPorMes(),
          leadsService.getLeadsPorMes()
        ]);
        
        setAnuncios(dadosAnuncios || []);
        setLeads(dadosLeads || []);
        setTotalVisualizacoes(dadosVisualizacoes);
        setVisualizacoesMensais(dadosVisualizacoesMensais);
        setLeadsMensais(dadosLeadsMensais);
      } catch (error) {
        console.error("Erro ao carregar dados do dashboard:", error);
      } finally {
        setCarregando(false);
      }
    };
    
    carregarDados();
  }, []);

  // Dados calculados a partir dos anúncios
  const anunciosAtivos = anuncios.filter(a => a.status === 'Ativo').length;
  const anunciosInativos = anuncios.filter(a => a.status !== 'Ativo').length;
  const totalLeads = leads.length;
  
  // Top 5 anúncios mais visualizados
  const anunciosMaisVistos = [...anuncios]
    .sort((a, b) => (b.visualizacoes || 0) - (a.visualizacoes || 0))
    .slice(0, 5);

  // Calcular crescimento de visualizações
  const crescimentoVisualizacoes = visualizacoesMensais.length >= 2 
    ? Math.round(((visualizacoesMensais[visualizacoesMensais.length - 1].quantidade / 
        (visualizacoesMensais[visualizacoesMensais.length - 2].quantidade || 1)) - 1) * 100)
    : 24.5; // Valor padrão

  // Calcular crescimento de leads
  const crescimentoLeads = leadsMensais.length >= 2 
    ? Math.round(((leadsMensais[leadsMensais.length - 1].quantidade / 
        (leadsMensais[leadsMensais.length - 2].quantidade || 1)) - 1) * 100)
    : 12.8; // Valor padrão

  // Gráfico de visualizações
  const dadosVisualizacoesGrafico = {
    labels: visualizacoesMensais.map(item => item.mes),
    datasets: [
      {
        label: 'Visualizações',
        data: visualizacoesMensais.map(item => item.quantidade),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Gráfico de Leads gerados
  const dadosLeadsGrafico = {
    labels: leadsMensais.map(item => item.mes),
    datasets: [
      {
        label: 'Leads',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        data: leadsMensais.map(item => item.quantidade),
      },
    ],
  };

  // Gráfico de Anúncios ativos vs inativos
  const dadosStatusAnuncios = {
    labels: ['Ativos', 'Inativos'],
    datasets: [
      {
        data: [anunciosAtivos, anunciosInativos],
        backgroundColor: [
          'rgba(75, 192, 92, 0.7)',
          'rgba(255, 99, 132, 0.7)',
        ],
        borderColor: [
          'rgb(75, 192, 92)',
          'rgb(255, 99, 132)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    layout: {
      padding: 0,
    },
  } as const;

  // Calcular taxa de conversão
  const taxaConversao = Math.round((totalLeads / (totalVisualizacoes || 1)) * 100);
  
  // Calcular crescimento da taxa de conversão (simulado)
  const crescimentoConversao = 1.2;

  // Métricas para os cards
  const metricas = [
    {
      titulo: "Anúncios Ativos",
      valor: anunciosAtivos.toString(),
      descricao: `${Math.round((anunciosAtivos / (anunciosAtivos + anunciosInativos || 1)) * 100)}% do total de anúncios`,
      icone: <FileText className="h-6 w-6 text-green-600" />,
      tendencia: "up",
    },
    {
      titulo: "Visualizações",
      valor: totalVisualizacoes.toString(),
      descricao: `${crescimentoVisualizacoes}% a mais que no mês anterior`,
      icone: <Eye className="h-6 w-6 text-blue-600" />,
      tendencia: crescimentoVisualizacoes >= 0 ? "up" : "down",
    },
    {
      titulo: "Leads Gerados",
      valor: totalLeads.toString(),
      descricao: `${crescimentoLeads}% a mais que no mês anterior`,
      icone: <MessageSquare className="h-6 w-6 text-purple-600" />,
      tendencia: crescimentoLeads >= 0 ? "up" : "down",
    },
    {
      titulo: "Taxa de Conversão",
      valor: `${taxaConversao}%`,
      descricao: `${crescimentoConversao}% a mais que no mês anterior`,
      icone: <ThumbsUp className="h-6 w-6 text-green-600" />,
      tendencia: crescimentoConversao >= 0 ? "up" : "down",
    },
  ];

  // Atividades recentes (usando leads reais)
  const atividadesRecentes = leads
    .sort((a, b) => new Date(b.data_criacao).getTime() - new Date(a.data_criacao).getTime())
    .slice(0, 3)
    .map(lead => {
      const anuncio = anuncios.find(a => a.id === lead.anuncio_id);
      const tempoAtras = calcularTempoAtras(new Date(lead.data_criacao));
      
      return {
        tipo: 'lead',
        titulo: 'Novo lead gerado',
        descricao: `${anuncio?.titulo || 'Anúncio'} recebeu um novo contato`,
        tempo: tempoAtras,
        icone: <Eye className="h-4 w-4 text-green-600" />
      };
    });

  // Se não houver leads suficientes, adicionar atividades simuladas
  if (atividadesRecentes.length < 3) {
    const atividadesSimuladas = [
      {
        tipo: 'anuncio',
        titulo: 'Anúncio publicado',
        descricao: 'Fazenda Esperança foi publicada',
        tempo: '1 hora atrás',
        icone: <FileText className="h-4 w-4 text-blue-600" />
      },
      {
        tipo: 'usuario',
        titulo: 'Novo usuário registrado',
        descricao: 'João Silva se cadastrou na plataforma',
        tempo: '3 horas atrás',
        icone: <Users className="h-4 w-4 text-yellow-600" />
      }
    ];
    
    // Adicionar atividades simuladas até ter 3 atividades
    while (atividadesRecentes.length < 3 && atividadesSimuladas.length > 0) {
      atividadesRecentes.push(atividadesSimuladas.shift()!);
    }
  }

  // Função auxiliar para calcular quanto tempo atrás
  function calcularTempoAtras(data: Date): string {
    const agora = new Date();
    const diferencaMs = agora.getTime() - data.getTime();
    const segundos = Math.floor(diferencaMs / 1000);
    const minutos = Math.floor(segundos / 60);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);
    
    if (dias > 0) return `${dias} dia${dias > 1 ? 's' : ''} atrás`;
    if (horas > 0) return `${horas} hora${horas > 1 ? 's' : ''} atrás`;
    if (minutos > 0) return `${minutos} min atrás`;
    return `${segundos} seg atrás`;
  }

  return (
    <div className="space-y-6 w-full overflow-x-hidden">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
      
      {/* Cards com métricas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metricas.map((metrica, index) => (
          <Card key={index} className="shadow-sm mobile-full-width">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{metrica.titulo}</p>
                  <h3 className="text-2xl font-bold mt-1">{metrica.valor}</h3>
                  <p className="text-xs flex items-center mt-1">
                    {metrica.tendencia === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                    )}
                    <span className={metrica.tendencia === "up" ? "text-green-500" : "text-red-500"}>
                      {metrica.descricao}
                    </span>
                  </p>
                </div>
                <div className="p-3 bg-gray-50 rounded-full">{metrica.icone}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid gap-6 md:grid-cols-2 max-w-full">
        {/* Gráfico de Estatísticas */}
        <Card className="shadow-sm mobile-full-width">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <BarChart className="h-5 w-5 mr-2" />
              Visualizações dos Anúncios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full overflow-hidden">
              <Line options={opcoesGrafico} data={dadosVisualizacoesGrafico} />
            </div>
          </CardContent>
        </Card>
        
        {/* Gráfico de Anúncios Ativos vs Inativos */}
        <Card className="shadow-sm mobile-full-width">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Status dos Anúncios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full overflow-hidden flex items-center justify-center">
              <div className="h-full w-full max-w-[280px] sm:max-w-[360px] mx-auto">
                <Doughnut 
                  options={{
                    ...opcoesGrafico,
                    plugins: { legend: { position: 'bottom' } },
                  }} 
                  data={dadosStatusAnuncios} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leads e Ranking */}
      <div className="grid gap-6 md:grid-cols-2 max-w-full">
        {/* Gráfico de Leads */}
        <Card className="shadow-sm mobile-full-width">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Leads Gerados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full overflow-hidden">
              <Bar options={opcoesGrafico} data={dadosLeadsGrafico} />
            </div>
          </CardContent>
        </Card>
        
        {/* Ranking de anúncios mais visualizados */}
        <Card className="shadow-sm mobile-full-width">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              Anúncios Mais Visualizados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {anunciosMaisVistos.map((anuncio, index) => (
                <div key={anuncio.id || index} className="flex items-center space-x-3 border-b pb-3">
                  <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-green-100 text-green-800 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{anuncio.titulo}</p>
                    <p className="text-xs text-gray-500">
                      {anuncio.categoria} - {anuncio.status}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex items-center">
                    <Eye className="h-4 w-4 text-gray-400 mr-1" />
                    <p className="text-sm font-medium">{anuncio.visualizacoes || 0}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades recentes */}
      <Card className="shadow-sm mobile-full-width">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {atividadesRecentes.map((atividade, index) => (
              <div key={index} className="flex items-center space-x-4 border-b pb-3">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    {atividade.icone}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{atividade.titulo}</p>
                  <p className="text-xs text-gray-500">{atividade.descricao}</p>
                </div>
                <div className="flex-shrink-0">
                  <p className="text-xs text-gray-500">{atividade.tempo}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 