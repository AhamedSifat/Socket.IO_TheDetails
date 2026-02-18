import joinRoom from './JoinRoom.js';
import { setSelectedNsId } from './scripts.js';
const joinNs = (element, nsData) => {
  const nsEndpoint = element.getAttribute('ns');
  const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);
  setSelectedNsId(clickedNs.id);
  const rooms = clickedNs.rooms;
  let roomList = document.querySelector('.room-list');
  roomList.innerHTML = '';

  //init first room as active
  let firstRoom;

  rooms.forEach((room, i) => {
    if (i === 0) {
      firstRoom = room.roomTitle;
    }
    roomList.innerHTML += ` <li class="room" namespaceId=${room.namespaceId}><span class="fa-solid fa-${room.privateRoom ? 'lock' : 'globe'}"></span>${room.roomTitle}</li>`;
  });

  //init join first room
  joinRoom(firstRoom, clickedNs.id);

  //add click listener to each room
  const roomNodes = document.querySelectorAll('.room');
  roomNodes.forEach((element) => {
    element.addEventListener('click', (e) => {
      const namespaceId = element.getAttribute('namespaceId');
      joinRoom(e.target.innerText, namespaceId);
    });
  });

  localStorage.setItem('lastNs', nsEndpoint);
};

export default joinNs;
