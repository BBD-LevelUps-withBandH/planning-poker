const { getAllTickets, updateTicket, createTicket, getTicketById } = require('../data/ticketRepository');
const { handleErrors } = require('../middlewares/errorHandler');

function ticketController(router) {
  router.post(
    '/',
    handleErrors(async (req, res) => {
      const ticket = req.body;
      await updateTicket(ticket);
      res.sendStatus(204);
    })
  );

  router.get(
    '/',
    handleErrors(async (req, res) => {
      const tickets = await getAllTickets();
      res.send(tickets);
    })
  );

  router.post(
    '/create',
    handleErrors(async (req, res) => {
      const { ticketName, roomId } = req.body;
      const newTicket = await createTicket(ticketName, roomId);
      res.status(201).json(newTicket);
    })
  );

  router.get(
    '/:id',
    handleErrors(async (req, res) => {
      const ticketId = req.params.id;
      const ticket = await getTicketById(ticketId);
      res.json(ticket);
    })
  );
}

module.exports = { ticketController };
