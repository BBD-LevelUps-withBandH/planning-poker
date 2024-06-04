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

const createTicket = async (ticketName, room_Uuid) => {
  const result = await client.query(
    `INSERT INTO ${tableName} (ticket_name, room_id) VALUES ($1, SELECT room_id FROM rooms WHERE room_uuid = $2) RETURNING *`,
    [ticketName, room_Uuid]
  );
  const row = result.rows[0];
  return new Ticket(row.ticket_id, row.ticket_name, row.room_id);
};

const updateTicketReveal = async (ticketId, revealed) => {
  const query = `
  UPDATE ${tableName}
  SET revealed = $1
  WHERE ticket_id = $2
`;

  await client.query(query, [revealed, ticketId]);
}

module.exports = {
  getAllTicketsInRoom,
  createTicket,
  updateTicketReveal,
};
