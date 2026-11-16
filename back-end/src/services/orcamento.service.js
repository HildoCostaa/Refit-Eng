
import pool from "../database/database.js";


// ============================================
// CRIAR ORÇAMENTO COM SEUS ITENS
// ============================================

export async function criarOrcamento(dadosOrcamento) {
    const conexao = await pool.connect();

    try {
        await conexao.query("BEGIN");

        const {
            empresaId,
            clienteId,
            titulo,
            descricao,
            validade,
            observacoes,
            itens
        } = dadosOrcamento;


        // VERIFICAR SE O CLIENTE EXISTE,
        // PERTENCE À EMPRESA E ESTÁ ATIVO.
        const cliente = await conexao.query(
            `SELECT id
             FROM clientes
             WHERE id = $1
             AND empresa_id = $2
             AND status = 'ATIVO'`,
            [clienteId, empresaId]
        );

        if (cliente.rows.length === 0) {
            const erro = new Error(
                "Cliente não encontrado ou está inativo."
            );

            erro.code = "CLIENTE_INVALIDO";

            throw erro;
        }


        // CADASTRAR O ORÇAMENTO
        const resultadoOrcamento = await conexao.query(
            `INSERT INTO orcamentos (
                empresa_id,
                cliente_id,
                titulo,
                descricao,
                validade,
                observacoes
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *`,
            [
                empresaId,
                clienteId,
                titulo,
                descricao,
                validade,
                observacoes
            ]
        );

        const orcamento = resultadoOrcamento.rows[0];


        // CADASTRAR OS ITENS DO ORÇAMENTO
        for (const item of itens) {
            await conexao.query(
                `INSERT INTO orcamento_itens (
                    empresa_id,
                    orcamento_id,
                    tipo_item,
                    descricao,
                    unidade,
                    quantidade,
                    valor_unitario
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                [
                    empresaId,
                    orcamento.id,
                    item.tipoItem,
                    item.descricao,
                    item.unidade,
                    item.quantidade,
                    item.valorUnitario
                ]
            );
        }


        // CONFIRMAR TODAS AS OPERAÇÕES
        await conexao.query("COMMIT");

        return orcamento;

    } catch (erro) {

        // CANCELAR TODAS AS OPERAÇÕES
        // CASO ALGUMA DELAS APRESENTE ERRO.
        await conexao.query("ROLLBACK");

        throw erro;

    } finally {

        // DEVOLVER A CONEXÃO AO POOL.
        conexao.release();
    }
}


// ============================================
// LISTAR ORÇAMENTOS DA EMPRESA
// ============================================



export async function listarOrcamentos(
    empresaId,
    usuarioId,
    perfil
) {
    const resultado = await pool.query(
        `SELECT
            o.id,
            o.empresa_id,
            o.cliente_id,
            c.nome AS cliente_nome,
            o.titulo,
            o.descricao,
            o.status,
            o.validade,
            o.observacoes,
            o.criado_em,
            COALESCE(SUM(oi.subtotal), 0) AS valor_total

         FROM orcamentos o

         INNER JOIN clientes c
            ON c.id = o.cliente_id
            AND c.empresa_id = o.empresa_id

         LEFT JOIN orcamento_itens oi
            ON oi.orcamento_id = o.id
            AND oi.empresa_id = o.empresa_id

         WHERE o.empresa_id = $1

         AND (
            -- Administrador visualiza todos os orçamentos da empresa.
            $3 = 'ADMIN_EMPRESA'

            OR

            -- Colaborador precisa ter convite ativo
            -- e continuar ativo com o perfil correto.
            EXISTS (
                SELECT 1
                FROM orcamento_colaboradores oc

                INNER JOIN usuarios u
                    ON u.id = oc.usuario_id
                    AND u.empresa_id = oc.empresa_id

                WHERE oc.empresa_id = o.empresa_id
                AND oc.orcamento_id = o.id
                AND oc.usuario_id = $2
                AND oc.status = 'ATIVO'
                AND u.status = 'ATIVO'
                AND u.perfil = 'COLABORADOR'
            )
         )

         GROUP BY o.id, c.nome
         ORDER BY o.criado_em DESC`,
        [empresaId, usuarioId, perfil]
    );

    return resultado.rows;
}




// ============================================
// BUSCAR ORÇAMENTO POR ID
// ============================================

export async function buscarOrcamentoPorId(id, empresaId) {

    // BUSCAR DADOS GERAIS DO ORÇAMENTO
    const resultadoOrcamento = await pool.query(
        `SELECT
            o.id,
            o.empresa_id,
            o.cliente_id,
            c.nome AS cliente_nome,
            o.titulo,
            o.descricao,
            o.status,
            o.validade,
            o.observacoes,
            o.criado_em,
            o.atualizado_em

         FROM orcamentos o

         INNER JOIN clientes c
            ON c.id = o.cliente_id
            AND c.empresa_id = o.empresa_id

         WHERE o.id = $1
         AND o.empresa_id = $2`,
        [id, empresaId]
    );

    if (resultadoOrcamento.rows.length === 0) {
        return null;
    }

    const orcamento = resultadoOrcamento.rows[0];


    // BUSCAR OS ITENS DO ORÇAMENTO
    const resultadoItens = await pool.query(
        `SELECT
            id,
            tipo_item,
            descricao,
            unidade,
            quantidade,
            valor_unitario,
            subtotal

         FROM orcamento_itens

         WHERE orcamento_id = $1
         AND empresa_id = $2

         ORDER BY id ASC`,
        [id, empresaId]
    );


    // CALCULAR O VALOR TOTAL
    const valorTotal = resultadoItens.rows.reduce(
        (total, item) => total + Number(item.subtotal),
        0
    );

    return {
        ...orcamento,
        itens: resultadoItens.rows,
        valor_total: valorTotal
    };
}


 // ATUALIZAR ORÇAMENTO E SEUS ITENS
export async function atualizarOrcamento(id, empresaId, dados) {
    const conexao = await pool.connect();

    try {
        await conexao.query("BEGIN");

        // 1. Localiza e bloqueia o orçamento durante a alteração.
        const resultado = await conexao.query(
            `SELECT id, status
             FROM orcamentos
             WHERE id = $1
             AND empresa_id = $2
             FOR UPDATE`,
            [id, empresaId]
        );

        if (resultado.rows.length === 0) {
            const erro = new Error("Orçamento não encontrado.");
            erro.code = "ORCAMENTO_NAO_ENCONTRADO";
            throw erro;
        }

        // 2. Somente orçamentos em elaboração podem ser editados.
        if (resultado.rows[0].status !== "EM_ELABORACAO") {
            const erro = new Error(
                "Este orçamento não pode mais ser editado."
            );
            erro.code = "ORCAMENTO_NAO_EDITAVEL";
            throw erro;
        }

        // 3. Identifica os itens existentes enviados na atualização.
        const idsInformados = dados.itens
            .filter(item => item.id !== undefined && item.id !== null)
            .map(item => item.id);

        // 4. Impede IDs repetidos na mesma requisição.
        if (new Set(idsInformados).size !== idsInformados.length) {
            const erro = new Error("Existem itens repetidos na atualização.");
            erro.code = "ITENS_DUPLICADOS";
            throw erro;
        }

        // 5. Confere se todos os itens informados pertencem
        // realmente a este orçamento e empresa.
        if (idsInformados.length > 0) {
            const itensExistentes = await conexao.query(
                `SELECT id
                 FROM orcamento_itens
                 WHERE empresa_id = $1
                 AND orcamento_id = $2
                 AND id = ANY($3::integer[])`,
                [empresaId, id, idsInformados]
            );

            if (itensExistentes.rows.length !== idsInformados.length) {
                const erro = new Error(
                    "Um ou mais itens não pertencem a este orçamento."
                );
                erro.code = "ITEM_INVALIDO";
                throw erro;
            }
        }

        // 6. Atualiza os dados principais do orçamento.
        await conexao.query(
            `UPDATE orcamentos
             SET titulo = $1,
                 descricao = $2,
                 validade = $3,
                 observacoes = $4,
                 atualizado_em = CURRENT_TIMESTAMP
             WHERE id = $5
             AND empresa_id = $6`,
            [
                dados.titulo,
                dados.descricao,
                dados.validade,
                dados.observacoes,
                id,
                empresaId
            ]
        );

        // 7. Remove os itens que não foram enviados
        // na lista atualizada.
        await conexao.query(
            `DELETE FROM orcamento_itens
             WHERE empresa_id = $1
             AND orcamento_id = $2
             AND NOT (id = ANY($3::integer[]))`,
            [empresaId, id, idsInformados]
        );

        // 8. Atualiza os itens existentes e cadastra os novos.
        for (const item of dados.itens) {
            if (item.id) {
                await conexao.query(
                    `UPDATE orcamento_itens
                     SET tipo_item = $1,
                         descricao = $2,
                         unidade = $3,
                         quantidade = $4,
                         valor_unitario = $5,
                         atualizado_em = CURRENT_TIMESTAMP
                     WHERE id = $6
                     AND orcamento_id = $7
                     AND empresa_id = $8`,
                    [
                        item.tipoItem,
                        item.descricao,
                        item.unidade,
                        item.quantidade,
                        item.valorUnitario,
                        item.id,
                        id,
                        empresaId
                    ]
                );
            } else {
                await conexao.query(
                    `INSERT INTO orcamento_itens (
                        empresa_id,
                        orcamento_id,
                        tipo_item,
                        descricao,
                        unidade,
                        quantidade,
                        valor_unitario
                    )
                    VALUES ($1, $2, $3, $4, $5, $6, $7)`,
                    [
                        empresaId,
                        id,
                        item.tipoItem,
                        item.descricao,
                        item.unidade,
                        item.quantidade,
                        item.valorUnitario
                    ]
                );
            }
        }

        await conexao.query("COMMIT");

        return { id, atualizado: true };

    } catch (erro) {
        try {
            await conexao.query("ROLLBACK");
        } catch {
            // Preserva o erro original.
        }

        throw erro;

    } finally {
        conexao.release();
    }
}


 // ALTERAR STATUS DO ORÇAMENTO
async function alterarStatusOrcamento(
    id,
    empresaId,
    statusAtual,
    novoStatus
) {
    const conexao = await pool.connect();

    try {
        await conexao.query("BEGIN");

        // Localiza e bloqueia o orçamento durante a operação.
        const resultado = await conexao.query(
            `SELECT id, status
             FROM orcamentos
             WHERE id = $1
             AND empresa_id = $2
             FOR UPDATE`,
            [id, empresaId]
        );

        if (resultado.rows.length === 0) {
            const erro = new Error("Orçamento não encontrado.");
            erro.code = "ORCAMENTO_NAO_ENCONTRADO";
            throw erro;
        }

        const orcamento = resultado.rows[0];

        // Confere se o orçamento está no status esperado.
        if (orcamento.status !== statusAtual) {
            const erro = new Error(
                `Não é possível realizar esta operação. Status atual: ${orcamento.status}.`
            );
            erro.code = "STATUS_INVALIDO";
            throw erro;
        }

        // Antes de aprovar, verifica se existem itens cadastrados.
        if (novoStatus === "APROVADO") {
            const itens = await conexao.query(
                `SELECT EXISTS (
                    SELECT 1
                    FROM orcamento_itens
                    WHERE orcamento_id = $1
                    AND empresa_id = $2
                ) AS possui_itens`,
                [id, empresaId]
            );

            if (!itens.rows[0].possui_itens) {
                const erro = new Error(
                    "Não é possível aprovar um orçamento sem itens."
                );
                erro.code = "ORCAMENTO_SEM_ITENS";
                throw erro;
            }
        }

        // Atualiza o status.
        const atualizado = await conexao.query(
            `UPDATE orcamentos
             SET status = $1,
                 atualizado_em = CURRENT_TIMESTAMP
             WHERE id = $2
             AND empresa_id = $3
             RETURNING id, status, atualizado_em`,
            [novoStatus, id, empresaId]
        );

        await conexao.query("COMMIT");

        return atualizado.rows[0];

    } catch (erro) {
        try {
            await conexao.query("ROLLBACK");
        } catch {
            // Preserva o erro original.
        }

        throw erro;

    } finally {
        conexao.release();
    }
}


// APROVAR ORÇAMENTO
export async function aprovarOrcamento(id, empresaId) {
    return alterarStatusOrcamento(
        id,
        empresaId,
        "EM_ELABORACAO",
        "APROVADO"
    );
}


// RECUSAR ORÇAMENTO
export async function recusarOrcamento(id, empresaId) {
    return alterarStatusOrcamento(
        id,
        empresaId,
        "EM_ELABORACAO",
        "RECUSADO"
    );
}


// REGISTRAR ENVIO AO CLIENTE
export async function enviarOrcamento(id, empresaId) {
    return alterarStatusOrcamento(
        id,
        empresaId,
        "APROVADO",
        "ENVIADO"
    );
}

