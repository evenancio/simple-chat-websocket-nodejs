var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();
var server = http.createServer(app);

var SocketIO = require('socket.io');
var io = SocketIO.listen(server);

var sockets = [];
var names = [];

io.sockets.on("connection", function(socket){
    sockets.push(socket);

    socket.on("register", function(data){
        names.push(data.name);
        io.sockets.emit('incoming', {users: names, user: data.name, message: ' enters in chat room!'});
    });

    socket.on("sendMessage", function(msg){
        io.sockets.emit("getMessage", {from: msg.from, message: msg.message, to: msg.to});
    });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', routes.index);

server.listen(3335);