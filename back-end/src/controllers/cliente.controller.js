
import {
    criarCliente as criarClienteService,
    listarClientes,
    buscarClientePorId,
    atualizarCliente as atualizarClienteService,
    desativarCliente
} from "../services/cliente.service.js";


// NORMALIZAR CPF OU CNPJ
function normalizarDocumento(documento) {
    return String(documento ?? "").replace(/\D/g, "");
}


// VALIDAR CPF
function validarCPF(cpf) {
    if (!/^\d{11}$/.test(cpf)) return false;

    if (/^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;

    for (let i = 0; i < 9; i++) {
        soma += Number(cpf[i]) * (10 - i);
    }

    let resto = (soma * 10) % 11;
    let digito1 = resto === 10 ? 0 : resto;

    if (digito1 !== Number(cpf[9])) return false;

    soma = 0;

    for (let i = 0; i < 10; i++) {
        soma += Number(cpf[i]) * (11 - i);
    }

    resto = (soma * 10) % 11;
    let digito2 = resto === 10 ? 0 : resto;

    return digito2 === Number(cpf[10]);
}


// VALIDAR CNPJ
function validarCNPJ(cnpj) {
    if (!/^\d{14}$/.test(cnpj)) return false;

    if (/^(\d)\1{13}$/.test(cnpj)) return false;

    const calcularDigito = (base, pesos) => {
        let soma = 0;

        for (let i = 0; i < pesos.length; i++) {
            soma += Number(base[i]) * pesos[i];
        }

        const resto = soma % 11;

        return resto < 2 ? 0 : 11 - resto;
    };

    const primeiroDigito = calcularDigito(
        cnpj.substring(0, 12),
        [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    );

    if (primeiroDigito !== Number(cnpj[12])) return false;

    const segundoDigito = calcularDigito(
        cnpj.substring(0, 13),
        [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    );

    return segundoDigito === Number(cnpj[13]);
}


// VALIDAR DOCUMENTO CONFORME O TIPO DE PESSOA
function validarDocumento(tipoPessoa, documento) {
    if (tipoPessoa === "FISICA") {
        return validarCPF(documento);
    }

    if (tipoPessoa === "JURIDICA") {
        return validarCNPJ(documento);
    }

    return false;
}


// VALIDAR DADOS DO CLIENTE
function validarDadosCliente(dados) {
    const {
        tipoPessoa,
        nome,
        documento
    } = dados;

    if (
        !tipoPessoa ||
        !nome?.trim() ||
        !documento
    ) {
        return "Tipo de pessoa, nome e documento são obrigatórios.";
    }

    if (!["FISICA", "JURIDICA"].includes(tipoPessoa)) {
        return "Tipo de pessoa inválido. Utilize FISICA ou JURIDICA.";
    }

    const documentoNormalizado = normalizarDocumento(documento);

    if (!validarDocumento(tipoPessoa, documentoNormalizado)) {
        return "CPF ou CNPJ inválido.";
    }

    return null;
}


// CADASTRAR CLIENTE
export async function cadastrar(req, res) {
    try {
        const erro = validarDadosCliente(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        // Não recebemos empresaId do corpo da requisição.
        // Utilizamos a empresa do usuário autenticado.
        const empresaId = req.empresaId;

        const dadosCliente = {
            empresaId,
            tipoPessoa: req.body.tipoPessoa,
            nome: req.body.nome.trim(),
            nomeFantasia: req.body.nomeFantasia?.trim() || null,
            documento: normalizarDocumento(req.body.documento),
            email: req.body.email?.trim() || null,
            telefone: req.body.telefone?.trim() || null,
            endereco: req.body.endereco?.trim() || null,
            observacoes: req.body.observacoes?.trim() || null
        };

        const cliente = await criarClienteService(dadosCliente);

        return res.status(201).json(cliente);

    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(409).json({
                erro: "Já existe um cliente com esse CPF ou CNPJ nesta empresa."
            });
        }

        console.error("Erro ao cadastrar cliente:", erro);

        return res.status(500).json({
            erro: "Erro interno ao cadastrar cliente."
        });
    }
}


// LISTAR CLIENTES
export async function listar(req, res) {
    try {
        const clientes = await listarClientes(req.empresaId);

        return res.status(200).json(clientes);

    } catch (erro) {
        console.error("Erro ao listar clientes:", erro);

        return res.status(500).json({
            erro: "Erro interno ao listar clientes."
        });
    }
}


// BUSCAR CLIENTE POR ID
export async function buscarPorId(req, res) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                erro: "ID do cliente inválido."
            });
        }

        const cliente = await buscarClientePorId(id, req.empresaId);

        if (!cliente) {
            return res.status(404).json({
                erro: "Cliente não encontrado."
            });
        }

        return res.status(200).json(cliente);

    } catch (erro) {
        console.error("Erro ao buscar cliente:", erro);

        return res.status(500).json({
            erro: "Erro interno ao buscar cliente."
        });
    }
}


// ATUALIZAR CLIENTE
export async function atualizar(req, res) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                erro: "ID do cliente inválido."
            });
        }

        const erro = validarDadosCliente(req.body);

        if (erro) {
            return res.status(400).json({ erro });
        }

        const dadosCliente = {
            tipoPessoa: req.body.tipoPessoa,
            nome: req.body.nome.trim(),
            nomeFantasia: req.body.nomeFantasia?.trim() || null,
            documento: normalizarDocumento(req.body.documento),
            email: req.body.email?.trim() || null,
            telefone: req.body.telefone?.trim() || null,
            endereco: req.body.endereco?.trim() || null,
            observacoes: req.body.observacoes?.trim() || null
        };

        const cliente = await atualizarClienteService(
            id,
            req.empresaId,
            dadosCliente
        );

        if (!cliente) {
            return res.status(404).json({
                erro: "Cliente não encontrado ou está inativo."
            });
        }

        return res.status(200).json(cliente);

    } catch (erro) {
        if (erro.code === "23505") {
            return res.status(409).json({
                erro: "Já existe um cliente com esse CPF ou CNPJ nesta empresa."
            });
        }

        console.error("Erro ao atualizar cliente:", erro);

        return res.status(500).json({
            erro: "Erro interno ao atualizar cliente."
        });
    }
}


// DESATIVAR CLIENTE
export async function desativar(req, res) {
    try {
        const { id } = req.params;

        if (!/^\d+$/.test(id)) {
            return res.status(400).json({
                erro: "ID do cliente inválido."
            });
        }

        const cliente = await desativarCliente(id, req.empresaId);

        if (!cliente) {
            return res.status(404).json({
                erro: "Cliente não encontrado ou já está inativo."
            });
        }

        return res.status(200).json({
            mensagem: "Cliente desativado com sucesso.",
            cliente
        });

    } catch (erro) {
        console.error("Erro ao desativar cliente:", erro);

        return res.status(500).json({
            erro: "Erro interno ao desativar cliente."
        });
    }
}
