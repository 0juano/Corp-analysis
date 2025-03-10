const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS for all routes
app.use(cors());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Yahoo Finance proxy endpoint
app.get('/api/yahoo-finance/search', async (req, res) => {
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
      }
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
    
    // Provide detailed error information
    res.status(500).json({ 
      error: 'Failed to fetch data from Yahoo Finance',
      details: error.message,
      status: error.response ? error.response.status : 'unknown'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
});