const express = require('express');
const app = express();
const server = require('http').createServer(app);
const bodyParser = require('body-parser');
const io = require('socket.io').listen(server);
const uuid = require('uuid/v4');

const PORT = process.env.PORT || 3000;

let connections = [];
let users = [];
let powers = [];
let maxNrOfPowers = 40;
let timeOnNewPower = 700;
let tickTime = 33; // 1000/30 => 30 frames/second
let colors = ['#ecf0f1', '#3498db', '#2ecc71', '#ff2020'];

let canvasWidth = 800;
let canvasHeight = 800;

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
        powers.push(new Power(uuid(), Math.random() * 800, Math.random() * 800, Math.floor(Math.random() * 4) + 1));
    }
}

class User {
    constructor(_id, _name, _x, _y, _r, _speed, _col, _show){
        this.id = _id;
        this.name = _name;
        this.x = _x;
        this.y = _y;
        this.r = _r;
        this.speed = _speed;
        this.col = _col;
        this.show = _show;
    }
}

class Power {
    constructor(_id, _x, _y, _val){
        this.id = _id;
        this.x = _x;
        this.y = _y;
        this.r = 7;
        this.val = _val;
        this.col = colors[_val - 1];
    }
}

