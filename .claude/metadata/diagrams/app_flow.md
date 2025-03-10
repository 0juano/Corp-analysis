# Application Flow Diagram

This diagram illustrates the main flow and components of the Corporate Analyst Tool.

```mermaid
graph TD
    A[User] -->|Enters ISIN| B[Search Component]
    B -->|Sends Request| C[Proxy Server]
    C -->|Queries| D[Yahoo Finance API]
    D -->|Returns Data| C
    C -->|Returns Data| B
    B -->|Updates UI| E[Main App]
    
    E -->|Contains| F[Business Section]
    E -->|Contains| G[Ownership Section]
    E -->|Contains| H[Industry Section]
    E -->|Contains| I[Earnings Section]
    E -->|Contains| J[Developments Section]
    E -->|Contains| K[Chat Interface]
    
    F -->|Has| L[Sources Management]
    G -->|Has| L
    H -->|Has| L
    I -->|Has| L
    J -->|Has| L
    
    K -->|User Messages| M[AI Assistant]
    M -->|Assistant Responses| K
    
    E -->|Toggle| N[Dark/Light Mode]
    E -->|Generate| O[Printable Report]
```

## Component Relationships

- **Search Component**: Handles ISIN lookup via the proxy server
- **Proxy Server**: Prevents CORS issues when accessing Yahoo Finance API
- **Main App**: Contains all sections and manages global state
- **Section Components**: Business, Ownership, Industry, Earnings, Developments
- **Sources Management**: Allows adding/removing reference URLs for each section
- **Chat Interface**: Enables communication with AI assistant
- **Dark/Light Mode**: Toggles between dark and light themes
- **Printable Report**: Generates a formatted report of all analysis data 