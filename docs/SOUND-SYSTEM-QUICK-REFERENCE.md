# Sound System Quick Reference

## 🔊 Playing Sounds - Quick Examples

### Most Common Use Cases

```javascript
// Button clicks (View impact report, Demo button, Read story)
if (window.playButtonSound) {
    window.playButtonSound();
}

// Small UI elements (demo controls, tiny buttons)
if (window.playSmallClickSound) {
    window.playSmallClickSound();
}

// Post/blog links
if (window.playBookSound) {
    window.playBookSound();
}

// Toggle switches
if (window.playToggleSound) {
    window.playToggleSound();
}

// Sliders
if (window.playSliderSound) {
    window.playSliderSound();
}
```

## 🎯 Current Sound Implementations

### Blog & Posts
- **Post preview cards** → Book sound
  - `post-list-item`
  - `post-long` 
  - `post-preview-card`
  - File: `/themes/san-diego/source/js/blog.js` (line ~663)

### Project Pages
- **Demo button** → Button sound (small click)
  - File: `/themes/san-diego/source/js/project-demo.js` (line ~33)
- **Read more** → Button sound (small click)
  - Dynamic version: `/themes/san-diego/source/js/blog.js` (line ~585)
  - Standalone version: `/themes/san-diego/layout/project_gallery.ejs` (line ~322)

### Demo Controls
All use tiny button sound (`playSmallClickSound`):
- **Minimize button** (line ~228)
- **Exit Fullscreen button** (line ~210) 
- **Fullscreen button** (line ~325)
- **Zoom in/out buttons** (line ~373)
- File: `/themes/san-diego/source/js/project-demo.js`

### UI Components
- **Code sandbox toggle** → Small click sound
  - Click handler: line ~60
  - Keyboard handler: line ~71
  - File: `/themes/san-diego/source/js/code-sandbox.js`

- **View impact report** → Button sound (small click)
  - File: `/themes/san-diego/source/js/main.js` (line ~139)

## 🔧 Adding Sounds to New Components

### Step 1: Choose the Right Sound
```javascript
// For standard buttons and links
window.playButtonSound();

// For small UI controls
window.playSmallClickSound();

// For content/navigation
window.playBookSound();

// For toggles/switches
window.playToggleSound();
```

### Step 2: Implement with Safety Check
```javascript
button.addEventListener('click', function(e) {
    // Always check if function exists
    if (window.playButtonSound) {
        window.playButtonSound();
    }
    // ... rest of your click handler
});
```

### Step 3: Consider Keyboard Accessibility
```javascript
element.addEventListener('keydown', function(e) {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        // Play same sound as click
        if (window.playButtonSound) {
            window.playButtonSound();
        }
        // ... rest of handler
    }
});
```

## 📁 Key Files

- **Service**: `/themes/san-diego/source/js/services/sound-service.js`
- **Registry**: `/themes/san-diego/source/js/services/sound-registry.js`
- **Compatibility**: `/themes/san-diego/source/js/services/sound-compatibility.js`
- **Audio Files**: `/themes/san-diego/source/media/`

## 🐛 Debugging

```javascript
// Check if sounds are enabled
console.log(window.soundService.enabled);

// Check volume
console.log(window.soundService.volume);

// Test a sound directly
window.soundService.play('button');

// See all available sounds
console.log(window.soundService.getAvailableSounds());
```

## ⚡ Quick Tips

1. **Use the compatibility layer** - Don't import the service directly unless needed
2. **Always check for function existence** - Prevents errors if sounds fail to load
3. **Match sound to UI element size** - Small clicks for tiny buttons, button sound for standard buttons
4. **Be consistent** - Similar UI elements should use the same sound
5. **Test with sounds disabled** - Ensure UI still works without audio

---

*For detailed architecture and implementation details, see [SOUND-SYSTEM-ARCHITECTURE.md](./SOUND-SYSTEM-ARCHITECTURE.md)*
