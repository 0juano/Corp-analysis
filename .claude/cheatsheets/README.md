# Cheatsheets Directory

This directory contains component-specific quick-reference guides that document common operations, pitfalls, edge cases, and "gotchas" for each significant component in the codebase.

## Purpose

The cheatsheets serve as concentrated knowledge repositories for each component, making it easier for Claude to:
1. Quickly understand how to work with specific components
2. Anticipate and avoid common issues
3. Recommend best practices specific to each component
4. Provide more targeted and effective assistance

## Structure

Each component has its own markdown file following a consistent structure:

### [ComponentName].md

```markdown
# [ComponentName] Cheatsheet

## Common Operations
- Operation 1: Description and example
- Operation 2: Description and example

## Props
- `propName`: Description, type, default value, common values

## State
- `stateName`: Description, initialization pattern, update pattern

## Effects
- Effect 1: Trigger conditions, side effects, cleanup

## Event Handlers
- `handleEventName`: Purpose, behavior, common patterns

## Known Pitfalls
- Pitfall 1: Description, detection, prevention
- Pitfall 2: Description, detection, prevention

## Edge Cases
- Edge case 1: Description, handling strategy
- Edge case 2: Description, handling strategy

## Gotchas
- Gotcha 1: Unexpected behavior, explanation, workaround
- Gotcha 2: Unexpected behavior, explanation, workaround

## Performance Considerations
- Consideration 1: Issue, impact, optimization strategy
```

## Usage

These cheatsheets are designed to be consulted when:
1. Working with a component for the first time
2. Debugging issues with a specific component
3. Extending or modifying component behavior
4. Optimizing component performance

## Maintenance

When working with components:
1. Add new discoveries to the relevant cheatsheet
2. Document new pitfalls or gotchas as they are encountered
3. Update existing entries when better solutions are found
4. Create new cheatsheets for new components

The more comprehensive these cheatsheets become, the more effectively Claude can work with the codebase. 