
// Importa as funções responsáveis pelas operações
// relacionadas às empresas.
import {
    criarEmpresa,
    listarEmpresas,
    buscarEmpresaPorId,
    buscarEmpresaPorDocumento,
    atualizarEmpresa,
    excluirEmpresa
} from "../services/empresa.service.js";


// ============================================================
// CRIAR EMPRESA
// ============================================================

async function criar(req, res) {

    try {

        // Pega os dados enviados pelo usuário
        // no corpo da requisição.
        const dadosEmpresa = req.body;


        // ====================================================
        // VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
        // ====================================================

        // Verifica se algum dos campos obrigatórios
        // não foi informado ou está vazio.
        if (
            !dadosEmpresa.nome ||
            !dadosEmpresa.telefone ||
            !dadosEmpresa.documento ||
            !dadosEmpresa.endereco ||
            !dadosEmpresa.email
        ) {

            return res.status(400).json({
                erro: "Nome, telefone, documento, endereço e email são obrigatórios."
            });
        }


        // ====================================================
        // VERIFICAÇÃO DE DOCUMENTO DUPLICADO
        // ====================================================

        // Procura no banco se já existe uma empresa
        // utilizando o documento informado.
        const empresaExistente =
            await buscarEmpresaPorDocumento(
                dadosEmpresa.documento
            );


        // Se encontrou uma empresa com o mesmo documento,
        // não permite o cadastro.
        if (empresaExistente !== null) {

            return res.status(409).json({
                erro: "O CPF/CNPJ informado já está cadastrado."
            });
        }


        // Envia os dados para o Service somente
        // depois que todas as validações foram aprovadas.
        const empresa = await criarEmpresa(dadosEmpresa);


        // Retorna a empresa criada.
        return res.status(201).json(empresa);

    } catch (error) {

        console.error("Erro ao criar empresa:");
        console.error(error.message);

        return res.status(500).json({
            erro: "Não foi possível criar a empresa."
        });
    }
}


// ============================================================
// LISTAR EMPRESAS
// ============================================================

async function listar(req, res) {

    try {

        const empresas = await listarEmpresas();

        return res.status(200).json(empresas);

    } catch (error) {

        console.error("Erro ao listar empresas:");
        console.error(error.message);

        return res.status(500).json({
            erro: "Não foi possível listar as empresas."
        });
    }
}


// ============================================================
// BUSCAR EMPRESA POR ID
// ============================================================

async function buscarPorId(req, res) {

    try {

        // Pega o ID informado na URL.
        const { id } = req.params;


        // Envia o ID para o Service.
        const empresa = await buscarEmpresaPorId(id);


        // Se o Service retornar null,
        // significa que a empresa não existe.
        if (empresa === null) {

            return res.status(404).json({
                erro: "Empresa não encontrada."
            });
        }


        // Empresa encontrada.
        return res.status(200).json(empresa);

    } catch (error) {

        console.error("Erro ao buscar empresa:");
        console.error(error.message);

        return res.status(500).json({
            erro: "Não foi possível buscar a empresa."
        });
    }
}


// ============================================================
// ATUALIZAR EMPRESA
// ============================================================

async function atualizar(req, res) {

    try {

        // Pega o ID da empresa diretamente da URL.
        const { id } = req.params;


        // Pega os novos dados enviados
        // no corpo da requisição.
        const dadosEmpresa = req.body;


        // ====================================================
        // VALIDAÇÃO DOS CAMPOS OBRIGATÓRIOS
        // ====================================================

        if (
            !dadosEmpresa.nome ||
            !dadosEmpresa.telefone ||
            !dadosEmpresa.documento ||
            !dadosEmpresa.endereco ||
            !dadosEmpresa.email
        ) {

            return res.status(400).json({
                erro: "Nome, telefone, documento, endereço e email são obrigatórios."
            });
        }


        // ====================================================
        // VERIFICAÇÃO DE DOCUMENTO DUPLICADO
        // ====================================================

        // Procura se outra empresa já utiliza
        // o documento informado.
        const empresaExistente =
            await buscarEmpresaPorDocumento(
                dadosEmpresa.documento
            );


        // Se encontrou uma empresa e ela possui
        // um ID diferente da empresa que estamos atualizando,
        // significa que o documento pertence a outra empresa.
        if (
            empresaExistente !== null &&
            empresaExistente.id !== Number(id)
        ) {

            return res.status(409).json({
                erro: "O CPF/CNPJ informado já está cadastrado em outra empresa."
            });
        }


        // Envia o ID e os novos dados
        // para o Service.
        const empresa = await atualizarEmpresa(
            id,
            dadosEmpresa
        );


        // Se o Service retornar null,
        // significa que a empresa não existe.
        if (empresa === null) {

            return res.status(404).json({
                erro: "Empresa não encontrada."
            });
        }


        // Empresa encontrada e atualizada
        // com sucesso.
        return res.status(200).json(empresa);

    } catch (error) {

        console.error("Erro ao atualizar empresa:");
        console.error(error.message);

        return res.status(500).json({
            erro: "Não foi possível atualizar a empresa."
        });
    }
}


// ============================================================
// EXCLUIR EMPRESA
// ============================================================

async function excluir(req, res) {

    try {

        // Pega o ID da empresa diretamente da URL.
        const { id } = req.params;


        // Envia o ID para o Service.
        const empresa = await excluirEmpresa(id);


        // Se o Service retornar null,
        // significa que nenhuma empresa
        // foi encontrada com aquele ID.
        if (empresa === null) {

            return res.status(404).json({
                erro: "Empresa não encontrada."
            });
        }


        // Empresa encontrada e excluída
        // com sucesso.
        return res.status(200).json({
            mensagem: "Empresa excluída com sucesso.",
            empresa
        });

    } catch (error) {

        console.error("Erro ao excluir empresa:");
        console.error(error.message);

        return res.status(500).json({
            erro: "Não foi possível excluir a empresa."
        });
    }
}


// Exporta as funções para as Routes.
export {
    criar,
    listar,
    buscarPorId,
    atualizar,
    excluir
};

