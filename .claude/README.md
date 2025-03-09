# Claude Optimization Structure

This directory contains metadata, documentation, and structured information designed to optimize interactions between Claude AI and this codebase. The structure is designed to provide Claude with contextual information, semantic relationships, and historical data to improve code understanding and assistance quality.

## Directory Structure

- **metadata/**: Contains normalized information about the codebase
  - Component dependency graphs in machine-readable format
  - File classification metadata
  - Error patterns and solutions database

- **code_index/**: Contains pre-analyzed semantic relationships
  - Function-to-function call graphs
  - Type relationships and interface implementations
  - Intent classification for code sections

- **debug_history/**: Maintains a history of debugging sessions
  - Error-solution pairs
  - Categorized by component and error type
  - Context and code versions for each fix

- **patterns/**: Contains canonical implementation patterns
  - Interface patterns with uncertainty handling
  - Error handling patterns
  - Composition patterns for reliability

- **cheatsheets/**: Contains component-specific quick-reference guides
  - Common operations on each component
  - Known pitfalls and edge cases
  - Component-specific "gotchas"

- **qa/**: Contains a database of previous solved problems
  - Indexed by component, file, and error type
  - Context from the fix process
  - Reasoning used to solve each problem

- **documentation/**: Contains model-friendly documentation
  - Purpose (what components do)
  - Schema (data structures and relationships)
  - Patterns, interfaces, invariants, and error states

- **delta/**: Contains semantic change logs
  - API changes and implications
  - Behavior changes not obvious from diffs
  - Reasoning behind significant changes

## Usage

This structure is primarily designed for AI models like Claude to better understand the codebase. Developers can also use this structure to:

1. Understand component relationships and dependencies
2. Learn from previous debugging sessions
3. Follow established patterns when extending the codebase
4. Quickly identify potential issues with specific components

## Maintenance

Please maintain this structure when making significant changes to the codebase:

1. Update dependency graphs when adding/removing components
2. Document new error patterns and solutions
3. Add entries to the debug history when solving complex issues
4. Update cheatsheets with new gotchas and common operations
5. Create delta summaries when making API changes

This will ensure ongoing optimization for AI assistance and developer productivity. 