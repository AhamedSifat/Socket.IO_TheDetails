import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import namespaces from './data/namespaces.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));

const httpServer = createServer(app);
const io = new Server(httpServer);

io.on('connection', (socket) => {
  socket.on('clientConnect', () => {
    socket.emit('nsList', namespaces);
  });
});

namespaces.forEach((namespace) => {
  io.of(namespace.endpoint).on('connection', (socket) => {
    console.log(`${socket.id} has connected to ${namespace.endpoint}`);
  });
});

httpServer.listen(9000, () => {
  console.log('Server running on port 9000');
});
