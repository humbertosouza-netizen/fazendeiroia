-- Adicionar coluna de role (função) à tabela usuarios
ALTER TABLE usuarios ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'usuario';

-- Comentário na coluna para documentação
COMMENT ON COLUMN usuarios.role IS 'Nível de permissão: admin, gerente, usuario';

-- Criar um enum para os valores permitidos (opcional, mas recomendado)
-- Usando uma abordagem segura que verifica se o tipo já existe antes de criá-lo
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'gerente', 'usuario');
    END IF;
END
$$;

-- Converter a coluna para usar o tipo enum (opcional)
-- ALTER TABLE usuarios ALTER COLUMN role TYPE user_role USING role::user_role;

-- Inserir/atualizar alguns usuários como administradores para teste
-- Substitua os IDs por IDs reais de usuários em seu sistema
-- UPDATE usuarios SET role = 'admin' WHERE id = 'id-do-usuario-admin';
