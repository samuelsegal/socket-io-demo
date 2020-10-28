const socket = io('http://localhost:9000');
const adminSocket = io('http://localhost:9000/admin');
socket.on('messageFromServer', (dataFromServer) => {
	console.log(dataFromServer);
	socket.emit('messageToServer', { data: 'this is msg from client' });
});

socket.on('connect', () => {
	console.log(`socket id: ${socket.id}`);
});
adminSocket.on('connect', () => {
	console.log(`adminSocket id: ${adminSocket.id}`);
});
adminSocket.on('welcome', (msg) => {
	console.log(msg);
});
document.querySelector('#message-form').addEventListener('submit', (event) => {
	event.preventDefault();
	console.log('submitted');
	const newMessage = document.querySelector('#user-message').value;
	socket.emit('newMessageToServer', { text: newMessage });
});
socket.on('messageToClients', (msg) => {
	console.log(msg);
	document.querySelector('#messages').innerHTML += `<li>${msg.text}</li>`;
});
