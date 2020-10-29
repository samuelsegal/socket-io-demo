const joinRooms = (roomName) => {
	console.log(roomName);
	nsSocket.emit('joinRoom', roomName, (totalNumberOfJoinedUsers) => {
		//callback to update member total now that we have joined a new member
		document.querySelector(
			'.curr-room-num-users'
		).innerHTML = `${totalNumberOfJoinedUsers} <span class="glyphicon glyphicon-user">`;
	});
	/**
	 * update the UI with history of messages in this room
	 */
	nsSocket.on('historyCatchup', (history) => {
		const messagesUl = document.querySelector('#messages');
		messagesUl.innerHTML = '';
		history.map((msg) => {
			console.log(msg);
			messageHtml = buildMsgHtml(msg);
			messagesUl.innerHTML += messageHtml;
		});
		//Scroll to bottom of messages
		messagesUl.scrollTo(0, messagesUl.scrollHeight);
	});

	/**
	 * update the number of users to all clients when a new member joins
	 */
	nsSocket.on('updateMemberCount', (totalNumberOfJoinedUsers) => {
		document.querySelector(
			'.curr-room-num-users'
		).innerHTML = `${totalNumberOfJoinedUsers} <span class="glyphicon glyphicon-user">`;
		document.querySelector('.curr-room-text').innerText = roomName;
	});
};
