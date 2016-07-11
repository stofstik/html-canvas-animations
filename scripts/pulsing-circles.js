var pulsingCircles = function(window, document){
var ctx;
var sizeX = 0;
var sizeY = 0;
var globalMaxRadius = 10;
var globalMinRadius = 5;
var globalMaxPulses = 5;
var globalMinPulses = 2;
var globalMaxAnimTime = 5000;
var globalMinAnimTime = 1000;
var amountOfCircles = 30;
var id = 0;

var circles = [];

function Circle(id, x, y, radius, maxRadius, animTime, timeToLive, startFadeOut) {
    this.id = id;
    this.amountPulsed = 0;
    this.startTime = new Date().getTime();
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.maxRadius = maxRadius;
    this.opacity = 1;
    this.animProgress = 0;
    this.animTime = animTime;
    this.timeToLive = timeToLive; // In pulses
    this.startFadeOut = startFadeOut;
}

window.addEventListener('resize', resizeCanvas, false);

function init() {
    ctx = document.getElementById('canvas').getContext('2d');

    sizeX = window.innerWidth;
    sizeY = window.innerHeight;
    startTime = new Date().getTime();

    for(var i = 0; i < amountOfCircles; i++) {
        newCircle();
    }
    console.log(circles);

    window.requestAnimationFrame(draw);
}

function resizeCanvas() {
    sizeX = window.innerWidth;
    sizeY = window.innerHeight;
    draw();
}

function newCircle() {
    // get a random position for x and y
    var randX = Math.floor(Math.random() * 300) + 1;
    var randY = Math.floor(Math.random() * 300) + 1;
    var randMaxRadius = Math.floor(Math.random() * globalMaxRadius) + globalMinRadius;
    var randAnimTime  = Math.floor(Math.random() * globalMaxAnimTime) + globalMinAnimTime;
    var randAmountOfPulses = Math.floor(Math.random() * globalMaxPulses) + globalMinPulses;
    // Push a new circle to the circles array
    // See circle object for info
    circles.push(new Circle(id, randX,randY, 0, randMaxRadius, randAnimTime, randAmountOfPulses, randAnimTime / 2));
    id++;
}

function removeCircle(circle) {
    var index = circles.indexOf(circle);
    if(index > -1) {
        circles.splice(index, 1);
        console.log('removed: %s', circle.id);
    }
}

function draw() {
    ctx.clearRect(0, 0, 300, 300);

    for(var item in circles){
        ctx.beginPath();
        var circle = circles[item];
        // Get a time span to work with the animation
        circle.animProgress = new Date().getTime() - circle.startTime;
        if (circle.animProgress >= circle.animTime) {
            // Start new pulse
            circle.amountPulsed += 1;
            circle.startTime = new Date().getTime();
        }
        if (circle.animProgress >= circle.startFadeOut) {
            // Start fading out
            circle.opacity = 2 - circle.animProgress * (1 / (circle.animTime - circle.startFadeOut));
        } else {
            circle.opacity = 1;
        }
        if (circle.amountPulsed >= circle.timeToLive) {
            console.log('trying to remove circle %s', circle.id);
            removeCircle(circle);
            newCircle();
        }
        ctx.fillStyle = 'rgba(0,0,0,' + circle.opacity + ')';
        ctx.moveTo(circle.x, circle.y);
        // The radius of this circle is the animation progress in milliseconds
        // times the max radius it wil reach over its total animation time
        circle.radius = circle.animProgress * (circle.maxRadius / circle.animTime);
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2, true);
        ctx.fill();
    }
    window.requestAnimationFrame(draw);
}

init();
}(window, document);
