# App Component

## Purpose
The App component is the main application component for the Corp-analyst application. It handles the overall UI structure, state management, and user interactions. It provides a dashboard for analyzing corporate information, managing sources, and interacting with a chat interface.

## Schema

### Types and Interfaces
- **Development**: Represents company developments with emoji indicator, text content, and visibility flag
  ```typescript
  interface Development {
    emoji: 'up' | 'down';
    text: string;
    visible: boolean;
  }
  ```

- **Point**: Represents positive or negative points with text content and visibility flag
  ```typescript
  interface Point {
    text: string;
    visible: boolean;
  }
  ```

- **Message**: Represents chat messages between user and assistant
  ```typescript
  interface Message {
    id: string;
    text: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
  }
  ```

- **Source**: Represents information sources used for analysis
  ```typescript
  interface Source {
    id: string;
    url: string;
    timestamp: number;
  }
  ```

- **LinkPreview**: Represents preview information for URL links
  ```typescript
  interface LinkPreview {
    title: string;
    description: string;
    image: string;
    url: string;
  }
  ```

### State Structure
- **UI State**
  - `isDarkMode`: Controls dark/light theme
  - `isCyberpunk`: Toggle for cyberpunk styling
  - `expandedSections`: Record of which UI sections are expanded/collapsed
  
- **Analysis State**
  - `isin`: ISIN (International Securities Identification Number) being analyzed
  - `companyName`: Name of the company being analyzed
  - `isSearching`: Flag indicating if a search is in progress
  
- **Chat State**
  - `messages`: Array of chat messages
  - `currentMessage`: Current message being composed
  - `isChatLoading`: Flag indicating if chat is waiting for response
  
- **Sources State**
  - `sources`: Array of information sources
  - `showSourceInput`: Flag to show/hide source input field
  - `newSourceUrl`: URL being entered in the source input
  - `linkPreviews`: Record of preview data for links

## Patterns

### Initialization Patterns
- State initialization with useState hooks at the component's start
- Default to dark mode for theme
- Empty arrays for collections (messages, sources)
- Reference creation with useRef for scrolling to chat end

### Update Patterns
- Event handlers for state updates (e.g., handleSendMessage, handleInputChange)
- Form submission handlers with preventDefault
- Functional state updates for arrays (prev => [...prev, newItem])
- Toggle patterns for boolean states (setIsDarkMode(prev => !prev))

### Interaction Patterns
- Form submissions for search and messages
- Button clicks for UI toggles and actions
- Section expansion/collapse
- Adding/removing items from collections

### Side Effect Patterns
- Chat scroll behavior managed with useEffect and refs
- Theme class management on document.body
- Potential API calls (implied but not fully implemented)

## Interfaces

### Event Handlers
- `handleAddSource`: Adds a new source URL
- `handleRemoveSource`: Removes a source by ID
- `handleSendMessage`: Processes and sends chat messages
- `handlePrint`: Triggers printing functionality
- `handleIsinSubmit`: Processes ISIN submission
- `handleInputChange`: Generic handler for input changes
- `handleDevelopmentChange`: Updates development items
- `handlePointChange`: Updates positive/negative points
- `removePoint`/`addPoint`: Manages points collections
- `removeDevelopment`/`addDevelopment`: Manages developments collection
- `toggleSection`: Expands/collapses UI sections
- `toggleDarkMode`/`toggleCyberpunk`: Toggles theme settings
- `adjustHeight`: Adjusts textarea height based on content

## Invariants

### State Invariants
- Messages array always contains objects with id, text, sender, and timestamp
- Sources always have id, url, and timestamp
- Boolean flags (isDarkMode, isCyberpunk, etc.) are always boolean values
- expandedSections maintains consistent record structure

### Rendering Invariants
- Dark/light mode classes are always applied correctly
- Section visibility always respects expandedSections state
- Lists consistently render with proper keys
- Conditional rendering follows consistent patterns

### Performance Invariants
- Scrolling to bottom of chat only happens when messages change
- State updates maintain appropriate isolation

## Error States

### Input Validation
- Empty messages are not sent (implied but not explicitly shown)
- URL validation may occur for sources (implied)

### Edge Cases
- Empty states (no messages, no sources, etc.) handled with appropriate UI
- Loading states visually indicated
- Possible API errors handled (implied but not fully implemented)

### Fallback Behaviors
- Default to dark mode on initialization
- Sensible defaults for empty states 