
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    buscarUsuarioPorEmail
} from "../services/usuario.service.js";

// REALIZAR LOGIN
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        // Verifica se os campos foram informados.
        if (
            typeof email !== "string" ||
            typeof senha !== "string" ||
            !email.trim() ||
            !senha
        ) {
            return res.status(400).json({
                erro: "E-mail e senha são obrigatórios."
            });
        }

        // Normaliza o e-mail para evitar diferenças de maiúsculas.
        const emailNormalizado = email.trim().toLowerCase();

        // Busca o usuário no banco de dados.
        const usuario = await buscarUsuarioPorEmail(
            emailNormalizado
        );

        // Não informa se o e-mail ou a senha estão errados.
        if (!usuario) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        // Impede o login de usuários inativos.
        if (usuario.status !== "ATIVO") {
            return res.status(403).json({
                erro: "Este usuário está inativo."
            });
        }

        // Compara a senha informada com o hash do banco.
        const senhaValida = await bcrypt.compare(
            senha,
            usuario.senha_hash
        );

        if (!senhaValida) {
            return res.status(401).json({
                erro: "E-mail ou senha inválidos."
            });
        }

        // Confere se a chave secreta está configurada.
        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET não configurada.");

            return res.status(500).json({
                erro: "Erro na configuração da autenticação."
            });
        }

        // Gera o token de acesso do usuário.
        const token = jwt.sign(
            {
                empresa_id: usuario.empresa_id,
                perfil: usuario.perfil
            },
            process.env.JWT_SECRET,
            {
                subject: String(usuario.id),
                expiresIn: "1h"
            }
        );

        // Retorna o token e os dados públicos do usuário.
        return res.status(200).json({
            mensagem: "Login realizado com sucesso.",
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                empresa_id: usuario.empresa_id,
                perfil: usuario.perfil
            }
        });
    } catch (error) {
        console.error("Erro ao realizar login:");
        console.error(error.message);

        return res.status(500).json({
            erro: "Não foi possível realizar o login."
        });
    }
}

export { login };
