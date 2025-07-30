const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3001 });

let clients = new Set();
let drawHistory = [];

server.on("connection", (socket) => {
  clients.add(socket);
  console.log("New client connected. Total:", clients.size);

  socket.send(JSON.stringify({ type: "init", payload: drawHistory }));

  broadcast({ type: "userCount", payload: clients.size });

  socket.on("message", (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (err) {
      return;
    }

    if (message.type === "draw") {
      drawHistory.push(message.payload);
      broadcast(message, socket); // send to all except sender
    }
  });

  socket.on("close", () => {
    clients.delete(socket);
    console.log("Client disconnected. Total:", clients.size);
    broadcast({ type: "userCount", payload: clients.size });
  });
});

function broadcast(msg, excludeSocket = null) {
  const data = JSON.stringify(msg);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client !== excludeSocket) {
      client.send(data);
    }
  });
}

console.log("WebSocket server running on ws://localhost:3001");
