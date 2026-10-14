-- ============================================================
-- MIGRATION 003: CRIAR TABELA DE USUÁRIOS
-- ============================================================

CREATE TABLE usuarios (

    -- Identificador único do usuário.
    id SERIAL PRIMARY KEY,

    -- Empresa à qual o usuário está vinculado.
    -- Pode ser NULL para um futuro administrador geral.
    empresa_id INTEGER REFERENCES empresas(id),

    -- Nome do usuário.
    nome VARCHAR(255) NOT NULL,

    -- E-mail utilizado no login.
    -- Não permite que dois usuários tenham o mesmo e-mail.
    email VARCHAR(255) NOT NULL UNIQUE,

    -- Hash da senha gerado pelo bcrypt.
    -- Nunca armazenaremos a senha original.
    senha_hash VARCHAR(255) NOT NULL,

    -- Perfil inicial do usuário.
    perfil VARCHAR(50) NOT NULL DEFAULT 'COLABORADOR',

    -- Situação da conta.
    status VARCHAR(20) NOT NULL DEFAULT 'ATIVO',

    -- Data e hora de criação do registro.
    criado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    -- Data e hora da última atualização.
    atualizado_em TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP

);