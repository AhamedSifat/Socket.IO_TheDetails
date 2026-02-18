import joinNs from './joinNs.js';
const socket = io('http://localhost:9000');

export const namespaceSocket = [];
const listers = {
  nsChange: [],
};

const addListeners = (nsId) => {
  if (!listers.nsChange[nsId]) {
    namespaceSocket[nsId].on('nsChange', (newNsData) => {
      console.log('namespace has changed');
      console.log(newNsData);
    });

    namespaceSocket[nsId].on('updateMembers', (data) => {
      if (document.querySelector('.curr-room-text').innerText === data.room) {
        document.querySelector('.curr-room-num-users').innerHTML =
          `<span class="fa-solid fa-user"></span> ${data.numUsers}`;
      }
    });

    listers.nsChange[nsId] = true;
  } else {
    console.log('already listening to nsChange for this namespace');
  }
};

socket.on('connect', () => {
  socket.emit('clientConnect');
});

//listen for nsList, which is the list of namespaces that the server sent us
socket.on('nsList', (nsData) => {
  const lastNs = localStorage.getItem('lastNs');
  const namespacesDiv = document.querySelector('.namespaces');

  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += ` <div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
    //join this namespace with io

    if (!namespaceSocket[ns.id]) {
      namespaceSocket[ns.id] = io(`http://localhost:9000${ns.endpoint}`);
    }
    addListeners(ns.id);
  });

  //add click listener to each namespace
  document.querySelectorAll('.namespace').forEach((element) => {
    element.addEventListener('click', (e) => {
      joinNs(element, nsData);
    });
  });

  if (lastNs) {
    const elem = document.querySelector(`.namespace[ns="${lastNs}"]`);
    joinNs(elem, nsData);
  } else {
    joinNs(document.getElementsByClassName('namespace')[0], nsData);
  }
});
