
// Importa o Express.
import express from "express";

// Importa as rotas relacionadas às empresas.
import empresaRoutes from "./routes/empresa.routes.js";

// Importa as rotas relacionadas à autenticação.
import authRoutes from "./routes/auth.routes.js";

// Importa as rotas relacionadas aos usuários.
import usuarioRoutes from "./routes/usuario.routes.js";

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
// ROTAS DE AUTENTICAÇÃO
// ============================================================
app.use("/api/v1/auth", authRoutes);

// ============================================================
// ROTAS DE USUÁRIOS
app.use("/api/v1/usuarios", usuarioRoutes);
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
