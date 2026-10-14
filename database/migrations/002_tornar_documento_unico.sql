-- ============================================================
-- MIGRATION 002: REGRAS DE INTEGRIDADE DA TABELA EMPRESAS
-- ============================================================

-- Torna obrigatório o telefone.
ALTER TABLE empresas
ALTER COLUMN telefone SET NOT NULL;

-- Torna obrigatório o documento.
ALTER TABLE empresas
ALTER COLUMN documento SET NOT NULL;

-- Torna obrigatório o endereço.
ALTER TABLE empresas
ALTER COLUMN endereco SET NOT NULL;

-- Torna obrigatório o email.
ALTER TABLE empresas
ALTER COLUMN email SET NOT NULL;


-- ============================================================
-- DOCUMENTO ÚNICO
-- ============================================================

-- Impede que duas empresas utilizem o mesmo CPF/CNPJ.
ALTER TABLE empresas
ADD CONSTRAINT empresas_documento_unique UNIQUE (documento);