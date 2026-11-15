# Presentation Layer UI Test Report — Stage 3.1 (UI Structure and Styling)

**Component under test:** `index.html`, `style.css`, `app.js` (static dashboard with mock data; no Firestore)
**Test code:** `tests/presentation-layer/test-ui-structure.html`, `tests/presentation-layer/test-ui-structure.js`
**Execution record:** `tests/presentation-layer/presentation-layer-ui-test-output.txt`
**Evidence screenshots:** `tests/presentation-layer/evidence/`
**Design reference:** `docs/design/Clean TaskFlow Dashboard Interface.png`
**Execution date:** 2026-11-15
**Test IDs:** T09–T17 (continuing the manual test series in `testing-journal.md`)

## Test Objective

Verify that the static dashboard matches the design reference and is responsive at desktop, tablet, and mobile widths, using mock data. Firestore is not used in this stage.

## Testing Approach and Environment

- The page is loaded unchanged in iframes of 1280 px (desktop), 820 px (tablet), and 390 px (mobile) so its own CSS media queries respond to those widths. Automated DOM checks (T09–T16) run from a button on `test-ui-structure.html`.
- T17 (visual comparison with the reference) is a manual judgement made by viewing the screenshots next to the reference image. There is no pixel-by-pixel comparison.
- Browser: Chrome, with the project served locally (`python3 -m http.server 8000`).
- Mock data: 12 tasks. The first five are the rows shown in the reference; the other seven were added for testing (one has no due date, one has a very long title). The summary counts (12 / 4 / 5) are calculated from the mock data and happen to equal the numbers in the reference.

### How to run again

From the project root:

```
python3 -m http.server 8000
```

Open `http://localhost:8000/tests/presentation-layer/test-ui-structure.html`, open Developer Tools → Console, and click **Run UI Checks**.

## Summary

| Run | Tests | Passed | Failed |
| --- | ----- | ------ | ------ |
| Run 1 (before fix) | T09–T16 | 7 | 1 (T14) |
| Run 2 (after fix)  | T09–T16 | 8 | 0 |
| Manual (T17)       | T17     | 1 | 0 |

## Test Cases and Results

Actual results are from Run 2 (see the execution record for Run 1).

| ID  | Scenario | Expected Result | Actual Result | Status |
| --- | -------- | --------------- | ------------- | ------ |
| T09 | Dashboard structure and components | Header, summary cards, Add New Task controls, Task List table and rows, and feedback containers are present as in the design reference. | Header, 3 summary cards, Add New Task controls, Task List table with 4 columns and 12 rows (status, due date, edit, delete in each), and hidden feedback containers are all present. | Pass |
| T10 | Status indicators and due date presentation | Each status has its own indicator; due dates are shown as "Mon D, YYYY" or "No due date"; summary counts match the data. | Three distinct status colours; 11 dates in "Mon D, YYYY" format plus 1 "No due date"; summary counts 12/4/5 match the 12 mock rows. | Pass |
| T11 | Text readability (contrast) | Status indicators, task titles, due dates and labels have at least 4.5:1 contrast. | All checked elements at least 4.5:1 (lowest: Completed indicator 4.8:1; others 5.6:1 to 17.9:1). | Pass |
| T12 | Desktop layout (1280 px) | Three summary cards in a row, one-row form, table list; no overflow or clipping. | No horizontal overflow or clipping. Summary cards in one row, form controls in one row, Task List shown as a table with a header row. | Pass |
| T13 | Tablet layout (820 px) | Summary cards in a row, title field on its own row above date/status/button, table list; no overflow or clipping. | No horizontal overflow or clipping. Summary cards in one row, title field on its own full-width row with date, status and button below it, Task List still a table. | Pass |
| T14 | Mobile layout (390 px) | Stacked summary cards and form controls, task rows as cards; no overflow or clipping. | No horizontal overflow or clipping. Summary cards and form controls stacked; each task shown as a card (title and actions above status and due date); table header visually hidden; action icons aligned to the right edge. | Pass (Run 1: Fail) |
| T15 | Feedback containers | Success, error, and loading/empty message areas are visible, distinct, readable, and cause no overflow when shown. | All visible, success and error styled differently, error contrast at least 4.5:1, no overflow. Revealed manually for this check; not yet used by the app. | Pass |
| T16 | No Firestore or Data Layer access | The static dashboard makes no Firebase requests and imports no Data Layer or Application Layer module. | 2 resources loaded (none Firebase-related); `app.js` has no import statements and `index.html` references no Firebase or service module. | Pass |
| T17 | Visual comparison with the design reference (desktop, manual) | Layout, visual hierarchy, colours, spacing, typography and component styling follow the reference as closely as reasonably possible. | See the observations below. | Pass (with noted differences) |

### T14 — Failure in Run 1 and resolution

- **Run 1 result:** Fail, with the message "Row card layout is not title/actions above status/date."
- **Investigation:** Measurements in the browser, and the screenshot of the mobile preview, showed two things:
  1. The check required the title and action cells to have almost the same top. They are vertically centred, so their tops differ by 5–7 px. This was a flaw in the check.
  2. A real layout defect: the edit and delete icons were left-aligned inside a wide column instead of at the card's right edge, and moved from row to row.
- **Resolution:** the mobile layout in `style.css` now right-aligns the actions cell. The check in `test-ui-structure.js` now tests that cells share a line (vertical overlap), reports each condition separately, and checks that the icons are within 12 px of the right edge of the due date column.
- **Run 2 result:** Pass. No screenshot of the defect was saved as a file; the "after" evidence is `evidence/mobile-390-task-list.jpg`.

### T17 — Visual comparison observations

Compared `evidence/dashboard-desktop.jpg` with the reference image.

**Matches the reference**
- Header: blue rounded checkbox logo, "TaskFlow" title, and the tagline aligned under the title.
- Three summary cards (Total Tasks, In Progress, Completed), each with a coloured icon tile, a label, and a large count (12 / 4 / 5).
- "Add New Task" card with one row: title input, due date input with a calendar icon, status dropdown showing "To Do", and a blue "+ Add Task" button.
- "Task List" card with a grey header bar (Task, Status, Due Date, Actions), rows separated by thin lines, grey / blue / green status pills, due dates such as "Jun 20, 2026" with a calendar icon, and a blue edit icon and red delete icon.
- Palette (sampled from the reference): white cards with soft shadows on a near-white blue-tinted background, blue primary colour, pill colours.

**Differences**
- Typeface: the reference uses a specific sans-serif; the implementation uses the system font stack as agreed, so letterforms differ slightly.
- Scale: the reference is a mock-up image; the page uses a 1100 px maximum content width with the reference proportions scaled to a normal 16 px body size, so spacing and row heights are close but not identical.
- Icons are redrawn inline SVG and are similar, not identical, to the reference icons.
- The page shows 12 mock rows; the reference shows 5.
- Exact colours were taken from sampled pixels of a compressed image, so they are approximate.

## Limitations and Remaining Items

- Responsive behaviour was checked at 1280, 820, and 390 px (iframe widths) in Chrome only. The breakpoints (900 px and 600 px) were chosen in this stage; other browsers, other widths, and physical devices were not tested.
- T17 is a visual judgement, not an automated comparison.
- The Add Task form, edit and delete icons, and the due date field do nothing yet (Stage 3.3). The due date field switches from text to a date picker on focus; the look of the native picker was not checked in other browsers.
- Keyboard navigation and screen reader behaviour were not formally tested.
- The feedback containers were revealed manually; they are connected in Stages 3.2 and 3.3.
- `app.js` no longer imports `firebase.js`, so it no longer prints the Firebase initialisation message to the Console (the check used in T04). `firebase.js` itself is unchanged.
