const client = require('./databaseConnection');
const Ticket = require('../models/ticket');

const tableName = 'tickets';

const getAllTicketsInRoom = async (roomId) => {
  const query = `
    SELECT * FROM ${tableName} WHERE room_id = $1`;
  const result = await client.query(query, [roomId]);
  return result.rows.map(row => new Ticket(row.ticket_id, row.ticket_name, row.room_id));
};

const getTicketById = async (ticketId) => {
  const result = await client.query(`SELECT * FROM ${tableName} WHERE ticket_id = $1`, [ticketId]);
  if (result.rows.length === 0) {
    throw new Error(`Ticket with ID ${ticketId} not found`);
  }
  const row = result.rows[0];
  return new Ticket(row.ticket_id, row.ticket_name, row.room_id);
};

const updateTicket = async (ticket) => {
  const { ticketId, ticketName, roomId } = ticket;
  await client.query(
    `UPDATE ${tableName} SET ticket_name = $1, room_id = $2 WHERE ticket_id = $3`,
    [ticketName, roomId, ticketId]
  );
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
  getTicketById,
  updateTicket,
  createTicket,
};
