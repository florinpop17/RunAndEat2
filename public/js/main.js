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
    socket.emit('start', user);
    
    socket.on('tick', function(data){
        users = data.users;
        powers = data.powers;
    });
}

function draw() {
    background(0);
    
    move();
    edges();
    
    drawPowers();
    drawUsers();
    socket.emit('update', user);
}

function drawUsers() {
    users.forEach(user => {
        fill(255);
        textAlign(CENTER);
        text(`${user.name}(${user.speed.toFixed(2)})`, user.x, user.y - user.r*1.5);
        
        fill(user.col[0], user.col[1], user.col[2]);
        ellipse(user.x, user.y, user.r*2, user.r*2);
    });
}

function drawPowers() {
    powers.forEach(power => {
        fill(255);
        ellipse(power.x, power.y, power.r)
    });
}

function createNewUser(_name) {
    var name = _name;
    var x = random(0, width);
    var y = random(0, height);
    var r = 30;
    var speed = 5;
    var col = [random(255), random(255), random(255)];
    
    return {
        name: name,
        x: x,
        y: y,
        r: r,
        speed: speed,
        col: col
    }
}

function move() {
    if (keyIsDown(LEFT_ARROW))
        user.x -= user.speed;

    if (keyIsDown(RIGHT_ARROW))
        user.x += user.speed;

    if (keyIsDown(UP_ARROW))
        user.y -= user.speed;

    if (keyIsDown(DOWN_ARROW))
        user.y += user.speed;

}

function edges() {
    if (user.x > width + user.r) {
        user.x = -user.r;
    } else if (user.x < -user.r) {
        user.x = width + user.r;
    }

    if (user.y > height + user.r) {
        user.y = -user.r;
    } else if (user.y < -user.r) {
        user.y = height + user.r;
    }
}

function getPower() {
    powers.forEach(power => {
        var d = dist(user.x, user.y, power.x, power.y);
        
        if(d < user.r + power.r){
            user.speed += 0.2;
            socket.emit('got power', power.id);
        }
    })
}

//Working without this function, but I might need it to draw the current user on top of the others.

function drawThisUser(){
    move();
    edges();
    
    fill(user.col[0], user.col[1], user.col[2]);
    ellipse(user.x, user.y, user.r*2, user.r*2);
}