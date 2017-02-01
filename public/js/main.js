var socket;
var users = [];
var powers = [];

function preload() {
    socket = io.connect();
    socket.emit("start");
}

function setup() {
    createCanvas(800, 800);
}

function draw() {
    background(0);
    
}