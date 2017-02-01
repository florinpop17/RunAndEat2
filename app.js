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
    
    
    socket.on('start', (user) => {
        users.push(new User(socket.id, user.name, user.x, user.y, user.r, user.speed, user.col));
    });
    
    socket.on('update', (updatedUser) => {
        userToUpdate = users.filter(user => {
            if(user.id === socket.id){
                user.x = updatedUser.x;
                user.y = updatedUser.y;
            }
        })
    });
    
    //Disconnect
    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
        users = users.filter(user => user.id !== socket.id);
        console.log('Disconnected: %s sockets connected.', connections.length);
    });
});


setInterval(tick, 33);

function tick() {
    io.sockets.emit('tick', users);
}

function addPower(){
//    if(foods.length < 40){
//        foods.push(new Food(id, Math.random() * 800, Math.random() * 800, 8, Math.floor(Math.random() * 4) + 1));
//        id++;
//    }
}