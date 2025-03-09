# Code Index Directory

This directory contains pre-analyzed semantic relationships within the codebase, providing Claude with deep contextual understanding of code structure and intent.

## Files in this Directory

### function_call_graph.json
A detailed map of function-to-function calls throughout the codebase:
- Caller function
- Called function
- File locations
- Call relationships (direct/indirect)
- Parameter mapping

### type_relationships.json
A catalog of type relationships and interfaces:
- Type hierarchy
- Interface implementations
- Type extensions
- Generic type usage
- Type utilities

### intent_classification.json
Semantic intent classification for code sections:
- UI rendering sections
- State management sections
- Data fetching sections
- Event handling sections
- Utility functions
- Side effect management

## Usage

This directory helps Claude understand:
1. How functions are connected and depend on each other
2. Type relationships and interface implementations
3. The intended purpose of different code sections

This semantic understanding enables Claude to provide more accurate recommendations, better understand code context, and suggest more appropriate solutions during development.

## Maintenance

When making significant code changes:
1. Update `function_call_graph.json` when adding/modifying function calls
2. Update `type_relationships.json` when modifying type definitions
3. Update `intent_classification.json` when changing the purpose of code sections

The accuracy of this index directly impacts Claude's ability to understand the codebase semantically. 