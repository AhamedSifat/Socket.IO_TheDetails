import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();

app.use(express.static('public'));

const httpServer = createServer(app);

const io = new Server(httpServer);

/* ==============================
   DEFAULT NAMESPACE ("/")
============================== */

io.on('connection', (socket) => {
  // This runs every time a new client connects to default namespace

  // Join the socket to a room named "chat"
  socket.join('chat');

  // Send a message to ALL users inside "chat" room
  io.to('chat').emit('welcomeToChatRoom', {
    data: 'A new user has joined the chat!',
  });

  // Send a message ONLY to the connected client
  socket.emit('messageFromServer', {
    data: 'Welcome to the server!',
  });

  // Listen for message from client
  socket.on('newMessageToServer', (message) => {
    // Broadcast the message to ALL connected clients
    io.emit('newMessageToClients', {
      text: message.text,
    });
  });
});

/* ==============================
   ADMIN NAMESPACE ("/admin")
============================== */

// Create a separate namespace
const adminNamespace = io.of('/admin');

adminNamespace.on('connection', (socket) => {
  // This runs when someone connects to "/admin"

  console.log(socket.id + ' has joined /admin');

  // Join the socket to a room named "chat"
  // NOTE: This "chat" room is DIFFERENT from default namespace "chat"
  socket.join('chat');

  // Emit message only inside "/admin" namespace's "chat" room
  adminNamespace.to('chat').emit('welcomeToChatRoom', {});
});

/* ==============================
   START SERVER
============================== */

httpServer.listen(8000, () => {
  console.log('Server is running on port 8000');
});
