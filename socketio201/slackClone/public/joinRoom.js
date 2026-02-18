import { namespaceSocket } from './scripts.js';

const joinRoom = (roomTitle, namespaceId) => {
  console.log(`joining room ${roomTitle} in namespace ${namespaceId}`);
  namespaceSocket[namespaceId].emit('joinRoom', roomTitle, (ackResponse) => {
    const currRoomNumUsers = document.querySelector('.curr-room-num-users');
    currRoomNumUsers.innerHTML = ` <span class="fa-solid fa-user"></span> ${ackResponse.numUsers}`;
    document.querySelector('.curr-room-text').innerText = roomTitle;
  });
};

export default joinRoom;
