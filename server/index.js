const express = require('express');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/apiRoutes');
const { errorHandler } = require('./middlewares/errorHandler');

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.use('/', apiRoutes);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});

module.exports = app;
