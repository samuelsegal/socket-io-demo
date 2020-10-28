const express = require('express');
const app = express();
const socketio = require('socket.io');

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);
io.on('connection', (socket) => {
	socket.emit('messageFromServer', { data: 'Welcome to socket server' });
	socket.on('messageToServer', (dataFromClient) => {
		console.log(dataFromClient);
	});
	socket.on('newMessageToServer', (msg) => {
		console.log(msg);
		io.emit('messageToClients', { text: msg.text });
	});
});
io.of('/admin').on('connect', (socket) => {
	console.log('connected to admin namespace');
	io.of('/admin').emit('welcome', 'welcome to admin namespace');
});
