const { createTicket } = require('../data/ticketRepository');
const { handleErrors } = require('../middlewares/errorHandler');

function ticketController(router) {

  router.post(
    '/create',
    handleErrors(async (req, res) => {
      const { ticketName, roomId } = req.body;
      const newTicket = await createTicket(ticketName, roomId);
      res.status(201).json(newTicket);
    })
  );
}

module.exports = { ticketController };
