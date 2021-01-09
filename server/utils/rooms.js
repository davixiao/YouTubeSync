// Map with rooms as keys and arrays that contain users as
// values
let rooms = new Map();

const roomExists = (room) => {
  return rooms.has(room);
};

const getRoomFromUser = (userId) => {
  for (let [key, value] of rooms.entries()) {
    for (let user of value) {
      if (user === userId) return key;
    }
  }
  return null;
};

const addRoom = (room, userId) => {
  rooms.set(room, [userId]);
};

const addUserToRoom = (room, userId) => {
  rooms.get(room).push(userId);
};

const removeUserFromRoom = (room, userId) => {
  const newRoom = rooms.get(room).filter((user) => user !== userId);
  rooms.delete(room);
  if (newRoom.length === 0) return;
  rooms.set(room, newRoom);
};

const roomsSize = () => {
  return rooms.size;
};

const getLeader = (room) => {
  if (room) {
    console.log(room);
    return rooms.get(room)[0];
  }
  return null;
};

module.exports = {
  roomExists,
  getRoomFromUser,
  addRoom,
  addUserToRoom,
  removeUserFromRoom,
  roomsSize,
  getLeader,
};
