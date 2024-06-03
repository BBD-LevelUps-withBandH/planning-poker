const { createRoom, getRoomById } = require('../data/roomRepository');
const { getAllUsersInRoom, addUserToRoom } = require('../data/userInRoomRepository');
const { handleErrors } = require('../middlewares/errorHandler');
const { getAllTicketsInRoom } = require('../data/ticketRepository');

function roomController(router) {

  router.post(
    '/create',
    handleErrors(async (req, res) => {
      const { roomName, ownerId, closed } = req.body;
      const newRoom = await createRoom(roomName, ownerId, closed);
      res.status(201).json(newRoom);
    })
  );

  router.get(
    '/:id',
    handleErrors(async (req, res) => {
      const roomUUID = req.params.id;
      const room = await getRoomById(roomUUID);
      res.json(room);
    })
  );

  router.get(
    '/:uuid/users',
    handleErrors(async (req, res) => {
      const roomUuid = req.params.uuid;
      const usersInRoom = await getAllUsersInRoom(roomUuid);
      res.status(200).json(usersInRoom);
    })
  );

  router.post(
    '/:id/users',
    handleErrors(async (req, res) => {
      const roomId = req.params.id;
      const { userId } = req.body;
      const userInRoom = await addUserToRoom(userId, roomId);
      res.status(201).json(userInRoom);
    })
  );
  
  router.get(
    '/:roomId/tickets',
    handleErrors(async (req, res) => {
      const { roomId } = req.params;
      const tickets = await getAllTicketsInRoom(roomId);
      res.send(tickets);
    })
  );
}

module.exports = { roomController };
