let bubbles = [];
let sliders = [];
let labels = ['Count', 'Radius', 'Opacity', 'Trail', 'Movement', 'Lift', 'Gravity', 'Spread', 'Red Low', 'Red High', 'Green Low', 'Green High', 'Blue Low', 'Blue High', ]
let HUDon = true;
let resetButton;
let showBg = false;

//setting up some arbitrary initial values so that the program runs.
let count = 25;
let rad = 24;
let trans = 255;
let streak = 100;
let life = 1;
let lift = 1;
let grav = 1;
let spread = 1;
let redLow = 0;
let redHigh = 255;
let greenLow = 0;
let greenHigh = 255;
let blueLow = 0;
let blueHigh = 255;


function setup() {
	//this used to be: createCanvas(windowWidth, windowHeight);
	canvas = createCanvas(window.innerWidth, window.innerHeight)
	frameRate(15);
  background(125);

	for (var i = 0; i < 14; i++) {
		sliders[i] = createSlider(0, 255, random(0, 255));
		sliders[i].position(20, 100 + i * 20);
		labels[i] = createP(labels[i]);
		labels[i].position(160, 80 + i * 20);
		labels[i].style('font-size','20px');
		labels[i].style('font-family','Arial');
	}

//html text
	intro = createP('Right-click to save image. <br> Spacebar to hide menu.<br>@7ittledreams - 2018')
	intro.position (20, 00);
	intro.style('font-size','20px');
	intro.style('font-family','Arial');

	backgroundOn = createCheckbox('Particle mode', false);
	backgroundOn.position(20, 385);
	backgroundOn.changed(backgroundChange);
	backgroundOn.style('font-size','20px');
	backgroundOn.style('font-family','Arial');

	resetButton = createButton('Reset');
	resetButton.position(20, 415);
	resetButton.mousePressed(clearCanvas);
	resetButton.style('font-size','20px');
	resetButton.style('font-family','Arial');


	updateCount();
	clearCanvas();

}

//function to set up new bubbles
function updateCount(){
  bubbles = [];
	for (let i = 0; i < count; i++){
		let x = random(0, width);
		let y = random(0, height);
		bubbles [i] = new Bubble(x, y);
	}
}

//Resets the canvas
function clearCanvas(){
	background(125);
	updateCount();
}

//turns Particle mode on and off
function backgroundChange(){
	showBg = !showBg
}

function draw() {
	if (showBg == true){
		background(125);
	}

//Dan Shiffman's function to resize canvas as window size changes.
window.onresize = function() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  canvas.size(w,h);
  width = w;
  height = h;
	background(125);
}

//assigns each slider to a variable and sets the map to fit into 0-255
 sliders[0].changed(updateCount);
 count = map(sliders[0].value(), 0, 255, 2, 50);
 rad = map(sliders[1].value(), 0, 255, 2, 150);
 trans = map(sliders[2].value(), 0, 255, 2, 255);
 streak = map(sliders[3].value(),0, 255, 0, 1000);
 life = map(sliders[4].value(), 0, 255, 0, 50);
 lift = map(sliders[5].value(), 0, 255, 0, 20);
 grav = map(sliders[6].value(), 0, 255, 0, 20);
 spread = map(sliders[7].value(), 0, 255, 0, 20);
 redLow = sliders[8].value();
 redHigh = sliders[9].value();
 greenLow = sliders[10].value();
 greenHigh = sliders[11].value();
 blueLow = sliders[12].value();
 blueHigh = sliders[13].value();

//sets up bubbles and removes them if they are offscreen
	for (let i = bubbles.length -1; i > 0; i--){
		bubbles[i].show();
		bubbles[i].trail();
		bubbles[i].move();
		if (bubbles[i].offscreen > 0 && bubbles[i].history.length == 0) {
			bubbles.splice(i, 1);
			bubbles.push(new Bubble(random(0, width), random(0, height)));
		}
	}

//basically displays everything
	for (var i = 0; i < sliders.length; i++){
		if(HUDon == true){
			sliders[i].show();
			labels[i].show();
			resetButton.show();
			backgroundOn.show();
			intro.show();
		} else {
			sliders[i].hide();
			labels[i].hide();
			resetButton.hide();
			backgroundOn.hide();
			intro.hide();
		}
	}
}

//triggers parameters to show and hide
function keyPressed(){
	if (key == ' ') {
		HUDon = !HUDon
	}
}

//bubble class below
class Bubble{
	constructor(x, y){
		this.x = x;
		this.y = y;
		this.Red = random(redLow, redHigh);
		this.Green = random(greenLow, greenHigh);
		this.Blue = random(blueLow, blueHigh);
		this.history = [];
		this.offscreen = 0;
	}

	move(){
		//moves the bubble
		if (this.x > 0 - rad && this.x < windowWidth + rad && this.y > 0 - rad && this.y < windowHeight + rad){
			this.x = this.x + random (-life, life);
			this.y = this.y + random (-life, life);
		} else {
			this.offscreen = 1;
		}

		//history
		if (this.offscreen == 0){
		var v = createVector(this.x, this.y);
		this.history.push(v);
	}
		if (this.offscreen == 1 || this.history.length > streak){
			this.history.splice(0, 1);
		}

		// //move trail
		for (var i = 0; i < this.history.length; i++){
			this.history[i].y += random (-lift, grav);
			this.history[i].x += random (-spread, spread);
		}
	}
//end of move function

	show(){
		fill(this.Red, this.Green, this.Blue, trans);
		noStroke();
		ellipse(this.x, this.y, rad, rad);
	}

	trail(){
		fill(this.Red, this.Green, this.Blue, trans);
		for (var i = 0; i < this.history.length; i++){
			var pos = this.history[i];
			noStroke();
			ellipse(pos.x, pos.y, rad, rad);
		}
	}
}
