require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const mongoose = require('mongoose');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = process.env.WHATSAPP_SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

// Use your MongoDB Atlas connection from environment variables
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in environment variables');
  console.error('   Please check your .env.local file');
  process.exit(1);
}

let dbConnected = false;

async function initializeDatabase() {
  try {
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(MONGODB_URI);
    dbConnected = true;
    console.log('✅ WhatsApp server connected to MongoDB Atlas');
  } catch (err) {
    console.log('❌ MongoDB Atlas connection failed:', err.message);
    console.log('   Running in demo mode without database');
    dbConnected = false;
  }
}

// Initialize database (but don't block server startup)
initializeDatabase();

// Simple in-memory storage for demo mode
const demoConnections = new Map();
const demoQRCodes = new Map();

// Use demo mode for now to avoid WhatsApp complexities
const DEMO_MODE = true;

// Routes
app.post('/api/whatsapp/connect', async (req, res) => {
  const { userId, storeId } = req.body;

  if (!userId || !storeId) {
    return res.status(400).json({ error: 'User ID and Store ID are required' });
  }

  console.log(`📱 Demo mode: Connecting WhatsApp for user ${userId}`);
  
  // Generate demo QR code
  const demoQR = `
╔══════════════════════════════════════╗
║           WHATSAPP DEMO MODE         ║
╠══════════════════════════════════════╣
║  🔗 User: ${userId.substring(0, 12)}...     ║
║  🏪 Store: ${storeId.substring(0, 12)}...  ║
║                                      ║
║   This is a demo QR code!            ║
║   No real WhatsApp connection.       ║
║                                      ║
║   Wait 3 seconds for automatic       ║
║        "connection"...               ║
╚══════════════════════════════════════╝
  `.trim();

  demoQRCodes.set(userId, demoQR);
  
  // Simulate connection after 3 seconds
  setTimeout(() => {
    demoConnections.set(userId, { 
      connected: true, 
      storeId: storeId, 
      connectedAt: new Date(),
      demo: true 
    });
    demoQRCodes.delete(userId);
    console.log(`✅ Demo WhatsApp connected for user ${userId}`);
  }, 3000);

  return res.json({ 
    status: 'qr_required', 
    message: 'Scan the QR code to connect (Demo Mode)',
    qr: demoQR,
    demo: true
  });
});

app.get('/api/whatsapp/qr/:userId', (req, res) => {
  const { userId } = req.params;
  const qr = demoQRCodes.get(userId);
  
  if (qr) {
    res.json({ 
      qr: qr,
      status: 'qr_available',
      demo: true
    });
  } else {
    res.status(404).json({ 
      error: 'QR code not found or expired',
      status: 'no_qr',
      demo: true
    });
  }
});

app.get('/api/whatsapp/status/:userId', (req, res) => {
  const { userId } = req.params;

  const connection = demoConnections.get(userId);
  const hasQr = demoQRCodes.has(userId);
  
  res.json({
    connected: connection ? true : false,
    status: connection ? 'connected' : (hasQr ? 'qr_required' : 'disconnected'),
    hasQr: hasQr,
    demo: true
  });
});

app.post('/api/whatsapp/disconnect/:userId', (req, res) => {
  const { userId } = req.params;
  
  demoConnections.delete(userId);
  demoQRCodes.delete(userId);
  console.log(`📱 Demo WhatsApp disconnected for user ${userId}`);
  
  res.json({ 
    message: 'WhatsApp disconnected successfully (Demo Mode)',
    demo: true
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    demo: DEMO_MODE,
    database: dbConnected ? 'connected' : 'demo_mode',
    activeConnections: demoConnections.size,
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`✅ WhatsApp server running on port ${PORT}`);
  console.log(`🎭 Demo mode: ${DEMO_MODE}`);
  console.log(`🗄️  Database: ${dbConnected ? 'Connected to MongoDB Atlas' : 'Demo mode (no database needed)'}`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
  console.log(`🌐 Main app: http://localhost:3000`);
});