
import pool from "../database/database.js";

// CRIAR CLIENTE
export async function criarCliente(dadosCliente) {
    const {
        empresaId,
        tipoPessoa,
        nome,
        nomeFantasia,
        documento,
        email,
        telefone,
        endereco,
        observacoes
    } = dadosCliente;

    const resultado = await pool.query(
        `INSERT INTO clientes (
            empresa_id,
            tipo_pessoa,
            nome,
            nome_fantasia,
            documento,
            email,
            telefone,
            endereco,
            observacoes
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING
            id,
            empresa_id,
            tipo_pessoa,
            nome,
            nome_fantasia,
            documento,
            email,
            telefone,
            endereco,
            observacoes,
            status,
            criado_em`,
        [
            empresaId,
            tipoPessoa,
            nome,
            nomeFantasia,
            documento,
            email,
            telefone,
            endereco,
            observacoes
        ]
    );

    return resultado.rows[0];
}


// LISTAR CLIENTES DA EMPRESA
export async function listarClientes(empresaId) {
    const resultado = await pool.query(
        `SELECT
            id,
            empresa_id,
            tipo_pessoa,
            nome,
            nome_fantasia,
            documento,
            email,
            telefone,
            endereco,
            observacoes,
            status,
            criado_em
         FROM clientes
         WHERE empresa_id = $1
         ORDER BY nome ASC`,
        [empresaId]
    );

    return resultado.rows;
}


// BUSCAR CLIENTE POR ID
export async function buscarClientePorId(id, empresaId) {
    const resultado = await pool.query(
        `SELECT
            id,
            empresa_id,
            tipo_pessoa,
            nome,
            nome_fantasia,
            documento,
            email,
            telefone,
            endereco,
            observacoes,
            status,
            criado_em
         FROM clientes
         WHERE id = $1
         AND empresa_id = $2`,
        [id, empresaId]
    );

    return resultado.rows[0] ?? null;
}


// ATUALIZAR CLIENTE
export async function atualizarCliente(id, empresaId, dadosCliente) {
    const {
        tipoPessoa,
        nome,
        nomeFantasia,
        documento,
        email,
        telefone,
        endereco,
        observacoes
    } = dadosCliente;

    const resultado = await pool.query(
        `UPDATE clientes
         SET
            tipo_pessoa = $1,
            nome = $2,
            nome_fantasia = $3,
            documento = $4,
            email = $5,
            telefone = $6,
            endereco = $7,
            observacoes = $8,
            atualizado_em = CURRENT_TIMESTAMP
         WHERE id = $9
         AND empresa_id = $10
         AND status = 'ATIVO'
         RETURNING
            id,
            empresa_id,
            tipo_pessoa,
            nome,
            nome_fantasia,
            documento,
            email,
            telefone,
            endereco,
            observacoes,
            status,
            atualizado_em`,
        [
            tipoPessoa,
            nome,
            nomeFantasia,
            documento,
            email,
            telefone,
            endereco,
            observacoes,
            id,
            empresaId
        ]
    );

    return resultado.rows[0] ?? null;
}


// DESATIVAR CLIENTE
export async function desativarCliente(id, empresaId) {
    const resultado = await pool.query(
        `UPDATE clientes
         SET
            status = 'INATIVO',
            atualizado_em = CURRENT_TIMESTAMP
         WHERE id = $1
         AND empresa_id = $2
         AND status = 'ATIVO'
         RETURNING id, nome, status`,
        [id, empresaId]
    );

    return resultado.rows[0] ?? null;
}
