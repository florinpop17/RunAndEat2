var socket;

function preload() {
    socket = io.connect();
}

function setup() {
    console.log(socket.id)
}

function draw() {
    
}