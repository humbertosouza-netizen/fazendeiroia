"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Leaf, UserPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      router.push("/login?message=Verifique seu email para confirmar seu cadastro");
    } catch (error: any) {
      setError(error.message || "Erro ao criar conta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-gray-50">
      <div className="absolute top-0 left-0 m-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-br from-green-600 to-green-800 text-white p-1.5 rounded-lg flex items-center justify-center">
            <Image 
              src="/images/fazendeiro-ia-logo.png" 
              alt="Logo Fazendeiro IA" 
              width={20} 
              height={20} 
              className="h-5 w-5 object-contain"
              unoptimized
            />
          </span>
          <span className="text-lg font-semibold bg-gradient-to-r from-green-700 to-green-900 text-transparent bg-clip-text">
            Fazendeiro IA
          </span>
        </Link>
      </div>
      
      <Card className="w-full max-w-md shadow-lg border-green-100">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <span className="bg-gradient-to-br from-green-600 to-green-800 text-white p-2 rounded-lg flex items-center justify-center">
              <UserPlus className="h-6 w-6" />
            </span>
          </div>
          <CardTitle className="text-2xl text-center bg-gradient-to-r from-green-700 to-green-900 text-transparent bg-clip-text">
            Criar Conta
          </CardTitle>
          <CardDescription className="text-center">
            Registre-se para anunciar no Fazendeiro IA
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium flex items-center gap-1 text-green-800">
                <Leaf className="h-3.5 w-3.5 text-green-600" />
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="border-green-200 focus-visible:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium flex items-center gap-1 text-green-800">
                <Leaf className="h-3.5 w-3.5 text-green-600" />
                Senha
              </label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-green-200 focus-visible:ring-green-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium flex items-center gap-1 text-green-800">
                <Leaf className="h-3.5 w-3.5 text-green-600" />
                Confirmar Senha
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="********"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="border-green-200 focus-visible:ring-green-500"
              />
            </div>
            {error && (
              <div className="rounded bg-red-50 p-2 text-sm text-red-500 border border-red-100">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-green-600 to-green-800 hover:from-green-700 hover:to-green-900 text-white" 
              disabled={loading}
            >
              {loading ? "Registrando..." : "Criar conta"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2 items-center">
          <p className="text-sm text-gray-600">
            Já tem uma conta?{" "}
            <Link href="/login" className="text-green-600 hover:text-green-800 hover:underline font-medium">
              Faça login
            </Link>
          </p>
          <Link href="/portal" className="text-xs text-green-600 hover:text-green-800">
            Voltar para o Portal
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
} 