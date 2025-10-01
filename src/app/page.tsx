"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tractor, Trees, Wheat, Leaf } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-green-50 to-white">
      <div className="absolute inset-0 overflow-hidden z-0 opacity-5">
        <div className="absolute top-20 left-10">
          <Wheat className="h-56 w-56 text-green-800 transform -rotate-12" />
        </div>
        <div className="absolute bottom-10 right-20">
          <Trees className="h-72 w-72 text-green-800" />
        </div>
        <div className="absolute top-1/3 right-1/4">
          <Leaf className="h-40 w-40 text-green-700 transform rotate-45" />
        </div>
        <div className="absolute bottom-1/3 left-1/4">
          <Tractor className="h-48 w-48 text-green-700" />
        </div>
      </div>
      
      <div className="relative z-10 max-w-4xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 flex justify-center">
          <div className="inline-flex p-3 bg-white rounded-full shadow-md">
            <Image 
              src="/images/fazendeiro-ia-logo.png" 
              alt="Logo Fazendeiro IA" 
              width={48} 
              height={48} 
              className="h-12 w-12 object-contain"
              unoptimized
            />
          </div>
        </div>
        
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
          <span className="block bg-gradient-to-r from-green-600 to-green-800 text-transparent bg-clip-text">Fazendeiro IA</span>
        </h1>
        
        <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto">
          Encontre a propriedade rural ideal para investimento, produção ou lazer com a ajuda do nosso <span className="font-semibold text-green-700">Fazendeiro IA</span>.
        </p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-xl mx-auto text-left">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Wheat className="h-4 w-4 text-green-600" />
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Busca Inteligente</h3>
              <p className="mt-1 text-sm text-gray-500">Descreva o que procura em linguagem natural</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Trees className="h-4 w-4 text-green-600" />
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Análise Personalizada</h3>
              <p className="mt-1 text-sm text-gray-500">Recomendações baseadas nas suas necessidades</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0 mt-1">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                <Leaf className="h-4 w-4 text-green-600" />
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Interface Natural</h3>
              <p className="mt-1 text-sm text-gray-500">Converse com nosso assistente especializado</p>
            </div>
          </div>
        </div>
        
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          <Button asChild className="px-8 py-6 text-lg bg-green-700 hover:bg-green-800 active:bg-green-900 touch-manipulation">
            <Link href="/portal" className="block w-full h-full">Encontrar Propriedades</Link>
          </Button>
          <Button asChild variant="outline" className="px-8 py-6 text-lg border-green-600 text-green-700 hover:bg-green-50 active:bg-green-100 touch-manipulation">
            <Link href="/login" className="block w-full h-full">Área do Anunciante</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
