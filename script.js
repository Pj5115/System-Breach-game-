
/* VARIABLES */
let gameState = 'menu'; // 'menu', 'playing', 'correct', 'finished'
let currentWord = '';
let scrambledWord = '';
let userGuess = '';
let score = 0;
let stage = 1;
let wordsCompleted = 0;
let wordsPerStage = 4;
let correctSound, wrongSound;
let particles = [];
let hackedSystems = [];
let wrongAttempts = 0; // Track wrong attempts for current word

// Themed word lists for 3 stages - mixed themes
let wordLists = {
  stage1: ['BOOK', 'DESK', 'MATH', 'TEST', 'GAME', 'TREE', 'BIRD', 'FISH', 'BALL', 'CAKE'],
  stage2: ['SCHOOL', 'PENCIL', 'TEACHER', 'STUDENT', 'SCIENCE', 'HISTORY', 'ENGLISH', 'LIBRARY', 'HOMEWORK', 'GRADES'],
  stage3: ['COMPUTER', 'INTERNET', 'KEYBOARD', 'MONITOR', 'WEBSITE', 'EMAIL', 'CAMERA', 'PHONE', 'TABLET', 'PRINTER']
};

// 4-5 letter fallback words for give up option (easier than main words but not too easy)
let fallbackWords = ['BIKE', 'CITY', 'FOOD', 'MILK', 'COIN', 'DOOR', 'FIRE', 'LEAF', 'MOON', 'RAIN', 'SAND', 'WOLF', 'BEAR', 'FISH', 'GOLD', 'WIND', 'SNOW', 'ROCK', 'BOAT', 'LAKE'];

let stageThemes = {
  1: 'School Basics',
  2: 'Education',
  3: 'Technology'
};

let systemTypes = {
  1: {color: [0, 255, 0], name: 'Basic Level', progress: '1/3'},
  2: {color: [0, 200, 255], name: 'School Level', progress: '2/3'},
  3: {color: [255, 50, 50], name: 'Final Level', progress: '3/3'}
};

let currentList = wordLists.stage1;
let currentWordIndex = 0;
let availableWords = [];

/* SETUP RUNS ONCE */
function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // Initialize first puzzle
  newStage();
}

// Handle window resizing
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/* DRAW LOOP REPEATS */
function draw() {
  // Dark hacking background with matrix effect
  drawHackingBackground();
  
  // Add floating particles (like code fragments)
  updateParticles();
  
  // Draw hacking system terminals
  drawHackingSystem();
  
  if (gameState === 'menu') {
    drawMenu();
  } else if (gameState === 'playing') {
    drawGame();
  } else if (gameState === 'correct') {
    drawCorrectScreen();
  } else if (gameState === 'finished') {
    drawFinishedScreen();
  }
}

function drawHackingBackground() {
  // Create a dark hacking-inspired gradient background
  for (let i = 0; i <= height; i++) {
    let inter = map(i, 0, height, 0, 1);
    let c = lerpColor(color(5, 5, 15), color(0, 20, 30), inter); // Dark blue/black gradient
    stroke(c);
    line(0, i, width, i);
  }
  
  // Add matrix-style falling code effect
  fill(0, 255, 0, 30);
  textSize(12);
  for (let i = 0; i < 20; i++) {
    let x = (i * width / 20) + (frameCount * 0.5) % 20;
    for (let j = 0; j < height / 15; j++) {
      let y = j * 15 + (frameCount + i * 10) % (height + 50);
      text(String.fromCharCode(65 + floor(random(26))), x, y);
    }
  }
}

function drawHackingSystem() {
  // Draw terminal base
  fill(10, 10, 20);
  stroke(0, 255, 0);
  strokeWeight(2);
  rect(50, height - 150, width - 100, 120, 5);
  
  // Draw screen glow
  fill(0, 255, 0, 20);
  noStroke();
  rect(55, height - 145, width - 110, 110, 3);
  
  // Draw hacked systems as computer terminals
  for (let i = 0; i < hackedSystems.length; i++) {
    let system = hackedSystems[i];
    let x = 150 + i * 150;
    let y = height - 120;
    
    // Terminal screen
    fill(5, 5, 15);
    stroke(system.color[0], system.color[1], system.color[2]);
    strokeWeight(3);
    rect(x - 60, y - 40, 120, 80, 8);
    
    // Screen glow
    fill(system.color[0], system.color[1], system.color[2], 30);
    noStroke();
    rect(x - 55, y - 35, 110, 70, 5);
    
    // Status display
    fill(system.color[0], system.color[1], system.color[2]);
    textAlign(CENTER, CENTER);
    textSize(10);
    text('HACKED', x, y - 20);
    textSize(8);
    text(system.name, x, y - 8);
    text(system.progress, x, y + 5);
    
    // Blinking cursor effect
    if (frameCount % 60 < 30) {
      fill(system.color[0], system.color[1], system.color[2]);
      rect(x + 25, y + 15, 8, 2);
    }
    
    // Data stream lines
    stroke(system.color[0], system.color[1], system.color[2], 100);
    strokeWeight(1);
    for (let j = 0; j < 5; j++) {
      let lineY = y - 15 + j * 6;
      line(x - 45, lineY, x - 15 + random(-5, 5), lineY);
    }
  }
  
  // Draw main progress bar at bottom
  if (hackedSystems.length > 0) {
    let progressWidth = (hackedSystems.length / 3) * (width - 160);
    
    // Progress bar background
    fill(20, 20, 30);
    stroke(0, 255, 0);
    strokeWeight(2);
    rect(80, height - 40, width - 160, 20, 10);
    
    // Progress bar fill
    fill(0, 255, 0, 150);
    noStroke();
    rect(82, height - 38, progressWidth - 4, 16, 8);
    
    // Progress text
    fill(0, 255, 0);
    textAlign(CENTER, CENTER);
    textSize(12);
    text('SYSTEM BREACH: ' + hackedSystems.length + '/3', width/2, height - 30);
  }
}

function drawMenu() {
  // Title with hacking theme and glow effect
  let titleSize = min(width/10, 80);
  drawStyledText('SYSTEM BREACH', width/2, height/2 - height*0.15, titleSize, color(0, 255, 0), color(0, 100, 0), true);
  
  // Subtitle
  let subtitleSize = min(width/33, 24);
  drawStyledText('Decode encrypted words to hack the mainframe!', width/2, height/2 - height*0.06, subtitleSize, color(0, 200, 255), color(0, 50, 100), false);
  
  // Start button with hacker styling
  let buttonWidth = min(width*0.3, 250);
  let buttonHeight = min(height*0.12, 70);
  
  // Button glow effect
  fill(0, 255, 0, 30);
  noStroke();
  rect(width/2 - buttonWidth/2 - 2, height/2 + height*0.03 - 2, buttonWidth + 4, buttonHeight + 4, 22);
  
  // Main button
  fill(10, 10, 20);
  stroke(0, 255, 0);
  strokeWeight(3);
  rect(width/2 - buttonWidth/2, height/2 + height*0.03, buttonWidth, buttonHeight, 20);
  
  // Button scan line effect
  if (frameCount % 120 < 60) {
    fill(0, 255, 0, 50);
    noStroke();
    rect(width/2 - buttonWidth/2 + 5, height/2 + height*0.03 + 15, buttonWidth - 10, 3);
  }
  
  let buttonTextSize = min(width/25, 32);
  textAlign(CENTER, CENTER);
  drawStyledText('INITIATE HACK', width/2, height/2 + height*0.03 + buttonHeight/2, buttonTextSize, color(0, 255, 0), color(0, 100, 0), true);
  
  // Instructions
  let instructionSize = min(width/44, 18);
  drawStyledText('Click characters to decrypt system passwords!', width/2, height/2 + height*0.2, instructionSize, color(0, 200, 255), color(0, 50, 100), false);
}

function drawGame() {
  // Score and stage with hacking theme
  textAlign(LEFT, TOP);
  let uiTextSize = min(width/33, 24);
  let margin = min(width*0.025, 20);
  drawStyledText('Systems Breached: ' + hackedSystems.length, margin, margin, uiTextSize, color(0, 255, 0), color(0, 100, 0), true);
  drawStyledText('Layer ' + stage + ': ' + stageThemes[stage], margin, margin + uiTextSize + 5, uiTextSize, color(0, 255, 0), color(0, 100, 0), true);
  
  // Progress in current stage
  drawStyledText('Exploits: ' + wordsCompleted + '/' + wordsPerStage, margin, margin + (uiTextSize + 5) * 2, uiTextSize, color(0, 255, 0), color(0, 100, 0), true);
  
  // Current word prompt
  textAlign(CENTER, CENTER);
  let promptSize = min(width/25, 32);
  drawStyledText('DECRYPT PASSWORD:', width/2, height*0.2, promptSize, color(0, 200, 255), color(0, 50, 100), true);
  
  // Scrambled letters as hacker terminals
  let letterSpacing = min(width/(scrambledWord.length + 2), 80);
  let buttonSize = min(letterSpacing*0.75, 60);
  let startX = width/2 - (scrambledWord.length * letterSpacing) / 2 + letterSpacing/2;
  let lettersY = height*0.4;
  
  for (let i = 0; i < scrambledWord.length; i++) {
    let x = startX + i * letterSpacing;
    
    // Terminal button with glow
    fill(0, 255, 0, 30);
    noStroke();
    circle(x, lettersY, buttonSize + 6);
    
    fill(5, 5, 15);
    stroke(0, 255, 0);
    strokeWeight(2);
    circle(x, lettersY, buttonSize);
    
    // Blinking effect
    if ((frameCount + i * 10) % 120 < 60) {
      fill(0, 255, 0, 50);
      noStroke();
      circle(x, lettersY, buttonSize - 5);
    }
    
    // Letter
    let letterSize = min(buttonSize*0.6, 36);
    drawStyledText(scrambledWord[i], x, lettersY, letterSize, color(0, 255, 0), color(0, 100, 0), true);
  }
  
  // User's guess with terminal styling
  let guessSize = min(width/20, 40);
  drawStyledText('> ' + userGuess + '_', width/2, height*0.6, guessSize, color(0, 255, 0), color(0, 100, 0), true);
  
  // Clear button
  if (userGuess.length > 0) {
    let clearButtonWidth = min(width*0.15, 120);
    let clearButtonHeight = min(height*0.067, 40);
    fill(20, 20, 30);
    stroke(255, 50, 50);
    strokeWeight(2);
    rect(width/2 - clearButtonWidth/2, height*0.7, clearButtonWidth, clearButtonHeight, 5);
    
    let clearTextSize = min(width/40, 20);
    drawStyledText('RESET', width/2, height*0.7 + clearButtonHeight/2, clearTextSize, color(255, 50, 50), color(100, 0, 0), true);
  }
  
  // Give up button
  let giveUpButtonWidth = min(width*0.18, 140);
  let giveUpButtonHeight = min(height*0.067, 40);
  fill(20, 20, 30);
  stroke(255, 165, 0);
  strokeWeight(2);
  rect(width/2 - giveUpButtonWidth/2, height*0.78, giveUpButtonWidth, giveUpButtonHeight, 5);
  
  let giveUpTextSize = min(width/45, 18);
  drawStyledText('GIVE UP', width/2, height*0.78 + giveUpButtonHeight/2, giveUpTextSize, color(255, 165, 0), color(100, 80, 0), true);
  
  // Hint only appears after 2 wrong attempts
  if (wrongAttempts >= 2) {
    let hintSize = min(width/35, 22);
    drawStyledText('INTEL: ' + getHint(currentWord), width/2, height*0.86, hintSize, color(0, 200, 255), color(0, 50, 100), false);
  }
}



function updateParticles() {
  // Add floating particles (code fragments)
  if (random() < 0.02) {
    let codes = ['1', '0', '{', '}', '<', '>', '/', '\\'];
    particles.push({
      x: random(width),
      y: height + 10,
      size: random(8, 16),
      speed: random(0.5, 2),
      color: color(0, random(150, 255), random(100, 255), 150),
      char: random(codes)
    });
  }
  
  // Update and draw particles
  textAlign(CENTER, CENTER);
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.y -= p.speed;
    p.x += sin(frameCount * 0.01 + i) * 0.5; // Floating motion
    
    fill(p.color);
    textSize(p.size);
    text(p.char || '0', p.x, p.y);
    
    // Remove particles that are off screen
    if (p.y < -10) {
      particles.splice(i, 1);
    }
  }
}

function mousePressed() {
  if (gameState === 'menu') {
    // Check if start button clicked
    let buttonWidth = min(width*0.3, 250);
    let buttonHeight = min(height*0.12, 70);
    if (mouseX > width/2 - buttonWidth/2 && mouseX < width/2 + buttonWidth/2 && 
        mouseY > height/2 + height*0.03 && mouseY < height/2 + height*0.03 + buttonHeight) {
      gameState = 'playing';
    }
  } else if (gameState === 'playing') {
    // Check letter button clicks
    let letterSpacing = min(width/(scrambledWord.length + 2), 80);
    let buttonSize = min(letterSpacing*0.75, 60);
    let startX = width/2 - (scrambledWord.length * letterSpacing) / 2 + letterSpacing/2;
    let lettersY = height*0.4;
    
    for (let i = 0; i < scrambledWord.length; i++) {
      let x = startX + i * letterSpacing;
      
      if (dist(mouseX, mouseY, x, lettersY) < buttonSize/2) {
        userGuess += scrambledWord[i];
        checkAnswer();
        break;
      }
    }
    
    // Check clear button
    let clearButtonWidth = min(width*0.15, 120);
    let clearButtonHeight = min(height*0.067, 40);
    if (userGuess.length > 0 && mouseX > width/2 - clearButtonWidth/2 && mouseX < width/2 + clearButtonWidth/2 && 
        mouseY > height*0.7 && mouseY < height*0.7 + clearButtonHeight) {
      userGuess = '';
    }
    
    // Check give up button
    let giveUpButtonWidth = min(width*0.18, 140);
    let giveUpButtonHeight = min(height*0.067, 40);
    if (mouseX > width/2 - giveUpButtonWidth/2 && mouseX < width/2 + giveUpButtonWidth/2 && 
        mouseY > height*0.78 && mouseY < height*0.78 + giveUpButtonHeight) {
      // Give easier fallback word
      let randomIndex = floor(random(fallbackWords.length));
      currentWord = fallbackWords[randomIndex];
      scrambledWord = scrambleWord(currentWord);
      userGuess = '';
      wrongAttempts = 0; // Reset wrong attempts for fallback word
    }
  } else if (gameState === 'correct') {
    // Check next button
    let buttonWidth = min(width*0.2, 160);
    let buttonHeight = min(height*0.083, 50);
    if (mouseX > width/2 - buttonWidth/2 && mouseX < width/2 + buttonWidth/2 && 
        mouseY > height/2 + height*0.1 && mouseY < height/2 + height*0.1 + buttonHeight) {
      nextPuzzle();
    }
  } else if (gameState === 'finished') {
    // Check play again button
    let buttonWidth = min(width*0.25, 200);
    let buttonHeight = min(height*0.083, 50);
    if (mouseX > width/2 - buttonWidth/2 && mouseX < width/2 + buttonWidth/2 && 
        mouseY > height/2 + height*0.2 && mouseY < height/2 + height*0.2 + buttonHeight) {
      // Reset game
      stage = 1;
      wordsCompleted = 0;
      hackedSystems = [];
      score = 0;
      newStage();
      gameState = 'playing';
    }
  }
}

function newStage() {
  // Setup new stage
  currentList = wordLists['stage' + stage];
  availableWords = [...currentList]; // Copy array
  wordsCompleted = 0;
  newPuzzle();
}

function newPuzzle() {
  // If no words left in current list, get a new word or move to next stage
  if (availableWords.length === 0) {
    availableWords = [...currentList];
  }
  
  // Pick random word and remove it from available words
  let randomIndex = floor(random(availableWords.length));
  currentWord = availableWords[randomIndex];
  availableWords.splice(randomIndex, 1);
  
  scrambledWord = scrambleWord(currentWord);
  userGuess = '';
  wrongAttempts = 0; // Reset wrong attempts for new word
}

function nextPuzzle() {
  wordsCompleted++;
  
  if (wordsCompleted >= wordsPerStage) {
    // Stage complete, move to next stage
    stage++;
    if (stage > 3) {
      // Game complete!
      gameState = 'finished';
      return;
    } else {
      newStage();
    }
  } else {
    newPuzzle();
  }
  
  gameState = 'playing';
}

function scrambleWord(word) {
  let letters = word.split('');
  let scrambled = letters.slice(); // Copy the array
  let attempts = 0;
  
  // Keep scrambling until we get a different arrangement or max attempts
  do {
    // Fisher-Yates shuffle
    for (let i = scrambled.length - 1; i > 0; i--) {
      let j = floor(random(i + 1));
      [scrambled[i], scrambled[j]] = [scrambled[j], scrambled[i]];
    }
    attempts++;
  } while (scrambled.join('') === word && attempts < 50);
  
  // If we still have the same word after 50 attempts, manually scramble
  if (scrambled.join('') === word && word.length > 1) {
    // Simple manual scramble: move first letter to a different position
    let firstLetter = scrambled[0];
    scrambled[0] = scrambled[1];
    scrambled[1] = firstLetter;
  }
  
  return scrambled.join('');
}

function checkAnswer() {
  if (userGuess === currentWord) {
    score += currentWord.length * 10;
    
    // Hack a system!
    hackedSystems.push({
      color: systemTypes[stage].color,
      stage: stage,
      word: currentWord,
      name: systemTypes[stage].name,
      progress: systemTypes[stage].progress
    });
    
    gameState = 'correct';
    
    // Create celebration particles (code fragments)
    for (let i = 0; i < 15; i++) {
      particles.push({
        x: width/2 + random(-100, 100),
        y: height/2,
        size: random(5, 12),
        speed: random(2, 6),
        color: color(...systemTypes[stage].color, 180)
      });
    }
  } else if (userGuess.length === currentWord.length) {
    // Wrong answer, increment wrong attempts and scramble again
    wrongAttempts++;
    scrambledWord = scrambleWord(currentWord);
    userGuess = '';
  }
}

function drawStyledText(txt, x, y, size, fillColor, shadowColor, isBold) {
  // Draw text shadow first
  if (shadowColor) {
    fill(shadowColor);
    if (isBold) textStyle(BOLD);
    else textStyle(NORMAL);
    textSize(size);
    text(txt, x + 2, y + 2);
  }
  
  // Draw main text
  fill(fillColor);
  if (isBold) textStyle(BOLD);
  else textStyle(NORMAL);
  textSize(size);
  text(txt, x, y);
}

function drawCorrectScreen() {
  // Computer screen effect
  fill(5, 5, 15);
  stroke(0, 255, 0);
  strokeWeight(3);
  rect(width/4, height/4, width/2, height/2, 10);
  
  // Screen glow
  fill(0, 255, 0, 20);
  noStroke();
  rect(width/4 + 5, height/4 + 5, width/2 - 10, height/2 - 10, 5);
  
  // Success message
  textAlign(CENTER, CENTER);
  let celebrationSize = min(width/15, 50);
  drawStyledText('ACCESS GRANTED', width/2, height/2 - height*0.08, celebrationSize, color(0, 255, 0), color(0, 100, 0), true);
  
  let messageSize = min(width/25, 28);
  let currentSystem = systemTypes[stage];
  drawStyledText('HACKED: ' + currentSystem.name, width/2, height/2 - height*0.03, messageSize, color(0, 200, 255), color(0, 50, 100), true);
  drawStyledText('PASSWORD: ' + currentWord, width/2, height/2 + height*0.01, messageSize, color(255, 255, 100), color(100, 100, 0), false);
  drawStyledText('PROGRESS: ' + currentSystem.progress + ' SYSTEMS', width/2, height/2 + height*0.05, messageSize, color(255, 100, 255), color(100, 0, 100), false);
  
  // Scanning lines effect
  if (frameCount % 60 < 30) {
    stroke(0, 255, 0, 100);
    strokeWeight(1);
    for (let i = 0; i < 10; i++) {
      let lineY = height/4 + 20 + i * 30;
      line(width/4 + 10, lineY, width*3/4 - 10, lineY);
    }
  }
  
  // Next button
  let buttonWidth = min(width*0.2, 160);
  let buttonHeight = min(height*0.083, 50);
  fill(10, 10, 20);
  stroke(0, 255, 0);
  strokeWeight(2);
  rect(width/2 - buttonWidth/2, height/2 + height*0.12, buttonWidth, buttonHeight, 8);
  
  let buttonTextSize = min(width/33, 24);
  drawStyledText('NEXT LAYER', width/2, height/2 + height*0.12 + buttonHeight/2, buttonTextSize, color(0, 255, 0), color(0, 100, 0), true);
}

function drawFinishedScreen() {
  // Full screen computer terminal
  fill(0, 0, 0);
  rect(0, 0, width, height);
  
  // Matrix rain effect
  fill(0, 255, 0, 50);
  textSize(14);
  for (let i = 0; i < 30; i++) {
    let x = (i * width / 30);
    for (let j = 0; j < 30; j++) {
      let y = (j * 20) + (frameCount + i * 5) % height;
      text(String.fromCharCode(48 + floor(random(10))), x, y);
    }
  }
  
  // Main terminal window
  fill(5, 5, 15);
  stroke(255, 50, 50);
  strokeWeight(4);
  rect(width/8, height/6, width*3/4, height*2/3, 15);
  
  // Screen effects
  fill(255, 50, 50, 30);
  noStroke();
  rect(width/8 + 5, height/6 + 5, width*3/4 - 10, height*2/3 - 10, 10);
  
  // Victory message
  textAlign(CENTER, CENTER);
  let titleSize = min(width/12, 70);
  drawStyledText('SYSTEM COMPROMISED', width/2, height/2 - height*0.15, titleSize, color(255, 50, 50), color(150, 0, 0), true);
  
  let messageSize = min(width/20, 40);
  drawStyledText('MAINFRAME ACCESS: COMPLETE', width/2, height/2 - height*0.08, messageSize, color(255, 255, 50), color(150, 150, 0), true);
  
  let subMessageSize = min(width/25, 32);
  drawStyledText('ALL 3/3 SECURITY LAYERS BREACHED', width/2, height/2 - height*0.02, subMessageSize, color(0, 255, 255), color(0, 150, 150), false);
  
  // System status
  let statusSize = min(width/30, 24);
  let systems = ['Basic Security', 'Database Core', 'Main Server'];
  for (let i = 0; i < systems.length; i++) {
    let statusColor = color(255, 100 - i * 15, 100 - i * 15);
    drawStyledText('✓ ' + systems[i] + ' - COMPROMISED', width/2, height/2 + height*0.03 + i * 25, statusSize, statusColor, color(100, 0, 0), false);
  }
  
  // Blinking effect
  if (frameCount % 60 < 30) {
    fill(255, 0, 0, 100);
    noStroke();
    rect(width/8, height/6, width*3/4, height*2/3, 15);
  }
  
  // Play again button
  let buttonWidth = min(width*0.25, 200);
  let buttonHeight = min(height*0.083, 50);
  fill(10, 10, 20);
  stroke(0, 255, 0);
  strokeWeight(3);
  rect(width/2 - buttonWidth/2, height/2 + height*0.2, buttonWidth, buttonHeight, 10);
  
  let buttonTextSize = min(width/30, 28);
  drawStyledText('NEW TARGET', width/2, height/2 + height*0.2 + buttonHeight/2, buttonTextSize, color(0, 255, 0), color(0, 150, 0), true);
}

function getHint(word) {
  let hints = {
    // Stage 1: School Basics
    'BOOK': 'You read this to learn',
    'DESK': 'Where you sit to study',
    'MATH': 'Subject with numbers',
    'TEST': 'Assessment of your knowledge',
    'GAME': 'Fun activity to play',
    'TREE': 'Tall plant with leaves',
    'BIRD': 'Animal that flies',
    'FISH': 'Lives in water',
    'BALL': 'Round object for sports',
    'CAKE': 'Sweet dessert for birthdays',
    
    // Stage 2: Education
    'SCHOOL': 'Place where students learn',
    'PENCIL': 'Writing tool with graphite',
    'TEACHER': 'Person who educates students',
    'STUDENT': 'Person who learns at school',
    'SCIENCE': 'Study of the natural world',
    'HISTORY': 'Study of past events',
    'ENGLISH': 'Language and literature class',
    'LIBRARY': 'Place with many books',
    'HOMEWORK': 'Assignments done at home',
    'GRADES': 'Marks for your work',
    
    // Stage 3: Technology
    'COMPUTER': 'Electronic device for computing',
    'INTERNET': 'Global network of computers',
    'KEYBOARD': 'Input device with keys',
    'MONITOR': 'Display screen for computer',
    'WEBSITE': 'Pages on the internet',
    'EMAIL': 'Electronic mail messages',
    'CAMERA': 'Takes pictures and videos',
    'PHONE': 'Device for calling people',
    'TABLET': 'Portable touchscreen computer',
    'PRINTER': 'Prints documents on paper',
    
    // Stage 4: Nature
    'VACATION': 'Time off for relaxation',
    'MOUNTAIN': 'High landform with peaks',
    'OCEAN': 'Large body of salt water',
    'SUNSET': 'When the sun goes down',
    'FLOWER': 'Colorful part of a plant',
    'GARDEN': 'Place where plants grow',
    'RAINBOW': 'Arc of colors in the sky',
    'THUNDER': 'Loud sound during storms',
    'LIGHTNING': 'Electric flash in the sky',
    'FOREST': 'Large area with many trees',
    
    // Stage 5: Adventure
    'ADVENTURE': 'Exciting journey or experience',
    'JOURNEY': 'Long trip to somewhere',
    'TREASURE': 'Valuable hidden riches',
    'MYSTERY': 'Something unknown to solve',
    'CHALLENGE': 'Difficult task to overcome',
    'VICTORY': 'Winning or succeeding',
    'CHAMPION': 'Winner of a competition',
    'DIAMOND': 'Precious sparkling gem',
    'CRYSTAL': 'Clear mineral formation',
    'GALAXY': 'System of stars in space',
    
    // 4-5 letter fallback words
    'BIKE': 'Two-wheeled vehicle you pedal',
    'CITY': 'Large populated area',
    'FOOD': 'What you eat to survive',
    'MILK': 'White liquid from cows',
    'COIN': 'Round piece of money',
    'DOOR': 'Opens and closes for entry',
    'FIRE': 'Hot flames that burn',
    'LEAF': 'Green part of a tree',
    'MOON': 'Earth\'s natural satellite',
    'RAIN': 'Water falling from clouds',
    'SAND': 'Tiny particles at the beach',
    'WOLF': 'Wild dog that howls',
    'BEAR': 'Large furry forest animal',
    'FISH': 'Lives and swims in water',
    'GOLD': 'Precious yellow metal',
    'WIND': 'Moving air you can feel',
    'SNOW': 'Frozen water crystals',
    'ROCK': 'Hard stone from the ground',
    'BOAT': 'Floats on water',
    'LAKE': 'Large body of fresh water'
  };
  
  return hints[word] || 'mystery word to solve';
}
