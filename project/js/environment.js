class Environment {
    constructor(game) {
        this.game = game;
        this.raindrops = [];
        this.puddles = [];
        this.trees = [];
        this.houses = [];
        this.clouds = [];
        this.backgroundElements = [];
        this.weatherIntensity = 0.7;
        this.timeOfDay = 0.6; // 0 = dawn, 0.5 = noon, 1 = night
        
        // Wind and movement system
        this.wind = {
            baseSpeed: 0.3,
            currentSpeed: 0.3,
            direction: 0.2, // -1 to 1 (left to right)
            gustIntensity: 0,
            gustTimer: 0,
            turbulence: 0
        };
        
        // Grass movement system
        this.grassBlades = [];
        this.initializeGrass();
        
        this.initializeEnvironment();
        this.initializeRain();
        this.initializeBackground();
    }
    
    initializeGrass() {
        // Create individual grass blades with physics properties
        for (let i = 0; i < 200; i++) {
            this.grassBlades.push({
                x: Math.random() * this.game.width,
                y: this.game.height - 120 + Math.random() * 100,
                height: 8 + Math.random() * 12,
                width: 1 + Math.random() * 2,
                flexibility: 0.3 + Math.random() * 0.4, // How much it bends
                restAngle: (Math.random() - 0.5) * 0.2, // Natural lean
                currentAngle: 0,
                velocity: 0,
                mass: 0.5 + Math.random() * 0.5,
                dampening: 0.85 + Math.random() * 0.1,
                color: `hsl(${100 + Math.random() * 40}, ${60 + Math.random() * 30}%, ${30 + Math.random() * 20}%)`
            });
        }
    }
    
    initializeBackground() {
        // Create layered background elements for depth
        this.backgroundElements = [
            // Distant hills
            { type: 'hill', x: 0, y: 150, width: this.game.width, height: 200, layer: 0 },
            { type: 'hill', x: 200, y: 180, width: 600, height: 150, layer: 1 },
            
            // Rice fields
            { type: 'ricefield', x: 0, y: 400, width: this.game.width, height: 100, layer: 2 },
            
            // Distant trees
            { type: 'treeline', x: 0, y: 200, width: this.game.width, height: 180, layer: 1 }
        ];
    }
    
    initializeEnvironment() {
        // Create more detailed trees with realistic positioning
        this.trees = [
            { 
                x: 120, y: 280, type: 'banana', width: 80, height: 140, age: 'mature', fruits: 8,
                flexibility: 0.8, // Banana leaves are very flexible
                leaves: this.generateBananaLeaves(8),
                trunkSway: { angle: 0, velocity: 0, naturalFreq: 0.5 }
            },
            { 
                x: 280, y: 240, type: 'mango', width: 100, height: 160, age: 'old', fruits: 12,
                flexibility: 0.4, // Mango trees are sturdy
                branches: this.generateMangoBranches(6),
                trunkSway: { angle: 0, velocity: 0, naturalFreq: 0.3 }
            },
            { 
                x: 580, y: 270, type: 'coconut', width: 60, height: 180, age: 'young', fruits: 6,
                flexibility: 0.9, // Coconut palms are very flexible
                fronds: this.generateCoconutFronds(12),
                trunkSway: { angle: 0, velocity: 0, naturalFreq: 0.7 }
            },
            { 
                x: 750, y: 300, type: 'banana', width: 75, height: 130, age: 'mature', fruits: 10,
                flexibility: 0.8,
                leaves: this.generateBananaLeaves(7),
                trunkSway: { angle: 0, velocity: 0, naturalFreq: 0.6 }
            },
            { 
                x: 450, y: 260, type: 'jackfruit', width: 90, height: 150, age: 'mature', fruits: 4,
                flexibility: 0.3, // Jackfruit trees are very sturdy
                branches: this.generateJackfruitBranches(5),
                trunkSway: { angle: 0, velocity: 0, naturalFreq: 0.2 }
            }
        ];
    }
    
    generateBananaLeaves(count) {
        const leaves = [];
        for (let i = 0; i < count; i++) {
            leaves.push({
                angle: (i / count) * Math.PI * 2,
                length: 40 + Math.random() * 20,
                width: 15 + Math.random() * 8,
                currentAngle: 0,
                velocity: 0,
                flexibility: 0.8 + Math.random() * 0.4,
                segments: 3 + Math.floor(Math.random() * 3) // Leaf segments for realistic bending
            });
        }
        return leaves;
    }
    
    generateMangoBranches(count) {
        const branches = [];
        for (let i = 0; i < count; i++) {
            branches.push({
                angle: (i / count) * Math.PI * 2,
                length: 20 + Math.random() * 15,
                thickness: 3 + Math.random() * 3,
                currentAngle: 0,
                velocity: 0,
                flexibility: 0.3 + Math.random() * 0.2,
                foliage: {
                    density: 0.7 + Math.random() * 0.3,
                    sway: 0
                }
            });
        }
        return branches;
    }
    
    generateCoconutFronds(count) {
        const fronds = [];
        for (let i = 0; i < count; i++) {
            fronds.push({
                angle: (i / count) * Math.PI * 2,
                length: 35 + Math.random() * 25,
                currentAngle: 0,
                velocity: 0,
                flexibility: 0.9 + Math.random() * 0.3,
                segments: 4 + Math.floor(Math.random() * 3),
                leaflets: 8 + Math.floor(Math.random() * 6) // Individual leaflets on frond
            });
        }
        return fronds;
    }
    
    generateJackfruitBranches(count) {
        const branches = [];
        for (let i = 0; i < count; i++) {
            branches.push({
                angle: (i / count) * Math.PI + Math.PI,
                length: 15 + Math.random() * 10,
                thickness: 4 + Math.random() * 2,
                currentAngle: 0,
                velocity: 0,
                flexibility: 0.2 + Math.random() * 0.1,
                foliage: {
                    density: 0.8 + Math.random() * 0.2,
                    sway: 0
                }
            });
        }
        return branches;
        
        // Create more realistic houses with details
        this.houses = [
            { 
                x: 350, y: 340, width: 140, height: 90, type: 'clay',
                details: { windows: 2, door: true, roof: 'tin', chimney: true, garden: true }
            },
            { 
                x: 650, y: 370, width: 120, height: 80, type: 'bamboo',
                details: { windows: 1, door: true, roof: 'straw', porch: true, garden: false }
            },
            {
                x: 150, y: 380, width: 100, height: 70, type: 'tin',
                details: { windows: 1, door: true, roof: 'corrugated', garden: true }
            }
        ];
        
        // Create natural-looking puddles
        this.puddles = [
            { x: 180, y: 470, width: 120, height: 40, depth: 0.3, ripples: [], muddy: true },
            { x: 480, y: 510, width: 90, height: 35, depth: 0.2, ripples: [], muddy: false },
            { x: 720, y: 490, width: 110, height: 45, depth: 0.4, ripples: [], muddy: true },
            { x: 300, y: 520, width: 70, height: 25, depth: 0.1, ripples: [], muddy: false }
        ];
        
        // Create realistic cloud formations
        this.clouds = [
            { x: 80, y: 40, width: 180, height: 60, density: 0.8, speed: 8, type: 'cumulus' },
            { x: 320, y: 20, width: 220, height: 80, density: 0.9, speed: 6, type: 'nimbus' },
            { x: 580, y: 60, width: 160, height: 50, density: 0.7, speed: 10, type: 'cumulus' },
            { x: 800, y: 30, width: 200, height: 70, density: 0.85, speed: 7, type: 'nimbus' }
        ];
    }
    
    initializeRain() {
        // Create more realistic rain with varying intensities
        const rainCount = Math.floor(150 * this.weatherIntensity);
        for (let i = 0; i < rainCount; i++) {
            this.raindrops.push({
                x: Math.random() * (this.game.width + 200) - 100,
                y: Math.random() * this.game.height,
                speed: 180 + Math.random() * 120,
                length: 6 + Math.random() * 8,
                opacity: 0.2 + Math.random() * 0.5,
                angle: -0.1 + Math.random() * 0.2,
                wind: Math.sin(Date.now() * 0.001) * 20
            });
        }
    }
    
    update(deltaTime) {
        const dt = deltaTime / 1000;
        
        // Update realistic wind system
        this.updateWindSystem(dt);
        
        // Update tree physics
        this.updateTreePhysics(dt);
        
        // Update grass physics
        this.updateGrassPhysics(dt);
        
        // Update weather intensity (dynamic weather)
        this.weatherIntensity += (Math.sin(Date.now() * 0.0005) * 0.1) * dt;
        this.weatherIntensity = Math.max(0.3, Math.min(1.0, this.weatherIntensity));
        
        // Update raindrops with wind effect
        this.raindrops.forEach(drop => {
            drop.wind = Math.sin(Date.now() * 0.002 + drop.x * 0.01) * 15;
            drop.x += (drop.wind * dt);
            drop.y += drop.speed * dt;
            
            // Reset raindrop when it goes off screen
            if (drop.y > this.game.height + 20) {
                drop.y = -drop.length - Math.random() * 100;
                drop.x = Math.random() * (this.game.width + 200) - 100;
                
                // Create splash effect in puddles
                this.checkPuddleCollision(drop);
            }
            
            // Wrap around horizontally
            if (drop.x > this.game.width + 100) drop.x = -100;
            if (drop.x < -100) drop.x = this.game.width + 100;
        });
        
        // Update puddle ripples with more realistic physics
        this.puddles.forEach(puddle => {
            puddle.ripples = puddle.ripples.filter(ripple => {
                ripple.radius += (40 + ripple.intensity * 20) * dt;
                ripple.opacity -= (0.6 + ripple.intensity * 0.4) * dt;
                return ripple.opacity > 0;
            });
            
            // Add random ripples based on rain intensity
            if (Math.random() < this.weatherIntensity * 0.03) {
                this.addRipple(puddle, 
                    puddle.x + Math.random() * puddle.width,
                    puddle.y + Math.random() * puddle.height,
                    0.3 + Math.random() * 0.4
                );
            }
        });
        
        // Update clouds with realistic movement
        this.clouds.forEach(cloud => {
            cloud.x += cloud.speed * dt;
            if (cloud.x > this.game.width + cloud.width) {
                cloud.x = -cloud.width;
            }
            
            // Subtle cloud shape changes
            cloud.density += Math.sin(Date.now() * 0.001 + cloud.x * 0.01) * 0.1 * dt;
            cloud.density = Math.max(0.5, Math.min(1.0, cloud.density));
        });
    }
    
    updateWindSystem(dt) {
        // Realistic wind patterns with gusts and turbulence
        const time = Date.now() * 0.001;
        
        // Base wind oscillation (like natural wind patterns)
        this.wind.baseSpeed = 0.2 + Math.sin(time * 0.3) * 0.15 + Math.sin(time * 0.7) * 0.1;
        
        // Wind direction changes slowly
        this.wind.direction = Math.sin(time * 0.1) * 0.8 + Math.sin(time * 0.23) * 0.3;
        
        // Gust system - random strong winds
        this.wind.gustTimer -= dt;
        if (this.wind.gustTimer <= 0) {
            if (Math.random() < 0.1) { // 10% chance of gust
                this.wind.gustIntensity = 0.5 + Math.random() * 1.0;
                this.wind.gustTimer = 0.8 + Math.random() * 1.2; // Gust duration
            } else {
                this.wind.gustTimer = 2 + Math.random() * 5; // Time until next possible gust
            }
        }
        
        // Apply gust decay
        this.wind.gustIntensity *= 0.95;
        
        // Turbulence for micro-movements
        this.wind.turbulence = (Math.sin(time * 8) + Math.sin(time * 13) + Math.sin(time * 21)) * 0.1;
        
        // Final wind speed calculation
        this.wind.currentSpeed = this.wind.baseSpeed + this.wind.gustIntensity + 
                                 (this.weatherIntensity * 0.4); // Rain increases wind
    }
    
    updateTreePhysics(dt) {
        this.trees.forEach(tree => {
            // Calculate wind force on tree
            const windForce = this.wind.currentSpeed * this.wind.direction * tree.flexibility;
            const gustEffect = this.wind.gustIntensity * 0.3;
            const turbulence = this.wind.turbulence * 0.2;
            
            // Trunk sway physics (pendulum motion)
            const totalForce = windForce + gustEffect + turbulence;
            const restoring = -tree.trunkSway.angle * tree.trunkSway.naturalFreq;
            const damping = -tree.trunkSway.velocity * 0.1;
            
            tree.trunkSway.velocity += (totalForce + restoring + damping) * dt;
            tree.trunkSway.angle += tree.trunkSway.velocity * dt;
            
            // Limit trunk sway to realistic values
            tree.trunkSway.angle = Math.max(-0.3, Math.min(0.3, tree.trunkSway.angle));
            
            // Update individual tree parts based on type
            if (tree.leaves) {
                // Banana leaves - very responsive to wind
                tree.leaves.forEach(leaf => {
                    const leafWindForce = windForce * leaf.flexibility * 1.5;
                    const leafRestoring = -leaf.currentAngle * 0.8;
                    const leafDamping = -leaf.velocity * 0.15;
                    
                    leaf.velocity += (leafWindForce + leafRestoring + leafDamping) * dt;
                    leaf.currentAngle += leaf.velocity * dt;
                    leaf.currentAngle = Math.max(-1.2, Math.min(1.2, leaf.currentAngle));
                });
            }
            
            if (tree.branches) {
                // Mango/Jackfruit branches - moderate response
                tree.branches.forEach(branch => {
                    const branchWindForce = windForce * branch.flexibility;
                    const branchRestoring = -branch.currentAngle * 0.5;
                    const branchDamping = -branch.velocity * 0.2;
                    
                    branch.velocity += (branchWindForce + branchRestoring + branchDamping) * dt;
                    branch.currentAngle += branch.velocity * dt;
                    branch.currentAngle = Math.max(-0.8, Math.min(0.8, branch.currentAngle));
                    
                    // Foliage sway
                    branch.foliage.sway = Math.sin(Date.now() * 0.003 + branch.angle) * 
                                         this.wind.currentSpeed * 0.3;
                });
            }
            
            if (tree.fronds) {
                // Coconut fronds - very flexible, segmented movement
                tree.fronds.forEach(frond => {
                    const frondWindForce = windForce * frond.flexibility * 1.3;
                    const frondRestoring = -frond.currentAngle * 0.6;
                    const frondDamping = -frond.velocity * 0.12;
                    
                    frond.velocity += (frondWindForce + frondRestoring + frondDamping) * dt;
                    frond.currentAngle += frond.velocity * dt;
                    frond.currentAngle = Math.max(-1.5, Math.min(1.5, frond.currentAngle));
                });
            }
        });
    }
    
    updateGrassPhysics(dt) {
        this.grassBlades.forEach(blade => {
            // Wind force on grass blade
            const windForce = this.wind.currentSpeed * this.wind.direction * blade.flexibility;
            const gustEffect = this.wind.gustIntensity * 0.2;
            const turbulence = this.wind.turbulence * 0.1;
            
            // Physics calculation for grass blade bending
            const totalForce = windForce + gustEffect + turbulence;
            const restoring = -(blade.currentAngle - blade.restAngle) * 2.0; // Spring back to rest
            const damping = -blade.velocity * blade.dampening;
            
            // Apply forces
            const acceleration = (totalForce + restoring + damping) / blade.mass;
            blade.velocity += acceleration * dt;
            blade.currentAngle += blade.velocity * dt;
            
            // Realistic limits for grass bending
            blade.currentAngle = Math.max(-1.0, Math.min(1.0, blade.currentAngle));
        });
    }
    
    checkPuddleCollision(drop) {
        this.puddles.forEach(puddle => {
            if (drop.x >= puddle.x && drop.x <= puddle.x + puddle.width &&
                drop.y >= puddle.y && drop.y <= puddle.y + puddle.height) {
                this.addRipple(puddle, drop.x, puddle.y + puddle.height / 2, 0.5);
            }
        });
    }
    
    addRipple(puddle, x, y, intensity = 0.4) {
        puddle.ripples.push({
            x: x,
            y: y,
            radius: 0,
            opacity: 0.7,
            intensity: intensity
        });
    }
    
    render(ctx) {
        // Render layered background
        this.renderBackground(ctx);
        
        // Render environment elements in proper depth order
        this.renderClouds(ctx);
        this.renderTrees(ctx);
        this.renderHouses(ctx);
        this.renderRealisticGrass(ctx);
        this.renderPuddles(ctx);
        this.renderRain(ctx);
        this.renderAtmosphericEffects(ctx);
    }
    
    renderRealisticGrass(ctx) {
        // Render grass with realistic bending physics
        this.grassBlades.forEach(blade => {
            ctx.strokeStyle = blade.color;
            ctx.lineWidth = blade.width;
            ctx.lineCap = 'round';
            
            // Calculate curved grass blade using quadratic curve
            const bendAmount = blade.currentAngle * blade.height * 0.5;
            const midX = blade.x + bendAmount * 0.5;
            const midY = blade.y - blade.height * 0.5;
            const tipX = blade.x + bendAmount;
            const tipY = blade.y - blade.height;
            
            ctx.beginPath();
            ctx.moveTo(blade.x, blade.y);
            ctx.quadraticCurveTo(midX, midY, tipX, tipY);
            ctx.stroke();
            
            // Add subtle grass tip highlight
            if (blade.height > 12) {
                ctx.strokeStyle = `hsl(${100 + Math.random() * 40}, 70%, 50%)`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(tipX - 1, tipY);
                ctx.lineTo(tipX + 1, tipY - 2);
                ctx.stroke();
            }
        });
    }
    
    renderBackground(ctx) {
        // Sky gradient based on weather and time
        const skyGradient = ctx.createLinearGradient(0, 0, 0, this.game.height);
        
        if (this.weatherIntensity > 0.7) {
            // Stormy sky
            skyGradient.addColorStop(0, '#4A5568');
            skyGradient.addColorStop(0.3, '#718096');
            skyGradient.addColorStop(0.7, '#A0AEC0');
            skyGradient.addColorStop(1, '#E2E8F0');
        } else {
            // Lighter monsoon sky
            skyGradient.addColorStop(0, '#87CEEB');
            skyGradient.addColorStop(0.4, '#B0E0E6');
            skyGradient.addColorStop(0.8, '#F0F8FF');
            skyGradient.addColorStop(1, '#E6F3FF');
        }
        
        ctx.fillStyle = skyGradient;
        ctx.fillRect(0, 0, this.game.width, this.game.height);
        
        // Render background layers
        this.backgroundElements.forEach(element => {
            if (element.type === 'hill') {
                this.renderHills(ctx, element);
            } else if (element.type === 'ricefield') {
                this.renderRiceFields(ctx, element);
            } else if (element.type === 'treeline') {
                this.renderDistantTrees(ctx, element);
            }
        });
        
        // Ground with realistic texture
        this.renderGround(ctx);
    }
    
    renderHills(ctx, hill) {
        ctx.fillStyle = hill.layer === 0 ? 
            'rgba(76, 175, 80, 0.6)' : 'rgba(102, 187, 106, 0.8)';
        
        ctx.beginPath();
        ctx.moveTo(hill.x, hill.y + hill.height);
        
        // Create natural hill curves
        for (let x = 0; x <= hill.width; x += 20) {
            const y = hill.y + Math.sin(x * 0.02) * 30 + Math.sin(x * 0.05) * 15;
            ctx.lineTo(hill.x + x, y);
        }
        
        ctx.lineTo(hill.x + hill.width, hill.y + hill.height);
        ctx.closePath();
        ctx.fill();
    }
    
    renderRiceFields(ctx, field) {
        // Water-filled rice paddies
        ctx.fillStyle = 'rgba(76, 175, 80, 0.4)';
        ctx.fillRect(field.x, field.y, field.width, field.height);
        
        // Rice plant rows
        ctx.strokeStyle = 'rgba(56, 142, 60, 0.8)';
        ctx.lineWidth = 2;
        
        for (let x = field.x; x < field.x + field.width; x += 30) {
            for (let y = field.y + 10; y < field.y + field.height - 10; y += 15) {
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x + Math.random() * 10 - 5, y - 8);
                ctx.stroke();
            }
        }
        
        // Water reflections
        ctx.fillStyle = 'rgba(135, 206, 235, 0.3)';
        for (let i = 0; i < 20; i++) {
            const x = field.x + Math.random() * field.width;
            const y = field.y + Math.random() * field.height;
            ctx.fillRect(x, y, 3, 1);
        }
    }
    
    renderDistantTrees(ctx, treeline) {
        ctx.fillStyle = 'rgba(76, 175, 80, 0.5)';
        
        for (let x = treeline.x; x < treeline.x + treeline.width; x += 40) {
            const height = 60 + Math.random() * 40;
            const y = treeline.y + treeline.height - height;
            
            // Tree silhouette
            ctx.beginPath();
            ctx.ellipse(x + 20, y + height * 0.3, 15, height * 0.4, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Trunk
            ctx.fillStyle = 'rgba(101, 67, 33, 0.6)';
            ctx.fillRect(x + 17, y + height * 0.6, 6, height * 0.4);
            ctx.fillStyle = 'rgba(76, 175, 80, 0.5)';
        }
    }
    
    renderGround(ctx) {
        // Base ground
        const groundGradient = ctx.createLinearGradient(0, this.game.height - 120, 0, this.game.height);
        groundGradient.addColorStop(0, '#8BC34A');
        groundGradient.addColorStop(0.3, '#689F38');
        groundGradient.addColorStop(0.7, '#558B2F');
        groundGradient.addColorStop(1, '#33691E');
        
        ctx.fillStyle = groundGradient;
        ctx.fillRect(0, this.game.height - 120, this.game.width, 120);
        
        // Grass texture
        // Grass is now rendered separately with physics in renderRealisticGrass()
        
        // Mud patches from rain
        ctx.fillStyle = 'rgba(101, 67, 33, 0.4)';
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * this.game.width;
            const y = this.game.height - 80 + Math.random() * 60;
            const size = 20 + Math.random() * 30;
            
            ctx.beginPath();
            ctx.ellipse(x, y, size, size * 0.6, 0, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    renderClouds(ctx) {
        this.clouds.forEach(cloud => {
            const alpha = cloud.density * 0.9;
            
            if (cloud.type === 'nimbus') {
                // Dark rain clouds
                ctx.fillStyle = `rgba(96, 125, 139, ${alpha})`;
            } else {
                // Lighter clouds
                ctx.fillStyle = `rgba(176, 190, 197, ${alpha})`;
            }
            
            // Render cloud as multiple overlapping circles for realism
            const circles = 6;
            for (let i = 0; i < circles; i++) {
                const offsetX = (i / circles) * cloud.width;
                const offsetY = Math.sin(i * 0.8) * cloud.height * 0.2;
                const radius = cloud.height * (0.3 + Math.random() * 0.3);
                
                ctx.beginPath();
                ctx.arc(cloud.x + offsetX, cloud.y + cloud.height/2 + offsetY, radius, 0, Math.PI * 2);
                ctx.fill();
            }
            
            // Cloud shadows on ground
            if (cloud.type === 'nimbus') {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
                ctx.beginPath();
                ctx.ellipse(cloud.x + cloud.width/2, this.game.height - 60, 
                           cloud.width * 0.8, 20, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        });
    }
    
    renderTrees(ctx) {
        // Sort trees by y position for proper depth
        const sortedTrees = [...this.trees].sort((a, b) => a.y - b.y);
        
        sortedTrees.forEach(tree => {
            if (tree.type === 'banana') {
                this.renderBananaTree(ctx, tree);
            } else if (tree.type === 'mango') {
                this.renderMangoTree(ctx, tree);
            } else if (tree.type === 'coconut') {
                this.renderCoconutTree(ctx, tree);
            } else if (tree.type === 'jackfruit') {
                this.renderJackfruitTree(ctx, tree);
            }
            
            // Tree shadows
            this.renderTreeShadow(ctx, tree);
        });
    }
    
    renderBananaTree(ctx, tree) {
        const centerX = tree.x + tree.width/2;
        const baseY = tree.y + tree.height;
        
        // Apply trunk sway
        ctx.save();
        ctx.translate(centerX, baseY);
        ctx.rotate(tree.trunkSway.angle);
        ctx.translate(-centerX, -baseY);
        
        // Trunk with realistic texture
        const trunkGradient = ctx.createLinearGradient(centerX - 12, baseY - 60, centerX + 12, baseY - 60);
        trunkGradient.addColorStop(0, '#8D6E63');
        trunkGradient.addColorStop(0.5, '#A1887F');
        trunkGradient.addColorStop(1, '#6D4C41');
        
        ctx.fillStyle = trunkGradient;
        ctx.fillRect(centerX - 12, baseY - 60, 24, 60);
        
        // Trunk texture lines
        ctx.strokeStyle = 'rgba(93, 64, 55, 0.6)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 10; i++) {
            ctx.beginPath();
            ctx.moveTo(centerX - 10, baseY - 55 + i * 6);
            ctx.lineTo(centerX + 10, baseY - 55 + i * 6);
            ctx.stroke();
        }
        
        // Realistic banana leaves with physics-based movement
        const leafColors = ['#4CAF50', '#66BB6A', '#43A047'];
        tree.leaves.forEach((leaf, i) => {
            const totalAngle = leaf.angle + leaf.currentAngle;
            
            ctx.save();
            ctx.translate(centerX, tree.y + 30);
            ctx.rotate(totalAngle);
            
            // Leaf gradient
            const leafGradient = ctx.createLinearGradient(0, -leaf.width/2, 0, leaf.width/2);
            leafGradient.addColorStop(0, leafColors[i % 3]);
            leafGradient.addColorStop(0.5, '#81C784');
            leafGradient.addColorStop(1, leafColors[i % 3]);
            
            ctx.fillStyle = leafGradient;
            
            // Segmented leaf for realistic bending
            const segmentLength = leaf.length / leaf.segments;
            for (let s = 0; s < leaf.segments; s++) {
                const segmentBend = Math.sin(s * 0.5) * leaf.currentAngle * 0.3;
                
                ctx.save();
                ctx.translate(s * segmentLength, 0);
                ctx.rotate(segmentBend);
                
                ctx.beginPath();
                ctx.ellipse(segmentLength/2, 0, segmentLength/2, leaf.width/2, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
            
            // Leaf vein
            ctx.strokeStyle = 'rgba(56, 142, 60, 0.8)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(leaf.length, 0);
            ctx.stroke();
            
            ctx.restore();
        });
        
        // Banana bunches
        if (tree.fruits > 0) {
            ctx.fillStyle = '#FFC107';
            for (let i = 0; i < Math.min(tree.fruits, 3); i++) {
                const bunchX = centerX + (i - 1) * 15;
                const bunchY = tree.y + 40 + i * 8;
                
                for (let j = 0; j < 6; j++) {
                    ctx.beginPath();
                    ctx.ellipse(bunchX + j * 3, bunchY + j * 4, 4, 8, Math.PI * 0.1, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
        
        ctx.restore();
    }
    
    renderMangoTree(ctx, tree) {
        const centerX = tree.x + tree.width/2;
        const baseY = tree.y + tree.height;
        
        // Apply trunk sway
        ctx.save();
        ctx.translate(centerX, baseY);
        ctx.rotate(tree.trunkSway.angle);
        ctx.translate(-centerX, -baseY);
        
        // Thick trunk with branches
        const trunkGradient = ctx.createLinearGradient(centerX - 18, baseY - 80, centerX + 18, baseY - 80);
        trunkGradient.addColorStop(0, '#5D4037');
        trunkGradient.addColorStop(0.5, '#8D6E63');
        trunkGradient.addColorStop(1, '#3E2723');
        
        ctx.fillStyle = trunkGradient;
        ctx.fillRect(centerX - 18, baseY - 80, 36, 80);
        
        // Realistic branches with physics
        ctx.strokeStyle = '#6D4C41';
        tree.branches.forEach(branch => {
            const branchAngle = branch.angle + branch.currentAngle;
            ctx.lineWidth = branch.thickness;
            
            ctx.beginPath();
            ctx.moveTo(centerX, baseY - 70);
            ctx.lineTo(
                centerX + Math.cos(branchAngle) * branch.length,
                baseY - 70 + Math.sin(branchAngle) * branch.length
            );
            ctx.stroke();
        });
        
        // Dense foliage crown
        const crownRadius = 55;
        const crownGradient = ctx.createRadialGradient(centerX, tree.y + 50, 0, centerX, tree.y + 50, crownRadius);
        crownGradient.addColorStop(0, '#4CAF50');
        crownGradient.addColorStop(0.7, '#388E3C');
        crownGradient.addColorStop(1, '#2E7D32');
        
        ctx.fillStyle = crownGradient;
        
        // Multiple overlapping circles for natural crown shape
        tree.branches.forEach((branch, i) => {
            const swayOffset = branch.foliage.sway;
            const offsetX = Math.cos(branch.angle) * 20 + swayOffset;
            const offsetY = Math.sin(branch.angle) * 15;
            const radius = crownRadius * branch.foliage.density;
            
            ctx.beginPath();
            ctx.arc(centerX + offsetX, tree.y + 50 + offsetY, radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Mangoes scattered in crown
        if (tree.fruits > 0) {
            ctx.fillStyle = '#FF9800';
            for (let i = 0; i < tree.fruits; i++) {
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 40;
                const mangoX = centerX + Math.cos(angle) * distance;
                const mangoY = tree.y + 50 + Math.sin(angle) * distance;
                
                ctx.beginPath();
                ctx.ellipse(mangoX, mangoY, 5, 7, angle, 0, Math.PI * 2);
                ctx.fill();
                
                // Mango highlight
                ctx.fillStyle = '#FFB74D';
                ctx.beginPath();
                ctx.ellipse(mangoX - 1, mangoY - 2, 2, 3, angle, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = '#FF9800';
            }
        }
        
        ctx.restore();
    }
    
    renderCoconutTree(ctx, tree) {
        const centerX = tree.x + tree.width/2;
        const baseY = tree.y + tree.height;
        
        // Apply trunk sway (coconut palms sway more)
        ctx.save();
        ctx.translate(centerX, baseY);
        ctx.rotate(tree.trunkSway.angle);
        ctx.translate(-centerX, -baseY);
        
        // Curved trunk
        ctx.strokeStyle = '#8D6E63';
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(centerX, baseY);
        ctx.quadraticCurveTo(
            centerX + 25 + tree.trunkSway.angle * 30, 
            baseY - tree.height/2, 
            centerX + 10 + tree.trunkSway.angle * 20, 
            tree.y + 20
        );
        ctx.stroke();
        
        // Trunk segments
        ctx.strokeStyle = 'rgba(109, 76, 65, 0.8)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 12; i++) {
            const t = i / 12;
            const swayEffect = tree.trunkSway.angle * (20 + 10 * t);
            const x = centerX + (25 * t * (1 - t) * 4) + (10 * t) + swayEffect;
            const y = baseY - (tree.height - 20) * t;
            
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        // Realistic palm fronds with physics
        tree.fronds.forEach(frond => {
            const frondAngle = frond.angle + frond.currentAngle;
            
            ctx.save();
            ctx.translate(centerX + 10 + tree.trunkSway.angle * 15, tree.y + 20);
            ctx.rotate(frondAngle);
            
            // Frond stem
            ctx.strokeStyle = '#689F38';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(frond.length, 0);
            ctx.stroke();
            
            // Individual leaflets with segmented movement
            ctx.fillStyle = '#4CAF50';
            const leafletSpacing = frond.length / frond.leaflets;
            for (let j = 0; j < frond.leaflets; j++) {
                const leafletPos = j * leafletSpacing + 5;
                const segmentBend = Math.sin(j * 0.3) * frond.currentAngle * 0.2;
                
                ctx.save();
                ctx.translate(leafletPos, 0);
                ctx.rotate(segmentBend);
                
                // Leaflet shape
                ctx.beginPath();
                ctx.ellipse(0, 0, 3, 8, 0, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.restore();
            }
            
            ctx.restore();
        });
        
        // Coconuts
        if (tree.fruits > 0) {
            ctx.fillStyle = '#8D6E63';
            for (let i = 0; i < Math.min(tree.fruits, 6); i++) {
                const angle = (i / 6) * Math.PI * 2;
                const coconutX = centerX + 10 + Math.cos(angle) * 15 + tree.trunkSway.angle * 10;
                const coconutY = tree.y + 25 + Math.sin(angle) * 10;
                
                ctx.beginPath();
                ctx.ellipse(coconutX, coconutY, 6, 8, angle, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        ctx.restore();
    }
    
    renderJackfruitTree(ctx, tree) {
        const centerX = tree.x + tree.width/2;
        const baseY = tree.y + tree.height;
        
        // Apply minimal trunk sway (jackfruit trees are very sturdy)
        ctx.save();
        ctx.translate(centerX, baseY);
        ctx.rotate(tree.trunkSway.angle * 0.3); // Reduced sway
        ctx.translate(-centerX, -baseY);
        
        // Sturdy trunk
        ctx.fillStyle = '#6D4C41';
        ctx.fillRect(centerX - 20, baseY - 90, 40, 90);
        
        // Dense, broad crown with branch movement
        tree.branches.forEach(branch => {
            const branchSway = branch.foliage.sway;
            const offsetX = Math.cos(branch.angle) * 25 + branchSway;
            const offsetY = Math.sin(branch.angle) * 20;
            
            ctx.fillStyle = '#2E7D32';
            ctx.beginPath();
            ctx.arc(centerX + offsetX, tree.y + 60 + offsetY, 35 * branch.foliage.density, 0, Math.PI * 2);
            ctx.fill();
        });
        
        // Jackfruits hanging from trunk and branches
        if (tree.fruits > 0) {
            ctx.fillStyle = '#8BC34A';
            for (let i = 0; i < tree.fruits; i++) {
                const fruitX = centerX + (Math.random() - 0.5) * 60 + tree.trunkSway.angle * 5;
                const fruitY = tree.y + 80 + Math.random() * 40;
                
                // Large jackfruit
                ctx.beginPath();
                ctx.ellipse(fruitX, fruitY, 12, 18, 0, 0, Math.PI * 2);
                ctx.fill();
                
                // Jackfruit texture
                ctx.fillStyle = '#689F38';
                for (let j = 0; j < 20; j++) {
                    const dotX = fruitX + (Math.random() - 0.5) * 20;
                    const dotY = fruitY + (Math.random() - 0.5) * 30;
                    ctx.beginPath();
                    ctx.arc(dotX, dotY, 1, 0, Math.PI * 2);
                    ctx.fill();
                }
                ctx.fillStyle = '#8BC34A';
            }
        }
        
        ctx.restore();
    }
    
    renderTreeShadow(ctx, tree) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        ctx.beginPath();
        ctx.ellipse(
            tree.x + tree.width/2 + 10, 
            tree.y + tree.height + 5,
            tree.width * 0.6, 
            15, 
            0, 0, Math.PI * 2
        );
        ctx.fill();
    }
    
    renderHouses(ctx) {
        this.houses.forEach(house => {
            if (house.type === 'clay') {
                this.renderClayHouse(ctx, house);
            } else if (house.type === 'bamboo') {
                this.renderBambooHouse(ctx, house);
            } else if (house.type === 'tin') {
                this.renderTinHouse(ctx, house);
            }
            
            // House shadow
            ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.fillRect(house.x + 5, house.y + house.height, house.width, 8);
        });
    }
    
    renderClayHouse(ctx, house) {
        // Clay walls with texture
        const wallGradient = ctx.createLinearGradient(house.x, house.y, house.x + house.width, house.y);
        wallGradient.addColorStop(0, '#D7CCC8');
        wallGradient.addColorStop(0.5, '#BCAAA4');
        wallGradient.addColorStop(1, '#A1887F');
        
        ctx.fillStyle = wallGradient;
        ctx.fillRect(house.x, house.y, house.width, house.height);
        
        // Clay texture
        ctx.fillStyle = 'rgba(161, 136, 127, 0.3)';
        for (let i = 0; i < 50; i++) {
            const x = house.x + Math.random() * house.width;
            const y = house.y + Math.random() * house.height;
            ctx.fillRect(x, y, 2, 2);
        }
        
        // Tin roof with corrugation
        ctx.fillStyle = '#78909C';
        ctx.fillRect(house.x - 15, house.y - 25, house.width + 30, 25);
        
        // Roof corrugation lines
        ctx.strokeStyle = '#546E7A';
        ctx.lineWidth = 1;
        for (let i = house.x - 15; i < house.x + house.width + 15; i += 8) {
            ctx.beginPath();
            ctx.moveTo(i, house.y - 25);
            ctx.lineTo(i, house.y);
            ctx.stroke();
        }
        
        // Door
        ctx.fillStyle = '#5D4037';
        const doorWidth = 35;
        const doorHeight = 50;
        ctx.fillRect(house.x + house.width/2 - doorWidth/2, house.y + house.height - doorHeight, doorWidth, doorHeight);
        
        // Door details
        ctx.strokeStyle = '#3E2723';
        ctx.lineWidth = 2;
        ctx.strokeRect(house.x + house.width/2 - doorWidth/2, house.y + house.height - doorHeight, doorWidth, doorHeight);
        
        // Door handle
        ctx.fillStyle = '#FFD54F';
        ctx.beginPath();
        ctx.arc(house.x + house.width/2 + 12, house.y + house.height - doorHeight/2, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Windows
        if (house.details.windows > 0) {
            const windowWidth = 30;
            const windowHeight = 25;
            
            for (let i = 0; i < house.details.windows; i++) {
                const windowX = house.x + 20 + i * 60;
                const windowY = house.y + 25;
                
                // Window frame
                ctx.fillStyle = '#5D4037';
                ctx.fillRect(windowX, windowY, windowWidth, windowHeight);
                
                // Window glass
                ctx.fillStyle = '#81D4FA';
                ctx.fillRect(windowX + 3, windowY + 3, windowWidth - 6, windowHeight - 6);
                
                // Window cross
                ctx.strokeStyle = '#5D4037';
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.moveTo(windowX + windowWidth/2, windowY + 3);
                ctx.lineTo(windowX + windowWidth/2, windowY + windowHeight - 3);
                ctx.moveTo(windowX + 3, windowY + windowHeight/2);
                ctx.lineTo(windowX + windowWidth - 3, windowY + windowHeight/2);
                ctx.stroke();
            }
        }
        
        // Chimney
        if (house.details.chimney) {
            ctx.fillStyle = '#8D6E63';
            ctx.fillRect(house.x + house.width - 25, house.y - 45, 15, 25);
            
            // Smoke
            ctx.fillStyle = 'rgba(158, 158, 158, 0.6)';
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.arc(
                    house.x + house.width - 17 + Math.sin(Date.now() * 0.005 + i) * 5,
                    house.y - 50 - i * 8,
                    3 + i,
                    0, Math.PI * 2
                );
                ctx.fill();
            }
        }
        
        // Garden
        if (house.details.garden) {
            ctx.fillStyle = '#4CAF50';
            for (let i = 0; i < 15; i++) {
                const plantX = house.x - 10 + Math.random() * (house.width + 20);
                const plantY = house.y + house.height + Math.random() * 15;
                ctx.fillRect(plantX, plantY, 2, 8);
            }
        }
    }
    
    renderBambooHouse(ctx, house) {
        // Bamboo walls
        ctx.fillStyle = '#D4AF37';
        ctx.fillRect(house.x, house.y, house.width, house.height);
        
        // Bamboo vertical lines
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 3;
        for (let i = house.x; i < house.x + house.width; i += 12) {
            ctx.beginPath();
            ctx.moveTo(i, house.y);
            ctx.lineTo(i, house.y + house.height);
            ctx.stroke();
        }
        
        // Straw roof
        ctx.fillStyle = '#DAA520';
        ctx.fillRect(house.x - 10, house.y - 20, house.width + 20, 20);
        
        // Straw texture
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 1;
        for (let i = 0; i < 100; i++) {
            const x = house.x - 10 + Math.random() * (house.width + 20);
            const y = house.y - 20 + Math.random() * 20;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + Math.random() * 6 - 3, y + Math.random() * 4);
            ctx.stroke();
        }
        
        // Simple door and window
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(house.x + house.width/2 - 15, house.y + house.height - 40, 30, 40);
        
        if (house.details.windows > 0) {
            ctx.fillStyle = '#87CEEB';
            ctx.fillRect(house.x + 15, house.y + 20, 25, 20);
        }
        
        // Porch
        if (house.details.porch) {
            ctx.fillStyle = '#D2B48C';
            ctx.fillRect(house.x - 20, house.y + house.height - 10, house.width + 40, 10);
        }
    }
    
    renderTinHouse(ctx, house) {
        // Corrugated metal walls
        ctx.fillStyle = '#B0BEC5';
        ctx.fillRect(house.x, house.y, house.width, house.height);
        
        // Corrugation pattern
        ctx.strokeStyle = '#90A4AE';
        ctx.lineWidth = 1;
        for (let i = house.x; i < house.x + house.width; i += 6) {
            ctx.beginPath();
            ctx.moveTo(i, house.y);
            ctx.lineTo(i, house.y + house.height);
            ctx.stroke();
        }
        
        // Metal roof
        ctx.fillStyle = '#78909C';
        ctx.fillRect(house.x - 8, house.y - 15, house.width + 16, 15);
        
        // Simple door and window
        ctx.fillStyle = '#37474F';
        ctx.fillRect(house.x + house.width/2 - 12, house.y + house.height - 35, 24, 35);
        
        if (house.details.windows > 0) {
            ctx.fillStyle = '#81D4FA';
            ctx.fillRect(house.x + 10, house.y + 15, 20, 15);
        }
    }
    
    renderPuddles(ctx) {
        this.puddles.forEach(puddle => {
            // Puddle base with depth
            const puddleGradient = ctx.createRadialGradient(
                puddle.x + puddle.width/2, puddle.y + puddle.height/2, 0,
                puddle.x + puddle.width/2, puddle.y + puddle.height/2, puddle.width/2
            );
            
            if (puddle.muddy) {
                puddleGradient.addColorStop(0, 'rgba(101, 67, 33, 0.8)');
                puddleGradient.addColorStop(0.7, 'rgba(135, 206, 235, 0.6)');
                puddleGradient.addColorStop(1, 'rgba(76, 175, 80, 0.4)');
            } else {
                puddleGradient.addColorStop(0, 'rgba(135, 206, 235, 0.8)');
                puddleGradient.addColorStop(0.8, 'rgba(176, 224, 230, 0.6)');
                puddleGradient.addColorStop(1, 'rgba(135, 206, 235, 0.3)');
            }
            
            ctx.fillStyle = puddleGradient;
            ctx.beginPath();
            ctx.ellipse(puddle.x + puddle.width/2, puddle.y + puddle.height/2, 
                       puddle.width/2, puddle.height/2, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Water surface reflections
            ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.beginPath();
            ctx.ellipse(puddle.x + puddle.width/3, puddle.y + puddle.height/3, 
                       puddle.width/6, puddle.height/8, 0, 0, Math.PI * 2);
            ctx.fill();
            
            // Ripples with varying opacity
            puddle.ripples.forEach(ripple => {
                ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.8})`;
                ctx.lineWidth = 2;
                ctx.beginPath();
                ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
                ctx.stroke();
                
                // Secondary ripple
                if (ripple.radius > 10) {
                    ctx.strokeStyle = `rgba(255, 255, 255, ${ripple.opacity * 0.4})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.arc(ripple.x, ripple.y, ripple.radius + 5, 0, Math.PI * 2);
                    ctx.stroke();
                }
            });
        });
    }
    
    renderRain(ctx) {
        // Dynamic rain with wind effect
        ctx.save();
        
        this.raindrops.forEach(drop => {
            const alpha = drop.opacity * this.weatherIntensity;
            ctx.globalAlpha = alpha;
            
            // Rain color varies with intensity
            if (this.weatherIntensity > 0.8) {
                ctx.strokeStyle = 'rgba(200, 200, 255, 0.8)';
            } else {
                ctx.strokeStyle = 'rgba(220, 220, 255, 0.6)';
            }
            
            ctx.lineWidth = 1 + (this.weatherIntensity * 0.5);
            ctx.lineCap = 'round';
            
            ctx.beginPath();
            ctx.moveTo(drop.x, drop.y);
            ctx.lineTo(
                drop.x + drop.wind * 0.1 - Math.sin(drop.angle) * drop.length,
                drop.y - Math.cos(drop.angle) * drop.length
            );
            ctx.stroke();
        });
        
        ctx.restore();
    }
    
    renderAtmosphericEffects(ctx) {
        // Fog/mist effect during heavy rain
        if (this.weatherIntensity > 0.6) {
            ctx.fillStyle = `rgba(200, 200, 200, ${(this.weatherIntensity - 0.6) * 0.3})`;
            ctx.fillRect(0, 0, this.game.width, this.game.height);
        }
        
        // Lightning flash effect (rare)
        if (Math.random() < 0.001 && this.weatherIntensity > 0.8) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.fillRect(0, 0, this.game.width, this.game.height);
            
            // Thunder sound would be triggered here
            setTimeout(() => {
                // Flash duration
            }, 100);
        }
    }
}