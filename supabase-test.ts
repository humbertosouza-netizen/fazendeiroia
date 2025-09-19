import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://gsjdhjambxcsmfvniado.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdzamRoamFtYnhjc21mdm5pYWRvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2ODc5NjcsImV4cCI6MjA2MzI2Mzk2N30.qWAvfZeme2mazFR-gh7h4gtMAi_N2FaEDz9MTc_n7aY';

const supabase = createClient(supabaseUrl, supabaseKey);

// Testar conexão
(async () => {
  try {
    // Testar se o cliente foi inicializado
    console.log('Supabase client inicializado:', supabase !== null);
    
    // Testar conexão com tabela anuncios
    console.log('Testando conexão com a tabela anuncios...');
    const { data, error } = await supabase.from('anuncios').select('count').limit(1);
    
    if (error) {
      console.error('Erro ao conectar com o Supabase:', error.message);
      console.error('Código do erro:', error.code);
      console.error('Detalhes:', error.details);
    } else {
      console.log('Conexão com o Supabase estabelecida com sucesso!');
      console.log('Dados recebidos:', data);
    }
  } catch (err) {
    console.error('Exceção ao testar conexão com o Supabase:', err);
  }
})(); 