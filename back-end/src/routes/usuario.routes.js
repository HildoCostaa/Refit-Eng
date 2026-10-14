
import express from "express";

import {
    criarAdministradorEmpresa,
    criarColaborador
} from "../controllers/usuario.controller.js";

import {
    autenticar,
    exigirPerfil
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Somente o administrador geral cria o primeiro administrador
// de uma empresa já cadastrada.
router.post(
    "/empresas/:empresaId/administrador",
    autenticar,
    exigirPerfil("ADMIN_GERAL"),
    criarAdministradorEmpresa
);

// Somente o administrador da empresa cria colaboradores.
// O empresa_id é obtido a partir do usuário autenticado.
router.post(
    "/empresa/colaboradores",
    autenticar,
    exigirPerfil("ADMIN_EMPRESA"),
    criarColaborador
);

export default router;
