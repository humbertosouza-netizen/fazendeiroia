// Arquivo para testar as variáveis de ambiente do Supabase
require('dotenv').config({ path: '.env.local' });
console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('SUPABASE_KEY length:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length : 0); 