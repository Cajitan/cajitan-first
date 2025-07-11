// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Create game instance
    const game = new Game();
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Keep canvas centered
        const container = document.getElementById('gameContainer');
        const canvas = document.getElementById('gameCanvas');
        
        // Adjust canvas size for mobile if needed
        if (window.innerWidth < 768) {
            const scale = Math.min(window.innerWidth / 1000, window.innerHeight / 600);
            canvas.style.transform = `scale(${scale})`;
        } else {
            canvas.style.transform = 'scale(1)';
        }
    });
    
    // Handle visibility change (pause when tab is not active)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            game.isRunning = false;
        } else if (game.gameStarted) {
            game.isRunning = true;
            game.gameLoop();
        }
    });
    
    // Prevent context menu on canvas
    document.getElementById('gameCanvas').addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
    
    // Handle touch events for mobile
    let touchStartX = 0;
    let touchStartY = 0;
    
    document.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    });
    
    document.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scrolling
    }, { passive: false });
    
    document.addEventListener('touchend', (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        
        const deltaX = touchEndX - touchStartX;
        const deltaY = touchEndY - touchStartY;
        
        // Convert swipe to key press
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
            if (Math.abs(deltaX) > 30) {
                if (deltaX > 0) {
                    game.keys['ArrowRight'] = true;
                    setTimeout(() => game.keys['ArrowRight'] = false, 100);
                } else {
                    game.keys['ArrowLeft'] = true;
                    setTimeout(() => game.keys['ArrowLeft'] = false, 100);
                }
            }
        } else {
            if (Math.abs(deltaY) > 30) {
                if (deltaY > 0) {
                    game.keys['ArrowDown'] = true;
                    setTimeout(() => game.keys['ArrowDown'] = false, 100);
                } else {
                    game.keys['ArrowUp'] = true;
                    setTimeout(() => game.keys['ArrowUp'] = false, 100);
                }
            }
        }
    });
    
    // Add some helpful console messages
    console.log('🌧️ Monsoon Melody: A Village Rain Journey');
    console.log('Use arrow keys or WASD to move around');
    console.log('Click on highlighted objects to interact');
    console.log('Collect memories as you explore the village');
    
    // Trigger initial resize
    window.dispatchEvent(new Event('resize'));
});