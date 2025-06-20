/**
 * Sound Effects Module for San Diego Theme
 * Refactored to use the SD namespace pattern
 */
(function(SD) {
  'use strict';

  class SoundEffectsModule {
    constructor() {
      this.sounds = new Map();
      this.enabled = true;
      this.volume = 0.5;
      this.initialized = false;
    }

    init() {
      if (this.initialized) return;

      // Load user preferences
      const soundPref = localStorage.getItem('sound-effects-enabled');
      this.enabled = soundPref !== null ? soundPref === 'true' : true;

      const volumePref = localStorage.getItem('sound-effects-volume');
      this.volume = volumePref !== null ? parseFloat(volumePref) : 0.5;

      // Preload common sounds
      this.preloadCommonSounds();
      
      this.initialized = true;
      SD.events.emit('sound-effects:initialized');
    }

    loadSound(name, basePath, formats = ['mp3', 'ogg', 'm4a']) {
      const audio = new Audio();

      // Test which format is supported
      for (const format of formats) {
        const canPlay = audio.canPlayType(`audio/${format === 'm4a' ? 'mp4' : format}`);
        if (canPlay === 'probably' || canPlay === 'maybe') {
          audio.src = `${basePath}.${format}`;
          break;
        }
      }

      // If no format was explicitly supported, default to mp3
      if (!audio.src) {
        audio.src = `${basePath}.mp3`;
      }

      audio.preload = 'auto';
      audio.volume = this.volume;

      // Handle loading errors gracefully
      audio.addEventListener('error', (e) => {
        // Failed to load sound - silently continue
      });

      this.sounds.set(name, audio);
      return audio;
    }

    play(name, volume = null) {
      if (!this.enabled) return;

      const sound = this.sounds.get(name);
      if (!sound) {
        return;
      }

      try {
        // Reset to beginning in case it was played recently
        sound.currentTime = 0;

        // Set volume
        sound.volume = volume !== null ? volume : this.volume;

        // Play the sound
        const playPromise = sound.play();

        // Handle play promise for browsers that support it
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            // Sound play prevented - silently continue
          });
        }
      } catch (error) {
        // Error playing sound - silently continue
      }
    }

    setEnabled(enabled) {
      this.enabled = enabled;
      localStorage.setItem('sound-effects-enabled', enabled.toString());
      SD.events.emit('sound-effects:toggle', { enabled });
    }

    setVolume(volume) {
      this.volume = Math.max(0, Math.min(1, volume));
      localStorage.setItem('sound-effects-volume', this.volume.toString());

      // Update volume for all loaded sounds
      this.sounds.forEach(sound => {
        sound.volume = this.volume;
      });
      
      SD.events.emit('sound-effects:volume-change', { volume: this.volume });
    }

    isEnabled() {
      return this.enabled;
    }

    getVolume() {
      return this.volume;
    }

    preloadCommonSounds() {
      // Load toggle sound with multiple format fallbacks
      this.loadSound('toggle', '/media/toggleSound', ['mp3', 'ogg', 'm4a']);
      
      // Load button press sounds
      this.loadSound('buttonDown', '/media/button-press-down', ['mp3', 'm4a']);
      this.loadSound('buttonUp', '/media/button-press-up', ['mp3', 'm4a']);
      this.loadSound('smallClick', '/media/smallClick', ['mp3']);
      
      // Load slider sound for tab switching
      this.loadSound('slider', '/media/slider', ['mp3']);
    }

    // Convenience methods for common sounds
    playButton() {
      this.play('smallClick');
    }

    playSmallClick() {
      this.play('smallClick');
    }

    playToggle() {
      this.play('toggle');
    }

    playSlider() {
      this.play('slider');
    }

    playButtonDown() {
      this.play('buttonDown');
    }

    playButtonUp() {
      this.play('buttonUp');
    }
  }

  // Create and register the module
  const soundEffectsModule = new SoundEffectsModule();
  
  // Register with SD namespace
  SD.utils.sound = soundEffectsModule;
  SD.registerModule('sound-effects', soundEffectsModule);

})(window.SD || (window.SD = {}));