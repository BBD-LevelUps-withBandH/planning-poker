const client = require('./databaseConnection');
const User = require('../models/user');

const tableName = 'users';

const getAllUsers = async () => {
  const result = await client.query(`SELECT * FROM ${tableName}`);
  return result.rows.map(row => new User(row.user_id, row.upn));
};

const getUserById = async (userId) => {
  const result = await client.query(`SELECT * FROM ${tableName} WHERE user_id = $1`, [userId]);
  if (result.rows.length === 0) {
    throw new Error(`User with ID ${userId} not found`);
  }
  const row = result.rows[0];
  return new User(row.user_id, row.upn);
};

const updateUser = async (user) => {
  const { userId, upn } = user;
  await client.query(
    `UPDATE ${tableName} SET upn = $1 WHERE user_id = $2`,
    [upn, userId]
  );
};

const createUser = async (upn) => {
  const result = await client.query(
    `INSERT INTO ${tableName} (upn) VALUES ($1) RETURNING *`,
    [upn]
  );
  const row = result.rows[0];
  return new User(row.user_id, row.upn);
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  createUser,
};
