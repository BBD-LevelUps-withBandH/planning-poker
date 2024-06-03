const client = require('./databaseConnection');
const UserInRoom = require('../models/userInRoom');

const tableName = 'users_in_rooms';

const getAllUsersInRoom = async (roomId) => {
  const query = `
    SELECT users_in_rooms.user_in_room_id, users_in_rooms.user_id, users_in_rooms.room_id, users.upn 
    FROM users_in_rooms
    JOIN users ON users_in_rooms.user_id = users.user_id
    WHERE users_in_rooms.room_id = $1;
  `;

  const result = await client.query(query, [roomId]);
  return result.rows.map(row => new UserInRoom(row.user_in_room_id, row.upn));
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
