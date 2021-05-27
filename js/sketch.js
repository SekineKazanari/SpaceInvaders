let player;
let bkg;

let shots = [];
let charizards = [];
let bullets = [];

let score = 0;
let highScore = 0;

let playerImg;
let charizard_a;
let charizard_b;

let speed = 10;
let bulletSpeed = 10;
let charizardDirection = 'left';
let chanceBullet = 60;

let pauseMode = false;
let pauseTime = 0;
let gameOverBool = false;

function preload() {
  playerImg = loadImage('../images/player.png');
  charizard_a = loadImage('../images/charizard_a.png');
  charizard_b = loadImage('../images/charizard_b.png')
  bkg = loadImage('../images/bkg.png');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  frameRate(10);
  player = new Pikachu(playerImg);
  createCharizards();
}

function draw() {
  if (focused || frameCount < 30) {
    background(bkg);
    player.draw();
    player.move();
    player.drawLives();
    drawScore();

    if (!pauseMode) {
      moveShots();
      moveBullets();
      if (frameCount % speed == 0) {
        moveCharizards();
        fireBullet();
      }
    }

    if (pauseMode) {
      newLife();
    }

    drawShots();
    drawBullets();
    drawCharizards();
    charizardHit();
    hitPlayer();

    if (charizardsKilled()) {
      resetCharizards();
    }
  } else {
    pause();
  }
}

function keyPressed() {
  if (key === ' ') {
    if (!pauseMode) {
      player.fire();
    }
  }
  if (keyCode === LEFT_ARROW) {
    player.changeDirection('left');
  }
  if (keyCode === RIGHT_ARROW) {
    player.changeDirection('right');
  }
  if ((keyCode === RETURN || keyCode === ENTER) && gameOverBool) {
    reset();
  }
  return false;
}

function keyReleased() {
  if (keyIsPressed === false) {
    player.changeDirection('none');
  }
}

function createCharizards() {
  let startingX = 70;
  let startingY = 200;
  for (i = 0; i < 116; i++) {
    charizards[i] = new Charizard(startingX, startingY, 50, 40, charizard_a, charizard_b, 40);
    startingX += 50;
    if (startingX > width - 30) {
      startingX = 70;
      startingY -= 40;
    }
  }
}

function drawCharizards() {
  for (let charizard of charizards) {
    charizard.draw();
  }
}

function moveCharizards() {
  for (let charizard of charizards) {
    charizard.moveHorizontal(charizardDirection);
  }
  if (charizardEdge()) {
    charizardsReverse();
    charizardsDown();
  }
}

function charizardEdge() {
  let edgeReached = false;
  for (let charizard of charizards) {
    if ((charizard.x < 15 && charizard.alive) || (charizard.x > width - 15 && charizard.alive)) {
      edgeReached = true;
    }
  }
  return edgeReached;
}

function charizardsReverse() {
  if (charizardDirection === 'left') {
    charizardDirection = 'right';
  } else {
    charizardDirection = 'left';
  }
}

function charizardsDown() {
  for (let charizard of charizards) {
    charizard.moveVertical();
  }
}

function charizardHit() {
  for (let shot of shots) {
    for (let charizard of charizards) {
      if (shot.x > charizard.x &&
        shot.x < charizard.x + charizard.charizardWidth &&
        shot.y - shot.length > charizard.y &&
        shot.y - shot.length < charizard.y + charizard.charizardHeight &&
        !shot.hit && charizard.alive) {

        charizard.alive = false;
        shot.hit = true;
        score += charizard.points;
      }
    }
  }
}

function charizardsKilled() {
  let bool = true;
  for (let charizard of charizards) {
    if (charizard.alive) {
      bool = false;
    }
  }
  return bool;
}

function resetCharizards() {
  createCharizards();
  if (speed > 2) {
    speed -= 2;
  }
  chanceBullet += 10;
}

function drawShots() {
  for (let shot of shots) {
    shot.draw();
  }
}

function moveShots() {
  for (let shot of shots) {
    shot.move();
  }
}

function fireBullet() {
  if (random(100) < chanceBullet) {
    let i = floor(random(charizards.length));
    if (charizards[i].alive) {
      let l = new Bullet(charizards[i].x, charizards[i].y + (charizards[i].charizardHeight / 2), bulletSpeed);
      bullets.push(l);
    }
  }
}

function drawBullets() {
  for (let bullet of bullets) {
    bullet.draw();
  }
}

function moveBullets() {
  for (let bullet of bullets) {
    bullet.move();
  }
}

function hitPlayer() {
  for (let bullet of bullets) {
    let leftBullet = bullet.x - 2;
    let rightBullet = bullet.x + 2;
    let frontBullet = bullet.y + 8;
    let backBullet = bullet.y;

    let leftPikachu = player.x;
    let rightPikachu = player.x+player.pikachuWidth;
    let frontPikachu = player.y;
    let backPikachu = player.y + player.pikachuHeight;

    // fill(255)
    // rect(rightPikachu, frontPikachu,50,50);
    // fill("green")
    // rect(leftPikachu, backPikachu,50,50);

    if (rightBullet > leftPikachu &&
      leftBullet < rightPikachu &&
      frontBullet > frontPikachu &&
      backBullet < backPikachu &&
      !bullet.used) {
      bullet.used = true;
      if (player.lives > 0) {
        lifeLost();
      }
      if (player.lives == 0) {
        gameOver();
      }
    }
  }
}

function lifeLost() {
  pauseTime = frameCount;
  pauseMode = true;
}

function newLife() {
  if ((frameCount - pauseTime > 5 && frameCount - pauseTime < 10) ||
    (frameCount - pauseTime > 15 && frameCount - pauseTime < 20) ||
    (frameCount - pauseTime > 25 && frameCount - pauseTime < 30)
  ) {
    background(bkg);
    image(playerImg, player.x, player.y, player.pikachuWidth, player.pikachuHeight);
  }
  if (frameCount - pauseTime > 30) {
    player.x = width / 2;
    pauseMode = false;
    player.lives -= 1;
    for (let bullet of bullets) {
      bullet.used = true;
    }
    for (let shot of shots) {
      shot.hit = true;
    }
  }
}

function drawScore() {
  noStroke();
  fill("black");
  textSize(20);
  textStyle(BOLD);
  textAlign(LEFT);
  text('LIVES: ', width - 225, 38);
  text('SCORE:', 25, 28);
  text(score, 120, 28);
}

function gameOver() {
  gameOverBool = true;
  background(0, 125);

  textSize(55);
  noStroke();
  fill(255);
  textAlign(CENTER);
  text('Game over', width / 2, height / 2 - 50);

  textSize(30);
  text('Score: ' + score, width / 2, height / 2);
  text("Presiona ENTER para volver a jugar", width / 2, height / 2 + 50);
  noLoop();
}

function pause() {
  noStroke();
  fill("black");
  textAlign(CENTER);
  textSize(20);
  text('Dale click para continuar', width / 2, height/2);
}

function reset() {
  highScore = score;
  score = 0;
  player = new Pikachu(playerImg);
  createCharizards();
  for (let bullet of bullets) {
    bullet.used = true;
  }
  for (let shot of shots) {
    shot.hit = true;
  }
  loop();
}