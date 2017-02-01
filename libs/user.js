class User {
    constructor(_id, _x, _y, _name){
        this.id = _id;
        this.x = _x;
        this.y = _y;
        this.name = _name;
        this.r = 20;
        this.speed = 5;
    }
}

module.exports = User;