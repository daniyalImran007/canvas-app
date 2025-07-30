const WebSocket = require("ws");
const server = new WebSocket.Server({ port: 3001 });

let clients = new Set();
let displayHistory = [];

server.on("connection", (socket) => {
  clients.add(socket);
  console.log(`New client added. Total Client : ${clients.size}`);

  socket.on("message", (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (error) {
      console.log(error);
    }
    if (message.type === "draw") {
      displayHistory.push(message.payload);
      clients.send(
        JSON.stringify({
          type: "draw",
          message: JSON.stringify(message.payload),
        })
      );
    }
  });
});

server.on("close", () => {
  clients.delete(socket);
  console.log(`Client disconnected. Total : ${clients.size}`);
});

console.log(`Websocket running on port 3001`);
