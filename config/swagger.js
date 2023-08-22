const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Test API",
      description: "Test API with express",
    },
    servers: [
      {
        url: "http://localhost:3000", // 요청 URL
      },
    ],
  },
  apis: ["./src/app/Auth_test/*.js", "./src/app/Competition/*.js", "./src/app/Tournament/*.js"]
};
const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };