const client = require('./databaseConnection');
const Vote = require('../models/vote');

const tableName = 'votes';

const getAllVotes = async () => {
  const result = await client.query(`SELECT * FROM ${tableName}`);
  return result.rows.map(row => new Vote(row.vote_id, row.user_in_room_id, row.vote_type_id, row.ticket_id));
};

const getVotesByTicketId = async (ticketId) => {
  const result = await client.query(`SELECT * FROM ${tableName} WHERE ticket_id = $1`,[ticketId]);
  return result.rows.map(row => new Vote(row.vote_id, row.user_in_room_id, row.vote_type_id, row.ticket_id));
};

const createVote = async (userInRoomId, voteTypeId, ticketId) => {
  const result = await client.query(
    `INSERT INTO ${tableName} (user_in_room_id, vote_type_id, ticket_id) VALUES ($1, $2, $3) RETURNING *`,
    [userInRoomId, voteTypeId, ticketId]
  );
  const row = result.rows[0];
  return new Vote(row.vote_id, row.user_in_room_id, row.vote_type_id, row.ticket_id);
};

module.exports = {
  getAllVotes,
  getVotesByTicketId,
  createVote,
};