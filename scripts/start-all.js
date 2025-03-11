const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Root directory
const rootDir = path.resolve(__dirname, '..');

// Define services to start
const services = [
  {
    name: 'Yahoo Finance Proxy',
    cwd: path.join(rootDir, 'packages/yahoo-proxy'),
    command: 'npm',
    args: ['run', 'dev'],
    port: 3001,
    color: '\x1b[33m' // Yellow
  },
  {
    name: 'Analysis Assistant',
    cwd: path.join(rootDir, 'packages/analysis-assistant'),
    command: 'npm',
    args: ['run', 'dev'],
    port: 3000,
    color: '\x1b[36m' // Cyan
  },
  {
    name: 'Client App',
    cwd: path.join(rootDir, 'packages/client'),
    command: 'npm',
    args: ['run', 'dev'],
    port: 5173,
    color: '\x1b[32m' // Green
  }
];

// Check if .env file exists for Analysis Assistant
const envPath = path.join(rootDir, 'packages/analysis-assistant/.env');
if (!fs.existsSync(envPath)) {
  // Copy from original location if it exists
  const originalEnvPath = path.join(rootDir, 'corp-analyst-app/.env');
  if (fs.existsSync(originalEnvPath)) {
    fs.copyFileSync(originalEnvPath, envPath);
    console.log('\x1b[32m%s\x1b[0m', '✓ Copied .env file to packages/analysis-assistant');
  } else {
    console.log('\x1b[31m%s\x1b[0m', '⚠ Warning: No .env file found for Analysis Assistant. Please create one with COHERE_API_KEY=your_api_key');
  }
}

// Function to check if a port is in use
function isPortInUse(port) {
  return new Promise((resolve) => {
    const net = require('net');
    const server = net.createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    
    server.listen(port);
  });
}

// Function to start a service
async function startService(service) {
  // Check if port is already in use
  const portInUse = await isPortInUse(service.port);
  if (portInUse) {
    console.log(`${service.color}%s\x1b[0m`, `⚠ ${service.name} port ${service.port} is already in use. Service may already be running.`);
    return null;
  }
  
  console.log(`${service.color}%s\x1b[0m`, `Starting ${service.name}...`);
  
  const proc = spawn(service.command, service.args, {
    cwd: service.cwd,
    stdio: 'pipe',
    shell: true
  });
  
  // Prefix output with service name and color
  proc.stdout.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]\x1b[0m ${line}`);
      }
    });
  });
  
  proc.stderr.on('data', (data) => {
    const lines = data.toString().trim().split('\n');
    lines.forEach(line => {
      if (line.trim()) {
        console.log(`${service.color}[${service.name}]\x1b[0m \x1b[31m${line}\x1b[0m`);
      }
    });
  });
  
  proc.on('close', (code) => {
    if (code !== 0) {
      console.log(`${service.color}%s\x1b[0m`, `⚠ ${service.name} exited with code ${code}. Restarting...`);
      // Restart service after a short delay
      setTimeout(() => startService(service), 5000);
    } else {
      console.log(`${service.color}%s\x1b[0m`, `✓ ${service.name} exited cleanly`);
    }
  });
  
  return proc;
}

// Start all services
async function startAllServices() {
  console.log('\x1b[1m%s\x1b[0m', '🚀 Starting Corp Analyst services...');
  
  const processes = [];
  
  for (const service of services) {
    const proc = await startService(service);
    if (proc) {
      processes.push(proc);
    }
  }
  
  // Handle termination
  process.on('SIGINT', () => {
    console.log('\n\x1b[1m%s\x1b[0m', '🛑 Shutting down all services...');
    processes.forEach(proc => {
      proc.kill('SIGINT');
    });
    
    // Force exit after 5 seconds if processes don't exit cleanly
    setTimeout(() => {
      console.log('\x1b[31m%s\x1b[0m', '⚠ Force exiting after timeout');
      process.exit(1);
    }, 5000);
  });
  
  console.log('\x1b[1m%s\x1b[0m', '✅ All services started. Press Ctrl+C to stop all services.');
  console.log('\x1b[1m%s\x1b[0m', '📊 Service endpoints:');
  console.log('\x1b[32m%s\x1b[0m', '- Client App: http://localhost:5173');
  console.log('\x1b[36m%s\x1b[0m', '- Analysis Assistant: http://localhost:3000');
  console.log('\x1b[33m%s\x1b[0m', '- Yahoo Finance Proxy: http://localhost:3001');
}

startAllServices().catch(err => {
  console.error('Error starting services:', err);
  process.exit(1);
});
