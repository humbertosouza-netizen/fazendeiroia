import { createClient } from '@supabase/supabase-js';

// Estas variáveis de ambiente precisam ser definidas no arquivo .env.local
let supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
let supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Verificar se temos as variáveis de ambiente necessárias
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Variáveis de ambiente do Supabase não encontradas! Usando valores específicos...');
  
  // Valores fornecidos pelo usuário
  supabaseUrl = 'https://gsjdhjambxcsmfvniado.supabase.co';
  supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzamRoamFtYnhjc21mdm5pYWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODc5NjcsImV4cCI6MjA2MzI2Mzk2N30.qWAvfZeme2mazFR-gh7h4gtMAi_N2FaEDz9MTc_n7aY';
  
  console.log('ℹ️ Utilizando URL e chave do Supabase fornecidas diretamente');
}

console.log('🔌 Inicializando cliente Supabase...');
console.log('📝 URL do Supabase:', supabaseUrl);
console.log('🔑 Chave do Supabase (primeiros 10 caracteres):', supabaseAnonKey.substring(0, 10) + '...');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Teste a conexão para verificar se as credenciais estão funcionando
(async () => {
  try {
    const { data, error } = await supabase.from('anuncios').select('count').limit(1);
    if (error) {
      console.error('❌ Erro ao conectar com o Supabase:', error.message);
      console.error('Código do erro:', error.code);
      console.error('Detalhes do erro:', error.details || 'Sem detalhes adicionais');
    } else {
      console.log('✅ Conexão com o Supabase estabelecida com sucesso!');
      console.log('Dados recebidos:', data);
    }
  } catch (err) {
    console.error('❌ Exceção ao testar conexão com o Supabase:', err);
  }
})(); 