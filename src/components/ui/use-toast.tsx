"use client";

import { useState, useEffect, ReactNode } from 'react';

interface Toast {
  id: string;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

interface ToastOptions {
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

// Armazena todos os toasts ativos
let toasts: Toast[] = [];

// Função para adicionar um toast
let addToast: (options: ToastOptions) => void = () => {};

// Função para remover um toast
let dismissToast: (id: string) => void = () => {};

// Custom hook para usar o sistema de toasts
export const useToast = () => {
  return {
    toast: (options: ToastOptions) => {
      addToast(options);
    },
    dismiss: (id: string) => {
      dismissToast(id);
    },
  };
};

// Componente para exibir as notificações toast
export function Toaster() {
  const [localToasts, setLocalToasts] = useState<Toast[]>([]);

  useEffect(() => {
    // Atualiza os gerenciadores de toasts
    addToast = (options: ToastOptions) => {
      const id = Math.random().toString(36).substring(2, 9);
      const newToast = { id, ...options };
      toasts = [...toasts, newToast];
      setLocalToasts(toasts);

      // Auto-dismiss após 5 segundos
      setTimeout(() => {
        dismissToast(id);
      }, 5000);
    };

    dismissToast = (id: string) => {
      toasts = toasts.filter(toast => toast.id !== id);
      setLocalToasts(toasts);
    };

    return () => {
      // Limpa toasts ao desmontar
      toasts = [];
      setLocalToasts([]);
    };
  }, []);

  return (
    <div className="fixed top-0 right-0 p-4 z-50 flex flex-col gap-2 max-w-md w-full">
      {localToasts.map((toast) => (
        <div
          key={toast.id}
          className={`bg-white border shadow-lg rounded-lg p-4 transform transition-all duration-300 ease-in-out ${
            toast.variant === 'destructive' 
              ? 'border-red-500' 
              : 'border-green-500'
          }`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-medium ${
                toast.variant === 'destructive' ? 'text-red-600' : 'text-green-600'
              }`}>
                {toast.title}
              </h3>
              {toast.description && (
                <p className="text-sm text-gray-500 mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              &times;
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

// Re-exporta simplesmente para facilitar a importação
export const toast = (options: ToastOptions) => addToast(options); 