# Coding Standards

## Main Rules

1. **Linting**
   - All code must pass ESLint checks
   - No unused references or variables
   - Proper TypeScript typing

2. **Function Length**
   - Maximum 50 lines per function
   - Skip blank lines and comments in the count
   - Split large functions into smaller, focused functions

3. **Documentation**
   - Every function must have JSDoc comments
   - Comments should describe purpose, parameters, and return values
   - Include requirements in code comments

4. **Diagrams**
   - Create a mermaid diagram for each PR
   - Document component relationships
   - Show data flow

5. **Testing**
   - Write tests first in tricky circumstances
   - All generated code must pass tests
   - Focus on edge cases

6. **Code Organization**
   - Use custom hooks for state management
   - Separate concerns into different files
   - Follow the component/hook/context pattern

## ESLint Configuration

Our ESLint configuration enforces:
- No unused variables
- Maximum function length of 50 lines
- Required JSDoc comments for all functions
- TypeScript type checking

## Directory Structure

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

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

Types:
- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests or correcting existing tests
- chore: Changes to the build process or auxiliary tools

## Pull Request Process

1. Create a feature branch from `main`
2. Implement changes following coding standards
3. Include a mermaid diagram in the PR description
4. Ensure all tests pass
5. Request code review
6. Address review comments
7. Merge to `main` after approval 