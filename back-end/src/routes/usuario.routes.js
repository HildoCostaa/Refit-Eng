
import express from "express";

import {
    criarAdministradorEmpresa,
    criarColaborador,
    listar,
    buscarPorId,
    atualizar,
    desativar
} from "../controllers/usuario.controller.js";

import {
    autenticar,
    exigirPerfil,
    exigirEmpresa
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// CRIAR ADMINISTRADOR DE UMA EMPRESA
// Somente o ADMIN_GERAL pode executar.
router.post(
    "/empresas/:empresaId/administrador",
    autenticar,
    exigirPerfil("ADMIN_GERAL"),
    criarAdministradorEmpresa
);

// TODAS AS ROTAS DE GESTÃO DE COLABORADORES
// Exigem administrador autenticado e vinculado a uma empresa.
router.use(
    "/empresa/colaboradores",
    autenticar,
    exigirPerfil("ADMIN_EMPRESA"),
    exigirEmpresa
);

// CRIAR COLABORADOR
router.post(
    "/empresa/colaboradores",
    criarColaborador
);

// LISTAR COLABORADORES
router.get(
    "/empresa/colaboradores",
    listar
);

// CONSULTAR COLABORADOR POR ID
router.get(
    "/empresa/colaboradores/:id",
    buscarPorId
);

// EDITAR COLABORADOR
router.put(
    "/empresa/colaboradores/:id",
    atualizar
);

// DESATIVAR COLABORADOR
router.patch(
    "/empresa/colaboradores/:id/desativar",
    desativar
);

export default router;
