const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server);
const uuid = require('uuid/v4');
const User = require('./libs/user');
const Power = require('./libs/power');

const PORT = process.env.PORT || 3000;

let connections = [];
let users = [];
let powers = [];
let maxNrOfPowers = 40;
let timeOnNewPower = 700;
let tickTime = 33; // 1000/30 => 30 frames/second

let canvasWidth = 700;
let canvasHeight = 700;

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
                user.name = updatedUser.name;
                user.speed = updatedUser.speed;
                user.show = updatedUser.show;
            }
        })
    });
    
    socket.on('got power', (powerId) => {
        powers = powers.filter(power => power.id !== powerId); 
    });
    
    //Disconnect
    socket.on('disconnect', (data) => {
        connections.splice(connections.indexOf(socket), 1);
        users = users.filter(user => user.id !== socket.id);
        console.log('Disconnected: %s sockets connected.', connections.length);
    });
});


setInterval(tick, tickTime);
setInterval(addPower, timeOnNewPower);

function tick() {
    io.sockets.emit('tick', {users, powers});
}

function addPower(){
    if(powers.length < maxNrOfPowers){
        powers.push(new Power(uuid(), Math.random() * canvasWidth, Math.random() * canvasHeight, Math.floor(Math.random() * 4) + 1));
    }
}