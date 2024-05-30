const { Client } = require('pg');

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'TestingPlanningPoker',
  password: '123',
  port: 5432,
});


client.connect(err => {
  if (err) {
    console.error('Error connecting to the database', err.stack);
  } else {
    console.log('Database connected successfully');
  }
});

module.exports = client;
