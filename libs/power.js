var colors = ['#ecf0f1', '#3498db', '#2ecc71', '#ff2020'];

class Power {
    constructor(_id, _x, _y, _val){
        this.id = _id;
        this.x = _x;
        this.y = _y;
        this.r = 10;
        this.val = _val;
        this.col = colors[_val - 1];
    }
}

module.exports = Power;