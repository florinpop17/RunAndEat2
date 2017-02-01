class User {
    constructor(id, x, y, name){
        this.id = id;
        this.x = x;
        this.y = y;
        this.name = name;
        this.r = 20;
        this.speed = 5;
    }
}

module.exports = User;