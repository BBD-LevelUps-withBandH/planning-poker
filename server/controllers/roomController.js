const { createRoom, getRoomByUuid, updateRoomTicket } = require('../data/roomRepository');
const { getAllUsersInRoom, addUserToRoom } = require('../data/userInRoomRepository');
const { handleErrors } = require('../middlewares/errorHandler');
const { getAllTicketsInRoom } = require('../data/ticketRepository');
const verifyToken  = require('../middlewares/auth-middleware.js');

function roomController(router) {

  router.post(
    '/create', verifyToken,
    handleErrors(async (req, res) => {
      const { roomName, closed } = req.body;
      const upn = req.upn;
      const newRoom = await createRoom(roomName, upn, closed);
      res.status(201).json(newRoom);
    })
  );

  router.get(
    '/:uuid', verifyToken,
    handleErrors(async (req, res) => {
      const roomUUID = req.params.uuid;
      const room = await getRoomByUuid(roomUUID);
      res.json(room);
    })
  );

  router.get(
    '/:uuid/users', verifyToken,
    handleErrors(async (req, res) => {
      const roomUuid = req.params.uuid;
      const usersInRoom = await getAllUsersInRoom(roomUuid);
      res.status(200).json(usersInRoom);
    })
  );

  router.post(
    '/:uuid/users', verifyToken,
    handleErrors(async (req, res) => {
      const roomUuid = req.params.uuid;
      const upn = req.upn;
      const userInRoom = await addUserToRoom(upn, roomUuid);
      res.status(201).json(userInRoom);
    })
  );

  router.get(
    '/:uuid/tickets', verifyToken,
    handleErrors(async (req, res) => {
      const roomUuid = req.params.uuid;
      const tickets = await getAllTicketsInRoom(roomUuid);
      res.send(tickets);
    })
  );

  router.post(
    '/:uuid/ticket', verifyToken,
    handleErrors(async (req, res) => {
      const roomUuid = req.params.uuid;
      const {ticketId} = req.body;
      const upn = req.upn;
      const roomUUID = await updateRoomTicket(roomUuid, ticketId, upn);
      res.status(201).json(roomUUID);
    })
  );
}

module.exports = { roomController };
