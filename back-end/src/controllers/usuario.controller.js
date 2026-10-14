
import bcrypt from "bcrypt";

import {
    buscarUsuarioPorEmail,
    empresaExiste,
    buscarAdministradorEmpresa,
    criarUsuario
} from "../services/usuario.service.js";

// VALIDAR DADOS BÁSICOS DO USUÁRIO
function validarDados(nome, email, senha) {
    if (
        typeof nome !== "string" ||
        typeof email !== "string" ||
        typeof senha !== "string" ||
        !nome.trim() ||
        !email.trim() ||
        !senha
    ) {
        return "Nome, e-mail e senha são obrigatórios.";
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email.trim())) {
        return "Informe um e-mail válido.";
    }

    if (senha.length < 8) {
        return "A senha deve possuir pelo menos 8 caracteres.";
    }

    return null;
}

// CRIAR O PRIMEIRO ADMINISTRADOR DE UMA EMPRESA
async function criarAdministradorEmpresa(req, res) {
    try {
        const empresaId = Number(req.params.empresaId);
        const { nome, email, senha } = req.body;

        if (!Number.isInteger(empresaId) || empresaId <= 0) {
            return res.status(400).json({
                erro: "ID de empresa inválido."
            });
        }

        const erroValidacao = validarDados(nome, email, senha);

        if (erroValidacao) {
            return res.status(400).json({
                erro: erroValidacao
            });
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

        console.error("Erro ao criar administrador da empresa:", error.message);

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
            return res.status(400).json({
                erro: erroValidacao
            });
        }

        // A empresa vem do usuário autenticado,
        // nunca do empresa_id enviado no corpo da requisição.
        const empresaId = req.usuario.empresa_id;

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

export {
    criarAdministradorEmpresa,
    criarColaborador
};
