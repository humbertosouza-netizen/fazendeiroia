"use client";

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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Ruler, 
  Tag, 
  Eye, 
  Droplets,
  Zap,
  Mountain,
  FileText,
  Home,
  Warehouse,
  ExternalLink
} from "lucide-react";
import { Anuncio } from "@/services/anunciosService";

interface VisualizarAnuncioModalProps {
  anuncio: Anuncio | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const VisualizarAnuncioModal = ({ anuncio, open, onOpenChange }: VisualizarAnuncioModalProps) => {
  if (!anuncio) return null;

  // Estruturas com ícones
  const estruturasMap: Record<string, {label: string, icon: React.ReactNode}> = {
    "sede": { label: "Sede", icon: <Home className="h-4 w-4 text-green-600" /> },
    "casaFuncionarios": { label: "Casa de Funcionários", icon: <Home className="h-4 w-4 text-green-600" /> },
    "galpao": { label: "Galpão", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
    "curral": { label: "Curral", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
    "cercas": { label: "Cercas", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
    "cocheiras": { label: "Cocheiras", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
    "piscina": { label: "Piscina", icon: <Droplets className="h-4 w-4 text-green-600" /> },
    "barracao": { label: "Barracão", icon: <Warehouse className="h-4 w-4 text-green-600" /> },
  };

  const statusColors = {
    Ativo: "bg-green-100 text-green-800",
    Pausado: "bg-yellow-100 text-yellow-800",
    Vendido: "bg-blue-100 text-blue-800",
  };

  const handleVerNoPortal = () => {
    if (anuncio.id) {
      window.open(`/portal/anuncio/${anuncio.id}`, '_blank');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Resumo do Anúncio
          </DialogTitle>
          <DialogDescription>
            Visualize os detalhes completos da propriedade
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{anuncio.titulo}</CardTitle>
              <div className="flex items-center gap-2">
                <Badge className={statusColors[anuncio.status as keyof typeof statusColors]}>
                  {anuncio.status}
                </Badge>
                <Badge variant="outline">{anuncio.categoria}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium">Preço:</span>
                  <span className="text-lg font-bold text-green-700">{anuncio.preco}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium">Visualizações:</span>
                  <span className="font-medium">{anuncio.visualizacoes}</span>
                </div>
                
                {anuncio.detalhes?.cidade && anuncio.detalhes?.estado && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-medium">Localização:</span>
                    <span className="font-medium">{anuncio.detalhes.cidade}, {anuncio.detalhes.estado}</span>
                  </div>
                )}
                
                {anuncio.detalhes?.area && (
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-medium">Área:</span>
                    <span className="font-medium">{anuncio.detalhes.area} hectares</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Detalhes da Propriedade */}
          {anuncio.detalhes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes da Propriedade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {anuncio.detalhes.finalidade && (
                    <div className="flex items-center gap-2">
                      <Mountain className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium">Finalidade:</span>
                      <span className="font-medium">{anuncio.detalhes.finalidade}</span>
                    </div>
                  )}
                  
                  {anuncio.detalhes.tipo_oferta && (
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Tipo de Oferta:</span>
                      <span className="font-medium capitalize">{anuncio.detalhes.tipo_oferta}</span>
                    </div>
                  )}
                  
                  {anuncio.detalhes.recurso_hidrico && (
                    <div className="flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium">Recurso Hídrico:</span>
                      <span className="font-medium">{anuncio.detalhes.recurso_hidrico}</span>
                    </div>
                  )}
                  
                  {anuncio.detalhes.energia && (
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">Energia:</span>
                      <span className="font-medium">{anuncio.detalhes.energia}</span>
                    </div>
                  )}
                  
                  {anuncio.detalhes.tipo_solo && (
                    <div className="flex items-center gap-2">
                      <Mountain className="h-4 w-4 text-amber-600" />
                      <span className="text-sm font-medium">Tipo de Solo:</span>
                      <span className="font-medium">{anuncio.detalhes.tipo_solo}</span>
                    </div>
                  )}
                  
                  {anuncio.detalhes.documentacao && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">Documentação:</span>
                      <span className="font-medium">{anuncio.detalhes.documentacao}</span>
                    </div>
                  )}
                </div>

                {/* Estruturas */}
                {anuncio.detalhes.estruturas && anuncio.detalhes.estruturas.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Estruturas Disponíveis:</h4>
                    <div className="flex flex-wrap gap-2">
                      {anuncio.detalhes.estruturas.map((estrutura) => {
                        const estruturaInfo = estruturasMap[estrutura];
                        return estruturaInfo ? (
                          <div key={estrutura} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                            {estruturaInfo.icon}
                            <span className="text-xs">{estruturaInfo.label}</span>
                          </div>
                        ) : null;
                      })}
                    </div>
                  </div>
                )}

                {/* Informações de Arrendamento */}
                {anuncio.detalhes.tipo_oferta === 'arrendamento' && (
                  <div className="bg-blue-50 p-3 rounded">
                    <h4 className="text-sm font-medium text-blue-800 mb-1">Informações de Arrendamento</h4>
                    {anuncio.detalhes.periodo_arrendamento && (
                      <p className="text-xs text-blue-700">Período: {anuncio.detalhes.periodo_arrendamento}</p>
                    )}
                    {anuncio.detalhes.valor_arrendamento && (
                      <p className="text-xs text-blue-700">Valor: R$ {anuncio.detalhes.valor_arrendamento.toLocaleString('pt-BR')}/mês</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Data de Publicação */}
          <div className="text-xs text-gray-500">
            Publicado em: {new Date(anuncio.datapublicacao).toLocaleDateString('pt-BR')}
          </div>
        </div>
        
        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button variant="outline">Fechar</Button>
          </DialogClose>
          <Button onClick={handleVerNoPortal} className="bg-green-700 hover:bg-green-800">
            <ExternalLink className="h-4 w-4 mr-2" />
            Ver no Portal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VisualizarAnuncioModal;
