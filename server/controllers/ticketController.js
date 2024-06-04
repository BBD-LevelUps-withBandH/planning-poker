const { createTicket } = require('../data/ticketRepository');
const { handleErrors } = require('../middlewares/errorHandler');
const verifyToken  = require('../middlewares/auth-middleware.js');

function ticketController(router) {

  router.post(
    '/create', verifyToken,
    handleErrors(async (req, res) => {
      const { ticketName, roomId } = req.body;
      const newTicket = await createTicket(ticketName, roomId);
      res.status(201).json(newTicket);
    })
  );
}

module.exports = { ticketController };
