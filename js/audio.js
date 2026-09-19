// Web Audio API procedural sound engine - 100% offline, zero external sound asset dependencies

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.activeNoiseNode = null;
    this.activeGainNode = null;
    this.ambientType = 'none';
    this.ambientVolume = 0.5;
    this.sfxVolume = 0.6;
    this.audioInitialized = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.audioInitialized = true;
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play subtle UI click / tap
  playClick() {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.04);
      
      gain.gain.setValueAtTime(this.sfxVolume * 0.15, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // Play task complete celebration chime
  playSuccess() {
    this.init();
    if (!this.ctx) return;
    try {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + index * 0.08;
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);
        
        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(this.sfxVolume * 0.25, startTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.5);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start(startTime);
        osc.stop(startTime + 0.55);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // Play session complete gong/bell
  playTimerComplete() {
    this.init();
    if (!this.ctx) return;
    try {
      const freqs = [440, 880, 1320, 1760];
      freqs.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const decay = 2.5 - idx * 0.4;
        
        osc.type = idx === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
        
        gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime((this.sfxVolume * 0.3) / (idx + 1), this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + decay);
        
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        
        osc.start();
        osc.stop(this.ctx.currentTime + decay + 0.1);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  // Set Ambient Sound generator: 'rain', 'brown-noise', 'pink-noise', 'forest', 'binaural', 'none'
  setAmbient(type) {
    this.init();
    this.stopAmbient();
    this.ambientType = type;
    if (type === 'none' || !this.ctx) return;

    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(2, bufferSize, this.ctx.sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    if (type === 'brown-noise') {
      let lastOutL = 0.0;
      let lastOutR = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const whiteL = Math.random() * 2 - 1;
        const whiteR = Math.random() * 2 - 1;
        lastOutL = (lastOutL + (0.02 * whiteL)) / 1.02;
        lastOutR = (lastOutR + (0.02 * whiteR)) / 1.02;
        left[i] = lastOutL * 3.5;
        right[i] = lastOutR * 3.5;
      }
    } else if (type === 'pink-noise') {
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        left[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
        right[i] = left[i];
      }
    } else if (type === 'rain') {
      // Rain simulation: pink/brown noise with random raindrop crackles
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + (0.04 * white)) / 1.04;
        let crackle = 0;
        if (Math.random() < 0.003) {
          crackle = (Math.random() * 2 - 1) * 0.6;
        }
        left[i] = (lastOut * 2.2 + crackle);
        right[i] = (lastOut * 2.2 + (Math.random() < 0.003 ? (Math.random() * 2 - 1) * 0.6 : 0));
      }
    } else if (type === 'forest') {
      // Gentle wind breeze
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const t = i / this.ctx.sampleRate;
        const mod = Math.sin(t * 1.5) * 0.4 + 0.6;
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + (0.015 * white)) / 1.015;
        left[i] = lastOut * 3.0 * mod;
        right[i] = lastOut * 3.0 * (Math.cos(t * 1.2) * 0.4 + 0.6);
      }
    } else if (type === 'binaural') {
      // Alpha waves / binaural rhythm tone generator
      const sourceL = this.ctx.createOscillator();
      const sourceR = this.ctx.createOscillator();
      const merger = this.ctx.createChannelMerger(2);
      
      sourceL.frequency.value = 216; // A 432 / 2
      sourceR.frequency.value = 226; // 10Hz alpha wave difference
      
      this.activeGainNode = this.ctx.createGain();
      this.activeGainNode.gain.setValueAtTime(this.ambientVolume * 0.18, this.ctx.currentTime);
      
      sourceL.connect(merger, 0, 0);
      sourceR.connect(merger, 0, 1);
      merger.connect(this.activeGainNode);
      this.activeGainNode.connect(this.ctx.destination);
      
      sourceL.start();
      sourceR.start();
      
      this.activeNoiseNode = {
        stop: () => {
          sourceL.stop();
          sourceR.stop();
          sourceL.disconnect();
          sourceR.disconnect();
          merger.disconnect();
        }
      };
      return;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;

    // Filter to shape the frequency response
    const filter = this.ctx.createBiquadFilter();
    if (type === 'rain') {
      filter.type = 'lowpass';
      filter.frequency.value = 1400;
    } else if (type === 'forest') {
      filter.type = 'bandpass';
      filter.frequency.value = 450;
      filter.Q.value = 0.7;
    } else {
      filter.type = 'lowpass';
      filter.frequency.value = 2200;
    }

    this.activeGainNode = this.ctx.createGain();
    this.activeGainNode.gain.setValueAtTime(this.ambientVolume * 0.4, this.ctx.currentTime);

    noiseSource.connect(filter);
    filter.connect(this.activeGainNode);
    this.activeGainNode.connect(this.ctx.destination);

    noiseSource.start();
    this.activeNoiseNode = noiseSource;
  }

  setAmbientVolume(vol) {
    this.ambientVolume = Math.max(0, Math.min(1, vol));
    if (this.activeGainNode && this.ctx) {
      this.activeGainNode.gain.setTargetAtTime(
        this.ambientType === 'binaural' ? this.ambientVolume * 0.18 : this.ambientVolume * 0.4,
        this.ctx.currentTime,
        0.05
      );
    }
  }

  stopAmbient() {
    if (this.activeNoiseNode) {
      try {
        this.activeNoiseNode.stop();
        this.activeNoiseNode.disconnect && this.activeNoiseNode.disconnect();
      } catch (e) {}
      this.activeNoiseNode = null;
    }
    if (this.activeGainNode) {
      try {
        this.activeGainNode.disconnect();
      } catch (e) {}
      this.activeGainNode = null;
    }
  }
}

window.soundEngine = new SoundEngine();
