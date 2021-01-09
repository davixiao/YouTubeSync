let clients = [];

// Client joins
const clientJoin = (id, username, room) => {
  const client = { id, username, room };
  clients.push(client);
  return client;
};

// Retrieve client
const getCurrentClient = (id) => {
  return clients.find((client) => client.id === id);
};

// Client leaves
const clientLeave = (id) => {
  const ind = clients.findIndex((user) => user.id === id);
  const left = clients[ind];
  clients.splice(ind, 1);

  //clients = clients.filter((client) => client.id !== id);
  return left;
};

// Get room users
function getRoomClients(room) {
  return clients.filter((client) => client.room === room);
}

module.exports = {
  clientJoin,
  getCurrentClient,
  clientLeave,
  getRoomClients,
  clients,
};
