class Player {
    constructor(game, x, y) {
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 48;
        this.speed = 120; // pixels per second
        
        // Animation
        this.facing = 'right';
        this.isWalking = false;
        this.animationTime = 0;
        this.walkCycle = 0;
        
        // Colors for simple character representation
        this.colors = {
            skin: '#D2B48C',
            shirt: '#FF6B6B',
            pants: '#4ECDC4',
            hair: '#8B4513'
        };
    }
    
    update(deltaTime, keys) {
        const dt = deltaTime / 1000; // Convert to seconds
        let moved = false;
        
        // Handle movement input
        if (keys['ArrowLeft'] || keys['KeyA']) {
            this.x -= this.speed * dt;
            this.facing = 'left';
            moved = true;
        }
        if (keys['ArrowRight'] || keys['KeyD']) {
            this.x += this.speed * dt;
            this.facing = 'right';
            moved = true;
        }
        if (keys['ArrowUp'] || keys['KeyW']) {
            this.y -= this.speed * dt;
            moved = true;
        }
        if (keys['ArrowDown'] || keys['KeyS']) {
            this.y += this.speed * dt;
            moved = true;
        }
        
        // Keep player within bounds
        this.x = Math.max(0, Math.min(this.game.width - this.width, this.x));
        this.y = Math.max(0, Math.min(this.game.height - this.height, this.y));
        
        // Update animation
        this.isWalking = moved;
        if (this.isWalking) {
            this.animationTime += deltaTime;
            this.walkCycle = Math.floor(this.animationTime / 300) % 4;
        } else {
            this.animationTime = 0;
            this.walkCycle = 0;
        }
    }
    
    render(ctx) {
        ctx.save();
        
        // Flip sprite if facing left
        if (this.facing === 'left') {
            ctx.scale(-1, 1);
            ctx.translate(-this.x - this.width, 0);
        } else {
            ctx.translate(this.x, 0);
        }
        
        // Draw simple character
        this.drawCharacter(ctx);
        
        ctx.restore();
    }
    
    drawCharacter(ctx) {
        const centerX = this.width / 2;
        const y = this.y;
        
        // Walking animation offset
        const bobOffset = this.isWalking ? Math.sin(this.animationTime / 150) * 2 : 0;
        
        // Head
        ctx.fillStyle = this.colors.skin;
        ctx.beginPath();
        ctx.arc(centerX, y + 12 + bobOffset, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Hair
        ctx.fillStyle = this.colors.hair;
        ctx.beginPath();
        ctx.arc(centerX, y + 8 + bobOffset, 9, Math.PI, Math.PI * 2);
        ctx.fill();
        
        // Body (shirt)
        ctx.fillStyle = this.colors.shirt;
        ctx.fillRect(centerX - 8, y + 20 + bobOffset, 16, 18);
        
        // Arms
        ctx.fillStyle = this.colors.skin;
        const armSwing = this.isWalking ? Math.sin(this.animationTime / 200) * 3 : 0;
        ctx.fillRect(centerX - 12, y + 22 + bobOffset + armSwing, 4, 12);
        ctx.fillRect(centerX + 8, y + 22 + bobOffset - armSwing, 4, 12);
        
        // Legs (pants)
        ctx.fillStyle = this.colors.pants;
        const legSwing = this.isWalking ? Math.sin(this.animationTime / 200) * 2 : 0;
        ctx.fillRect(centerX - 6, y + 38 + bobOffset + legSwing, 5, 10);
        ctx.fillRect(centerX + 1, y + 38 + bobOffset - legSwing, 5, 10);
        
        // Simple face
        ctx.fillStyle = '#000';
        ctx.beginPath();
        ctx.arc(centerX - 3, y + 10 + bobOffset, 1, 0, Math.PI * 2);
        ctx.arc(centerX + 3, y + 10 + bobOffset, 1, 0, Math.PI * 2);
        ctx.fill();
        
        // Smile
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, y + 12 + bobOffset, 3, 0, Math.PI);
        ctx.stroke();
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}