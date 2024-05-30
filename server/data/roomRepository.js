const client = require('./databaseConnection');
const Room = require('../models/room');

const tableName = 'rooms';

const getAllRooms = async () => {
  const result = await client.query(`SELECT * FROM ${tableName}`);
  return result.rows.map(row => new Room(row.room_id, row.room_name, row.owner_id, row.closed));
};

const getRoomById = async (roomId) => {
  const result = await client.query(`SELECT * FROM ${tableName} WHERE room_id = $1`, [roomId]);
  if (result.rows.length === 0) {
    throw new Error(`Room with ID ${roomId} not found`);
  }
  const row = result.rows[0];
  return new Room(row.room_id, row.room_name, row.owner_id, row.closed);
};

const updateRoom = async (room) => {
  const { roomId, roomName, ownerId, closed } = room;
  await client.query(
    `UPDATE ${tableName} SET room_name = $1, owner_id = $2, closed = $3 WHERE room_id = $4`,
    [roomName, ownerId, closed, roomId]
  );
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
  getAllRooms,
  getRoomById,
  updateRoom,
  createRoom,
};
