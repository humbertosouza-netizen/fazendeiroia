"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus, Upload, X } from "lucide-react";
import { AnuncioImagem } from "@/services/anunciosService";
import anunciosService from "@/services/anunciosService";
import storageService from "@/services/storageService";

interface GerenciarImagensProps {
  anuncioId: string;
  onImagensAtualizadas: () => void;
}

export default function GerenciarImagens({ anuncioId, onImagensAtualizadas }: GerenciarImagensProps) {
  const [imagens, setImagens] = useState<AnuncioImagem[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [uploadando, setUploadando] = useState(false);
  const [removendo, setRemovendo] = useState<string | null>(null);

  // Carregar imagens existentes
  useEffect(() => {
    carregarImagens();
  }, [anuncioId]);

  const carregarImagens = async () => {
    try {
      setCarregando(true);
      const imagensAnuncio = await anunciosService.getImagensAnuncio(anuncioId);
      setImagens(imagensAnuncio);
    } catch (error) {
      console.error("Erro ao carregar imagens:", error);
    } finally {
      setCarregando(false);
    }
  };

  const handleUpload = async (files: FileList) => {
    if (!files || files.length === 0) return;

    setUploadando(true);
    try {
      const resultado = await anunciosService.uploadImagensAnuncio(files, anuncioId);
      
      if (resultado.sucesso > 0) {
        await carregarImagens(); // Recarregar imagens
        onImagensAtualizadas();
      }
      
      if (resultado.erros.length > 0) {
        resultado.erros.forEach(erro => console.error(erro));
      }
    } catch (error) {
      console.error("Erro no upload:", error);
    } finally {
      setUploadando(false);
    }
  };

  const handleRemover = async (imagemId: string) => {
    setRemovendo(imagemId);
    try {
      const sucesso = await anunciosService.removerImagemAnuncio(imagemId);
      if (sucesso) {
        await carregarImagens(); // Recarregar imagens
        onImagensAtualizadas();
      }
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
    } finally {
      setRemovendo(null);
    }
  };

  if (carregando) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Gerenciar Imagens</h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Gerenciar Imagens</h3>
      
      {/* Upload de novas imagens */}
      <div className="border-2 border-dashed border-gray-300 p-4 rounded-md">
        <div className="text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 mb-2">
            Adicionar novas imagens
          </p>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleUpload(e.target.files!)}
            className="hidden"
            id="upload-imagens"
            disabled={uploadando}
          />
          <label
            htmlFor="upload-imagens"
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium cursor-pointer ${
              uploadando
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {uploadando ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Selecionar Imagens
              </>
            )}
          </label>
        </div>
      </div>

      {/* Lista de imagens existentes */}
      {imagens.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {imagens.map((imagem) => (
            <Card key={imagem.id} className="overflow-hidden">
              <div className="relative">
                <img
                  src={imagem.url}
                  alt={`Imagem ${imagem.ordem + 1}`}
                  className="w-full h-32 object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 h-8 w-8"
                  onClick={() => handleRemover(imagem.id)}
                  disabled={removendo === imagem.id}
                >
                  {removendo === imagem.id ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                  #{imagem.ordem + 1}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Nenhuma imagem cadastrada</p>
          <p className="text-sm">Adicione imagens usando o botão acima</p>
        </div>
      )}
    </div>
  );
}
