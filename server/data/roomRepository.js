const client = require('./databaseConnection');
const Room = require('../models/room');

const tableName = 'rooms';
const userTableName = 'users';

const getRoomByUuid = async (roomUUID) => {
  const query = await client.query(`SELECT owner_id FROM ${tableName} WHERE room_uuid = $1`, [roomUUID]);
  if (query.rows.length === 0) {
    throw new Error(`Room with ID ${roomUUID} not found`);
  }
  const row = query.rows[0];
  return {ownerId: row.owner_id};
};

const createRoom = async (roomName, upn, closed = false) => {
  const userQuery = `SELECT user_id FROM ${userTableName} WHERE upn = $1`;
  const userResult = await client.query(userQuery, [upn]);
  const ownerId = userResult.rows[0].user_id;

  const roomQuery = `
    INSERT INTO ${tableName} (room_name, owner_id, closed)
    VALUES ($1, $2, $3) RETURNING *;
  `;
  const roomResult = await client.query(roomQuery, [roomName, ownerId, closed]);
  const row = roomResult.rows[0];

  return new Room(row.room_id, row.room_uuid, row.room_name, ownerId, row.closed, upn, row.current_ticket_id);
};

module.exports = {
  getRoomByUuid,
  createRoom,
};
