
// Importa a função responsável por cadastrar
// uma empresa no banco de dados.
import { criarEmpresa } from "../services/empresa.service.js";


// Função responsável por receber a requisição HTTP
// de criação de uma nova empresa.
async function criar(req, res) {

    try {

        // req.body contém os dados enviados pelo cliente
        // na requisição HTTP.
        //
        // Por exemplo:
        //
        // {
        //     nome: "Empresa Exemplo LTDA",
        //     email: "contato@empresa.com"
        // }
        const dadosEmpresa = req.body;


        // Envia os dados recebidos para o Service.
        //
        // O Service será responsável por conversar
        // com o PostgreSQL.
        const empresa = await criarEmpresa(dadosEmpresa);


        // Retorna uma resposta HTTP.
        //
        // 201 significa:
        // "Created" — recurso criado com sucesso.
        //
        // O segundo argumento é o objeto que será
        // transformado em JSON e enviado para o cliente.
        return res.status(201).json(empresa);

    } catch (error) {

        // Caso aconteça algum erro durante o processo,
        // mostramos o erro no terminal.
        console.error("Erro ao criar empresa:");
        console.error(error.message);


        // Retorna um erro HTTP 500.
        //
        // 500 significa:
        // "Internal Server Error"
        //
        // Ou seja, ocorreu um problema interno no servidor.
        return res.status(500).json({
            erro: "Não foi possível criar a empresa."
        });
    }
}


// Exporta a função para que ela possa
// ser utilizada pela rota de empresas.
export {
    criar
};

