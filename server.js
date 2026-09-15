import express from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const app = express();
const port = 3000;

// Permite receber dados em JSON
app.use(express.json());

// ==========================================
// CONFIGURAÇÃO DO SWAGGER
// ==========================================

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de cadastro e gerenciamento de filmes",
      version: "1.0.0",
      description: "API escolar para cadastrar e gerenciar filmes."
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local da API"
      }
    ],
    components: {
      schemas: {
        Filme: {
          type: "object",
          properties: {
            id: {
              type: "integer",
              example: 1
            },
            titulo: {
              type: "string",
              example: "Interestelar"
            },
            genero: {
              type: "string",
              example: "Ficção Científica"
            }
          }
        }
      },

      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: "Informe o token no formato: Bearer SEU_TOKEN"
        }
      }
    }
  },
  apis: ["./server.js"]
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ==========================================
// CONFIGURAÇÃO DO TOKEN DE SEGURANÇA
// ==========================================

const TOKEN_SECRETO = "12345678Hg";

// Função que valida o token enviado pelo Insomnia
function verificarToken(req, res, next) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({
      mensagem: "Acesso negado! Token não fornecido."
    });
  }

  const partes = authHeader.split(" ");
  const token = partes[1];

  if (token !== TOKEN_SECRETO) {
    return res.status(403).json({
      mensagem: "Acesso negado! Token inválido."
    });
  }

  next();
}

// ==========================================
// LISTA DE FILMES
// ==========================================

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

/**
 * @swagger
 * /filmes:
 *   post:
 *     tags:
 *       - Filme
 *     summary: Cadastrar um filme
 *     description: Cadastra um novo filme usando título e gênero.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - titulo
 *               - genero
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Interestelar
 *               genero:
 *                 type: string
 *                 example: Ficção Científica
 *           example:
 *             titulo: Interestelar
 *             genero: Ficção Científica
 *     responses:
 *       201:
 *         description: Filme cadastrado com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme cadastrado com sucesso!
 *               filme:
 *                 id: 6
 *                 titulo: Interestelar
 *                 genero: Ficção Científica
 *       400:
 *         description: Dados do filme inválidos.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Dados inválidos.
 *       401:
 *         description: Token não informado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Acesso negado! Token não fornecido.
 *       403:
 *         description: Token inválido.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Acesso negado! Token inválido.
 */
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
// GET - LISTAR TODOS OS FILMES
// ==========================================

/**
 * @swagger
 * /filmes:
 *   get:
 *     tags:
 *       - Filme
 *     summary: Listar todos os filmes
 *     description: Retorna todos os filmes cadastrados.
 *     responses:
 *       200:
 *         description: Lista de filmes retornada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Filme"
 *             example:
 *               - id: 1
 *                 titulo: Interestelar
 *                 genero: Ficção Científica
 */
app.get("/filmes", (req, res) => {
  res.json(filmes);
});

// ==========================================
// GET /:id - BUSCAR UM FILME POR ID
// ==========================================

/**
 * @swagger
 * /filmes/{id}:
 *   get:
 *     tags:
 *       - Filme
 *     summary: Buscar um filme por ID
 *     description: Retorna um filme específico pelo seu ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do filme que será consultado.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Filme encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Filme"
 *             example:
 *               id: 1
 *               titulo: Interestelar
 *               genero: Ficção Científica
 *       404:
 *         description: Filme não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme não encontrado!
 */
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

app.put("/filmes/:id", verificarToken, (req, res) => {
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
// PATCH /:id - ATUALIZAR PARCIALMENTE
// ==========================================

/**
 * @swagger
 * /filmes/{id}:
 *   patch:
 *     tags:
 *       - Filme
 *     summary: Atualizar parcialmente um filme
 *     description: Atualiza apenas o título, o gênero ou os dois campos do filme.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do filme que será atualizado.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *                 example: Interestelar - Edição Especial
 *               genero:
 *                 type: string
 *                 example: Ficção Científica
 *           example:
 *             titulo: Interestelar - Edição Especial
 *             genero: Ficção Científica
 *     responses:
 *       200:
 *         description: Filme atualizado parcialmente.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme atualizado parcialmente!
 *               filme:
 *                 id: 1
 *                 titulo: Interestelar - Edição Especial
 *                 genero: Ficção Científica
 *       400:
 *         description: Dados do filme inválidos.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Dados inválidos.
 *       401:
 *         description: Token não informado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Acesso negado! Token não fornecido.
 *       403:
 *         description: Token inválido.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Acesso negado! Token inválido.
 *       404:
 *         description: Filme não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme não encontrado!
 */
app.patch("/filmes/:id", verificarToken, (req, res) => {
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

/**
 * @swagger
 * /filmes/{id}:
 *   delete:
 *     tags:
 *       - Filme
 *     summary: Excluir um filme
 *     description: Exclui um filme cadastrado pelo seu ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do filme que será excluído.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Filme excluído com sucesso.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme excluído com sucesso!
 *               filme:
 *                 id: 1
 *                 titulo: Interestelar
 *                 genero: Ficção Científica
 *       401:
 *         description: Token não informado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Acesso negado! Token não fornecido.
 *       403:
 *         description: Token inválido.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Acesso negado! Token inválido.
 *       404:
 *         description: Filme não encontrado.
 *         content:
 *           application/json:
 *             example:
 *               mensagem: Filme não encontrado!
 */
app.delete("/filmes/:id", verificarToken, (req, res) => {
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