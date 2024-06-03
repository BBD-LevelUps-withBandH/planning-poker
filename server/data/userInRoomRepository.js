const client = require('./databaseConnection');
const UserInRoom = require('../models/userInRoom');

const tableName = 'users_in_rooms';
const userTableName = 'users'
const roomTableName = 'rooms';

const getAllUsersInRoom = async (roomUuid) => {
  const query = `
    SELECT uir.user_in_room_id, uir.user_id, uir.room_id, u.upn 
    FROM ${tableName} uir
    JOIN ${userTableName} u ON uir.upn = u.upn
    JOIN ${roomTableName} r ON uir.room_id = r.room_id
    WHERE r.room_uuid = $1;
  `;

  const result = await client.query(query, [roomUuid]);
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
