
import { useState } from "react";

export default function CadastrarUsuario() {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confirmarSenha, setConfirmarSenha] = useState("")

    const [mensagem, setMensagem] = useState("")
    const [erro, setErro] = useState("")

    async function cadastrar(evento) {
        evento.preventDefault()

        setMensagem("")
        setErro("")

        if (senha !== confirmarSenha) {
            setErro("As senhas não coincidem.")
            return
        }

        try {
            const resposta = await fetch("http://localhost:3000/usuarios/cadastrar", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    nome,
                    email,
                    senha
                })
            })

            const dados = await resposta.json()

            if (!resposta.ok) {
                setErro(dados.message || "Erro ao realizar cadastro.")
                return
            }

            setMensagem("Usuário cadastrado com sucesso!")

            setNome("")
            setEmail("")
            setSenha("")
            setConfirmarSenha("")

        } catch {
            setErro("Não foi possível conectar ao servidor.")
        }
    }

    return (
        <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">

            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">

                <h1 className="text-3xl font-bold text-blue-600 text-center mb-2">
                    Criar uma conta
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Preencha os dados para se cadastrar.
                </p>

                <form onSubmit={cadastrar} className="space-y-4">

                    <div>
                        <label htmlFor="nome" className="block mb-1 font-medium">
                            Nome completo
                        </label>

                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder="Digite seu nome"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block mb-1 font-medium">
                            E-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="senha" className="block mb-1 font-medium">
                            Senha
                        </label>

                        <input
                            id="senha"
                            type="password"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            placeholder="Digite uma senha"
                            minLength={8}
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmarSenha" className="block mb-1 font-medium">
                            Confirmar senha
                        </label>

                        <input
                            id="confirmarSenha"
                            type="password"
                            value={confirmarSenha}
                            onChange={(e) => setConfirmarSenha(e.target.value)}
                            placeholder="Digite a senha novamente"
                            required
                            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 cursor-pointer"
                    >
                        Criar conta
                    </button>

                </form>

                {mensagem && (
                    <p role="status" className="mt-4 text-center text-green-600">
                        {mensagem}
                    </p>
                )}

                {erro && (
                    <p role="alert" className="mt-4 text-center text-red-600">
                        {erro}
                    </p>
                )}

            </div>

        </main>
    );
}
