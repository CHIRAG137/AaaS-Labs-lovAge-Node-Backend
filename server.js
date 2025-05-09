const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

const PORT = process.env.PORT || 5000;

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Testing Socket Code
let users = new Map(); // socketId => { status: 'available' | 'inChat' }

const getAvailableUsers = () =>
  Array.from(users.entries())
    .filter(([_, data]) => data.status === "available")
    .map(([id]) => id);

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);
  users.set(socket.id, { status: "available" });

  // Notify clients
  io.emit("updateAvailableUsers", getAvailableUsers());

  socket.on("startChat", () => {
    users.set(socket.id, { status: "available" });
    matchUsers(); // Try matching
  });

  socket.on("endChat", () => {
    users.set(socket.id, { status: "available" });
    io.emit("updateAvailableUsers", getAvailableUsers());
  });

  socket.on("disconnect", () => {
    users.delete(socket.id);
    io.emit("updateAvailableUsers", getAvailableUsers());
  });

  function matchUsers() {
    const available = getAvailableUsers();

    while (available.length >= 2) {
      const [userA, userB] = [available.shift(), available.shift()];
      users.set(userA, { status: "inChat" });
      users.set(userB, { status: "inChat" });

      io.to(userA).emit("chatStarted", { partnerId: userB });
      io.to(userB).emit("chatStarted", { partnerId: userA });
    }

    io.emit("updateAvailableUsers", getAvailableUsers());
  }
});

server.listen(3001, () => console.log("Socket server running on port 3001"));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
