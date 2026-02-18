import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import namespaces from './data/namespaces.js';
import Room from './classes/Room.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);
const io = new Server(httpServer);

app.get('/change-namespace', (req, res) => {
  namespaces[0].addRoom(new Room(0, 'Deleted Articles', namespaces[0].id));
  io.of(namespaces[0].endpoint).emit('nsChange', namespaces[0]);
});

io.on('connection', (socket) => {
  socket.on('clientConnect', () => {
    socket.emit('nsList', namespaces);
  });
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (socket) => {
    socket.on('joinRoom', async (roomTitle, ackCallback) => {
      // ---------- FIND OLD ROOM ----------
      let oldRoom;
      socket.rooms.forEach((room) => {
        if (room !== socket.id) {
          oldRoom = room;
          console.log(`leaving room ${oldRoom}`);
        }
      });

      // ---------- LEAVE OLD ROOM ----------
      if (oldRoom) {
        socket.leave(oldRoom);

        const oldSockets = await io
          .of(namespace.endpoint)
          .in(oldRoom)
          .fetchSockets();

        io.of(namespace.endpoint).to(oldRoom).emit('updateMembers', {
          numUsers: oldSockets.length,
          room: oldRoom,
        });
      }

      // ---------- JOIN NEW ROOM ----------
      socket.join(roomTitle);

      const newSockets = await io
        .of(namespace.endpoint)
        .in(roomTitle)
        .fetchSockets();
      const count = newSockets.length;

      // reply to joining user
      ackCallback({ numUsers: count });

      // update everyone in new room
      io.of(namespace.endpoint).to(roomTitle).emit('updateMembers', {
        numUsers: count,
        room: roomTitle,
      });

      socket.on('newMessageToRoom', (msg) => {
        //broadcast to everyone  this room that there is a new message
        //how do we know which room the user is in? socket.rooms gives us a Set of rooms that this socket is in, including its own room with its id. So we just need to find the room that is not the socket.id
        const rooms = socket.rooms;
        const currentRoom = [...rooms][1];
        io.of(namespace.endpoint).in(currentRoom).emit('messageToRoom', msg);
      });
    });
  });
});

httpServer.listen(9000, () => {
  console.log('Server running on port 9000');
});
