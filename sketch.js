// ==========================================
// Talking Cock — Full Game with Decks (p5.js)
// ==========================================

// Fonts
let myFont, subFont;

// Deck management
let currentDeck = 0; // 0 = home, 1,2,3 = decks

// Card variables
let cardFront = [], cardBack = [];
let shuffleFrames = [null, [], [], [], []]; // Deck indices 1,2,3
let cardFrontCurrent, cardBackCurrent, shuffleFramesCurrent;
let currentFrame = 0;
let playingShuffle = false;
let playingFlip = false;
let flipProgress = 0;
let showingBack = false;
let flipToFront = false;

// Card position and size
let cardX, cardY, cardW, cardH;

// Questions
let questions = [];
let availableQuestions = [];
let currentQuestion = "";

// ===============================
// Preload assets
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

  // Card position & size
  cardW = height / 2;
  cardH = height / 2;
  cardX = width / 2;
  cardY = height / 2;

  // Check URL query for deck
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
  background('#fcf7e6');

  if (currentDeck === 0) {
    drawHome();
  } else {
    drawDeck();
  }
}

// ===============================
// Home Screen
// ===============================
function drawHome() {
  fill(0);
  textSize(40);
  textFont(myFont);
  text("Talking Cock", width / 2, height / 4);
  textSize(40);
  text("Select your deck of nonsense", width / 2, height / 4 + 50);

  drawDeckButton("Deck 1", width / 2, height / 2, 1);
  drawDeckButton("Deck 2", width / 2, height / 2 + 100, 2);
  drawDeckButton("Deck 3", width / 2, height / 2 + 200, 3);
}

// Draw a deck selection button
function drawDeckButton(label, x, y, deckNum) {
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  stroke(0);
  fill(255);
  rect(x, y, 250, 70, 15);

  noStroke();
  fill(0);
  textSize(40);
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
// Load a deck
// ===============================
function loadDeck(deckNum) {
  currentQuestion = "";
  showingBack = false;
  playingShuffle = false;
  playingFlip = false;
  currentFrame = 0;
  flipProgress = 0;

  cardFrontCurrent = cardFront[deckNum];
  cardBackCurrent = cardBack[deckNum];
  shuffleFramesCurrent = shuffleFrames[deckNum];

  // Set questions per deck
  if (deckNum === 1) {
    questions = [
      "\n\nWould you rather\n\n\nhave your socks\nwet\n\nor\n\nyour underwear\nwet?",
  "\n\nWould you rather\n\n\nbe scratched\nby a cat\n\nor\n\nbe bitten\nby a dog?",
  "\n\nWould you rather\n\n\nwhisper forever\n\nor\n\nshout forever?",
  "\n\nWould you rather\n\n\ndrink drinks with\na spoon\n\nor\n\ndrink soup with\na straw?",
  "\n\nWould you rather\n\n\nstep on lego\n\nor\n\nstep on\ndog poop?",
  "\n\nWould you rather\n\n\nhave lukewarm\nfries forever\n\nor\n\nhave lukewarm\ncoffee forever?",
  "\n\nWould you rather\n\n\nbe hated by\nsomeone you like\n\nor\n\nbe liked by\nsomeone you hate?",
  "\n\nWould you rather\n\n\nlose your\nsense of taste\n\nor\n\nlose your\nhearing?",
  "\n\nWould you rather\n\n\npost your\ncamera roll\n\nor\n\nrelease your\ninternet search\nhistory?",
  "\n\nWould you rather\n\n\nwisdom tooth\npain\n\nor\n\ningrown toenail\npain?",
  "\n\nWould you rather\n\n\n10\ncockroaches\n\nor\n\n10\nlizards?",
  "\n\nWould you rather\n\n\nbe caught talking\nto yourself\n\nor\n\ndance in\npublic?",
  "\n\nWould you rather\n\n\nhave a super\nclingy partner\n\nor\n\nhave a\nnonchalant\npartner?",
  "\n\nWould you rather\n\n\nhave no more\nsugar forever\n\nor\n\nhave no more\nmeat forever?",
  "\n\nWould you rather\n\n\nlive in a\ndifferent country\nevery week\n\nor\n\nlive in one\ncountry forever?",
  "\n\nWould you rather\n\n\nalways be\n5 min late\n\nor\n\nalways be\n1 hour early?",
  "\n\nWould you rather\n\n\nairplane\naisle seat\n\nor\n\nairplane\nwindow seat?",
  "\n\nWould you rather\n\n\ndrink\nKopitiam drinks\n\nor\n\ndrink\ncafe drinks?",
  "\n\nWould you rather\n\n\nclimb a slope\n\nor\n\nclimb stairs?",
  "\n\nWould you rather\n\n\nride a\nrollercoaster\n\nor\n\nenter a\nhaunted house?",
  "\n\nWould you rather\n\n\neat ice cream\nin a cone\n\nor\n\neat ice cream\nin a cup?",
    ];
  } else if (deckNum === 2) {
    questions = [
     "\n\nYour thoughts on\n\n\nPineapple\non pizza",
      "\n\nYour thoughts on\n\n\nMint\nchocolate\nice cream",
      "\n\nYour thoughts on\n\n\nLicking vs\nbiting\nice cream",
      "\n\nYour thoughts on\n\n\n\nMatcha",
      "\n\nYour thoughts on\n\n\nShowering\nin the\nmorning",
      "\n\nYour thoughts on\n\n\nHoroscope\nenthusiasts",
      "\n\nYour thoughts on\n\n\nCats\nvs\ndogs",
      "\n\nYour thoughts on\n\n\nThe 3\nsecond rule\n(Food)",
      "\n\nYour thoughts on\n\n\nWearing the\nsame jeans\nfor a week",
      "\n\nYour thoughts on\n\n\nGhosting a\nfirst date",
      "\n\nYour thoughts on\n\n\nSock shoe,\nsock shoe\nvs\nsock sock,\nshoe shoe",
      "\n\nYour thoughts on\n\n\nCrocks being\na fashion\nstatement",
      "\n\nYour thoughts on\n\n\nArtificial\nintelligence",
    ];
  } else if (deckNum === 3) {
    questions = [
     "List 3 items you\nwould bring with\nyou on a deserted\nisland and why?",
      "If you were a\nghost,who would\nyou haunt and\nwhat would you do\nto annoy them?",
      "What type of\nbread would you\nbe and why?",
      "If you could tame\nany animal in the\nworld, what would\nit be and why?",
      "If you could swap\nbodies,who would\nyou swap with\nand why?",
    ];
  }

  // Initialize non-repeating question array
  availableQuestions = [...questions];
}

// ===============================
// Get a new random question without repeats
// ===============================
function getNewQuestion() {
  if (availableQuestions.length === 0) {
    availableQuestions = [...questions];
  }
  let index = floor(random(availableQuestions.length));
  let q = availableQuestions[index];
  availableQuestions.splice(index, 1);
  return q;
}

// ===============================
// Draw deck screen
// ===============================
function drawDeck() {
  drawBackButton();
  imageMode(CENTER);

  // Shuffle animation
  if (playingShuffle) {
    if (shuffleFramesCurrent[currentFrame]) {
      image(shuffleFramesCurrent[currentFrame], cardX, cardY, cardW * 2.3, cardH * 1.4);
    }
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
    let scaleFactor = flipProgress < 1 ? map(flipProgress, 0, 1, 1, 0) : map(flipProgress, 1, 2, 0, 1);

    if (flipProgress < 1) {
      if (flipToFront) image(cardBackCurrent, 0, 0, cardW * scaleFactor, cardH);
      else image(cardFrontCurrent, 0, 0, cardW * scaleFactor, cardH);
    } else {
      if (flipToFront) image(cardFrontCurrent, 0, 0, cardW * scaleFactor, cardH);
      else image(cardBackCurrent, 0, 0, cardW * scaleFactor, cardH);
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
        currentQuestion = getNewQuestion();
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
    textSize(50);
    textLeading(49);
    text(currentQuestion, width / 2, height / 2);
  } else {
    image(cardFrontCurrent, cardX, cardY, cardW, cardH);
  }

  // Instruction text at bottom
  fill(100);
  textSize(50);
  textFont(subFont);
  textAlign(CENTER, BOTTOM);
  text("Tap on the deck for a new question!", width / 2, height - 40);
}

// ===============================
// Input handling
// ===============================
function mousePressed() {
  if (currentDeck === 0) return;

  // Back button
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
// Draw back button
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
