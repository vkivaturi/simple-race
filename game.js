// Get the canvas context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Import pause handler
import { pauseHandler } from './pauseHandler.js';

// Get UI elements
const startBtn = document.getElementById('startBtn');
const cancelBtn = document.getElementById('cancelBtn');
const timerDisplay = document.getElementById('timer');

// Set canvas to fullscreen
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initial resize
resizeCanvas();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Game constants
const TRACK_PADDING = 100; // Padding from window edges
const TRACK_WIDTH = 80;
const CAR_SIZE = 40;

// Track dimensions
const TRACK_LEFT = TRACK_PADDING;
const TRACK_RIGHT = canvas.width - TRACK_PADDING;
const TRACK_TOP = TRACK_PADDING;
const TRACK_BOTTOM = canvas.height - TRACK_PADDING;

// Game state
let gameState = {
    isRunning: false,
    startTime: 0,
    currentTime: 0,
    hasCompletedLap: false
};

// Car properties
let carPosition = 0; // 0 to 1 represents position along track
let carSpeed = 0.0005;

// Colors
const TRACK_COLOR = '#34495e';
const TRACK_BORDER_COLOR = '#2c3e50';
const CAR_COLOR = '#e74c3c';
const GRASS_COLOR = '#27ae60';

// Game controls
startBtn.addEventListener('click', startGame);
cancelBtn.addEventListener('click', cancelGame);

function startGame() {
    gameState.isRunning = true;
    gameState.startTime = Date.now();
    gameState.hasCompletedLap = false;
    carPosition = 0;
    startBtn.disabled = true;
}

function cancelGame() {
    gameState.isRunning = false;
    gameState.startTime = 0;
    gameState.currentTime = 0;
    gameState.hasCompletedLap = false;
    carPosition = 0;
    startBtn.disabled = false;
    timerDisplay.textContent = 'Time: 0.00s';
}

function drawTrack() {
    // Draw grass (background)
    ctx.fillStyle = GRASS_COLOR;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw outer track
    ctx.beginPath();
    ctx.moveTo(TRACK_LEFT - TRACK_WIDTH/2, TRACK_TOP);
    ctx.lineTo(TRACK_RIGHT + TRACK_WIDTH/2, TRACK_TOP);
    ctx.lineTo(TRACK_RIGHT + TRACK_WIDTH/2, TRACK_BOTTOM);
    ctx.lineTo(TRACK_LEFT - TRACK_WIDTH/2, TRACK_BOTTOM);
    ctx.closePath();
    ctx.fillStyle = TRACK_COLOR;
    ctx.fill();

    // Draw inner track (cut out)
    ctx.beginPath();
    ctx.moveTo(TRACK_LEFT + TRACK_WIDTH/2, TRACK_TOP + TRACK_WIDTH);
    ctx.lineTo(TRACK_RIGHT - TRACK_WIDTH/2, TRACK_TOP + TRACK_WIDTH);
    ctx.lineTo(TRACK_RIGHT - TRACK_WIDTH/2, TRACK_BOTTOM - TRACK_WIDTH);
    ctx.lineTo(TRACK_LEFT + TRACK_WIDTH/2, TRACK_BOTTOM - TRACK_WIDTH);
    ctx.closePath();
    ctx.fillStyle = GRASS_COLOR;
    ctx.fill();
}

function getCarCoordinates(position) {
    const trackPerimeter = 2 * (TRACK_RIGHT - TRACK_LEFT + TRACK_BOTTOM - TRACK_TOP);
    const pos = position * trackPerimeter;
    
    const topLength = TRACK_RIGHT - TRACK_LEFT;
    const sideLength = TRACK_BOTTOM - TRACK_TOP;
    
    // Calculate the center line of the track
    const centerTrackLeft = TRACK_LEFT + TRACK_WIDTH/2;
    const centerTrackRight = TRACK_RIGHT - TRACK_WIDTH/2;
    const centerTrackTop = TRACK_TOP + TRACK_WIDTH/2;
    const centerTrackBottom = TRACK_BOTTOM - TRACK_WIDTH/2;
    
    let x, y, angle;
    
    if (pos < topLength) { // Top edge
        x = centerTrackLeft + (pos * (centerTrackRight - centerTrackLeft) / topLength);
        y = centerTrackTop;
        angle = 0;
    } else if (pos < topLength + sideLength) { // Right edge
        x = centerTrackRight;
        y = centerTrackTop + ((pos - topLength) * (centerTrackBottom - centerTrackTop) / sideLength);
        angle = Math.PI / 2;
    } else if (pos < 2 * topLength + sideLength) { // Bottom edge
        x = centerTrackRight - ((pos - (topLength + sideLength)) * (centerTrackRight - centerTrackLeft) / topLength);
        y = centerTrackBottom;
        angle = Math.PI;
    } else { // Left edge
        x = centerTrackLeft;
        y = centerTrackBottom - ((pos - (2 * topLength + sideLength)) * (centerTrackBottom - centerTrackTop) / sideLength);
        angle = -Math.PI / 2;
    }
    
    return { x, y, angle };
}

function drawCar() {
    const { x, y, angle } = getCarCoordinates(carPosition);
    
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    
    // Car body
    ctx.fillStyle = CAR_COLOR;
    // Adjust rectangle dimensions based on car's orientation
    if (Math.abs(angle) === Math.PI / 2) {
        // When moving vertically (on sides), swap width and height
        ctx.fillRect(-CAR_SIZE/2, -CAR_SIZE/2, CAR_SIZE/2, CAR_SIZE);
    } else {
        // When moving horizontally (top/bottom)
        ctx.fillRect(-CAR_SIZE/2, -CAR_SIZE/4, CAR_SIZE, CAR_SIZE/2);
    }
    
    // Add brake light when paused
    if (pauseHandler.isPausedState()) {
        ctx.fillStyle = '#ffffff';
        if (Math.abs(angle) === Math.PI / 2) {
            // Vertical brake light
            ctx.fillRect(-CAR_SIZE/6, CAR_SIZE/3, CAR_SIZE/3, CAR_SIZE/3);
        } else {
            // Horizontal brake light
            ctx.fillRect(-CAR_SIZE/3, CAR_SIZE/8, CAR_SIZE/1.5, CAR_SIZE/6);
        }
    }
    
    ctx.restore();
}

function updateCar() {
    if (gameState.isRunning && !pauseHandler.isPausedState() && !gameState.hasCompletedLap) {
        carPosition += carSpeed;
        if (carPosition >= 1) {
            carPosition = 1;
            gameState.hasCompletedLap = true;
            gameState.isRunning = false;
            startBtn.disabled = false;
        }
    }
}

function updateTimer() {
    if (gameState.isRunning && !gameState.hasCompletedLap) {
        gameState.currentTime = (Date.now() - gameState.startTime) / 1000;
        timerDisplay.textContent = `Time: ${gameState.currentTime.toFixed(2)}s`;
    }
}

function gameLoop() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawTrack();
    drawCar();
    
    // Update game state
    updateCar();
    updateTimer();
    
    // Continue animation
    requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop(); 