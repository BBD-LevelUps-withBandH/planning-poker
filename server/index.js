const express = require('express');
const http = require('http');

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Test Server');
});

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
