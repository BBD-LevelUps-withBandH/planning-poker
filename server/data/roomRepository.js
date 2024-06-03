const client = require('./databaseConnection');
const Room = require('../models/room');

const tableName = 'rooms';

const getRoomById = async (roomUUID) => {
  const result = await client.query(`SELECT owner_id FROM ${tableName} WHERE room_uuid = $1`, [roomUUID]);
  if (result.rows.length === 0) {
    throw new Error(`Room with ID ${roomUUID} not found`);
  }
  const row = result.rows[0];
  return {ownerId: row.owner_id};
};

const createRoom = async (roomName, ownerId, closed = false) => {
  const result = await client.query(
    `INSERT INTO ${tableName} (room_name, owner_id, closed) VALUES ($1, $2, $3) RETURNING *`,
    [roomName, ownerId, closed]
  );
  const row = result.rows[0];
  return new Room(row.room_id, row.room_name, row.owner_id, row.closed);
};

module.exports = {
  getRoomById,
  createRoom,
};
