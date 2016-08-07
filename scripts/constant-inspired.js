var constantInspired = function(window, document){
var NAME = 'Constant Inspired';
var MESSAGE = '<p>Created By Daniel Verstegen</p>\r\n<p>Inspired By Constant Nieuwenhuys</p>\r\n<p>Drawn By Your Computer</p>';
var ONE_DEGREE = (Math.PI * 2) / 360;
var canvas;
var ctx;
var sizeX = 0;
var sizeY = 0;


var mouseX, mouseY;
var clickX, clickY;

var innerCirclePositionX       = 0;
var innerCirclePositionY       = 0;
var innerCircleRadius          = 0;
var innerCircleRadiusFollowing = 0;

var outerCirclePositionX = 0;
var outerCirclePositionY = 0;
var outerCircleRadius1   = 0;
var outerCircleRadius2   = 0;

var dotSize             = 0;

var straightLines = [];
var rotationLines = [];

var maxEntities = 50;
var maxAnimLength = 30000;
var minAnimLength = 10000;
var followMouse = false;

var RotationLine = function(ctx, x1, y1, x2, y2, degree, radius1, radius2){
    var self = this;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.startTime = -1;
    this.animationLength = Math.random() * (maxAnimLength - minAnimLength) + minAnimLength;
    this.progressTime = 0;
    this.progressRatio = 0;
    this.degreesToRotate = ONE_DEGREE * (Math.floor(Math.random() * (360 - 10) + 10));
    this.degree  = degree;
    this.radius1 = radius1;
    this.radius2 = radius2;
    this.opacity = 1;
    this.startRadius1 = self.radius1;
    this.startRadius2 = self.radius2;
    this.startDegree = self.degree;
    this.animate = function(timestamp) {
        // Get time span to work with the animation
        self.progressTime = timestamp - self.startTime;
        // Get a ratio, we can multiply any value we want to animate by it
        self.progressRatio = self.progressTime / self.animationLength;
        // Reset the animation if needed
        if(self.progressTime > self.animationLength){
            self.startTime = timestamp;
            // Set a new random duration
            self.animationLength = Math.random() * (maxAnimLength - minAnimLength) + minAnimLength;
            // New random degrees to rotate to
            self.degreesToRotate = ONE_DEGREE * (Math.floor(Math.random() * (360 - 10) + 10));
            // New random degree
            self.startDegree = Math.random() * Math.PI * 2;
            // New random radius
            self.startRadius1 = Math.random() * innerCircleRadius;
        }
        // Move the degree
        self.degree = self.startDegree + (self.degreesToRotate * self.progressRatio);
        // Move the radius
        if(clicked) {
            // If the we are following mouse compress inner radius to give a feeling of interaction
            self.startRadius1 = innerCircleRadiusFollowing;
            // TODO 
            // TODO slowly move outer radius position to mouse position
        }
        self.radius1 = self.startRadius1 * self.progressRatio;
        // Fade out at 70% of progress
        if(self.progressRatio > 0.7){
            // Catch opacity > 1 or < 0 TODO cleaner way?
            self.opacity = 1 - ((self.progressRatio - 0.7) * (1 / (1 - 0.7)));
            if(self.opacity < 0) {
                self.opacity = 0;
            }
        } else {
            self.opacity = 1;
        }
        // Calculate the new x,y positions using new degree and radii
        self.x1 = (Math.cos(self.degree + ONE_DEGREE * 30) * self.radius1) + mouseX;
        self.y1 = (Math.sin(self.degree + ONE_DEGREE * 30) * self.radius1) + mouseY;
        self.x2 = (Math.cos(self.degree) * self.radius2) + outerCirclePositionX;
        self.y2 = (Math.sin(self.degree) * self.radius2) + outerCirclePositionY;
    };
    this.moveRadiusPos = function(){
    }
    this.draw = function() {
        ctx.strokeStyle = 'rgba(' + '0,0,0' + ',' + self.opacity + ')';
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.arc(self.x1, self.y1, dotSize, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(self.x2, self.y2, dotSize, 0, Math.PI * 2, true);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(self.x1, self.y1);
        ctx.lineTo(self.x2, self.y2);
        ctx.stroke();
    };
};

var StraightLine = function(x1, y1, x2, y2){
    var self = this;
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.startTime = new Date().getTime();
    this.progressTime = 0;
    this.progressRatio = 0;
    this.opacity = 1;
    this.draw = function() {
        ctx.strokeStyle = 'rgba(' + '0,0,0' + ',' + self.opacity + ')';
        ctx.lineWidth = 0.3;
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

    recalcSizes();
    window.requestAnimationFrame(draw);
}

function click(event){
    clickX = event.clientX;
    clickY = event.clientY;
}
function mouseMove(event){
    if(!followMouse) return;
    mouseX = event.clientX;
    mouseY = event.clientY;
}

function init() {
    console.log('Loaded constant-inpired.js');
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

    recalcSizes();

    rotationLines = [];
    for(var i = 0; i < maxEntities; i++){
        var randomPoint1 = randomPointInRadius(innerCirclePositionX, innerCirclePositionY, innerCircleRadius);
        var randomPoint2 = randomPointBetweenRadii(outerCircleRadius1, outerCircleRadius2);

        var randX1 = randomPoint1.x;
        var randY1 = randomPoint1.y;
        var randX2 = outerCirclePositionX + randomPoint2.x;
        var randY2 = outerCirclePositionY + randomPoint2.y;

        var angle1  = randomPoint1.angle;
        var radius1 = randomPoint1.radius;
        var angle2  = randomPoint2.angle;
        var radius2 = randomPoint2.radius;

        rotationLines.push(new RotationLine(ctx, randX1, randY1, randX2, randY2, angle1, radius1, radius2));
    }
    straightLines = [];
    for(i = 0; i < maxEntities; i++){
        var x1,y1,x2,y2;
        x1 = Math.random() * sizeX;
        y1 = Math.random() * sizeY;
        x2 = Math.random() * sizeX;
        y2 = Math.random() * sizeY;
        straightLines.push(new StraightLine(x1,y1,x2,y2));
    }

    window.requestAnimationFrame(draw);
}

// Notice that we get a timestamp from the requestAnimationFrame callback
function draw(timestamp) {
    ctx.clearRect(0,0, sizeX, sizeY);

    for(var l in rotationLines){
        rotationLines[l].animate(timestamp);
        rotationLines[l].draw();
    }
    for(l in straightLines){
        straightLines[l].draw();
    }
    window.requestAnimationFrame(draw);
}

// Calculate sizes. We use percentages of width/height to scale multiple resolutions
function recalcSizes(){
    innerCircleRadius          = ((sizeY / 100) * 20) / 2; // e.g. 20%
    innerCircleRadiusFollowing = ((sizeY / 100) * 8) / 2; // e.g. 8%
    innerCirclePositionX       = sizeX / 2;
    innerCirclePositionY       = sizeY / 2;

    outerCirclePositionX = sizeX / 2;
    outerCirclePositionY = sizeY / 2;
    outerCircleRadius1   = ((sizeY / 100) * 15) / 2;
    outerCircleRadius2   = ((sizeY / 100) * 80) / 2;

    dotSize = ((sizeY / 100) * 1.5) / 2;
}

function randomPointInRadius(centerX, centerY, maxRadius) {
    var randAngle  = Math.random() * Math.PI * 2;
    var randRadius = Math.random() * maxRadius;
    return {x: centerX + (Math.cos(randAngle) * randRadius), y: centerY + (Math.sin(randAngle) * randRadius), angle: randAngle, radius: randRadius};
}

function randomPointBetweenRadii(innerCircle, outerCircle) {
    var randAngle  = Math.random() * Math.PI * 2;
    var randRadius = (Math.random() * (outerCircle - innerCircle) + innerCircle);
    return {x: Math.cos(randAngle) * randRadius, y: Math.sin(randAngle) * randRadius, angle: randAngle, radius: randRadius};
}

// Start...
init();

}(window, document);
