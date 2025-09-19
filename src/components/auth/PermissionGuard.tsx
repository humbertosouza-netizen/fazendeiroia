"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import usuariosService from "@/services/usuariosService";

interface PermissionGuardProps {
  children: ReactNode;
  requiredRole: "admin" | "gerente" | "usuario";
  fallback?: ReactNode; // Componente alternativo para mostrar em caso de acesso negado
}

export default function PermissionGuard({ 
  children, 
  requiredRole, 
  fallback 
}: PermissionGuardProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  
  useEffect(() => {
    const checkPermission = async () => {
      try {
        // Verificar se o usuário está autenticado
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          // Usuário não autenticado, redirecionar para login
          router.push('/login');
          return;
        }
        
        // Obter a role do usuário
        const userRole = await usuariosService.getRoleUsuario(user.id);
        
        // Verificar permissão com base na hierarquia
        const roleHierarchy = {
          admin: 3,
          gerente: 2,
          usuario: 1
        };
        
        // Usuário tem permissão se sua role for igual ou superior à requerida
        const hasAccess = roleHierarchy[userRole as keyof typeof roleHierarchy] >= 
                         roleHierarchy[requiredRole];
        
        setHasPermission(hasAccess);
      } catch (error) {
        console.error("Erro ao verificar permissões:", error);
        setHasPermission(false);
      } finally {
        setLoading(false);
      }
    };
    
    checkPermission();
  }, [requiredRole, router]);
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  // Se não tiver permissão e tiver um componente alternativo, mostrar o componente alternativo
  if (!hasPermission && fallback) {
    return <>{fallback}</>;
  }
  
  // Se não tiver permissão e não tiver um componente alternativo, mostrar mensagem de acesso negado
  if (!hasPermission) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Acesso Negado</h1>
          <p className="text-gray-600 mb-6">
            Você não tem permissão para acessar esta página. Entre em contato com um administrador 
            caso acredite que deveria ter acesso.
          </p>
          <button
            onClick={() => router.push('/dashboard')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-colors"
          >
            Voltar para o Dashboard
          </button>
        </div>
      </div>
    );
  }
  
  // Se tiver permissão, mostrar o conteúdo
  return <>{children}</>;
} 