const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const { errorHandler } = require('./middlewares/errorHandler');
const http = require("http");
const cors = require("cors");

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.use('/', apiRoutes);
app.use(errorHandler);
app.use(cors({ origin: 'https://planning-poker.projects.bbdgrad.com/' }));

let server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

module.exports = app;
