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

# Start the development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Setting up the Proxy Server

The application uses a proxy server to avoid CORS issues when fetching data from the Yahoo Finance API.

```bash
# Navigate to the server directory
cd server

# Install server dependencies
npm install

# Start the server
node server.js
```

The proxy server will run on port 3001. Make sure it's running when using the ISIN lookup feature.

#### Testing the Proxy Server

You can test if the proxy server is working correctly with:

```bash
curl -s "http://localhost:3001/api/yahoo-finance/search?isin=US0378331005" | jq
```

This should return information about Apple Inc.

For more details, see [server/README.md](server/README.md).

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
src/
├── components/     # UI components
├── hooks/          # Custom React hooks
├── contexts/       # React contexts
├── types/          # TypeScript interfaces and types
├── utils/          # Utility functions
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles
server/             # Proxy server for API requests
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