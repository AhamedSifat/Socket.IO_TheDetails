import joinNs from './joinNs.js';
const socket = io('http://localhost:9000');

let username = 'Sifat';

export const namespaceSocket = [];
const listeners = {
  nsChange: [],
  messageToRoom: [],
};

//a global variable we can update when the user clicks on a namespaces
export let selectedNsId = 0;

export const setSelectedNsId = (id) => {
  selectedNsId = id;
};

//add a submit listener to the message form
document.querySelector('#message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const newMessage = document.querySelector('#user-message').value;
  namespaceSocket[selectedNsId].emit('newMessageToRoom', {
    text: newMessage,
    date: new Date(),
    avatar: 'https://via.placeholder.com/30',
    username: username,
  });
  document.querySelector('#user-message').value = '';
});

//addListener job is to manage all listeners added to add namespace
//this prevents us from adding duplicate listeners when we rejoin a namespace that we have already joined before

const addListeners = (nsId) => {
  if (!listeners.nsChange[nsId]) {
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

    listeners.nsChange[nsId] = true;
  }

  if (!listeners.messageToRoom[nsId]) {
    namespaceSocket[nsId].on('messageToRoom', (msg) => {
      console.log(msg);
    });
    listeners.messageToRoom[nsId] = true;
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
