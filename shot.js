class Shot {
    constructor(x, y, dir) {
      this.img = loadImage('images/fire2.png');
      this.x = x;
      this.y = y;
      this.w = 10;
      this.h = 35;
      this.direction = dir;
      this.length = 10;
      this.hit = false;
  }

  draw() {
    if (!this.hit) {
      image(this.img, this.x, this.y, this.w, this.h);
    }
  }

  move() {
    this.y -= 15;
  }
}