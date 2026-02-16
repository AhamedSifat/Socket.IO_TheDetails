import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.static('public'));

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.emit('messageFromServer', { data: 'Welcome to the server!' });

  socket.on('newMessageToServer', (message) => {
    io.emit('newMessageToClients', { text: message.text });
  });
});

const adminNamespace = io.of('/admin');

adminNamespace.on('connection', (socket) => {
  console.log(socket.id + 'has joined /admin');
});

httpServer.listen(8000, () => {
  console.log('Server is running on port 8000');
});
