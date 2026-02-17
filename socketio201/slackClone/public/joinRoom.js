import { namespaceSocket } from './scripts.js';

const joinRoom = (roomTitle, namespaceId) => {
  console.log(`joining room ${roomTitle} in namespace ${namespaceId}`);
  namespaceSocket[namespaceId].emit('joinRoom', roomTitle);
};

export default joinRoom;
