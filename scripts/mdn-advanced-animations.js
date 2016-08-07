var mdnCanvasAnimations = function(window, document){
var NAME = 'MDN Canvas Animations';
var MESSAGE = '<p>MDN Advanced Canvas Animation Tutorial</p>';

var canvas;
var ctx;
var sizeX = 0;
var sizeY = 0;

var ball = {
    x: 100,
    y: 100,
    vx: 5,
    vy: 2,
    radius: 25,
    color: 'blue',
    draw: function(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = this.color;
        ctx.fill();
    }
};

function init() {
    console.log('Loaded mdn-advanced-animations.js');
    // Set the title and message for this canvas animation
    document.title = NAME;
    var footer = document.getElementById('footer');
    footer.innerHTML = MESSAGE;
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

    mouseX = sizeX / 2;
    mouseY = sizeY / 2;

    window.requestAnimationFrame(draw);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ball.draw();
    ball.x += ball.vx;
    ball.y += ball.vy;
    window.requestAnimationFrame(draw);
}

init();

}(window, document);

