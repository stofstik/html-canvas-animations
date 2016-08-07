var followMouse = function(window, document){
var NAME = 'Follow Mouse';
var MESSAGE = '<p>Created By Daniel Verstegen</p>\r\n<p>Drawn By Your Computer</p>';

var canvas;
var ctx;
var sizeX = 0;
var sizeY = 0;
var mouseX = 0;
var mouseY = 0;

var MAX_ENTITIES = 1;
var entities = [];

var Dot = function(x, y){
    var self = this;
    this.x = x;
    this.y = y;
    this.oldX = x;
    this.oldY = y;
    this.newX = x;
    this.newY = y;
    this.startTime = new Date().getTime();
    this.lastMove = new Date().getTime();
    this.delay = 1000; // Move point to mouse position after this delay
    this.draw = function(ctx) {
        var radius = 5;
        if(self.startTime + self.delay < new Date().getTime()){
            console.log('fired');
            self.newX = mouseX;
            self.newY = mouseY;
            self.startTime = new Date().getTime();
        }
        ctx.beginPath();
        ctx.arc(self.newX, self.newY, radius, 0, Math.PI * 2, true);
        ctx.stroke();
    };
};

function init() {
    console.log('Loaded follow-mouse.js');
    //
    // Set the title and message for this canvas animation
    document.title = NAME;
    var footer = document.getElementById('footer');
    footer.innerHTML = MESSAGE;
    // Get the canvas element to work with
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.addEventListener('click', click, false);
    canvas.addEventListener('mousemove', mouseMove, false);

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

    for(var i = 0; i < MAX_ENTITIES; i++) {
        entities.push(new Dot(mouseX, mouseY));
    }
    window.requestAnimationFrame(draw);
}

function click(event){
}

function mouseMove(event){
    mouseX = event.clientX;
    mouseY = event.clientY;
    for(var i in entities){
        entities[i].lastMove = new Date().getTime();
    }
}

function draw() {
    ctx.clearRect(0,0, sizeX, sizeY);

    for(var i in entities){
        entities[i].draw(ctx);
    }
    window.requestAnimationFrame(draw);
}

// Start...
init();

}(window, document);
