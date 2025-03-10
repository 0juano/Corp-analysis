import dotenv from 'dotenv';
import { CohereClient } from 'cohere-ai';

// Load environment variables
dotenv.config();

// Validate API key is available
if (!process.env.COHERE_API_KEY) {
  console.error('ERROR: Cohere API key not found. Please check your .env file.');
  process.exit(1);
}

// Initialize Cohere client
const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY,
});

async function testCohereAPI() {
  console.log('Testing Cohere API connection...');
  
  try {
    const response = await cohere.chat({
      message: 'Hello! Can you tell me about Cohere?',
      model: 'command',
      connectors: [{ id: "web-search" }],
      temperature: 0.7,
    });
    
    console.log('✅ Cohere API connection successful!');
    console.log('Response:', response.text.substring(0, 150) + '...');
    
    if (response.webSearchResults && response.webSearchResults.length > 0) {
      console.log('✅ Web search capability is working!');
      console.log('Found', response.webSearchResults.length, 'search results');
    } else {
      console.log('⚠️ Web search did not return any results. This might be normal depending on the query.');
    }
    
  } catch (error) {
    console.error('❌ Cohere API connection failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

testCohereAPI(); 