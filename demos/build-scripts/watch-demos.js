#!/usr/bin/env node

/**
 * Watch Demos Script
 * 
 * Development server for demos with hot reloading.
 * Starts development servers for all demos simultaneously.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const DEMOS_DIR = path.join(__dirname, '..');

function log(demoName, message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] [${demoName}] ${message}`);
}

function getDemoDirectories() {
    const entries = fs.readdirSync(DEMOS_DIR, { withFileTypes: true });
    return entries
        .filter(entry => entry.isDirectory() && entry.name !== 'build-scripts' && entry.name !== 'examples')
        .map(entry => entry.name);
}

function startDemoDevServer(demoName, port) {
    const demoPath = path.join(DEMOS_DIR, demoName);
    const packageJsonPath = path.join(demoPath, 'package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
        log(demoName, 'No package.json found, skipping...');
        return null;
    }

    try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        
        if (!packageJson.scripts || !packageJson.scripts.dev) {
            log(demoName, 'No "dev" script found in package.json, skipping...');
            return null;
        }

        log(demoName, `Starting development server on port ${port}...`);
        
        const child = spawn('npm', ['run', 'dev'], {
            cwd: demoPath,
            stdio: 'pipe',
            env: { ...process.env, PORT: port.toString() }
        });

        child.stdout.on('data', (data) => {
            const output = data.toString().trim();
            if (output) {
                log(demoName, output);
            }
        });

        child.stderr.on('data', (data) => {
            const output = data.toString().trim();
            if (output) {
                log(demoName, `ERROR: ${output}`);
            }
        });

        child.on('close', (code) => {
            log(demoName, `Development server exited with code ${code}`);
        });

        return child;

    } catch (error) {
        log(demoName, `Failed to start dev server: ${error.message}`);
        return null;
    }
}

function main() {
    console.log('🚀 Starting demo development servers...\n');
    
    const demos = getDemoDirectories();
    
    if (demos.length === 0) {
        console.log('ℹ️  No demo projects found in demos/ directory');
        return;
    }
    
    console.log(`📁 Found ${demos.length} demo project(s): ${demos.join(', ')}\n`);
    
    const processes = [];
    let basePort = 3001;
    
    // Start dev server for each demo
    demos.forEach((demo, index) => {
        const port = basePort + index;
        const process = startDemoDevServer(demo, port);
        if (process) {
            processes.push({ name: demo, process, port });
        }
    });
    
    if (processes.length === 0) {
        console.log('❌ No development servers could be started');
        return;
    }
    
    console.log('\n📊 Development Servers:');
    processes.forEach(({ name, port }) => {
        console.log(`   ${name}: http://localhost:${port}`);
    });
    
    console.log('\n✨ Press Ctrl+C to stop all servers\n');
    
    // Handle cleanup on exit
    process.on('SIGINT', () => {
        console.log('\n🛑 Stopping all development servers...');
        processes.forEach(({ name, process }) => {
            log(name, 'Stopping...');
            process.kill('SIGTERM');
        });
        setTimeout(() => process.exit(0), 1000);
    });
}

// Run the watch process
if (require.main === module) {
    main();
}