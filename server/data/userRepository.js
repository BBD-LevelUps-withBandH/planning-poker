const client = require('../models/db');
const User = require('../models/user');

const tableName = 'users';

const getAllUsers = async () => {
  try {
    const result = await client.query(`SELECT * FROM ${tableName}`);
    return result.rows.map(row => new User(row.user_id, row.upn));
  } catch (err) {
    console.error('Error fetching users:', err);
    throw err;
  }
};

const getUserById = async (userId) => {
  try {
    const result = await client.query(`SELECT * FROM ${tableName} WHERE user_id = $1`, [userId]);
    if (result.rows.length === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }
    const row = result.rows[0];
    return new User(row.user_id, row.upn);
  } catch (err) {
    console.error(`Error fetching user by ID (${userId}):`, err);
    throw err;
  }
};

const updateUser = async (user) => {
  const { userId, upn } = user;
  try {
    await client.query(
      `UPDATE ${tableName} SET upn = $1 WHERE user_id = $2`,
      [upn, userId]
    );
  } catch (err) {
    console.error(`Error updating user with ID (${userId}):`, err);
    throw err;
  }
};

const createUser = async (upn) => {
  try {
    const result = await client.query(
      `INSERT INTO ${tableName} (upn) VALUES ($1) RETURNING *`,
      [upn]
    );
    const row = result.rows[0];
    return new User(row.user_id, row.upn);
  } catch (err) {
    console.error('Error creating user:', err);
    throw err;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
  createUser,
};
