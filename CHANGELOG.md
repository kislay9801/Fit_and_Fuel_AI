# Changelog

## 2026-06-03

### Security and API hardening
- Added Pydantic validation for session and coaching payloads, including allowed exercise values, score ranges, rep bounds, and list defaults.
- Added `X-User-Id` checks to session create, fetch, and delete endpoints.
- Scoped session deletion by both `session_id` and `user_id` to prevent deleting another local user's records by ID.
- Replaced raw backend exception details in session routes with logged server errors and generic client responses.
- Added bounded validation for session history `limit`.

### Frontend correctness
- Updated the API client to send `X-User-Id` for protected session routes.
- Fixed live rep phase propagation from the MediaPipe overlay into the session UI.
- Moved coaching summary auto-fetching from render-time `useState` usage to `useEffect`.
- Isolated MediaPipe smoother and rep-counter refs per overlay instance.
- Added safer MediaPipe cleanup, requestAnimationFrame cancellation, and duplicate-send protection.
- Avoided unnecessary canvas resizing on every MediaPipe result.
- Revoked uploaded video object URLs when replacing videos or unmounting the upload component.

### Tests
- Added backend API tests for session creation, validation, owner-scoped fetch/delete behavior, and missing-user-header rejection.
- Added frontend utility tests for angle calculation, scoring bounds, and rep counting state transitions using Node's built-in test runner.
- Added backend test dependencies: `pytest` and `httpx`.
- Added frontend `npm test` script.

### Verification
- `backend\venv\Scripts\python.exe -m pytest backend\tests` passes.
- `npm test` passes in `frontend`.
- `npm run build` passes in `frontend`; Vite still reports a large chunk warning.
