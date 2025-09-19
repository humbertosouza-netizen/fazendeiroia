import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import { Lead } from '@/services/leadsService';
import { formatPhoneNumber } from '@/lib/utils';

interface LeadMessageModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LeadMessageModal = ({ lead, open, onOpenChange }: LeadMessageModalProps) => {
  if (!lead) return null;

  // Formatar nome da pessoa no título
  const formatName = (name: string) => {
    const nameParts = name.split(' ');
    if (nameParts.length <= 2) return name;
    return `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Mensagem de {formatName(lead.nome)}
          </DialogTitle>
          <DialogDescription>
            Recebida em {new Date(lead.data_criacao).toLocaleString('pt-BR')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm whitespace-pre-wrap">{lead.mensagem}</p>
          </div>
          
          <div className="mt-4 space-y-2">
            <div className="flex flex-col text-sm">
              <span className="text-gray-500 text-xs">Email:</span>
              <span className="font-medium">{lead.email}</span>
            </div>
            
            <div className="flex flex-col text-sm">
              <span className="text-gray-500 text-xs">Telefone:</span>
              <span className="font-medium">{lead.telefone}</span>
            </div>
          </div>
        </div>
        
        <DialogFooter className="sm:justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <span className={`w-2 h-2 rounded-full ${
              lead.status === 'novo'
                ? 'bg-blue-500'
                : lead.status === 'contatado'
                ? 'bg-yellow-500'
                : lead.status === 'convertido'
                ? 'bg-green-500'
                : 'bg-red-500'
            }`} />
            <span className="capitalize">{lead.status}</span>
          </div>
          
          <DialogClose asChild>
            <Button variant="secondary">Fechar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LeadMessageModal; 