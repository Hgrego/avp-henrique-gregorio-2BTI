import express from "express";

const app = express();
const port = 3000;

// Permite receber dados em JSON
app.use(express.json());

// Lista de filmes
const filmes = [
  { id: 1, titulo: "Interestelar", genero: "Ficção Científica" },
  { id: 2, titulo: "Titanic", genero: "Romance" },
  { id: 3, titulo: "O Rei Leão", genero: "Animação" },
  { id: 4, titulo: "Corra!", genero: "Terror" },
  { id: 5, titulo: "Vingadores: Ultimato", genero: "Ação" }
];

// ==========================================
// POST - CADASTRAR UM FILME
// ==========================================

app.post("/filmes", (req, res) => {
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
// GET - LISTAR TODOS OS FILMES
// ==========================================

app.get("/filmes", (req, res) => {
  res.json(filmes);
});

// ==========================================
// GET /:id - BUSCAR UM FILME ESPECÍFICO
// ==========================================

app.get("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);

  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      mensagem: "Filme não encontrado!"
    });
  }

  res.json(filme);
});

// ==========================================
// PUT /:id - EDITAR O FILME COMPLETO
// ==========================================

app.put("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);

  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      mensagem: "Filme não encontrado!"
    });
  }

  filme.titulo = req.body.titulo;
  filme.genero = req.body.genero;

  res.json({
    mensagem: "Filme atualizado com sucesso!",
    filme: filme
  });
});

// ==========================================
// PATCH /:id - ALTERAR APENAS UMA INFORMAÇÃO
// ==========================================

app.patch("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);

  const filme = filmes.find((filme) => filme.id === id);

  if (!filme) {
    return res.status(404).json({
      mensagem: "Filme não encontrado!"
    });
  }

  if (req.body.titulo !== undefined) {
    filme.titulo = req.body.titulo;
  }

  if (req.body.genero !== undefined) {
    filme.genero = req.body.genero;
  }

  res.json({
    mensagem: "Filme atualizado parcialmente!",
    filme: filme
  });
});

// ==========================================
// DELETE /:id - EXCLUIR UM FILME
// ==========================================

app.delete("/filmes/:id", (req, res) => {
  const id = Number(req.params.id);

  const indice = filmes.findIndex((filme) => filme.id === id);

  if (indice === -1) {
    return res.status(404).json({
      mensagem: "Filme não encontrado!"
    });
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