// Importa a aplicação Express que foi configurada no arquivo app.js.
import app from "./app.js";


// Define a porta onde o servidor será executado.
//
// Primeiro, o código procura uma variável PORT no arquivo .env.
//
// Caso PORT não exista, utiliza a porta 3000 como padrão.
const PORT = process.env.PORT || 3000;


// Inicia o servidor.
//
// O método listen() faz o Node.js começar a "escutar"
// requisições HTTP nessa porta.
app.listen(PORT, () => {

    // Exibe no terminal uma mensagem informando
    // que o servidor foi iniciado com sucesso.
    console.log(`Servidor iniciado em http://localhost:${PORT}`);

});

