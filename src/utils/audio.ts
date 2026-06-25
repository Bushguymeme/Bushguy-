/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BushMomentId } from '../types.ts';

class BushSynthEngine {
  private ctx: AudioContext | null = null;
  private primaryOsc: OscillatorNode | null = null;
  private lfoOsc: OscillatorNode | null = null;
  private masterGain: GainNode | null = null;
  private intervalId: number | null = null;
  private isRunning: boolean = false;
  private activeMoment: BushMomentId = 'chilling';
  private campfireNoiseNode: AudioBufferSourceNode | null = null;
  private campfireCracklerId: number | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.08, this.ctx.currentTime); // keep it elegant and low-profile
      this.masterGain.connect(this.ctx.destination);
      this.isRunning = true;
      this.startLoop();
      this.startCampfire();
    } catch (e) {
      console.warn('Web Audio API not supported on this platform', e);
    }
  }

  public setVolume(volume: number) {
    if (!this.masterGain || !this.ctx) return;
    this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
  }

  public setMoment(momentId: BushMomentId) {
    this.activeMoment = momentId;
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    this.updateSynthParameters();
  }

  public stop() {
    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.campfireCracklerId) {
      clearTimeout(this.campfireCracklerId);
      this.campfireCracklerId = null;
    }
    if (this.primaryOsc) {
      try { this.primaryOsc.stop(); } catch(e){}
      this.primaryOsc = null;
    }
    if (this.lfoOsc) {
      try { this.lfoOsc.stop(); } catch(e){}
      this.lfoOsc = null;
    }
    if (this.campfireNoiseNode) {
      try { this.campfireNoiseNode.stop(); } catch(e){}
      this.campfireNoiseNode = null;
    }
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }

  private startCampfire() {
    if (!this.ctx || !this.masterGain) return;

    try {
      // 1. Loop a generated white noise buffer for the fire hiss/roar
      const bufferSize = this.ctx.sampleRate * 2; // 2 seconds of noise
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const channelData = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        channelData[i] = Math.random() * 2 - 1;
      }

      this.campfireNoiseNode = this.ctx.createBufferSource();
      this.campfireNoiseNode.buffer = noiseBuffer;
      this.campfireNoiseNode.loop = true;

      // Bandpass filter to shape noise to campfire warm hum/roar
      const bandpassFilter = this.ctx.createBiquadFilter();
      bandpassFilter.type = 'bandpass';
      bandpassFilter.frequency.setValueAtTime(400, this.ctx.currentTime);
      bandpassFilter.Q.setValueAtTime(1.5, this.ctx.currentTime);

      // Lowpass filter to smooth high-end noise
      const lowpassFilter = this.ctx.createBiquadFilter();
      lowpassFilter.type = 'lowpass';
      lowpassFilter.frequency.setValueAtTime(1500, this.ctx.currentTime);

      // Gain node specifically for the continuous warm roar
      const roarGain = this.ctx.createGain();
      roarGain.gain.setValueAtTime(0.015, this.ctx.currentTime);

      // Connect nodes
      this.campfireNoiseNode.connect(bandpassFilter);
      bandpassFilter.connect(lowpassFilter);
      lowpassFilter.connect(roarGain);
      roarGain.connect(this.masterGain);

      this.campfireNoiseNode.start();

      // 2. Micro-crackler scheduling loop for random pops/cracks
      const scheduleCrackle = () => {
        if (!this.ctx || !this.isRunning) return;

        const time = this.ctx.currentTime;
        // Schedule next pop randomly (between 40ms and 450ms)
        const nextDelay = 40 + Math.random() * 410;

        // Create high-frequency wood crack/pop
        const popOsc = this.ctx.createOscillator();
        const popGain = this.ctx.createGain();

        popOsc.type = 'triangle';
        // Random pitch centered around 1.5kHz - 3.5kHz
        const pitch = 1400 + Math.random() * 2200;
        popOsc.frequency.setValueAtTime(pitch, time);

        // Extremely short attack & decay
        const popDuration = 0.003 + Math.random() * 0.012;
        popGain.gain.setValueAtTime(0.012 + Math.random() * 0.025, time);
        popGain.gain.exponentialRampToValueAtTime(0.0001, time + popDuration);

        popOsc.connect(popGain);
        if (this.masterGain) popGain.connect(this.masterGain);

        popOsc.start(time);
        popOsc.stop(time + popDuration + 0.05);

        // Occasional deeper low-mid pop (glowing ember popping)
        if (Math.random() < 0.18) {
          const emberOsc = this.ctx.createOscillator();
          const emberGain = this.ctx.createGain();

          emberOsc.type = 'sine';
          emberOsc.frequency.setValueAtTime(120 + Math.random() * 90, time);
          emberOsc.frequency.exponentialRampToValueAtTime(35, time + 0.09);

          const emberDuration = 0.05 + Math.random() * 0.05;
          emberGain.gain.setValueAtTime(0.03 + Math.random() * 0.035, time);
          emberGain.gain.exponentialRampToValueAtTime(0.0001, time + emberDuration);

          emberOsc.connect(emberGain);
          if (this.masterGain) emberGain.connect(this.masterGain);

          emberOsc.start(time);
          emberOsc.stop(time + emberDuration + 0.05);
        }

        this.campfireCracklerId = window.setTimeout(scheduleCrackle, nextDelay);
      };

      scheduleCrackle();
    } catch (err) {
      console.error('Failed to synthesize continuous campfire sound:', err);
    }
  }

  private startLoop() {
    if (!this.ctx) return;
    
    // Create background low campfire / jungle drone sound
    this.primaryOsc = this.ctx.createOscillator();
    const droneGain = this.ctx.createGain();
    droneGain.gain.setValueAtTime(0.03, this.ctx.currentTime);
    
    this.primaryOsc.type = 'triangle';
    this.primaryOsc.frequency.setValueAtTime(90, this.ctx.currentTime); // 90Hz deep jungle drone
    
    this.primaryOsc.connect(droneGain);
    if (this.masterGain) droneGain.connect(this.masterGain);
    this.primaryOsc.start();

    // Start beat/arpeggio loop
    let tickCount = 0;
    const playTick = () => {
      if (!this.ctx || !this.isRunning) return;
      const theme = this.activeMoment;
      const time = this.ctx.currentTime;

      // Tone generator corresponding to theme
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      switch (theme) {
        case 'chilling':
          // Slow wooden melodic chime
          if (tickCount % 4 === 0) {
            const scale = [220, 261.63, 293.66, 329.63, 392.00]; // Pentatonic minor
            const rootFreq = scale[Math.floor(Math.random() * scale.length)];
            osc.frequency.setValueAtTime(rootFreq, time);
            osc.type = 'triangle';
            
            gain.gain.setValueAtTime(0.04, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.2);
            osc.start();
            osc.stop(time + 1.2);
          }
          break;

        case 'slashing':
          // Fast sharp metal sword slashes and 4/4 synthetic techno kick
          if (tickCount % 2 === 0) {
            // Simulated kick
            osc.frequency.setValueAtTime(150, time);
            osc.frequency.exponentialRampToValueAtTime(30, time + 0.15);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
            osc.start();
            osc.stop(time + 0.2);
          } else {
            // Machete sharp metal swish (high-frequency sweep)
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(2000, time);
            osc.frequency.exponentialRampToValueAtTime(400, time + 0.08);
            
            const biquad = this.ctx.createBiquadFilter();
            biquad.type = 'bandpass';
            biquad.frequency.setValueAtTime(1200, time);
            biquad.Q.setValueAtTime(5, time);
            
            osc.disconnect(gain);
            osc.connect(biquad);
            biquad.connect(gain);

            gain.gain.setValueAtTime(0.06, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
            osc.start();
            osc.stop(time + 0.1);
          }
          break;

        case 'ferrari':
          // Extreme revving engine sounds!
          const gearIdx = tickCount % 8;
          const enginePitchBase = 120 + gearIdx * 25 + Math.random() * 10;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(enginePitchBase, time);
          // Rev upwards rapidly
          osc.frequency.linearRampToValueAtTime(enginePitchBase * 1.8, time + 0.12);
          
          gain.gain.setValueAtTime(0.07, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.13);
          osc.start();
          osc.stop(time + 0.14);
          break;

        case 'swimming':
          // Liquid upwards sound sweeps (bubbles whistling)
          const bubbleNote = 600 + Math.random() * 400;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(bubbleNote, time);
          osc.frequency.exponentialRampToValueAtTime(bubbleNote * 1.6, time + 0.22);
          
          gain.gain.setValueAtTime(0.03, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.23);
          osc.start();
          osc.stop(time + 0.24);
          break;

        case 'flexing':
          // Golden arpeggio majestic notes cascading downwards
          const chords = [
            [261.63, 329.63, 392.00, 523.25], // C Major
            [293.66, 349.23, 440.00, 587.33], // D Minor
            [329.63, 392.00, 493.88, 659.25]  // E Minor
          ];
          const activeChord = chords[Math.floor(time / 2) % chords.length];
          const chordNote = activeChord[tickCount % activeChord.length];
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(chordNote, time);
          
          // Little chime bell vibe overlay
          gain.gain.setValueAtTime(0.06, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);
          osc.start();
          osc.stop(time + 0.36);
          break;
      }

      tickCount = (tickCount + 1) % 16;
    };

    this.intervalId = window.setInterval(
      () => {
        playTick();
      },
      this.activeMoment === 'chilling' ? 300 : this.activeMoment === 'swimming' ? 220 : 150
    );
  }

  private updateSynthParameters() {
    if (!this.ctx || !this.isRunning) return;
    
    // Set frequency of engine drone differently depending on mode
    if (this.primaryOsc) {
      const time = this.ctx.currentTime;
      let freq = 90;
      let type: OscillatorType = 'triangle';
      
      switch (this.activeMoment) {
        case 'chilling':
          freq = 75;
          type = 'sine';
          break;
        case 'slashing':
          freq = 110;
          type = 'triangle';
          break;
        case 'ferrari':
          freq = 135;
          type = 'sawtooth';
          break;
        case 'swimming':
          freq = 90;
          type = 'sine';
          break;
        case 'flexing':
          freq = 120;
          type = 'triangle';
          break;
      }
      this.primaryOsc.type = type;
      this.primaryOsc.frequency.setTargetAtTime(freq, time, 0.2);
    }

    // Reset loop speeds by re-igniting timer interval with appropriate intervals
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    let loopDelay = 150;
    if (this.activeMoment === 'chilling') loopDelay = 350;
    if (this.activeMoment === 'swimming') loopDelay = 220;

    let tickCount = 0;
    const playTick = () => {
      if (!this.ctx || !this.isRunning) return;
      const theme = this.activeMoment;
      const time = this.ctx.currentTime;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.connect(gain);
      if (this.masterGain) gain.connect(this.masterGain);

      switch (theme) {
        case 'chilling':
          if (tickCount % 2 === 0) {
            const scale = [196.00, 220.00, 261.63, 293.66, 329.63, 392.00, 440.00];
            const rootFreq = scale[Math.floor(Math.random() * scale.length)];
            osc.frequency.setValueAtTime(rootFreq, time);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.04, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 1.5);
            osc.start();
            osc.stop(time + 1.5);
          }
          break;

        case 'slashing':
          if (tickCount % 2 === 0) {
            osc.frequency.setValueAtTime(140, time);
            osc.frequency.exponentialRampToValueAtTime(35, time + 0.12);
            osc.type = 'sine';
            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.14);
            osc.start();
            osc.stop(time + 0.15);
          } else {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(2200, time);
            osc.frequency.exponentialRampToValueAtTime(450, time + 0.08);
            gain.gain.setValueAtTime(0.05, time);
            gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.09);
            osc.start();
            osc.stop(time + 0.1);
          }
          break;

        case 'ferrari':
          const engineBase = 110 + (tickCount % 6) * 35;
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(engineBase, time);
          osc.frequency.linearRampToValueAtTime(engineBase * 1.9, time + 0.1);
          gain.gain.setValueAtTime(0.06, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.11);
          osc.start();
          osc.stop(time + 0.12);
          break;

        case 'swimming':
          const bubblePitch = 550 + Math.random() * 300;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(bubblePitch, time);
          osc.frequency.exponentialRampToValueAtTime(bubblePitch * 1.5, time + 0.25);
          gain.gain.setValueAtTime(0.03, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.26);
          osc.start();
          osc.stop(time + 0.28);
          break;

        case 'flexing':
          const activeChord = [261.63, 311.13, 392.00, 466.16]; // C minor 7 shiny
          const chordNote = activeChord[tickCount % activeChord.length];
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(chordNote, time);
          gain.gain.setValueAtTime(0.05, time);
          gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.4);
          osc.start();
          osc.stop(time + 0.42);
          break;
      }
      tickCount = (tickCount + 1) % 12;
    };

    this.intervalId = window.setInterval(playTick, loopDelay);
  }

  public triggerWoodThrow() {
    if (!this.ctx || !this.isRunning || !this.masterGain) return;
    
    try {
      const time = this.ctx.currentTime;

      // 1. Wood crack sound
      const snapOsc = this.ctx.createOscillator();
      const snapGain = this.ctx.createGain();
      snapOsc.type = 'triangle';
      snapOsc.frequency.setValueAtTime(1400 + Math.random() * 800, time);
      snapOsc.frequency.exponentialRampToValueAtTime(300, time + 0.05);

      snapGain.gain.setValueAtTime(0.08, time);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

      snapOsc.connect(snapGain);
      snapGain.connect(this.masterGain);
      snapOsc.start(time);
      snapOsc.stop(time + 0.06);

      // 2. Flame WHOOSH poof sound (low frequency expand)
      const whooshOsc = this.ctx.createOscillator();
      const whooshGain = this.ctx.createGain();
      whooshOsc.type = 'sine';
      whooshOsc.frequency.setValueAtTime(160, time);
      whooshOsc.frequency.exponentialRampToValueAtTime(45, time + 0.35);

      whooshGain.gain.setValueAtTime(0.14, time);
      whooshGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.35);

      whooshOsc.connect(whooshGain);
      whooshGain.connect(this.masterGain);
      whooshOsc.start(time);
      whooshOsc.stop(time + 0.4);
    } catch (e) {
      console.warn('Failed to trigger wood sound', e);
    }
  }

  public triggerChopWood() {
    if (!this.ctx || !this.isRunning || !this.masterGain) return;
    try {
      const time = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1800, time);
      osc.frequency.exponentialRampToValueAtTime(320, time + 0.07);
      
      const biquad = this.ctx.createBiquadFilter();
      biquad.type = 'bandpass';
      biquad.frequency.setValueAtTime(1100, time);
      biquad.Q.setValueAtTime(4.5, time);
      
      osc.connect(biquad);
      biquad.connect(gain);
      gain.connect(this.masterGain);

      gain.gain.setValueAtTime(0.07, time);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.08);

      osc.start();
      osc.stop(time + 0.09);
    } catch (e) {
      console.warn('Failed to play chop sound', e);
    }
  }
}

export const bushSynth = new BushSynthEngine();
