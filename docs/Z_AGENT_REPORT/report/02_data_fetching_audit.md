# 02 — Data Fetching Audit 🔎

## Summary
- Scope: `src/**` (hooks, features, pages)
- Goal: Find places using `useEffect` / `fetch` / procedural `gateway` calls that should be migrated to TanStack Query (`useQuery`/`useMutation`).

---
## Key findings
### 1) Hooks using useEffect + gateway/fetch (should become useQuery / useMutation)
- `src/features/user/hooks/useProfile.ts` — calls `getUserProfile()` in `useEffect`
  - Suggestion: Replace with `useQuery(['user','profile'], getUserProfile)` in `features/user/hooks/useUserQuery.ts` and expose mutation hook for `updateUserProfile`.
  - Complexity: **Medium** (needs tests + callers to handle query states)

- `src/features/user/hooks/useWallet.ts` — calls `getWalletBalance()` in `useEffect`
  - Suggestion: `useQuery(['wallet'], getWalletBalance)` with mapping to WalletState.
  - Complexity: **Low**

- `src/features/user/hooks/useStats.ts` — `getUserStats()` inside `useEffect`
  - Suggestion: `useQuery(['user','stats', userId], ...)`.
  - Complexity: **Low**

- `src/features/generation/hooks/useGenerationStatus.ts` — polls `getGenerationStatus(jobId)` via `setInterval`
  - Suggestion: Long-lived polling and state-machine; consider implementing with `useQuery` (refetchInterval) and map response → state machine or keep the machine but replace direct API calls with a small `queryClient.fetchQuery` wrapper. Ensure cancellation and robust error handling.
  - Complexity: **High** (non-trivial state machine + polling + side effects)

- `src/features/content/hooks/useFileUpload.ts` — uses `fetch` for PUT to `uploadUrl`
  - Suggestion: Keep fine-grained file upload logic since `fetch` with presigned PUT is normal, but shift upload job creation and notifications to a mutation hook `useFileUpload` (react-query mutation). Wrap side-effects in features hook.
  - Complexity: **Medium**

### 2) Direct `fetch` usage in repositories (move to axios / feature hooks)
- `src/features/search/repository.ts` — `fetch()` calls (file contains `@deprecated Use useSearch hook instead`)
  - Suggestion: Remove repository (or keep as very small compatibility shim) and ensure `useSearch` (already existing) is the canonical place for queries.
  - Complexity: **Low**

- `src/features/content/repositories/problemRepository.ts` & `questionRepository.ts` — use `fetch()` inside repository classes
  - Suggestion: Replace with axios via `src/lib/axios` or convert to direct use within feature hooks; avoid long-lived repository classes if not necessary.
  - Complexity: **Medium**

### 3) `services/api/gateway/*` present and widely used
- Files: `src/services/api/gateway/*` (auth, user, content, lookups, files, notifications, generation...)
  - Recommendation: Gradually deprecate the gateway module as a central procedural API layer. Preferred patterns:
    - Option A (preferred): Keep minimal API helpers (thin axios wrappers) but call them only inside feature hooks and expose `useQuery`/`useMutation` APIs from `src/features/**/hooks/*`.
    - Option B: Move API calls entirely inside the feature hooks (remove `gateway/*`).
  - Suggested mapping (examples):
    - `gateway/user` → `features/user/hooks/useUserQuery.ts`, `useUserMutation.ts`
    - `gateway/content` → `features/content/hooks/useExamDetail.ts` / `useExamMutation.ts`
    - `gateway/auth` → `features/auth/hooks/useAuth.ts` (already exists; move HTTP calls into the hook's `mutationFn`).
  - Complexity: **Medium–High** depending on scope and number of callers.

---
## Actionable next steps
1. Create a migration checklist for each gateway file: list callers, create a feature hook that wraps the API with `useQuery`/`useMutation`, update callers to use the hook, then remove the gateway export.
2. Prioritize high-impact conversions: `useProfile`, `useWallet`, `useStats` → quick wins (Low–Medium effort).
3. Treat `useGenerationStatus` as a special case — create a design doc for porting to React Query-based polling or encapsulating current state machine so it can call a small `fetchStatus(jobId)` function.

---
## Example mapping table (short)
- `services/api/gateway/user.getUserProfile` → `features/user/hooks/useUserQuery.ts::useUserProfile()` → **Medium**
- `services/api/gateway/content.getExam` → `features/exam/hooks/useExamDetail.ts::useExamDetail()` → **Low**

