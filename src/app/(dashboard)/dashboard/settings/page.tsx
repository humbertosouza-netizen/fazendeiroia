"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, User, Bell, Shield } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipoPerfil, setTipoPerfil] = useState("");
  const [creci, setCreci] = useState("");
  const [cpf, setCpf] = useState("");
  const [notificacoesEmail, setNotificacoesEmail] = useState(true);
  const [notificacoesApp, setNotificacoesApp] = useState(true);
  const [mensagem, setMensagem] = useState({ tipo: "", texto: "" });

  useEffect(() => {
    const getUser = async () => {
      try {
        // Obter o usuário autenticado
        const { data: authData } = await supabase.auth.getUser();
        
        if (authData?.user) {
          setUser(authData.user);
          
          // Buscar os dados do perfil do usuário no Supabase
          const { data: perfilData, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', authData.user.id)
            .single();
          
          if (error && error.code !== 'PGRST116') { // PGRST116 = Nenhum registro encontrado
            console.error("Erro ao buscar perfil:", error);
          }
          
          if (perfilData) {
            // Se encontrou um perfil, preenche os dados
            setNome(perfilData.nome || "");
            setTelefone(perfilData.telefone || "");
            setTipoPerfil(perfilData.tipo_perfil || "");
            setCreci(perfilData.creci || "");
            setCpf(perfilData.cpf || "");
            setNotificacoesEmail(perfilData.notificacoes_email !== false);
            setNotificacoesApp(perfilData.notificacoes_app !== false);
          }
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const salvarPerfil = async () => {
    setSaving(true);
    setMensagem({ tipo: "", texto: "" });
    
    try {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }
      
      // Salvar os dados no Supabase
      const { data, error } = await supabase
        .from('usuarios')
        .upsert({
          id: user.id,
          nome,
          telefone,
          tipo_perfil: tipoPerfil,
          creci: tipoPerfil === "proprietario" ? null : creci,
          cpf: tipoPerfil === "proprietario" ? cpf : null,
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (error) {
        throw error;
      }
      
      setMensagem({ 
        tipo: "success", 
        texto: "Perfil atualizado com sucesso!" 
      });
    } catch (error: any) {
      console.error("Erro ao salvar perfil:", error);
      setMensagem({ 
        tipo: "error", 
        texto: `Ocorreu um erro ao atualizar o perfil: ${error.message || "Tente novamente"}` 
      });
    } finally {
      setSaving(false);
    }
  };

  const alterarSenha = async () => {
    setSaving(true);
    setMensagem({ tipo: "", texto: "" });
    
    try {
      if (!user?.email) {
        throw new Error("Email do usuário não disponível");
      }
      
      // Enviar email para redefinição de senha
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        throw error;
      }
      
      setMensagem({ 
        tipo: "success", 
        texto: "Link para alteração de senha enviado para seu email!" 
      });
    } catch (error: any) {
      console.error("Erro ao solicitar alteração de senha:", error);
      setMensagem({ 
        tipo: "error", 
        texto: `Ocorreu um erro ao solicitar alteração de senha: ${error.message || "Tente novamente"}` 
      });
    } finally {
      setSaving(false);
    }
  };

  const salvarNotificacoes = async () => {
    setSaving(true);
    setMensagem({ tipo: "", texto: "" });
    
    try {
      if (!user?.id) {
        throw new Error("Usuário não autenticado");
      }
      
      // Salvar preferências de notificações
      const { error } = await supabase
        .from('usuarios')
        .upsert({
          id: user.id,
          notificacoes_email: notificacoesEmail,
          notificacoes_app: notificacoesApp,
          updated_at: new Date().toISOString()
        });
      
      if (error) {
        throw error;
      }
      
      setMensagem({ 
        tipo: "success", 
        texto: "Configurações de notificações salvas com sucesso!" 
      });
    } catch (error: any) {
      console.error("Erro ao salvar notificações:", error);
      setMensagem({ 
        tipo: "error", 
        texto: `Ocorreu um erro ao salvar as notificações: ${error.message || "Tente novamente"}` 
      });
    } finally {
      setSaving(false);
    }
  };


  if (loading) {
    return (
      <div className="flex items-center justify-center h-24">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Configurações</h1>
      
      <Tabs defaultValue="perfil" className="space-y-4">
        <TabsList>
          <TabsTrigger value="perfil" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            Perfil
          </TabsTrigger>
          <TabsTrigger value="notificacoes" className="flex items-center">
            <Bell className="h-4 w-4 mr-2" />
            Notificações
          </TabsTrigger>
          <TabsTrigger value="seguranca" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            Segurança
          </TabsTrigger>
        </TabsList>
        
        {/* Tab de Perfil */}
        <TabsContent value="perfil">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Perfil</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais aqui
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="bg-gray-50"
                />
                <p className="text-xs text-gray-500">
                  O email não pode ser alterado
                </p>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="nome" className="text-sm font-medium">
                  Nome
                </label>
                <Input
                  id="nome"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="telefone" className="text-sm font-medium">
                  Telefone
                </label>
                <Input
                  id="telefone"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="tipoPerfil" className="text-sm font-medium">
                  Tipo de Perfil
                </label>
                <Select value={tipoPerfil} onValueChange={setTipoPerfil}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione seu tipo de perfil" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="corretor">Corretor</SelectItem>
                    <SelectItem value="imobiliaria">Imobiliária</SelectItem>
                    <SelectItem value="proprietario">Proprietário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {tipoPerfil && (
                <div>
                  {(tipoPerfil === "corretor" || tipoPerfil === "imobiliaria") && (
                    <div className="space-y-2">
                      <label htmlFor="creci" className="text-sm font-medium">
                        CRECI
                      </label>
                      <Input
                        id="creci"
                        value={creci}
                        onChange={(e) => setCreci(e.target.value)}
                        placeholder="Informe seu número de registro CRECI"
                      />
                    </div>
                  )}
                  
                  {tipoPerfil === "proprietario" && (
                    <div className="space-y-2">
                      <label htmlFor="cpf" className="text-sm font-medium">
                        CPF
                      </label>
                      <Input
                        id="cpf"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                        placeholder="Informe seu CPF"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-2">
              {mensagem.texto && (
                <div className={`w-full rounded p-2 text-sm ${
                  mensagem.tipo === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {mensagem.texto}
                </div>
              )}
              <Button 
                onClick={salvarPerfil} 
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar Alterações"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        {/* Tab de Notificações */}
        <TabsContent value="notificacoes">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificações</CardTitle>
              <CardDescription>
                Escolha como deseja receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações por Email</p>
                  <p className="text-sm text-gray-500">
                    Receba atualizações e alertas por email
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notificacoesEmail}
                      onChange={() => setNotificacoesEmail(!notificacoesEmail)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
              
              <div className="border-t pt-4"></div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Notificações no App</p>
                  <p className="text-sm text-gray-500">
                    Receba notificações dentro da plataforma
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notificacoesApp}
                      onChange={() => setNotificacoesApp(!notificacoesApp)}
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start space-y-2">
              {mensagem.texto && (
                <div className={`w-full rounded p-2 text-sm ${
                  mensagem.tipo === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {mensagem.texto}
                </div>
              )}
              <Button 
                onClick={salvarNotificacoes}
                disabled={saving}
              >
                {saving ? "Salvando..." : "Salvar Preferências"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        
        {/* Tab de Segurança */}
        <TabsContent value="seguranca">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Gerenciar configurações de segurança
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Alterar Senha</p>
                  <p className="text-sm text-gray-500">
                    Um link para alteração de senha será enviado ao seu email
                  </p>
                </div>
                <Button 
                  variant="outline"
                  onClick={alterarSenha}
                  disabled={saving}
                >
                  {saving ? "Enviando..." : "Alterar Senha"}
                </Button>
              </div>
              
              <div className="border-t pt-4"></div>
              
              <div>
                <p className="font-medium">Autenticação em Duas Etapas</p>
                <p className="text-sm text-gray-500 mb-2">
                  Adicione uma camada extra de segurança à sua conta
                </p>
                <Button variant="outline" disabled>
                  Em breve
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              {mensagem.texto && (
                <div className={`w-full rounded p-2 text-sm ${
                  mensagem.tipo === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                }`}>
                  {mensagem.texto}
                </div>
              )}
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 