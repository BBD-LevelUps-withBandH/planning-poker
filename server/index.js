const express = require('express');
const bodyParser = require('body-parser');
const http = require("http");
const mainRouter = require("./routes/mainRouter");
const cors = require("cors");

const app = express();
const port = 8080;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());



// const userRoutes = require('./routes/userRoutes');

// app.use('/api', userRoutes);

app.use("/", mainRouter);

let server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://${"127.0.0.1"}:${port}/`);
});

module.exports = app;
