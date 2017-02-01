var socket;
var users = [];
var powers = [];
var name = "HiddenUser";

function preload() {
    socket = io.connect();
    socket.emit("start", name);
}

function setup() {
    createCanvas(800, 800);
    
    socket.on('tick', function(_users){
        users = _users; 
        console.log(users);
    });
}

function draw() {
    background(0);
    
}