const client = require('./databaseConnection');
const Ticket = require('../models/ticket');

const tableName = 'tickets';
const roomTableName = 'rooms';

const getAllTicketsInRoom = async (roomUuid) => {
  const query = `
    SELECT t.ticket_id, t.ticket_name, t.revealed
    FROM ${tableName} t
    JOIN ${roomTableName} r ON t.room_id = r.room_id
    WHERE r.room_uuid = $1;
  `;

  const result = await client.query(query, [roomUuid]);
  return result.rows.map(row => new Ticket(row.ticket_id, row.ticket_name, row.revealed));
};

const createTicket = async (ticketName, roomId) => {
  const result = await client.query(
    `INSERT INTO ${tableName} (ticket_name, room_id) VALUES ($1, $2) RETURNING *`,
    [ticketName, roomId]
  );
  const row = result.rows[0];
  return new Ticket(row.ticket_id, row.ticket_name, row.room_id);
};

module.exports = {
  getAllTicketsInRoom,
  createTicket,
};
