class Pikachu {
  constructor(img) {
    this.img = img;
    this.x = width/2;
    this.y = height-140;
    this.pikachuWidth = 50;
    this.pikachuHeight = 60;
    this.direction = 'none';
    this.lives = 3;
    this.shotInterval = 6;
    this.timestamp = -this.shotInterval;
  }

  draw() {
    image(this.img,this.x,this.y,this.pikachuWidth,this.pikachuHeight);
  }

  move() {
    if(!pauseMode){
      if (this.direction === 'left' && this.x > this.pikachuWidth/2) {
        this.x -= 10;
      }
      if (this.direction === 'right' && this.x < width - this.pikachuWidth/2) {
        this.x += 10;
      }
    }
  }

  changeDirection(direction) {
    this.direction = direction;
  }

  fire() {
    if (frameCount - this.timestamp > this.shotInterval) {
      shots.push(new Shot(this.x + 20, height - 140, 1));
      this.timestamp = frameCount;
    }
  }

  drawLives() {
    let x = width - 155;
    for (let i = 0; i < this.lives; i++) {
      image(this.img, x, 5, 45, 50);
      x += 50;
    }
  }
}