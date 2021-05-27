class Charizard {
  constructor(x, y, w, h, imgA, imgB, pts) {
    this.x = x;
    this.y = y;
    this.charizardWidth = w;
    this.charizardHeight = h;
    this.alive = true;
    this.imageA = imgA;
    this.imageB = imgB;
    this.currentImage = 'A';
    this.points = pts;
    this.timer = 3;
  }

  draw() {
    if (this.alive) {
      if (this.currentImage === 'A') {
        image(this.imageA, this.x, this.y, this.charizardWidth, this.charizardHeight);
      }
      if (this.currentImage === 'B') {
        image(this.imageB, this.x, this.y, this.charizardWidth, this.charizardHeight);
      }
    }
    if(!this.alive){
      if(this.timer > 0){
        this.die();
        this.timer -= 1;
      }
    }
  }

  moveVertical() {
    this.y += 10;
  }

  moveHorizontal() {
    if (charizardDirection === 'left') {
      this.x -= 5
    }
    if (charizardDirection === 'right') {
      this.x += 5
    }
    if (this.currentImage === 'A') {
      this.currentImage = 'B'
    } else if (this.currentImage === 'B') {
      this.currentImage = 'A'
    }
  }

  die() {
    push();
    translate(this.x, this.y);
    pop();
  }
}