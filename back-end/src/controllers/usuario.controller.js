
import bcrypt from "bcrypt";

import {
    buscarUsuarioPorEmail,
    empresaExiste,
    buscarAdministradorEmpresa,
    criarUsuario,
    listarColaboradores,
    buscarColaboradorPorId,
    atualizarColaborador,
    desativarColaborador
} from "../services/usuario.service.js";

// VALIDAR NOME E E-MAIL
function validarNomeEmail(nome, email) {
    if (
        typeof nome !== "string" ||
        typeof email !== "string" ||
        !nome.trim() ||
        !email.trim()
    ) {
        return "Nome e e-mail são obrigatórios.";
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email.trim())) {
        return "Informe um e-mail válido.";
    }

    return null;
}

// VALIDAR DADOS DE CADASTRO
function validarDados(nome, email, senha) {
    const erro = validarNomeEmail(nome, email);

    if (erro) {
        return erro;
    }

    if (typeof senha !== "string" || senha.length < 8) {
        return "A senha deve possuir pelo menos 8 caracteres.";
    }

    return null;
}

// VALIDAR ID
function validarId(id) {
    const numero = Number(id);

    return Number.isInteger(numero) && numero > 0
        ? numero
        : null;
}

// CRIAR O PRIMEIRO ADMINISTRADOR DE UMA EMPRESA
async function criarAdministradorEmpresa(req, res) {
    try {
        const empresaId = validarId(req.params.empresaId);
        const { nome, email, senha } = req.body;

        if (empresaId === null) {
            return res.status(400).json({
                erro: "ID de empresa inválido."
            });
        }

        const erroValidacao = validarDados(nome, email, senha);

        if (erroValidacao) {
            return res.status(400).json({ erro: erroValidacao });
        }

        if (!(await empresaExiste(empresaId))) {
            return res.status(404).json({
                erro: "Empresa não encontrada."
            });
        }

        const administradorExistente =
            await buscarAdministradorEmpresa(empresaId);

        if (administradorExistente) {
            return res.status(409).json({
                erro: "Esta empresa já possui um administrador."
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        if (await buscarUsuarioPorEmail(emailNormalizado)) {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await criarUsuario({
            empresa_id: empresaId,
            nome: nome.trim(),
            email: emailNormalizado,
            senha_hash: senhaHash,
            perfil: "ADMIN_EMPRESA"
        });

        return res.status(201).json({
            mensagem: "Administrador da empresa criado com sucesso.",
            usuario
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado ou a empresa já possui administrador."
            });
        }

        console.error("Erro ao criar administrador:", error.message);

        return res.status(500).json({
            erro: "Não foi possível criar o administrador da empresa."
        });
    }
}

// CRIAR COLABORADOR NA PRÓPRIA EMPRESA
async function criarColaborador(req, res) {
    try {
        const { nome, email, senha } = req.body;

        const erroValidacao = validarDados(nome, email, senha);

        if (erroValidacao) {
            return res.status(400).json({ erro: erroValidacao });
        }

        const empresaId = req.empresaId ?? req.usuario?.empresa_id;

        if (!empresaId) {
            return res.status(403).json({
                erro: "Seu usuário não está vinculado a uma empresa."
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        if (await buscarUsuarioPorEmail(emailNormalizado)) {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10);

        const usuario = await criarUsuario({
            empresa_id: empresaId,
            nome: nome.trim(),
            email: emailNormalizado,
            senha_hash: senhaHash,
            perfil: "COLABORADOR"
        });

        return res.status(201).json({
            mensagem: "Colaborador criado com sucesso.",
            usuario
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        console.error("Erro ao criar colaborador:", error.message);

        return res.status(500).json({
            erro: "Não foi possível criar o colaborador."
        });
    }
}

// LISTAR COLABORADORES DA PRÓPRIA EMPRESA
async function listar(req, res) {
    try {
        const empresaId = req.empresaId ?? req.usuario?.empresa_id;

        if (!empresaId) {
            return res.status(403).json({
                erro: "Seu usuário não está vinculado a uma empresa."
            });
        }

        const colaboradores = await listarColaboradores(empresaId);

        return res.status(200).json(colaboradores);
    } catch (error) {
        console.error("Erro ao listar colaboradores:", error.message);

        return res.status(500).json({
            erro: "Não foi possível listar os colaboradores."
        });
    }
}

// CONSULTAR UM COLABORADOR DA PRÓPRIA EMPRESA
async function buscarPorId(req, res) {
    try {
        const id = validarId(req.params.id);
        const empresaId = req.empresaId ?? req.usuario?.empresa_id;

        if (id === null) {
            return res.status(400).json({
                erro: "ID de usuário inválido."
            });
        }

        if (!empresaId) {
            return res.status(403).json({
                erro: "Seu usuário não está vinculado a uma empresa."
            });
        }

        const colaborador = await buscarColaboradorPorId(id, empresaId);

        if (!colaborador) {
            return res.status(404).json({
                erro: "Colaborador não encontrado."
            });
        }

        return res.status(200).json(colaborador);
    } catch (error) {
        console.error("Erro ao buscar colaborador:", error.message);

        return res.status(500).json({
            erro: "Não foi possível buscar o colaborador."
        });
    }
}

// EDITAR NOME E E-MAIL DO COLABORADOR
async function atualizar(req, res) {
    try {
        const id = validarId(req.params.id);
        const empresaId = req.empresaId ?? req.usuario?.empresa_id;
        const { nome, email } = req.body;

        if (id === null) {
            return res.status(400).json({
                erro: "ID de usuário inválido."
            });
        }

        if (!empresaId) {
            return res.status(403).json({
                erro: "Seu usuário não está vinculado a uma empresa."
            });
        }

        const erroValidacao = validarNomeEmail(nome, email);

        if (erroValidacao) {
            return res.status(400).json({ erro: erroValidacao });
        }

        // Confirma que o colaborador pertence à empresa.
        const colaboradorExistente =
            await buscarColaboradorPorId(id, empresaId);

        if (!colaboradorExistente) {
            return res.status(404).json({
                erro: "Colaborador não encontrado."
            });
        }

        const emailNormalizado = email.trim().toLowerCase();
        const usuarioComEmail =
            await buscarUsuarioPorEmail(emailNormalizado);

        if (usuarioComEmail && Number(usuarioComEmail.id) !== id) {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        const colaborador = await atualizarColaborador(
            id,
            empresaId,
            {
                nome: nome.trim(),
                email: emailNormalizado
            }
        );

        if (!colaborador) {
            return res.status(404).json({
                erro: "Colaborador não encontrado."
            });
        }

        return res.status(200).json({
            mensagem: "Colaborador atualizado com sucesso.",
            usuario: colaborador
        });
    } catch (error) {
        if (error.code === "23505") {
            return res.status(409).json({
                erro: "Este e-mail já está cadastrado."
            });
        }

        console.error("Erro ao atualizar colaborador:", error.message);

        return res.status(500).json({
            erro: "Não foi possível atualizar o colaborador."
        });
    }
}

// DESATIVAR COLABORADOR
async function desativar(req, res) {
    try {
        const id = validarId(req.params.id);
        const empresaId = req.empresaId ?? req.usuario?.empresa_id;

        if (id === null) {
            return res.status(400).json({
                erro: "ID de usuário inválido."
            });
        }

        if (!empresaId) {
            return res.status(403).json({
                erro: "Seu usuário não está vinculado a uma empresa."
            });
        }

        const colaborador = await desativarColaborador(id, empresaId);

        if (!colaborador) {
            return res.status(404).json({
                erro: "Colaborador não encontrado ou já desativado."
            });
        }

        return res.status(200).json({
            mensagem: "Colaborador desativado com sucesso.",
            usuario: colaborador
        });
    } catch (error) {
        console.error("Erro ao desativar colaborador:", error.message);

        return res.status(500).json({
            erro: "Não foi possível desativar o colaborador."
        });
    }
}

export {
    criarAdministradorEmpresa,
    criarColaborador,
    listar,
    buscarPorId,
    atualizar,
    desativar
};
