// Game initialization and UI management
async function initGame() {
    try {
        // Get canvas element
        const canvas = document.getElementById('gameCanvas');
        
        // Initialize 3D game
        window.game = new Snake3D(canvas);
        await window.game.init();
        
        // Setup store functionality
        setupStore();
        
        // Start game
        updateUI();
    } catch (error) {
        console.error('Failed to initialize game:', error);
        const overlay = document.getElementById('overlay');
        const message = document.createElement('div');
        message.textContent = 'Failed to load game. Please refresh the page.';
        message.classList.add('text-red-500', 'text-xl', 'font-bold');
        overlay.querySelector('.text-center').prepend(message);
        overlay.classList.remove('hidden');
    }
}

// Store functionality
function setupStore() {
    const speedBoostBtn = document.getElementById('speedBoostBtn');
    const doublePointsBtn = document.getElementById('doublePointsBtn');
    
    if (!speedBoostBtn || !doublePointsBtn) {
        console.error('Store buttons not found');
        return;
    }
    
    function updateStoreButtons() {
        if (!window.game) return;
        speedBoostBtn.disabled = window.game.gems < SPEED_BOOST_COST || window.game.speedBoostActive;
        doublePointsBtn.disabled = window.game.gems < DOUBLE_POINTS_COST || window.game.pointMultiplier > 1;
    }
    
    speedBoostBtn.addEventListener('click', () => {
        if (!window.game) return;
        if (window.game.gems >= SPEED_BOOST_COST && !window.game.speedBoostActive) {
            window.game.gems -= SPEED_BOOST_COST;
            window.game.speedBoostActive = true;
            window.game.speed = Math.max(0.05, window.game.speed - 0.03);
            updateStoreButtons();
        }
    });
    
    doublePointsBtn.addEventListener('click', () => {
        if (!window.game) return;
        if (window.game.gems >= DOUBLE_POINTS_COST && window.game.pointMultiplier === 1) {
            window.game.gems -= DOUBLE_POINTS_COST;
            window.game.pointMultiplier = 2;
            updateStoreButtons();
        }
    });
}

// Update UI elements
function updateUI() {
    if (!window.game) return;
    
    const scoreElement = document.getElementById('score');
    const levelElement = document.getElementById('level');
    const gemsElement = document.getElementById('gems');
    
    if (scoreElement) scoreElement.textContent = window.game.score;
    if (levelElement) levelElement.textContent = window.game.level;
    if (gemsElement) gemsElement.textContent = window.game.gems;
}

// Event listeners
function setupEventListeners() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    // Game controls
    document.addEventListener('keydown', (e) => {
        if (window.game) {
            window.game.handleInput(e.key.toLowerCase());
        }
    });

    // Restart button
    const restartBtn = document.getElementById('restartBtn');
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            if (window.game) {
                window.game.reset();
                const overlay = document.getElementById('overlay');
                if (overlay) {
                    overlay.classList.add('hidden');
                }
            }
        });
    }
}

// Constants
const SPEED_BOOST_COST = 100;
const DOUBLE_POINTS_COST = 200;
const DIRECTION_CHANGE_DELAY = 50;

// Initialize game when all scripts are loaded
async function initializeGame() {
    try {
        if (typeof Snake3D === 'undefined') {
            throw new Error('Snake3D not loaded. Please check script loading order.');
        }
        
        // Get canvas element
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('Game canvas not found');
        }
        
        // Initialize 3D game
        window.game = new Snake3D(canvas);
        await window.game.init();
        
        // Setup game functionality
        setupStore();
        setupEventListeners();
        
        // Start game
        updateUI();
    } catch (error) {
        console.error('Failed to initialize game:', error);
        const overlay = document.getElementById('overlay');
        if (overlay) {
            const message = document.createElement('div');
            message.textContent = 'Failed to load game. Please refresh the page.';
            message.classList.add('text-red-500', 'text-xl', 'font-bold');
            const center = overlay.querySelector('.text-center');
            if (center) {
                center.prepend(message);
                overlay.classList.remove('hidden');
            }
        }
    }
}

// Try to initialize multiple times in case scripts are still loading
let attempts = 0;
const maxAttempts = 5;
const attemptInterval = 200;

function tryInitialize() {
    if (attempts >= maxAttempts) {
        console.error('Failed to initialize game after multiple attempts');
        return;
    }
    
    if (typeof Snake3D === 'undefined') {
        attempts++;
        setTimeout(tryInitialize, attemptInterval);
    } else {
        initializeGame();
    }
}

// Initialize when DOM is loaded
function initializeOnLoad() {
    try {
        const startBtn = document.getElementById('startBtn');
        const canvas = document.getElementById('gameCanvas');
        
        if (startBtn && canvas) {
            canvas.classList.add('hidden');
            startBtn.classList.remove('hidden');
            
            startBtn.addEventListener('click', () => {
                startBtn.classList.add('hidden');
                canvas.classList.remove('hidden');
                tryInitialize();
            });
        } else {
            console.error('Required game elements not found');
        }
    } catch (error) {
        console.error('Failed to initialize game:', error);
        const overlay = document.getElementById('overlay');
        if (overlay) {
            const message = document.createElement('div');
            message.textContent = 'Failed to load game. Please refresh the page.';
            message.classList.add('text-red-500', 'text-xl', 'font-bold');
            const center = overlay.querySelector('.text-center');
            if (center) {
                center.prepend(message);
                overlay.classList.remove('hidden');
            }
        }
    }
}

// Add event listener with error handling
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOnLoad);
} else {
    initializeOnLoad();
}
