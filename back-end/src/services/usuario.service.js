
import pool from "../database/database.js";

// BUSCAR USUÁRIO POR E-MAIL
async function buscarUsuarioPorEmail(email) {
    const resultado = await pool.query(
        `SELECT *
         FROM usuarios
         WHERE email = $1`,
        [email]
    );

    return resultado.rows[0] ?? null;
}

// VERIFICAR SE A EMPRESA EXISTE
async function empresaExiste(empresaId) {
    const resultado = await pool.query(
        `SELECT id
         FROM empresas
         WHERE id = $1`,
        [empresaId]
    );

    return resultado.rows.length > 0;
}

// VERIFICAR SE A EMPRESA JÁ POSSUI ADMINISTRADOR
async function buscarAdministradorEmpresa(empresaId) {
    const resultado = await pool.query(
        `SELECT id
         FROM usuarios
         WHERE empresa_id = $1
           AND perfil = 'ADMIN_EMPRESA'
         LIMIT 1`,
        [empresaId]
    );

    return resultado.rows[0] ?? null;
}

// CRIAR USUÁRIO
async function criarUsuario(dadosUsuario) {
    const resultado = await pool.query(
        `INSERT INTO usuarios (
            empresa_id,
            nome,
            email,
            senha_hash,
            perfil
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            empresa_id,
            nome,
            email,
            perfil,
            status,
            criado_em,
            atualizado_em`,
        [
            dadosUsuario.empresa_id,
            dadosUsuario.nome,
            dadosUsuario.email,
            dadosUsuario.senha_hash,
            dadosUsuario.perfil
        ]
    );

    return resultado.rows[0];
}

// LISTAR COLABORADORES DA EMPRESA
async function listarColaboradores(empresaId) {
    const resultado = await pool.query(
        `SELECT
            id,
            empresa_id,
            nome,
            email,
            perfil,
            status,
            criado_em,
            atualizado_em
         FROM usuarios
         WHERE empresa_id = $1
           AND perfil = 'COLABORADOR'
         ORDER BY nome ASC`,
        [empresaId]
    );

    return resultado.rows;
}

// BUSCAR UM COLABORADOR DA EMPRESA
async function buscarColaboradorPorId(id, empresaId) {
    const resultado = await pool.query(
        `SELECT
            id,
            empresa_id,
            nome,
            email,
            perfil,
            status,
            criado_em,
            atualizado_em
         FROM usuarios
         WHERE id = $1
           AND empresa_id = $2
           AND perfil = 'COLABORADOR'`,
        [id, empresaId]
    );

    return resultado.rows[0] ?? null;
}

// ATUALIZAR DADOS DO COLABORADOR
async function atualizarColaborador(id, empresaId, dadosUsuario) {
    const resultado = await pool.query(
        `UPDATE usuarios
         SET nome = $1,
             email = $2,
             atualizado_em = CURRENT_TIMESTAMP
         WHERE id = $3
           AND empresa_id = $4
           AND perfil = 'COLABORADOR'
         RETURNING
            id,
            empresa_id,
            nome,
            email,
            perfil,
            status,
            criado_em,
            atualizado_em`,
        [
            dadosUsuario.nome,
            dadosUsuario.email,
            id,
            empresaId
        ]
    );

    return resultado.rows[0] ?? null;
}

// DESATIVAR COLABORADOR
async function desativarColaborador(id, empresaId) {
    const resultado = await pool.query(
        `UPDATE usuarios
         SET status = 'INATIVO',
             atualizado_em = CURRENT_TIMESTAMP
         WHERE id = $1
           AND empresa_id = $2
           AND perfil = 'COLABORADOR'
           AND status = 'ATIVO'
         RETURNING
            id,
            empresa_id,
            nome,
            email,
            perfil,
            status,
            criado_em,
            atualizado_em`,
        [id, empresaId]
    );

    return resultado.rows[0] ?? null;
}

export {
    buscarUsuarioPorEmail,
    empresaExiste,
    buscarAdministradorEmpresa,
    criarUsuario,
    listarColaboradores,
    buscarColaboradorPorId,
    atualizarColaborador,
    desativarColaborador
};
