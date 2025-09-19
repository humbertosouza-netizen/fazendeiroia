import { supabase } from '@/lib/supabase';

// Interface para representar um lead
export interface Lead {
  id?: string;
  anuncio_id: string;
  nome: string;
  email: string;
  telefone: string;
  mensagem: string;
  data_criacao: string;
  status: 'novo' | 'contatado' | 'convertido' | 'perdido';
}

// Serviço para gerenciar leads
const leadsService = {
  // Buscar todos os leads
  async getLeads() {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error('Erro ao buscar leads:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Erro ao buscar leads:', error);
      
      // Retornar dados de exemplo em caso de erro ou ambiente de desenvolvimento
      return [
        {
          id: '1',
          anuncio_id: '1',
          nome: 'João Silva',
          email: 'joao@exemplo.com',
          telefone: '(11) 98765-4321',
          mensagem: 'Tenho interesse nesta propriedade.',
          data_criacao: new Date(Date.now() - 12*60*1000).toISOString(),
          status: 'novo'
        },
        {
          id: '2',
          anuncio_id: '3',
          nome: 'Maria Souza',
          email: 'maria@exemplo.com',
          telefone: '(21) 98765-4321',
          mensagem: 'Gostaria de mais informações.',
          data_criacao: new Date(Date.now() - 60*60*1000).toISOString(),
          status: 'contatado'
        },
        {
          id: '3',
          anuncio_id: '2',
          nome: 'Carlos Ferreira',
          email: 'carlos@exemplo.com',
          telefone: '(31) 98765-4321',
          mensagem: 'Quero visitar a propriedade.',
          data_criacao: new Date(Date.now() - 3*60*60*1000).toISOString(),
          status: 'convertido'
        }
      ];
    }
  },

  // Buscar leads de um anúncio específico
  async getLeadsPorAnuncio(anuncioId: string) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('anuncio_id', anuncioId)
        .order('data_criacao', { ascending: false });

      if (error) {
        console.error(`Erro ao buscar leads do anúncio ${anuncioId}:`, error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error(`Erro ao buscar leads do anúncio ${anuncioId}:`, error);
      return [];
    }
  },

  // Buscar contagem de leads por mês
  async getLeadsPorMes(meses = 6) {
    try {
      // Em produção, isso seria uma query SQL usando DATE_TRUNC('month', data_criacao)
      // Vamos simular isso para o ambiente de desenvolvimento
      
      const dataAtual = new Date();
      const dadosMensais = [];
      
      for (let i = 0; i < meses; i++) {
        const data = new Date(dataAtual);
        data.setMonth(data.getMonth() - i);
        
        // Tenta buscar do banco de dados
        try {
          const mes = data.getMonth();
          const ano = data.getFullYear();
          
          const { data: leads, error } = await supabase
            .from('leads')
            .select('id')
            .gte('data_criacao', `${ano}-${(mes + 1).toString().padStart(2, '0')}-01`)
            .lt('data_criacao', 
                mes === 11 
                  ? `${ano + 1}-01-01` 
                  : `${ano}-${(mes + 2).toString().padStart(2, '0')}-01`);
          
          if (error) {
            throw error;
          }
          
          dadosMensais.unshift({
            mes: data.toLocaleString('pt-BR', { month: 'short' }),
            quantidade: leads?.length || 0
          });
        } catch (error) {
          console.error(`Erro ao buscar leads para o mês ${data.getMonth() + 1}/${data.getFullYear()}:`, error);
          
          // Valores simulados em caso de erro
          const valoresSimulados = [12, 18, 24, 32, 42, 53];
          dadosMensais.unshift({
            mes: data.toLocaleString('pt-BR', { month: 'short' }),
            quantidade: valoresSimulados[i] || Math.floor(Math.random() * 40) + 10
          });
        }
      }
      
      return dadosMensais;
    } catch (error) {
      console.error('Erro ao calcular leads por mês:', error);
      
      // Valores simulados em caso de erro
      const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];
      const valores = [12, 18, 24, 32, 42, 53];
      
      return meses.map((mes, index) => ({
        mes,
        quantidade: valores[index]
      }));
    }
  },

  // Criar um novo lead
  async criarLead(lead: Omit<Lead, 'id' | 'data_criacao' | 'status'>) {
    try {
      const novoLead = {
        ...lead,
        data_criacao: new Date().toISOString(),
        status: 'novo' as const
      };

      const { data, error } = await supabase
        .from('leads')
        .insert(novoLead)
        .select()
        .single();

      if (error) {
        console.error('Erro ao criar lead:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Erro ao criar lead:', error);
      throw error;
    }
  },

  // Atualizar status do lead
  async atualizarStatusLead(id: string, status: Lead['status']) {
    try {
      const { data, error } = await supabase
        .from('leads')
        .update({ status })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Erro ao atualizar status do lead ${id}:`, error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error(`Erro ao atualizar status do lead ${id}:`, error);
      throw error;
    }
  }
};

export default leadsService; 