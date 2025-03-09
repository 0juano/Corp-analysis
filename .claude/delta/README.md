# Delta Directory

This directory maintains semantic change logs between versions of the codebase, focusing on API changes, behavior changes, and the reasoning behind significant modifications. It serves as a record of the codebase's evolution beyond what can be inferred from simple diffs.

## Purpose

The delta summaries in this directory help Claude:
1. Understand the rationale behind changes that might not be obvious from code diffs
2. Track API evolution and breaking changes
3. Recognize subtle behavioral changes
4. Understand the historical context of code decisions

## Structure

### delta_template.json
A template for documenting semantic changes with the following structure:
```json
{
  "id": "unique-delta-id",
  "timestamp": "ISO date string",
  "version": {
    "from": "Previous version",
    "to": "New version"
  },
  "summary": "Brief summary of the changes",
  "api_changes": [
    {
      "component": "Affected component",
      "type": "Change type (e.g., Breaking, Non-breaking, Deprecation)",
      "description": "Description of the API change",
      "migration_path": "How to migrate from the old API to the new one",
      "code_example": {
        "before": "Code example before the change",
        "after": "Code example after the change"
      }
    }
  ],
  "behavior_changes": [
    {
      "component": "Affected component",
      "description": "Description of the behavior change",
      "reason": "Reason for the behavior change",
      "implications": [
        "Implications of this behavior change"
      ],
      "affected_areas": [
        "Other areas affected by this change"
      ]
    }
  ],
  "architectural_changes": [
    {
      "description": "Description of the architectural change",
      "reason": "Reason for the architectural change",
      "benefits": [
        "Benefits gained from this change"
      ],
      "tradeoffs": [
        "Tradeoffs accepted with this change"
      ]
    }
  ],
  "performance_impacts": [
    {
      "component": "Affected component",
      "description": "Description of the performance impact",
      "metrics": {
        "before": "Performance metrics before the change",
        "after": "Performance metrics after the change"
      },
      "optimization_details": "Details of the optimization or regression"
    }
  ],
  "reasoning": {
    "decision_factors": [
      "Factors that influenced the decision to make these changes"
    ],
    "alternatives_considered": [
      {
        "approach": "Alternative approach considered",
        "pros": [
          "Advantages of this approach"
        ],
        "cons": [
          "Disadvantages of this approach"
        ],
        "reason_rejected": "Why this approach wasn't chosen"
      }
    ],
    "future_considerations": [
      "Considerations for future changes building on these changes"
    ]
  },
  "related_changes": [
    "References to related delta entries"
  ]
}
```

## Usage

These delta summaries help Claude:
1. Understand why code evolved in certain ways
2. Provide context-aware assistance that respects the codebase's history
3. Recommend changes that align with the codebase's evolution trajectory
4. Explain historical decisions that might otherwise seem puzzling

## Maintenance

When making significant changes to the codebase:
1. Create a new delta entry using the template
2. Focus on documenting the "why" rather than just the "what"
3. Explicitly document API changes and migration paths
4. Explain subtle behavior changes that might not be obvious from the code
5. Document the reasoning behind architectural decisions

Maintaining these delta summaries ensures that the history and rationale of the codebase is preserved for future development. 