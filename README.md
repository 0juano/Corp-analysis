# Corporate Analyst Tool

A modern web application for corporate financial analysis, built with React, TypeScript, and Tailwind CSS.

## Features

- Dark mode and light mode toggle (dark mode by default)
- Mobile responsive design
- Corporate financial data analysis
- Chat interface for AI assistance
- Source management for research
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
```

## Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 