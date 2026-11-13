I want to establish a consistent approach for maintaining the TaskFlow development journal.

Please read the existing `docs/development-journal.md` and follow these documentation management principles from now on.

## 1. Maintain the Overall Project Roadmap

The existing Implementation Roadmap (Stage 0–Stage 4) represents the overall development process.

Treat this as the master roadmap.

Do not remove or restructure the agreed stages unless I explicitly request a change.

Keep the overall roadmap relatively stable. Update it only when the project scope, stage structure, or major development direction changes.

## 2. Maintain Detailed Plans for Each Stage

Each development stage should have its own detailed implementation plan.

Before implementation begins, I will discuss the stage with ChatGPT and finalise its implementation plan.

I will then provide you with the agreed plan.

Your responsibility is to:

- Add the plan to the corresponding stage in the development journal.
- Preserve the existing planning framework:
  1. Define the Objective
  2. Identify Requirements
  3. Identify Dependencies
  4. Determine Implementation Sequence
  5. Define Expected Outcomes & Testing
- Keep each stage's planning and implementation progress clearly separated.
- Avoid inventing technical decisions or requirements that have not been agreed.

Do not create detailed implementation plans for future stages prematurely.

## 3. Maintain Current Project Progress

Keep the project progress section up to date.

For each stage, distinguish between:

- Planning Status
- Implementation Status
- Testing Status

Use clear statuses such as Not Started, In Progress, and Completed.

The current stage should reflect the actual work being performed.

When a new stage begins, update the current project status accordingly without losing the history of previous stages.

## 4. Maintain the Testing Log

Continue maintaining the central Testing Log in file testing-journal.md

Record all meaningful tests performed throughout the project, including tests performed during implementation and final QA.

Use sequential test IDs and record actual results.

Do not invent test results or mark unverified functionality as passed.

## 5. Documentation Workflow

Whenever I provide a new agreed stage plan, implementation decision, completed task, or test result:

1. Identify the relevant section in the journal.
2. Update the existing section or append the new information.
3. Preserve previous useful information and testing history.
4. Keep the document consistent and avoid duplicate entries.
5. Save the updated journal.

If information is unclear or a technical decision has not been confirmed, ask me rather than making assumptions.

The development journal should remain the single source of truth for the project's agreed roadmap, stage plans, progress, and testing history.

For now, only acknowledge these documentation rules. Do not create plans for future stages or modify the application code.
