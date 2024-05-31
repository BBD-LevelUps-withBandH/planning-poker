const { Client } = require('pg');
const path = require("path");
require("dotenv").config({
  override: true,
  path: path.join(__dirname, "db.env"),
});

const client = new Client({
  user: process.env.DB_USERNAME,
  host: process.env.DB_URL,
  database: 'poker',
  password: process.env.DB_PASSWORD,
  port: 5432
});


client.connect(err => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = client;
