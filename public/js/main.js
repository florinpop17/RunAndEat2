var socket;

function preload() {
    socket = io.connect();
}

function setup() {
    createCanvas(800, 800);
    
//    socket.emit("start", {name});
}

function draw() {
    background(0);
    
}