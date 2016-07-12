var pulsingCircles = function(window, document){
var canvas;
var ctx;
var sizeX = 0;
var sizeY = 0;
var globalMaxRadius = 10;
var globalMinRadius = 5;
var globalMaxPulses = 5;
var globalMinPulses = 2;
var globalMaxAnimTime = 5000;
var globalMinAnimTime = 1000;
var amountOfCircles = 500;
var id = 0;
var colors = [];
var circles = [];

function Circle(id, x, y, radius, maxRadius, rgbColorString, animTime, timeToLive, startFadeOut) {
    this.id = id;
    this.amountPulsed = 0;
    this.startTime = new Date().getTime();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.maxRadius = maxRadius;
    this.rgbColorString = rgbColorString;
    this.opacity = 1;
    this.animProgress = 0;
    this.animTime = animTime;
    this.timeToLive = timeToLive; // In pulses
    this.startFadeOut = startFadeOut;
}

// Listen for window resize
window.addEventListener('resize', resizeCanvas, false);

function init() {
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

    // Create initial circles
    for(var i = 0; i < amountOfCircles; i++) {
        newCircle();
    }

    // Initiate garbage collector
    collectGarbage(globalMaxAnimTime);

    window.requestAnimationFrame(draw);
}

function resizeCanvas() {
    sizeX = window.innerWidth;
    sizeY = window.innerHeight;
    canvas.width = sizeX;
    canvas.height = sizeY;
    window.requestAnimationFrame(draw);
}

function newCircle() {
    // get a random position for x and y
    var randX = Math.floor(Math.random() * sizeX) + 1;
    var randY = Math.floor(Math.random() * sizeY) + 1;
    var randMaxRadius = Math.floor(Math.random() * globalMaxRadius) + globalMinRadius;
    var randAnimTime  = Math.floor(Math.random() * globalMaxAnimTime) + globalMinAnimTime;
    var randTimeToLive = Math.floor(Math.random() * globalMaxPulses) + globalMinPulses;
    var rgbColorString = Math.floor(Math.random() * colors.length) + 0;
    // Push a new circle to the circles array
    // See circle object for info
    circles.push(new Circle(id, randX,randY, 0, randMaxRadius, rgbColorString, randAnimTime, randTimeToLive, randAnimTime / 2));
    id++;
}

// Collect dead circles. We use this batch method to increase performance.
// Splicing the array each time a circle died resulted in the canvas flashing/blinking
function collectGarbage(frequency) {
    window.setInterval(function() {
        if (circles.length <= 0) return;
        for (var i = 0; i < circles.length; i++) {
            var circle = circles[i];
            if (circle.amountPulsed >= circle.timeToLive) {
                circles.splice(i, 1);
                newCircle();
            }
        }
    }, frequency);
}

function draw() {
    ctx.clearRect(0, 0, sizeX, sizeY);

    for(var item in circles){
        var circle = circles[item];
        // Check if this circle has died, if it has, skip next logic
        if (circle.amountPulsed >= circle.timeToLive) {
            continue;
        }
        // Get a time span to work with the animation
        circle.animProgress = new Date().getTime() - circle.startTime;
        // Reset the animation if needed
        if (circle.animProgress > circle.animTime) {
            circle.amountPulsed += 1;
            circle.startTime = new Date().getTime();
        }
        // Start fading out the animation
        if (circle.animProgress > circle.startFadeOut) {
            circle.opacity = 1 - Math.round((circle.animProgress - circle.startFadeOut) * 1 / (circle.animTime - circle.startFadeOut) * 1000) / 1000;
            if (circle.opacity < 0) circle.opacity = 0;
        } else {
            circle.opacity = 1;
        }
        // Start drawing
        ctx.fillStyle = 'rgba(0,0,0,' + circle.opacity + ')';
        ctx.beginPath();
        ctx.moveTo(circle.x, circle.y);
        // The radius of this circle is the animation progress in milliseconds
        // times the max radius it wil reach over its total animation time
        circle.radius = circle.animProgress * (circle.maxRadius / circle.animTime);
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
        ctx.fill();
    }
    window.requestAnimationFrame(draw);
}

// Start the show : )
init();

}(window, document);
