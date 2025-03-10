import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

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
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Chat analysis endpoint with web search
app.post('/api/analyze', async (req, res) => {
  const { message } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Message is required' });
  }
  
  try {
    console.log('Received message:', message);
    
    const response = await cohere.chat({
      message,
      model: 'command',
      connectors: [{ id: "web-search" }],
      preamble: `You are a helpful chat analysis assistant that provides information with web search capabilities.
                You analyze conversations and provide insights based on the content.
                When additional information is needed, you search the web for relevant data.
                You specialize in analyzing companies, financial data, and market trends.`,
      temperature: 0.7,
    });
    
    console.log('Cohere API response received');
    
    res.json({
      analysis: response.text,
      sources: response.documents || [],
      searchResults: response.webSearchResults || []
    });
  } catch (error) {
    console.error('Cohere API Error:', error);
    res.status(500).json({ 
      error: 'An error occurred during analysis',
      message: error.message
    });
  }
});

// Root route to serve the HTML file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('- GET /: Web interface');
  console.log('- GET /health: Health check');
  console.log('- POST /api/analyze: Chat analysis with web search');
}); 