class User {
    constructor(_id, _name, _x, _y, _r, _speed, _col, _show){
        this.id = _id;
        this.name = _name;
        this.x = _x;
        this.y = _y;
        this.r = _r;
        this.speed = _speed;
        this.col = _col;
        this.show = _show;
    }
}

module.exports = User;