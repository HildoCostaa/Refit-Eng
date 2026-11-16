
import express from "express";

import {
    convidar,
    listar,
    revogar
} from "../controllers/orcamento-colaborador.controller.js";

import {
    autenticar,
    exigirPerfil,
    exigirEmpresa
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Todas as rotas exigem autenticação.
router.use(autenticar);

// O usuário precisa pertencer a uma empresa.
router.use(exigirEmpresa);

// Somente o administrador da empresa pode
// gerenciar os colaboradores dos orçamentos.
router.use(exigirPerfil("ADMIN_EMPRESA"));


// CONVIDAR COLABORADOR
router.post(
    "/:orcamentoId/colaboradores",
    convidar
);


// LISTAR COLABORADORES
router.get(
    "/:orcamentoId/colaboradores",
    listar
);


// REVOGAR ACESSO
router.patch(
    "/:orcamentoId/colaboradores/:conviteId/revogar",
    revogar
);

export default router;
