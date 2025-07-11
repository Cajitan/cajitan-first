class AudioManager {
    constructor() {
        this.audioContext = null;
        this.sounds = {};
        this.musicPlaying = false;
        this.masterVolume = 0.3;
        
        this.initializeAudio();
    }
    
    initializeAudio() {
        // Initialize Web Audio API
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.log('Web Audio API not supported');
        }
    }
    
    playAmbientMusic() {
        if (this.musicPlaying || !this.audioContext) return;
        
        this.musicPlaying = true;
        this.playRainAmbience();
    }
    
    playRainAmbience() {
        // Create rain sound using white noise
        if (!this.audioContext) return;
        
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        // Generate filtered white noise for rain sound
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.1;
        }
        
        // Apply low-pass filter for more realistic rain sound
        const source = this.audioContext.createBufferSource();
        const filter = this.audioContext.createBiquadFilter();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = buffer;
        source.loop = true;
        
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime);
        
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        source.start();
        
        // Store reference for cleanup
        this.sounds.rain = { source, filter, gainNode };
    }
    
    playMemorySound() {
        if (!this.audioContext) return;
        
        // Create enhanced chime sound for collecting memories
        const oscillator = this.audioContext.createOscillator();
        const oscillator2 = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(1200, this.audioContext.currentTime + 0.4);
        
        oscillator2.type = 'sine';
        oscillator2.frequency.setValueAtTime(1200, this.audioContext.currentTime);
        oscillator2.frequency.exponentialRampToValueAtTime(1600, this.audioContext.currentTime + 0.4);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.4, this.audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1.0);
        
        oscillator.connect(gainNode);
        oscillator2.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator2.start(this.audioContext.currentTime + 0.1);
        oscillator.stop(this.audioContext.currentTime + 1.0);
        oscillator2.stop(this.audioContext.currentTime + 1.0);
    }
    
    playInteractionSound(type = 'default') {
        if (!this.audioContext) return;
        
        // Create different sounds based on interaction type
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        switch (type) {
            case 'puddle':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.3);
                break;
            case 'tree':
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.4);
                break;
            case 'house':
                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(250, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(180, this.audioContext.currentTime + 0.3);
                break;
            case 'special':
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
                oscillator.frequency.exponentialRampToValueAtTime(400, this.audioContext.currentTime + 0.5);
                break;
            default:
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.2);
        }
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.25, this.audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }
    
    setVolume(volume) {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        
        // Update existing sounds
        Object.values(this.sounds).forEach(sound => {
            if (sound.gainNode) {
                sound.gainNode.gain.setValueAtTime(
                    this.masterVolume * 0.3, 
                    this.audioContext.currentTime
                );
            }
        });
    }
    
    stopAll() {
        Object.values(this.sounds).forEach(sound => {
            if (sound.source) {
                sound.source.stop();
            }
        });
        this.sounds = {};
        this.musicPlaying = false;
    }
}