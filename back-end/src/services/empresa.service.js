
// Importa o pool de conexão com o PostgreSQL.
//
// É através dele que nosso sistema poderá executar
// comandos SQL no banco de dados.
import pool from "../database/database.js";


// Função responsável por cadastrar uma nova empresa.
//
// Ela recebe um objeto contendo os dados da empresa.
async function criarEmpresa(dadosEmpresa) {

    // Executa o comando SQL no PostgreSQL.
    //
    // O $1, $2, $3... são parâmetros que receberão
    // os valores enviados no segundo argumento do pool.query().
    //
    // Isso é importante para evitar problemas de segurança
    // como SQL Injection.
    const resultado = await pool.query(
        `
        INSERT INTO empresas (
            nome,
            nome_fantasia,
            documento,
            email,
            telefone,
            endereco,
            chave_pix
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
        `,
        [
            dadosEmpresa.nome,
            dadosEmpresa.nome_fantasia,
            dadosEmpresa.documento,
            dadosEmpresa.email,
            dadosEmpresa.telefone,
            dadosEmpresa.endereco,
            dadosEmpresa.chave_pix
        ]
    );

    // O PostgreSQL retorna as linhas afetadas
    // dentro de resultado.rows.
    //
    // Como cadastramos apenas uma empresa,
    // pegamos a primeira linha.
    return resultado.rows[0];
}
// Exporta a função para que o Controller
// possa utilizá-la.
export {
    criarEmpresa
};

