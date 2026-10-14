
import express from "express";

import {
    login
} from "../controllers/auth.controller.js";

import {
    autenticar
} from "../middlewares/auth.middleware.js";

const router = express.Router();

// Login: não exige token.
router.post("/login", login);

// Retorna os dados do usuário autenticado.
router.get("/me", autenticar, (req, res) => {
    res.json({
        usuario: req.usuario
    });
});

export default router;
