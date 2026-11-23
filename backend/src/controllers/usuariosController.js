
import bcrypt from 'bcrypt'
import * as usuariosModel from '../../models/usuariosModel.js'
import jwt from 'jsonwebtoken'

const TOKEN_SECRETO = "12345678Hg";

export async function cadastrarUsuario(req, res) {
    try {
        const { nome, email, senha } = req.body

        if (!nome || !email || !senha) {
            return res.status(400).json({
                message: 'Preencha todos os campos'
            });
        }

        const senhaHash = await bcrypt.hash(senha, 10)

        const novoUsuario = await usuariosModel.cadastrarUsuario({
            nome,
            email,
            senhaHash
        });

        res.status(201).json({
            message: 'Usuário cadastrado com sucesso',
            novoUsuario
        });

    } catch (erro) {
        console.error("Erro ao cadastrar usuário:", erro);

        res.status(500).json({
            message: 'Erro ao cadastrar usuário'
        });
    }
}

export async function login(req, res) {
    try {
        const { email, senha } = req.body

        const usuario = await usuariosModel.buscarPorEmail(email)

        if (!usuario) {
            return res.status(401).json({
                message: 'Email ou senha inválidos'
            });
        }

        const senhaCorreta = await bcrypt.compare(senha, usuario.senhaHash)

        if (!senhaCorreta) {
            return res.status(401).json({
                message: 'Email ou senha inválidos'
            });
        }

        const token = jwt.sign(
            { id: usuario.id },
            TOKEN_SECRETO,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Login realizado com sucesso',
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email
            }
        });

    } catch (erro) {
        console.error("Erro ao realizar login:", erro);

        res.status(500).json({
            message: 'Erro ao realizar login'
        });
    }
}
