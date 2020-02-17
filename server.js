const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.get('/', function(req, res) {
    //res.send('Hello World');
	var drinks = [
        { name: 'Test1', drunkness: 3 },
        { name: 'Test2', drunkness: 5 },
        { name: 'Test3', drunkness: 10 }
    ];
	
	var tagline = "Tagline";
	
	res.render('index.ejs',{
        drinks: drinks,
        tagline: tagline
    });
});

io.sockets.on('connection', function(socket) {
    
	socket.on('username', function(username) {
		socket.username = username;
        io.emit('is_online', '✔️ <i>' + socket.username + ' joined the chat..</i>');
    });

    socket.on('disconnect', function(username) {
        io.emit('is_online', '⚔️ <i>' + socket.username + ' left the chat..</i>');
    })
	
	socket.on('typing', function(isTyping) {
		io.sockets.emit('updateTyping', socket.username, isTyping);
    })

    socket.on('chat_message', function(message) {
        io.emit('chat_message', '<strong>' + socket.username + '</strong>: ' + message);
    });

});

var port = 3000;

const server = http.listen(port, '127.0.0.1', function() {
    console.log('listening on *:'+port);
});