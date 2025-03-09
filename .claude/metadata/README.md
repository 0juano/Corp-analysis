# Metadata Directory

This directory contains normalized information about the codebase structure, component relationships, and common error patterns.

## Files in this Directory

### component_registry.json
A comprehensive registry of all React components in the codebase with the following information:
- Component name
- File path
- Purpose/description
- Props interface
- State interface
- Key dependencies

### dependency_graph.json
A machine-readable representation of component dependencies:
- Parent-child relationships
- Import dependencies
- Context dependencies
- Hook dependencies

### file_classification.json
Categorization of files in the codebase:
- Implementation files (component implementations)
- Interface files (type definitions)
- Test files
- Utility files
- Configuration files

### error_patterns.json
A database of common error patterns and their solutions:
- Error message patterns
- Root causes
- Solution patterns
- Prevention strategies

## Usage

This directory is primarily used by Claude to understand the structure and relationships within the codebase. The metadata helps Claude provide more accurate and contextual assistance when working with specific components or troubleshooting issues.

## Maintenance

When adding new components or making significant changes to existing ones:
1. Update `component_registry.json` with new component information
2. Update `dependency_graph.json` with new dependency relationships
3. Update `file_classification.json` with new file classifications
4. Add new error patterns to `error_patterns.json` as they are discovered and resolved 