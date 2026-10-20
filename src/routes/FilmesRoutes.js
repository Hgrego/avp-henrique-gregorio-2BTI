
import express from "express";

import {
    listarFilmes,
    buscarFilme,
    cadastrarFilme,
    atualizarFilme,
    atualizarFilmeParcial,
    excluirFilme
} from "../controllers/FilmesController.js";

import { verificarToken } from "../middlewares/autenticar.js";

const router = express.Router();

router.get("/", listarFilmes);
router.get("/:id", buscarFilme);

router.post("/", verificarToken, cadastrarFilme);
router.put("/:id", verificarToken, atualizarFilme);
router.patch("/:id", verificarToken, atualizarFilmeParcial);
router.delete("/:id", verificarToken, excluirFilme);

export default router;
