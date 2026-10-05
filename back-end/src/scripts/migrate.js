
// Importa o módulo "fs" do Node.js.
// Ele permite ler arquivos e pastas do computador.
import fs from "fs";

// Importa o módulo "path" do Node.js.
// Ele ajuda a trabalhar com caminhos de arquivos e pastas.
import path from "path";

// Permite descobrir o caminho real do arquivo atual
// quando estamos utilizando ES Modules.
import { fileURLToPath } from "url";

// Importa a conexão com o PostgreSQL.
import pool from "../database/database.js";


// ============================================================
// 1. DESCOBRINDO O CAMINHO DO ARQUIVO ATUAL
// ============================================================

// __filename representa o caminho completo deste arquivo:
// backend/src/scripts/migrate.js

const __filename = fileURLToPath(import.meta.url);

// __dirname representa a pasta onde este arquivo está:
// backend/src/scripts
const __dirname = path.dirname(__filename);


// ============================================================
// 2. LOCALIZANDO A PASTA DE MIGRATIONS
// ============================================================

// A partir de:
// backend/src/scripts
//
// precisamos voltar até a raiz do projeto:
//
// backend/src/scripts
//       ↑
//      ..
// backend/src
//       ↑
//      ..
// backend
//       ↑
//      ..
// raiz do projeto
//
// Depois entramos em:
// database/migrations
//
// Resultado:
// database/migrations
const migrationsPath = path.resolve(
    __dirname,
    "../../../database/migrations"
);


// ============================================================
// 3. FUNÇÃO PRINCIPAL DA MIGRATION
// ============================================================

async function migrate() {

    try {

        console.log("=================================");
        console.log("Iniciando migrations...");
        console.log("=================================");


        // --------------------------------------------------------
        // 3.1 - LER OS ARQUIVOS DA PASTA DE MIGRATIONS
        // --------------------------------------------------------

        // Lê todos os arquivos existentes dentro de:
        // database/migrations
        const arquivos = fs.readdirSync(migrationsPath);


        // --------------------------------------------------------
        // 3.2 - PEGAR SOMENTE OS ARQUIVOS .SQL
        // --------------------------------------------------------

        // Queremos executar somente arquivos SQL.
        //
        // Também usamos .sort() para garantir que eles sejam
        // executados na ordem:
        //
        // 001_criar_empresas.sql
        // 002_criar_usuarios.sql
        // 003_criar_obras.sql
        //
        // Dessa forma, as migrations seguem uma sequência.
        const migrations = arquivos
            .filter(arquivo => arquivo.endsWith(".sql"))
            .sort();


        // --------------------------------------------------------
        // 3.3 - EXECUTAR CADA MIGRATION
        // --------------------------------------------------------

        // Percorremos cada arquivo SQL encontrado.
        for (const migration of migrations) {

            console.log(`\nVerificando: ${migration}`);


            // ----------------------------------------------------
            // 3.4 - VERIFICAR SE JÁ FOI EXECUTADA
            // ----------------------------------------------------

            // Consultamos a tabela "migrations".
            //
            // O $1 será substituído pelo nome do arquivo.
            //
            // Exemplo:
            //
            // SELECT id
            // FROM migrations
            // WHERE nome = '001_criar_empresas.sql'
            const resultado = await pool.query(
                `
                SELECT id
                FROM migrations
                WHERE nome = $1
                `,
                [migration]
            );


            // ----------------------------------------------------
            // 3.5 - SE JÁ FOI EXECUTADA, NÃO EXECUTA NOVAMENTE
            // ----------------------------------------------------

            if (resultado.rows.length > 0) {

                console.log(`Já executada: ${migration}`);

                // "continue" faz o programa pular para a
                // próxima migration.
                continue;
            }


            // ----------------------------------------------------
            // 3.6 - INFORMAR QUAL MIGRATION SERÁ EXECUTADA
            // ----------------------------------------------------

            console.log(`Executando: ${migration}`);


            // ----------------------------------------------------
            // 3.7 - LER O CONTEÚDO DO ARQUIVO SQL
            // ----------------------------------------------------

            // Monta o caminho completo do arquivo.
            //
            // Exemplo:
            //
            // C:\...\gestao-obras\database\migrations\
            // 001_criar_empresas.sql
            const caminhoArquivo = path.join(
                migrationsPath,
                migration
            );


            // Lê o conteúdo do arquivo SQL.
            //
            // O "utf8" garante que o conteúdo seja interpretado
            // corretamente como texto.
            const sql = fs.readFileSync(
                caminhoArquivo,
                "utf8"
            );


            // ----------------------------------------------------
            // 3.8 - INICIAR UMA TRANSAÇÃO
            // ----------------------------------------------------

            // BEGIN inicia uma transação no PostgreSQL.
            //
            // Isso é importante porque queremos que:
            //
            // 1. O SQL seja executado.
            // 2. A migration seja registrada.
            //
            // Se alguma coisa der errado, podemos desfazer
            // tudo com ROLLBACK.
            await pool.query("BEGIN");


            try {

                // ------------------------------------------------
                // 3.9 - EXECUTAR O SQL DA MIGRATION
                // ------------------------------------------------

                await pool.query(sql);


                // ------------------------------------------------
                // 3.10 - REGISTRAR A MIGRATION COMO EXECUTADA
                // ------------------------------------------------

                // Depois que o SQL funcionou, registramos o nome
                // do arquivo na tabela "migrations".
                await pool.query(
                    `
                    INSERT INTO migrations (nome)
                    VALUES ($1)
                    `,
                    [migration]
                );


                // ------------------------------------------------
                // 3.11 - CONFIRMAR A TRANSAÇÃO
                // ------------------------------------------------

                // COMMIT confirma definitivamente as alterações.
                await pool.query("COMMIT");

                console.log(`Concluída: ${migration}`);

            } catch (error) {

                // ------------------------------------------------
                // 3.12 - DESFAZER SE ALGO DER ERRADO
                // ------------------------------------------------

                // Se o SQL apresentar algum erro, desfazemos
                // todas as alterações feitas dentro da transação.
                await pool.query("ROLLBACK");

                // Envia o erro para o bloco catch externo.
                throw error;
            }
        }


        // ========================================================
        // 4. FINALIZAÇÃO
        // ========================================================

        console.log("\n=================================");
        console.log("Migrations concluídas!");
        console.log("=================================");


    } catch (error) {

        // ========================================================
        // 5. TRATAMENTO DE ERROS
        // ========================================================

        console.error("\n=================================");
        console.error("Erro ao executar migrations:");
        console.error("=================================");

        // Mostra somente a mensagem do erro.
        console.error(error.message);

        // Indica ao Node.js que o programa terminou com erro.
        process.exitCode = 1;


    } finally {

        // ========================================================
        // 6. ENCERRAR A CONEXÃO COM O BANCO
        // ========================================================

        // Fecha o Pool de conexões do PostgreSQL.
        //
        // Isso é importante porque o script de migration
        // terminou e não precisa mais manter a conexão aberta.
        await pool.end();
    }
}


// ============================================================
// 7. EXECUTAR A FUNÇÃO
// ============================================================

// Chamamos a função migrate() para iniciar todo o processo.
migrate();

