const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3001 });

let clients = new Set();
let displayHistory = [];

server.on("connection", (socket) => {
  clients.add(socket);
  console.log(`New client added. Total Client : ${clients.size}`);
});

server.on("close", () => {
  clients.delete(socket);
  console.log(`Client disconnected. Total : ${clients.size}`);
});

console.log(`Websocket running on port 3001`);
