var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var users = [];
var userCount = 0;

io.on('connection', function(socket) {
    userCount++;
    var user = new Object();
    user['id'] = socket.id;
    if (userCount == 1) {
        user['drawer'] = true;
        user['guesser'] = false;
    } else {
        user['drawer'] = false;
        user['guesser'] = true;
    }

    console.log(user);
    users.push(user);

    // send this only to the same client connection
    socket.emit('user', user);

    if (userCount == 2) {
        io.emit('begin');
    }

    socket.on('draw', function(position) {
        socket.broadcast.emit('draw', position);
    });

    socket.on('guess', function(guess) {
        socket.broadcast.emit('guess', guess);
    });

    socket.on('disconnect', function(socket) {
        userCount--;
        users.splice(users.indexOf(user['id'] == socket.id), 1);
    });
});

server.listen(8080);