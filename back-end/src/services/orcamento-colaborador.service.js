
import pool from "../database/database.js";

// CONVIDAR COLABORADOR PARA UM ORÇAMENTO
export async function convidarColaborador(dados) {
    const conexao = await pool.connect();

    try {
        await conexao.query("BEGIN");

        const {
            empresaId,
            orcamentoId,
            usuarioId,
            convidadoPor
        } = dados;

        // 1. Verifica se o orçamento pertence à empresa.
        const orcamento = await conexao.query(
            `SELECT id
             FROM orcamentos
             WHERE id = $1
             AND empresa_id = $2
             FOR UPDATE`,
            [orcamentoId, empresaId]
        );

        if (orcamento.rows.length === 0) {
            const erro = new Error("Orçamento não encontrado.");
            erro.code = "ORCAMENTO_NAO_ENCONTRADO";
            throw erro;
        }

        // 2. Verifica se o usuário convidado é um colaborador
        // ativo da mesma empresa.
        const colaborador = await conexao.query(
            `SELECT id
             FROM usuarios
             WHERE id = $1
             AND empresa_id = $2
             AND perfil = 'COLABORADOR'
             AND status = 'ATIVO'
             FOR UPDATE`,
            [usuarioId, empresaId]
        );

        if (colaborador.rows.length === 0) {
            const erro = new Error(
                "Colaborador não encontrado, inativo ou não pertence à empresa."
            );
            erro.code = "COLABORADOR_INVALIDO";
            throw erro;
        }

        // 3. Verifica se quem está convidando é o
        // administrador ativo da mesma empresa.
        const administrador = await conexao.query(
            `SELECT id
             FROM usuarios
             WHERE id = $1
             AND empresa_id = $2
             AND perfil = 'ADMIN_EMPRESA'
             AND status = 'ATIVO'
             FOR UPDATE`,
            [convidadoPor, empresaId]
        );

        if (administrador.rows.length === 0) {
            const erro = new Error(
                "Somente o administrador da empresa pode convidar colaboradores."
            );
            erro.code = "ADMINISTRADOR_INVALIDO";
            throw erro;
        }

        // 4. Verifica se já existe um convite ativo.
        const conviteExistente = await conexao.query(
            `SELECT id
             FROM orcamento_colaboradores
             WHERE empresa_id = $1
             AND orcamento_id = $2
             AND usuario_id = $3
             AND status = 'ATIVO'`,
            [empresaId, orcamentoId, usuarioId]
        );

        if (conviteExistente.rows.length > 0) {
            const erro = new Error(
                "Este colaborador já possui acesso a este orçamento."
            );
            erro.code = "CONVITE_EXISTENTE";
            throw erro;
        }

        // 5. Registra o convite.
        const resultado = await conexao.query(
            `INSERT INTO orcamento_colaboradores (
                empresa_id,
                orcamento_id,
                usuario_id,
                convidado_por
             )
             VALUES ($1, $2, $3, $4)
             RETURNING id, empresa_id, orcamento_id,
                       usuario_id, convidado_por, status, criado_em`,
            [empresaId, orcamentoId, usuarioId, convidadoPor]
        );

        await conexao.query("COMMIT");

        return resultado.rows[0];

    } catch (erro) {
        try {
            await conexao.query("ROLLBACK");
        } catch {
            // Preserva o erro original caso o rollback falhe.
        }

        // Proteção adicional contra convites duplicados
        // em operações simultâneas.
        if (erro.code === "23505") {
            const erroDuplicado = new Error(
                "Este colaborador já possui acesso a este orçamento."
            );
            erroDuplicado.code = "CONVITE_EXISTENTE";
            throw erroDuplicado;
        }

        throw erro;

    } finally {
        conexao.release();
    }
}


// LISTAR COLABORADORES DE UM ORÇAMENTO
export async function listarColaboradoresOrcamento(
    orcamentoId,
    empresaId
) {
    const resultado = await pool.query(
        `SELECT
            oc.id,
            oc.usuario_id,
            u.nome AS colaborador_nome,
            u.email AS colaborador_email,
            oc.convidado_por,
            a.nome AS administrador_nome,
            oc.status,
            oc.criado_em,
            oc.atualizado_em
         FROM orcamento_colaboradores oc

         INNER JOIN usuarios u
            ON u.id = oc.usuario_id
            AND u.empresa_id = oc.empresa_id

         INNER JOIN usuarios a
            ON a.id = oc.convidado_por
            AND a.empresa_id = oc.empresa_id

         WHERE oc.orcamento_id = $1
         AND oc.empresa_id = $2

         ORDER BY oc.criado_em DESC`,
        [orcamentoId, empresaId]
    );

    return resultado.rows;
}


// REVOGAR ACESSO DO COLABORADOR
export async function revogarAcessoColaborador(
    conviteId,
    orcamentoId,
    empresaId
) {
    const resultado = await pool.query(
        `UPDATE orcamento_colaboradores
         SET
            status = 'REVOGADO',
            atualizado_em = CURRENT_TIMESTAMP
         WHERE id = $1
         AND orcamento_id = $2
         AND empresa_id = $3
         AND status = 'ATIVO'
         RETURNING id, usuario_id, status`,
        [conviteId, orcamentoId, empresaId]
    );

    return resultado.rows[0] ?? null;
}


// VERIFICAR ACESSO AO ORÇAMENTO
export async function verificarAcessoOrcamento(
    usuarioId,
    empresaId,
    orcamentoId
) {
    const resultado = await pool.query(
        `SELECT EXISTS (
            SELECT 1
            FROM orcamentos o
            WHERE o.id = $1
            AND o.empresa_id = $2
            AND (
                -- Administrador ativo possui acesso
                -- aos orçamentos da própria empresa.
                EXISTS (
                    SELECT 1
                    FROM usuarios u
                    WHERE u.id = $3
                    AND u.empresa_id = $2
                    AND u.perfil = 'ADMIN_EMPRESA'
                    AND u.status = 'ATIVO'
                )

                OR

                -- Colaborador precisa ter convite ativo.
                EXISTS (
                    SELECT 1
                    FROM orcamento_colaboradores oc
                    INNER JOIN usuarios u
                        ON u.id = oc.usuario_id
                        AND u.empresa_id = oc.empresa_id
                    WHERE oc.orcamento_id = o.id
                    AND oc.empresa_id = o.empresa_id
                    AND oc.usuario_id = $3
                    AND oc.status = 'ATIVO'
                    AND u.perfil = 'COLABORADOR'
                    AND u.status = 'ATIVO'
                )
            )
         ) AS possui_acesso`,
        [orcamentoId, empresaId, usuarioId]
    );

    return resultado.rows[0].possui_acesso;
}
