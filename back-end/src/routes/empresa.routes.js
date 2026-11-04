
import { Router } from "express";

// Controllers das operações de empresa.
import {
    criar,
    listar,
    buscarPorId,
    atualizar,
    excluir
} from "../controllers/empresa.controller.js";

// Middlewares de autenticação e autorização.
import {
    autenticar,
    exigirPerfil
} from "../middlewares/auth.middleware.js";

const router = Router();

// Todas as rotas abaixo exigem:
// 1. Usuário autenticado.
// 2. Perfil ADMIN_GERAL.
router.use(autenticar);
router.use(exigirPerfil("ADMIN_GERAL"));

// POST /api/v1/empresas
router.post("/", criar);

// GET /api/v1/empresas
router.get("/", listar);

// GET /api/v1/empresas/:id
router.get("/:id", buscarPorId);

// PUT /api/v1/empresas/:id
router.put("/:id", atualizar);

// DELETE /api/v1/empresas/:id
router.delete("/:id", excluir);

export default router;
