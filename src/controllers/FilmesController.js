
import filmes from "../data/filmes.js";

export function listarFilmes(req, res) {
    res.json(filmes);
}

export function buscarFilme(req, res) {
    const filme = filmes.find(
        (item) => item.id === Number(req.params.id)
    );

    if (!filme) {
        return res.status(404).json({
            mensagem: "Filme não encontrado!"
        });
    }

    res.json(filme);
}

export function cadastrarFilme(req, res) {
    const { titulo, genero } = req.body;

    if (
        typeof titulo !== "string" ||
        !titulo.trim() ||
        typeof genero !== "string" ||
        !genero.trim()
    ) {
        return res.status(400).json({
            mensagem: "Dados inválidos."
        });
    }

    const novoFilme = {
        id: Math.max(0, ...filmes.map((filme) => filme.id)) + 1,
        titulo: titulo.trim(),
        genero: genero.trim()
    };

    filmes.push(novoFilme);

    res.status(201).json({
        mensagem: "Filme cadastrado com sucesso!",
        filme: novoFilme
    });
}

export function atualizarFilme(req, res) {
    const filme = filmes.find(
        (item) => item.id === Number(req.params.id)
    );

    if (!filme) {
        return res.status(404).json({
            mensagem: "Filme não encontrado!"
        });
    }

    const { titulo, genero } = req.body;

    if (
        typeof titulo !== "string" ||
        !titulo.trim() ||
        typeof genero !== "string" ||
        !genero.trim()
    ) {
        return res.status(400).json({
            mensagem: "Dados inválidos."
        });
    }

    filme.titulo = titulo.trim();
    filme.genero = genero.trim();

    res.json({
        mensagem: "Filme atualizado com sucesso!",
        filme
    });
}

export function atualizarFilmeParcial(req, res) {
    const filme = filmes.find(
        (item) => item.id === Number(req.params.id)
    );

    if (!filme) {
        return res.status(404).json({
            mensagem: "Filme não encontrado!"
        });
    }

    const { titulo, genero } = req.body;

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
        return res.status(400).json({
            mensagem: "Dados inválidos."
        });
    }

    if (titulo !== undefined) filme.titulo = titulo.trim();
    if (genero !== undefined) filme.genero = genero.trim();

    res.json({
        mensagem: "Filme atualizado parcialmente!",
        filme
    });
}

export function excluirFilme(req, res) {
    const indice = filmes.findIndex(
        (item) => item.id === Number(req.params.id)
    );

    if (indice === -1) {
        return res.status(404).json({
            mensagem: "Filme não encontrado!"
        });
    }

    const filme = filmes.splice(indice, 1)[0];

    res.json({
        mensagem: "Filme excluído com sucesso!",
        filme
    });
}
