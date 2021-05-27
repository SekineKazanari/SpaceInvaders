class Bullet {
  constructor(x, y, s) {
    this.img = loadImage('images/fire.png');
    this.x = x;
    this.y = y;
    this.w = 10;
    this.h = 35;
    this.used = false;
    this.speed = s;
  }

  draw() {
    if (!this.used) {
      image(this.img, this.x, this.y, this.w, this.h);
    }
  }

  move() {
    this.y += this.speed;
  }
}