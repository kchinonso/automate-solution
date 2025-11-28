const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Simple in-memory storage
const connections = new Map();
const qrCodes = new Map();

console.log('🚀 Starting WhatsApp Demo Server...');

app.post('/api/whatsapp/connect', (req, res) => {
  const { userId, storeId } = req.body;
  
  console.log(`📱 Connecting WhatsApp for user ${userId}`);
  
  // Simple QR code
  const qr = `
╔══════════════════════════════════════╗
║        AUTO MATE SOLUTIONS           ║
║           WHATSAPP DEMO              ║
╠══════════════════════════════════════╣
║  👤 User: ${userId.substring(0, 12)}...     ║
║  🏪 Store: ${storeId.substring(0, 12)}...  ║
║                                      ║
║   ✅ This is a demo QR code!         ║
║   ✅ No real WhatsApp connection     ║
║   ✅ Perfect for testing             ║
║                                      ║
║   ⏳ Wait 3 seconds for automatic    ║
║           connection...              ║
╚══════════════════════════════════════╝
  `.trim();

  qrCodes.set(userId, qr);
  
  // Auto-connect after 3 seconds
  setTimeout(() => {
    connections.set(userId, { 
      connected: true, 
      storeId: storeId, 
      connectedAt: new Date().toISOString(),
      demo: true 
    });
    qrCodes.delete(userId);
    console.log(`✅ Demo WhatsApp connected for user ${userId}`);
  }, 3000);

  res.json({ 
    status: 'qr_required', 
    message: 'Scan the QR code to connect (Demo Mode)',
    qr: qr,
    demo: true
  });
});

app.get('/api/whatsapp/status/:userId', (req, res) => {
  const { userId } = req.params;
  const connected = connections.has(userId);
  const hasQr = qrCodes.has(userId);
  
  const status = connected ? 'connected' : (hasQr ? 'qr_required' : 'disconnected');
  
  console.log(`📊 Status check for ${userId}: ${status}`);
  
  res.json({
    connected: connected,
    status: status,
    hasQr: hasQr,
    demo: true
  });
});

app.post('/api/whatsapp/disconnect/:userId', (req, res) => {
  const { userId } = req.params;
  connections.delete(userId);
  qrCodes.delete(userId);
  console.log(`❌ Demo WhatsApp disconnected for user ${userId}`);
  
  res.json({ 
    message: 'WhatsApp disconnected successfully (Demo Mode)',
    demo: true
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'WhatsApp Demo Server Running Perfectly',
    demo: true,
    activeConnections: connections.size,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'WhatsApp Demo Server for AutoMate Solutions',
    endpoints: {
      health: '/health',
      connect: 'POST /api/whatsapp/connect',
      status: 'GET /api/whatsapp/status/:userId',
      disconnect: 'POST /api/whatsapp/disconnect/:userId'
    }
  });
});

app.listen(PORT, () => {
  console.log('✅ WhatsApp Demo Server running on port 3001');
  console.log('🎭 Running in DEMO MODE - No real WhatsApp connection');
  console.log('❤️  Health check: http://localhost:3001/health');
  console.log('📱 Main application: http://localhost:3000');
  console.log('🚀 Ready to test WhatsApp integration!');
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down WhatsApp Demo Server...');
  process.exit(0);
});