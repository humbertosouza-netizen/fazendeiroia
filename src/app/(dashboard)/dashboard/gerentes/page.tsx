"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Building, TrendingUp } from "lucide-react";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { supabase } from "@/lib/supabase";
import usuariosService from "@/services/usuariosService";

export default function GerentesPage() {
  // Conteúdo da página para gerentes
  const GerentesContent = () => {
    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const userData = await usuariosService.getUsuario(user.id);
            setUserData(userData);
          }
        } catch (error) {
          console.error("Erro ao buscar dados do usuário:", error);
        } finally {
          setLoading(false);
        }
      };
      
      fetchUserData();
    }, []);
    
    if (loading) {
      return (
        <div className="flex items-center justify-center h-24">
          <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Área do Gerente</h1>
          <Button variant="outline">Exportar Relatório</Button>
        </div>
        
        {/* Boas-vindas personalizada */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-100">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-green-800">
                  Bem-vindo(a), {userData?.nome || "Gerente"}!
                </h2>
                <p className="text-green-700">
                  Você tem acesso às funcionalidades de gerenciamento da plataforma.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Tabs defaultValue="resumo">
          <TabsList className="mb-4">
            <TabsTrigger value="resumo">Resumo</TabsTrigger>
            <TabsTrigger value="clientes">Clientes</TabsTrigger>
            <TabsTrigger value="propriedades">Propriedades</TabsTrigger>
          </TabsList>
          
          <TabsContent value="resumo" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Users className="h-4 w-4 mr-2 text-blue-500" />
                    Usuários Ativos
                  </CardTitle>
                  <CardDescription>Total de usuários da plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">127</div>
                  <p className="text-xs text-green-600">+12% no último mês</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <Building className="h-4 w-4 mr-2 text-purple-500" />
                    Propriedades Publicadas
                  </CardTitle>
                  <CardDescription>Anúncios ativos na plataforma</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">58</div>
                  <p className="text-xs text-green-600">+5% no último mês</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" />
                    Leads Gerados
                  </CardTitle>
                  <CardDescription>Total de contatos recebidos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">238</div>
                  <p className="text-xs text-green-600">+18% no último mês</p>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Relatório Mensal</CardTitle>
                <CardDescription>Desempenho da plataforma nos últimos 30 dias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Aqui seria exibido um gráfico com estatísticas</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="clientes">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Clientes</CardTitle>
                <CardDescription>Visualize e gerencie os clientes da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Lista de clientes seria exibida aqui</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="propriedades">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciamento de Propriedades</CardTitle>
                <CardDescription>Visualize e gerencie os anúncios da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 flex items-center justify-center bg-gray-50 rounded-md">
                  <p className="text-gray-500">Lista de propriedades seria exibida aqui</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    );
  };
  
  return (
    <PermissionGuard requiredRole="gerente">
      <GerentesContent />
    </PermissionGuard>
  );
} 