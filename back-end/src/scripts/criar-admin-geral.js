
import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import bcrypt from "bcrypt";
import pool from "../database/database.js";

const rl = readline.createInterface({ input, output });

async function criarAdminGeral() {
    try {
        // Impede que o script crie outro administrador geral
        // se já existir um cadastrado.
        const adminExistente = await pool.query(
            "SELECT id FROM usuarios WHERE perfil = $1 LIMIT 1",
            ["ADMIN_GERAL"]
        );

        if (adminExistente.rows.length > 0) {
            console.log("Já existe um administrador geral.");
            console.log("Nenhum usuário foi criado.");
            return;
        }

        // Solicita os dados no terminal.
        const nome = (
            await rl.question("Nome do administrador: ")
        ).trim();

        const email = (
            await rl.question("E-mail do administrador: ")
        ).trim().toLowerCase();

        // A senha é digitada no terminal, sem ser salva no código.
        const senha = await rl.question("Senha (mínimo 8 caracteres): ");

        // Valida os dados informados.
        if (!nome || !email || !senha) {
            console.log("Todos os campos são obrigatórios.");
            return;
        }

        const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formatoEmail.test(email)) {
            console.log("Informe um e-mail válido.");
            return;
        }

        if (senha.length < 8) {
            console.log("A senha deve possuir pelo menos 8 caracteres.");
            return;
        }

        // Transforma a senha em um hash antes de salvar no banco.
        const senhaHash = await bcrypt.hash(senha, 10);

        // Cria o administrador geral, sem vínculo com uma empresa.
        const resultado = await pool.query(
            `
            INSERT INTO usuarios (
                empresa_id,
                nome,
                email,
                senha_hash,
                perfil
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id, nome, email, perfil
            `,
            [null, nome, email, senhaHash, "ADMIN_GERAL"]
        );

        console.log("\nAdministrador geral criado com sucesso!");
        console.log(resultado.rows[0]);
    } catch (error) {
        console.error("Erro ao criar administrador geral:");
        console.error(error.message);
    } finally {
        rl.close();
        await pool.end();
    }
}

criarAdminGeral();
