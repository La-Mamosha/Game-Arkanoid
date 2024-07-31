/*Llamando Canvas, para poder  dibujar las formas sobre el lienzo de canvas*/

/*Obtenemos el canva y luego obtenemos el contexto y dentro de ese contexto podemos dibujar en 2d*/
var c = document.getElementById("arkanoidCanva"); /*Llamamos a canva*/
var ctx = c.getContext("2d"); /*Este contexto permite dibujar sobre el lienzo */

var radius = 10;
var x = c.width / 2;
var y = c.height - radius;
var dx = 2;
var dy = -2;

var paddleX = c.width / 2;
var paddleY = c.height - 10;
var paddleWidth = 60;
var paddleHeight = 12;

var leftMove = false; /*Define la velocidad del movimiento*/
var rightMove = false;

var brickRows = 3; /*Define el numero de filas de ladrillos*/
var brickColumn = 5; /*Define el numero de columnas de ladrillos*/
var brickWidth = 60;
var brickHeight = 20;
var brickPadding = 12; /*Espacio entre ladrillos*/
var brickOffsetTop = 30;
var brickOffsetLeft = 100;

var score = 0; /*Puntaje de la pala*/
var lives = 3; /*Vidas*/

var gameOver = false; // Variable para controlar si el juego ha terminado
var animationID; // Variable para almacenar el identificador de la animación


var bricks = [];
for (let i = 0; i < brickColumn; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickRows; j++) {
    bricks[i][j] = { x: 0, y: 0, drawBrick: true };
  }
}

/*Funcion para detectar una tecla */
document.addEventListener("keydown", keyDownHandler, false); /*Evento para detectar una tecla */
document.addEventListener("keyup", keyUpHandler, false); /*Evento para detectar una tecla */
document.addEventListener("mousemove", mouseMoveHandler, false); /*Evento para detectar el mousse */

/*Cuando detectar una tecla*/
function keyDownHandler(e) {
  if (e.keyCode == 37) {
    leftMove = true;
  } else if (e.keyCode == 39) {
    rightMove = true;
  }
}

/*Cuando se libera una tecla*/
function keyUpHandler(e) {
  if (e.keyCode == 37) {
    leftMove = false;
  } else if (e.keyCode == 39) {
    rightMove = false;
  }
}

/*Movimiento con el mause */
function mouseMoveHandler(e) {
    var mouseRelativeX = e.clientX - c.offsetLeft;
    if (mouseRelativeX > 0 && mouseRelativeX < c.width) {
        paddleX = mouseRelativeX - paddleWidth / 2;
    }
  }

function drawBall() {
  /* Dibujamos un circulo */
  ctx.beginPath(); /*Indica que vamos a iniciar una figura geometrica*/
  ctx.arc(
    x,
    y,
    radius,
    0,
    2 * Math.PI
  ); /* llamando a las variables para dibujar el canva con su ancho y lo dividimos entre 2*/
  ctx.fillStyle = "#7FFFD4"; /*Color de relleno*/
  ctx.fill();
  ctx.closePath(); /*Termina la figura*/
}

/*Dibujar una paleta para la bola asi evitar que la bola toque la parte inferior*/
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, paddleY, paddleWidth, paddleHeight);
  ctx.fillStyle = "#00FF00";
  ctx.fill();
  ctx.closePath();
}

/*Dibujar los bloques*/
function drawBricks() {
  for (let i = 0; i < brickColumn; i++) {
    for (let j = 0; j < brickRows; j++) {
      if (bricks[i][j].drawBrick) {
        var bx = i * (brickWidth + brickPadding) + brickOffsetLeft;
        var by = j * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[i][j].x = bx;
        bricks[i][j].y = by;

        ctx.rect(bx, by, brickWidth, brickHeight);
        ctx.fillStyle = "#00ff00";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

/*Deribando los bloques con la bola */
function dectHits() {
  for (let i = 0; i < brickColumn; i++) {
    for (let j = 0; j < brickRows; j++) {
      var b = bricks[i][j];
      if (bricks[i][j].drawBrick) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
        }

        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          dy = -dy;
          b.drawBrick = false;
          score++; /*Incrementa el puntaje*/

          if (score == brickColumn * brickRows) {
            youWind();
            //return;
          }
        }
      }
    }
  }
}

function youWind() {
    document.getElementById("arkanoidCanvaYW").style.display = "block";
    ctx.font = "40px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("YOU WIN", c.width / 2, c.height / 2);
    cancelAnimationFrame(animationID); // Detener la animación
}

/*Funcion para dibujar un texto con el puntaje*/
function drawScore() {
  ctx.font = "18px Arial";
  ctx.fillStyle = "#F8DA5B";
  ctx.fillText("Score: " + score, 10, 20);
}

function drawLives() {
    ctx.font = "18px Arial";
    ctx.fillStyle = "#F8DA5B";
    ctx.fillText("Lives: " + lives, c.width - 80, 20);
  }

/*Movimiento*/
function draw() {
  ctx.clearRect(
    0,
    0,
    c.width,
    c.height
  ); /*Reinicia el canva o liempa el lienzo*/
  drawPaddle();
  drawBall();
  drawBricks();
  dectHits();
  drawScore();
  drawLives();
  if (x + dx > c.width - radius || x + dx < radius) {
    dx = -dx;
  }

  if (y + dy < radius) {
    dy = -dy;
  } else {
    if (y + dy > c.height - radius) {
      if (x > paddleX && x < paddleX + paddleWidth) {
        dy = -dy;
      } else {
        lives--;
        if (lives < 1) {
            gameOver  = true; // Corregí la variable gameOver
            gameover();
            return;
        } else {
          x = c.width / 2;
          y = c.height - radius;
          dx = 2;
          dy = -2;
          paddleX = c.width / 2;
        }
      }
    }
  }

  /* Colision de la bola con la paleta */
  if (leftMove && paddleX > 0) {
    paddleX -= 8;
  }

  if (rightMove && paddleX < c.width - paddleWidth) {
    paddleX += 8;
  }

  /*Define la velocidad del movimiento*/
  x += dx;
  y += dy;

  if (!gameOver) {
    animationID = requestAnimationFrame(draw); // Almacena el identificador de la animación
  }
}

function gameover(){
    gameOver = true;
    document.getElementById("arkanoidCanvaGo").style.display = "block";
    ctx.font = "40px Arial";
    ctx.fillStyle = "#FFF";
    ctx.fillText("GAME OVER", c.width / 2, c.height / 2);
    cancelAnimationFrame(animationID); // Detener la animación
    gameOver = true; // Corregí la variable gameOver
}

document.getElementById("startButton").onclick = function() {
    if (gameOver){
        resetGame();
    } else{
        draw(); // Si el juego no ha terminado, iniciar el juego
    }
};

function resetGame(){
    gameOver = false; // Corregí la variable gameOver
    score = 0;
    lives = 3;
    x = c.width / 2;
    y = c.height - radius;
    dx = 2;
    dy = -2;
    paddleX = c.width / 2;

    // Limpiar el canvas de Game Over
    ctx.clearRect(0, 0, c.width, c.height);

    // Iniciar el juego
    draw();
}