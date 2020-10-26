const http = require('http');
const socketio = require('socket.io');

const server = http.createServer((req, res) => {
	res.end('Connected');
});

const io = socketio(server);

io.on('connection', (socket, req) => {
	socket.emit('welcome', 'Welcome to socketio server');
	socket.on('message', (msg) => {
		console.log(msg);
		socket.on('message', (message) => {
			console.log('message: ', message);
		});
	});
});

server.listen(8000);
