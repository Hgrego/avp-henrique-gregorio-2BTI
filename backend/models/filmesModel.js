import prisma from "../config/prisma.js";

export function listarFilmes() {
    return prisma.filme.findMany({
        orderBy: { id: "asc" }
    });
}

export function buscarFilmePorId(id) {
    return prisma.filme.findUnique({
        where: { id: Number(id) }
    });
}

export function cadastrarFilme(dados) {
    return prisma.filme.create({
        data: dados
    });
}

export function atualizarFilme(id, dados) {
    return prisma.filme.update({
        where: { id: Number(id) },
        data: dados
    });
}

export function excluirFilme(id) {
    return prisma.filme.delete({
        where: { id: Number(id) }
    });
}