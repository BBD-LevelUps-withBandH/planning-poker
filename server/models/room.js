class Room {
    constructor(roomId, roomName, ownerId, closed = false) {
      this.roomId = roomId;
      this.roomName = roomName;
      this.ownerId = ownerId;
      this.closed = closed;
    }
  }
  
  module.exports = Room;
  