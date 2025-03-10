# Chat Analysis Assistant

A web-based chat analysis assistant powered by Cohere's LLM API with web search capabilities.

## Features

- Chat analysis with AI-powered insights
- Web search integration for up-to-date information
- Dark/light mode toggle
- Mobile-responsive design
- Secure API key handling

## Tech Stack

- **Backend**: Node.js with Express
- **Frontend**: HTML, JavaScript, Tailwind CSS
- **AI**: Cohere API with web search connector
- **Styling**: Tailwind CSS

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd corp-analyst-app
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Cohere API key:
```
COHERE_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:3000`

## API Endpoints

- `GET /`: Web interface
- `GET /health`: Health check endpoint
- `POST /api/analyze`: Chat analysis with web search
  - Request body: `{ "message": "Your message here" }`
  - Response: Analysis results with web search data

## Security

- API keys are stored in environment variables
- `.env` file is included in `.gitignore` to prevent accidental exposure
- CORS is enabled for API security

## Development

To run the development server with hot reloading:

```bash
npm run dev
```

## Production

For production deployment:

```bash
npm start
```

## License

MIT 