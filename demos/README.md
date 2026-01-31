# Demos Directory

This directory contains interactive demos for portfolio projects. Each demo is a self-contained application that can be embedded within project pages.

## Structure

```
demos/
├── build-scripts/          # Build and development scripts
│   ├── build-all-demos.js # Builds all demos for production
│   └── watch-demos.js     # Development server with hot reload
├── examples/              # Demo templates and examples
└── [project-demos]/       # Individual demo projects
```

## Creating a New Demo

1. **Create a new directory** for your demo:
   ```bash
   mkdir demos/my-project-demo
   cd demos/my-project-demo
   ```

2. **Initialize with package.json**:
   ```bash
   npm init -y
   ```

3. **Add required scripts** to package.json:
   ```json
   {
     "scripts": {
       "dev": "vite --port 3001",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

4. **Create your demo** in the `src/` directory

5. **Configure build output** to `dist/` directory

## Demo Requirements

Each demo must:

- Have a `package.json` with `build` and `dev` scripts
- Build output to a `dist/` directory
- Include an `index.html` as the entry point
- Be self-contained (no external dependencies at runtime)
- Work within an iframe context

## Integration with Blog

### Front Matter Configuration

Add demo configuration to your project's markdown file:

```yaml
---
title: "My Project"
demo_component: "my-project-demo"  # Directory name in demos/
demo_height: "500px"               # Optional: custom height
demo_fullscreen: true              # Optional: allow fullscreen
---
```

### Build Process

Demos are built automatically during the blog build:

```bash
# Development
npm run dev:demos    # Start all demo dev servers
npm run server       # Start blog dev server

# Production
npm run build        # Builds demos + blog
```

## Development Workflow

1. **Start demo development**:
   ```bash
   npm run dev:demos
   ```

2. **Start blog development** (separate terminal):
   ```bash
   npm run server
   ```

3. **Your demo will be available at**:
   - Development: `http://localhost:3001` (or next available port)
   - In blog: `http://localhost:4000/demos/my-project-demo/`

## Demo Templates

See `examples/` directory for starter templates:

- `react-demo-template/` - React + Vite setup

## Best Practices

### Performance
- Keep bundle sizes small
- Use lazy loading for heavy assets
- Optimize images and videos

### UX
- Include loading states
- Handle errors gracefully
- Make demos responsive
- Provide clear interactions

### Development
- Use TypeScript for complex demos
- Include README for each demo
- Test across different screen sizes
- Ensure demos work in iframe context

## Troubleshooting

### Demo not building
- Check that `package.json` has correct scripts
- Ensure build outputs to `dist/` directory
- Verify all dependencies are installed

### Demo not loading in blog
- Check browser console for errors
- Verify demo works in standalone mode
- Ensure no CORS issues with external resources

### Development server conflicts
- Each demo gets a different port automatically
- Check `watch-demos.js` output for assigned ports
- Kill existing processes if ports are in use
