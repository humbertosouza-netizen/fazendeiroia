"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { X, ArrowRight } from 'lucide-react';

interface ChatFlutuanteProps {
  redirectUrl?: string;
}

export default function ChatFlutuante({ redirectUrl = '/portal' }: ChatFlutuanteProps) {
  const [aberto, setAberto] = useState(false);

  const toggleChat = () => {
    setAberto(!aberto);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      {/* Botão flutuante */}
      <button
        onClick={toggleChat}
        className={`bg-green-700 hover:bg-green-800 active:bg-green-900 text-white rounded-full p-3 shadow-lg flex items-center justify-center transition-all duration-300 touch-manipulation ${
          aberto ? 'scale-0 opacity-0' : 'scale-100 opacity-100'
        }`}
        aria-label="Abrir chat com Fazendeiro IA"
      >
        <Image
          src="/images/fazendeiro-ia-logo.png"
          alt="Fazendeiro IA"
          width={32}
          height={32}
          className="object-contain h-8 w-8"
          unoptimized
        />
      </button>

      {/* Janela de chat flutuante */}
      <div
        className={`bg-white rounded-lg shadow-xl overflow-hidden transition-all duration-300 transform origin-bottom-right ${
          aberto
            ? 'scale-100 opacity-100 translate-y-0'
            : 'scale-90 opacity-0 translate-y-8 pointer-events-none'
        }`}
        style={{ width: '320px', maxHeight: '400px' }}
      >
        {/* Cabeçalho do chat */}
        <div className="bg-gradient-to-r from-green-700 to-green-800 text-white p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/images/fazendeiro-ia-logo.png"
              alt="Fazendeiro IA"
              width={24}
              height={24}
              className="object-contain h-6 w-6"
              unoptimized
            />
            <span className="font-medium">Fazendeiro IA</span>
          </div>
          <button
            onClick={toggleChat}
            className="text-white hover:text-gray-200 transition-colors"
            aria-label="Fechar chat"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do chat */}
        <div className="p-4 bg-gray-50">
          <div className="bg-white border border-green-100 rounded-lg p-3 shadow-sm">
            <p className="text-sm text-gray-800">
              Olá, eu sou o Fazendeiro IA! 👨‍🌾 Estou aqui para ajudar você a encontrar a propriedade rural dos seus sonhos.
            </p>
            <p className="text-sm text-gray-800 mt-2">
              Clique no botão abaixo para começarmos uma conversa.
            </p>
          </div>

          <Link href={redirectUrl}>
            <Button className="w-full mt-4 bg-green-700 hover:bg-green-800 text-white flex items-center justify-center gap-2">
              Iniciar conversa
              <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 