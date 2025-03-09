# Documentation Directory

This directory contains model-friendly documentation specifically designed to help Claude understand the codebase more effectively. The documentation follows a structured format with explicit sections that make it easier for AI models to parse and comprehend the code's architecture, purpose, and behavior.

## Purpose

The documentation in this directory serves to:
1. Provide clear, structured information about components and modules
2. Explicitly document aspects of the code that might be implicit to human developers
3. Create reference material that Claude can easily parse and leverage
4. Establish invariants and constraints that must be maintained

## Structure

### components/
This subdirectory contains component-specific documentation, organized by component name:
- `App.md`: Documentation for the App component
- Other component-specific files as they are added

### documentation_template.md
A template for creating model-friendly documentation with the following sections:

```markdown
# [Component/Module Name]

## Purpose
Clear description of what this component does and its role in the application.

## Schema
Detailed description of data structures and their relationships:
- Types and interfaces used
- State structure
- Props structure
- Key data transformations

## Patterns
Common usage patterns for this component:
- Initialization patterns
- Update patterns
- Interaction patterns
- Integration patterns

## Interfaces
All public interfaces exposed by this component:
- Props interface
- Event handlers
- Public methods
- Context provided
- Emitted events

## Invariants
Conditions that must remain true throughout the component's lifecycle:
- State invariants
- Props invariants
- Rendering invariants
- Performance invariants

## Error States
Possible error conditions and how they are handled:
- Input validation errors
- Runtime errors
- Edge case handling
- Fallback behaviors
```

## Usage

This documentation helps Claude:
1. Understand the purpose and behavior of components
2. Recognize and maintain invariants
3. Identify appropriate patterns for modifications
4. Anticipate potential error states
5. Work with component interfaces correctly

## Maintenance

When adding or significantly modifying components:
1. Create or update the component's documentation file
2. Ensure all sections are filled out completely
3. Document any new invariants or constraints
4. Update interface documentation when APIs change
5. Add new error states as they are identified

Keeping this documentation current is essential for Claude to provide accurate and context-aware assistance. 