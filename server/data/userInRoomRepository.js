const client = require('./databaseConnection');
const UserInRoom = require('../models/userInRoom');

const tableName = 'users_in_rooms';
const userTableName = 'users'
const roomTableName = 'rooms';

const getAllUsersInRoom = async (roomUuid) => {
  const query = `
    SELECT uir.user_in_room_id, uir.user_id, uir.room_id, u.upn 
    FROM ${tableName} uir
    JOIN ${userTableName} u ON uir.user_id = u.user_id
    JOIN ${roomTableName} r ON uir.room_id = r.room_id
    WHERE r.room_uuid = $1;
  `;

  const result = await client.query(query, [roomUuid]);
  return result.rows.map(row => new UserInRoom(row.user_in_room_id, row.upn));
};

const addUserToRoom = async (userId, roomUuid) => {
  const query = `
    INSERT INTO ${tableName} (user_id, room_id)
    VALUES ($1, (SELECT room_id FROM ${roomTableName} WHERE room_uuid = $2))
    RETURNING user_in_room_id, user_id, room_id;
  `;

  const result = await client.query(query, [userId, roomUuid]);
  const row = result.rows[0];

  const userQuery = `SELECT upn FROM ${userTableName} WHERE user_id = $1`;
  const userResult = await client.query(userQuery, [userId]);
  const userUpn = userResult.rows[0].upn;

  return new UserInRoom(row.user_in_room_id, row.user_id, row.room_id, userUpn);
};

module.exports = {
  getAllUsersInRoom,
  addUserToRoom,
};
