# Project Structure

This document provides a comprehensive overview of the Corporate Analyst Tool project structure.

## Directory Structure

```
src/
├── components/     # UI components
├── hooks/          # Custom React hooks
│   └── useSearch.ts  # Hook for handling ISIN search functionality
├── contexts/       # React contexts
├── types/          # TypeScript interfaces and types
├── utils/          # Utility functions
├── App.tsx         # Main application component
├── main.tsx        # Application entry point
└── index.css       # Global styles

server/
├── server.js       # Express proxy server for Yahoo Finance API
├── package.json    # Server dependencies
└── README.md       # Server documentation

.claude/            # Claude-specific metadata and documentation
├── metadata/       # Project metadata
│   ├── diagrams/   # Visual representations of the project
│   ├── dependency_graph.json
│   ├── file_classification.json
│   ├── component_registry.json
│   └── error_patterns.json
├── code_index/     # Semantic code relationships
├── debug_history/  # Debugging sessions and solutions
├── patterns/       # Implementation patterns
├── cheatsheets/    # Quick reference guides
├── qa/             # Previous solved problems
├── delta/          # Semantic change logs
└── documentation/  # Project documentation
    ├── components/ # Component-specific documentation
    ├── coding_standards.md
    └── code_structure.md
```

## Key Components

### Frontend (React)

- **App.tsx**: The main application component that contains all sections and manages global state
- **useSearch.ts**: Custom hook that handles ISIN lookup functionality
- **Components**: Various UI components for different sections of the application

### Backend (Express)

- **server.js**: Proxy server that handles requests to the Yahoo Finance API to avoid CORS issues

## Data Flow

1. User enters an ISIN code in the search component
2. The search component sends a request to the proxy server
3. The proxy server forwards the request to the Yahoo Finance API
4. The API response is returned to the proxy server
5. The proxy server sends the data back to the frontend
6. The frontend updates the UI with the company information

## State Management

The application uses React's useState and useEffect hooks for state management. Key state elements include:

- Company information (name, ticker)
- Section data (business, ownership, industry, earnings, developments)
- Sources for each section
- Chat messages
- UI state (dark/light mode, expanded/collapsed sections)

## API Integration

The application integrates with the Yahoo Finance API through a proxy server to:

1. Look up companies by ISIN code
2. Retrieve company information
3. Handle errors and edge cases 