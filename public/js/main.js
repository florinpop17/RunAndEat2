var socket;

function preload() {
    socket = io.connect();
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    
    socket.emit("start", {name, windowWidth, windowHeight});
}

function draw() {
    background(0);
    
}