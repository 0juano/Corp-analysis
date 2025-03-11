# Corporate Analyst Tool

A modern web application for corporate financial analysis, built with React, TypeScript, and Tailwind CSS.

## Features

- Dark mode and light mode toggle (dark mode by default)
- Mobile responsive design
- Corporate financial data analysis
- Chat interface for AI assistance
- Source management for research
- ISIN lookup via Yahoo Finance API
- Beautiful, production-ready UI

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- ESLint
- Lucide React for icons

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/corp-analyst.git
cd corp-analyst

# Install dependencies
npm install

# Start all services (client, Yahoo Finance proxy, and Analysis Assistant)
./start.sh
```

Visit `http://localhost:5173` to see the application.

### Services

The application consists of three main services:

1. **Client App** (port 5173): React frontend with TypeScript and Tailwind CSS
2. **Yahoo Finance Proxy** (port 3001): Proxy server to avoid CORS issues when fetching data from Yahoo Finance API
3. **Analysis Assistant** (port 3000): Cohere API-powered analysis assistant with web search capabilities

All services can be started together using the `./start.sh` script.

#### Testing the Yahoo Finance Proxy

You can test if the proxy server is working correctly with:

```bash
curl -s "http://localhost:3001/api/yahoo-finance/search?isin=US0378331005" | jq
```

This should return information about Apple Inc.

## Development Standards

We follow strict coding standards:

- Lint everything, no unused refs
- Less than 50 lines per function
- JSDoc comments for every function
- Mermaid diagrams for each PR
- Test-first approach for complex features
- Requirements documented in code comments

For more details, see [.claude/documentation/coding_standards.md](.claude/documentation/coding_standards.md).

## Project Structure

```
packages/
├── client/           # React frontend application
│   ├── src/          # Frontend source code
│   │   ├── components/  # UI components
│   │   ├── hooks/       # Custom React hooks
│   │   ├── contexts/    # React contexts
│   │   ├── types/       # TypeScript interfaces and types
│   │   ├── utils/       # Utility functions
│   │   ├── App.tsx      # Main application component
│   │   └── main.tsx     # Application entry point
│   └── ...           # Configuration files
├── yahoo-proxy/      # Yahoo Finance proxy server (port 3001)
│   └── server.js     # Express server for Yahoo Finance API
└── analysis-assistant/ # Cohere API assistant server (port 3000)
    └── src/          # Analysis assistant source code
        ├── index.js  # Express server for Cohere API
        └── public/   # Static files for the assistant

scripts/              # Utility scripts
├── start-all.js      # Node.js script to start all services

shared/               # Shared utilities and types
└── utils/            # Shared utility functions
```

## Recent Updates

- Enhanced Yahoo Finance API integration with improved error handling
- Added detailed logging to the proxy server for easier debugging
- UI improvements for better mobile responsiveness
- Optimized layout for better usability

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.