import cors from "cors";
import usuariosRoutes from "./src/routes/UsuariosRoutes.js";
import express from "express";
import swaggerUi from "swagger-ui-express";

import filmesRoutes from "./src/routes/FilmesRoutes.js";
import swaggerSpec from "./src/config/swagger.js";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.json({
    mensagem: "API de filmes funcionando!",
    documentacao: "/api-docs"
  });
});

app.use("/filmes", filmesRoutes);
app.use("/usuarios", usuariosRoutes);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec)
);

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
