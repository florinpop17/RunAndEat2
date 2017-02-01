var socket;
var user;
var users = [];
var powers = [];
var _name = "HiddenUser";

function preload() {
    socket = io.connect();
}

function setup() {
    createCanvas(800, 800);
    
    user = createNewUser(_name);
    socket.emit("start", user);
    
    socket.on('tick', function(_users){
        users = _users; 
        console.log(users);
    });
}

function draw() {
    background(0);
    
}

function createNewUser(_name) {
    var name = _name;
    var x = random(0, width);
    var y = random(0, height);
    var r = 20;
    var speed = 5;
    var col = color(random(255), random(255), random(255));
    
    return {
        name: name,
        x: x,
        y: y,
        r: r,
        speed: speed,
        col: col
    }
}