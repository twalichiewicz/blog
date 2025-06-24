# Demo System Documentation

## Overview

The demo system allows you to create interactive demos for portfolio projects that load in place of the project trailer. Demos are self-contained applications that can be built with any technology stack and embedded as iframes.

## Quick Start

### 1. Create a Demo

```bash
# Copy the React template
cp -r demos/examples/react-demo-template demos/my-project-demo
cd demos/my-project-demo

# Install dependencies and customize
npm install
# Edit src/App.jsx with your demo content
npm run dev  # Test locally at http://localhost:3001
```

### 2. Add Demo to Project

Update your project's markdown front matter:

```yaml
---
title: "My Project"
demo_component: "my-project-demo"  # Must match your demo directory name
---
```

### 3. Build and Test

```bash
npm run build:demos  # Build all demos
npm run server      # Start blog server
```

Your demo will be available at `/demos/my-project-demo/` and accessible via the Demo button on your project page.

## Architecture

### Directory Structure

```
demos/
├── build-scripts/          # Build system
├── examples/               # Demo templates
├── my-project-demo/        # Your demo projects
│   ├── package.json
│   ├── src/
│   └── dist/              # Built output
└── README.md
```

### Build Process

1. **Development**: Each demo runs its own dev server
2. **Build**: `npm run build:demos` builds all demos to `dist/` folders
3. **Integration**: Built demos are copied to `themes/san-diego/source/demos/`
4. **Deployment**: Hexo includes demos in the static site

### Project Integration

1. **Template**: `project_gallery.ejs` checks for `demo_component` front matter
2. **Button**: Demo button appears if demo is configured
3. **Loading**: `project-demo.js` handles demo loading and UI
4. **Display**: Demo loads in `.project-demo-container` above content

## Front Matter Configuration

### Basic Demo

```yaml
demo_component: "my-demo"  # Directory name in /demos/
```

### Advanced Demo Options

```yaml
demo_component: "my-demo"
demo_height: "600px"        # Custom height (default: calc(90dvh - 24px))
demo_fullscreen: true       # Allow fullscreen (default: true)
```

### External Demo

```yaml
demo_url: "https://codepen.io/pen/abc123"  # Opens in new tab
```

## Creating Demos

### React Demo (Recommended)

```bash
cp -r demos/examples/react-demo-template demos/my-react-demo
cd demos/my-react-demo
npm install
```

Edit `src/App.jsx`:

```jsx
import React, { useState } from 'react'

function App() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>My Project Demo</h1>
      {/* Your demo content here */}
    </div>
  )
}

export default App
```

### Vanilla JavaScript Demo

```bash
mkdir demos/my-vanilla-demo
cd demos/my-vanilla-demo
```

Create `package.json`:

```json
{
  "name": "my-vanilla-demo",
  "scripts": {
    "dev": "python3 -m http.server 3001",
    "build": "mkdir -p dist && cp -r src/* dist/"
  }
}
```

Create `src/index.html`:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Demo</title>
    <style>/* Your styles */</style>
</head>
<body>
    <div id="app">
        <!-- Your demo content -->
    </div>
    <script>
        // Your demo JavaScript
    </script>
</body>
</html>
```

## Development Workflow

### Start All Demo Servers

```bash
npm run dev:demos
```

This starts development servers for all demos:
- Demo 1: http://localhost:3001
- Demo 2: http://localhost:3002
- etc.

### Start Blog Server

```bash
npm run server  # http://localhost:4000
```

### Build for Production

```bash
npm run build  # Builds demos + blog
```

## Best Practices

### Performance
- Keep bundle sizes under 1MB
- Optimize images and assets
- Use lazy loading for heavy content

### UX
- Include loading states
- Handle errors gracefully
- Make demos responsive
- Provide clear interaction cues

### Technical
- Use absolute paths for assets
- Test in iframe context
- Handle window resize events
- Ensure demos work without audio (autoplay restrictions)

### Content
- Focus on key interactions
- Keep demos simple and focused
- Include brief instructions
- Make the value proposition clear

## Troubleshooting

### Demo Not Building

1. Check `package.json` has correct scripts:
   ```json
   {
     "scripts": {
       "build": "your-build-command",
       "dev": "your-dev-command"
     }
   }
   ```

2. Ensure build outputs to `dist/` directory

3. Check build logs for errors:
   ```bash
   npm run build:demos
   ```

### Demo Not Loading

1. Check browser console for errors
2. Verify demo works in standalone mode: `/demos/my-demo/`
3. Check for CORS issues with external resources
4. Ensure iframe compatibility

### Build Script Issues

1. Check Node.js version (requires Node 14+)
2. Verify demo directory structure
3. Check file permissions
4. Ensure all dependencies are installed

## Examples

### Simple Counter Demo

```html
<!DOCTYPE html>
<html>
<head>
    <title>Counter Demo</title>
    <style>
        body { 
            font-family: system-ui; 
            text-align: center; 
            padding: 2rem; 
        }
        button { 
            padding: 1rem 2rem; 
            font-size: 18px; 
            margin: 0.5rem; 
        }
        .counter { 
            font-size: 4rem; 
            margin: 2rem 0; 
        }
    </style>
</head>
<body>
    <h1>Counter Demo</h1>
    <div class="counter" id="counter">0</div>
    <button onclick="increment()">+</button>
    <button onclick="decrement()">-</button>
    <script>
        let count = 0;
        function increment() { 
            count++; 
            update(); 
        }
        function decrement() { 
            count--; 
            update(); 
        }
        function update() { 
            document.getElementById('counter').textContent = count; 
        }
    </script>
</body>
</html>
```

### React Component Demo

```jsx
import React, { useState } from 'react'

function TodoDemo() {
  const [todos, setTodos] = useState([])
  const [input, setInput] = useState('')

  const addTodo = () => {
    if (input.trim()) {
      setTodos([...todos, { id: Date.now(), text: input, done: false }])
      setInput('')
    }
  }

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ))
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h2>Todo Demo</h2>
      <div style={{ display: 'flex', marginBottom: '1rem' }}>
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a todo..."
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={addTodo} style={{ padding: '0.5rem 1rem' }}>
          Add
        </button>
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {todos.map(todo => (
          <li key={todo.id} style={{ 
            padding: '0.5rem', 
            textDecoration: todo.done ? 'line-through' : 'none',
            cursor: 'pointer' 
          }} onClick={() => toggleTodo(todo.id)}>
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default TodoDemo
```

## Integration with Existing Projects

To add a demo to an existing project:

1. **Create the demo** following the patterns above
2. **Update project front matter** to include `demo_component`
3. **Build and test** the integration
4. **Deploy** as part of normal blog deployment

The demo button will automatically appear on the project page and load your demo when clicked.