import prisma from '../config/prisma.js';

export function cadastrarUsuario({nome, email, senhaHash}){

}

export function buscarPorEmail({email}){
    return prisma.usuario.create({
        data: {
            nome,
            emal,
            senhaHash
        },
        select: {
            id: true,
            nome: true,
            email: true,
            senhaHash: true
        }
    });
}

    export function buscarPorEmail({email}){
        return prisma.usuario.findUnique({
            where: { 
                email 
            }
        });
    }