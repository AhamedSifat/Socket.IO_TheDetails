const userName = prompt('Enter your username:');
const password = prompt('Enter your password:');

const socket = io('http://localhost:9000');

socket.on('connect', () => {
  console.log('Connected to server with ID:', socket.id);
});

//listen for nsList, which is the list of namespaces that the server sent us
socket.on('nsList', (nsData) => {
   const namespacesDiv = document.querySelector('.namespaces')
  nsData.forEach((ns) => {
    namespacesDiv.innerHTML +=
      ` <div class="namespace" ns="${ns.name}"><img src="${ns.img}"></div>`;
  });
});
