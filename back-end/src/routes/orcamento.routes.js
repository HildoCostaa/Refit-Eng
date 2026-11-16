
import express from "express";

import {
    cadastrar,
    listar,
    buscarPorId,
    atualizar,
    aprovar,
    recusar,
    enviar
} from "../controllers/orcamento.controller.js";

import {
    autenticar,
    exigirPerfil,
    exigirEmpresa
} from "../middlewares/auth.middleware.js";

import {
    exigirAcessoOrcamento
} from "../middlewares/orcamento.middleware.js";

const router = express.Router();

// Todas as operações exigem autenticação
// e vínculo com uma empresa.
router.use(autenticar, exigirEmpresa);

// CRIAR ORÇAMENTO
// Somente o administrador da empresa.
router.post(
    "/",
    exigirPerfil("ADMIN_EMPRESA"),
    cadastrar
);

// LISTAR ORÇAMENTOS
// Administrador vê todos.
// Colaborador vê somente os que recebeu convite.
router.get(
    "/",
    listar
);

// VISUALIZAR UM ORÇAMENTO
// Administrador ou colaborador convidado.
router.get(
    "/:id",
    exigirAcessoOrcamento,
    buscarPorId
);

// EDITAR ORÇAMENTO
// Administrador ou colaborador convidado.
router.put(
    "/:id",
    exigirAcessoOrcamento,
    atualizar
);


 // APROVAR ORÇAMENTO
// Somente ADMIN_EMPRESA.
router.patch(
    "/:id/aprovar",
    exigirPerfil("ADMIN_EMPRESA"),
    aprovar
);


// RECUSAR ORÇAMENTO
// Somente ADMIN_EMPRESA.
router.patch(
    "/:id/recusar",
    exigirPerfil("ADMIN_EMPRESA"),
    recusar
);


// ENVIAR ORÇAMENTO AO CLIENTE
// Somente ADMIN_EMPRESA.
router.patch(
    "/:id/enviar",
    exigirPerfil("ADMIN_EMPRESA"),
    enviar
);

export default router;
