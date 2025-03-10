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
        quotesCount: 1,
        newsCount: 0,
        listsCount: 0
      },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    
    console.log(`Yahoo Finance response status: ${response.status}`);
    
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