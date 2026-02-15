const socket = io('http://localhost:9000');

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

//listen for nsList, which is the list of namespaces that the server sent us
socket.on('nsList', (nsData) => {
  const namespacesDiv = document.querySelector('.namespaces');
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += ` <div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
  });

  //add click listener to each namespace
  document.querySelectorAll('.namespace').forEach((elem) => {
    elem.addEventListener('click', (e) => {
      const nsEndpoint = elem.getAttribute('ns');
      const clickedNs = nsData.find((ns) => ns.endpoint === nsEndpoint);
      const rooms = clickedNs.rooms;
      let roomList = document.querySelector('.room-list');
      roomList.innerHTML = '';

      rooms.forEach((room) => {
        roomList.innerHTML += ` <li><span class="glyphicon glyphicon-lock"></span>${room.roomTitle}</li>`;
      });
    });
  });
});
