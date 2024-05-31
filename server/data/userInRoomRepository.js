const client = require('./databaseConnection');
const UserInRoom = require('../models/userInRoom');

const tableName = 'users_in_rooms';

const getAllUsersInRoom = async (roomId) => {
  const result = await client.query(`SELECT * FROM ${tableName} WHERE room_id = $1`, [roomId]);
  return result.rows.map(row => new UserInRoom(row.user_in_room_id, row.user_id, row.room_id));
};

const addUserToRoom = async (userId, roomId) => {
  const result = await client.query(
    `INSERT INTO ${tableName} (user_id, room_id) VALUES ($1, $2) RETURNING *`,
    [userId, roomId]
  );
  const row = result.rows[0];
  return new UserInRoom(row.user_in_room_id, row.user_id, row.room_id);
};

const removeUserFromRoom = async (userInRoomId) => {
  await client.query(`DELETE FROM ${tableName} WHERE user_in_room_id = $1`, [userInRoomId]);
};

module.exports = {
  getAllUsersInRoom,
  addUserToRoom,
  removeUserFromRoom,
};
