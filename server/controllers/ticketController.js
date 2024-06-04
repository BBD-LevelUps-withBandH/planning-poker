const { createTicket, updateTicketReveal } = require('../data/ticketRepository');
const { handleErrors } = require('../middlewares/errorHandler');
const verifyToken  = require('../middlewares/auth-middleware.js');

function ticketController(router) {

  router.post(
    '/create', verifyToken,
    handleErrors(async (req, res) => {
      const { ticketName, roomUuid } = req.body;
      const newTicket = await createTicket(ticketName, roomUuid);
      res.status(201).json(newTicket);
    })
  );

  router.post(
    '/update', verifyToken,
    handleErrors(async (req, res) => {
      const { ticketId, revealed } = req.body;
      await updateTicketReveal(ticketId, revealed);
      res.status(204);
    })
  );
}

module.exports = { ticketController };
