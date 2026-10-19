# SPEC.md — Specification Template (BA Agent)

> **Instructions**: Copy this template for each feature. Fill all sections. Link to parent epic.

## Feature: [Feature Name]

| Field | Value |
|-------|-------|
| Spec ID | SPEC-XXX |
| Epic | [Epic name / ID] |
| Author | BA Agent |
| Date | YYYY-MM-DD |
| Status | Draft / Review / Approved |
| Reviewers | Lead |

## User Stories

```
As a [role],
I want [feature/action],
So that [benefit/outcome].
```

_Add multiple stories as needed._

## Acceptance Criteria

```gherkin
Scenario: [Scenario name]
  Given [precondition]
  When [action]
  Then [expected result]
  And [additional expectation]
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/v1/resource` | Create resource |
| `GET` | `/api/v1/resource/{id}` | Get resource by ID |

### Request/Response Schemas

```json
// POST /api/v1/resource - Request
{
  "name": "string (required)",
  "description": "string (optional)"
}

// Response 201
{
  "id": "uuid",
  "name": "string",
  "created_at": "datetime"
}
```

## Database Schema Changes

| Table | Column | Type | Constraints | Notes |
|-------|--------|------|-------------|-------|
| `resources` | `id` | `UUID` | PK, default gen | |
| `resources` | `name` | `VARCHAR(255)` | NOT NULL | |
| `resources` | `created_at` | `TIMESTAMPTZ` | NOT NULL, default now | |

### Relations

- `resources.project_id` → `projects.id` (FK, ON DELETE CASCADE)

## UI Description

_Describe the interface: layout, key components, user interactions. Reference wireframes if available._

## Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Response time | < 200ms for API calls |
| Concurrency | Support 10 concurrent users |
| Data retention | 5 years |

## Dependencies

- [ ] Depends on: [other spec/feature]
- [ ] Blocked by: [blocker if any]

## Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [Risk description] | Low/Med/High | Low/Med/High | [Mitigation plan] |
