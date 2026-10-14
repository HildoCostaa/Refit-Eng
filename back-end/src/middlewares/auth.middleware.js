
import jwt from "jsonwebtoken";
import pool from "../database/database.js";

// AUTENTICAÇÃO
async function autenticar(req, res, next) {
    try {
        // Busca o token no cabeçalho Authorization.
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({
                erro: "Token de acesso não informado."
            });
        }

        // Remove o prefixo "Bearer " e mantém apenas o token.
        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                erro: "Token de acesso não informado."
            });
        }

        if (!process.env.JWT_SECRET) {
            console.error("JWT_SECRET não configurada.");

            return res.status(500).json({
                erro: "Erro na configuração da autenticação."
            });
        }

        // Verifica a assinatura e a validade do token.
        const dadosToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Busca os dados atuais do usuário no banco.
        // Assim, não dependemos apenas das informações do token.
        const resultado = await pool.query(
            `
            SELECT id, nome, email, empresa_id, perfil, status
            FROM usuarios
            WHERE id = $1
            `,
            [dadosToken.sub]
        );

        if (resultado.rows.length === 0) {
            return res.status(401).json({
                erro: "Usuário não encontrado."
            });
        }

        const usuario = resultado.rows[0];

        // Bloqueia usuários inativos.
        if (usuario.status !== "ATIVO") {
            return res.status(403).json({
                erro: "Usuário inativo."
            });
        }

        // Disponibiliza os dados do usuário para a próxima etapa.
        req.usuario = {
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            empresa_id: usuario.empresa_id,
            perfil: usuario.perfil
        };

        // Permite que a requisição continue.
        next();
    } catch (error) {
        // Token expirado, inválido ou com assinatura incorreta.
        if (
            error.name === "JsonWebTokenError" ||
            error.name === "TokenExpiredError" ||
            error.name === "NotBeforeError"
        ) {
            return res.status(401).json({
                erro: "Token inválido ou expirado."
            });
        }

        console.error("Erro na autenticação:");
        console.error(error.message);

        return res.status(500).json({
            erro: "Não foi possível validar a autenticação."
        });
    }
}

// AUTORIZAÇÃO POR PERFIL
function exigirPerfil(...perfisPermitidos) {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                erro: "Autenticação necessária."
            });
        }

        if (!perfisPermitidos.includes(req.usuario.perfil)) {
            return res.status(403).json({
                erro: "Você não tem permissão para esta ação."
            });
        }

        next();
    };
}

export {
    autenticar,
    exigirPerfil
};
