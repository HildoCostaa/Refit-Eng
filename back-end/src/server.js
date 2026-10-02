import app from "./app.js";
import pool from "./database/database.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
    console.log(`Servidor iniciado em http://localhost:${PORT}`);

    try {
        const result = await pool.query("SELECT NOW()");
        console.log("Banco de dados conectado!");
        console.log("Data/hora do PostgreSQL:", result.rows[0].now);
    } catch (error) {
        console.error("Erro ao conectar ao banco de dados:");
        console.error(error.message);
    }
});