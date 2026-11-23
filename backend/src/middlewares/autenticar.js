
import jwt from 'jsonwebtoken'

const TOKEN_SECRETO = "12345678Hg";

export function verificarToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const partes = authHeader?.split(" ") || [];

    if (
        !authHeader ||
        partes[0] !== "Bearer" ||
        partes.length !== 2
    ) {
        return res.status(401).json({
            mensagem: "Acesso negado! Token não fornecido."
        });
    }

    try {
        const dados = jwt.verify(partes[1], TOKEN_SECRETO);

        req.usuario = dados;

        next();

    } catch (erro) {
        return res.status(401).json({
            mensagem: "Acesso negado! Token inválido ou expirado."
        });
    }
}
