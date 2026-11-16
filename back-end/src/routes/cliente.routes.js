
import express from "express";

import {
    cadastrar,
    listar,
    buscarPorId,
    atualizar,
    desativar
} from "../controllers/cliente.controller.js";

import {
    autenticar,
    exigirEmpresa
} from "../middlewares/auth.middleware.js";


const router = express.Router();


// TODAS AS ROTAS EXIGEM AUTENTICAÇÃO
// E UM USUÁRIO VINCULADO A UMA EMPRESA.
router.use(autenticar, exigirEmpresa);


// CADASTRAR CLIENTE
router.post("/", cadastrar);


// LISTAR CLIENTES
router.get("/", listar);


// BUSCAR CLIENTE POR ID
router.get("/:id", buscarPorId);


// ATUALIZAR CLIENTE
router.put("/:id", atualizar);


// DESATIVAR CLIENTE
router.patch("/:id/desativar", desativar);


export default router;
    