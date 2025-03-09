# Debug History Directory

This directory maintains a historical record of debugging sessions, error-solution pairs, and lessons learned while working with this codebase. It helps Claude leverage past debugging experience to more efficiently solve similar issues in the future.

## Structure

### components/
This subdirectory contains component-specific debugging histories, organized by component name:
- `App.json`: Debug history for the App component
- Other component-specific files as they are added

### session_template.json
A template for logging debugging sessions with the following structure:
```json
{
  "id": "unique-session-id",
  "timestamp": "ISO date string",
  "component": "ComponentName",
  "error": {
    "message": "Error message",
    "type": "Error type (e.g., TypeError, SyntaxError)",
    "stack": "Stack trace if available",
    "context": "Code context where the error occurred"
  },
  "investigation_steps": [
    {
      "step": "Description of investigation step",
      "findings": "What was discovered"
    }
  ],
  "solution": {
    "description": "Description of the solution",
    "code_changes": "Description or diff of code changes made",
    "verification": "How the fix was verified"
  },
  "lessons_learned": [
    "Insight or lesson learned from this debugging session"
  ],
  "related_issues": [
    "References to related debugging sessions"
  ]
}
```

## Usage

This directory helps Claude:
1. Recognize patterns in errors that have occurred before
2. Apply previously successful debugging strategies
3. Avoid previously attempted unsuccessful approaches
4. Leverage insights from past debugging sessions

## Maintenance

After resolving significant bugs or errors:
1. Create a new debugging session entry using the template
2. Place it in the appropriate component directory
3. Ensure all fields are filled with detailed information
4. Link related issues where applicable

The more detailed and structured the debug history, the more effectively Claude can leverage past experiences to solve new problems. 