const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const userRoutes = require('./routes/userRoutes');

app.use('/api', userRoutes);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

module.exports = app;
