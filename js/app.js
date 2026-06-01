/**
 * Virtual Manipulative Math Berbasis RME
 * Application Logic
 */

class MathApp {
    constructor() {
        // Screen navigation order
        this.baseScreens = [
            'screen-welcome',
            'screen-profil',
            'screen-instructions',
            'screen-objectives',
            'screen-menu'
        ];
        
        this.p1Screens = [
            'screen-p1-intro',
            'screen-p1-apersepsi-segitiga',
            'screen-p1-apersepsi-segiempat',
            'screen-p1-eksplorasi-segitiga',
            'screen-p1-eksplorasi-segiempat',
            'screen-p1-selesai'
        ];

        this.p2Screens = [
            'screen-p2-apersepsi',
            'screen-p2-eksplorasi-susun',
            'screen-p2-eksplorasi-urai',
            'screen-p2-selesai'
        ];

        this.screensFlow = [...this.baseScreens]; // Active flow
        this.currentScreenIndex = 0;
        this.activeMeeting = null; // 1 or 2
        
        // Sound configuration
        this.audioCtx = null;
        this.soundMuted = false;
        this.bgmPlaying = false;
        this.masterGain = null;
        this.bgmGain = null;
        this.sfxGain = null;
        this._bgmTimer = null;

        // Pertemuan 1 State
        this.trianglePreset = 'samasisi';
        this.quadPreset = 'persegi';
        this.measuredTriangle = {
            angles: { A: false, B: false, C: false },
            sides: { AB: false, BC: false, CA: false }
        };
        this.measuredQuad = {
            angles: { A: false, B: false, C: false, D: false },
            sides: { AB: false, BC: false, CD: false, DA: false }
        };

        // Geometric data definitions
        this.triangleData = {
            samasisi: {
                points: { A: { x: 200, y: 40 }, B: { x: 320, y: 220 }, C: { x: 80, y: 220 } },
                angles: { A: 60, B: 60, C: 60 },
                sides: { AB: 8, BC: 8, CA: 8 },
                type: 'samasisi'
            },
            samakaki: {
                points: { A: { x: 200, y: 40 }, B: { x: 290, y: 220 }, C: { x: 110, y: 220 } },
                angles: { A: 40, B: 70, C: 70 },
                sides: { AB: 9, BC: 6, CA: 9 },
                type: 'samakaki'
            },
            sikusiku: {
                points: { A: { x: 100, y: 40 }, B: { x: 320, y: 220 }, C: { x: 100, y: 220 } },
                angles: { A: 90, B: 53, C: 37 },
                sides: { AB: 6, BC: 10, CA: 8 },
                type: 'sikusiku'
            },
            sembarang: {
                points: { A: { x: 180, y: 80 }, B: { x: 340, y: 220 }, C: { x: 60, y: 220 } },
                angles: { A: 105, B: 45, C: 30 },
                sides: { AB: 6, BC: 11, CA: 8 },
                type: 'sembarang'
            }
        };

        this.quadData = {
            persegi: {
                points: { A: { x: 130, y: 50 }, B: { x: 270, y: 50 }, C: { x: 270, y: 190 }, D: { x: 130, y: 190 } },
                angles: { A: 90, B: 90, C: 90, D: 90 },
                sides: { AB: 7, BC: 7, CD: 7, DA: 7 },
                type: 'persegi'
            },
            persegipanjang: {
                points: { A: { x: 100, y: 60 }, B: { x: 300, y: 60 }, C: { x: 300, y: 180 }, D: { x: 100, y: 180 } },
                angles: { A: 90, B: 90, C: 90, D: 90 },
                sides: { AB: 10, BC: 6, CD: 10, DA: 6 },
                type: 'persegipanjang'
            },
            jajargenjang: {
                points: { A: { x: 140, y: 60 }, B: { x: 320, y: 60 }, C: { x: 280, y: 180 }, D: { x: 100, y: 180 } },
                angles: { A: 110, B: 70, C: 110, D: 70 },
                sides: { AB: 9, BC: 6, CD: 9, DA: 6 },
                type: 'jajargenjang'
            },
            trapesium: {
                points: { A: { x: 160, y: 60 }, B: { x: 260, y: 60 }, C: { x: 330, y: 180 }, D: { x: 90, y: 180 } },
                angles: { A: 110, B: 70, C: 120, D: 60 },
                sides: { AB: 5, BC: 6.5, CD: 12, DA: 6 },
                type: 'trapesium'
            },
            layanglayang: {
                points: { A: { x: 200, y: 40 }, B: { x: 290, y: 110 }, C: { x: 200, y: 220 }, D: { x: 110, y: 110 } },
                angles: { A: 100, B: 110, C: 40, D: 110 },
                sides: { AB: 6, BC: 9, CD: 9, DA: 6 },
                type: 'layanglayang'
            },
            belahketupat: {
                points: { A: { x: 200, y: 40 }, B: { x: 290, y: 130 }, C: { x: 200, y: 220 }, D: { x: 110, y: 130 } },
                angles: { A: 120, B: 60, C: 120, D: 60 },
                sides: { AB: 7, BC: 7, CD: 7, DA: 7 },
                type: 'belahketupat'
            }
        };

        // Pertemuan 2 State
        this.compositionTemplate = 'house'; // 'house' or 'ship'
        this.draggedSVGElement = null;
        this.svgOffset = { x: 0, y: 0 };
        this.compositionScore = 0;
        this.compositionTargets = {
            house: {
                roof: { targetCenter: { x: 225, y: 70 }, color: '#ff7675', snapDist: 25, snapped: false },
                body: { targetCenter: { x: 225, y: 182.5 }, color: '#a29bfe', snapDist: 25, snapped: false },
                door: { targetCenter: { x: 225, y: 210 }, color: '#ffeaa7', snapDist: 20, snapped: false }
            },
            ship: {
                hull: { targetCenter: { x: 225, y: 212.5 }, color: '#ffeaa7', snapDist: 25, snapped: false },
                'sail-big': { targetCenter: { x: 165, y: 100 }, color: '#ff7675', snapDist: 25, snapped: false },
                'sail-small': { targetCenter: { x: 270, y: 112.5 }, color: '#74b9ff', snapDist: 25, snapped: false }
            }
        };
        this.compositionStartingPositions = [
            { x: 390, y: 60 },
            { x: 390, y: 145 },
            { x: 390, y: 220 }
        ];

        // Decomposition State
        this.decompActivePieces = 3;
        this.decompBaskets = {
            segitiga: ['decomp-roof'],
            segiempat: ['decomp-body', 'decomp-door']
        };
        this.decompLog = {
            'decomp-roof': false,
            'decomp-body': false,
            'decomp-door': false
        };
    }

    init() {
        console.log("MathApp Initializing...");
        this.setupNavigation();
        this.setTrianglePreset('samasisi');
        this.setQuadPreset('persegi');
        this.setupDecompositionDragAndDrop();
        
        // Window resize listener to keep snapped pieces aligned
        window.addEventListener('resize', () => this.handleResize());

        // Handle page visibility change (e.g. app minimized, tab switched, phone locked)
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAudioOnHide();
            } else {
                this.resumeAudioOnShow();
            }
        });

        // Handle pagehide event (e.g. closing page/tab or navigating away)
        window.addEventListener('pagehide', () => {
            this.pauseAudioOnHide();
        });
    }

    pauseAudioOnHide() {
        if (this.audioCtx && this.audioCtx.state === 'running') {
            this.audioCtx.suspend();
        }
    }

    resumeAudioOnShow() {
        // Only resume if sound is not muted
        if (this.soundMuted) return;
        
        if (this.audioCtx && this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    // ================= SOUND MANAGER (WEB AUDIO API) =================
    initAudio() {
        if (!this.audioCtx) {
            const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = new AudioCtxClass();
        }
        // Create master gain node for global volume control
        if (!this.masterGain) {
            this.masterGain = this.audioCtx.createGain();
            this.masterGain.gain.value = 0.7;
            this.masterGain.connect(this.audioCtx.destination);
        }
        // Create BGM gain node (quieter than SFX)
        if (!this.bgmGain) {
            this.bgmGain = this.audioCtx.createGain();
            this.bgmGain.gain.value = 0.15;
            this.bgmGain.connect(this.masterGain);
        }
        // Create SFX gain node
        if (!this.sfxGain) {
            this.sfxGain = this.audioCtx.createGain();
            this.sfxGain.gain.value = 1.0;
            this.sfxGain.connect(this.masterGain);
        }
    }

    toggleSound() {
        this.soundMuted = !this.soundMuted;
        const soundBtn = document.getElementById('sound-toggle');
        if (this.soundMuted) {
            soundBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            soundBtn.classList.add('muted');
            this.stopBGM();
        } else {
            soundBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            soundBtn.classList.remove('muted');
            this.playSound('click');
            this.startBGM();
        }
    }

    // ---- Background Music (looping cheerful melody) ----
    startBGM() {
        if (this.soundMuted || this.bgmPlaying) return;
        this.initAudio();
        if (!this.audioCtx) return;
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();

        this.bgmPlaying = true;

        // Restore BGM gain to its active level (0.15) smoothly
        if (this.bgmGain) {
            const now = this.audioCtx.currentTime;
            this.bgmGain.gain.cancelScheduledValues(now);
            this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
            this.bgmGain.gain.linearRampToValueAtTime(0.15, now + 0.2);
        }

        this._bgmLoop();
    }

    _bgmLoop() {
        if (!this.bgmPlaying || this.soundMuted) return;
        const ctx = this.audioCtx;
        const now = ctx.currentTime;

        // Simple cheerful melody in C major (kid-friendly)
        const melody = [
            { f: 523.25, d: 0.3 },  // C5
            { f: 587.33, d: 0.3 },  // D5
            { f: 659.25, d: 0.3 },  // E5
            { f: 523.25, d: 0.3 },  // C5
            { f: 659.25, d: 0.3 },  // E5
            { f: 698.46, d: 0.3 },  // F5
            { f: 783.99, d: 0.6 },  // G5
            { f: 0, d: 0.15 },      // rest
            { f: 783.99, d: 0.3 },  // G5
            { f: 698.46, d: 0.3 },  // F5
            { f: 659.25, d: 0.3 },  // E5
            { f: 587.33, d: 0.3 },  // D5
            { f: 523.25, d: 0.3 },  // C5
            { f: 587.33, d: 0.3 },  // D5
            { f: 523.25, d: 0.6 },  // C5
            { f: 0, d: 0.3 },       // rest
        ];

        let offset = 0;
        melody.forEach(note => {
            if (note.f > 0) {
                // Main tone
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = note.f;
                osc.connect(gain);
                gain.connect(this.bgmGain);
                gain.gain.setValueAtTime(0.0, now + offset);
                gain.gain.linearRampToValueAtTime(0.3, now + offset + 0.02);
                gain.gain.setValueAtTime(0.3, now + offset + note.d * 0.7);
                gain.gain.linearRampToValueAtTime(0.0, now + offset + note.d * 0.95);
                osc.start(now + offset);
                osc.stop(now + offset + note.d);

                // Subtle harmonic (octave higher, very quiet)
                const osc2 = ctx.createOscillator();
                const gain2 = ctx.createGain();
                osc2.type = 'sine';
                osc2.frequency.value = note.f * 2;
                osc2.connect(gain2);
                gain2.connect(this.bgmGain);
                gain2.gain.setValueAtTime(0.0, now + offset);
                gain2.gain.linearRampToValueAtTime(0.05, now + offset + 0.02);
                gain2.gain.linearRampToValueAtTime(0.0, now + offset + note.d * 0.9);
                osc2.start(now + offset);
                osc2.stop(now + offset + note.d);
            }
            offset += note.d;
        });

        // Schedule next loop
        this._bgmTimer = setTimeout(() => this._bgmLoop(), offset * 1000);
    }

    stopBGM() {
        this.bgmPlaying = false;
        if (this._bgmTimer) {
            clearTimeout(this._bgmTimer);
            this._bgmTimer = null;
        }
        // Smoothly fade out and mute BGM gain to stop currently scheduled oscillators
        if (this.bgmGain && this.audioCtx) {
            const now = this.audioCtx.currentTime;
            this.bgmGain.gain.cancelScheduledValues(now);
            this.bgmGain.gain.setValueAtTime(this.bgmGain.gain.value, now);
            this.bgmGain.gain.linearRampToValueAtTime(0, now + 0.2);
        }
    }

    // ---- Sound Effects ----
    playSound(type) {
        if (this.soundMuted) return;
        this.initAudio();
        if (!this.audioCtx) return;

        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }

        const ctx = this.audioCtx;
        const dest = this.sfxGain;
        const now = ctx.currentTime;

        if (type === 'click') {
            // Quick cheerful blip
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(dest);
            osc.frequency.setValueAtTime(600, now);
            osc.frequency.exponentialRampToValueAtTime(1200, now + 0.06);
            gain.gain.setValueAtTime(0.18, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc.start(now);
            osc.stop(now + 0.1);

        } else if (type === 'navigate') {
            // Soft ascending whoosh
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(dest);
            osc.frequency.setValueAtTime(350, now);
            osc.frequency.exponentialRampToValueAtTime(700, now + 0.12);
            gain.gain.setValueAtTime(0.001, now);
            gain.gain.linearRampToValueAtTime(0.15, now + 0.04);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.start(now);
            osc.stop(now + 0.15);

        } else if (type === 'measure') {
            // Satisfying measurement ping (two harmonics)
            [1, 2].forEach((harmonic, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.connect(gain);
                gain.connect(dest);
                const baseFreq = 800 * harmonic;
                osc.frequency.setValueAtTime(baseFreq, now);
                osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.8, now + 0.15);
                const vol = i === 0 ? 0.2 : 0.08;
                gain.gain.setValueAtTime(vol, now);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
                osc.start(now);
                osc.stop(now + 0.2);
            });

        } else if (type === 'success') {
            // Happy ascending arpeggio (C5 → E5 → G5 → C6)
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.connect(gain);
                gain.connect(dest);
                const startTime = now + i * 0.1;
                osc.frequency.setValueAtTime(freq, startTime);
                gain.gain.setValueAtTime(0.0, startTime);
                gain.gain.linearRampToValueAtTime(0.2, startTime + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
                osc.start(startTime);
                osc.stop(startTime + 0.25);
            });

        } else if (type === 'wrong') {
            // Buzzy descending tone
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.connect(gain);
            gain.connect(dest);
            osc.frequency.setValueAtTime(200, now);
            osc.frequency.linearRampToValueAtTime(80, now + 0.3);
            gain.gain.setValueAtTime(0.12, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
            osc.start(now);
            osc.stop(now + 0.35);
            // Second dissonant tone
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'square';
            osc2.connect(gain2);
            gain2.connect(dest);
            osc2.frequency.setValueAtTime(150, now);
            osc2.frequency.linearRampToValueAtTime(60, now + 0.25);
            gain2.gain.setValueAtTime(0.06, now);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
            osc2.start(now);
            osc2.stop(now + 0.3);

        } else if (type === 'snap') {
            // Quick satisfying snap-lock
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.connect(gain);
            gain.connect(dest);
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(1400, now + 0.04);
            gain.gain.setValueAtTime(0.25, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
            osc.start(now);
            osc.stop(now + 0.08);
            // Secondary pop
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.connect(gain2);
            gain2.connect(dest);
            osc2.frequency.setValueAtTime(1200, now + 0.03);
            gain2.gain.setValueAtTime(0.0, now);
            gain2.gain.linearRampToValueAtTime(0.15, now + 0.03);
            gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            osc2.start(now);
            osc2.stop(now + 0.1);

        } else if (type === 'complete') {
            // Grand fanfare for completing a meeting
            // Chord: C5+E5+G5
            const chordNotes = [523.25, 659.25, 783.99];
            chordNotes.forEach(freq => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.connect(gain);
                gain.connect(dest);
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.0, now);
                gain.gain.linearRampToValueAtTime(0.15, now + 0.03);
                gain.gain.setValueAtTime(0.15, now + 0.3);
                gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
                osc.start(now);
                osc.stop(now + 0.5);
            });
            // Then C6 high note
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'triangle';
            osc.connect(gain);
            gain.connect(dest);
            osc.frequency.value = 1046.50;
            gain.gain.setValueAtTime(0.0, now + 0.35);
            gain.gain.linearRampToValueAtTime(0.2, now + 0.38);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);
            osc.start(now + 0.35);
            osc.stop(now + 0.9);
        }
    }

    // ================= SCREEN NAVIGATION =================
    setupNavigation() {
        this.updateFooterNav();
    }

    showScreen(screenId) {
        // Play navigate sound for screen transitions
        this.playSound('navigate');

        // Stop BGM if we return to the welcome screen (closing the game flow)
        if (screenId === 'screen-welcome') {
            this.stopBGM();
        } else {
            // Start BGM on first interaction if not already playing
            if (!this.bgmPlaying && !this.soundMuted) {
                this.startBGM();
            }
        }

        // Hide all screens
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
        }

        // Run screen-specific setup
        if (screenId === 'screen-p2-eksplorasi-susun') {
            this.setupCompositionPuzzle();
        } else if (screenId === 'screen-p2-eksplorasi-urai') {
            this.resetDecomposition();
        }

        // Play completion fanfare for "selesai" screens
        if (screenId === 'screen-p1-selesai' || screenId === 'screen-p2-selesai') {
            this.playSound('complete');
        }

        this.updateFooterNav();
    }

    updateFooterNav() {
        const footer = document.getElementById('global-nav-footer');
        const currentScreenId = this.screensFlow[this.currentScreenIndex];

        // Hide footer on Welcome & Menu screens
        if (currentScreenId === 'screen-welcome' || currentScreenId === 'screen-menu') {
            footer.classList.add('hide');
        } else {
            footer.classList.remove('hide');
        }

        // Handle disabled/enabled buttons
        const backBtn = document.getElementById('btn-footer-back');
        const nextBtn = document.getElementById('btn-footer-next');

        // KEMBALI button behavior
        if (this.currentScreenIndex === 0) {
            backBtn.disabled = true;
            backBtn.classList.add('disabled');
        } else {
            backBtn.disabled = false;
            backBtn.classList.remove('disabled');
        }

        // SELANJUTNYA button behavior
        if (this.currentScreenIndex === this.screensFlow.length - 1) {
            nextBtn.disabled = true;
            nextBtn.classList.add('disabled');
        } else {
            nextBtn.disabled = false;
            nextBtn.classList.remove('disabled');
        }
    }

    nextScreen() {
        if (this.currentScreenIndex < this.screensFlow.length - 1) {
            this.currentScreenIndex++;
            this.showScreen(this.screensFlow[this.currentScreenIndex]);
        }
    }

    prevScreen() {
        if (this.currentScreenIndex > 0) {
            this.currentScreenIndex--;
            this.showScreen(this.screensFlow[this.currentScreenIndex]);
        }
    }

    goToMenu() {
        this.activeMeeting = null;
        this.screensFlow = [...this.baseScreens];
        this.currentScreenIndex = 4; // Go to screen-menu instead of screen-welcome
        this.showScreen('screen-menu');
    }

    selectMeeting(num) {
        this.activeMeeting = num;
        if (num === 1) {
            this.screensFlow = [...this.baseScreens.slice(0, 5), ...this.p1Screens];
        } else if (num === 2) {
            this.screensFlow = [...this.baseScreens.slice(0, 5), ...this.p2Screens];
        }
        this.currentScreenIndex = 5; // First meeting screen (intro or apersepsi)
        this.showScreen(this.screensFlow[this.currentScreenIndex]);
    }

    goToExplorationFromApersepsi(shapeType, presetName) {
        this.playSound('click');
        if (shapeType === 'segitiga') {
            this.selectMeeting(1);
            this.currentScreenIndex = 8; // index of screen-p1-eksplorasi-segitiga
            this.showScreen('screen-p1-eksplorasi-segitiga');
            this.setTrianglePreset(presetName);
        } else if (shapeType === 'segiempat') {
            this.selectMeeting(1);
            this.currentScreenIndex = 9; // index of screen-p1-eksplorasi-segiempat
            this.showScreen('screen-p1-eksplorasi-segiempat');
            this.setQuadPreset(presetName);
        }
    }


    // ================= PERTEMUAN 1: TRIANGLE INTERACTIVE EXPLORATION =================
    setTrianglePreset(presetName) {
        this.trianglePreset = presetName;
        this.playSound('click');

        // Update active class on selector tabs
        document.querySelectorAll('#screen-p1-eksplorasi-segitiga .preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`btn-tri-${presetName}`).classList.add('active');

        // Reset measurement tracking
        this.measuredTriangle = {
            angles: { A: false, B: false, C: false },
            sides: { AB: false, BC: false, CA: false }
        };

        // Reset observations table UI
        document.getElementById('val-angle-A').textContent = '-';
        document.getElementById('val-angle-A').className = 'empty-val';
        document.getElementById('val-angle-B').textContent = '-';
        document.getElementById('val-angle-B').className = 'empty-val';
        document.getElementById('val-angle-C').textContent = '-';
        document.getElementById('val-angle-C').className = 'empty-val';
        
        document.getElementById('val-side-AB').textContent = '-';
        document.getElementById('val-side-AB').className = 'empty-val';
        document.getElementById('val-side-BC').textContent = '-';
        document.getElementById('val-side-BC').className = 'empty-val';
        document.getElementById('val-side-CA').textContent = '-';
        document.getElementById('val-side-CA').className = 'empty-val';

        // Reset quiz buttons styling and feedback
        document.querySelectorAll('#screen-p1-eksplorasi-segitiga .quiz-opt').forEach(btn => {
            btn.className = 'quiz-opt';
        });
        document.getElementById('triangle-quiz-feedback').className = 'quiz-feedback hide';

        // Hide popups
        document.getElementById('triangle-measurement-popup').className = 'measurement-popup hide';
        
        // Remove highlighting on edges/vertices
        const svg = document.getElementById('svg-triangle');
        svg.querySelectorAll('.edge-line').forEach(line => line.classList.remove('measured'));
        svg.querySelectorAll('.vertex-node').forEach(node => node.classList.remove('measured'));
        svg.querySelectorAll('.badge-group').forEach(bg => bg.classList.remove('show'));

        // Redraw/Reposition SVG nodes and lines based on preset coordinates
        const data = this.triangleData[presetName];
        
        // Reposition vertices
        const nodeA = document.getElementById('node-A');
        nodeA.setAttribute('cx', data.points.A.x);
        nodeA.setAttribute('cy', data.points.A.y);
        nodeA.nextElementSibling.setAttribute('x', data.points.A.x);
        nodeA.nextElementSibling.setAttribute('y', data.points.A.y - 15);

        const nodeB = document.getElementById('node-B');
        nodeB.setAttribute('cx', data.points.B.x);
        nodeB.setAttribute('cy', data.points.B.y);
        nodeB.nextElementSibling.setAttribute('x', data.points.B.x + 22);
        nodeB.nextElementSibling.setAttribute('y', data.points.B.y + 5);

        const nodeC = document.getElementById('node-C');
        nodeC.setAttribute('cx', data.points.C.x);
        nodeC.setAttribute('cy', data.points.C.y);
        nodeC.nextElementSibling.setAttribute('x', data.points.C.x - 22);
        nodeC.nextElementSibling.setAttribute('y', data.points.C.y + 5);

        // Reposition lines
        document.getElementById('line-AB').setAttribute('x1', data.points.A.x);
        document.getElementById('line-AB').setAttribute('y1', data.points.A.y);
        document.getElementById('line-AB').setAttribute('x2', data.points.B.x);
        document.getElementById('line-AB').setAttribute('y2', data.points.B.y);
        document.getElementById('line-AB').nextElementSibling.setAttribute('x1', data.points.A.x);
        document.getElementById('line-AB').nextElementSibling.setAttribute('y1', data.points.A.y);
        document.getElementById('line-AB').nextElementSibling.setAttribute('x2', data.points.B.x);
        document.getElementById('line-AB').nextElementSibling.setAttribute('y2', data.points.B.y);

        document.getElementById('line-BC').setAttribute('x1', data.points.B.x);
        document.getElementById('line-BC').setAttribute('y1', data.points.B.y);
        document.getElementById('line-BC').setAttribute('x2', data.points.C.x);
        document.getElementById('line-BC').setAttribute('y2', data.points.C.y);
        document.getElementById('line-BC').nextElementSibling.setAttribute('x1', data.points.B.x);
        document.getElementById('line-BC').nextElementSibling.setAttribute('y1', data.points.B.y);
        document.getElementById('line-BC').nextElementSibling.setAttribute('x2', data.points.C.x);
        document.getElementById('line-BC').nextElementSibling.setAttribute('y2', data.points.C.y);

        document.getElementById('line-CA').setAttribute('x1', data.points.C.x);
        document.getElementById('line-CA').setAttribute('y1', data.points.C.y);
        document.getElementById('line-CA').setAttribute('x2', data.points.A.x);
        document.getElementById('line-CA').setAttribute('y2', data.points.A.y);
        document.getElementById('line-CA').nextElementSibling.setAttribute('x1', data.points.C.x);
        document.getElementById('line-CA').nextElementSibling.setAttribute('y1', data.points.C.y);
        document.getElementById('line-CA').nextElementSibling.setAttribute('x2', data.points.A.x);
        document.getElementById('line-CA').nextElementSibling.setAttribute('y2', data.points.A.y);

        // Reposition measurement text badges on midpoints
        this.updateEdgeBadgePosition('AB', data.points.A, data.points.B);
        this.updateEdgeBadgePosition('BC', data.points.B, data.points.C);
        this.updateEdgeBadgePosition('CA', data.points.C, data.points.A);
        this.drawTriangleObject(presetName);
    }

    updateEdgeBadgePosition(edge, p1, p2) {
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        
        // Add offset normal to line direction so badge doesn't overlap line
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        const nx = -dy / len; // Normal vector
        const ny = dx / len;
        
        const badgeX = mx + nx * 20;
        const badgeY = my + ny * 20;

        const badgeGroup = document.getElementById(`badge-${edge}`);
        badgeGroup.setAttribute('transform', `translate(${badgeX - 30}, ${badgeY - 11})`);
    }

    clickVertex(nodeName) {
        this.playSound('measure');
        const data = this.triangleData[this.trianglePreset];
        const val = data.angles[nodeName];
        
        // Update state
        this.measuredTriangle.angles[nodeName] = true;
        
        // Highlight node
        document.getElementById(`node-${nodeName}`).classList.add('measured');

        // Show Measurement Popup
        const popup = document.getElementById('triangle-measurement-popup');
        popup.className = 'measurement-popup';
        document.getElementById('triangle-popup-text').innerHTML = `Besar sudut di Titik <strong>${nodeName}</strong> adalah: <strong>${val}&deg;</strong>`;

        // Update data table row
        const cell = document.getElementById(`val-angle-${nodeName}`);
        cell.textContent = `${val}°`;
        cell.className = 'measured-val animate-pop';
    }

    clickEdge(edgeName) {
        this.playSound('measure');
        const data = this.triangleData[this.trianglePreset];
        const val = data.sides[edgeName];
        
        // Update state
        this.measuredTriangle.sides[edgeName] = true;

        // Highlight line
        document.getElementById(`line-${edgeName}`).classList.add('measured');

        // Show badge overlay on line
        const badge = document.getElementById(`badge-${edgeName}`);
        badge.classList.add('show');
        document.getElementById(`text-${edgeName}`).textContent = `${val} CM`;

        // Show Measurement Popup
        const popup = document.getElementById('triangle-measurement-popup');
        popup.className = 'measurement-popup';
        document.getElementById('triangle-popup-text').innerHTML = `Panjang Sisi <strong>${edgeName}</strong> adalah: <strong>${val} cm</strong>`;

        // Update data table row
        const cell = document.getElementById(`val-side-${edgeName}`);
        cell.textContent = `${val} cm`;
        cell.className = 'measured-val animate-pop';
    }

    verifyTriangleAnswer(answer) {
        const feedback = document.getElementById('triangle-quiz-feedback');
        
        // Reset option styles
        document.querySelectorAll('#screen-p1-eksplorasi-segitiga .quiz-opt').forEach(btn => {
            btn.className = 'quiz-opt';
        });

        if (answer === this.trianglePreset) {
            this.playSound('success');
            document.getElementById(`opt-tri-${answer}`).classList.add('correct');
            feedback.className = 'quiz-feedback success';
            feedback.innerHTML = '<i class="fas fa-check-circle"></i> Jawaban Benar! Mantap sekali!';
        } else {
            this.playSound('wrong');
            document.getElementById(`opt-tri-${answer}`).classList.add('wrong');
            feedback.className = 'quiz-feedback error';
            feedback.innerHTML = '<i class="fas fa-times-circle"></i> Kurang Tepat. Coba ukur sisi dan sudutnya lagi ya!';
        }
    }


    // ================= PERTEMUAN 1: QUADRILATERAL INTERACTIVE EXPLORATION =================
    setQuadPreset(presetName) {
        this.quadPreset = presetName;
        this.playSound('click');

        // Update active class on selector tabs
        document.querySelectorAll('#screen-p1-eksplorasi-segiempat .preset-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(`btn-quad-${presetName}`).classList.add('active');

        // Reset measurement tracking
        this.measuredQuad = {
            angles: { A: false, B: false, C: false, D: false },
            sides: { AB: false, BC: false, CD: false, DA: false }
        };

        // Reset observations table UI
        document.getElementById('qval-angle-A').textContent = '-';
        document.getElementById('qval-angle-A').className = 'empty-val';
        document.getElementById('qval-angle-B').textContent = '-';
        document.getElementById('qval-angle-B').className = 'empty-val';
        document.getElementById('qval-angle-C').textContent = '-';
        document.getElementById('qval-angle-C').className = 'empty-val';
        document.getElementById('qval-angle-D').textContent = '-';
        document.getElementById('qval-angle-D').className = 'empty-val';
        
        document.getElementById('qval-side-AB').textContent = '-';
        document.getElementById('qval-side-AB').className = 'empty-val';
        document.getElementById('qval-side-BC').textContent = '-';
        document.getElementById('qval-side-BC').className = 'empty-val';
        document.getElementById('qval-side-CD').textContent = '-';
        document.getElementById('qval-side-CD').className = 'empty-val';
        document.getElementById('qval-side-DA').textContent = '-';
        document.getElementById('qval-side-DA').className = 'empty-val';

        // Reset quiz buttons styling and feedback
        document.querySelectorAll('#screen-p1-eksplorasi-segiempat .quiz-opt-q').forEach(btn => {
            btn.className = 'quiz-opt-q';
        });
        document.getElementById('quad-quiz-feedback').className = 'quiz-feedback hide';

        // Hide popups
        document.getElementById('quad-measurement-popup').className = 'measurement-popup hide';
        
        // Remove highlighting on edges/vertices
        const svg = document.getElementById('svg-quad');
        svg.querySelectorAll('.edge-line').forEach(line => line.classList.remove('measured'));
        svg.querySelectorAll('.vertex-node').forEach(node => node.classList.remove('measured'));
        svg.querySelectorAll('.badge-group').forEach(bg => bg.classList.remove('show'));

        // Reposition SVG nodes and lines based on preset coordinates
        const data = this.quadData[presetName];
        
        // Reposition vertices A, B, C, D
        const vertices = ['A', 'B', 'C', 'D'];
        const offsets = {
            A: { x: -20, y: -5 },
            B: { x: 20, y: -5 },
            C: { x: 20, y: 15 },
            D: { x: -20, y: 15 }
        };

        vertices.forEach(v => {
            const node = document.getElementById(`qnode-${v}`);
            node.setAttribute('cx', data.points[v].x);
            node.setAttribute('cy', data.points[v].y);
            node.nextElementSibling.setAttribute('x', data.points[v].x + offsets[v].x);
            node.nextElementSibling.setAttribute('y', data.points[v].y + offsets[v].y);
        });

        // Reposition lines AB, BC, CD, DA
        const edges = [
            { id: 'AB', p1: 'A', p2: 'B' },
            { id: 'BC', p1: 'B', p2: 'C' },
            { id: 'CD', p1: 'C', p2: 'D' },
            { id: 'DA', p1: 'D', p2: 'A' }
        ];

        edges.forEach(e => {
            const line = document.getElementById(`qline-${e.id}`);
            line.setAttribute('x1', data.points[e.p1].x);
            line.setAttribute('y1', data.points[e.p1].y);
            line.setAttribute('x2', data.points[e.p2].x);
            line.setAttribute('y2', data.points[e.p2].y);
            
            // Hover zone line coordinates
            line.nextElementSibling.setAttribute('x1', data.points[e.p1].x);
            line.nextElementSibling.setAttribute('y1', data.points[e.p1].y);
            line.nextElementSibling.setAttribute('x2', data.points[e.p2].x);
            line.nextElementSibling.setAttribute('y2', data.points[e.p2].y);

            this.updateQuadEdgeBadgePosition(e.id, data.points[e.p1], data.points[e.p2]);
        });
        this.drawQuadObject(presetName);
    }

    updateQuadEdgeBadgePosition(edge, p1, p2) {
        const mx = (p1.x + p2.x) / 2;
        const my = (p1.y + p2.y) / 2;
        
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const len = Math.sqrt(dx*dx + dy*dy);
        const nx = -dy / len;
        const ny = dx / len;
        
        const badgeX = mx + nx * 20;
        const badgeY = my + ny * 20;

        const badgeGroup = document.getElementById(`qbadge-${edge}`);
        badgeGroup.setAttribute('transform', `translate(${badgeX - 30}, ${badgeY - 11})`);
    }

    drawTriangleObject(presetName) {
        const bgGroup = document.getElementById('preset-drawing-bg');
        if (!bgGroup) return;
        
        const data = this.triangleData[presetName];
        const pts = data.points;
        let html = '';
        
        if (presetName === 'samasisi') {
            // Tricky Triangle
            html = `
                <polygon points="${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y}" fill="#e67e22" stroke="#a0522d" stroke-width="6" stroke-linejoin="round" />
                <polygon points="${pts.A.x},${pts.A.y+6} ${pts.B.x-6},${pts.B.y-3} ${pts.C.x+6},${pts.C.y-3}" fill="#d35400" />
                <circle cx="200" cy="150" r="6" fill="#2c3e50" />
                <circle cx="230" cy="150" r="6" fill="#2c3e50" />
                <path d="M210,162 Q215,170 220,162" fill="none" stroke="#2c3e50" stroke-width="3" stroke-linecap="round" />
                <circle cx="200" cy="85" r="7" fill="#f1c40f" stroke="#d35400" stroke-width="1.5" />
                <circle cx="165" cy="135" r="7" fill="#f1c40f" stroke="#d35400" stroke-width="1.5" />
                <circle cx="235" cy="135" r="7" fill="#f1c40f" stroke="#d35400" stroke-width="1.5" />
                <circle cx="130" cy="185" r="7" fill="#f1c40f" stroke="#d35400" stroke-width="1.5" />
                <circle cx="200" cy="185" r="7" fill="#f1c40f" stroke="#d35400" stroke-width="1.5" />
                <circle cx="270" cy="185" r="7" fill="#f1c40f" stroke="#d35400" stroke-width="1.5" />
            `;
        } else if (presetName === 'samakaki') {
            // Gantungan Baju
            html = `
                <path d="M 200,${pts.A.y} C 200,${pts.A.y-18} 216,${pts.A.y-18} 212,${pts.A.y-25} C 208,${pts.A.y-32} 192,${pts.A.y-32} 192,${pts.A.y-22} C 192,${pts.A.y-18} 196,${pts.A.y-15} 200,${pts.A.y}" fill="none" stroke="#7f8c8d" stroke-width="5" stroke-linecap="round" />
                <polygon points="${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y}" fill="none" stroke="#d35400" stroke-width="10" stroke-linejoin="round" />
                <polygon points="${pts.A.x},${pts.A.y+8} ${pts.B.x-8},${pts.B.y-4} ${pts.C.x+8},${pts.C.y-4}" fill="none" stroke="#e67e22" stroke-width="6" stroke-linejoin="round" />
                <line x1="${pts.C.x+15}" y1="${pts.C.y-10}" x2="${pts.B.x-15}" y2="${pts.B.y-10}" stroke="#d35400" stroke-width="5" />
            `;
        } else if (presetName === 'sikusiku') {
            // Potongan Sandwich
            html = `
                <polygon points="${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y}" fill="#d35400" stroke-linejoin="round" />
                <polygon points="${pts.A.x+5},${pts.A.y+6} ${pts.B.x-8},${pts.B.y-3} ${pts.C.x+5},${pts.C.y-5}" fill="#f39c12" />
                <polygon points="${pts.A.x+10},${pts.A.y+12} ${pts.B.x-14},${pts.B.y-6} ${pts.C.x+10},${pts.C.y-10}" fill="#2ecc71" />
                <path d="M ${pts.A.x+16},${pts.A.y+24} L ${pts.B.x-16},${pts.B.y-16}" stroke="#e74c3c" stroke-width="12" stroke-linecap="round" />
                <polygon points="${pts.A.x+20},${pts.A.y+26} ${pts.B.x-24},${pts.B.y-12} ${pts.C.x+20},${pts.C.y-20}" fill="#f1c40f" />
                <polygon points="${pts.A.x+25},${pts.A.y+32} ${pts.B.x-32},${pts.B.y-16} ${pts.C.x+25},${pts.C.y-24}" fill="#ffeaa7" />
            `;
        } else if (presetName === 'sembarang') {
            // Segitiga Sembarang
            html = `
                <polygon points="${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y}" fill="#74b9ff" stroke="#0984e3" stroke-width="5" stroke-linejoin="round" opacity="0.8" />
            `;
        }
        bgGroup.innerHTML = html;
    }

    drawQuadObject(presetName) {
        const bgGroup = document.getElementById('qpreset-drawing-bg');
        if (!bgGroup) return;
        
        const data = this.quadData[presetName];
        const pts = data.points;
        let html = '';
        
        if (presetName === 'persegi') {
            // Jam Dinding
            html = `
                <rect x="${pts.A.x}" y="${pts.A.y}" width="140" height="140" rx="14" fill="#7f8c8d" stroke="#2d3436" stroke-width="6" />
                <rect x="${pts.A.x+10}" y="${pts.A.y+10}" width="120" height="120" rx="8" fill="#ffffff" stroke="#2d3436" stroke-width="2" />
                <circle cx="200" cy="68" r="3" fill="#2d3436" />
                <circle cx="200" cy="172" r="3" fill="#2d3436" />
                <circle cx="148" cy="120" r="3" fill="#2d3436" />
                <circle cx="252" cy="120" r="3" fill="#2d3436" />
                <line x1="200" y1="120" x2="200" y2="85" stroke="#2d3436" stroke-width="5" stroke-linecap="round" />
                <line x1="200" y1="120" x2="235" y2="120" stroke="#e74c3c" stroke-width="3" stroke-linecap="round" />
                <circle cx="200" cy="120" r="5" fill="#2d3436" />
            `;
        } else if (presetName === 'persegipanjang') {
            // Papan Tulis
            html = `
                <rect x="${pts.A.x-6}" y="${pts.A.y-6}" width="212" height="132" rx="8" fill="#a0522d" stroke="#2d3436" stroke-width="5" />
                <rect x="${pts.A.x}" y="${pts.A.y}" width="200" height="120" rx="2" fill="#27ae60" />
                <line x1="120" y1="186" x2="100" y2="230" stroke="#a0522d" stroke-width="6" stroke-linecap="round" />
                <line x1="280" y1="186" x2="300" y2="230" stroke="#a0522d" stroke-width="6" stroke-linecap="round" />
                <rect x="180" y="176" width="10" height="4" fill="#ffffff" stroke="#2d3436" stroke-width="1" />
                <rect x="195" y="175" width="15" height="5" fill="#d35400" stroke="#2d3436" stroke-width="1" />
            `;
        } else if (presetName === 'jajargenjang') {
            // Panel Surya
            html = `
                <line x1="190" y1="180" x2="190" y2="240" stroke="#7f8c8d" stroke-width="8" stroke-linecap="round" />
                <line x1="160" y1="240" x2="220" y2="240" stroke="#7f8c8d" stroke-width="8" stroke-linecap="round" />
                <polygon points="${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y} ${pts.D.x},${pts.D.y}" fill="#2c3e50" stroke="#7f8c8d" stroke-width="5" stroke-linejoin="round" />
                <line x1="185" y1="60" x2="145" y2="180" stroke="#3498db" stroke-width="2" />
                <line x1="230" y1="60" x2="190" y2="180" stroke="#3498db" stroke-width="2" />
                <line x1="275" y1="60" x2="235" y2="180" stroke="#3498db" stroke-width="2" />
                <line x1="130" y1="90" x2="310" y2="90" stroke="#3498db" stroke-width="2" />
                <line x1="120" y1="120" x2="300" y2="120" stroke="#3498db" stroke-width="2" />
                <line x1="110" y1="150" x2="290" y2="150" stroke="#3498db" stroke-width="2" />
            `;
        } else if (presetName === 'trapesium') {
            // Tas Belanja
            html = `
                <path d="M190,60 Q210,20 230,60" fill="none" stroke="#2d3436" stroke-width="5" stroke-linecap="round" />
                <polygon points="${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y} ${pts.D.x},${pts.D.y}" fill="#e74c3c" stroke="#2d3436" stroke-width="5" stroke-linejoin="round" />
                <polygon points="${pts.A.x+5},${pts.A.y+5} ${pts.B.x-5},${pts.B.y+5} ${pts.C.x-8},${pts.C.y-5} ${pts.D.x+8},${pts.D.y-5}" fill="#ff7675" />
                <circle cx="210" cy="120" r="15" fill="#f1c40f" />
                <path d="M202,120 A 8,8 0 0,0 218,120" fill="none" stroke="#2d3436" stroke-width="3" stroke-linecap="round" />
            `;
        } else if (presetName === 'layanglayang') {
            // Layang-layang
            html = `
                <path d="M200,220 Q205,235 200,250 T205,268" fill="none" stroke="#2d3436" stroke-width="3" />
                <polygon points="195,235 205,230 200,235 208,240" fill="#e74c3c" stroke="#2d3436" stroke-width="1" />
                <polygon points="195,250 205,245 200,250 208,255" fill="#f1c40f" stroke="#2d3436" stroke-width="1" />
                <polygon points="${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y} ${pts.D.x},${pts.D.y}" fill="#3498db" stroke="#2d3436" stroke-width="4" stroke-linejoin="round" />
                <polygon points="200,40 290,110 200,110" fill="#e74c3c" opacity="0.85" />
                <polygon points="200,40 110,110 200,110" fill="#f1c40f" opacity="0.85" />
                <polygon points="200,110 290,110 200,220" fill="#2ecc71" opacity="0.85" />
                <line x1="200" y1="40" x2="200" y2="220" stroke="#2d3436" stroke-width="2" />
                <line x1="110" y1="110" x2="290" y2="110" stroke="#2d3436" stroke-width="2" />
            `;
        } else if (presetName === 'belahketupat') {
            // Rambu Lalu Lintas
            html = `
                <rect x="195" y="220" width="10" height="40" fill="#7f8c8d" stroke="#2d3436" stroke-width="2" />
                <polygon points="${pts.A.x},${pts.A.y} ${pts.B.x},${pts.B.y} ${pts.C.x},${pts.C.y} ${pts.D.x},${pts.D.y}" fill="#f1c40f" stroke="#2d3436" stroke-width="5" stroke-linejoin="round" />
                <polygon points="${pts.A.x},${pts.A.y+10} ${pts.B.x-10},${pts.B.y} ${pts.C.x},${pts.C.y-10} ${pts.D.x+10},${pts.D.y}" fill="none" stroke="#2d3436" stroke-width="2.5" />
                <rect x="188" y="95" width="24" height="70" rx="8" fill="#2d3436" />
                <circle cx="200" cy="110" r="8" fill="#e74c3c" stroke="#fff" stroke-width="1.5" />
                <circle cx="200" cy="130" r="8" fill="#f1c40f" stroke="#fff" stroke-width="1.5" />
                <circle cx="200" cy="150" r="8" fill="#2ecc71" stroke="#fff" stroke-width="1.5" />
            `;
        }
        bgGroup.innerHTML = html;
    }

    showCompositionPieceDetails(pieceId) {
        this.playSound('measure');
        const descriptions = {
            roof: "Atap Rumah: Segitiga Sama Kaki (Sudut: 40&deg;, 70&deg;, 70&deg; | Sisi: 9 cm, 9 cm, 6 cm)",
            body: "Dinding Rumah: Persegi (Sudut: 90&deg;, 90&deg;, 90&deg;, 90&deg; | Sisi: 7 cm, 7 cm, 7 cm, 7 cm)",
            door: "Pintu Rumah: Persegi Panjang (Sudut: 90&deg;, 90&deg;, 90&deg;, 90&deg; | Sisi: 8 cm, 8 cm, 5 cm, 5 cm)",
            hull: "Lambung Kapal: Trapesium Sama Kaki (Sudut: 110&deg;, 70&deg;, 70&deg;, 110&deg; | Sisi: 12 cm, 6 cm, 5 cm, 6 cm)",
            'sail-big': "Layar Besar: Segitiga Siku-Siku (Sudut: 90&deg;, 53&deg;, 37&deg; | Sisi: 6 cm, 10 cm, 8 cm)",
            'sail-small': "Layar Kecil: Segitiga Siku-Siku (Sudut: 90&deg;, 45&deg;, 45&deg; | Sisi: 5 cm, 7 cm, 5 cm)"
        };

        const popup = document.getElementById('composition-info-popup');
        const textSpan = document.getElementById('composition-info-text');
        
        if (popup && textSpan && descriptions[pieceId]) {
            textSpan.innerHTML = descriptions[pieceId];
            popup.className = 'measurement-popup';
            
            if (this._compInfoTimer) clearTimeout(this._compInfoTimer);
            this._compInfoTimer = setTimeout(() => {
                popup.className = 'measurement-popup hide';
            }, 5000);
        }
    }

    showDecompositionPieceDetails(pieceId) {
        this.playSound('measure');
        const descriptions = {
            'decomp-roof': "Atap: Segitiga Sama Kaki (Sudut: 40&deg;, 70&deg;, 70&deg; | Sisi: 9 cm, 9 cm, 6 cm)",
            'decomp-body': "Dinding: Persegi (Sudut: 90&deg;, 90&deg;, 90&deg;, 90&deg; | Sisi: 7 cm, 7 cm, 7 cm, 7 cm)",
            'decomp-door': "Pintu: Persegi Panjang (Sudut: 90&deg;, 90&deg;, 90&deg;, 90&deg; | Sisi: 8 cm, 8 cm, 5 cm, 5 cm)"
        };

        const popup = document.getElementById('decomposition-info-popup');
        const textSpan = document.getElementById('decomposition-info-text');
        
        if (popup && textSpan && descriptions[pieceId]) {
            textSpan.innerHTML = descriptions[pieceId];
            popup.className = 'measurement-popup';
            
            if (this._decompInfoTimer) clearTimeout(this._decompInfoTimer);
            this._decompInfoTimer = setTimeout(() => {
                popup.className = 'measurement-popup hide';
            }, 5000);
        }
    }

    clickQuadVertex(nodeName) {
        this.playSound('measure');
        const data = this.quadData[this.quadPreset];
        const val = data.angles[nodeName];
        
        // Update state
        this.measuredQuad.angles[nodeName] = true;
        
        // Highlight node
        document.getElementById(`qnode-${nodeName}`).classList.add('measured');

        // Show Measurement Popup
        const popup = document.getElementById('quad-measurement-popup');
        popup.className = 'measurement-popup';
        document.getElementById('quad-popup-text').innerHTML = `Besar sudut di Titik <strong>${nodeName}</strong> adalah: <strong>${val}&deg;</strong>`;

        // Update data table row
        const cell = document.getElementById(`qval-angle-${nodeName}`);
        cell.textContent = `${val}°`;
        cell.className = 'measured-val animate-pop';
    }

    clickQuadEdge(edgeName) {
        this.playSound('measure');
        const data = this.quadData[this.quadPreset];
        const val = data.sides[edgeName];
        
        // Update state
        this.measuredQuad.sides[edgeName] = true;

        // Highlight line
        document.getElementById(`qline-${edgeName}`).classList.add('measured');

        // Show badge overlay on line
        const badge = document.getElementById(`qbadge-${edgeName}`);
        badge.classList.add('show');
        document.getElementById(`qtext-${edgeName}`).textContent = `${val} CM`;

        // Show Measurement Popup
        const popup = document.getElementById('quad-measurement-popup');
        popup.className = 'measurement-popup';
        document.getElementById('quad-popup-text').innerHTML = `Panjang Sisi <strong>${edgeName}</strong> adalah: <strong>${val} cm</strong>`;

        // Update data table row
        const cell = document.getElementById(`qval-side-${edgeName}`);
        cell.textContent = `${val} cm`;
        cell.className = 'measured-val animate-pop';
    }

    verifyQuadAnswer(answer) {
        const feedback = document.getElementById('quad-quiz-feedback');
        
        // Reset option styles
        document.querySelectorAll('#screen-p1-eksplorasi-segiempat .quiz-opt-q').forEach(btn => {
            btn.className = 'quiz-opt-q';
        });

        if (answer === this.quadPreset) {
            this.playSound('success');
            document.getElementById(`opt-quad-${answer}`).classList.add('correct');
            feedback.className = 'quiz-feedback success';
            feedback.innerHTML = '<i class="fas fa-check-circle"></i> Jawaban Benar! Kamu hebat sekali!';
        } else {
            this.playSound('wrong');
            document.getElementById(`opt-quad-${answer}`).classList.add('wrong');
            feedback.className = 'quiz-feedback error';
            feedback.innerHTML = '<i class="fas fa-times-circle"></i> Jawaban Belum Tepat. Coba perhatikan lagi ciri-cirinya ya!';
        }
    }


    // ================= PERTEMUAN 2: DRAG & DROP COMPOSITION GAME =================
    setupCompositionPuzzle() {
        console.log("Setting up Composition Puzzle...");
        
        // Hide success banner
        document.getElementById('composition-success').classList.add('hide');

        // Reset state
        const targetConfig = this.compositionTargets[this.compositionTemplate];
        for (let key in targetConfig) {
            targetConfig[key].snapped = false;
        }
        this.compositionScore = 0;

        // Display correct template slots in SVG
        const houseGroup = document.querySelector('#composition-svg .template-house');
        const shipGroup = document.querySelector('#composition-svg .template-ship');

        if (this.compositionTemplate === 'house') {
            houseGroup.classList.remove('hide');
            shipGroup.classList.add('hide');
        } else {
            houseGroup.classList.add('hide');
            shipGroup.classList.remove('hide');
        }

        // Spawn draggable pieces inside SVG overlay
        const dragContainer = document.getElementById('draggable-container');
        dragContainer.innerHTML = ''; // Clean old pieces

        // Select correct pieces depending on template
        let pieces = [];
        if (this.compositionTemplate === 'house') {
            pieces = [
                { id: 'roof', type: 'triangle', html: `<polygon points="120,5 235,85 5,85" fill="#ff7675" stroke="#2d3436" stroke-width="3.5" style="pointer-events: auto;"/>
                <line x1="62" y1="45" x2="178" y2="45" stroke="#c0392b" stroke-width="2" />
                <line x1="33" y1="65" x2="207" y2="65" stroke="#c0392b" stroke-width="2" />`, w: 240, h: 90 },
                { id: 'body', type: 'square', html: `<rect x="5" y="5" width="170" height="125" fill="#a29bfe" stroke="#2d3436" stroke-width="3.5" style="pointer-events: auto;"/>
                <line x1="5" y1="35" x2="175" y2="35" stroke="#6c5ce7" stroke-width="2" />
                <line x1="5" y1="65" x2="175" y2="65" stroke="#6c5ce7" stroke-width="2" />
                <line x1="5" y1="95" x2="175" y2="95" stroke="#6c5ce7" stroke-width="2" />`, w: 180, h: 135 },
                { id: 'door', type: 'rectangle', html: `<rect x="5" y="5" width="40" height="70" fill="#ffeaa7" stroke="#2d3436" stroke-width="3" style="pointer-events: auto;"/>
                <line x1="25" y1="5" x2="25" y2="75" stroke="#d35400" stroke-width="1.5" />
                <circle cx="33" cy="40" r="3" fill="#d35400" />`, w: 50, h: 80 }
            ];
        } else {
            pieces = [
                { id: 'hull', type: 'trapezoid', html: `<polygon points="5,5 315,5 265,60 55,60" fill="#ffeaa7" stroke="#2d3436" stroke-width="3.5" style="pointer-events: auto;"/>
                <line x1="30" y1="23" x2="290" y2="23" stroke="#d35400" stroke-width="2" />
                <line x1="45" y1="41" x2="275" y2="41" stroke="#d35400" stroke-width="2" />`, w: 320, h: 65 },
                { id: 'sail-big', type: 'triangle', html: `<polygon points="95,5 95,125 5,125" fill="#ff7675" stroke="#2d3436" stroke-width="3.5" style="pointer-events: auto;"/>
                <line x1="95" y1="5" x2="50" y2="125" stroke="#c0392b" stroke-width="1.5" />`, w: 100, h: 130 },
                { id: 'sail-small', type: 'triangle', html: `<polygon points="5,5 5,100 85,100" fill="#74b9ff" stroke="#2d3436" stroke-width="3.5" style="pointer-events: auto;"/>
                <line x1="5" y1="5" x2="45" y2="100" stroke="#0984e3" stroke-width="1.5" />`, w: 90, h: 105 }
            ];
        }

        // Calculate SVG scale
        const svg = document.getElementById('composition-svg');
        const svgRect = svg.getBoundingClientRect();
        const svgScale = svgRect.width > 0 ? (svgRect.width / 450) : 1;
        dragContainer.style.setProperty('--svg-scale', svgScale);

        // Render each piece floating in dock shelf on the right
        pieces.forEach((p, idx) => {
            const pieceDiv = document.createElement('div');
            pieceDiv.className = 'puzzle-piece';
            pieceDiv.id = `comp-piece-${p.id}`;
            pieceDiv.setAttribute('data-target-id', p.id);
            pieceDiv.setAttribute('data-w', p.w);
            pieceDiv.setAttribute('data-h', p.h);
            
            pieceDiv.style.width = `${p.w}px`;
            pieceDiv.style.height = `${p.h}px`;

            // SVG graphic inside div
            pieceDiv.innerHTML = `<svg viewBox="0 0 ${p.w} ${p.h}" width="100%" height="100%">${p.html}</svg>`;

            // Append to workspace container
            dragContainer.appendChild(pieceDiv);

            // Position relative to #draggable-container using SVG coordinates
            const pos = this.compositionStartingPositions[idx];
            const pt = svg.createSVGPoint();
            pt.x = pos.x;
            pt.y = pos.y;
            const screenPoint = pt.matrixTransform(svg.getScreenCTM());
            const containerRect = dragContainer.getBoundingClientRect();
            
            const left = screenPoint.x - containerRect.left - (p.w / 2);
            const top = screenPoint.y - containerRect.top - (p.h / 2);
            
            pieceDiv.style.left = `${left}px`;
            pieceDiv.style.top = `${top}px`;

            // Bind drag handlers
            this.bindSVGDragHandlers(pieceDiv, p.id);
        });
    }

    bindSVGDragHandlers(el, targetId) {
        let isDragging = false;
        let startX, startY;
        let clickStartX, clickStartY;
        let originalLeft = parseFloat(el.style.left);
        let originalTop = parseFloat(el.style.top);

        const onStart = (e) => {
            if (this.compositionTargets[this.compositionTemplate][targetId].snapped) {
                this.showCompositionPieceDetails(targetId);
                return;
            }

            e.preventDefault();
            isDragging = true;
            el.classList.add('dragging');
            el.style.cursor = 'grabbing';
            this.playSound('click');

            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            startX = clientX - el.offsetLeft;
            startY = clientY - el.offsetTop;
            clickStartX = clientX;
            clickStartY = clientY;

            // Lift z-index
            el.style.zIndex = 1000;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            let newX = clientX - startX;
            let newY = clientY - startY;

            // Keep inside board boundaries roughly
            const board = document.getElementById('composition-board-area');
            const rect = board.getBoundingClientRect();
            
            newX = Math.max(0, Math.min(newX, rect.width - el.offsetWidth));
            newY = Math.max(0, Math.min(newY, rect.height - el.offsetHeight));

            el.style.left = `${newX}px`;
            el.style.top = `${newY}px`;
        };

        const onEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;

            const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
            const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;

            const distMoved = Math.sqrt(Math.pow(clientX - clickStartX, 2) + Math.pow(clientY - clickStartY, 2));

            // Get bounding rect before removing dragging class
            const elRect = el.getBoundingClientRect();
            el.classList.remove('dragging');
            el.style.cursor = 'grab';

            if (distMoved < 6) {
                // Click details
                this.showCompositionPieceDetails(targetId);
                el.style.transition = 'left 0.2s, top 0.2s';
                el.style.left = `${originalLeft}px`;
                el.style.top = `${originalTop}px`;
                el.style.zIndex = 100;
                setTimeout(() => {
                    el.style.transition = '';
                }, 200);
                return;
            }

            const svg = document.getElementById('composition-svg');
            if (!svg) return;

            // Transform client center coordinates to SVG local coordinates
            const clientCenterX = elRect.left + elRect.width / 2;
            const clientCenterY = elRect.top + elRect.height / 2;

            const point = svg.createSVGPoint();
            point.x = clientCenterX;
            point.y = clientCenterY;
            
            const svgPoint = point.matrixTransform(svg.getScreenCTM().inverse());
            const droppedSVGX = svgPoint.x;
            const droppedSVGY = svgPoint.y;

            // Target coordinates
            const config = this.compositionTargets[this.compositionTemplate][targetId];
            const dist = Math.sqrt(Math.pow(droppedSVGX - config.targetCenter.x, 2) + Math.pow(droppedSVGY - config.targetCenter.y, 2));

            // Is within snap range?
            if (dist < config.snapDist) {
                // Snap!
                this.playSound('snap');
                config.snapped = true;
                el.classList.add('snapped');

                // Transform target center from SVG coordinates to screen coordinates
                const targetPoint = svg.createSVGPoint();
                targetPoint.x = config.targetCenter.x;
                targetPoint.y = config.targetCenter.y;
                const screenPoint = targetPoint.matrixTransform(svg.getScreenCTM());

                // Position relative to #draggable-container
                const container = document.getElementById('draggable-container');
                const containerRect = container.getBoundingClientRect();
                
                const baseW = parseFloat(el.getAttribute('data-w'));
                const baseH = parseFloat(el.getAttribute('data-h'));
                const targetLeft = screenPoint.x - containerRect.left - baseW / 2;
                const targetTop = screenPoint.y - containerRect.top - baseH / 2;

                el.style.left = `${targetLeft}px`;
                el.style.top = `${targetTop}px`;
                el.style.zIndex = 10;
                
                // Solid styling snap indicator
                el.querySelector('svg > *').setAttribute('stroke-width', '4');

                this.compositionScore++;
                this.checkCompositionVictory();
            } else {
                // Slide back to original dock
                this.playSound('wrong');
                el.style.transition = 'left 0.2s, top 0.2s';
                el.style.left = `${originalLeft}px`;
                el.style.top = `${originalTop}px`;
                el.style.zIndex = 100;
                setTimeout(() => {
                    el.style.transition = '';
                }, 200);
            }
        };

        el.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        el.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    }

    selectCompositionTemplate(name) {
        this.compositionTemplate = name;
        
        // Update selection tabs styling
        document.getElementById('btn-select-house').classList.remove('active');
        document.getElementById('btn-select-ship').classList.remove('active');
        document.getElementById(`btn-select-${name}`).classList.add('active');

        this.setupCompositionPuzzle();
    }

    toggleCompositionTemplate() {
        const next = this.compositionTemplate === 'house' ? 'ship' : 'house';
        this.selectCompositionTemplate(next);
    }

    resetComposition() {
        this.setupCompositionPuzzle();
    }

    checkCompositionVictory() {
        const totalPieces = Object.keys(this.compositionTargets[this.compositionTemplate]).length;
        if (this.compositionScore >= totalPieces) {
            setTimeout(() => {
                this.playSound('success');
                document.getElementById('composition-success').classList.remove('hide');
            }, 300);
        }
    }


    // ================= PERTEMUAN 2: DECOMPOSITION GAME =================
    setupDecompositionDragAndDrop() {
        // Reset state
        this.resetDecomposition();
    }

    bindDecompPieceHandlers(el, id) {
        let isDragging = false;
        let startX, startY;
        let clickStartX, clickStartY;
        let originalLeft = el.offsetLeft;
        let originalTop = el.offsetTop;

        const onStart = (e) => {
            if (this.decompLog[id]) {
                this.showDecompositionPieceDetails(id);
                return;
            }

            e.preventDefault();
            isDragging = true;
            el.style.cursor = 'grabbing';
            this.playSound('click');

            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            startX = clientX - el.offsetLeft;
            startY = clientY - el.offsetTop;
            clickStartX = clientX;
            clickStartY = clientY;
            el.style.zIndex = 1000;
        };

        const onMove = (e) => {
            if (!isDragging) return;
            e.preventDefault();

            const clientX = e.clientX || (e.touches && e.touches[0].clientX);
            const clientY = e.clientY || (e.touches && e.touches[0].clientY);

            let newX = clientX - startX;
            let newY = clientY - startY;

            // Constrain within layout bounds
            const parent = document.getElementById('decomp-source-container').parentNode;
            const parentRect = parent.getBoundingClientRect();
            newX = Math.max(-100, Math.min(newX, parentRect.width - 50));
            newY = Math.max(-50, Math.min(newY, parentRect.height - 50));

            el.style.left = `${newX}px`;
            el.style.top = `${newY}px`;
        };

        const onEnd = (e) => {
            if (!isDragging) return;
            isDragging = false;
            el.style.cursor = 'grab';

            const clientX = e.clientX || (e.changedTouches && e.changedTouches[0].clientX) || 0;
            const clientY = e.clientY || (e.changedTouches && e.changedTouches[0].clientY) || 0;

            const distMoved = Math.sqrt(Math.pow(clientX - clickStartX, 2) + Math.pow(clientY - clickStartY, 2));

            if (distMoved < 6) {
                this.showDecompositionPieceDetails(id);
                this.bounceBack(el, originalLeft, originalTop);
                return;
            }

            // Check if dropped inside target baskets
            const rectSegitiga = document.getElementById('basket-segitiga').getBoundingClientRect();
            const rectSegiempat = document.getElementById('basket-segiempat').getBoundingClientRect();
            const elRect = el.getBoundingClientRect();

            // Midpoint of dragged element
            const elMX = elRect.left + elRect.width / 2;
            const elMY = elRect.top + elRect.height / 2;

            let targetBasket = null;
            if (elMX >= rectSegitiga.left && elMX <= rectSegitiga.right &&
                elMY >= rectSegitiga.top && elMY <= rectSegitiga.bottom) {
                targetBasket = 'segitiga';
            } else if (elMX >= rectSegiempat.left && elMX <= rectSegiempat.right &&
                       elMY >= rectSegiempat.top && elMY <= rectSegiempat.bottom) {
                targetBasket = 'segiempat';
            }

            const correctBasketType = el.getAttribute('data-shape');

            if (targetBasket) {
                if (targetBasket === correctBasketType) {
                    // Success sort!
                    this.playSound('snap');
                    this.decompLog[id] = true;
                    el.classList.add('in-basket');
                    
                    // Add label to basket contents container
                    const basketContents = document.getElementById(`contents-${targetBasket}`);
                    const placeholder = basketContents.querySelector('.basket-placeholder');
                    if (placeholder) placeholder.remove();

                    const pieceLabel = id === 'decomp-roof' ? 'Atap (Segitiga)' :
                                       id === 'decomp-body' ? 'Dinding (Segiempat)' : 'Pintu (Segiempat)';
                    
                    const labelBadge = document.createElement('span');
                    labelBadge.className = 'badge ' + (targetBasket === 'segitiga' ? 'red' : 'blue');
                    labelBadge.textContent = id === 'decomp-roof' ? 'Atap' : (id === 'decomp-body' ? 'Dinding' : 'Pintu');
                    basketContents.appendChild(labelBadge);

                    // Update log table status
                    const shortId = id.split('-')[1]; // roof, body, door
                    const statusBadge = document.getElementById(`status-${shortId}`);
                    statusBadge.textContent = 'Benar!';
                    statusBadge.className = 'badge-status sorted';

                    this.decompActivePieces--;
                    this.checkDecompositionVictory();
                } else {
                    // Wrong basket! Bounce back
                    this.playSound('wrong');
                    this.bounceBack(el, originalLeft, originalTop);
                }
            } else {
                // Not dropped in any basket. Return home
                this.bounceBack(el, originalLeft, originalTop);
            }
        };

        el.addEventListener('mousedown', onStart);
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onEnd);

        el.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('touchend', onEnd);
    }

    bounceBack(el, left, top) {
        el.style.transition = 'left 0.2s, top 0.2s';
        el.style.left = `${left}px`;
        el.style.top = `${top}px`;
        setTimeout(() => {
            el.style.transition = '';
        }, 200);
    }

    setupDecompositionDragAndDrop() {
        const roof = document.getElementById('decomp-roof');
        const body = document.getElementById('decomp-body');
        const door = document.getElementById('decomp-door');
        
        if (roof && body && door) {
            this.bindDecompPieceHandlers(roof, 'decomp-roof');
            this.bindDecompPieceHandlers(body, 'decomp-body');
            this.bindDecompPieceHandlers(door, 'decomp-door');
        }
    }

    resetDecomposition() {
        // Reset state
        this.decompActivePieces = 3;
        this.decompLog = {
            'decomp-roof': false,
            'decomp-body': false,
            'decomp-door': false
        };

        // Reset pieces styles and positions
        const roof = document.getElementById('decomp-roof');
        const body = document.getElementById('decomp-body');
        const door = document.getElementById('decomp-door');

        if (roof) {
            roof.className = 'decomp-piece shape-triangle-roof';
            roof.style.left = '60px';
            roof.style.top = '20px';
        }
        if (body) {
            body.className = 'decomp-piece shape-square-body';
            body.style.left = '80px';
            body.style.top = '116px';
        }
        if (door) {
            door.className = 'decomp-piece shape-rect-door';
            door.style.left = '125px';
            door.style.top = '161px';
        }

        // Reset basket UIs
        document.getElementById('contents-segitiga').innerHTML = '<span class="basket-placeholder">Seret Segitiga Ke Sini</span>';
        document.getElementById('contents-segiempat').innerHTML = '<span class="basket-placeholder">Seret Segiempat Ke Sini</span>';

        // Reset sidebar log UIs
        ['roof', 'body', 'door'].forEach(name => {
            const el = document.getElementById(`status-${name}`);
            if (el) {
                el.textContent = 'Belum Diseret';
                el.className = 'badge-status pending';
            }
        });

        // Hide success banner
        document.getElementById('decomposition-success').classList.add('hide');
    }

    checkDecompositionVictory() {
        if (this.decompActivePieces <= 0) {
            setTimeout(() => {
                this.playSound('success');
                document.getElementById('decomposition-success').classList.remove('hide');
            }, 300);
        }
    }

    handleResize() {
        if (this.compositionTargets && this.compositionTemplate) {
            const svg = document.getElementById('composition-svg');
            const container = document.getElementById('draggable-container');
            if (svg && container) {
                const ctm = svg.getScreenCTM();
                if (!ctm) return;
                
                // Update SVG scale CSS variable
                const svgRect = svg.getBoundingClientRect();
                const svgScale = svgRect.width > 0 ? (svgRect.width / 450) : 1;
                container.style.setProperty('--svg-scale', svgScale);

                const containerRect = container.getBoundingClientRect();
                const targetConfig = this.compositionTargets[this.compositionTemplate];
                
                for (let key in targetConfig) {
                    const config = targetConfig[key];
                    const el = document.getElementById(`comp-piece-${key}`);
                    if (el) {
                        const baseW = parseFloat(el.getAttribute('data-w') || 100);
                        const baseH = parseFloat(el.getAttribute('data-h') || 100);
                        
                        if (config.snapped) {
                            // Target center mapping
                            const targetPoint = svg.createSVGPoint();
                            targetPoint.x = config.targetCenter.x;
                            targetPoint.y = config.targetCenter.y;
                            const screenPoint = targetPoint.matrixTransform(ctm);
                            
                            const targetLeft = screenPoint.x - containerRect.left - baseW / 2;
                            const targetTop = screenPoint.y - containerRect.top - baseH / 2;
                            
                            el.style.left = `${targetLeft}px`;
                            el.style.top = `${targetTop}px`;
                        } else {
                            // Unsnapped / Docked pieces mapping
                            const idx = this.compositionTemplate === 'house' ? 
                                (key === 'roof' ? 0 : key === 'body' ? 1 : 2) :
                                (key === 'hull' ? 0 : key === 'sail-big' ? 1 : 2);
                            const pos = this.compositionStartingPositions[idx];
                            
                            const pt = svg.createSVGPoint();
                            pt.x = pos.x;
                            pt.y = pos.y;
                            const screenPoint = pt.matrixTransform(ctm);
                            
                            const targetLeft = screenPoint.x - containerRect.left - baseW / 2;
                            const targetTop = screenPoint.y - containerRect.top - baseH / 2;
                            
                            el.style.left = `${targetLeft}px`;
                            el.style.top = `${targetTop}px`;
                        }
                    }
                }
            }
        }
    }
}

// Instantiate and start app on load
let app;
window.addEventListener('DOMContentLoaded', () => {
    app = new MathApp();
    app.init();
});
