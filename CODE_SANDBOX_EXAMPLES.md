# Code Sandbox System Examples

The code sandbox system allows you to create reusable, interactive components that survive dynamic navigation.

## Basic Usage

In your post or page:

```html
<div data-sandbox-type="your-sandbox-name" 
     data-sandbox-config='{"option1": "value1", "option2": true}'>
  <!-- Sandbox will be initialized here -->
</div>
```

## Creating a New Sandbox Type

Add to `/themes/san-diego/source/js/code-sandbox.js`:

```javascript
CodeSandbox.registerType('your-sandbox-name', function(element, config) {
  // Initialize your sandbox
  element.innerHTML = '<div>Your sandbox content</div>';
  
  // Use this.addEventListener for automatic cleanup
  this.addEventListener(element, 'click', () => {
    console.log('Clicked!');
  });
  
  // Use this.setTimeout for automatic cleanup
  this.setTimeout(() => {
    console.log('Timer fired');
  }, 1000);
  
  // Store state in this.state
  this.state.myValue = 42;
  
}, function(element, state) {
  // Optional cleanup function
  console.log('Cleaning up sandbox');
});
```

## Built-in Sandbox Types

### 1. YouTube-SoundCloud Toggle

```html
<div data-sandbox-type="youtube-soundcloud"></div>
```

Shows a toggle between YouTube and SoundCloud platforms.

### 2. Counter Demo

```html
<div data-sandbox-type="counter" 
     data-sandbox-config='{"start": 10}'>
</div>
```

Simple counter with increment/decrement buttons.

### 3. YouTube Timecode Comments

```html
<div data-sandbox-type="youtube-timecode" 
     data-sandbox-config='{"autoplay": true, "startTime": 5}'>
</div>
```

Full YouTube player simulation with timeline comments.

## Key Features

1. **Automatic Cleanup**: Event listeners, timeouts, and intervals are automatically cleaned up
2. **State Management**: Sandboxes maintain their state across dynamic navigation
3. **Isolation**: Each sandbox is self-contained and won't interfere with others
4. **Sound Integration**: Works with the site's sound effects system

## Example: Creating a Simple Timer Sandbox

```javascript
CodeSandbox.registerType('timer', function(element, config) {
  this.state.seconds = config.startTime || 0;
  
  element.innerHTML = `
    <div class="timer-demo">
      <h3>Timer: <span class="time">0</span>s</h3>
      <button class="start">Start</button>
      <button class="stop">Stop</button>
      <button class="reset">Reset</button>
    </div>
  `;
  
  const timeSpan = element.querySelector('.time');
  const startBtn = element.querySelector('.start');
  const stopBtn = element.querySelector('.stop');
  const resetBtn = element.querySelector('.reset');
  
  const updateDisplay = () => {
    timeSpan.textContent = this.state.seconds;
  };
  
  this.addEventListener(startBtn, 'click', () => {
    if (!this.state.intervalId) {
      this.state.intervalId = this.setInterval(() => {
        this.state.seconds++;
        updateDisplay();
      }, 1000);
    }
  });
  
  this.addEventListener(stopBtn, 'click', () => {
    if (this.state.intervalId) {
      clearInterval(this.state.intervalId);
      this.state.intervalId = null;
    }
  });
  
  this.addEventListener(resetBtn, 'click', () => {
    this.state.seconds = 0;
    updateDisplay();
  });
  
  updateDisplay();
});
```

Then use it in a post:

```html
<div data-sandbox-type="timer" 
     data-sandbox-config='{"startTime": 0}'>
</div>
```

## Integration with Dynamic Navigation

The sandbox system is fully integrated with the blog's dynamic navigation:

1. When navigating away, sandboxes are cleaned up via `cleanupCodeSandboxes()`
2. When content loads, sandboxes are initialized via `initializeCodeSandboxes()`
3. State is preserved in the sandbox instance
4. Event listeners and timers are automatically managed

This ensures your interactive components work reliably even as users navigate dynamically through your site.