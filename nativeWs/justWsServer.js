import http from 'http';
import { WebSocketServer } from 'ws';

const server = http.createServer((req, res) => {
  res.end('Hello World!');
});

const wss = new WebSocketServer({ server });

wss.on('headers', (headers, req) => {
  console.log(headers);
});

wss.on('connection', (ws, req) => {
  console.log('New WebSocket connection');
  ws.on('message', (message) => {
    console.log('Received message from client:', message.toString());
  });

  ws.send('Welcome to the WebSocket server!');
});

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
