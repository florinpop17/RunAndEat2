const express = require('express');
const app = express();
const server = require('http').createServer(app);
var bodyParser = require('body-parser');
const io = require('socket.io').listen(server);

const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res){
    res.send('index.html');
});

server.listen(PORT, function() {
    console.log('Server running on port',PORT);
});

io.sockets.on('connection', function(socket){
    connections.push(socket);
    console.log('Connected: %s sockets connected.', connections.length);
    
    //Disconnect
    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected.', connections.length);
    });
});