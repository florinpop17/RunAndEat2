const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server);
const User = require('./libs/user');
const Power = require('./libs/power');

const PORT = process.env.PORT || 3000;

let connections = [];
let users = [];
let powers = [];

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('index.html');
});

server.listen(PORT, () => {
    console.log('Server running on port',PORT);
});

io.sockets.on('connection', (socket) => {
    connections.push(socket);
    console.log('Connected: %s sockets connected.', connections.length);
    
    //Disconnect
    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
        console.log('Disconnected: %s sockets connected.', connections.length);
    });
});

function createUser(id, name) {
    let id = id;
    let name = name;
    let x = Math.random() * 800;
    let y = Math.random() * 800;
    
    return {id, name, x, y};
}