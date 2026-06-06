# Technical Debt

## Phase 1 (Must Fix)

- Keep mock localStorage authentication clearly isolated until the pose pipeline is stable.
  - Severity: High
  - Why it matters: `X-User-Id` protects against accidental cross-user access in this local mock, but it is not cryptographic authentication and can be spoofed by any client.
  - Best fix: after the core pipeline is working, replace the mock with verified backend tokens and derive `user_id` server-side.

- Treat local JSON storage as development-only.
  - Severity: High
  - Why it matters: JSON file storage is not safe for concurrent writes, multi-instance deployment, backups, or reliable querying.
  - Best fix: keep JSON for now, then migrate to a real database after the core pose analysis flow is reliable.

- Add file locking or transactional storage if local JSON remains.
  - Severity: High
  - Why it matters: simultaneous writes can overwrite sessions or corrupt `sessions.json`.
  - Best fix: replace JSON storage; otherwise add a cross-platform file lock and atomic write/replace.

- Fix MediaPipe form-analysis assumptions for camera orientation and visibility.
  - Severity: High
  - Why it matters: left/right-only landmarks, mirrored camera assumptions, and missing visibility checks create false positives for valgus, hyperextension, rounding, and elbow flare.
  - Best fix: use landmark `visibility`, camera/view calibration, side selection, and confidence-gated scoring before issuing injury-risk feedback.

## Phase 2 (Should Fix)

- Split the frontend session page into smaller hook/component boundaries.
  - Severity: Medium
  - Why it matters: `Session.jsx` mixes routing, MediaPipe state, scoring, persistence, summary generation, and UI layout.
  - Best fix: extract `useSessionAnalysis`, `useSessionPersistence`, and presentation-only panels.

- Add route-level backend organization and dependency injection.
  - Severity: Medium
  - Why it matters: routes import storage functions directly, making replacement and testing harder as the app grows.
  - Best fix: introduce storage/repository interfaces and FastAPI dependencies.

- Add frontend accessibility pass.
  - Severity: Medium
  - Why it matters: many icon/action buttons lack accessible names, drag/drop upload lacks keyboard parity, and color-coded states need text alternatives.
  - Best fix: add labels, focus-visible styles, keyboard handlers, and semantic regions.

- Fix responsiveness of dense tables and session layout.
  - Severity: Medium
  - Why it matters: history grid and active analysis two-column layout are likely to overflow on mobile.
  - Best fix: add responsive breakpoints, stacked mobile layouts, and horizontally safe table alternatives.

- Reduce production bundle size.
  - Severity: Medium
  - Why it matters: the build emits a chunk over 500 kB, mainly from MediaPipe/Recharts/app code in one route bundle.
  - Best fix: lazy-load session analysis, charts, and route pages.

- Resolve remaining moderate npm audit findings.
  - Severity: Medium
  - Why it matters: Vite/esbuild dev-server advisories remain. The available audit fix requires a major Vite upgrade.
  - Best fix: plan a Vite major upgrade with Node version alignment.

## Phase 3 (Nice to Have)

- Remove committed/generated artifacts from version control.
  - Severity: Low
  - Why it matters: `frontend/node_modules`, `backend/venv`, and `frontend/dist` make review, sync, and repository size worse.
  - Best fix: add/update `.gitignore` and stop tracking generated dependencies/build outputs.

- Repair README encoding and stale documentation.
  - Severity: Low
  - Why it matters: mojibake characters and mismatched claims such as Tailwind v4 vs v3 reduce trust and onboarding quality.
  - Best fix: rewrite README as UTF-8 and align it with the actual mock/local backend state.

- Add linting and formatting scripts.
  - Severity: Low
  - Why it matters: style drift and accidental unused code are harder to catch.
  - Best fix: add `npm run lint`, Python lint/type checks, and CI enforcement.

- Add CI and deployment manifests.
  - Severity: Low
  - Why it matters: tests/builds are manual and deployment assumptions are undocumented.
  - Best fix: add GitHub Actions plus explicit frontend/backend deployment docs.
