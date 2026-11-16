
import {
    criarOrcamento as criarOrcamentoService,
    listarOrcamentos,
    buscarOrcamentoPorId,
    atualizarOrcamento,
    aprovarOrcamento,
    recusarOrcamento,
    enviarOrcamento
} from "../services/orcamento.service.js";


// ============================================
// VALIDAR DATA
// ============================================

function validarData(data) {

    // A data é opcional.
    // Se não for informada, consideramos válida.
    if (data === undefined || data === null || data === "") {
        return true;
    }

    // Garante que a data seja uma string.
    if (typeof data !== "string") {
        return false;
    }

    // Verifica o formato AAAA-MM-DD.
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        return false;
    }

    // Separa ano, mês e dia.
    const [ano, mes, dia] = data.split("-").map(Number);

    // Cria uma data para verificar se ela realmente existe.
    const dataVerificada = new Date(Date.UTC(ano, mes - 1, dia));

    return (
        dataVerificada.getUTCFullYear() === ano &&
        dataVerificada.getUTCMonth() === mes - 1 &&
        dataVerificada.getUTCDate() === dia
    );
}


// ============================================
// VALIDAR ITENS DO ORÇAMENTO
// ============================================



function validarItens(itens) {
    if (!Array.isArray(itens) || itens.length === 0) {
        return "O orçamento precisa ter pelo menos um item.";
    }

    for (const item of itens) {
        if (!item || typeof item !== "object" || Array.isArray(item)) {
            return "Existe um item com formato inválido.";
        }

        // Tipo do item.
        if (!["SERVICO", "MATERIAL"].includes(item.tipoItem)) {
            return "O tipo do item deve ser SERVICO ou MATERIAL.";
        }

        // Descrição.
        if (
            typeof item.descricao !== "string" ||
            item.descricao.trim() === ""
        ) {
            return "A descrição do item é obrigatória.";
        }

        // Unidade.
        if (
            typeof item.unidade !== "string" ||
            item.unidade.trim() === ""
        ) {
            return "A unidade do item é obrigatória.";
        }

        // Quantidade.
        if (
            item.quantidade === null ||
            item.quantidade === undefined ||
            item.quantidade === "" ||
            !Number.isFinite(Number(item.quantidade)) ||
            Number(item.quantidade) <= 0
        ) {
            return "A quantidade precisa ser maior que zero.";
        }

        // Valor unitário.
        if (
            item.valorUnitario === null ||
            item.valorUnitario === undefined ||
            item.valorUnitario === "" ||
            !Number.isFinite(Number(item.valorUnitario)) ||
            Number(item.valorUnitario) < 0
        ) {
            return "O valor unitário não pode ser negativo ou inválido.";
        }
    }

    // Retorna null quando todos os itens são válidos.
    return null;
}




// ============================================
// CADASTRAR ORÇAMENTO
// ============================================

export async function cadastrar(req, res) {
    try {
        const {
            clienteId,
            titulo,
            descricao,
            validade,
            observacoes,
            itens
        } = req.body;

        // VALIDAR CLIENTE
        if (
            clienteId === undefined ||
            clienteId === null ||
            !/^\d+$/.test(String(clienteId)) ||
            Number(clienteId) <= 0
        ) {
            return res.status(400).json({
                erro: "Informe um ID de cliente válido."
            });
        }

        // VALIDAR TÍTULO
        if (typeof titulo !== "string" || titulo.trim() === "") {
            return res.status(400).json({
                erro: "O título do orçamento é obrigatório."
            });
        }

        // Valida a descrição, caso seja informada.
        if (
            descricao !== undefined &&
            descricao !== null &&
            typeof descricao !== "string"
        ) {
            return res.status(400).json({
                erro: "A descrição precisa ser um texto válido."
            });
        }

        // Valida as observações, caso sejam informadas.
        if (
            observacoes !== undefined &&
            observacoes !== null &&
            typeof observacoes !== "string"
        ) {
            return res.status(400).json({
                erro: "As observações precisam ser um texto válido."
            });
        }

        // VALIDAR DATA DE VALIDADE
        if (!validarData(validade)) {
            return res.status(400).json({
                erro: "A data de validade é inválida. Utilize AAAA-MM-DD."
            });
        }

        // VALIDAR ITENS
        const erroItens = validarItens(itens);

        if (erroItens) {
            return res.status(400).json({
                erro: erroItens
            });
        }

        // MONTAR DADOS DO ORÇAMENTO
        const dadosOrcamento = {
            // Empresa obtida pelo middleware.
            // Nunca recebemos esse valor do JSON.
            empresaId: req.empresaId,

            clienteId: Number(clienteId),
            titulo: titulo.trim(),
            descricao: descricao?.trim() || null,
            validade: validade || null,
            observacoes: observacoes?.trim() || null,

            itens: itens.map(item => ({
                tipoItem: item.tipoItem,
                descricao: item.descricao.trim(),
                unidade: item.unidade.trim(),
                quantidade: Number(item.quantidade),
                valorUnitario: Number(item.valorUnitario)
            }))
        };

        const orcamento = await criarOrcamentoService(
            dadosOrcamento
        );

        return res.status(201).json({
            mensagem: "Orçamento cadastrado com sucesso.",
            orcamento
        });

    } catch (erro) {

        if (erro.code === "CLIENTE_INVALIDO") {
            return res.status(400).json({
                erro: erro.message
            });
        }

        console.error("Erro ao cadastrar orçamento:", erro);

        return res.status(500).json({
            erro: "Erro interno ao cadastrar orçamento."
        });
    }
}


// ============================================
// LISTAR ORÇAMENTOS
// ============================================


export async function listar(req, res) {
    try {
        const orcamentos = await listarOrcamentos(
            req.empresaId,
            req.usuario.id,
            req.usuario.perfil
        );

        return res.status(200).json({
            orcamentos
        });

    } catch (erro) {
        console.error("Erro ao listar orçamentos:", erro);

        return res.status(500).json({
            erro: "Erro interno ao listar orçamentos."
        });
    }
}


// ============================================
// BUSCAR ORÇAMENTO POR ID
// ============================================

export async function buscarPorId(req, res) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) <= 0) {
            return res.status(400).json({
                erro: "ID do orçamento inválido."
            });
        }

        const orcamento = await buscarOrcamentoPorId(
            Number(id),
            req.empresaId
        );

        if (!orcamento) {
            return res.status(404).json({
                erro: "Orçamento não encontrado."
            });
        }

        return res.status(200).json(orcamento);

    } catch (erro) {
        console.error("Erro ao buscar orçamento:", erro);

        return res.status(500).json({
            erro: "Erro interno ao buscar orçamento."
        });
    }
}


 // ATUALIZAR ORÇAMENTO
export async function atualizar(req, res) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id) || Number(id) <= 0) {
            return res.status(400).json({
                erro: "ID do orçamento inválido."
            });
        }

        const {
            titulo,
            descricao,
            validade,
            observacoes,
            itens
        } = req.body;

        // Validação dos dados principais.
        if (typeof titulo !== "string" || !titulo.trim()) {
            return res.status(400).json({
                erro: "O título do orçamento é obrigatório."
            });
        }

        if (!validarData(validade)) {
            return res.status(400).json({
                erro: "Data de validade inválida."
            });
        }

        const erroItens = validarItens(itens);

        if (erroItens) {
            return res.status(400).json({
                erro: erroItens
            });
        }

        // Valida os IDs dos itens existentes.
        for (const item of itens) {
            if (
                item.id !== undefined &&
                item.id !== null &&
                (!/^\d+$/.test(String(item.id)) || Number(item.id) <= 0)
            ) {
                return res.status(400).json({
                    erro: "ID de item inválido."
                });
            }
        }

        const dados = {
            titulo: titulo.trim(),
            descricao:
                typeof descricao === "string"
                    ? descricao.trim() || null
                    : null,
            validade: validade || null,
            observacoes:
                typeof observacoes === "string"
                    ? observacoes.trim() || null
                    : null,

            itens: itens.map(item => ({
                id: item.id ? Number(item.id) : undefined,
                tipoItem: item.tipoItem,
                descricao: item.descricao.trim(),
                unidade: item.unidade.trim(),
                quantidade: Number(item.quantidade),
                valorUnitario: Number(item.valorUnitario)
            }))
        };

        await atualizarOrcamento(
            Number(id),
            req.empresaId,
            dados
        );

        return res.status(200).json({
            mensagem: "Orçamento atualizado com sucesso."
        });

    } catch (erro) {
        if (erro.code === "ORCAMENTO_NAO_ENCONTRADO") {
            return res.status(404).json({
                erro: erro.message
            });
        }

        if (
            erro.code === "ORCAMENTO_NAO_EDITAVEL" ||
            erro.code === "ITEM_INVALIDO" ||
            erro.code === "ITENS_DUPLICADOS"
        ) {
            return res.status(400).json({
                erro: erro.message
            });
        }

        console.error("Erro ao atualizar orçamento:", erro);

        return res.status(500).json({
            erro: "Erro interno ao atualizar orçamento."
        });
    }
}


 // FUNÇÃO AUXILIAR PARA VALIDAR O ID
function validarIdOrcamento(id) {
    return /^\d+$/.test(String(id)) && Number(id) > 0;
}


// APROVAR ORÇAMENTO
export async function aprovar(req, res) {
    try {
        const { id } = req.params;

        if (!validarIdOrcamento(id)) {
            return res.status(400).json({
                erro: "ID do orçamento inválido."
            });
        }

        const orcamento = await aprovarOrcamento(
            Number(id),
            req.empresaId
        );

        return res.status(200).json({
            mensagem: "Orçamento aprovado com sucesso.",
            orcamento
        });

    } catch (erro) {
        if (erro.code === "ORCAMENTO_NAO_ENCONTRADO") {
            return res.status(404).json({
                erro: erro.message
            });
        }

        if (
            erro.code === "STATUS_INVALIDO" ||
            erro.code === "ORCAMENTO_SEM_ITENS"
        ) {
            return res.status(400).json({
                erro: erro.message
            });
        }

        console.error("Erro ao aprovar orçamento:", erro);

        return res.status(500).json({
            erro: "Erro interno ao aprovar orçamento."
        });
    }
}


// RECUSAR ORÇAMENTO
export async function recusar(req, res) {
    try {
        const { id } = req.params;

        if (!validarIdOrcamento(id)) {
            return res.status(400).json({
                erro: "ID do orçamento inválido."
            });
        }

        const orcamento = await recusarOrcamento(
            Number(id),
            req.empresaId
        );

        return res.status(200).json({
            mensagem: "Orçamento recusado com sucesso.",
            orcamento
        });

    } catch (erro) {
        if (erro.code === "ORCAMENTO_NAO_ENCONTRADO") {
            return res.status(404).json({
                erro: erro.message
            });
        }

        if (erro.code === "STATUS_INVALIDO") {
            return res.status(400).json({
                erro: erro.message
            });
        }

        console.error("Erro ao recusar orçamento:", erro);

        return res.status(500).json({
            erro: "Erro interno ao recusar orçamento."
        });
    }
}


// ENVIAR ORÇAMENTO AO CLIENTE
export async function enviar(req, res) {
    try {
        const { id } = req.params;

        if (!validarIdOrcamento(id)) {
            return res.status(400).json({
                erro: "ID do orçamento inválido."
            });
        }

        const orcamento = await enviarOrcamento(
            Number(id),
            req.empresaId
        );

        return res.status(200).json({
            mensagem: "Orçamento marcado como enviado ao cliente.",
            orcamento
        });

    } catch (erro) {
        if (erro.code === "ORCAMENTO_NAO_ENCONTRADO") {
            return res.status(404).json({
                erro: erro.message
            });
        }

        if (erro.code === "STATUS_INVALIDO") {
            return res.status(400).json({
                erro: erro.message
            });
        }

        console.error("Erro ao enviar orçamento:", erro);

        return res.status(500).json({
            erro: "Erro interno ao enviar orçamento."
        });
    }
}

