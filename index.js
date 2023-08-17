const express = require('./config/express');
const {logger} = require('./config/winston');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
const { swaggerUi, specs } = require("./config/swagger");

app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(specs));

const port = 3000;
app.listen(port);
logger.info(`${process.env.NODE_ENV} - API Server Start At Port ${port}`);