// Map with rooms as keys and arrays that contain users as
// values
let rooms = new Map();

const roomExists = (room) => {
  return rooms.has(room);
};

const getRoomList = (room) => {
  return rooms.get(room);
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

module.exports = {
  roomExists,
  getRoomList,
  addRoom,
  addUserToRoom,
  removeUserFromRoom,
  roomsSize,
};
