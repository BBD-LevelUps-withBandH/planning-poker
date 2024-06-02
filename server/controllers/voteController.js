const { getAllVotes, getVotesByTicketId, createVote } = require('../data/voteRepository');
const { handleErrors } = require('../middlewares/errorHandler');

function voteController(router) {
  router.get(
    '/',
    handleErrors(async (req, res) => {
      const votes = await getAllVotes();
      res.send(votes);
    })
  );

  router.get(
    '/ticket/:ticketId',
    handleErrors(async (req, res) => {
      const ticketId = req.params.ticketId;
      const votes = await getVotesByTicketId(ticketId);
      res.send(votes);
    })
  );

  router.post(
    '/create',
    handleErrors(async (req, res) => {
      const { userInRoomId, voteTypeId, ticketId } = req.body;
      const newVote = await createVote(userInRoomId, voteTypeId, ticketId);
      res.status(201).json(newVote);
    })
  );
}

module.exports = { voteController };
