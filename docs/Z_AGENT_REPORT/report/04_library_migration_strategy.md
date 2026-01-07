# 04 — Library Migration Strategy & Directory Gaps 🔧

## Overview
This file summarizes targeted migrations for Markdown rendering, i18n practices, and structural/dir changes to align with the new architecture principles.

---
## Markdown: `markdown-it` vs `react-markdown`
- Current: The project uses a `MarkdownBlock` built on the `unified` + `remark` + `rehype` pipeline (sanitizing and stringifying). The repo includes `react-markdown` in dependencies but current Markdown rendering is `unified`-based.
- Files of interest: `src/components/common/MarkdownBlock.tsx` and usages (e.g., `QuestionForm`)
- Migration feasibility: **Low** — `react-markdown` supports `remark` and `rehype` plugins and sanitization (via `rehype-sanitize`). Replacement is straightforward:
  - Implementation: Replace `MarkdownBlock` to use `<ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeSanitize]}>` and add rehype-katex/remark-math if needed.
  - Complexity: **Low** (test for behavior and CSS differences; re-use existing plugins and sanitizers).

---
## i18n (react-i18next)
- Current: `react-i18next` & `i18next` are present and used in many components (`useTranslation()`), but multiple places contain hard-coded Japanese text.
- High-impact examples:
  - `src/pages/LoginRegisterPage.tsx` — large hard-coded Terms text inside Dialog (move to `src/locales/{en,ja}/translation.json` and load with i18n keys).
  - `src/components/page/CreatePage/ResultEditor.tsx` — titles such as '問題文', '解答', etc. (some are using `t()` but others still are direct literals).
  - `src/components/page/MyPage/ProfileEditForm.tsx` — labels like '表示名', 'メールアドレス' — should use `t()`.
- Recommendation: Create a short lint/check step (or script) to find JSX hard-coded string literals (non-empty, non-keyboard symbols) and produce a TODO list for i18n extraction. Prioritize: Terms dialogs, pages, and user-facing messages.
- Complexity: **Low–Medium** (many occurrences but mechanical extraction + unit tests)

---
## Directory / structural gaps (current → ideal)
- The repository is already largely feature-oriented (`src/features/*`) with `hooks/`, `types/`, `stores/` directories.
- Remaining friction points:
  1. **Procedural gateways (`src/services/api/gateway/*`)**: Central gateway layer encourages procedural API consumption from arbitrary layers — conflicts with Strict Layering rule. Action: migrate gateway usage into `features/**/hooks` and eventually prune `gateway/*` exports.
     - Major files to migrate:
       - `src/services/api/gateway/auth.ts` → `features/auth/hooks/*`
       - `src/services/api/gateway/user.ts` → `features/user/hooks/*`
       - `src/services/api/gateway/content.ts` → `features/content/hooks/*`
  2. **Repositories with fetch (e.g., `features/search/repository.ts`, `content/repositories/*.ts`)**: Convert to axios + feature hooks or remove in favor of hooks (the repo file already marked deprecated).
  3. **Cross-layer responsibilities in `src/components`**: Some components contain small business logic (e.g., local API calls or heavy stateful behavior). Move business logic into `features/*` hooks and keep components pure view-only.

---
## Suggested migration strategy and priorities
1. **Quick wins (Low effort)**
   - Replace thin wrappers (see UI audit) and remove `TextInputField`.
   - Convert small forms to RHF (`LoginRegisterPage`, `ProfileEditForm`).
   - Replace `MarkdownBlock` with `react-markdown` variant and run visual tests.

2. **Medium effort**
   - Migrate `useProfile`, `useWallet`, `useStats` to `useQuery` hooks and update callers.
   - Replace `fetch` usages in `features/*/repositories` with axios via `lib/axios`.
   - Extract hard-coded terms and texts into `src/locales/{ja,en}`.

3. **Large / architectural effort (High)**
   - Decommission `services/api/gateway` exposures: for each gateway file, create a migration PR that (a) adds the new feature hook using `useQuery`/`useMutation`, (b) converts the callers to the new hooks, (c) deprecates the gateway export, (d) removes the gateway file when unused.
   - Rework `useGenerationStatus` state machine to integrate with React Query polling or provide a service layer wrapper so the UI uses queries rather than direct stateful `setInterval` loops.

---
## Extra tips
- Add linters or codemods to fast-track mechanical changes (replace `TextInputField` usages; extract `useEffect` fetch→query skeletons).
- Add migration tickets with per-file owners to avoid overlap when refactoring gateways.

---
## Appendix: Example mapping suggestions (short)
- `services/api/gateway/user.getUserProfile` → `features/user/hooks/useUserProfile.ts` (useQuery)
- `services/api/gateway/content.getExam` → `features/exam/hooks/useExamDetail.ts` (useQuery)
- `features/search/repository.searchExams` (deprecated) → remove and rely on `features/content/hooks/useSearch` (already exists)

