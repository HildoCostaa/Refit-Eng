
// Importa o pool de conexão com o PostgreSQL.
//
// É através dele que nosso sistema executa
// comandos SQL no banco de dados.
import pool from "../database/database.js";


// ============================================================
// CRIAR EMPRESA
// ============================================================

// Função responsável por cadastrar uma nova empresa.
async function criarEmpresa(dadosEmpresa) {

    const resultado = await pool.query(
        `
        INSERT INTO empresas (
            nome,
            nome_fantasia,
            documento,
            email,
            telefone,
            endereco,
            chave_pix
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
            dadosEmpresa.nome,
            dadosEmpresa.nome_fantasia,
            dadosEmpresa.documento,
            dadosEmpresa.email,
            dadosEmpresa.telefone,
            dadosEmpresa.endereco,
            dadosEmpresa.chave_pix
        ]
    );


    // Retorna a empresa que acabou de ser criada.
    return resultado.rows[0];
}


// ============================================================
// LISTAR EMPRESAS
// ============================================================

// Função responsável por buscar todas as empresas.
async function listarEmpresas() {

    const resultado = await pool.query(
        `
        SELECT *
        FROM empresas
        ORDER BY id ASC
        `
    );


    // Retorna todas as empresas encontradas.
    return resultado.rows;
}


// ============================================================
// BUSCAR EMPRESA POR ID
// ============================================================

// Busca uma única empresa utilizando seu ID.
async function buscarEmpresaPorId(id) {

    const resultado = await pool.query(
        `
        SELECT *
        FROM empresas
        WHERE id = $1
        `,
        [id]
    );


    // Se nenhuma empresa for encontrada,
    // retorna null.
    if (resultado.rows.length === 0) {
        return null;
    }


    // Retorna a empresa encontrada.
    return resultado.rows[0];
}


// ============================================================
// BUSCAR EMPRESA POR DOCUMENTO
// ============================================================

// Procura uma empresa utilizando seu CPF ou CNPJ.
async function buscarEmpresaPorDocumento(documento) {

    const resultado = await pool.query(
        `
        SELECT *
        FROM empresas
        WHERE documento = $1
        `,
        [documento]
    );


    // Se nenhuma empresa possuir esse documento,
    // retorna null.
    if (resultado.rows.length === 0) {
        return null;
    }


    // Retorna a empresa encontrada.
    return resultado.rows[0];
}


// ============================================================
// ATUALIZAR EMPRESA
// ============================================================

// Função responsável por atualizar uma empresa existente.
async function atualizarEmpresa(id, dadosEmpresa) {

    const resultado = await pool.query(
        `
        UPDATE empresas
        SET
            nome = $1,
            nome_fantasia = $2,
            documento = $3,
            email = $4,
            telefone = $5,
            endereco = $6,
            chave_pix = $7,
            atualizado_em = CURRENT_TIMESTAMP
        WHERE id = $8
        RETURNING *
        `,
        [
            dadosEmpresa.nome,
            dadosEmpresa.nome_fantasia,
            dadosEmpresa.documento,
            dadosEmpresa.email,
            dadosEmpresa.telefone,
            dadosEmpresa.endereco,
            dadosEmpresa.chave_pix,
            id
        ]
    );


    // Se nenhuma empresa foi encontrada,
    // retorna null.
    if (resultado.rows.length === 0) {
        return null;
    }


    // Retorna a empresa atualizada.
    return resultado.rows[0];
}


// ============================================================
// EXCLUIR EMPRESA
// ============================================================

// Função responsável por excluir uma empresa
// utilizando seu ID.
async function excluirEmpresa(id) {

    const resultado = await pool.query(
        `
        DELETE FROM empresas
        WHERE id = $1
        RETURNING *
        `,
        [id]
    );


    // Se nenhuma empresa foi encontrada
    // com aquele ID, retorna null.
    if (resultado.rows.length === 0) {
        return null;
    }


    // Retorna a empresa que foi excluída.
    return resultado.rows[0];
}


// Exporta as funções para que o Controller
// possa utilizá-las.
export {
    criarEmpresa,
    listarEmpresas,
    buscarEmpresaPorId,
    buscarEmpresaPorDocumento,
    atualizarEmpresa,
    excluirEmpresa
};

