// Setup canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

// Colors
const WHITE = "#FFFFFF";
const BLACK = "#000000";

// Element images
const DISPLAY_SIZE = 100;  // Increased element size
const IMAGE_FOLDER = "images/"; // Change the path as needed

// Base elements and combinations
let discovered = ['Fire', 'Water', 'Earth', 'Air','Sun'];
let extraElements = ['Sun'];
let rawCombinations = {
    'Fire,Water': 'Steam',
    'Earth,Water': 'Mud',
    'Air,Water': 'Cloud',
    'Mud,Sun': 'Brick',
    'Steam,Air': 'Cloud',
    'Earth,Air': 'Dust',
    'Fire,Dust': 'Ash',
    'Ash,Water': 'Soap',
    'Fire,Earth': 'Lava',
    'Fire,Air': 'Smoke',
    'Fire,Sun': 'Plasma',
    'Fire,Brick': 'Pottery',
    'Fire,Cloud': 'Lightning',
    'Fire,Sand': 'Glass',
    'Water,Sun': 'Rainbow',
    'Water,Cloud': 'Rain',
    'Water,Lava': 'Stone',
    'Water,Lightning': 'Energy',
    'Water,Stone': 'Sand',
    'Earth,Sun': 'Plant',
    'Earth,Stone': 'Metal',
    'Earth,Lava': 'Volcano',
    'Air,Smoke': 'Pollution',
    'Air,Lightning': 'Storm',
    'Air,Sun': 'Wind',
    'Sun,Cloud': 'Weather',
    'Sun,Plant': 'Fruit',
    'Sun,Stone': 'Fossil',
    'Plant,Water': 'Algae',
    'Rain,Earth': 'Swamp',
    'Metal,Fire': 'Tool',
    'Plant,Tool': 'Wood',
    'Wood,Fire': 'Charcoal',
    'Metal,Energy': 'Electricity',
    'Pollution,Rain': 'Acid Rain',
    'Stone,Pressure': 'Gem',
    'Swamp,Time': 'Oil',
    'Plant,Time': 'Coal',
    'Sun,Rainbow': 'Light',
    'Water,Soap': 'Bubbles',
    'Electricity,Metal': 'Circuit',
    'Circuit,Energy': 'Computer',
    'Water,Electricity': 'Steam Engine',
    'Oil,Fire': 'Explosion',
    'Storm,Earth': 'Earthquake',
    'Fruit,Time': 'Alcohol',
    'Swamp,Life': 'Frog',
    'Ocean,Life': 'Fish',
    'Wind,Water': 'Wave',
    'Wave,Earth': 'Erosion',
    'Water,Erosion': 'Ocean',
    'Ocean,Sun': 'Salt',
    'Electricity,Gem': 'Light',
    'Light,Plant': 'Oxygen',
    'Oxygen,Fire': 'Life'
  };
  
  let combinations = {};
  for (let key in rawCombinations) {
    let parts = key.split(',').sort().join(',');
    combinations[parts] = rawCombinations[key];
  }
  
  // Same for special unlocks
  let rawSpecialUnlocks = {
    'Storm,Ocean': 'Time',
    'Lava,Ocean': 'Pressure'
  };
  
  let specialUnlocks = {};
  for (let key in rawSpecialUnlocks) {
    let parts = key.split(',').sort().join(',');
    specialUnlocks[parts] = rawSpecialUnlocks[key];
  }  

// Image loading function
let elementImages = {};
let allPossibleElements = [...new Set(discovered.concat(Object.values(combinations), extraElements))];

function loadImage(name) {
  let img = new Image();
  img.src = IMAGE_FOLDER + name + '.png';
  img.onload = function() {
    elementImages[name] = img;
    if (Object.keys(elementImages).length === allPossibleElements.length) {
      draw(); // Draw after all images are loaded
    }
  };
}

// Load all element images
allPossibleElements.forEach(loadImage);

// Element positions
let elementPositions = {};
let spacing = 130;  // Increased spacing for larger elements
let xStart = 50;
let yStart = 150;  // Adjusted to give more room for the header

function positionElement(el, index) {
    let x = xStart + (index % 5) * spacing;
    let y = yStart + Math.floor(index / 5) * spacing;
    elementPositions[el] = { x, y };
  
    // Resize canvas if we need more height
    let neededHeight = y + DISPLAY_SIZE + 50;
    if (neededHeight > canvas.height) {
      canvas.height = neededHeight;
    }
  }
  

// Position initial elements
discovered.forEach((el, index) => positionElement(el, index));

// Dragging functionality
let dragging = null;
let offsetX = 0, offsetY = 0;
let message = "";
let pendingAdditions = {};

// Drawing function
function draw() {
  ctx.fillStyle = WHITE;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw header
  ctx.fillStyle = BLACK;
  ctx.font = "24px Arial";
  //ctx.fillText("Element Combination Game", canvas.width / 2 - 140, 50);

  // Draw elements
  discovered.forEach((el, index) => {
    if (elementImages[el]) {
      ctx.drawImage(elementImages[el], elementPositions[el].x, elementPositions[el].y, DISPLAY_SIZE, DISPLAY_SIZE);
      ctx.fillStyle = BLACK;
      ctx.textAlign = "center";
      ctx.fillText(el, elementPositions[el].x + DISPLAY_SIZE / 2, elementPositions[el].y + DISPLAY_SIZE + 20);
    }
  });

  // Draw message
  if (message) {
    ctx.fillStyle = BLACK;
    ctx.font = "20px Arial";
    ctx.fillStyle = BLACK;
    ctx.textAlign = "left";
    ctx.fillText(message, 20, 30);  // Top left corner, above the game area
      }
}

// Event listeners for mouse interactions
canvas.addEventListener('mousedown', (event) => {
  let mouseX = event.offsetX;
  let mouseY = event.offsetY;

  for (let el in elementPositions) {
    let rect = elementPositions[el];
    if (mouseX >= rect.x && mouseX <= rect.x + DISPLAY_SIZE && mouseY >= rect.y && mouseY <= rect.y + DISPLAY_SIZE) {
      dragging = el;
      offsetX = mouseX - rect.x;
      offsetY = mouseY - rect.y;
      break;
    }
  }
});

canvas.addEventListener('mousemove', (event) => {
  if (dragging) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    elementPositions[dragging].x = mouseX - offsetX;
    elementPositions[dragging].y = mouseY - offsetY;
    draw();
  }
});

canvas.addEventListener('mouseup', (event) => {
  if (dragging) {
    let mouseX = event.offsetX;
    let mouseY = event.offsetY;
    for (let el in elementPositions) {
      if (el !== dragging) {
        let rect = elementPositions[el];
        if (mouseX >= rect.x && mouseX <= rect.x + DISPLAY_SIZE && mouseY >= rect.y && mouseY <= rect.y + DISPLAY_SIZE) {
          let combo = [dragging, el].sort().join(',');
          let result = combinations[combo] || specialUnlocks[combo];
          if (result) {
            message = `${dragging} + ${el} = ${result}!`;
            if (!discovered.includes(result)) {
              discovered.push(result);
              positionElement(result, discovered.length - 1);
              loadImage(result);  // Load image for the new element
            }
          } else {
            message = "Nothing happens...";
          }
          break;
        }
      }
    }

    // Reset the position of the dragged element (whether combo was successful or not)
    let originalPos = discovered.indexOf(dragging);
    positionElement(dragging, originalPos);

    dragging = null;
    draw();
  }
});

// Draw initial message
message = "Drag elements to combine!";
draw();
