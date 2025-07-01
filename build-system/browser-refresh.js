const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

class BrowserRefresh {
  constructor(port = 4001) {
    this.port = port;
    this.wss = null;
    this.clients = new Set();
  }

  start() {
    // Create WebSocket server
    this.wss = new WebSocket.Server({ 
      port: this.port,
      // Handle CORS
      verifyClient: (info) => {
        // Allow connections from localhost
        const origin = info.origin || info.req.headers.origin;
        return !origin || origin.includes('localhost') || origin.includes('127.0.0.1');
      }
    });

    this.wss.on('connection', (ws) => {
      this.clients.add(ws);
      console.log('🔄 Browser connected for auto-refresh');
      
      // Send initial connection message
      ws.send(JSON.stringify({ type: 'connected', message: 'Auto-refresh active' }));
      
      // Handle client disconnect
      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('🔌 Browser disconnected from auto-refresh');
      });
      
      ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        this.clients.delete(ws);
      });
    });

    console.log(`✅ Browser auto-refresh WebSocket server running on port ${this.port}`);
  }

  // Notify all connected browsers to refresh
  refreshBrowsers(message = 'Content updated') {
    const payload = JSON.stringify({ 
      type: 'refresh', 
      message,
      timestamp: Date.now() 
    });
    
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
    
    console.log(`🔄 Sent refresh signal to ${this.clients.size} browser(s)`);
  }

  // Send custom messages to browsers (for future build status overlay)
  sendMessage(type, data) {
    const payload = JSON.stringify({ type, ...data });
    
    this.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  stop() {
    if (this.wss) {
      this.wss.close();
      console.log('🛑 Browser auto-refresh server stopped');
    }
  }

  // Get the client script to inject into HTML pages
  getClientScript() {
    return `
<!-- Browser Auto-Refresh -->
<script>
(function() {
  const ws = new WebSocket('ws://localhost:${this.port}');
  let reconnectInterval = null;
  
  ws.onopen = function() {
    console.log('🔄 Connected to auto-refresh server');
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
    }
  };
  
  ws.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    if (data.type === 'refresh') {
      console.log('🔄 Refreshing page:', data.message);
      // Small delay to ensure files are fully written
      setTimeout(() => location.reload(), 100);
    } else if (data.type === 'connected') {
      console.log('✅', data.message);
    }
  };
  
  ws.onclose = function() {
    console.log('🔌 Disconnected from auto-refresh server');
    // Try to reconnect every 2 seconds
    if (!reconnectInterval) {
      reconnectInterval = setInterval(() => {
        console.log('🔄 Attempting to reconnect...');
        window.location.reload();
      }, 2000);
    }
  };
  
  ws.onerror = function(error) {
    console.error('❌ Auto-refresh connection error:', error);
  };
})();
</script>
`;
  }
}

module.exports = BrowserRefresh;