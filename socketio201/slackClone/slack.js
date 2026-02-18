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
    });
  });
});

httpServer.listen(9000, () => {
  console.log('Server running on port 9000');
});
