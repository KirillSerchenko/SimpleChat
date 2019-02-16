
$(function(){
	
	const send_username = $("#send_username")

	//Emit a username
	send_username.click(function(){
		
		//Elements
		const message = $("#message")
		const username = $("#username")
		const send_message = $("#send_message")
		
		const chatroom = $("#chatroom")
		const input_zone=$("#input_zone")
		const feedback = $("#feedback")
		const setUsr=$("#setUsr")
		const connected=$("#connected")
		const connect=$("#Connect")


		//Connection of web socket
		const socket=io.connect('http://localhost:3000')
		
		socket.emit('change_username', {username : username.val()})
			chatroom.removeClass("d-none")
			input_zone.removeClass("d-none")
			connect.removeClass("d-none")
			setUsr.addClass("d-none")

		
		socket.on("change_username", (data) => {
			connected.text(data.connectedUsers)
		})


		//Emit message
		send_message.click(function(){
			socket.emit('new_message', {message : message.val()})
		})

		//Listen on new_message
		socket.on("new_message", (data) => {
			feedback.html('');
			message.val('');
			chatroom.append(`<p  class=message>${data.username} : ${data.message} <span id="${data.id}" style='float:right;cursor:pointer'>0</span></p>`)
		
		//send new like
		$(`#${data.id}`).click(function(){
          	socket.emit('add_likes',{likes:this.innerText,id:data.id})
			})
			
		})
		
		//Listen to likes
		socket.on("add_likes",(like)=>{
			$(`#${like.id}`)["0"].innerText=like.likes
		})

	

		//Emit typing
		message.bind("keypress", () => {
			socket.emit('typing')
			})

		
		//Listen on typing
		socket.on('typing', (data) => {
			feedback.html("<p><i>" + data.username + data.message + "</i></p>")
		})


	})
	
});


