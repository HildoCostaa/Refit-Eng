
-- ============================================================
-- MIGRATION 005: REGRAS DE INTEGRIDADE
-- Tabelas: empresas e usuarios
-- ============================================================


-- ============================================================
-- 1. GARANTIR QUE OS CAMPOS OBRIGATÓRIOS NÃO FIQUEM VAZIOS
-- ============================================================

ALTER TABLE empresas
ADD CONSTRAINT empresas_nome_nao_vazio
CHECK (TRIM(nome) <> '');

ALTER TABLE empresas
ADD CONSTRAINT empresas_documento_nao_vazio
CHECK (TRIM(documento) <> '');

ALTER TABLE empresas
ADD CONSTRAINT empresas_email_nao_vazio
CHECK (TRIM(email) <> '');

ALTER TABLE empresas
ADD CONSTRAINT empresas_telefone_nao_vazio
CHECK (TRIM(telefone) <> '');

ALTER TABLE empresas
ADD CONSTRAINT empresas_endereco_nao_vazio
CHECK (TRIM(endereco) <> '');


-- ============================================================
-- 2. GARANTIR QUE OS DADOS DOS USUÁRIOS NÃO FIQUEM VAZIOS
-- ============================================================

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_nome_nao_vazio
CHECK (TRIM(nome) <> '');

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_email_nao_vazio
CHECK (TRIM(email) <> '');

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_senha_hash_nao_vazio
CHECK (TRIM(senha_hash) <> '');


-- ============================================================
-- 3. LIMITAR OS PERFIS PERMITIDOS
-- ============================================================

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_perfil_valido
CHECK (
    perfil IN (
        'ADMIN_GERAL',
        'ADMIN_EMPRESA',
        'COLABORADOR'
    )
);


-- ============================================================
-- 4. LIMITAR OS STATUS PERMITIDOS
-- ============================================================

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_status_valido
CHECK (
    status IN ('ATIVO', 'INATIVO')
);


-- ============================================================
-- 5. GARANTIR O VÍNCULO CORRETO ENTRE PERFIL E EMPRESA
-- ============================================================

ALTER TABLE usuarios
ADD CONSTRAINT usuarios_vinculo_empresa_valido
CHECK (
    (
        perfil = 'ADMIN_GERAL'
        AND empresa_id IS NULL
    )
    OR
    (
        perfil IN ('ADMIN_EMPRESA', 'COLABORADOR')
        AND empresa_id IS NOT NULL
    )
);
