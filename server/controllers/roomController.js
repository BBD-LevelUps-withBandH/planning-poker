const { getAllRooms, updateRoom, createRoom, getRoomById } = require('../data/roomRepository');
const { getAllUsersInRoom, addUserToRoom, removeUserFromRoom } = require('../data/userInRoomRepository');
const { handleErrors } = require('../middlewares/errorHandler');
const { getAllTicketsInRoom } = require('../data/ticketRepository');

function roomController(router) {
  router.post(
    '/',
    handleErrors(async (req, res) => {
      const room = req.body;
      await updateRoom(room);
      res.sendStatus(204);
    })
  );

  router.get(
    '/',
    handleErrors(async (req, res) => {
      const rooms = await getAllRooms();
      res.send(rooms);
    })
  );

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
      const roomId = req.params.id;
      const room = await getRoomById(roomId);
      res.json(room);
    })
  );

  router.get(
    '/:id/users',
    handleErrors(async (req, res) => {
      const roomId = req.params.id;
      const usersInRoom = await getAllUsersInRoom(roomId);
      res.send(usersInRoom);
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

  router.delete(
    '/:roomId/users/:userInRoomId',
    handleErrors(async (req, res) => {
      const { roomId, userInRoomId } = req.params;
      await removeUserFromRoom(userInRoomId);
      res.sendStatus(204);
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
