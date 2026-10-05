
// Importa o Express.
import express from "express";

// Importa as rotas relacionadas às empresas.
import empresaRoutes from "./routes/empresa.routes.js";


// Cria a aplicação Express.
const app = express();


// ============================================================
// MIDDLEWARES
// ============================================================

// Permite que o Express consiga interpretar
// requisições que enviam dados em formato JSON.
//
// Sem isso, req.body não funcionaria corretamente
// quando enviarmos dados para cadastrar uma empresa.
app.use(express.json());


// ============================================================
// HEALTH CHECK
// ============================================================

// Rota utilizada para verificar se a API
// está funcionando corretamente.
app.get("/api/v1/health", (req, res) => {

    res.json({
        status: "ok"
    });

});


// ============================================================
// ROTAS DE EMPRESAS
// ============================================================

// Todas as rotas definidas dentro de empresaRoutes
// receberão o prefixo:
//
// /api/v1/empresas
//
// Como empresa.routes.js possui:
//
// router.post("/", criar)
//
// o endereço final será:
//
// POST /api/v1/empresas
app.use("/api/v1/empresas", empresaRoutes);


// Exporta a aplicação.
export default app;
