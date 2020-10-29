const socket = io('http://localhost:9000');
let nsSocket = '';
console.log(socket.io);

socket.on('nsList', (nsData) => {
	//Dynamically create namespace links based off of namespaces sent from server
	createNameSpaceAndRoomLinks(nsData);
});
