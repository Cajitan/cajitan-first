class InteractionSystem {
    constructor(game) {
        this.game = game;
        this.interactables = [];
        this.currentInteraction = null;
        this.promptVisible = false;
        this.discoveredMemories = new Set();
        this.questProgress = {};
        this.villagerDialogues = [];
        
        this.initializeInteractables();
        this.initializeQuests();
    }
    
    initializeInteractables() {
        this.interactables = [
            // Water-based interactions
            {
                id: 'main_puddle',
                x: 180, y: 470, width: 120, height: 40,
                type: 'puddle',
                title: 'The Village Gathering Puddle',
                description: 'Children from the village often gather here during monsoon to float paper boats and splash in the cool water. You can see tiny fish swimming in the deeper parts, and the reflection of the cloudy sky creates a mirror to the heavens above.',
                memory: 'Childhood puddle adventures',
                interacted: false,
                difficulty: 'easy',
                rewards: { memories: 1, experience: 10 }
            },
            {
                id: 'muddy_puddle',
                x: 720, y: 490, width: 110, height: 45,
                type: 'puddle',
                title: 'The Muddy Rice Field Puddle',
                description: 'This muddy puddle formed where the rice field meets the village path. Local farmers often wash their tools here, and you can see small tadpoles beginning their transformation. The earthy smell reminds you of the fertile soil that feeds the village.',
                memory: 'Connection to the land',
                interacted: false,
                difficulty: 'medium',
                rewards: { memories: 2, experience: 15 }
            },
            
            // Tree interactions with seasonal elements
            {
                id: 'ancient_banana',
                x: 120, y: 280, width: 80, height: 140,
                type: 'tree',
                title: 'The Ancient Banana Grove',
                description: 'This magnificent banana tree has sheltered three generations of your family. During monsoon, its broad leaves create a natural umbrella where villagers gather to share stories. You can hear the gentle patter of raindrops creating a soothing melody on its surface.',
                memory: 'Generational wisdom under banana leaves',
                interacted: false,
                difficulty: 'easy',
                rewards: { memories: 2, experience: 20 },
                seasonalBonus: true
            },
            {
                id: 'mango_treasure',
                x: 280, y: 240, width: 100, height: 160,
                type: 'tree',
                title: 'The Sweet Mango Haven',
                description: 'This ancient mango tree bears the sweetest fruit in the village. During monsoon season, the mangoes become even more delicious, their sweetness concentrated by the rain. Several have fallen to the ground, creating a natural feast that attracts colorful birds and brings joy to children.',
                memory: 'Sweet monsoon mangoes',
                interacted: false,
                difficulty: 'medium',
                rewards: { memories: 3, experience: 25 },
                collectible: 'ripe_mango'
            },
            {
                id: 'coconut_sentinel',
                x: 580, y: 270, width: 60, height: 180,
                type: 'tree',
                title: 'The Sentinel Coconut Palm',
                description: 'This tall coconut palm stands like a guardian over the village, its fronds swaying gracefully in the monsoon breeze. Villagers say it can predict the weather - when its leaves rustle in a certain way, heavy rain is coming. Fresh coconuts hang ready to quench thirst.',
                memory: 'Nature\'s weather wisdom',
                interacted: false,
                difficulty: 'hard',
                rewards: { memories: 2, experience: 30 },
                weatherPredictor: true
            },
            {
                id: 'jackfruit_giant',
                x: 450, y: 260, width: 90, height: 150,
                type: 'tree',
                title: 'The Giant Jackfruit Tree',
                description: 'This massive jackfruit tree is the pride of the village. Its enormous fruits hang directly from the trunk, and during monsoon, their sweet aroma fills the air. The tree provides shade for the weekly village market and has witnessed countless celebrations.',
                memory: 'Community gatherings under the jackfruit',
                interacted: false,
                difficulty: 'medium',
                rewards: { memories: 3, experience: 35 },
                communityHub: true
            },
            
            // House interactions with cultural depth
            {
                id: 'grandmothers_house',
                x: 350, y: 340, width: 140, height: 90,
                type: 'house',
                title: 'Grandmother\'s Clay Kitchen',
                description: 'The warm aroma of freshly cooked rice, lentils, and fish curry wafts from this traditional clay house. You can hear your grandmother humming an old Bengali lullaby while she cooks on the clay stove. The sound of rain on the tin roof creates a perfect harmony with her gentle voice.',
                memory: 'Grandmother\'s monsoon lullabies',
                interacted: false,
                difficulty: 'easy',
                rewards: { memories: 4, experience: 40 },
                culturalSignificance: 'high',
                soundscape: 'cooking_and_humming'
            },
            {
                id: 'bamboo_artisan',
                x: 650, y: 370, width: 120, height: 80,
                type: 'house',
                title: 'The Bamboo Craftsman\'s Workshop',
                description: 'Inside this bamboo house, skilled hands weave baskets, mats, and fishing traps. The rhythmic sound of bamboo being split and woven mingles with the rain. The craftsman works by the window, using the soft monsoon light to perfect his intricate patterns.',
                memory: 'Traditional craftsmanship in the rain',
                interacted: false,
                difficulty: 'medium',
                rewards: { memories: 3, experience: 30 },
                craftingSkill: 'bamboo_weaving'
            },
            {
                id: 'tin_school',
                x: 150, y: 380, width: 100, height: 70,
                type: 'house',
                title: 'The Village School',
                description: 'This small tin-roofed school is closed today due to heavy rain, but you can see children\'s drawings still on the blackboard through the window. Paper boats made in art class sit on the windowsill, waiting for the next adventure in the puddles outside.',
                memory: 'Rainy day school memories',
                interacted: false,
                difficulty: 'easy',
                rewards: { memories: 2, experience: 20 },
                educationalValue: true
            },
            
            // Special cultural interactions
            {
                id: 'paper_boat_fleet',
                x: 480, y: 510, width: 90, height: 35,
                type: 'special',
                title: 'The Paper Boat Armada',
                description: 'A small fleet of colorful paper boats floats in this clear puddle, each carrying the dreams and wishes of village children. Some boats bear messages written in Bengali, others carry small flowers as offerings to the rain gods. You remember making boats just like these with your friends.',
                memory: 'Paper boat dreams and wishes',
                interacted: false,
                difficulty: 'easy',
                rewards: { memories: 3, experience: 25 },
                interactive: 'boat_making',
                culturalActivity: 'monsoon_tradition'
            },
            {
                id: 'rain_shrine',
                x: 300, y: 520, width: 70, height: 25,
                type: 'special',
                title: 'The Rain Blessing Shrine',
                description: 'A small shrine dedicated to the rain goddess sits beside this puddle. Villagers have left offerings of rice, flowers, and incense. The gentle rain seems to bless these offerings, and you feel a deep connection to the traditions that have sustained your community for generations.',
                memory: 'Spiritual connection with monsoon',
                interacted: false,
                difficulty: 'medium',
                rewards: { memories: 4, experience: 50 },
                spiritual: true,
                blessing: 'rain_goddess'
            },
            
            // Hidden interactions that require exploration
            {
                id: 'hidden_well',
                x: 50, y: 450, width: 40, height: 40,
                type: 'hidden',
                title: 'The Ancient Village Well',
                description: 'This old well has served the village for over a century. During monsoon, it fills with fresh rainwater, and you can hear the echo of water drops falling into its depths. Local legends say that wishes made here during the first monsoon rain always come true.',
                memory: 'Ancient well wishes',
                interacted: false,
                difficulty: 'hard',
                rewards: { memories: 5, experience: 60 },
                legendary: true,
                hidden: true
            },
            {
                id: 'firefly_grove',
                x: 850, y: 300, width: 80, height: 100,
                type: 'hidden',
                title: 'The Firefly Dancing Grove',
                description: 'As evening approaches during monsoon, this small grove comes alive with dancing fireflies. Their gentle light creates magic in the misty air, and local children believe they are the spirits of ancestors celebrating the life-giving rain.',
                memory: 'Firefly magic in the monsoon mist',
                interacted: false,
                difficulty: 'hard',
                rewards: { memories: 4, experience: 45 },
                timeDependent: 'evening',
                magical: true,
                hidden: true
            }
        ];
    }
    
    initializeQuests() {
        this.questProgress = {
            'paper_boat_master': {
                name: 'Paper Boat Master',
                description: 'Help create and launch 5 paper boats',
                progress: 0,
                target: 5,
                rewards: { memories: 10, title: 'Boat Captain' }
            },
            'memory_collector': {
                name: 'Village Memory Keeper',
                description: 'Discover 15 different memories',
                progress: 0,
                target: 15,
                rewards: { memories: 20, title: 'Memory Keeper' }
            },
            'cultural_explorer': {
                name: 'Cultural Heritage Explorer',
                description: 'Interact with all cultural sites',
                progress: 0,
                target: 8,
                rewards: { memories: 15, title: 'Heritage Guardian' }
            }
        };
    }
    
    update(deltaTime) {
        // Check for nearby interactables with improved detection
        const playerBounds = this.game.player.getBounds();
        const playerCenterX = playerBounds.x + playerBounds.width/2;
        const playerCenterY = playerBounds.y + playerBounds.height/2;
        
        let nearbyInteractable = null;
        let closestDistance = Infinity;
        
        this.interactables.forEach(item => {
            if (item.interacted && !item.repeatable) return;
            
            // Skip hidden items until discovered
            if (item.hidden && !item.discovered) {
                const distance = this.getDistance(playerCenterX, playerCenterY, 
                    item.x + item.width/2, item.y + item.height/2);
                if (distance < 30) {
                    item.discovered = true;
                    this.game.showStoryPanel('Discovery!', `You've found a hidden location: ${item.title}`);
                }
                return;
            }
            
            // Time-dependent interactions
            if (item.timeDependent && !this.checkTimeRequirement(item.timeDependent)) {
                return;
            }
            
            const distance = this.getDistance(playerCenterX, playerCenterY,
                item.x + item.width/2, item.y + item.height/2);
            
            const interactionRange = this.getInteractionRange(item);
            
            if (distance < interactionRange && distance < closestDistance) {
                nearbyInteractable = item;
                closestDistance = distance;
            }
        });
        
        // Show/hide interaction prompt
        if (nearbyInteractable && !this.promptVisible) {
            this.showPrompt(nearbyInteractable);
        } else if (!nearbyInteractable && this.promptVisible) {
            this.hidePrompt();
        }
        
        // Update quest progress
        this.updateQuestProgress();
    }
    
    getInteractionRange(item) {
        switch (item.difficulty) {
            case 'easy': return 100;
            case 'medium': return 80;
            case 'hard': return 60;
            default: return 90;
        }
    }
    
    checkTimeRequirement(requirement) {
        // Simple time simulation - in a full game, this would check actual time
        const gameTime = (Date.now() / 10000) % 24; // Simulate 24-hour cycle
        
        switch (requirement) {
            case 'evening': return gameTime > 18 || gameTime < 6;
            case 'morning': return gameTime > 6 && gameTime < 12;
            case 'night': return gameTime > 22 || gameTime < 4;
            default: return true;
        }
    }
    
    getDistance(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    }
    
    showPrompt(interactable) {
        this.currentInteraction = interactable;
        this.promptVisible = true;
        
        const promptText = this.getPromptText(interactable);
        document.getElementById('prompt-text').textContent = promptText;
        document.getElementById('interaction-prompt').classList.remove('hidden');
        
        // Add difficulty indicator
        const difficultyColor = this.getDifficultyColor(interactable.difficulty);
        document.getElementById('interact-btn').style.backgroundColor = difficultyColor;
    }
    
    getDifficultyColor(difficulty) {
        switch (difficulty) {
            case 'easy': return '#4CAF50';
            case 'medium': return '#FF9800';
            case 'hard': return '#F44336';
            default: return '#2196F3';
        }
    }
    
    hidePrompt() {
        this.promptVisible = false;
        this.currentInteraction = null;
        document.getElementById('interaction-prompt').classList.add('hidden');
    }
    
    getPromptText(interactable) {
        const basePrompts = {
            'puddle': [
                'The puddle reflects monsoon clouds. Splash and create ripples?',
                'Clear water invites exploration. Wade in carefully?',
                'Tadpoles swim in the shallow water. Observe their dance?'
            ],
            'tree': [
                'Ancient branches offer shelter from rain. Rest beneath?',
                'Fruit hangs heavy on the branches. Gather nature\'s gift?',
                'The tree whispers old stories. Listen to its wisdom?'
            ],
            'house': [
                'Warm light glows from within. Approach and listen?',
                'The aroma of home cooking drifts out. Experience village life?',
                'Traditional crafts are being made inside. Learn the art?'
            ],
            'special': [
                'Something magical catches your eye. Investigate closely?',
                'A cultural treasure awaits discovery. Explore its meaning?',
                'Local traditions come alive here. Participate respectfully?'
            ],
            'hidden': [
                'A secret of the village reveals itself. Uncover its mystery?',
                'Hidden wisdom waits to be discovered. Seek understanding?',
                'Ancient knowledge calls to you. Accept its teaching?'
            ]
        };
        
        const prompts = basePrompts[interactable.type] || basePrompts['special'];
        const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];
        
        // Add difficulty hint
        const difficultyHint = {
            'easy': ' (Simple interaction)',
            'medium': ' (Requires attention)',
            'hard': ' (Challenging discovery)'
        };
        
        return randomPrompt + (difficultyHint[interactable.difficulty] || '');
    }
    
    executeCurrentInteraction() {
        if (!this.currentInteraction) return;
        
        const item = this.currentInteraction;
        
        // Mark as interacted (unless repeatable)
        if (!item.repeatable) {
            item.interacted = true;
        }
        
        // Add memories based on rewards
        const memoriesGained = item.rewards?.memories || 1;
        for (let i = 0; i < memoriesGained; i++) {
            this.game.addMemory();
        }
        
        // Track discovered memories
        this.discoveredMemories.add(item.memory);
        
        // Show enhanced story panel
        this.showEnhancedStoryPanel(item);
        
        // Hide prompt
        this.hidePrompt();
        
        // Add visual and audio effects
        this.addInteractionEffect(item);
        
        // Handle special interactions
        this.handleSpecialInteraction(item);
        
        // Update quest progress
        this.updateQuestProgress();
    }
    
    showEnhancedStoryPanel(item) {
        let storyText = item.description;
        
        // Add cultural context for significant items
        if (item.culturalSignificance === 'high') {
            storyText += '\n\nThis place holds deep cultural meaning for the village community, representing traditions passed down through generations.';
        }
        
        // Add seasonal bonus information
        if (item.seasonalBonus) {
            storyText += '\n\nThe monsoon season makes this experience especially meaningful, as nature and culture harmonize in perfect balance.';
        }
        
        // Add rewards information
        if (item.rewards) {
            storyText += `\n\n✨ Memory gained: "${item.memory}"`;
            if (item.rewards.experience) {
                storyText += `\n🌟 Experience: +${item.rewards.experience}`;
            }
        }
        
        this.game.showStoryPanel(item.title, storyText);
    }
    
    handleSpecialInteraction(item) {
        switch (item.interactive) {
            case 'boat_making':
                this.questProgress['paper_boat_master'].progress++;
                break;
        }
        
        if (item.blessing) {
            // Temporary blessing effects
            this.applyBlessing(item.blessing);
        }
        
        if (item.collectible) {
            this.addToInventory(item.collectible);
        }
    }
    
    applyBlessing(blessingType) {
        switch (blessingType) {
            case 'rain_goddess':
                // Increase interaction range temporarily
                setTimeout(() => {
                    // Blessing effect would wear off
                }, 30000);
                break;
        }
    }
    
    addToInventory(item) {
        // Simple inventory system
        if (!this.game.inventory) {
            this.game.inventory = [];
        }
        this.game.inventory.push(item);
    }
    
    updateQuestProgress() {
        // Update memory collector quest
        this.questProgress['memory_collector'].progress = this.discoveredMemories.size;
        
        // Update cultural explorer quest
        const culturalSites = this.interactables.filter(item => 
            item.culturalSignificance || item.spiritual || item.communityHub
        );
        this.questProgress['cultural_explorer'].progress = culturalSites.filter(site => site.interacted).length;
        
        // Check for quest completions
        Object.keys(this.questProgress).forEach(questId => {
            const quest = this.questProgress[questId];
            if (quest.progress >= quest.target && !quest.completed) {
                quest.completed = true;
                this.completeQuest(questId, quest);
            }
        });
    }
    
    completeQuest(questId, quest) {
        // Add quest rewards
        if (quest.rewards.memories) {
            for (let i = 0; i < quest.rewards.memories; i++) {
                this.game.addMemory();
            }
        }
        
        // Show completion message
        this.game.showStoryPanel(
            `Quest Complete: ${quest.name}!`,
            `${quest.description}\n\nReward: ${quest.rewards.memories} memories\nTitle earned: ${quest.rewards.title}`
        );
    }
    
    addInteractionEffect(item) {
        // Enhanced particle effects based on interaction type
        const effect = {
            x: item.x + item.width/2,
            y: item.y + item.height/2,
            particles: [],
            duration: 2000,
            elapsed: 0,
            type: item.type
        };
        
        // Create particles based on interaction type
        const particleCount = item.rewards?.memories * 3 || 8;
        for (let i = 0; i < particleCount; i++) {
            effect.particles.push({
                x: effect.x,
                y: effect.y,
                vx: (Math.random() - 0.5) * 150,
                vy: (Math.random() - 0.5) * 150 - 50,
                life: 1,
                color: this.getEffectColor(item.type),
                size: 2 + Math.random() * 4,
                gravity: item.type === 'puddle' ? 0 : 30
            });
        }
        
        // Store effect for rendering (simplified implementation)
        this.activeEffects = this.activeEffects || [];
        this.activeEffects.push(effect);
        
        // Clean up effect after duration
        setTimeout(() => {
            const index = this.activeEffects.indexOf(effect);
            if (index > -1) {
                this.activeEffects.splice(index, 1);
            }
        }, effect.duration);
        
        // Play appropriate sound
        this.game.audio.playInteractionSound(item.type);
    }
    
    getEffectColor(type) {
        const colors = {
            'puddle': '#87CEEB',
            'tree': '#90EE90',
            'house': '#FFD700',
            'special': '#FF69B4',
            'hidden': '#9C27B0'
        };
        return colors[type] || '#FFFFFF';
    }
    
    handleClick(x, y) {
        // Enhanced click detection with priority system
        let clickedInteractable = null;
        let highestPriority = -1;
        
        this.interactables.forEach(item => {
            if (item.interacted && !item.repeatable) return;
            if (item.hidden && !item.discovered) return;
            
            if (x >= item.x && x <= item.x + item.width &&
                y >= item.y && y <= item.y + item.height) {
                
                const priority = this.getInteractionPriority(item);
                if (priority > highestPriority) {
                    highestPriority = priority;
                    clickedInteractable = item;
                }
            }
        });
        
        if (clickedInteractable) {
            // Check if player is close enough
            const playerBounds = this.game.player.getBounds();
            const distance = this.getDistance(
                playerBounds.x + playerBounds.width/2,
                playerBounds.y + playerBounds.height/2,
                clickedInteractable.x + clickedInteractable.width/2,
                clickedInteractable.y + clickedInteractable.height/2
            );
            
            const interactionRange = this.getInteractionRange(clickedInteractable);
            
            if (distance < interactionRange) {
                this.currentInteraction = clickedInteractable;
                this.executeCurrentInteraction();
            } else {
                // Show "too far" message
                this.game.showStoryPanel('Too Far Away', 'Move closer to interact with this location.');
            }
        }
    }
    
    getInteractionPriority(item) {
        let priority = 0;
        
        if (item.type === 'special') priority += 3;
        if (item.type === 'hidden') priority += 5;
        if (item.difficulty === 'hard') priority += 2;
        if (item.culturalSignificance === 'high') priority += 2;
        if (item.spiritual) priority += 3;
        
        return priority;
    }
    
    render(ctx) {
        // Render interaction highlights with enhanced visuals
        this.interactables.forEach(item => {
            if (item.interacted && !item.repeatable) return;
            if (item.hidden && !item.discovered) return;
            
            const playerBounds = this.game.player.getBounds();
            const distance = this.getDistance(
                playerBounds.x + playerBounds.width/2,
                playerBounds.y + playerBounds.height/2,
                item.x + item.width/2,
                item.y + item.height/2
            );
            
            const interactionRange = this.getInteractionRange(item);
            
            if (distance < interactionRange) {
                // Highlight border with difficulty-based color
                const highlightColor = this.getDifficultyColor(item.difficulty);
                ctx.strokeStyle = highlightColor;
                ctx.lineWidth = 3;
                ctx.setLineDash([8, 4]);
                ctx.globalAlpha = 0.8;
                
                // Pulsing effect
                const pulse = Math.sin(Date.now() * 0.005) * 0.3 + 0.7;
                ctx.globalAlpha = pulse;
                
                ctx.strokeRect(item.x - 8, item.y - 8, item.width + 16, item.height + 16);
                ctx.setLineDash([]);
                
                // Interaction icon with type-specific symbol
                const icon = this.getInteractionIcon(item.type);
                ctx.fillStyle = highlightColor;
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText(icon, item.x + item.width/2, item.y - 15);
                
                // Distance indicator for harder interactions
                if (item.difficulty === 'hard') {
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                    ctx.font = '12px Arial';
                    ctx.fillText('⚡', item.x + item.width - 10, item.y + 15);
                }
                
                ctx.globalAlpha = 1;
            }
        });
        
        // Render active particle effects
        if (this.activeEffects) {
            this.activeEffects.forEach(effect => {
                effect.particles.forEach(particle => {
                    if (particle.life > 0) {
                        ctx.fillStyle = particle.color;
                        ctx.globalAlpha = particle.life;
                        ctx.beginPath();
                        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                        ctx.fill();
                        
                        // Update particle
                        particle.x += particle.vx * 0.016;
                        particle.y += particle.vy * 0.016;
                        particle.vy += particle.gravity * 0.016;
                        particle.life -= 0.02;
                    }
                });
            });
            ctx.globalAlpha = 1;
        }
    }
    
    getInteractionIcon(type) {
        const icons = {
            'puddle': '💧',
            'tree': '🌳',
            'house': '🏠',
            'special': '✨',
            'hidden': '🔍'
        };
        return icons[type] || '⭐';
    }
}