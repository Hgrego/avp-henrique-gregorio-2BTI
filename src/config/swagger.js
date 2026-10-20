
import swaggerJsdoc from "swagger-jsdoc";

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
                        id: { type: "integer", example: 1 },
                        titulo: { type: "string", example: "Interestelar" },
                        genero: { type: "string", example: "Ficção Científica" }
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
        },
        paths: {
            "/filmes": {
                get: {
                    summary: "Listar todos os filmes",
                    tags: ["Filmes"],
                    responses: {
                        200: {
                            description: "Lista de filmes",
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "array",
                                        items: { $ref: "#/components/schemas/Filme" }
                                    }
                                }
                            }
                        }
                    }
                },
                post: {
                    summary: "Cadastrar um filme",
                    tags: ["Filmes"],
                    security: [{ bearerAuth: [] }],
                    requestBody: {
                        required: true,
                        content: {
                            "application/json": {
                                schema: {
                                    type: "object",
                                    required: ["titulo", "genero"],
                                    properties: {
                                        titulo: { type: "string" },
                                        genero: { type: "string" }
                                    }
                                }
                            }
                        }
                    },
                    responses: {
                        201: { description: "Filme cadastrado" },
                        400: { description: "Dados inválidos" }
                    }
                }
            },
            "/filmes/{id}": {
                parameters: [
                    {
                        in: "path",
                        name: "id",
                        required: true,
                        schema: { type: "integer" }
                    }
                ],
                get: {
                    summary: "Buscar filme por ID",
                    tags: ["Filmes"],
                    responses: {
                        200: {
                            description: "Filme encontrado",
                            content: {
                                "application/json": {
                                    schema: { $ref: "#/components/schemas/Filme" }
                                }
                            }
                        },
                        404: { description: "Filme não encontrado" }
                    }
                },
                put: {
                    summary: "Atualizar um filme",
                    tags: ["Filmes"],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Filme atualizado" },
                        404: { description: "Filme não encontrado" }
                    }
                },
                patch: {
                    summary: "Atualizar parcialmente um filme",
                    tags: ["Filmes"],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Filme atualizado parcialmente" },
                        404: { description: "Filme não encontrado" }
                    }
                },
                delete: {
                    summary: "Excluir um filme",
                    tags: ["Filmes"],
                    security: [{ bearerAuth: [] }],
                    responses: {
                        200: { description: "Filme excluído" },
                        404: { description: "Filme não encontrado" }
                    }
                }
            }
        }
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
