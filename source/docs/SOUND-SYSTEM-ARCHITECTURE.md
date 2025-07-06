# Sound System Architecture

## Overview

The portfolio website uses a centralized sound service architecture that provides lazy loading, caching, cross-browser compatibility, and backward compatibility with legacy implementations.

## Core Components

### 1. Sound Service (`/themes/san-diego/source/js/services/sound-service.js`)

The main service that handles all sound playback functionality:

- **Singleton Pattern**: Ensures only one instance exists across the application
- **Lazy Loading**: Sounds are loaded on-demand to improve initial page load
- **Caching**: Loaded sounds are cached to prevent redundant downloads
- **Cross-browser Support**: Detects and uses supported audio formats (mp3, ogg, m4a, wav, webm)
- **Autoplay Detection**: Gracefully handles browser autoplay restrictions
- **Volume Control**: Global and per-sound volume settings
- **LocalStorage Persistence**: User preferences are saved and synced across tabs

Key methods:
- `play(name, options)` - Play a sound by registry key
- `preload(names)` - Preload multiple sounds for better performance
- `setEnabled(enabled)` - Enable/disable all sounds
- `setVolume(volume)` - Set global volume (0-1)
- `registerSound(key, config, category)` - Dynamically register new sounds

### 2. Sound Registry (`/themes/san-diego/source/js/services/sound-registry.js`)

Centralized configuration for all sounds in the application:

```javascript
const SoundRegistry = {
    ui: {
        button: {
            name: 'Button Click',
            category: 'ui',
            formats: {
                mp3: '/media/button-press-down.mp3',
                m4a: '/media/button-press-down.m4a'
            },
            volume: 0.6,
            preload: true
        },
        smallClick: {
            name: 'Small Click',
            category: 'ui',
            formats: {
                mp3: '/media/smallClick.mp3'
            },
            volume: 0.5,
            preload: true
        },
        // ... more sounds
    }
}
```

Categories:
- **ui**: Interface sounds (buttons, toggles, sliders)
- **navigation**: Page transitions and navigation sounds
- **ambient**: Background and atmospheric sounds

### 3. Compatibility Layer (`/themes/san-diego/source/js/services/sound-compatibility.js`)

Maintains backward compatibility with the legacy sound-effects.js implementation:

- Wraps the new SoundService with the old API
- Maps legacy sound names to registry keys
- Provides global functions: `playButtonSound()`, `playBookSound()`, etc.
- Shows migration notices in development mode

### 4. Sound Loader (`/themes/san-diego/source/js/services/sound-loader.js`)

Drop-in replacement for the old sound-effects.js that loads the new system:

- Detects browser capabilities (dynamic imports vs script tags)
- Loads the sound system asynchronously
- Provides stub functions if loading fails
- Ensures the site doesn't break without sounds

## Sound Mappings

### UI Sounds

| Function | Registry Key | Usage |
|----------|-------------|-------|
| `playButtonSound()` | `smallClick` | General button clicks, "View impact report" |
| `playSmallClickSound()` | `smallClick` | Tiny UI buttons, demo controls |
| `playToggleSound()` | `toggle` | Toggle switches, checkboxes |
| `playSliderSound()` | `slider` | Slider movements |
| `playBookSound()` | `book` | Post preview cards, blog links |

### Current Sound Implementations

1. **Post Preview Cards** (`blog.js`)
   - Plays book sound when clicking post-list-item, post-long, or post-preview-card

2. **Code Sandbox Toggle** (`code-sandbox.js`)
   - Plays small click sound when toggling code sandbox on/off

3. **Demo Buttons** (`project-demo.js`)
   - Demo button: plays button sound (same as View impact report)
   - Read the full story: plays button sound
   - Black demo controls: play tiny button sound (Minimize, Exit Fullscreen, Zoom, Fullscreen)

4. **Impact Report** (`main.js`)
   - View impact report button: plays button sound

## Migration Guide

### From Legacy sound-effects.js

Old way:
```javascript
if (window.soundEffects) {
    window.soundEffects.play('toggle');
}
```

New way (direct):
```javascript
import SoundService from './services/sound-service.js';
const soundService = new SoundService();
soundService.play('toggle');
```

Or use global functions (backward compatible):
```javascript
if (window.playToggleSound) {
    window.playToggleSound();
}
```

### Adding New Sounds

1. Add to Sound Registry:
```javascript
// In sound-registry.js
newSound: {
    name: 'New Sound Effect',
    category: 'ui',
    formats: {
        mp3: '/media/new-sound.mp3',
        m4a: '/media/new-sound.m4a'
    },
    volume: 0.7,
    preload: false
}
```

2. Use in your code:
```javascript
// Using the service
soundService.play('newSound');

// Or create a global function
window.playNewSound = function() {
    soundService.play('newSound');
};
```

## Best Practices

1. **Always Check for Availability**
   ```javascript
   if (window.playButtonSound) {
       window.playButtonSound();
   }
   ```

2. **Use Appropriate Sounds**
   - Small UI elements: `playSmallClickSound()`
   - Standard buttons: `playButtonSound()`
   - Content interactions: `playBookSound()`

3. **Consider User Preferences**
   - Sounds can be disabled globally
   - Volume is user-adjustable
   - Settings persist across sessions

4. **Performance**
   - Preload critical sounds
   - Use lazy loading for occasional sounds
   - Reuse sound instances (handled automatically)

## Testing

### Manual Testing
1. Open browser console
2. Check `window.soundService` is available
3. Test individual sounds: `soundService.play('button')`
4. Verify volume control: `soundService.setVolume(0.5)`
5. Test enable/disable: `soundService.setEnabled(false)`

### Test Pages
- `/themes/san-diego/source/js/services/sound-service-test.html` - Core service testing
- `/themes/san-diego/source/js/services/sound-compatibility-test.html` - Compatibility layer testing

## Troubleshooting

### Common Issues

1. **No Sound Playing**
   - Check browser autoplay policies
   - Verify sounds are enabled: `soundService.enabled`
   - Check console for errors
   - Ensure user has interacted with page first

2. **Sound Not Found**
   - Verify sound exists in registry
   - Check file paths are correct
   - Ensure audio files exist in `/media/` directory

3. **Performance Issues**
   - Reduce concurrent sounds
   - Lower quality/bitrate of audio files
   - Use `preload: false` for rarely used sounds

## Future Enhancements

1. **Sound Variants System**
   - Multiple variations of same sound to prevent repetition
   - Similar to Counter-Strike walk cycle sounds

2. **Material/Size Grid Demo**
   - Interactive demo showing different button materials and sizes
   - Each combination plays unique sound variant

3. **Web Audio API**
   - Advanced audio processing
   - Real-time effects
   - Better performance for complex soundscapes

4. **Analytics Integration**
   - Track which sounds are most used
   - Monitor performance impact
   - A/B testing different sound designs

## File Structure

```
themes/san-diego/source/
├── js/
│   ├── services/
│   │   ├── sound-service.js          # Core service
│   │   ├── sound-registry.js         # Sound configurations
│   │   ├── sound-compatibility.js    # Backward compatibility
│   │   ├── sound-loader.js          # Async loader
│   │   ├── sound-service-test.html  # Service test page
│   │   └── sound-compatibility-test.html # Compatibility test
│   └── sound-effects.js             # Legacy (deprecated)
└── media/
    ├── button-press-down.mp3/m4a
    ├── button-press-up.mp3/m4a
    ├── smallClick.mp3
    ├── toggleSound.mp3/m4a/ogg
    ├── slider.mp3
    └── book.mp3/m4a
```

## Implementation Timeline

1. **Phase 1** ✅ - Core service implementation
2. **Phase 2** ✅ - Sound registry and configuration
3. **Phase 3** ✅ - Backward compatibility layer
4. **Phase 4** ✅ - Initial component migrations (post links, code sandbox)
5. **Phase 5** (Future) - Complete migration of all components
6. **Phase 6** (Future) - Remove legacy sound-effects.js
7. **Phase 7** (Future) - Advanced features (variants, Web Audio API)

---

Last Updated: January 2025
Architecture Version: 1.0.0