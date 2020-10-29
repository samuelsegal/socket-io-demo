const express = require('express');
const socketio = require('socket.io');
const namespaces = require('./data/namespaces');

const app = express();

app.use(express.static(__dirname + '/public'));

const expressServer = app.listen(9000);
const io = socketio(expressServer);

io.on('connection', (socket) => {
	const nsData = namespaces.map((ns) => {
		return {
			img: ns.img,
			endpoint: ns.endpoint,
		};
	});
	//console.log(nsData);
	socket.emit('nsList', nsData);
});

namespaces.forEach((namespace) => {
	io.of(namespace.endpoint).on('connect', (nsSocket) => {
		//socket connected to a namespace, sending group info back to client
		nsSocket.emit('nsRoomLoad', namespace.rooms);
		nsSocket.on('joinRoom', (roomToJoin, totalNumberOfJoinedUsersCallback) => {
			console.log(`joining room ${roomToJoin}`);
			nsSocket.join(roomToJoin);
			// io.of(namespace.endpoint)
			// 	.in(roomToJoin)
			// 	.clients((error, clients) => {
			// 		totalNumberOfJoinedUsersCallback(clients.length);
			// 	});
			const nsRoom = namespace.rooms.find((room) => room.roomTitle === roomToJoin);
			//when room ius joined catch up on the rooms history
			nsSocket.emit('historyCatchup', nsRoom.history);
			io.of(namespace.endpoint)
				.in(roomToJoin)
				.clients((erro, clients) => {
					console.log(`number of clients :: ${clients.length}`);
					io.of(namespace.endpoint).in(roomToJoin).emit('updateMemberCount', clients.length);
				});
		});
		nsSocket.on('newMessageToServer', (msg) => {
			const decoratedMessage = {
				text: msg.text,
				time: Date.now(),
				username: 'samo',
				avatar: 'https://via.placeholder.com/30',
			};
			//emit message to all sockets connected to this sockets room
			//user will be in th 2nd room as sockets always connect to ther own room on connection to namespace
			//which is the socket.id
			const roomTitle = Object.keys(nsSocket.rooms)[1];
			//get room object from namspace base on roomTitle.
			//TODO: find does not supprt IE <= 11. If bored and worried about this we chould do a check or change find to filter
			//filter returns an array of all elements matching condition, where as find returns first object returning true
			const nsRoom = namespace.rooms.find((room) => room.roomTitle === roomTitle);
			//add new message to history using addMessage
			nsRoom.addMessage(decoratedMessage);
			io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', decoratedMessage);
		});
	});
});
