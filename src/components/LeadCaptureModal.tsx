import React, { useState } from 'react';
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Phone, Send, Loader2 } from "lucide-react";
import leadsService from '@/services/leadsService';

interface LeadCaptureModalProps {
  anuncioId: string;
  anuncioTitulo: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLeadCapture: (telefone: string) => void;
}

const LeadCaptureModal = ({ anuncioId, anuncioTitulo, open, onOpenChange, onLeadCapture }: LeadCaptureModalProps) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Formatar telefone enquanto o usuário digita
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length <= 11) {
      // Formatar como (XX) XXXXX-XXXX enquanto digita
      if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
      }
      if (value.length > 10) {
        value = `${value.slice(0, 10)}-${value.slice(10)}`;
      }
      setTelefone(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validação básica
    if (!nome || !email || !telefone) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um email válido.');
      return;
    }
    
    // Validar telefone (pelo menos 10 dígitos)
    const telefoneDigits = telefone.replace(/\D/g, '');
    if (telefoneDigits.length < 10) {
      setError('Por favor, insira um telefone válido com DDD.');
      return;
    }
    
    setLoading(true);
    
    try {
      // Salvar lead no banco de dados
      await leadsService.criarLead({
        anuncio_id: anuncioId,
        nome,
        email,
        telefone,
        mensagem: mensagem || `Olá, tenho interesse no anúncio ${anuncioTitulo}. Por favor, entre em contato comigo.`
      });
      
      // Passar o telefone formatado para o callback de redirecionamento
      onLeadCapture(telefoneDigits);
      
      // Fechar o modal
      onOpenChange(false);
      
      // Limpar o formulário
      setNome('');
      setEmail('');
      setTelefone('');
      setMensagem('');
    } catch (error) {
      console.error('Erro ao cadastrar lead:', error);
      setError('Ocorreu um erro ao enviar seus dados. Por favor, tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-700">
            <Phone className="h-5 w-5" />
            Entrar em contato com o anunciante
          </DialogTitle>
          <DialogDescription>
            Preencha suas informações para entrar em contato com o anunciante desta propriedade.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="nome" className="text-sm">
                Nome completo <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nome"
                placeholder="Seu nome completo"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="email" className="text-sm">
                E-mail <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="telefone" className="text-sm">
                Telefone / WhatsApp <span className="text-red-500">*</span>
              </Label>
              <Input
                id="telefone"
                placeholder="(00) 00000-0000"
                value={telefone}
                onChange={handlePhoneChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="mensagem" className="text-sm">
                Mensagem
              </Label>
              <Textarea
                id="mensagem"
                placeholder="Olá, tenho interesse nesta propriedade..."
                value={mensagem}
                onChange={(e) => setMensagem(e.target.value)}
                rows={3}
              />
            </div>
            
            {error && (
              <p className="text-sm text-red-500 mt-2">{error}</p>
            )}
          </div>
          
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button 
              type="submit" 
              className="bg-green-700 hover:bg-green-800"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Enviar e Contatar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default LeadCaptureModal; 