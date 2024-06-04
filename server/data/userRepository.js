const client = require('./databaseConnection');
const User = require('../models/user');

const tableName = 'users';

const getUserById = async (userId) => {
  const result = await client.query(`SELECT * FROM ${tableName} WHERE user_id = $1`, [userId]);
  if (result.rows.length === 0) {
    throw new Error(`User with ID ${userId} not found`);
  }
  const row = result.rows[0];
  return new User(row.user_id, row.upn);
};

const createUser = async (upn) => {
  const checkUserQuery = `SELECT * FROM ${tableName} WHERE upn = $1`;
  const checkUserResult = await client.query(checkUserQuery, [upn]);

  if (checkUserResult.rows.length > 0) {
    const existingUser = checkUserResult.rows[0];
    return new User(existingUser.user_id, existingUser.upn);
  }

  const result = await client.query(
    `INSERT INTO ${tableName} (upn) VALUES ($1) RETURNING *`,
    [upn]
  );
  const row = result.rows[0];
  return new User(row.user_id, row.upn);
};

module.exports = {
  getUserById,
  createUser,
};
