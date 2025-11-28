const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const mongoose = require('mongoose');
const qrcode = require('qrcode-terminal');

const app = express();
const PORT = process.env.WHATSAPP_SERVER_PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/automate-solutions';

// MongoDB connection with caching
let cached = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Initialize database connection
dbConnect().then(() => {
  console.log('WhatsApp server connected to MongoDB');
}).catch(err => {
  console.error('MongoDB connection error:', err);
});

// Import Mongoose models properly
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
  companyName: String,
}, { timestamps: true });

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  imageUrl: String,
  stock: Number,
  category: String,
});

const storeSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  storeName: String,
  storeDescription: String,
  currency: { type: String, default: 'USD' },
  welcomeMessage: String,
  products: [productSchema],
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
const Store = mongoose.model('Store', storeSchema);

// Store active clients and QR codes
const activeClients = new Map();
const qrCodes = new Map();

// Routes
app.post('/api/whatsapp/connect', async (req, res) => {
  const { userId, storeId } = req.body;

  if (!userId || !storeId) {
    return res.status(400).json({ error: 'User ID and Store ID are required' });
  }

  try {
    // Check if client already exists and is ready
    if (activeClients.has(userId)) {
      const existingClient = activeClients.get(userId);
      if (existingClient.info) {
        return res.json({ 
          status: 'connected', 
          message: 'WhatsApp is already connected',
          connected: true
        });
      }
    }

    // Get store data
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({ error: 'Store not found' });
    }

    console.log(`Creating WhatsApp client for user ${userId}...`);

    // Create new client with better configuration
    const client = new Client({
      authStrategy: new LocalAuth({ 
        clientId: userId,
        dataPath: './whatsapp-sessions'
      }),
      puppeteer: {
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu',
        ],
        executablePath: process.env.CHROMIUM_PATH || undefined,
      },
      webVersionCache: {
        type: 'remote',
        remotePath: 'https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/2.2412.54.html',
      }
    });

    // Store QR code when generated and return it immediately
    let qrResolve;
    const qrPromise = new Promise((resolve) => {
      qrResolve = resolve;
    });

    client.on('qr', (qr) => {
      console.log(`QR received for user ${userId}`);
      qrCodes.set(userId, qr);
      
      // Generate terminal QR for debugging
      console.log(`Scan this QR code for user ${userId}:`);
      qrcode.generate(qr, { small: true });
      
      // Resolve the promise with the QR code
      if (qrResolve) {
        qrResolve(qr);
      }
    });

    client.on('ready', () => {
      console.log(`WhatsApp client is READY for user ${userId}`);
      qrCodes.delete(userId);
    });

    client.on('authenticated', () => {
      console.log(`WhatsApp authenticated for user ${userId}`);
    });

    client.on('auth_failure', (msg) => {
      console.error(`Authentication failure for user ${userId}:`, msg);
      activeClients.delete(userId);
      qrCodes.delete(userId);
    });

    client.on('disconnected', (reason) => {
      console.log(`WhatsApp disconnected for user ${userId}:`, reason);
      activeClients.delete(userId);
      qrCodes.delete(userId);
    });

    client.on('loading_screen', (percent, message) => {
      console.log(`Loading screen: ${percent}% - ${message}`);
    });

    // Handle incoming messages
    client.on('message', async (message) => {
      await handleIncomingMessage(message, store);
    });

    // Store the client
    activeClients.set(userId, client);

    console.log('Initializing WhatsApp client...');
    
    // Initialize client
    await client.initialize();
    
    console.log('WhatsApp client initialized successfully');

    // Wait for QR code with timeout (15 seconds)
    const qrTimeout = setTimeout(() => {
      res.json({ 
        status: 'qr_timeout', 
        message: 'QR code generation timed out. Please try again.'
      });
    }, 15000);

    // Wait for QR code
    try {
      const qr = await Promise.race([
        qrPromise,
        new Promise((_, reject) => setTimeout(() => reject(new Error('QR timeout')), 15000))
      ]);
      
      clearTimeout(qrTimeout);
      
      res.json({ 
        status: 'qr_required', 
        message: 'Scan the QR code to connect',
        qr: qr
      });
    } catch (qrError) {
      clearTimeout(qrTimeout);
      res.json({ 
        status: 'initialized', 
        message: 'WhatsApp client initialized. QR code may be generated soon.'
      });
    }

  } catch (error) {
    console.error('Error connecting WhatsApp:', error);
    
    // Clean up on error
    const client = activeClients.get(userId);
    if (client) {
      try {
        await client.destroy();
      } catch (e) {
        console.error('Error destroying client:', e);
      }
      activeClients.delete(userId);
    }
    qrCodes.delete(userId);

    return res.status(500).json({ 
      error: `Failed to initialize WhatsApp: ${error.message}` 
    });
  }
});

// Get QR code endpoint
app.get('/api/whatsapp/qr/:userId', (req, res) => {
  const { userId } = req.params;
  const qr = qrCodes.get(userId);
  
  if (qr) {
    res.json({ 
      qr: qr,
      status: 'qr_available'
    });
  } else {
    res.status(404).json({ 
      error: 'QR code not found or expired',
      status: 'no_qr'
    });
  }
});

app.get('/api/whatsapp/status/:userId', async (req, res) => {
  const { userId } = req.params;

  const client = activeClients.get(userId);
  if (!client) {
    return res.json({ 
      connected: false, 
      status: 'disconnected',
      hasQr: false
    });
  }

  const hasQr = qrCodes.has(userId);
  const isReady = client.info ? true : false;

  res.json({
    connected: isReady,
    status: isReady ? 'connected' : (hasQr ? 'qr_required' : 'connecting'),
    hasQr: hasQr
  });
});

app.post('/api/whatsapp/disconnect/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const client = activeClients.get(userId);
    if (client) {
      await client.destroy();
      activeClients.delete(userId);
      qrCodes.delete(userId);
    }

    res.json({ message: 'WhatsApp disconnected successfully' });
  } catch (error) {
    console.error('Error disconnecting WhatsApp:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    activeClients: activeClients.size,
    qrCodes: qrCodes.size,
    timestamp: new Date().toISOString()
  });
});

// WhatsApp message handler (same as before)
async function handleIncomingMessage(message, store) {
  // Ignore group messages and status messages
  if (message.from === 'status@broadcast' || message.isGroup) return;

  const messageBody = message.body.toLowerCase().trim();
  const from = message.from;

  console.log(`Received message from ${from}: ${messageBody}`);

  try {
    if (messageBody === 'hi' || messageBody === 'hello' || messageBody === 'menu') {
      await sendWelcomeMessage(message, store);
    } else if (messageBody === 'products' || messageBody === '1') {
      await sendProductsList(message, store);
    } else if (messageBody.startsWith('order ')) {
      await handleOrder(message, store);
    } else if (messageBody === 'help' || messageBody === '4') {
      await sendHelpMessage(message);
    } else {
      await sendUnknownCommand(message);
    }
  } catch (error) {
    console.error('Error handling message:', error);
    await message.reply('Sorry, I encountered an error. Please try again.');
  }
}

async function sendWelcomeMessage(message, store) {
  const welcomeText = `
${store.welcomeMessage}

*MENU:*
1. 📋 View Products
2. 🛒 Place Order (type "order [product number] [quantity]")
3. 📞 Contact Support
4. ℹ️ Help

Please reply with the number of your choice or type the command.
  `.trim();

  await message.reply(welcomeText);
}

async function sendProductsList(message, store) {
  if (!store.products || store.products.length === 0) {
    await message.reply('Sorry, no products are available at the moment.');
    return;
  }

  let productsText = `*OUR PRODUCTS:*\n\n`;
  
  store.products.forEach((product, index) => {
    productsText += `*${index + 1}. ${product.name}*\n`;
    productsText += `   ${product.description}\n`;
    productsText += `   Price: ${store.currency} ${product.price.toFixed(2)}\n`;
    productsText += `   Stock: ${product.stock}\n\n`;
  });

  productsText += `To order, reply with: "order [product number] [quantity]"\n`;
  productsText += `Example: "order 1 2" to order 2 units of product 1`;

  await message.reply(productsText);
}

async function handleOrder(message, store) {
  const messageBody = message.body.toLowerCase().trim();
  const parts = messageBody.split(' ');
  
  if (parts.length < 3) {
    await message.reply('Invalid order format. Please use: "order [product number] [quantity]"');
    return;
  }

  const productIndex = parseInt(parts[1]) - 1;
  const quantity = parseInt(parts[2]);

  if (isNaN(productIndex) || isNaN(quantity) || productIndex < 0 || quantity <= 0) {
    await message.reply('Please provide valid product number and quantity.');
    return;
  }

  if (!store.products || productIndex >= store.products.length) {
    await message.reply('Invalid product number. Please check the products list.');
    return;
  }

  const product = store.products[productIndex];
  
  if (product.stock < quantity) {
    await message.reply(`Sorry, only ${product.stock} units of ${product.name} are available.`);
    return;
  }

  const total = product.price * quantity;

  const orderText = `
*ORDER CONFIRMATION*

Product: ${product.name}
Quantity: ${quantity}
Price per unit: ${store.currency} ${product.price.toFixed(2)}
Total: ${store.currency} ${total.toFixed(2)}

To confirm your order, please contact the store owner directly.
Thank you for your order!
  `.trim();

  await message.reply(orderText);
}

async function sendHelpMessage(message) {
  const helpText = `
*HELP GUIDE*

*Available Commands:*
- "hi" or "menu" - Show main menu
- "products" or "1" - View all products
- "order [number] [quantity]" - Place an order
- "help" or "4" - Show this help message

*Example Orders:*
- "order 1 2" - Order 2 units of product #1
- "order 3 1" - Order 1 unit of product #3

For support, please contact the store owner.
  `.trim();

  await message.reply(helpText);
}

async function sendUnknownCommand(message) {
  await message.reply(`I didn't understand that command. Type "menu" to see available options or "help" for assistance.`);
}

app.listen(PORT, () => {
  console.log(`WhatsApp server running on port ${PORT}`);
  console.log(`Health check available at: http://localhost:${PORT}/health`);
});