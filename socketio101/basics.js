import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.static('public'));

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
  socket.emit('messageFromServer', {
    message: 'Welcome to the Socket.IO server!',
  });
  socket.on('messageFromClient', (data) => {
    console.log('Received message from client:', data);
  });
});

httpServer.listen(3000, () => {
  console.log('Server is running on port 3000');
});
