
import {
    verificarAcessoOrcamento
} from "../services/orcamento-colaborador.service.js";

// VERIFICAR SE O USUÁRIO PODE ACESSAR O ORÇAMENTO
export async function exigirAcessoOrcamento(req, res, next) {
    try {
        const id = Number(req.params.id);

        // Verifica se o ID é um número inteiro positivo.
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                mensagem: "ID do orçamento inválido."
            });
        }

        // Empresa e usuário vêm do token autenticado.
        // Nunca confiamos em empresaId enviado pelo cliente.
        const empresaId = req.empresaId;
        const usuarioId = req.usuario.id;

        // Verifica se o usuário possui autorização.
        const possuiAcesso = await verificarAcessoOrcamento(
            usuarioId,
            empresaId,
            id
        );

        if (!possuiAcesso) {
            return res.status(404).json({
                mensagem: "Orçamento não encontrado."
            });
        }

        return next();

    } catch (erro) {
        console.error("Erro ao verificar acesso ao orçamento:", erro);

        return res.status(500).json({
            mensagem: "Erro interno ao verificar acesso ao orçamento."
        });
    }
}
