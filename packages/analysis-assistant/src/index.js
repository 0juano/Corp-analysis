import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { createHttpTerminator } from 'http-terminator';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Global error handlers to prevent server crashes
process.on('uncaughtException', (error) => {
  console.error('UNCAUGHT EXCEPTION! ');
  console.error(error.name, error.message);
  console.error(error.stack);
  // Keep the server running despite the error
});

process.on('unhandledRejection', (error) => {
  console.error('UNHANDLED REJECTION! ');
  console.error(error.name, error.message);
  console.error(error.stack);
  // Keep the server running despite the error
});

// Initialize Express app
const app = express();

// Configure CORS to allow requests from the React application
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 
           'http://localhost:5176', 'http://localhost:5177', 'http://localhost:5178', 
           'http://localhost:5179', 'http://localhost:5180', 'http://localhost:5181', 
           'http://localhost:5182', 'http://localhost:5183', 'http://localhost:5184', 
           'http://localhost:5185', 'http://localhost:5186', 'http://localhost:5187', 
           'http://localhost:5188', 'http://localhost:5189', 'http://localhost:5190', 
           'http://localhost:5191', 'http://localhost:5192', 'http://localhost:5193'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Add timeout middleware to prevent hanging requests
app.use((req, res, next) => {
  // Set a 30-second timeout for all requests
  req.setTimeout(30000, () => {
    const err = new Error('Request timeout after 30 seconds');
    err.status = 408;
    next(err);
  });
  next();
});

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

// Validate API key is available
if (!process.env.COHERE_API_KEY) {
  console.error('ERROR: Cohere API key not found. Please check your .env file.');
  process.exit(1);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Chat analysis endpoint with web search
app.post('/api/analyze', async (req, res, next) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    console.log('Received message:', message);
    
    // Add timeout to prevent hanging requests
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timeout after 30 seconds')), 30000);
    });
    
    const coherePromise = cohere.chat({
      message,
      model: 'command',
      connectors: [{ id: "web-search" }],
      preamble: `You are a helpful chat analysis assistant that provides information with web search capabilities.
                You analyze conversations and provide insights based on the content.
                When additional information is needed, you search the web for relevant data.
                You specialize in analyzing companies, financial data, and market trends.`,
      temperature: 0.7,
    });
    
    // Race between the API call and the timeout
    const response = await Promise.race([coherePromise, timeoutPromise]);
    
    console.log('Cohere API response received');
    
    res.json({
      analysis: response.text,
      sources: response.documents || [],
      searchResults: response.webSearchResults || []
    });
  } catch (error) {
    console.error('Cohere API Error:', error);
    
    // Pass error to the error handling middleware
    next(error);
  }
});

// Root route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
  console.error('Express error handler caught:', err);
  
  // Determine appropriate status code
  const statusCode = err.statusCode || 500;
  
  // Send detailed error response
  res.status(statusCode).json({ 
    error: 'An error occurred during analysis',
    message: err.message,
    status: statusCode,
    timestamp: new Date().toISOString()
  });
});

// Create HTTP server
const server = http.createServer(app);

// Create HTTP terminator for graceful shutdown
const httpTerminator = createHttpTerminator({ server });

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /: Web interface');
  console.log('- GET /health: Health check');
  console.log('- POST /api/analyze: Chat analysis with web search');
});

// Graceful shutdown with improved handling
const gracefulShutdown = async (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  
  try {
    // First terminate all HTTP connections
    await httpTerminator.terminate();
    console.log('HTTP server closed gracefully');
    
    // Close any database connections or other resources here
    // ...
    
    console.log('All resources closed, process terminating');
    process.exit(0);
  } catch (error) {
    console.error('Error during graceful shutdown:', error);
    process.exit(1);
  }
};

// Set up signal handlers
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

// Force shutdown after 30 seconds if graceful shutdown fails
const forceShutdown = (signal) => {
  setTimeout(() => {
    console.error(`Forced shutdown after 30s timeout (${signal})`);
    process.exit(1);
  }, 30000);
};

process.on('SIGTERM', () => forceShutdown('SIGTERM'));
process.on('SIGINT', () => forceShutdown('SIGINT'));
