# 01 — UI Component Audit ✅

## Summary
- Scope: `src/components/**`
- Goal: Identify components that are (A) simple MUI wrappers that should be deleted, (B) domain UI that should be refactored to use MUI v6 + `sx` / `styled`, and (C) keepers (layout/complex view components).

---
## Method
- Scanned `src/components` files for small files that import `@mui/material` and: (a) simply forward props to a single MUI component, or (b) add only trivial defaults.

---
## Findings (high-confidence candidates)

| Component Path | Recommendation | Refactor Complexity | Why / Notes |
|---|---:|---:|---|
| `src/components/common/forms/TextInputField.tsx` | **Delete** | **Low** | Pure wrapper around `<TextField>` that only sets defaults. Use `<TextField>` directly. |
| `src/components/common/selects/QuestionTypeSelect.tsx` | **Refactor** | **Low** | Domain select with option list — keep semantics but replace internals to rely on MUI v6 + `sx`. Consider exposing options via props and translate labels (`t(...)`). |
| `src/components/common/selects/DifficultySelect.tsx` | **Refactor** | **Low** | Domain select mapping enum→labels. Keep component but move styling to `sx` and ensure i18n usage. |
| `src/components/common/SearchFilterFields/SelectFilterField.tsx` | **Refactor** | **Low** | Thin wrapper that adds an "All" option; convert implementation to use MUI directly and accept `Controller`/RHF-friendly props. |
| `src/components/common/BaseAccordion.tsx` | **Keep** | **Low** | Adds consistent headerAction behavior and layout, keep as-is (structural). |
| `src/components/common/PreviewEditToggle.tsx` | **Keep** | **Low** | Composition + styling of ToggleButtonGroup; keep (use `sx` already). |
| `src/components/common/OptionListEditor.tsx` | **Keep/Refactor** | **Low** | Good reusable controlled component — make it RHF `Controller`-friendly (small work). |

> Note: I did not find widespread Tailwind CSS usage (no `tw-` / `className` utility patterns); project already largely uses MUI + `sx`.

---
## Actionable next steps (PM/Engineering)
1. Schedule deletion of purely redundant wrappers like `TextInputField` (Low effort: replace usages across codebase with `<TextField size="small" fullWidth ... />`).
2. Mark domain-select components as **Refactor** tasks: implement them to be RHF-friendly and use `sx` styling only; add unit tests and i18n keys. (Low effort per component)
3. Audit smaller UI wrappers one more time (search for `forwardRef`/single-line renderers) and deprecate the obvious ones.

---
## Quick cost/effort guidance
- Delete tasks: Low (single PRs, automated bulk replace possible).
- Refactors: Low–Medium (adjust props, add tests, update caller usage where needed).

