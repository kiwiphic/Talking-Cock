// ==========================================
// Talking Cock — Full Game with Decks (Preloaded)
// ==========================================

// Fonts and assets
let myFont;
let currentDeck = 0; // 0 = home, 1,2,3 = decks

// Card variables
let cardFront = [], cardBack = [];
let shuffleFrames = [[], [], []]; // array of arrays for decks
let cardFrontCurrent, cardBackCurrent, shuffleFramesCurrent;
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

// ===============================
// Preload all assets
// ===============================
function preload() {
  myFont = loadFont("Assets/Fonts/Filson_Soft_Bold.otf");
  subFont = loadFont("Assets/Fonts/Quicksand_Book.otf");

  // Deck 1
  cardFront[1] = loadImage("Assets/Cards/Card1_Front.png");
  cardBack[1] = loadImage("Assets/Cards/Card1_Back.png");
  for (let i = 0; i <= 54; i++) {
    shuffleFrames[1].push(loadImage(`Assets/Shuffle1/Shuffle_${nf(i,5)}.png`));
  }

  // Deck 2
  cardFront[2] = loadImage("Assets/Cards/Card2_Front.png");
  cardBack[2] = loadImage("Assets/Cards/Card2_Back.png");
  for (let i = 0; i <= 54; i++) {
    shuffleFrames[2].push(loadImage(`Assets/Shuffle2/Shuffle_${nf(i,5)}.png`));
  }

  // Deck 3
  cardFront[3] = loadImage("Assets/Cards/Card3_Front.png");
  cardBack[3] = loadImage("Assets/Cards/Card3_Back.png");
  for (let i = 0; i <= 54; i++) {
    shuffleFrames[3].push(loadImage(`Assets/Shuffle3/Shuffle_${nf(i,5)}.png`));
  }
}

// ===============================
// Setup canvas
// ===============================
function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(myFont);
  textAlign(CENTER, CENTER);

  // Card position and size
  cardX = height / 2;
  cardY = height / 2;
  cardW = width / 2;
  cardH = height / 2;

  // Detect query string deck
  const params = new URLSearchParams(window.location.search);
  const deck = params.get("deck");
  if (deck) {
    currentDeck = int(deck);
    loadDeck(currentDeck);
  }
}

// ===============================
// Draw loop
// ===============================
function draw() {
  background(240);

  if (currentDeck === 0) {
    drawHome();
  } else {
    drawDeck();
  }
}

// ===============================
// HOME SCREEN
// ===============================
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

// Draw a deck selection button
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

// ===============================
// LOAD DECK
// ===============================
function loadDeck(deckNum) {
  currentQuestion = "";
  showingBack = false;
  playingShuffle = false;
  playingFlip = false;
  currentFrame = 0;
  flipProgress = 0;

  // Instruction text at bottom
  fill(100);
  textSize(50);
  textAlign(CENTER, BOTTOM);
  textFont(subFont);
  text("Tap on the deck for a new question!", width / 2, height - 40);

  // Assign current deck images
  cardFrontCurrent = cardFront[deckNum];
  cardBackCurrent = cardBack[deckNum];
  shuffleFramesCurrent = shuffleFrames[deckNum];

  // Deck-specific questions
  if (deckNum === 1) {
    questions = [
      "Would you rather have your socks wet or your underwear wet?",
      "Be scratched by a cat or be bitten by a dog?",
      "Whisper forever or shout forever?"
    ];
  } else if (deckNum === 2) {
    questions = [
      "Pineapple on pizza or no pineapple?",
      "Ice cream with fries or fries with ice cream?"
    ];
  } else if (deckNum === 3) {
    questions = [
      "Hot takes deck question 1",
      "Hot takes deck question 2"
    ];
  }
}

// ===============================
// DRAW DECK
// ===============================
function drawDeck() {
  drawBackButton();
  imageMode(CENTER);

  // Shuffle animation
  if (playingShuffle) {
    image(shuffleFramesCurrent[currentFrame], cardX, cardY, height, height*5/8);
    if (frameCount % 2 === 0) currentFrame++;
    if (currentFrame >= shuffleFramesCurrent.length) {
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
    let scaleFactor = flipProgress < 1 ? map(flipProgress,0,1,1,0) : map(flipProgress,1,2,0,1);

    if (flipProgress < 1) {
      if (flipToFront) image(cardBackCurrent, 0,0, cardW*scaleFactor, cardH);
      else image(cardFrontCurrent,0,0, cardW*scaleFactor, cardH);
    } else {
      if (flipToFront) image(cardFrontCurrent,0,0, cardW*scaleFactor, cardH);
      else image(cardBackCurrent,0,0, cardW*scaleFactor, cardH);
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
    image(cardBackCurrent, cardX, cardY, cardW, cardH);
    fill(0);
    textAlign(CENTER, CENTER);
    textFont(myFont);
    textSize(20);
    textLeading(24);
    text(currentQuestion, width / 2, height / 2);
  } else {
    image(cardFrontCurrent, cardX, cardY, cardW, cardH);
  }
}

// ===============================
// INPUT HANDLING
// ===============================
function mousePressed() {
  if (currentDeck === 0) return; // no deck interaction on home

  // Back to home button
  if (mouseX > 20 && mouseX < 120 && mouseY > 20 && mouseY < 60) {
    currentDeck = 0;
    return;
  }

  // Card hitbox
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

// ===============================
// DRAW BACK BUTTON
// ===============================
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

