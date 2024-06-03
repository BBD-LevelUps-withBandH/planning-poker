class Room {
    constructor(roomId, roomUuid, roomName, ownerId, closed = false) {
      this.roomId = roomId;
      this.roomUuid = roomUuid
      this.roomName = roomName;
      this.ownerId = ownerId;
      this.closed = closed;
    }
  }
  
  module.exports = Room;
  