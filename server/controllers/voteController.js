const { getVotesByTicketId, createVote } = require('../data/voteRepository');
const { handleErrors } = require('../middlewares/errorHandler');

function voteController(router) {

  router.get(
    '/ticket/:ticketId', verifyToken,
    handleErrors(async (req, res) => {
      const ticketId = req.params.ticketId;
      const votes = await getVotesByTicketId(ticketId);
      res.send(votes);
    })
  );

  router.post(
    '/create', verifyToken,
    handleErrors(async (req, res) => {
      const { userInRoomId, voteTypeId, ticketId } = req.body;
      const newVote = await createVote(userInRoomId, voteTypeId, ticketId);
      res.status(201).json(newVote);
    })
  );
}

module.exports = { voteController };
