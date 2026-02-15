import joinNs from './joinNs.js';
const socket = io('http://localhost:9000');

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

//listen for nsList, which is the list of namespaces that the server sent us
socket.on('nsList', (nsData) => {
  const lastNs = localStorage.getItem('lastNs');

  const namespacesDiv = document.querySelector('.namespaces');

  namespacesDiv.innerHTML = '';
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML += ` <div class="namespace" ns="${ns.endpoint}"><img src="${ns.image}"></div>`;
  });

  //add click listener to each namespace
  document.querySelectorAll('.namespace').forEach((elem) => {
    elem.addEventListener('click', (e) => {
      joinNs(elem, nsData);
    });
  });

  if (lastNs) {
    const elem = document.querySelector(`.namespace[ns="${lastNs}"]`);
    joinNs(elem, nsData);
  } else {
    joinNs(document.getElementsByClassName('namespace')[0], nsData);
  }
});
