-- Função para obter todos os usuários sem restrições de RLS
CREATE OR REPLACE FUNCTION get_all_usuarios()
RETURNS SETOF usuarios
LANGUAGE sql
SECURITY DEFINER -- Isso faz a função executar com as permissões do criador
AS $$
  SELECT * FROM usuarios ORDER BY nome;
$$;

-- Habilite acesso anônimo à função
GRANT EXECUTE ON FUNCTION get_all_usuarios TO anon;
GRANT EXECUTE ON FUNCTION get_all_usuarios TO authenticated;
GRANT EXECUTE ON FUNCTION get_all_usuarios TO service_role; 