class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = 1200;
        this.height = 700;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        this.isRunning = false;
        this.lastTime = 0;
        this.deltaTime = 0;
        
        // Game state
        this.memories = 0;
        this.currentScene = 'village';
        this.gameStarted = false;
        this.gameStats = {
            totalInteractions: 0,
            uniqueMemories: 0,
            questsCompleted: 0,
            explorationProgress: 0
        };
        this.inventory = [];
        
        // Initialize game systems
        this.player = new Player(this, 150, 500);
        this.environment = new Environment(this);
        this.interactions = new InteractionSystem(this);
        this.audio = new AudioManager();
        
        // Input handling
        this.keys = {};
        this.mouse = { x: 0, y: 0, clicked: false };
        
        this.setupEventListeners();
        this.setupUI();
    }
    
    setupEventListeners() {
        // Keyboard input
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mouse input
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.clicked = true;
            
            // Check for interactions
            this.interactions.handleClick(this.mouse.x, this.mouse.y);
        });
        
        // Touch support for mobile
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const rect = this.canvas.getBoundingClientRect();
            const touch = e.touches[0];
            this.mouse.x = touch.clientX - rect.left;
            this.mouse.y = touch.clientY - rect.top;
            this.mouse.clicked = true;
            this.interactions.handleClick(this.mouse.x, this.mouse.y);
        });
    }
    
    setupUI() {
        const startBtn = document.getElementById('start-game');
        const interactBtn = document.getElementById('interact-btn');
        const skipBtn = document.getElementById('skip-btn');
        const storyCloseBtn = document.getElementById('story-close');
        
        startBtn.addEventListener('click', () => {
            this.startGame();
        });
        
        interactBtn.addEventListener('click', () => {
            this.interactions.executeCurrentInteraction();
        });
        
        skipBtn.addEventListener('click', () => {
            this.interactions.hidePrompt();
        });
        
        storyCloseBtn.addEventListener('click', () => {
            this.hideStoryPanel();
        });
    }
    
    startGame() {
        const startScreen = document.getElementById('start-screen');
        startScreen.classList.add('hidden');
        this.gameStarted = true;
        this.isRunning = true;
        this.audio.playAmbientMusic();
        this.gameLoop();
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        this.update(this.deltaTime);
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        if (!this.gameStarted) return;
        
        this.player.update(deltaTime, this.keys);
        this.environment.update(deltaTime);
        this.interactions.update(deltaTime);
        
        // Reset mouse click
        this.mouse.clicked = false;
    }
    
    render() {
        // Clear canvas with sky gradient
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#87CEEB');
        gradient.addColorStop(0.7, '#98D8E8');
        gradient.addColorStop(1, '#90EE90');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Render game elements
        this.environment.render(this.ctx);
        this.player.render(this.ctx);
        this.interactions.render(this.ctx);
    }
    
    addMemory() {
        this.memories++;
        this.gameStats.totalInteractions++;
        this.updateMemoryCounter();
        this.audio.playMemorySound();
        
        // Show memory collection effect
        this.showMemoryEffect();
    }
    
    showMemoryEffect() {
        const memoryCounter = document.getElementById('memory-counter');
        memoryCounter.style.transform = 'scale(1.2)';
        memoryCounter.style.transition = 'transform 0.3s ease';
        
        setTimeout(() => {
            memoryCounter.style.transform = 'scale(1)';
        }, 300);
    }
    
    updateMemoryCounter() {
        document.getElementById('memory-count').textContent = this.memories;
        
        // Update progress indicators
        this.updateProgressIndicators();
    }
    
    updateProgressIndicators() {
        // Calculate exploration progress
        const totalInteractables = this.interactions.interactables.length;
        const interactedCount = this.interactions.interactables.filter(item => item.interacted).length;
        this.gameStats.explorationProgress = Math.round((interactedCount / totalInteractables) * 100);
        
        // Update unique memories count
        this.gameStats.uniqueMemories = this.interactions.discoveredMemories.size;
    }
    
    showStoryPanel(title, text) {
        document.getElementById('story-title').textContent = title;
        document.getElementById('story-text').innerHTML = text.replace(/\n/g, '<br>');
        document.getElementById('story-panel').classList.remove('hidden');
    }
    
    hideStoryPanel() {
        document.getElementById('story-panel').classList.add('hidden');
    }
}