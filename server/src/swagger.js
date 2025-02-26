const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Kahra Studio API",
      version: "1.0.0",
      description: "Kahra Studio REST API belgeleri",
      contact: {
        name: "Kahra Studio",
        url: "https://kahrastudio.art",
        email: "info@kahrastudio.art",
      },
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Geliştirme sunucusu",
      },
      {
        url: "https://api.kahrastudio.art",
        description: "Üretim sunucusu",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"],
};

const specs = swaggerJsdoc(options);

module.exports = {
  serve: swaggerUi.serve,
  setup: swaggerUi.setup(specs),
};
