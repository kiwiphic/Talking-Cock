// ==========================================
// Talking Cock — Home Screen (p5.js)
// ==========================================
let myFont;

function preload() {
  myFont = loadFont("Assets/Fonts/Filson_Soft_Bold.otf");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(myFont);
  textAlign(CENTER, CENTER);
}

function draw() {
  background(240);
  fill(0);
  textSize(40);
  text("Talking Cock", width / 2, height / 4);
  textSize(20);
  text("Select your deck of nonsense", width / 2, height / 4 + 50);

  drawDeckButton("Deck 1", width / 2, height / 2 - 60, "?deck=1");
  drawDeckButton("Deck 2", width / 2, height / 2, "?deck=2");
  drawDeckButton("Deck 3", width / 2, height / 2 + 60, "?deck=3");
}

function drawDeckButton(label, x, y, link) {
  rectMode(CENTER);
  stroke(0);
  fill(255);
  rect(x, y, 200, 50, 10);

  noStroke();
  fill(0);
  textSize(18);
  text(label, x, y);

  if (
    mouseIsPressed &&
    mouseX > x - 100 &&
    mouseX < x + 100 &&
    mouseY > y - 25 &&
    mouseY < y + 25
  ) {
    window.location.href = window.location.pathname + link;
  }
}
