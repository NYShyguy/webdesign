/***** VARIABLES *****/

// 0: Initial Screen
// 1: Game 1 Screen
// 2: Game 2 Screen
// 3: Game-over Screen

var gameScreen = 0;

var ballX, ballY;
var ballSize = 20;
var ballColor; //= color(77, 13, 0);

var gravity = 0.8;
var ballSpeedVert = 0;
var ballSpeedHorizon = 0;

var airFriction = 0.0001;
var friction = 0.1;

var racketColor; //= color(158, 95, 50);
var racketWidth = 100;
var racketHeight = 10;
var racketBounceRate = 20;

var wallSpeed = 5;
var wallInterval = 1000;
var lastAddTime = 0;
var minGapHeight = 250;
var maxGapHeight = 350;
var wallWidth = 80;
var wallColors; //= color(226, 226, 20);
var walls = [];

var score = 0;
var lives = 0;

var meteorInterval = 2000;
var lastAddTime2 = 0;
var meteorSize = 35;
var whitePercent;
var blackPercent;
var white = [247, 188, 154];
var black = [127, 67, 41];
var meteorColor;
var meteorSpeedVert = 2;
var meteorSpeedHorizontal;
var meteors = [];

var inFirst = false;
var inSecond = false;
var oneRecto = 125;
var twoRecto = 125;


/***** Setup Block *****/

function setup() {
  createCanvas(window.screen.availWidth - 300, window.screen.availHeight - 340);
  ballX = width/4;
  ballY = height/5;

  ballColor = color(77, 13, 0);
  racketColor = color(158, 95, 50);
  wallColors = color(226, 226, 20);
  meteorSpeedHorizontal = round(random(-5, 5));
  meteorColor = color(206,102,17);
}

/***** Draw Block *****/

function draw () {

  if (gameScreen == 0)  // check to see which screen to display
    initScreen();
  else if (gameScreen == 1) {
    playScreen();
  } else if (gameScreen == 2) {
    game2Screen();
  } else if (gameScreen == 3)
    gameOverScreen();
}

/***** Screen Content *****/

function initScreen() {
  background (255, 254, 222);
  checkHovers();

  fill(77, 13, 0, oneRecto);
  rectMode(CENTER);
  rect(width/2, height/3 - height/45, width * 7 / 8, height/6);
  textAlign(CENTER);
  textSize(48);
  fill(255);
  text("Flappy Breakout", width/2, height/3);

  fill(0, 0, 0, twoRecto);
  rect(width/2, height*2/3 - height/45, width * 7 / 8, height/6);
  fill(255);
  text("Asteroid Destroyer", width/2, height * 2 / 3);
  fill(0);
  textSize(14);
  text("@ShyguyGames", width-60, height-20);
}

function playScreen() {
  background (255, 254, 222);
  tint(255, 255, 255, 150);
  drawBall();
  applyGravity();
  keepInScreen();
  drawRacket();
  watchRacketBounce();
  applyHorizontalSpeed();
  wallAdder();
  wallHandler();
  printScore();
}

function game2Screen() {
  background (255, 254, 222);
  tint(255, 255, 255, 150);
  drawBigBall();
  applyGravity();
  keepInScreen();
  drawRacket();
  watchRacketBounce();
  applyHorizontalSpeed();
  meteorAdder();
  meteorHandler();
  printScore();
  checkGameState();
}

function gameOverScreen() {
  background(0);
  tint(255, 255, 255, 150);
  textAlign(CENTER);
  fill(255);
  textSize(48);
  text("Score: " + score, width/2, height/2);
  textSize(24);
  fill(0, 255, 0);
  text("Click to Return to Main Menu", width/2, height*2/3);
  fill(255, 0, 0);
  textSize(48);
  text("Mama Mia!", width/2, height/4);
}

/***** Inputs *****/

function mousePressed() {
  if (gameScreen == 0) {
    if (inFirst) {
      startFirstGame();
    }
    if (inSecond) {
      startSecondGame();
    }
  }
  if (gameScreen == 3) {
    restart();
  }
}

/***** Other Functions *****/

function startFirstGame() {
  gameScreen = 1;
}

function startSecondGame() {
  gameScreen = 2;
}

function drawBall() {
  fill(ballColor);
  if (ballSize != 20)
    ballSize = 20;
  ellipse(ballX, ballY, ballSize, ballSize);
}

function drawBigBall() {
  fill(ballColor, 255);
  if (ballSize != 60)
    ballSize = 60;
  ellipse(ballX, ballY, ballSize, ballSize);
}

function applyGravity() {
  if (ballSpeedVert < 20)
    ballSpeedVert += gravity;
  ballY += ballSpeedVert;
  ballSpeedVert -= (ballSpeedVert * airFriction);
}

function makeBounceBottom(surface) {
  ballY = (surface - (ballSize/2));
  ballSpeedVert -= (ballSpeedVert * friction);
  ballSpeedVert *= -1;
}

function makeBounceTop (surface) {
  ballY = (surface + (ballSize/2));
  ballSpeedVert -= (ballSpeedVert * friction);
  ballSpeedVert *= -1;
}

// keep ball in the screen
function keepInScreen() {
  // ball hits floor
  if (ballY + (ballSize/2) > height) {
    makeBounceBottom(height);
  }
  // ball hits cieling
  if (ballY - (ballSize/2) < 0) {
    makeBounceTop(0);
  }
  //ball hits left wall
  if (ballX - (ballSize/2) < 0) {
    makeBounceLeft(0);
  }

  // ball hits right wall
  if (ballX + (ballSize/2) > width) {
    makeBounceRight(width);
  }
}

function drawRacket () {
  fill(racketColor);
  rectMode(CENTER);
  rect(mouseX, mouseY, racketWidth, racketHeight);
  tint(255, 255, 255, 255);
}

function watchRacketBounce() {
  var overhead = mouseY - pmouseY;
  if ((ballX + (ballSize/2) > mouseX - (racketWidth/2)) && (ballX - (ballSize/2) <
    mouseX + (racketWidth/2))) {
    if (dist(ballX, ballY, ballX, mouseY) <= (ballSize/2) + abs(overhead)) {
      makeBounceBottom(mouseY);
      // racket moving up
      if (overhead < 0) {
        ballY += overhead;
        ballSpeedVert += overhead;
        if (ballSpeedVert > 15)
          ballSpeedVert = 15;
      }
      ballSpeedHorizon = (ballX - mouseX)/7;
    }
  }
}

function applyHorizontalSpeed() {
  ballX += ballSpeedHorizon;
  ballSpeedHorizon -= (ballSpeedHorizon * airFriction);
}

function makeBounceLeft (surface) {
  ballX = surface + (ballSize/2);
  ballSpeedHorizon *= -1;
  ballSpeedHorizon -= (ballSpeedHorizon * friction);
}

function makeBounceRight (surface) {
  ballX = surface - (ballSize/2);
  ballSpeedHorizon *= -1;
  ballSpeedHorizon -= (ballSpeedHorizon * friction);
}

function wallAdder() {
  if (millis()-lastAddTime > wallInterval) {
    var randHeight = round(random(minGapHeight, maxGapHeight));
    var randY = round(random(0, height-randHeight));
    //{gapWallX, gapWallY, gapWallWidth, gapWallHeight}
    var randWall = [width, randY, wallWidth, randHeight, 0];
    walls.push(randWall);
    lastAddTime = millis();
  }
}

function wallHandler() {
  for (var i = 0; i < walls.length; i++) {
    wallRemover(i);
    wallMover(i);
    wallDrawer(i);
    watchWallCollision(i);
  }
}

function wallDrawer(index) {
  var wall = walls[index];
  // get gap wall settings
  var gapWallX = wall[0];
  var gapWallY = wall[1];
  var gapWallWidth = wall[2];
  var gapWallHeight = wall[3];
  // draw walls
  rectMode(CORNER);
  fill(wallColors);
  rect(gapWallX, 0, gapWallWidth, gapWallY);
  rect(gapWallX, gapWallY + gapWallHeight, gapWallWidth, height - (gapWallY + gapWallHeight));
}

function wallMover (index) {
  var wall = walls[index];
  wall[0] -= wallSpeed;
}

function wallRemover (index) {
  var wall = walls[index];
  if (wall[0]+wall[2] <= 0) {
    walls.splice(index, 1);
  }
}

function watchWallCollision(index) {
  var wall = walls[index];
  // get gap wall settings
  var gapWallX = wall[0];
  var gapWallY = wall[1];
  var gapWallWidth = wall[2];
  var gapWallHeight = wall[3];
  var wallTopX = gapWallX;
  var wallTopY = 0;
  var wallTopWidth = gapWallWidth;
  var wallTopHeight = gapWallY;
  var wallBottomX = gapWallX;
  var wallBottomY = gapWallY + gapWallHeight;
  var wallBottomWidth = gapWallWidth;
  var wallBottomHeight = height - (gapWallY + gapWallHeight);
  var wallScored = wall[4];

  if (
    (ballX + (ballSize/2)>wallTopX) &&
    (ballX - (ballSize/2)<wallTopX + wallTopWidth) &&
    (ballY + (ballSize/2) > wallTopY) &&
    (ballY - (ballSize/2) < wallTopY + wallTopHeight)
    ) {
    // collides with upper wall
    gameScreen = 3;
  }

  if (
    (ballX + (ballSize/2) > wallBottomX) &&
    (ballX - (ballSize/2) < wallBottomX + wallBottomWidth) &&
    (ballY + (ballSize/2) > wallBottomY) &&
    (ballY - (ballSize/2) < wallBottomY + wallBottomHeight)
    ) {
    // collides with lower wall
    gameScreen = 3;
  }

  if (ballX > gapWallX + (gapWallWidth/2) && wallScored == 0) {
    wallScored = 1;
    wall[4] = 1;
    addScore();
  }
}

function addScore () {
  score++;
}

function printScore() {
  textAlign(CENTER);
  fill(0);
  textSize(48);
  text(score, width/2, 50);
}

function restart () {
  score = 0;
  ballX = width/4;
  ballY = height/5;
  lastAddTime = 0;
  walls = [];
  meteors = [];
  gameScreen = 0;
  lives = 0;
}

function checkHovers() {
  if (gameScreen == 0) {
    if (mouseX > (width/2 - width * 3.5 / 8) &&
      (mouseX < width/2 + width * 3.5 / 8) &&
      (mouseY > height/3 - height/45 - height/12) &&
      (mouseY < height/3 - height/45 + height/12)) {
      oneRecto = 255;
      inFirst = true;
    } else {
      oneRecto = 125;
      inFirst = false;
    }
    if (mouseX > (width/2 - width * 3.5 / 8) &&
      (mouseX < width/2 + width * 3.5 / 8) &&
      (mouseY > height*2/3 - height/45 - height/12) &&
      (mouseY < height*2/3 - height/45 + height/12)) {
      twoRecto = 255;
      inSecond = true;
    } else {
      twoRecto = 125;
      inSecond = false;
    }
  }
}

function meteorAdder() {
  if (millis()-lastAddTime2 > meteorInterval) {
    var randX = round(random(0, width));
    colorDeterminer();
    // meteor x, meteor y, meteor width, meteor height, hit, x speed, y speed, color
    var randMeteor = [randX, 0, meteorSize, meteorSize, 0, meteorSpeedHorizontal, meteorSpeedVert, meteorColor];
    meteors.push(randMeteor);
    lastAddTime2 = millis();
    meteorSpeedHorizontal = round(random(-5, 5));
  }
}

function meteorHandler() {
  if (meteors.length > 0) {
    for (var i = 0; i < meteors.length; i++) {
      meteorMover(i);
      meteorDrawer(i);
      watchMeteorCollision(i);
      meteorRemover(i);
    }
  }
}

function meteorDrawer(index) {
  var meteor = meteors[index];
  // get meteor settings
  var meteorX = meteor[0];
  var meteorY = meteor[1];
  var meteorWidth = meteor[2];
  var meteorHeight = meteor[3];
  // draw meteors
  ellipseMode(CENTER);
  fill(meteor[7]);
  ellipse(meteorX, meteorY, meteorWidth, meteorHeight);
}

function meteorMover (index) {
  if (meteors.length > index) {
    var meteor = meteors[index];
    meteor[0] += meteor[5];
    meteor[1] += meteor[6];
  }
}

function meteorRemover (index) {
  var meteor = meteors[index];
  if (meteor[1]+meteor[3] >= height || meteor[4] == 1) {
    meteors.splice(index, 1);
  }
}

function watchMeteorCollision(index) {
  var meteor = meteors[index];

  if (
    (ballX + (ballSize/2) > meteor[0] - (meteorSize/2)) &&
    (ballX - (ballSize/2) < meteor[0] + (meteorSize/2)) &&
    (ballY + (ballSize/2) > meteor[1] - (meteorSize/2)) &&
    (ballY - (ballSize/2) < meteor[1] + (meteorSize/2))
    ) {
    // ball collides with meteor
    addScore();
    meteor[4] = 1;
  }

  if (
    (meteor[0] - (meteorSize/2) < 0)
    ) {
    // meteor collides with left wall
    meteor[0] = meteorSize/2;
    meteor[5] *= -1;
  }

  if (
    (meteor[0] + (meteorSize/2) > width)
    ) {
    // meteor collides with right wall
    meteor[0] = width - meteorSize/2;
    meteor[5] *= -1;
  }

  if (meteor[1] + (meteorSize + 1) > height) {
    // meteor collides with bottom
    lives++;
    if(lives > 2)
      gameScreen = 3;
  }
}

function colorDeterminer (){
  /*whitePercent = round(random(0, 100));
  blackPercent = 100 - whitePercent;
  whitePercent /= 100;
  blackPercent /= 100;
  meteorColor = color(white[0] * whitePercent + black[0] * blackPercent,
  white[1] * whitePercent + black[1] * blackPercent,
  white[2] * whitePercent + black[2] * blackPercent);*/
}

function checkGameState(){
  fill(128, 212, 255);
  rectMode(CENTER);
  rect(width - 60, 42, 125, 60);
  textSize(48);
  stroke(0);
  strokeWeight(1);

  if(!(lives > 2))
    fill(255);
  else
    fill(0);
  text("X", width - 25, 60);

  if(! (lives > 1))
    fill(255);
  else
    fill(0);
  text("X", width - 62.5, 60);


  if(!(lives > 0))
    fill(255);
  else
    fill(0);
  text("X", width - 100, 60);
}
