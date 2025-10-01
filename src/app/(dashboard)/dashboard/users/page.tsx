"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, UserPlus, MoreHorizontal, ArrowUpDown, ChevronLeft, ChevronRight, Loader2, X, Pencil, Trash2, Eye, ArrowRightLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import usuariosService, { Usuario } from "@/services/usuariosService";
import { toast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function UsersPage() {
  // Conteúdo original da página
  const UsersContent = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [criandoUsuario, setCriandoUsuario] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);
    const [novoUsuario, setNovoUsuario] = useState<Partial<Usuario>>({
      nome: "",
      email: "",
      telefone: "",
      status: "Ativo",
      plano: "Básico",
      role: "usuario"
    });
    const itemsPerPage = 5;
    
    // Carregar usuários do Supabase quando a página for montada
    useEffect(() => {
      carregarUsuarios();
    }, []);
    
    // Função para carregar usuários do Supabase
    const carregarUsuarios = async () => {
      setCarregando(true);
      try {
        const data = await usuariosService.getUsuarios();
        setUsuarios(data || []);
      } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        toast({
          title: "Erro",
          description: "Não foi possível carregar os usuários. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setCarregando(false);
      }
    };
    
    // Filtragem de usuários com base no termo de busca
    const filteredUsers = usuarios.filter(user =>
      user.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    // Paginação
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    
    // Gerar cor de background para o Avatar quando não há imagem
    const getAvatarColor = (name: string) => {
      const colors = [
        "bg-red-500",
        "bg-blue-500",
        "bg-green-500",
        "bg-yellow-500",
        "bg-purple-500",
        "bg-pink-500",
        "bg-indigo-500",
        "bg-teal-500",
      ];
      
      // Usar a primeira letra do nome para escolher uma cor
      const index = name.charCodeAt(0) % colors.length;
      return colors[index];
    };
    
    // Status com cor
    const statusColors = {
      Ativo: "text-green-600 bg-green-50",
      Inativo: "text-red-600 bg-red-50",
      Pendente: "text-yellow-600 bg-yellow-50",
    };
    
    // Formatar data de último acesso
    const formatarUltimoAcesso = (dataIso?: string) => {
      if (!dataIso) return "Nunca";
      
      const data = new Date(dataIso);
      const hoje = new Date();
      const ontem = new Date(hoje);
      ontem.setDate(ontem.getDate() - 1);
      
      if (data.toDateString() === hoje.toDateString()) {
        return `Hoje, ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
      } else if (data.toDateString() === ontem.toDateString()) {
        return `Ontem, ${data.getHours().toString().padStart(2, '0')}:${data.getMinutes().toString().padStart(2, '0')}`;
      } else {
        return data.toLocaleDateString('pt-BR');
      }
    };
    
    // Função para criar um usuário de exemplo
    const criarUsuarioExemplo = async () => {
      setCriandoUsuario(true);
      try {
        const novoUsuario = await usuariosService.criarUsuarioExemplo();
        if (novoUsuario) {
          toast({
            title: "Sucesso",
            description: "Usuário de exemplo criado com sucesso!",
            variant: "default",
          });
          await carregarUsuarios();
        } else {
          throw new Error("Não foi possível criar o usuário de exemplo");
        }
      } catch (error) {
        console.error("Erro ao criar usuário de exemplo:", error);
        toast({
          title: "Erro",
          description: "Não foi possível criar o usuário de exemplo. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setCriandoUsuario(false);
      }
    };

    // Função para lidar com mudanças nos campos do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setNovoUsuario({
        ...novoUsuario,
        [id]: value
      });
    };

    // Função para lidar com mudanças nos selects
    const handleSelectChange = (id: string, value: string) => {
      setNovoUsuario({
        ...novoUsuario,
        [id]: value
      });
    };

    // Função para adicionar um novo usuário
    const adicionarUsuario = async () => {
      setCriandoUsuario(true);
      try {
        // Usar o novo método criarNovoUsuario que aceita os dados do formulário
        const novoUsuarioCriado = await usuariosService.criarNovoUsuario(novoUsuario);
        
        if (novoUsuarioCriado) {
          toast({
            title: "Sucesso",
            description: "Usuário adicionado com sucesso!",
            variant: "default",
          });
          await carregarUsuarios();
          setModalAberto(false);
          // Resetar o formulário
          setNovoUsuario({
            nome: "",
            email: "",
            telefone: "",
            status: "Ativo",
            plano: "Básico",
            role: "usuario"
          });
        } else {
          throw new Error("Não foi possível adicionar o usuário");
        }
      } catch (error) {
        console.error("Erro ao adicionar usuário:", error);
        toast({
          title: "Erro",
          description: "Não foi possível adicionar o usuário. Tente novamente mais tarde.",
          variant: "destructive",
        });
      } finally {
        setCriandoUsuario(false);
      }
    };

    // Funções para calcular estatísticas reais de usuários
    const calcularUsuariosPorStatus = () => {
      const statusCounts = {
        Ativo: 0,
        Inativo: 0,
        Pendente: 0
      };
      
      usuarios.forEach(user => {
        if (user.status in statusCounts) {
          statusCounts[user.status as keyof typeof statusCounts]++;
        }
      });
      
      return [
        { status: "Ativo", total: statusCounts.Ativo, color: "bg-green-500" },
        { status: "Inativo", total: statusCounts.Inativo, color: "bg-red-500" },
        { status: "Pendente", total: statusCounts.Pendente, color: "bg-yellow-500" },
      ];
    };
    
    const calcularUsuariosPorPlano = () => {
      const planoCounts = {
        Premium: 0,
        Básico: 0,
        Trial: 0
      };
      
      usuarios.forEach(user => {
        if (user.plano in planoCounts) {
          planoCounts[user.plano as keyof typeof planoCounts]++;
        }
      });
      
      return [
        { plano: "Premium", total: planoCounts.Premium, color: "bg-purple-500" },
        { plano: "Básico", total: planoCounts.Básico, color: "bg-blue-500" },
        { plano: "Trial", total: planoCounts.Trial, color: "bg-gray-500" },
      ];
    };
    
    const calcularNovosUsuarios = () => {
      const hoje = new Date();
      const trintaDiasAtras = new Date();
      trintaDiasAtras.setDate(hoje.getDate() - 30);
      
      // Filtrar usuários criados nos últimos 30 dias
      const novosUsuarios = usuarios.filter(user => {
        if (!user.data_cadastro) return false;
        const dataCadastro = new Date(user.data_cadastro);
        return dataCadastro >= trintaDiasAtras;
      });
      
      // Se não tivermos o mês anterior para comparar, assumimos 0% de crescimento
      let percentualCrescimento = 0;
      
      const totalUsuarios = usuarios.length;
      if (totalUsuarios > 0 && novosUsuarios.length > 0) {
        percentualCrescimento = Math.round((novosUsuarios.length / totalUsuarios) * 100);
      }
      
      return {
        total: novosUsuarios.length,
        percentual: percentualCrescimento
      };
    };
    
    // Calcular estatísticas
    const estatisticasStatus = calcularUsuariosPorStatus();
    const estatisticasPlano = calcularUsuariosPorPlano();
    const estatisticasNovos = calcularNovosUsuarios();

    // Função para excluir usuário
    const excluirUsuario = async (id: string) => {
      if (!id) return;
      
      if (confirm("Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.")) {
        try {
          const sucesso = await usuariosService.excluirUsuario(id);
          
          if (sucesso) {
            // Remoção otimista da lista local
            setUsuarios((prev) => prev.filter(u => u.id !== id));
            toast({
              title: "Sucesso",
              description: "Usuário excluído com sucesso.",
              variant: "default",
            });
            // Opcional: revalidar em segundo plano
            setTimeout(() => { carregarUsuarios(); }, 0);
          } else {
            throw new Error("Falha ao excluir usuário");
          }
        } catch (error) {
          console.error("Erro ao excluir usuário:", error);
          toast({
            title: "Erro",
            description: "Não foi possível excluir o usuário. Tente novamente mais tarde.",
            variant: "destructive",
          });
        }
      }
    };

    // Função para alterar status do usuário
    const alterarStatusUsuario = async (id: string, novoStatus: string) => {
      if (!id) return;
      
      try {
        const resultado = await usuariosService.atualizarUsuario(id, {
          status: novoStatus
        });
        
        if (resultado) {
          toast({
            title: "Sucesso",
            description: `Status alterado para ${novoStatus}.`,
            variant: "default",
          });
          carregarUsuarios(); // Recarregar lista
        } else {
          throw new Error("Falha ao atualizar status");
        }
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o status. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    };

    // Função para alterar role do usuário
    const alterarRoleUsuario = async (id: string, novoRole: string) => {
      if (!id) return;
      
      try {
        const resultado = await usuariosService.atualizarUsuario(id, {
          role: novoRole
        });
        
        if (resultado) {
          toast({
            title: "Sucesso",
            description: `Role alterada para ${novoRole}.`,
            variant: "default",
          });
          carregarUsuarios(); // Recarregar lista
        } else {
          throw new Error("Falha ao atualizar role");
        }
      } catch (error) {
        console.error("Erro ao atualizar role:", error);
        toast({
          title: "Erro",
          description: "Não foi possível atualizar o role. Tente novamente mais tarde.",
          variant: "destructive",
        });
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Usuários</h1>
          <div className="flex gap-2">
            <Button 
              className="flex items-center" 
              variant="outline"
              onClick={criarUsuarioExemplo}
              disabled={criandoUsuario}
            >
              {criandoUsuario ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Criando...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Criar Exemplo
                </>
              )}
            </Button>
            <Button 
              className="flex items-center"
              onClick={() => setModalAberto(true)}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Adicionar Usuário
            </Button>
          </div>
        </div>
        
        {/* Modal para adicionar usuário */}
        {modalAberto && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                  <CardTitle>Adicionar Novo Usuário</CardTitle>
                  <CardDescription>
                    Preencha os dados do novo usuário
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setModalAberto(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome</Label>
                    <Input
                      id="nome"
                      placeholder="Nome do usuário"
                      value={novoUsuario.nome}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={novoUsuario.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="telefone">Telefone</Label>
                    <Input
                      id="telefone"
                      placeholder="(00) 00000-0000"
                      value={novoUsuario.telefone}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={novoUsuario.status}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Ativo">Ativo</SelectItem>
                        <SelectItem value="Inativo">Inativo</SelectItem>
                        <SelectItem value="Pendente">Pendente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="plano">Plano</Label>
                    <Select
                      value={novoUsuario.plano}
                      onValueChange={(value) => handleSelectChange("plano", value)}
                    >
                      <SelectTrigger id="plano">
                        <SelectValue placeholder="Selecione o plano" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Básico">Básico</SelectItem>
                        <SelectItem value="Premium">Premium</SelectItem>
                        <SelectItem value="Trial">Trial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Permissão</Label>
                    <Select
                      value={novoUsuario.role}
                      onValueChange={(value) => handleSelectChange("role", value)}
                    >
                      <SelectTrigger id="role">
                        <SelectValue placeholder="Selecione a permissão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="usuario">Usuário</SelectItem>
                        <SelectItem value="gerente">Gerente</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setModalAberto(false)}
                      type="button"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={adicionarUsuario}
                      disabled={criandoUsuario}
                      type="button"
                    >
                      {criandoUsuario ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Salvando...
                        </>
                      ) : "Salvar"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Gerenciar Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input 
                    placeholder="Buscar por nome ou email" 
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
                          Nome
                          <ArrowUpDown className="ml-2 h-4 w-4" />
                        </div>
                      </TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Relação</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Permissão</TableHead>
                      <TableHead>Último acesso</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {carregando ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-10">
                          <div className="flex justify-center">
                            <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Carregando usuários...
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : currentUsers.length > 0 ? (
                      currentUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                              <Avatar className={getAvatarColor(user.nome)}>
                                <AvatarImage src={user.avatar_url || ""} />
                                <AvatarFallback>
                                  {user.nome.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.nome_completo || user.nome}</div>
                                <div className="text-sm text-gray-500">{user.nome}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">{user.email || 'N/A'}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-gray-900">{user.telefone || 'N/A'}</div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {user.relacao_imovel === 'Proprietario' ? 'Proprietário' :
                               user.relacao_imovel === 'Corretor' ? 'Corretor' :
                               user.relacao_imovel === 'Imobiliaria' ? 'Imobiliária' :
                               user.relacao_imovel === 'Instituicao_financeira' ? 'Inst. Financeira' :
                               'N/A'}
                            </span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              statusColors[user.status as keyof typeof statusColors]
                            }`}>
                              {user.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {user.plano === "Premium" ? (
                              <span className="text-purple-600 font-medium">{user.plano}</span>
                            ) : (
                              user.plano
                            )}
                          </TableCell>
                          <TableCell>
                            {user.role === "admin" ? (
                              <span className="text-red-600 font-medium">Administrador</span>
                            ) : user.role === "gerente" ? (
                              <span className="text-blue-600 font-medium">Gerente</span>
                            ) : (
                              <span className="text-gray-500 font-medium">Usuário</span>
                            )}
                          </TableCell>
                          <TableCell>{formatarUltimoAcesso(user.ultimo_acesso)}</TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => {}}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver detalhes
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {}}>
                                  <Pencil className="h-4 w-4 mr-2" />
                                  Editar
                                </DropdownMenuItem>

                                {/* Menu de alteração de roles (permissões) */}
                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs text-gray-500">
                                  Alterar Permissão
                                </DropdownMenuLabel>
                                <DropdownMenuItem 
                                  onClick={() => alterarRoleUsuario(user.id || '', 'admin')}
                                  className={user.role === 'admin' ? 'bg-green-50 font-semibold' : ''}
                                >
                                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                                  Administrador
                                  {user.role === 'admin' && <span className="ml-2 text-xs text-green-600">✓</span>}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => alterarRoleUsuario(user.id || '', 'gerente')}
                                  className={user.role === 'gerente' ? 'bg-green-50 font-semibold' : ''}
                                >
                                  <span className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
                                  Gerente
                                  {user.role === 'gerente' && <span className="ml-2 text-xs text-green-600">✓</span>}
                                </DropdownMenuItem>
                                <DropdownMenuItem 
                                  onClick={() => alterarRoleUsuario(user.id || '', 'usuario')}
                                  className={user.role === 'usuario' ? 'bg-green-50 font-semibold' : ''}
                                >
                                  <span className="h-2 w-2 rounded-full bg-gray-500 mr-2" />
                                  Usuário
                                  {user.role === 'usuario' && <span className="ml-2 text-xs text-green-600">✓</span>}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />
                                <DropdownMenuLabel className="text-xs text-gray-500">
                                  Alterar Status
                                </DropdownMenuLabel>
                                <DropdownMenuItem
                                  onClick={() => alterarStatusUsuario(user.id || '', "Ativo")}
                                  className={user.status === 'Ativo' ? 'bg-green-50 font-semibold' : ''}
                                >
                                  <span className="h-2 w-2 rounded-full bg-green-500 mr-2" />
                                  Ativo
                                  {user.status === 'Ativo' && <span className="ml-2 text-xs text-green-600">✓</span>}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => alterarStatusUsuario(user.id || '', "Pendente")}
                                  className={user.status === 'Pendente' ? 'bg-yellow-50 font-semibold' : ''}
                                >
                                  <span className="h-2 w-2 rounded-full bg-yellow-500 mr-2" />
                                  Pendente
                                  {user.status === 'Pendente' && <span className="ml-2 text-xs text-green-600">✓</span>}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => alterarStatusUsuario(user.id || '', "Inativo")}
                                  className={user.status === 'Inativo' ? 'bg-red-50 font-semibold' : ''}
                                >
                                  <span className="h-2 w-2 rounded-full bg-red-500 mr-2" />
                                  Inativo
                                  {user.status === 'Inativo' && <span className="ml-2 text-xs text-green-600">✓</span>}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={() => excluirUsuario(user.id || '')}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Excluir
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4">
                          {searchTerm ? "Nenhum usuário encontrado com esse termo" : "Nenhum usuário cadastrado"}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Paginação */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Mostrando {indexOfFirstUser + 1} a {Math.min(indexOfLastUser, filteredUsers.length)} de {filteredUsers.length} usuários
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
            </div>
          </CardContent>
        </Card>
        
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Usuários por Status</CardTitle>
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
              <CardTitle className="text-base">Usuários por Plano</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {estatisticasPlano.map((item) => (
                  <div key={item.plano} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${item.color} mr-2`}></div>
                      <span>{item.plano}</span>
                    </div>
                    <span className="font-medium">{item.total}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Novos Usuários (30 dias)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">+{estatisticasNovos.total}</div>
              <p className="text-xs text-green-500 mt-1">+{estatisticasNovos.percentual}% desde o mês passado</p>
              <div className="mt-4 space-y-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Meta mensal</span>
                    <span>{estatisticasNovos.total}/20</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-green-500"
                      style={{ width: `${Math.min(estatisticasNovos.total / 20 * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  };
  
  return (
    <PermissionGuard requiredRole="admin">
      <UsersContent />
    </PermissionGuard>
  );
} 