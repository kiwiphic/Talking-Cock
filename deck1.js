// ===============================
// Card Shuffle + Flip Game (p5.js)
// ===============================

// Image variables
let cardFront, cardBack;
let shuffleFrames = [];

// State variables
let showingBack = false; // true = currently showing back
let playingShuffle = false;
let playingFlip = false;
let flipToFront = false; // flag for flipping back to front before shuffle
let currentFrame = 0;
let flipProgress = 0;

// Card properties
let cardX, cardY, cardW, cardH;

// Font
let mainFont, subFont;

// ===============================
// Question list + tracking
// ===============================
let questions = [
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

let availableQuestions = [...questions];
let currentQuestion = "";

// Function to get a new random question without repeats
function getNewQuestion() {
  if (availableQuestions.length === 0) {
    availableQuestions = [...questions]; // Reset when all are used
  }

  let index = floor(random(availableQuestions.length));
  let q = availableQuestions[index];
  availableQuestions.splice(index, 1);
  return q;
}

// ===============================
// Preload assets
// ===============================
function preload() {
  cardFront = loadImage("Assets/Cards/Card1_Front.png");
  cardBack = loadImage("Assets/Cards/Card1_Back.png");
  mainFont = loadFont("Assets/Fonts/Filson_Soft_Bold.otf");
  subFont = loadFont("Assets/Fonts/Quicksand_Book.otf");

  // Load shuffle PNG sequence
  for (let i = 0; i <= 54; i++) {
    let filename = `Assets/Shuffle1/Shuffle_${nf(i, 5)}.png`;
    shuffleFrames.push(loadImage(filename));
  }
}

// ===============================
// Setup
// ===============================
function setup() {
  createCanvas(windowWidth, windowHeight);
  cardW = height / 2;
  cardH = height / 2;
  cardX = width / 2;
  cardY = height / 2;
}

// ===============================
// Draw loop
// ===============================
function draw() {
  background(240);
  imageMode(CENTER);

  // Instruction text at bottom
  fill(100);
  textSize(50);
  textAlign(CENTER, BOTTOM);
  textFont(subFont);
  text("Tap on the deck for a new question!", width / 2, height - 40);

  if (playingShuffle) {
    // Show shuffle animation (PNG sequence)
    image(shuffleFrames[currentFrame], cardX, cardY, height, height*5/8);
    // Adjust speed of animation (lower = faster)
    if (frameCount % 2 === 0) currentFrame++;

    if (currentFrame >= shuffleFrames.length) {
      // End shuffle → go into flip to back
      playingShuffle = false;
      currentFrame = 0;
      playingFlip = true;
      flipProgress = 0;
      flipToFront = false; // next flip is always to back
    }

  } else if (playingFlip) {
    // Flip animation
    push();
    translate(cardX, cardY);

    let scaleFactor;
    if (flipProgress < 1) {
      // Shrinking phase
      scaleFactor = map(flipProgress, 0, 1, 1, 0);
      if (flipToFront) {
        image(cardBack, 0, 0, cardW * scaleFactor, cardH);
      } else {
        image(cardFront, 0, 0, cardW * scaleFactor, cardH);
      }
    } else {
      // Expanding phase
      scaleFactor = map(flipProgress, 1, 2, 0, 1);
      if (flipToFront) {
        image(cardFront, 0, 0, cardW * scaleFactor, cardH);
      } else {
        image(cardBack, 0, 0, cardW * scaleFactor, cardH);
      }
    }
    pop();

    flipProgress += 0.1;

    if (flipProgress >= 2) {
      playingFlip = false;

      if (flipToFront) {
        // Now front is showing → trigger shuffle next
        showingBack = false;
        playingShuffle = true;
        currentFrame = 0;
      } else {
        // Now back is showing → show a new random question
        showingBack = true;
        currentQuestion = getNewQuestion();
      }
    }

  } else {
    // Normal card state
    if (showingBack) {
      image(cardBack, cardX, cardY, cardW, cardH);
      fill(0);
      textAlign(CENTER, CENTER);
      textFont(mainFont);
      textSize(50);
      textLeading(49);
      text(currentQuestion, width / 2, height / 2);
    } else {
      image(cardFront, cardX, cardY, cardW, cardH);
    }
  }
}

// ===============================
// Input
// ===============================
function touchStarted() {
  if (!playingShuffle && !playingFlip && insideHitbox(mouseX, mouseY)) {
    if (showingBack) {
      // If currently showing back → flip back to front first
      playingFlip = true;
      flipProgress = 0;
      flipToFront = true;
    } else {
      // If currently front → go straight to shuffle
      playingShuffle = true;
      currentFrame = 0;
    }
  }
  return false;
}

// ===============================
// Helper: check if click in card area
// ===============================
function insideHitbox(x, y) {
  return (
    x > cardX - cardW / 2 &&
    x < cardX + cardW / 2 &&
    y > cardY - cardH / 2 &&
    y < cardY + cardH / 2
  );
}
