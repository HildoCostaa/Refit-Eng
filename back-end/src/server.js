import app from "./app.js";

// Verifica se a chave JWT está configurada
// e possui pelo menos 32 bytes.
if (
    !process.env.JWT_SECRET ||
    Buffer.byteLength(process.env.JWT_SECRET, "utf8") < 32
) {
    console.error(
        "Erro: JWT_SECRET não configurada ou possui menos de 32 bytes."
    );

    process.exit(1);
}

// Define a porta do servidor
const PORT = process.env.PORT || 3000;

// Inicia a aplicação
app.listen(PORT, () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);
});