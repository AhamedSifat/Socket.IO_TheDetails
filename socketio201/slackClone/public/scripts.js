const socket = io('http://localhost:9000');

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});
