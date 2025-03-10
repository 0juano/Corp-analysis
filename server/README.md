# Corp Analyst Proxy Server

This is a simple Express server that acts as a proxy for the Yahoo Finance API to avoid CORS issues when making requests from the browser.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Start the server:
```bash
npm start
```

For development with auto-restart:
```bash
npm run dev
```

The server will run on port 3001 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### Yahoo Finance Search

```
GET /api/yahoo-finance/search?isin=<ISIN>
```

This endpoint proxies requests to the Yahoo Finance search API, allowing you to look up company information by ISIN.

Example:
```bash
curl -s "http://localhost:3001/api/yahoo-finance/search?isin=US0378331005" | jq
```

Response format:
```json
{
  "success": true,
  "data": {
    "name": "Apple Inc.",
    "ticker": "AAPL",
    "exchange": "NMS",
    "industry": "Consumer Electronics"
  }
}
```

### Health Check

```
GET /health
```

Returns a simple status check to verify the server is running.

## Logging

The server includes comprehensive logging to help with debugging:

- All incoming requests are logged with timestamps
- ISIN search requests log the specific ISIN being searched
- API response status codes are logged
- Error responses include detailed information

Example log output:
```
Proxy server running on port 3001
2025-03-10T18:48:38.811Z - GET /api/yahoo-finance/search?isin=US0378331005
Searching for ISIN: US0378331005
Yahoo Finance response status: 200
```

## Troubleshooting

If you encounter issues:

1. Make sure the server is running on port 3001
2. Check that the frontend is configured to use `http://localhost:3001` as the proxy URL
3. Verify that you have the required dependencies installed (express, cors, axios)
4. Check the server logs for detailed error information
5. Ensure the ISIN is valid (exactly 12 characters)
6. Try testing with a known working ISIN like US0378331005 (Apple Inc.)

## Recent Changes

- Added detailed request logging for better debugging
- Simplified Yahoo Finance API request parameters for more reliable results
- Improved error handling with more descriptive messages 