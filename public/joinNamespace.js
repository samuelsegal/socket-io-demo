/**
 * Dynamically create namespace links based off of namespaces sent from server
 * @param {*} nsData
 */
const createNameSpaceAndRoomLinks = (nsData) => {
	console.log('namespaces :: ', nsData);
	const namespacesDiv = document.querySelector('.namespaces');
	namespacesDiv.innerHTML = '';
	nsData.forEach((ns) => {
		namespacesDiv.innerHTML += `<div class="namespace" ns="${ns.endpoint}"><img src="${ns.img}"/>`;
	});
	const namespaceHTMLCollection = document.getElementsByClassName('namespace');
	Array.from(namespaceHTMLCollection).forEach((element) => {
		element.addEventListener('click', (e) => {
			const nsEndpoint = element.getAttribute('ns');
			joinRoomsToNamespace(nsEndpoint);
			console.log(`go to ${nsEndpoint}`);
		});
	});
	joinRoomsToNamespace(nsData[0].endpoint);
};

/**
 * join the rooms to clicked namespace
 * @param {*} endpoint
 */
const joinRoomsToNamespace = (endpoint) => {
	console.log(`endpoint :: ${endpoint}`);

	// * clean up previous socket connection

	if (nsSocket !== '') {
		nsSocket.close();
		document.querySelector('.message-form').removeEventListener('submit', submitMessage);
	}
	nsSocket = io(`http://localhost:9000${endpoint}`);
	nsSocket.on('nsRoomLoad', (nsRooms) => {
		const roomList = document.querySelector('.room-list');
		roomList.innerHTML = '';
		nsRooms.forEach((room) => {
			console.log(`room :: ${room.roomTitle}`);
			const glyph = room.privateRoom ? 'lock' : 'globe';
			roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-${glyph}"></span>${room.roomTitle}</li>`;
			const roomHTMLCollection = document.getElementsByClassName('room');
			Array.from(roomHTMLCollection).forEach((element) => {
				element.addEventListener('click', (e) => {
					console.log(`Somebody clicked ${e.target.innerHTML}`);
				});
			});
		});
		const topRoom = document.querySelector('.room');
		const topRoomName = topRoom.innerText;
		joinRooms(topRoomName);
	});
	nsSocket.on('messageToClients', (msg) => {
		const msgHtml = buildMsgHtml(msg);
		console.log(msg);
		document.querySelector('#messages').innerHTML += msgHtml;
	});

	document.querySelector('.message-form').addEventListener('submit', submitMessage);
};

const submitMessage = (event) => {
	event.preventDefault();
	console.log('submitted');
	const newMessage = document.querySelector('#user-message').value;
	nsSocket.emit('newMessageToServer', { text: newMessage });
};

/**
 * convert the messages object to an HTML <li> element
 * @param {*} msg
 */
const buildMsgHtml = (msg) => {
	const msgTime = new Date(msg.time).toLocaleString();
	const html = `
<li>
	<div class="user-image">
		<img src="${msg.avatar}" />
	</div>
	<div class="user-message">
		<div class="user-name-time">${msg.username} <span>${msgTime}</span></div>
		<div class="message-text">${msg.text}<div>
	</div>
</li>
	`;
	console.log('html ::::: ', html);
	return html;
};
