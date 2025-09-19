-- Verificar se o usuário já existe
DO $$
DECLARE
    usuario_id UUID;
BEGIN
    -- Procurar pelo usuário com nome Humberto Azambuja
    SELECT id INTO usuario_id FROM usuarios WHERE nome = 'Humberto Azambuja';
    
    -- Se o usuário existir, atualizar sua role para admin
    IF FOUND THEN
        UPDATE usuarios SET role = 'admin' WHERE id = usuario_id;
        RAISE NOTICE 'Usuário "Humberto Azambuja" atualizado para administrador';
    ELSE
        -- Se o usuário não existir, inseri-lo como novo admin
        INSERT INTO usuarios (
            id, 
            nome, 
            email, 
            status, 
            plano, 
            ultimo_acesso, 
            data_cadastro,
            role
        ) VALUES (
            gen_random_uuid(), 
            'Humberto Azambuja', 
            'humberto@exemplo.com', 
            'Ativo', 
            'Premium', 
            NOW(), 
            NOW(),
            'admin'
        );
        RAISE NOTICE 'Novo usuário administrador "Humberto Azambuja" criado';
    END IF;
END;
$$;
