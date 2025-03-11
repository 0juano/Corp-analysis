const express = require('express');
const cors = require('cors');
const axios = require('axios');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 3001;

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

// Enable CORS for all routes
app.use(cors());

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

// Yahoo Finance proxy endpoint
app.get('/api/yahoo-finance/search', async (req, res, next) => {
  try {
    const { isin } = req.query;
    
    if (!isin) {
      return res.status(400).json({ error: 'ISIN parameter is required' });
    }
    
    console.log(`Searching for ISIN: ${isin}`);
    
    // Using the same parameters as the working Python example
    const response = await axios.get('https://query1.finance.yahoo.com/v1/finance/search', {
      params: {
        q: isin,
        quotesCount: 5, // Increase quotes count to get more results
        newsCount: 0,
        listsCount: 0,
        enableFuzzyQuery: true // Enable fuzzy matching for better results
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 10000 // Add timeout to prevent hanging requests
    });
    
    console.log(`Yahoo Finance response status: ${response.status}`);
    
    // Log the response data for debugging
    console.log('Yahoo Finance response data:', JSON.stringify(response.data, null, 2));
    
    // Check if we have quotes in the response
    if (response.data.quotes && response.data.quotes.length > 0) {
      console.log(`Found ${response.data.quotes.length} quotes for ISIN ${isin}`);
      
      // Log the first quote for debugging
      const firstQuote = response.data.quotes[0];
      console.log('First quote:', JSON.stringify(firstQuote, null, 2));
      
      // Log available fields in the first quote
      console.log('Available fields in first quote:', Object.keys(firstQuote));
    } else {
      console.log(`No quotes found for ISIN ${isin}`);
    }
    
    // Return the full response data to the client
    res.json(response.data);
  } catch (error) {
    console.error('Error proxying Yahoo Finance request:', error);
    
    // Pass to error handling middleware
    next(error);
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'yahoo-finance-proxy'
  });
});

// Error handling middleware (must be after routes)
app.use((err, req, res, next) => {
  console.error('Express error handler caught:', err);
  
  // Determine appropriate status code
  const statusCode = err.status || err.statusCode || 500;
  
  // Prepare error response
  const errorResponse = { 
    error: 'Internal server error',
    message: err.message,
    status: statusCode,
    timestamp: new Date().toISOString()
  };
  
  // Add additional details for axios errors
  if (err.isAxiosError) {
    errorResponse.error = 'Failed to fetch data from Yahoo Finance';
    errorResponse.details = err.message;
    errorResponse.status = err.response ? err.response.status : 'unknown';
    
    // Add response data if available for debugging
    if (err.response && err.response.data) {
      errorResponse.responseData = err.response.data;
    }
  }
  
  res.status(statusCode).json(errorResponse);
});

// Catch-all for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Create HTTP server
const server = http.createServer(app);

// Add keep-alive settings to avoid connection issues
server.keepAliveTimeout = 65000; // Ensure keep-alive connections stay alive longer than default
server.headersTimeout = 66000; // Slightly longer than keepAliveTimeout

// Start the server
server.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /api/yahoo-finance/search: Yahoo Finance search proxy');
  console.log('- GET /health: Health check');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  
  // First stop accepting new connections
  server.close(() => {
    console.log('HTTP server closed');
    // Process can exit now
    console.log('Process terminated');
  });
  
  // Force shutdown after 30 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Forced shutdown after 30s timeout');
    process.exit(1);
  }, 30000);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  
  // First stop accepting new connections
  server.close(() => {
    console.log('HTTP server closed');
    // Process can exit now
    console.log('Process terminated');
  });
  
  // Force shutdown after 30 seconds if graceful shutdown fails
  setTimeout(() => {
    console.error('Forced shutdown after 30s timeout');
    process.exit(1);
  }, 30000);
});