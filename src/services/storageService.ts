import { supabase } from '@/lib/supabase';

export interface UploadResult {
  success: boolean;
  url?: string;
  error?: string;
  path?: string;
}

export interface ImageUpload {
  file: File;
  anuncioId: string;
  ordem?: number;
}

// Serviço para gerenciar uploads no Supabase Storage
const storageService = {
  // Upload de uma imagem para o bucket 'anuncios'
  async uploadImagem(file: File, anuncioId: string, ordem: number = 0): Promise<UploadResult> {
    try {
      console.log('📤 Iniciando upload da imagem:', { fileName: file.name, anuncioId, ordem });
      
      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${anuncioId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log('📁 Nome do arquivo gerado:', fileName);
      
      // Upload para o Supabase Storage
      const { data, error } = await supabase.storage
        .from('anuncios')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('❌ Erro no upload:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('✅ Upload concluído, obtendo URL pública...');

      // Obter URL pública da imagem
      const { data: urlData } = supabase.storage
        .from('anuncios')
        .getPublicUrl(fileName);

      console.log('🔗 URL pública gerada:', urlData.publicUrl);

      return {
        success: true,
        url: urlData.publicUrl,
        path: fileName
      };
    } catch (error) {
      console.error('❌ Erro no upload da imagem:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erro desconhecido'
      };
    }
  },

  // Upload múltiplo de imagens
  async uploadMultiplasImagens(files: FileList, anuncioId: string): Promise<UploadResult[]> {
    const uploadPromises = Array.from(files).map((file, index) => 
      this.uploadImagem(file, anuncioId, index)
    );

    return Promise.all(uploadPromises);
  },

  // Remover imagem do storage
  async removerImagem(path: string): Promise<boolean> {
    try {
      const { error } = await supabase.storage
        .from('anuncios')
        .remove([path]);

      if (error) {
        console.error('Erro ao remover imagem:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      return false;
    }
  },

  // Validar arquivo de imagem
  validarArquivo(file: File): { valido: boolean; erro?: string } {
    // Verificar tipo de arquivo
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tiposPermitidos.includes(file.type)) {
      return {
        valido: false,
        erro: 'Tipo de arquivo não suportado. Use JPG, PNG ou WebP.'
      };
    }

    // Verificar tamanho (5MB)
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB em bytes
    if (file.size > tamanhoMaximo) {
      return {
        valido: false,
        erro: 'Arquivo muito grande. Tamanho máximo: 5MB.'
      };
    }

    return { valido: true };
  }
};

export default storageService;
