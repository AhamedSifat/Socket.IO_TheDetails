import { namespaceSocket } from './scripts.js';
import buildMessageHTML from './buildMessageHtml.js';

const joinRoom = async (roomTitle, namespaceId) => {
  console.log(`joining room ${roomTitle} in namespace ${namespaceId}`);
  // namespaceSocket[namespaceId].emit('joinRoom', roomTitle, (ackResponse) => {
  //   const currRoomNumUsers = document.querySelector('.curr-room-num-users');
  //   currRoomNumUsers.innerHTML = ` <span class="fa-solid fa-user"></span> ${ackResponse.numUsers}`;
  //   document.querySelector('.curr-room-text').innerText = roomTitle;
  // });

  const ackResponse = await namespaceSocket[namespaceId].emitWithAck(
    'joinRoom',
    { roomTitle, namespaceId },
  );
  const currRoomNumUsers = document.querySelector('.curr-room-num-users');
  currRoomNumUsers.innerHTML = ` <span class="fa-solid fa-user"></span> ${ackResponse.numUsers}`;
  document.querySelector('.curr-room-text').innerText = roomTitle;

  //load history
  document.querySelector('#messages').innerHTML = '';
  ackResponse.history.forEach((msg) => {
    document.querySelector('#messages').innerHTML += buildMessageHTML(msg);
  });
};

export default joinRoom;
