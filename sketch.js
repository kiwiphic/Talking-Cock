// ==========================================
// Talking Cock — Full Game with Decks (p5.js)
// ==========================================

// Disable p5 friendly error system for better performance (especially on mobile)
p5.disableFriendlyErrors = true;

// Fonts
let myFont, subFont;

// Deck management
let currentDeck = 0; // 0 = home, 1,2,3 = decks
let deckTitle = ""; // shared title for each deck

// Card variables
let cardFront = [], cardBack = [];
let shuffleFrames = [null, [], [], [], []]; // Deck indices 1,2,3
let cardFrontCurrent, cardBackCurrent, shuffleFramesCurrent, homeTitle;
let currentFrame = 0;
let playingShuffle = false;
let playingFlip = false;
let flipProgress = 0;
let showingBack = false;
let flipToFront = false;

// Triangles
let angle = 0;
let bgTriangles = [];
let homeTriangles = [];
let homeAngle = 0;

// Card position and size
let cardX, cardY, cardW, cardH;

// Questions
let questions = [];
let availableQuestions = [];
let currentQuestion = "";

// Home buttons
let homeButtons = [];
let homeButtonScale = 0.14; // Adjust this to resize all buttons at once (1 = original size)

// ===============================
// Preload assets
// ===============================
function preload() {
  myFont = loadFont("Assets/Fonts/Filson_Soft_Bold.otf");
  subFont = loadFont("Assets/Fonts/Quicksand_Book.otf");

  // Home assets
  homeTitle = loadImage("Assets/Home/Home_Title.png");
  homeButton1 = loadImage("Assets/Home/Home_Button1.png");
  homeButton2 = loadImage("Assets/Home/Home_Button2.png");
  homeButton3 = loadImage("Assets/Home/Home_Button3.png");
  homeMascot = loadImage("Assets/Home/Home_Mascot.png");

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

  // Initialize home triangles (4 colors)
  for (let i = 0; i < 40; i++) {
    let x, y;
    do {
      x = random(width);
      y = random(height);
    } while (x > width * 0.3 && x < width * 0.7 && y > height * 0.3 && y < height * 0.7);

    homeTriangles.push({
      x,
      y,
      size: random(80, 180),
      speed: random(0.01, 0.03),
      alphaOffset: random(TWO_PI),
      driftX: random(-0.3, 0.3),
      driftY: random(-0.3, 0.3),
      aspectX: random(0.6, 1.4),
      aspectY: random(0.6, 1.4),
      baseRotation: random(TWO_PI),
      color: random([
        color(232, 68, 37),  // red
        color(255, 196, 12), // yellow
        color(4, 116, 60),   // green
        color(8, 125, 190)   // blue
      ])
    });
  }

  // Card setup
  cardW = height / 2;
  cardH = height / 2;
  cardX = width / 2;
  cardY = height / 2;

  // URL deck param
  const params = new URLSearchParams(window.location.search);
  const deck = params.get("deck");
  if (deck) {
    currentDeck = int(deck);
    loadDeck(currentDeck);
  }

  // Home buttons setup (speech bubble PNGs)
  homeButtons = [
    { img: homeButton1, x: -400, y: height / 2 + 30, targetX: width / 2 - 30, side: "left", deck: 1 },
    { img: homeButton2, x: width + 400, y: height / 2 + 200, targetX: width / 2 + 30, side: "right", deck: 2 },
    { img: homeButton3, x: -400, y: height / 2 + 390, targetX: width / 2 - 30, side: "left", deck: 3 },
  ];

  homeMascotObj = {
  img: homeMascot,
  x: width / 2,
  y: height + 200,        // start below the screen
  targetY: height * 1, // where it settles (near bottom)
  scale: 0.2              // adjust size if needed
};
}

// ===============================
// DRAW LOOP
// ===============================
function draw() {
  background('#fcf7e6');

  if (currentDeck === 0) {
    drawHomeBackground(); // rotating triangles
    drawHomeTitle();      // bouncing title image
    drawHomeButtons();    // PNG buttons
    drawHomeMascot();     //  add mascot on top of everything else
  } else {
    drawDeck();
  }
}

// ===============================
// HOME BACKGROUND (triangles)
// ===============================
function drawHomeBackground() {
  blendMode(MULTIPLY);
  noStroke();

  for (let t of homeTriangles) {
    push();
    translate(t.x, t.y);
    rotate((t.baseRotation || 0) + homeAngle * (t.speed || 0.02) * 2);
    fill(t.color);

    if (!t.bounceSpeed) t.bounceSpeed = random(3, 6);
    let bounceScale = 0.9 + 0.2 * sin(homeAngle * t.bounceSpeed + (t.alphaOffset || 0));

    let r = (t.size || 100) * bounceScale / 2;
    beginShape();
    for (let i = 0; i < 3; i++) {
      let a = TWO_PI / 3 * i - HALF_PI;
      let vx = cos(a) * r * (t.aspectX || 1);
      let vy = sin(a) * r * (t.aspectY || 1);
      vertex(vx, vy);
    }
    endShape(CLOSE);
    pop();

    // Drift + wrapping
    t.x += (t.driftX || 0);
    t.y += (t.driftY || 0);
    if (t.x < -t.size) t.x = width + t.size;
    if (t.x > width + t.size) t.x = -t.size;
    if (t.y < -t.size) t.y = height + t.size;
    if (t.y > height + t.size) t.y = -t.size;
  }

  homeAngle += 0.02;
  blendMode(BLEND);
}

// ===============================
// HOME TITLE IMAGE
// ===============================
function drawHomeTitle() {
  imageMode(CENTER);
  let bounce = sin(frameCount * 0.08) * 10; // noticeable bounce
  let imgScale = 0.14;

  image(
    homeTitle,
    width / 2,
    height * 0.18 + bounce,
    homeTitle.width * imgScale,
    homeTitle.height * imgScale
  );
}

// ===============================
// HOME PNG BUTTONS
// ===============================
function drawHomeButtons() {
  imageMode(CENTER);
  noStroke();

  for (let btn of homeButtons) {
    // Slide-in animation
    if (btn.side === "left") btn.x = lerp(btn.x, btn.targetX - 140, 0.08);
    else btn.x = lerp(btn.x, btn.targetX + 140, 0.08);

    // Pop/bounce effect
    let scale = homeButtonScale * (1 + 0.025 * sin(frameCount * 0.1 + btn.y * 0.01));

    // Draw image
    let imgW = btn.img.width * scale;
    let imgH = btn.img.height * scale;
    image(btn.img, btn.x, btn.y, imgW, imgH);

    // Click hitbox
    if (
      mouseIsPressed &&
      mouseX > btn.x - imgW / 2 && mouseX < btn.x + imgW / 2 &&
      mouseY > btn.y - imgH / 2 && mouseY < btn.y + imgH / 2
    ) {
      currentDeck = btn.deck;
      loadDeck(btn.deck);
    }
  }
}

// ===============================
// HOME MASCOT POP-UP ANIMATION 
// ===============================
function drawHomeMascot() {
  imageMode(CENTER);

  // smooth slide-up from bottom
  homeMascotObj.y = lerp(homeMascotObj.y, homeMascotObj.targetY, 0.08);

  // gentle bounce
  let bounce = sin(frameCount * 0.08) * 2;
  let scale = homeMascotObj.scale + 0.01 * sin(frameCount * 0.1);

  image(
    homeMascotObj.img,
    homeMascotObj.x,
    homeMascotObj.y + bounce,
    homeMascotObj.img.width * scale,
    homeMascotObj.img.height * scale
  );
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

  cardFrontCurrent = cardFront[deckNum];
  cardBackCurrent = cardBack[deckNum];
  shuffleFramesCurrent = shuffleFrames[deckNum];

  // Assign deck questions
  if (deckNum === 1) {
    deckTitle = "\n\nWould You Rather\n\n\n\nor\n\n\n\n";
    questions = [
     "have your socks\nwet\n\n\nyour underwear\nwet?",
  "be scratched\nby a cat\n\n\nbe bitten\nby a dog?",
  "whisper forever\n\n\nshout forever?",
  "drink drinks with\na spoon\n\n\ndrink soup with\na straw?",
  "step on lego\n\n\nstep on\ndog poop?",
  "have lukewarm\nfries forever\n\n\nhave lukewarm\ncoffee forever?",
  "be hated by\nsomeone you like\n\n\nbe liked by\nsomeone you hate?",
  "lose your\nsense of taste\n\n\nlose your\nhearing?",
  "post your\ncamera roll\n\n\nrelease your\ninternet search\nhistory?",
  "wisdom tooth\npain\n\n\ningrown toenail\npain?",
  "10\ncockroaches\n\n\n10\nlizards?",
  "be caught talking\nto yourself\n\n\ndance in\npublic?",
  "have a super\nclingy partner\n\n\nhave a\nnonchalant\npartner?",
  "have no more\nsugar forever\n\n\nhave no more\nmeat forever?",
  "live in a\ndifferent country\nevery week\n\n\nlive in one\ncountry forever?",
  "always be\n5 min late\n\n\nalways be\n1 hour early?",
  "airplane\naisle seat\n\n\nairplane\nwindow seat?",
  "drink\nKopitiam drinks\n\n\ndrink\ncafe drinks?",
  "climb a slope\n\n\nclimb stairs?",
  "ride a\nrollercoaster\n\n\nenter a\nhaunted house?",
  "eat ice cream\nin a cone\n\n\neat ice cream\nin a cup?",
  "have no\nknees\n\n\nhave no\nelbows?",
  "work\nfrom home\n\n\nwork\nin office?",
  "never have\nto defecate\n\n\nnever have\nto shower?",
  "loud\ntypers\n\n\nloud\nwhisperers?",
  "live as\na fish\n\n\nlive as\na bird?",
  "people who text\nback immediately\n\n\npeople who text\nafter a few hours?",
  "be good-looking\nbut dumb\n\n\nbe smart\nbut ugly?",
  "watch\nanime\n\n\nwatch\nK-drama?",
  "step on a\nsnail\n\n\nstep on a\ncockroach?",
    ];
  } else if (deckNum === 2) {
    deckTitle = "Your Thoughts On\n\n\n\n\n\n";
    questions = [
     "Pineapple\non pizza",
      "Mint\nchocolate\nice cream",
      "Licking vs\nbiting\nice cream",
      "Matcha",
      "Showering\nin the\nmorning",
      "Horoscope\nenthusiasts",
      "\Cats\nvs\ndogs",
      "The 3\nsecond rule\n(Food)",
      "Wearing the\nsame jeans\nfor a week",
      "Ghosting a\nfirst date",
      "Sock shoe,\nsock shoe\nvs\nsock sock,\nshoe shoe",
      "Crocks being\na fashion\nstatement",
      "Artificial\nintelligence",
      "Pop Mart",
      "Bubble tea with\nno pearls",
      "Leaving dishes\nin the sink\novernight",
      "Sharing your\nlocation with\nfriends",
      "Ranting on\nsocial media",
      "Personality quiz\nenthusiasts",
      "Not clearing\nyour browser\ntabs",
      "Brushing\nteeth in the\nshower",
      "Crypto Bros",
      "The best way\nto cook an egg",
      "Letting your\nparents follow you\non social media",
      "Couples sleeping\nin seperate\nbedrooms",
      "Socks with\nslippers",
      "Travelators are\nmade for walking\nnot standing",
      "Setting more\nthan 10 alarms",
      "Whats the point\nof gym selfies",
    ];
  } else if (deckNum === 3) {
    deckTitle = "Hypothetically\n\n\n\n\n\n";
    questions = [
      "List 3 items you\nwould bring with\nyou on a deserted\nisland.",
      "If you were a\nghost,who would\nyou haunt and\nwhat would you do\nto annoy them?",
      "What type of\nbread would\nyou be?",
      "If you could tame\nany animal in the\nworld, what would\nit be?",
      "If you could swap\nbodies,who would\nyou swap with?",
      "If you had to\neat one cuisine\nfor the rest of\nyour life, what\n would it be?",
      "What's your\nrole in a\nbank heist?",
      "What's your\nrole in a\nbank heist?",
      "What's one\nhousehold chore\nyou would master\n100 percent?",
      "What would\nyou teach as\na lecturer?",
      "What vegetable\nwould you make\ndisappear from\nexistence?",
      "If you can only\nuse one Telegram\nsticker for the\nrest of your\nlife, what would\nit be?",
      "Name one famous\ntrend you would\nerase from\nexistence.",
    ];
  }

  // Deck background triangles
  bgTriangles = [];
  let centerBuffer = min(width, height) * 0.35;
  for (let i = 0; i < 30; i++) {
    let x, y;
    do {
      x = random(width);
      y = random(height);
    } while (dist(x, y, width / 2, height / 2) < centerBuffer);

    bgTriangles.push({
      x, y,
      size: random(40, 100),
      speed: random(0.002, 0.005),
      baseRotation: random(TWO_PI),
      alphaOffset: random(TWO_PI),
      driftX: random(-0.3, 0.3),
      driftY: random(-0.3, 0.3),
      aspectX: random(0.6, 1.4),
      aspectY: random(0.6, 1.4)
    });
  }

  availableQuestions = [...questions];
}

function drawQuestion(title, textContent) {
  textAlign(CENTER, CENTER);

  // Title
  textFont(myFont);
  textSize(52); // adjust title size
  fill(0);
  text(title, width / 2, height / 2 );

  // Main question text
  textFont(subFont);
  textSize(45); // adjust question size
  fill(0);
  textLeading(47);
  text(textContent, width / 2, height / 2 + 50);
}

// ===============================
// NON-REPEATING QUESTIONS
// ===============================
function getNewQuestion() {
  if (availableQuestions.length === 0) availableQuestions = [...questions];
  let index = floor(random(availableQuestions.length));
  let q = availableQuestions[index];
  availableQuestions.splice(index, 1);
  return q;
}

// ===============================
// DRAW DECK
// ===============================
function drawDeck() {
  drawBackButton();

  // Deck background
  noStroke();
  let deckColor;
  if (currentDeck === 1) deckColor = color(255, 196, 12);
  else if (currentDeck === 2) deckColor = color(8, 125, 190);
  else if (currentDeck === 3) deckColor = color(4, 116, 60);

  for (let t of bgTriangles) {
    push();
    translate(t.x, t.y);
    rotate(t.baseRotation + homeAngle * t.speed * 2);

    let alpha = map(sin(angle + t.alphaOffset), -1, 1, 60, 150);
    let c = color(red(deckColor), green(deckColor), blue(deckColor), alpha);
    fill(c);

    drawScaledTriangle(t.size, t.aspectX, t.aspectY);
    pop();

    t.x += t.driftX * 0.5;
    t.y += t.driftY * 0.5;
    if (t.x < -t.size) t.x = width + t.size;
    if (t.x > width + t.size) t.x = -t.size;
    if (t.y < -t.size) t.y = height + t.size;
    if (t.y > height + t.size) t.y = -t.size;
  }

  angle += 0.02;

  // Card logic
  imageMode(CENTER);
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

  if (playingFlip) {
    push();
    translate(cardX, cardY);
    let scaleFactor = flipProgress < 1
      ? map(flipProgress, 0, 1, 1, 0)
      : map(flipProgress, 1, 2, 0, 1);

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

  if (showingBack) {
  image(cardBackCurrent, cardX, cardY, cardW, cardH);
  drawQuestion(deckTitle, currentQuestion);
}
 else {
    image(cardFrontCurrent, cardX, cardY, cardW, cardH);
  }

  fill(100);
  textSize(35);
  textFont(subFont);
  textAlign(CENTER, BOTTOM);
  text("Tap on the deck for a new question!", width / 2, height - 350);
}

// ===============================
// INPUT HANDLING
// ===============================
function mousePressed() {
  if (currentDeck === 0) return;
  if (mouseX > 20 && mouseX < 270 && mouseY > 20 && mouseY < 90) {
    currentDeck = 0;
    return;
  }
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
// BACK BUTTON
// ===============================
function drawBackButton() {
  rectMode(CORNER);
  stroke(0);
  fill(255);
  rect(20, 20, 250, 70, 15);
  noStroke();
  fill(0);
  textSize(40);
  textAlign(CENTER, CENTER);
  text("Back", 145, 53);
}

// ===============================
// TRIANGLE HELPERS
// ===============================
function drawScaledTriangle(size, scaleX = 1, scaleY = 1) {
  let r = size / 2;
  beginShape();
  for (let i = 0; i < 3; i++) {
    let a = TWO_PI / 3 * i - HALF_PI;
    vertex(cos(a) * r * scaleX, sin(a) * r * scaleY);
  }
  endShape(CLOSE);
}
