const { createTicket, updateTicketReveal } = require('../data/ticketRepository');
const { handleErrors } = require('../middlewares/errorHandler');
const verifyToken  = require('../middlewares/auth-middleware.js');

function ticketController(router) {

  router.post(
    '/create', verifyToken,
    handleErrors(async (req, res) => {
      const { ticketName, roomUuid } = req.body;
      const upn = req.upn;
      const newTicket = await createTicket(ticketName, roomUuid, upn);
      if(!newTicket){
        res.status(403).send();
      } else {
        res.status(201).json(newTicket);
      }
    })
  );

  router.post(
    '/update', verifyToken,
    handleErrors(async (req, res) => {
      const { ticketId, revealed } = req.body;
      const upn = req.upn;
      let ticketID = await updateTicketReveal(ticketId, revealed, upn);
      res.status(201).json(ticketID);
    })
  );
}

module.exports = { ticketController };
