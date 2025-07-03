# Self-Healing Development System

The Thomas.design portfolio includes an innovative self-healing development system that automatically detects and fixes common development issues, reducing friction and improving developer experience.

## Overview

The self-healing system is a comprehensive solution that monitors your development environment in real-time, detects issues before they become problems, and automatically applies fixes when possible. It's like having a DevOps engineer built into your development workflow.

## Key Features

### 🔍 Automatic Issue Detection
The system continuously monitors for:
- **Hexo Warehouse Errors**: Duplicate asset IDs that cause build failures
- **Port Conflicts**: Processes blocking port 4000
- **Missing Dependencies**: Uninstalled node modules
- **Memory Issues**: High memory usage that could cause crashes
- **Cache Problems**: Stale or corrupted build caches
- **Missing Builds**: Demo assets not copied to theme directory
- **Style Issues**: Dark mode visibility problems
- **Content Issues**: Broken image paths in posts

### 🔧 Auto-Fix Capabilities
When issues are detected, the system can automatically:
- Clean and rebuild Hexo database
- Kill zombie processes blocking ports
- Install missing dependencies
- Clear corrupted caches
- Trigger garbage collection for memory management
- Rebuild missing demo assets
- Update CSS for better visibility
- Restart servers after critical errors

### 📊 Health Monitoring
Real-time monitoring includes:
- System health status
- Memory usage tracking
- Build performance metrics
- Active issue tracking
- Fix history
- Server status monitoring

## Commands

### Basic Commands

```bash
# Start development with self-healing
npm run dev

# Check system health
npm run doctor

# Apply automatic fixes
npm run fix

# Open health dashboard (requires additional packages)
npm run health
```

### Advanced Commands

```bash
# Continuous monitoring mode
node build-system/self-healing-cli.js monitor

# Generate detailed health report
node build-system/self-healing-cli.js report

# Check specific subsystems
node build-system/self-healing-cli.js check
```

## How It Works

### 1. Health Check Process
When you run `npm run doctor`, the system:
```javascript
// Checks multiple subsystems in parallel
- Hexo database integrity
- Port availability
- Demo build status
- Memory usage
- Dependency installation
- Cache validity
- CSS/style issues
```

### 2. Issue Detection
Issues are categorized by:
- **Type**: What kind of issue (warehouse, port, memory, etc.)
- **Severity**: How critical the issue is
- **Auto-fixable**: Whether it can be fixed automatically

### 3. Auto-Fix Process
When you run `npm run fix`:
1. Runs health checks to identify issues
2. Applies fixes for auto-fixable issues
3. Reports on fixes applied
4. Lists any remaining manual fixes needed

### 4. Continuous Monitoring
During `npm run dev`, the system:
- Monitors Hexo server output for errors
- Watches memory usage
- Detects warehouse errors in real-time
- Automatically restarts services when needed

## Common Scenarios

### Scenario 1: Hexo Warehouse Errors
```bash
# Error: WarehouseError: ID `...` has been used
# The system will:
1. Detect the error automatically
2. Kill the current server
3. Run `hexo clean`
4. Restart the server
5. Continue development without interruption
```

### Scenario 2: Port Already in Use
```bash
# Error: Port 4000 already in use
# Running `npm run fix` will:
1. Find the process using port 4000
2. Kill the process
3. Free up the port
4. Allow normal server startup
```

### Scenario 3: High Memory Usage
```bash
# When memory usage exceeds 800MB:
1. System triggers garbage collection
2. Monitors for improvement
3. Suggests restart if needed
4. Prevents out-of-memory crashes
```

## Health Dashboard

The interactive health dashboard (`npm run health`) provides:

### Terminal UI Features
- **System Status Panel**: Overall health indicator
- **Memory Graph**: Real-time memory usage visualization
- **Build Performance**: Recent build times
- **Active Issues**: List of current problems
- **Recent Fixes**: History of applied fixes
- **Server Status**: Which services are running
- **File Watchers**: Active file monitoring

### Quick Actions
Press keys for instant actions:
- `c` - Clean Hexo database
- `b` - Build everything
- `f` - Fix all issues
- `r` - Restart services
- `d` - Deploy to production
- `q` - Quit dashboard

## Installation

### Core System
The self-healing system is included by default. No additional installation needed for basic features.

### Dashboard Dependencies
For the interactive dashboard, install:
```bash
npm install blessed blessed-contrib cli-table3 ora
```

## Configuration

### Environment Variables
```bash
# Disable auto-fix in production
SELF_HEALING_AUTO_FIX=false

# Change health check interval (ms)
HEALTH_CHECK_INTERVAL=30000

# Set memory threshold (MB)
MEMORY_THRESHOLD=1000
```

### Custom Health Checks
Add custom checks in `build-system/self-healing-manager.js`:
```javascript
async checkCustomCondition() {
  console.log(chalk.gray('  Checking custom condition...'));
  
  // Your custom logic here
  if (conditionFails) {
    this.issuesDetected.push({
      type: 'custom-issue',
      message: 'Custom condition failed',
      autoFix: true
    });
  }
}
```

## Troubleshooting

### Dashboard Won't Start
```bash
# Install required dependencies
npm install blessed blessed-contrib cli-table3 ora

# Check Node.js version (requires 14+)
node --version
```

### Auto-Fix Not Working
```bash
# Run with verbose output
npm run fix -- --verbose

# Check permissions
sudo npm run fix  # Not recommended, but may help diagnose
```

### False Positives
If the system reports issues that aren't real:
```bash
# Clear health check cache
rm -rf .health-reports

# Reset monitoring state
npm run build:clear-cache
```

## Best Practices

### 1. Regular Health Checks
Run `npm run doctor` periodically, especially:
- After pulling new changes
- Before important deploys
- When experiencing weird issues

### 2. Trust Auto-Fix
The auto-fix system is conservative and safe:
- Only fixes known, safe issues
- Always backs up before major changes
- Reports what it changed

### 3. Monitor Patterns
Check health reports to identify:
- Recurring issues
- Performance degradation
- Environmental problems

### 4. Contribute Fixes
If you encounter new issues:
1. Add detection logic
2. Implement safe fix
3. Test thoroughly
4. Submit PR

## Architecture

### Components

1. **SelfHealingManager** (`self-healing-manager.js`)
   - Core health check logic
   - Issue detection algorithms
   - Fix implementation

2. **DevCommand Integration** (`dev-command.js`)
   - Real-time monitoring
   - Auto-restart logic
   - Error interception

3. **CLI Interface** (`self-healing-cli.js`)
   - Command-line interface
   - Pretty output formatting
   - User interaction

4. **Health Dashboard** (`health-dashboard.js`)
   - Terminal UI
   - Real-time updates
   - Interactive controls

### Data Flow
```
User Command → Health Checks → Issue Detection → Auto-Fix → Verification
                    ↑                                          ↓
                    └──────────── Continuous Monitoring ←──────┘
```

## Future Enhancements

Planned improvements:
- [ ] Machine learning for issue prediction
- [ ] Automatic dependency updates
- [ ] Performance optimization suggestions
- [ ] Integration with CI/CD pipelines
- [ ] Web-based dashboard option
- [ ] Issue pattern analysis
- [ ] Proactive issue prevention

## Contributing

To add new health checks or fixes:

1. Add detection logic to `checkYourIssue()` method
2. Implement fix in `fixIssue()` switch statement
3. Add tests for both detection and fix
4. Update documentation
5. Submit pull request

Remember: The goal is to make development as frictionless as possible while maintaining system stability.