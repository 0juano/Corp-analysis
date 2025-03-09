# Memory Anchors Guide

This guide explains how to implement explicit memory anchors in the codebase to make it easier for Claude to reference and recall specific code sections during conversations.

## Purpose

Memory anchors are special comments inserted into the codebase that:
1. Create unique, consistent reference points that Claude can easily locate
2. Provide semantic structure to code sections
3. Enable precise referencing of specific code elements
4. Facilitate context preservation across conversations

## Anchor Format

Memory anchors follow this standard format:

```typescript
// [CLAUDE:ANCHOR:${TYPE}:${UUID}:${NAME}]
// ${DESCRIPTION}
// [/CLAUDE:ANCHOR:${TYPE}:${UUID}]
```

Where:
- `${TYPE}` is the type of anchor (e.g., COMPONENT, FUNCTION, HOOK, EFFECT, STATE, HANDLER)
- `${UUID}` is a unique identifier (use format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
- `${NAME}` is a human-readable name for the anchor
- `${DESCRIPTION}` is a brief description of the anchored code section

## Anchor Types

### COMPONENT
Use for React component definitions:

```typescript
// [CLAUDE:ANCHOR:COMPONENT:123e4567-e89b-12d3-a456-426614174000:AppComponent]
// Main application component that handles the overall UI structure and state
// [/CLAUDE:ANCHOR:COMPONENT:123e4567-e89b-12d3-a456-426614174000]
function App() {
  // Component code...
}
```

### FUNCTION
Use for important function definitions:

```typescript
// [CLAUDE:ANCHOR:FUNCTION:123e4567-e89b-12d3-a456-426614174001:HandleSubmit]
// Processes form submission, validates inputs, and calls API
// [/CLAUDE:ANCHOR:FUNCTION:123e4567-e89b-12d3-a456-426614174001]
const handleSubmit = () => {
  // Function code...
}
```

### HOOK
Use for custom hooks or important hook usage:

```typescript
// [CLAUDE:ANCHOR:HOOK:123e4567-e89b-12d3-a456-426614174002:UseDarkMode]
// Custom hook that manages dark mode state and persistence
// [/CLAUDE:ANCHOR:HOOK:123e4567-e89b-12d3-a456-426614174002]
const useDarkMode = () => {
  // Hook code...
}
```

### EFFECT
Use for useEffect implementations:

```typescript
// [CLAUDE:ANCHOR:EFFECT:123e4567-e89b-12d3-a456-426614174003:FetchDataEffect]
// Fetches initial data when component mounts and when filters change
// [/CLAUDE:ANCHOR:EFFECT:123e4567-e89b-12d3-a456-426614174003]
useEffect(() => {
  // Effect code...
}, [dependencies]);
```

### STATE
Use for important state definitions:

```typescript
// [CLAUDE:ANCHOR:STATE:123e4567-e89b-12d3-a456-426614174004:AuthState]
// Authentication state including user info and permissions
// [/CLAUDE:ANCHOR:STATE:123e4567-e89b-12d3-a456-426614174004]
const [auth, setAuth] = useState({
  // State initial value...
});
```

### HANDLER
Use for event handlers:

```typescript
// [CLAUDE:ANCHOR:HANDLER:123e4567-e89b-12d3-a456-426614174005:ClickHandler]
// Handles click events on the main action button
// [/CLAUDE:ANCHOR:HANDLER:123e4567-e89b-12d3-a456-426614174005]
const handleClick = (e) => {
  // Handler code...
}
```

## Usage Guidelines

1. **Be Selective**: Don't add anchors to every code element. Focus on:
   - Key components
   - Complex functions
   - Important state management
   - Critical effects or handlers
   - Code that is frequently discussed or modified

2. **Maintain Uniqueness**: Generate a new UUID for each anchor to ensure uniqueness.

3. **Use Descriptive Names**: Make the anchor name descriptive of its purpose.

4. **Provide Detailed Descriptions**: Include enough context in the description for Claude to understand the purpose without seeing the code.

5. **Update Anchors When Moving Code**: If code with an anchor is moved, preserve the anchor and UUID to maintain referenceability.

## Referencing Anchors

When discussing code with Claude, you can reference anchors using their UUID or name:

- "Can you help me understand the FetchDataEffect anchor?"
- "I'm having an issue with the component at UUID 123e4567-e89b-12d3-a456-426614174000"

Claude will be able to locate these anchors and provide more contextually relevant assistance. 