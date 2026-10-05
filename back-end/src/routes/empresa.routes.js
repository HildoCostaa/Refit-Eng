
// Importa o Router do Express.
//
// O Router permite criar um conjunto de rotas
// separado do arquivo principal da aplicação.
import { Router } from "express";

// Importa a função "criar" do Controller.
//
// Essa função será executada quando alguém
// fizer uma requisição POST para a rota definida abaixo.
import { criar } from "../controllers/empresa.controller.js";


// Cria uma nova instância do Router.
const router = Router();


// ============================================================
// ROTA: CRIAR EMPRESA
// ============================================================

// Quando alguém fizer:
//
// POST /empresas
//
// o Express executará a função "criar"
// que veio do Controller.
router.post("/", criar);


// Exporta o Router para que ele possa
// ser utilizado pelo app.js.
export default router;
