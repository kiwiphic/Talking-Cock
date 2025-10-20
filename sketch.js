// ==========================================
// Talking Cock — Full Game with Decks
// ==========================================

// Fonts and assets
let myFont;
let currentDeck = 0; // 0 = home, 1,2,3 = decks

// Card variables
let cardFront, cardBack;
let shuffleFrames = [];
let currentFrame = 0;
let playingShuffle = false;
let playingFlip = false;
let flipProgress = 0;
let showingBack = false;
let flipToFront = false;

// Card position and size (scaled to preserve aspect ratio)
let cardX, cardY, cardW, cardH;

// Question variables
let questions = [];
let currentQuestion = "";

// Preload assets
function preload() {
  myFont = loadFont("Assets/Fonts/Filson_Soft_Bold.otf");

  // Optional: Preload home deck button images if any
}

// Setup canvas
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(myFont);
  textAlign(CENTER, CENTER);

  // Set card position and size
  cardX = width / 2;
  cardY = height / 2;
  cardW = 350;
  cardH = 350;

  // Detect query string deck (if user shares link)
  const params = new URLSearchParams(window.location.search);
  const deck = params.get("deck");
  if (deck) {
    currentDeck = int(deck);
    loadDeck(currentDeck);
  }
}

// Draw loop
function draw() {
  background(240);

  if (currentDeck === 0) {
    drawHome();
  } else {
    drawDeck();
  }
}

// ==========================================
// HOME SCREEN
// ==========================================
function drawHome() {
  fill(0);
  textSize(40);
  text("Talking Cock", width / 2, height / 4);
  textSize(20);
  text("Select your deck of nonsense", width / 2, height / 4 + 50);

  drawDeckButton("Deck 1", width / 2, height / 2 - 60, 1);
  drawDeckButton("Deck 2", width / 2, height / 2, 2);
  drawDeckButton("Deck 3", width / 2, height / 2 + 60, 3);
}

// Button drawing and click handling
function drawDeckButton(label, x, y, deckNum) {
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
    currentDeck = deckNum;
    loadDeck(deckNum);
  }
}

// ==========================================
// DECK LOADING
// ==========================================
function loadDeck(deckNum) {
  shuffleFrames = [];
  currentQuestion = "";
  showingBack = false;
  playingShuffle = false;
  playingFlip = false;
  currentFrame = 0;
  flipProgress = 0;

  if (deckNum === 1) {
    cardFront = loadImage("Assets/Card1_Front.png");
    cardBack = loadImage("Assets/Card1_Back.png");
    questions = [
      "Would you rather have your socks wet or your underwear wet?",
      "Be scratched by a cat or be bitten by a dog?",
      "Whisper forever or shout forever?"
    ];
    for (let i = 0; i <= 54; i++) {
      shuffleFrames.push(loadImage(`Shuffle/Shuffle_${nf(i,5)}.png`));
    }
  } else if (deckNum === 2) {
    cardFront = loadImage("Assets/Card2_Front.png");
    cardBack = loadImage("Assets/Card2_Back.png");
    questions = [
      "Pineapple on pizza or no pineapple?",
      "Ice cream with fries or fries with ice cream?"
    ];
    for (let i = 0; i <= 54; i++) {
      shuffleFrames.push(loadImage(`Shuffle2/Shuffle2_${nf(i,5)}.png`));
    }
  } else if (deckNum === 3) {
    cardFront = loadImage("Assets/Card3_Front.png");
    cardBack = loadImage("Assets/Card3_Back.png");
    questions = [
      "Hot takes deck question 1",
      "Hot takes deck question 2"
    ];
    for (let i = 0; i <= 54; i++) {
      shuffleFrames.push(loadImage(`Shuffle3/Shuffle3_${nf(i,5)}.png`));
    }
  }
}

// ==========================================
// DRAW DECK
// ==========================================
function drawDeck() {
  // Draw "Back to Home" button
  drawBackButton();

  imageMode(CENTER);

  // Shuffle animation
  if (playingShuffle) {
    image(shuffleFrames[currentFrame], cardX, cardY, cardW*2.3, cardH*1.4); // scaled like original
    if (frameCount % 2 === 0) currentFrame++;
    if (currentFrame >= shuffleFrames.length) {
      playingShuffle = false;
      currentFrame = 0;
      playingFlip = true;
      flipProgress = 0;
      flipToFront = false;
    }
    return;
  }

  // Flip animation
  if (playingFlip) {
    push();
    translate(cardX, cardY);

    let scaleFactor;
    if (flipProgress < 1) {
      scaleFactor = map(flipProgress, 0, 1, 1, 0);
      if (flipToFront) {
        image(cardBack, 0, 0, cardW*scaleFactor, cardH);
      } else {
        image(cardFront, 0, 0, cardW*scaleFactor, cardH);
      }
    } else {
      scaleFactor = map(flipProgress, 1, 2, 0, 1);
      if (flipToFront) {
        image(cardFront, 0, 0, cardW*scaleFactor, cardH);
      } else {
        image(cardBack, 0, 0, cardW*scaleFactor, cardH);
      }
    }
    pop();
    flipProgress += 0.1;

    if (flipProgress >= 2) {
      playingFlip = false;
      if (flipToFront) {
        showingBack = false;
        playingShuffle = true;
        currentFrame = 0;
      } else {
        showingBack = true;
        currentQuestion = random(questions);
      }
    }
    return;
  }

  // Normal card state
  if (showingBack) {
    image(cardBack, cardX, cardY, cardW, cardH);
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(myFont);
    textSize(20);
    textLeading(24); // line spacing
    text(currentQuestion, width / 2, height / 2);
  } else {
    image(cardFront, cardX, cardY, cardW, cardH);
  }
}

// ==========================================
// INPUT HANDLING
// ==========================================
function mousePressed() {
  if (currentDeck === 0) return; // no deck interaction on home

  // Check back button
  if (mouseX > 20 && mouseX < 120 && mouseY > 20 && mouseY < 60) {
    currentDeck = 0;
    return;
  }

  // Check card hitbox
  if (!playingShuffle && !playingFlip &&
      mouseX > cardX - cardW/2 && mouseX < cardX + cardW/2 &&
      mouseY > cardY - cardH/2 && mouseY < cardY + cardH/2) {
    if (showingBack) {
      playingFlip = true;
      flipProgress = 0;
      flipToFront = true;
    } else {
      playingShuffle = true;
      currentFrame = 0;
    }
  }
}

// ==========================================
// DRAW BACK BUTTON
// ==========================================
function drawBackButton() {
  rectMode(CORNER);
  stroke(0);
  fill(255);
  rect(20, 20, 100, 40, 8);
  noStroke();
  fill(0);
  textSize(16);
  textAlign(CENTER, CENTER);
  text("Back", 70, 40);
}
