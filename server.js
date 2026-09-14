import express from "express";

const app = express();
const port = 3000;

// Permite receber dados em JSON
app.use(express.json());

// ==========================================
// CONFIGURAÇÃO DO TOKEN DE SEGURANÇA (Senha)
// ==========================================
const TOKEN_SECRETO = "12345678Hg"; // Altere aqui para a senha que você quiser!

// Função que valida o token enviado pelo Insomnia
function verificarToken(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ mensagem: "Acesso negado! Token não fornecido." });
  }

  // O Insomnia envia: "Bearer minhasenha123". O split separa o texto pelo espaço.
  const partes = authHeader.split(' ');
  const token = partes[1]; // Pega apenas a segunda parte, que é a senha

  if (token !== TOKEN_SECRETO) {
    return res.status(403).json({ mensagem: "Acesso negado! Token inválido." });
  }

  next(); // Se estiver tudo certo, avança para a rota
}

// Lista de filmes simulando um banco de dados
const filmes = [
  { id: 1, titulo: "Interestelar", genero: "Ficção Científica" },
  { id: 2, titulo: "Titanic", genero: "Romance" },
  { id: 3, titulo: "O Rei Leão", genero: "Animação" },
  { id: 4, titulo: "Corra!", genero: "Terror" },
  { id: 5, titulo: "Vingadores: Ultimato", genero: "Ação" }
];

// ==========================================
// POST - CADASTRAR UM FILME (Protegido por token)
// ==========================================
app.post("/filmes", verificarToken, (req, res) => {
  const novoFilme = {
    id: filmes.length + 1,
    titulo: req.body.titulo,
    genero: req.body.genero
  };

  filmes.push(novoFilme);

  res.status(201).json({
    mensagem: "Filme cadastrado com sucesso!",
    filme: novoFilme
  });
});

// ==========================================
// GET - LISTAR TODOS OS FILMES (Livre / Sem token)
// ==========================================
app.get("/filmes", (req, res) => {
  res.json(filmes);
});

// ==========================================
// GET /:id - BUSCAR UM FILME ESPECÍFICO (Livre / Sem token)
// ==========================================
app.get("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);
  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  res.json(filme);
});

// ==========================================
// PUT /:id - EDITAR O FILME COMPLETO (Protegido por token)
// ==========================================
app.put("/filmes/:id", verificarToken, (req, res) => {
  const id = Number(req.params.id);
  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  filme.titulo = req.body.titulo;
  filme.genero = req.body.genero;

  res.json({
    mensagem: "Filme atualizado com sucesso!",
    filme: filme
  });
});

// ==========================================
// PATCH /:id - ALTERAR APENAS UMA INFORMAÇÃO (Protegido por token)
// ==========================================
app.patch("/filmes/:id", verificarToken, (req, res) => {
  const id = Number(req.params.id);
  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  if (req.body.titulo !== undefined) filme.titulo = req.body.titulo;
  if (req.body.genero !== undefined)  filme.genero = req.body.genero;

  res.json({
    mensagem: "Filme atualizado parcialmente!",
    filme: filme
  });
});

// ==========================================
// DELETE /:id - EXCLUIR UM FILME (Protegido por token)
// ==========================================
app.delete("/filmes/:id", verificarToken, (req, res) => {
  const id = Number(req.params.id);
  const indice = filmes.findIndex((filme) => filme.id === id);

  if (indice === -1) {
    return res.status(404).json({ mensagem: "Filme não encontrado!" });
  }

  const filmeExcluido = filmes.splice(indice, 1);

  res.json({
    mensagem: "Filme excluído com sucesso!",
    filme: filmeExcluido[0]
  });
});

// ==========================================
// INICIAR O SERVIDOR
// ==========================================
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
