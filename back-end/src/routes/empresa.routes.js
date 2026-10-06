
// Importa o Router do Express.
import { Router } from "express";


// Importa as funções do Controller.
import {
    criar,
    listar,
    buscarPorId,
    atualizar,
    excluir
} from "../controllers/empresa.controller.js";


// Cria o Router.
const router = Router();


// ============================================================
// CRIAR EMPRESA
// ============================================================

// POST /api/v1/empresas
router.post("/", criar);


// ============================================================
// LISTAR EMPRESAS
// ============================================================

// GET /api/v1/empresas
router.get("/", listar);


// ============================================================
// BUSCAR EMPRESA POR ID
// ============================================================

// GET /api/v1/empresas/:id
//
// O :id é um parâmetro dinâmico.
//
// Exemplos:
//
// /empresas/1
// /empresas/2
// /empresas/15
router.get("/:id", buscarPorId);


// ============================================================
// ATUALIZAR EMPRESA
// ============================================================

// PUT /api/v1/empresas/:id
//
// Exemplo:
//
// PUT /api/v1/empresas/1
//
// Nesse caso, a empresa de ID 1 será atualizada.
router.put("/:id", atualizar);


// ============================================================
// EXCLUIR EMPRESA
// ============================================================

// DELETE /api/v1/empresas/:id
//
// Exemplo:
//
// DELETE /api/v1/empresas/1
//
// Nesse caso, a empresa de ID 1 será excluída.
router.delete("/:id", excluir);


// Exporta o Router.
export default router;

