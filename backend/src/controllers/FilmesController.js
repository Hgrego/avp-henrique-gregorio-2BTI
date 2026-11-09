
import {
    listarFilmes as listarFilmesModel,
    buscarFilmePorId,
    cadastrarFilme as cadastrarFilmeModel,
    atualizarFilme as atualizarFilmeModel,
    excluirFilme as excluirFilmeModel
} from "../../models/filmesModel.js";

function obterId(req, res) {
    const id = Number(req.params.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
        res.status(400).json({ mensagem: "ID inválido." });
        return null;
    }

    return id;
}

function responderErroDeRegistroNaoEncontrado(error, res) {
    if (error?.code !== "P2025") return false;

    res.status(404).json({ mensagem: "Filme não encontrado!" });
    return true;
}

export async function listarFilmes(req, res) {
    const filmes = await listarFilmesModel();
    res.json(filmes);
}

export async function buscarFilme(req, res) {
    const id = obterId(req, res);
    if (id === null) return;

    const filme = await buscarFilmePorId(id);

    if (!filme) {
        return res.status(404).json({ mensagem: "Filme não encontrado!" });
    }

    res.json(filme);
}

export async function cadastrarFilme(req, res) {
    const { titulo, genero } = req.body ?? {};

    if (
        typeof titulo !== "string" ||
        !titulo.trim() ||
        typeof genero !== "string" ||
        !genero.trim()
    ) {
        return res.status(400).json({ mensagem: "Dados inválidos." });
    }

    const filme = await cadastrarFilmeModel({
        titulo: titulo.trim(),
        genero: genero.trim()
    });

    res.status(201).json({
        mensagem: "Filme cadastrado com sucesso!",
        filme
    });
}

export async function atualizarFilme(req, res) {
    const id = obterId(req, res);
    if (id === null) return;

    const { titulo, genero } = req.body ?? {};

    if (
        typeof titulo !== "string" ||
        !titulo.trim() ||
        typeof genero !== "string" ||
        !genero.trim()
    ) {
        return res.status(400).json({ mensagem: "Dados inválidos." });
    }

    try {
        const filme = await atualizarFilmeModel(id, {
            titulo: titulo.trim(),
            genero: genero.trim()
        });

        res.json({ mensagem: "Filme atualizado com sucesso!", filme });
    } catch (error) {
        if (!responderErroDeRegistroNaoEncontrado(error, res)) throw error;
    }
}

export async function atualizarFilmeParcial(req, res) {
    const id = obterId(req, res);
    if (id === null) return;

    const { titulo, genero } = req.body ?? {};

    if (titulo === undefined && genero === undefined) {
        return res.status(400).json({
            mensagem: "Informe titulo ou genero para atualizar."
        });
    }

    if (
        (titulo !== undefined &&
            (typeof titulo !== "string" || !titulo.trim())) ||
        (genero !== undefined &&
            (typeof genero !== "string" || !genero.trim()))
    ) {
        return res.status(400).json({ mensagem: "Dados inválidos." });
    }

    const dados = {};
    if (titulo !== undefined) dados.titulo = titulo.trim();
    if (genero !== undefined) dados.genero = genero.trim();

    try {
        const filme = await atualizarFilmeModel(id, dados);
        res.json({ mensagem: "Filme atualizado parcialmente!", filme });
    } catch (error) {
        if (!responderErroDeRegistroNaoEncontrado(error, res)) throw error;
    }
}

export async function excluirFilme(req, res) {
    const id = obterId(req, res);
    if (id === null) return;

    try {
        const filme = await excluirFilmeModel(id);
        res.json({ mensagem: "Filme excluído com sucesso!", filme });
    } catch (error) {
        if (!responderErroDeRegistroNaoEncontrado(error, res)) throw error;
    }
}
