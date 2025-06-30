# New Build System 🚀

This is the new intelligent build orchestrator with self-healing capabilities that replaces the old collection of scripts.

## Quick Start

```bash
# Development (fast, watches for changes, auto-fixes issues)
npm run dev

# Testing (thorough, before commits, builds demos)
npm run test

# Check system health
npm run doctor

# Auto-fix detected issues
npm run fix

# Interactive health dashboard
npm run health
```

## Key Features

- **Self-Healing**: Automatically detects and fixes common issues
- **Smart Caching**: Only rebuilds what changed
- **Parallel Execution**: Builds multiple demos at once  
- **File Watching**: Automatically rebuilds on changes
- **Health Monitoring**: Real-time system health dashboard
- **Auto-Recovery**: Restarts servers when errors detected
- **Progress Tracking**: Can resume from failures
- **Clear Feedback**: Know exactly what's happening

## Commands

### Main Commands
- `npm run dev` - Start development mode with self-healing
- `npm run test` - Run comprehensive tests
- `npm run doctor` - Check system health
- `npm run fix` - Apply automatic fixes
- `npm run health` - Open interactive dashboard

### Utility Commands  
- `npm run build:status` - Check what's built/cached
- `npm run build:clear-cache` - Start fresh (like hexo clean but smarter)
- `npm run build:install-deps` - Install all demo dependencies
- `npm run build:all` - Build everything from scratch

### Legacy Commands (still available)
- `npm run dev:legacy` - Old development mode
- `npm run test:legacy` - Old test suite

## What Changed

### Before (your old workflow):
```bash
npx hexo clean && npm run install:demos && npm run test:quick && npm run server
# ⏱️ ~2-3 minutes, rebuilds everything
```

### After (new workflow):
```bash
npm run dev
# ⏱️ ~10-20 seconds, only rebuilds what changed
```

## Architecture

```
build-system/
├── BuildManager.js     # Core orchestrator with caching
├── dev-command.js      # Fast development mode
├── test-command.js     # Comprehensive testing
├── build-utils.js      # Utility commands
└── README.md          # This file
```

## Cache System

The build system creates a `.build-cache/` directory to remember:
- File hashes (what changed)
- Build progress (where we left off)
- Timestamps (when things were built)

This allows for intelligent rebuilding and recovery from failures.

## Development Mode Features

- **Demo Building**: Automatically builds all demos before starting
- **File Watching**: Automatically rebuilds when you save files
- **Selective Building**: Only rebuilds the demo you changed
- **Quick Startup**: Skips validation for speed
- **Live Reloading**: Hexo server handles browser refresh

## Test Mode Features

- **Full Validation**: Checks demos, content, dependencies
- **Build Integrity**: Ensures everything builds correctly
- **Parallel Testing**: Runs multiple checks simultaneously
- **Detailed Reporting**: Clear pass/fail status with timing

## Troubleshooting

### If something seems wrong:
```bash
npm run build:status        # Check what's happening
npm run build:clear-cache   # Start fresh
```

### If you want the old behavior:
```bash
npm run dev:legacy          # Old development mode
npm run test:legacy         # Old test suite
```

### If you need to debug:
```bash
npm run dev -- --verbose    # Show detailed output
npm run test -- --verbose   # Show detailed test output
```

## Migration Notes

- Your old commands still work (renamed with `:legacy`)
- Cache directory is gitignored automatically
- No breaking changes to your content or demos
- Can switch back to old system anytime

The new system should be **10x faster** for typical development and much more reliable overall.

## Self-Healing Innovations 🏥

### Automatic Issue Detection
The system continuously monitors for common issues:
- **Hexo Warehouse Errors**: Duplicate asset IDs
- **Port Conflicts**: Port 4000 already in use
- **Missing Dependencies**: Node modules not installed
- **Stale Cache**: Build cache older than 7 days
- **High Memory Usage**: Automatic garbage collection
- **Missing Demo Builds**: Demos not copied to theme
- **Dark Mode Issues**: CSS visibility problems
- **Broken Image Paths**: Date-based paths in posts

### Auto-Fix Capabilities
When issues are detected, the system can automatically:
- Clean and rebuild Hexo database
- Kill processes blocking ports
- Install missing dependencies
- Clear corrupted caches
- Trigger garbage collection
- Rebuild missing demos
- Update CSS for visibility
- Restart servers on critical errors

### Health Dashboard
Run `npm run health` to open an interactive terminal dashboard showing:
- Real-time system status
- Memory usage graphs
- Build performance metrics
- Active issues and recent fixes
- Server and watcher status
- Quick action shortcuts

### Continuous Monitoring
The dev server includes built-in monitoring that:
- Detects warehouse errors and auto-restarts
- Monitors memory usage and prevents crashes
- Tracks build times and performance
- Generates health reports for debugging

### Usage Examples

```bash
# Check what's wrong
npm run doctor

# Fix everything automatically
npm run fix

# Monitor continuously
node build-system/self-healing-cli.js monitor

# Generate health report
node build-system/self-healing-cli.js report
```

This self-healing system makes development more resilient and reduces the "it works on my machine" problems by automatically detecting and fixing environment issues.