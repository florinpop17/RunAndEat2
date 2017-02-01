var socket;
var user;
var users = [];
var powers = [];
var _name = "HiddenUser";

var submit = document.getElementById('submit');
var intro = document.getElementById('intro');

submit.addEventListener('click', function(){
    name = document.getElementById('name').value;
    if(name){
        intro.style.display = "none";
        user.name = name;
        user.show = true;
    } else {
        alert("Please enter your name!");
    }
});

function setup() {
    socket = io.connect();
    createCanvas(700, 700);
    
    user = createNewUser(_name);
    socket.emit('start', user);
    
    socket.on('tick', function(data){
        users = data.users;
        powers = data.powers;
    });
}

function draw() {
    background(0);
    
    drawPowers();
    drawUsers();
    drawThisUser();
    drawLeaderboard();
    socket.emit('update', user);
}

function drawLeaderboard() {
    fill(10);
    rect(0, 0, 150, 100);
    fill(255);
    textAlign(LEFT);
    textSize(16);
    text(`The Leaderboard`, 10, 25);
    sortedUsers = users.filter(function(user) { // Not showing the user which haven't entered a name
        return user.show;
    }).sort(function(userA, userB){ // Sorting the users by their speed
        return (userB.speed - userA.speed);
    }).filter((user, idx) => idx < 3); // Added filter to only get the first 8 users
    
    sortedUsers.forEach(function(user, idx) {
        textSize(14);
        text(`${idx+1}. ${user.name}: ${user.speed.toFixed(2)}`, 10, idx*20+ 50);
    });
}

//Working without this function, but I might need it to draw the current user on top of the others.

function drawThisUser(){
    move();
    edges();
    getPower();
    textAlign(CENTER);
    textSize(14);
    fill(255);
    text(`${user.name}(${user.speed.toFixed(2)})`, user.x, user.y - user.r*1.5);
    
    fill(user.col[0], user.col[1], user.col[2]);
    ellipse(user.x, user.y, user.r*2, user.r*2);
}

function drawUsers() {
    users.forEach(user => {
        fill(255);
        if(user.id !== socket.id && user.show){
            textAlign(CENTER);
            text(`${user.name}(${user.speed.toFixed(2)})`, user.x, user.y - user.r*1.5);

            fill(user.col[0], user.col[1], user.col[2]);
            ellipse(user.x, user.y, user.r*2, user.r*2);
        }
    });
}

function drawPowers() {
    powers.forEach(power => {
        fill(power.col);
        ellipse(power.x, power.y, power.r*2, power.r*2)
    });
}

function createNewUser(_name) {
    var name = _name;
    var x = random(0, width);
    var y = random(0, height);
    var r = 20;
    var speed = 5;
    var col = [random(255), random(255), random(255)];
    var show = false;
    
    return {
        name: name,
        x: x,
        y: y,
        r: r,
        speed: speed,
        col: col,
        show: show
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


// Not clean, need to re-think it!!

function getPower() {    
    let powerToRemove = powers.filter(power => {
        var d = dist(user.x, user.y, power.x, power.y);
        return d < user.r + power.r // d > because I only want to get this one
    });
    
    if(powerToRemove.length > 0){
        powers = powers.filter(function(power) {
            return power.id !== powerToRemove[0].id
        });
        
        user.speed += powerToRemove[0].val / 100;
        socket.emit('got power', powerToRemove[0].id);
    }
    
    
}