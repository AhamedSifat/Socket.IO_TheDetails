import http from 'http';
import { WebSocketServer } from 'ws';

const server = http.createServer((req, res) => {
  res.end('Hello World!');
});

const wss = new WebSocketServer({ server });

server.listen(8080, () => {
  console.log('Server is listening on port 8080');
});
