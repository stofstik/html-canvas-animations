var constantInspired = function(window, document){
var NAME = 'CODAISSEUR GAME';
var MESSAGE = '';
var canvas;
var ctx;
var sizeX = 0;
var sizeY = 0;
var background;
var player1;
var player2;

var Background = function() {
}

var Player = function(startPosX) {
  var self = this;
  this.x = startPosX
  this.y = sizeY - 20;
  this.step = (sizeX / 2) / 5
  this.moveLeft = function() {
    if(self.x >= self.step) {
      self.x -= self.step;
    }
  };
  this.moveRight = function() {
    if(self.x < sizeX / 2 - self.step) {
      self.x += self.step;
    }
  };
  this.draw = function() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 10, 0, Math.PI * 2, true);
    ctx.stroke();
  };
};

var StraightLine = function(x1, x2, lineWidth) {
  var self = this;
  this.x1 = x1;
  this.y1 = 0;
  this.x2 = x2;
  this.y2 = sizeY;
  this.startTime = new Date().getTime();
  this.progressTime = 0;
  this.progressRatio = 0;
  this.opacity = 1;
  this.draw = function() {
    ctx.strokeStyle = 'rgba(' + '0,0,0' + ',' + self.opacity + ')';
    ctx.lineWidth = lineWidth;
    ctx.beginPath();
    ctx.moveTo(self.x1, self.y1);
    ctx.lineTo(self.x2, self.y2);
    ctx.stroke();
  };
};

// Listen for window resize
window.addEventListener('resize', resizeCanvas, false);

function resizeCanvas() {
  sizeX = window.innerWidth;
  sizeY = window.innerHeight;
  canvas.width = sizeX;
  canvas.height = sizeY;
  console.log('x: %s, y: %s', canvas.width, canvas.height);
  window.requestAnimationFrame(draw);
}

function init() {
  console.log('Loaded codaisseur game');
  // Get the canvas element to work with
  canvas = document.getElementById('canvas');
  ctx = canvas.getContext('2d');

  // Get the window size
  sizeX = window.innerWidth;
  sizeY = window.innerHeight;
  // Set the canvas size to window dimensions.
  // Note we are setting it on the 'element', not on the 'context'.
  // The context is for working with the canvas.
  canvas.width = sizeX;
  canvas.height = sizeY;

  background = new Background();

  player1 = new Player(sizeX * 0.25)

  // Listen for keystrokes
  window.addEventListener('keydown', function(e) {
    if(e.keyCode === 37) {
      player1.moveLeft();
      console.log('LEFT');
    } else if (e.keyCode === 39) {
      player1.moveRight();
      console.log('RIGHT');
    }
  });

  window.requestAnimationFrame(draw);
}

// Notice that we get a timestamp from the requestAnimationFrame callback
function draw(timestamp) {
  ctx.clearRect(0, 0, sizeX, sizeY);

  var seperator = new StraightLine(sizeX / 2, sizeX / 2, 6)
  seperator.draw();

  player1.draw();

  window.requestAnimationFrame(draw);
}

// Start...
init();
}(window, document);

