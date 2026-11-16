
import {
    convidarColaborador,
    listarColaboradoresOrcamento,
    revogarAcessoColaborador
} from "../services/orcamento-colaborador.service.js";


// VALIDAR IDENTIFICADORES
function validarId(id) {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
}


// CONVIDAR COLABORADOR
export async function convidar(req, res) {
    try {
        const { orcamentoId } = req.params;
        const { usuarioId } = req.body;

        // Verifica se o ID do orçamento é válido.
        if (!validarId(orcamentoId)) {
            return res.status(400).json({
                erro: "ID do orçamento inválido."
            });
        }

        // Verifica se o ID do colaborador é válido.
        if (!validarId(usuarioId)) {
            return res.status(400).json({
                erro: "Informe um ID de colaborador válido."
            });
        }

        // Os dados da empresa e do administrador
        // vêm do usuário autenticado, nunca do body.
        const dados = {
            empresaId: req.empresaId,
            orcamentoId: Number(orcamentoId),
            usuarioId: Number(usuarioId),
            convidadoPor: req.usuario.id
        };

        const convite = await convidarColaborador(dados);

        return res.status(201).json({
            mensagem: "Colaborador convidado com sucesso.",
            convite
        });

    } catch (erro) {
        if (erro.code === "ORCAMENTO_NAO_ENCONTRADO") {
            return res.status(404).json({
                erro: erro.message
            });
        }

        if (
            erro.code === "COLABORADOR_INVALIDO" ||
            erro.code === "ADMINISTRADOR_INVALIDO"
        ) {
            return res.status(400).json({
                erro: erro.message
            });
        }

        if (erro.code === "CONVITE_EXISTENTE") {
            return res.status(409).json({
                erro: erro.message
            });
        }

        console.error("Erro ao convidar colaborador:", erro);

        return res.status(500).json({
            erro: "Erro interno ao convidar colaborador."
        });
    }
}


// LISTAR COLABORADORES DO ORÇAMENTO
export async function listar(req, res) {
    try {
        const { orcamentoId } = req.params;

        if (!validarId(orcamentoId)) {
            return res.status(400).json({
                erro: "ID do orçamento inválido."
            });
        }

        const colaboradores = await listarColaboradoresOrcamento(
            Number(orcamentoId),
            req.empresaId
        );

        return res.status(200).json({
            colaboradores
        });

    } catch (erro) {
        console.error("Erro ao listar colaboradores:", erro);

        return res.status(500).json({
            erro: "Erro interno ao listar colaboradores."
        });
    }
}


// REVOGAR ACESSO DO COLABORADOR
export async function revogar(req, res) {
    try {
        const { orcamentoId, conviteId } = req.params;

        if (
            !validarId(orcamentoId) ||
            !validarId(conviteId)
        ) {
            return res.status(400).json({
                erro: "ID do orçamento ou convite inválido."
            });
        }

        const convite = await revogarAcessoColaborador(
            Number(conviteId),
            Number(orcamentoId),
            req.empresaId
        );

        if (!convite) {
            return res.status(404).json({
                erro: "Convite não encontrado ou já revogado."
            });
        }

        return res.status(200).json({
            mensagem: "Acesso do colaborador revogado com sucesso.",
            convite
        });

    } catch (erro) {
        console.error("Erro ao revogar acesso:", erro);

        return res.status(500).json({
            erro: "Erro interno ao revogar acesso."
        });
    }
}
