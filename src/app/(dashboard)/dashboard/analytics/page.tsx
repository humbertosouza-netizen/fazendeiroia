"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

// Registrar componentes do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {
  // Dados para os gráficos
  const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const dadosVendasAnuais = {
    labels: meses,
    datasets: [
      {
        label: 'Vendas 2023',
        data: [30, 40, 35, 50, 49, 60, 70, 91, 125, 130, 120, 140],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'Vendas 2024',
        data: [40, 45, 55, 65, 80, 95, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
    ],
  };

  const dadosOrigem = {
    labels: ['Busca Orgânica', 'Redes Sociais', 'Email', 'Referências', 'Direto'],
    datasets: [
      {
        label: 'Origem dos Usuários',
        data: [35, 25, 15, 10, 15],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const dadosEngajamento = {
    labels: meses.slice(0, 6),
    datasets: [
      {
        label: 'Tempo Médio (minutos)',
        data: [5.2, 5.7, 6.1, 7.5, 8.2, 9.0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        yAxisID: 'y',
      },
      {
        label: 'Páginas por Sessão',
        data: [2.4, 2.7, 3.1, 3.5, 3.8, 4.2],
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        yAxisID: 'y1',
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
  };

  const opcoesEngajamento = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
    scales: {
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Tempo (min)',
        },
      },
      y1: {
        type: 'linear' as const,
        display: true,
        position: 'right' as const,
        title: {
          display: true,
          text: 'Páginas',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Análises</h1>
      
      <Tabs defaultValue="vendas" className="space-y-4">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="usuarios">Usuários</TabsTrigger>
          <TabsTrigger value="engajamento">Engajamento</TabsTrigger>
        </TabsList>
        
        {/* Tab de Vendas */}
        <TabsContent value="vendas" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Comparativo de Vendas Anual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Bar options={opcoesGrafico} data={dadosVendasAnuais} />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Métricas de Vendas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Vendas Totais</div>
                      <div className="text-2xl font-bold mt-1">R$ 582.436,78</div>
                      <div className="text-xs text-green-500 mt-1">+12.5% desde o mês passado</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Ticket Médio</div>
                      <div className="text-2xl font-bold mt-1">R$ 243,59</div>
                      <div className="text-xs text-green-500 mt-1">+3.2% desde o mês passado</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Conversão</div>
                      <div className="text-2xl font-bold mt-1">3.8%</div>
                      <div className="text-xs text-green-500 mt-1">+0.5% desde o mês passado</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Produtos Vendidos</div>
                      <div className="text-2xl font-bold mt-1">2,391</div>
                      <div className="text-xs text-green-500 mt-1">+8.7% desde o mês passado</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Categorias Mais Vendidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { nome: "Eletrônicos", valor: "R$ 145.609,45", porcentagem: 25 },
                    { nome: "Moda", valor: "R$ 116.487,36", porcentagem: 20 },
                    { nome: "Casa e Decoração", valor: "R$ 87.365,52", porcentagem: 15 },
                    { nome: "Esportes", valor: "R$ 58.243,68", porcentagem: 10 },
                    { nome: "Beleza", valor: "R$ 52.419,31", porcentagem: 9 },
                  ].map((categoria, index) => (
                    <div key={index} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>{categoria.nome}</span>
                        <span>{categoria.valor}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-600"
                          style={{ width: `${categoria.porcentagem}%` }}
                        />
                      </div>
                      <div className="text-xs text-gray-500">{categoria.porcentagem}% das vendas</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Tab de Usuários */}
        <TabsContent value="usuarios" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Origem dos Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] flex items-center justify-center">
                  <Pie options={opcoesGrafico} data={dadosOrigem} />
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Métricas de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Usuários Ativos</div>
                      <div className="text-2xl font-bold mt-1">8,742</div>
                      <div className="text-xs text-green-500 mt-1">+15.3% desde o mês passado</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Novos Usuários</div>
                      <div className="text-2xl font-bold mt-1">1,253</div>
                      <div className="text-xs text-green-500 mt-1">+8.7% desde o mês passado</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Taxa de Retenção</div>
                      <div className="text-2xl font-bold mt-1">76.4%</div>
                      <div className="text-xs text-green-500 mt-1">+2.1% desde o mês passado</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-500">Assinaturas Premium</div>
                      <div className="text-2xl font-bold mt-1">2,187</div>
                      <div className="text-xs text-green-500 mt-1">+12.3% desde o mês passado</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Demografia dos Usuários</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-medium mb-2">Faixa Etária</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { faixa: "18-24", porcentagem: 15 },
                      { faixa: "25-34", porcentagem: 32 },
                      { faixa: "35-44", porcentagem: 28 },
                      { faixa: "45-54", porcentagem: 18 },
                      { faixa: "55+", porcentagem: 7 },
                    ].map((faixa, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <div className="h-24 w-full bg-gray-100 rounded-md relative">
                          <div
                            className="absolute bottom-0 w-full bg-blue-500"
                            style={{ height: `${faixa.porcentagem}%` }}
                          ></div>
                        </div>
                        <span className="text-xs mt-1">{faixa.faixa}</span>
                        <span className="text-xs text-gray-500">{faixa.porcentagem}%</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Localização (Top 5)</h4>
                  <div className="space-y-2">
                    {[
                      { local: "São Paulo", porcentagem: 35 },
                      { local: "Rio de Janeiro", porcentagem: 22 },
                      { local: "Minas Gerais", porcentagem: 15 },
                      { local: "Bahia", porcentagem: 8 },
                      { local: "Rio Grande do Sul", porcentagem: 6 },
                    ].map((local, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{local.local}</span>
                          <span>{local.porcentagem}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600"
                            style={{ width: `${local.porcentagem}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tab de Engajamento */}
        <TabsContent value="engajamento" className="space-y-4">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Métricas de Engajamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <Line options={opcoesEngajamento} data={dadosEngajamento} />
              </div>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Páginas Mais Visitadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { pagina: "Página Inicial", visitas: "45,231", tempoMedio: "1:23" },
                    { pagina: "Produtos", visitas: "32,457", tempoMedio: "2:47" },
                    { pagina: "Sobre Nós", visitas: "18,329", tempoMedio: "1:12" },
                    { pagina: "Blog", visitas: "12,548", tempoMedio: "3:05" },
                    { pagina: "Contato", visitas: "8,932", tempoMedio: "0:58" },
                  ].map((pagina, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center">
                        <span className="text-lg font-bold text-gray-400 mr-4">{index + 1}</span>
                        <span>{pagina.pagina}</span>
                      </div>
                      <div className="flex space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Visitas</div>
                          <div className="font-medium">{pagina.visitas}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Tempo Médio</div>
                          <div className="font-medium">{pagina.tempoMedio}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle>Dispositivos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Tipo de Dispositivo</h4>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { tipo: "Mobile", porcentagem: 62, classe: "bg-blue-500" },
                        { tipo: "Desktop", porcentagem: 31, classe: "bg-purple-500" },
                        { tipo: "Tablet", porcentagem: 7, classe: "bg-green-500" },
                      ].map((dispositivo, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{dispositivo.tipo}</span>
                            <span>{dispositivo.porcentagem}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${dispositivo.classe}`}
                              style={{ width: `${dispositivo.porcentagem}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-medium mb-2">Navegadores</h4>
                    <div className="space-y-2">
                      {[
                        { navegador: "Chrome", porcentagem: 48, classe: "bg-blue-500" },
                        { navegador: "Safari", porcentagem: 27, classe: "bg-purple-500" },
                        { navegador: "Firefox", porcentagem: 12, classe: "bg-green-500" },
                        { navegador: "Edge", porcentagem: 10, classe: "bg-yellow-500" },
                        { navegador: "Outros", porcentagem: 3, classe: "bg-gray-500" },
                      ].map((navegador, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>{navegador.navegador}</span>
                            <span>{navegador.porcentagem}%</span>
                          </div>
                          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${navegador.classe}`}
                              style={{ width: `${navegador.porcentagem}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 