# 03 — Form Logic Audit 🧩

## Summary
- Goal: Identify places managing form state with `useState` / `onChange` and propose migration to React Hook Form + Zod (`@hookform/resolvers`).

---
## High-priority forms (candidates for RHF migration)

1. **`src/pages/LoginRegisterPage.tsx`**
   - Current: uses multiple `useState` variables (`email`, `password`, `confirmPassword`, `termsAgreed`, etc.), manual validation, and imperatively submits via auth mutations.
   - Recommendation: Replace with `useForm` (RHF) + `zod` schema (login vs register variants), wire `onSubmit` to mutation `useLogin` / `useRegister` and use `formState` for validation errors and `isSubmitting`.
   - Complexity: **Medium** (form logic is localized, but requires zod schema and test cases; existing mutation calls can be reused as `mutation.mutateAsync(formData)`).

2. **`src/components/page/MyPage/ProfileEditForm.tsx`**
   - Current: receives state via props and exposes `onFormChange`, uses local `useState` for email validation.
   - Recommendation: Convert to an RHF-based controlled form used by parent `Profile` container; validate email with zod. Keep existing controlled `AutocompleteFilterField` / `SelectFilterField` as RHF `Controller` components.
   - Complexity: **Low–Medium**

3. **Problem Creation (various)**
   - Files: `src/components/page/ProblemCreatePage/*` (StartPhase, ResultEditor, AnalysisPhase)
   - Current: complex multi-step flows using store + some `useState` local error tracking and a custom generation state machine.
   - Recommendation: Keep the generation flow in the store, but use RHF for dialog-based edits (e.g., `ResultEditor` edit dialog), and ensure forms are RHF-compatible for easier validation and serialization. `StartPhase` could use RHF for text inputs and connect to the generation store for files/options.
   - Complexity: **Medium–High** (multi-step + interplay with store)

4. **`src/components/common/forms/*`**
   - `OptionListEditor`, `TextInputField` (delete), `KeywordInput`, etc. Many are already controlled via props — make them `Controller`-friendly to integrate with RHF.
   - Complexity: **Low** (adapter work)

---
## Detection notes
- Detected controlled inputs using `onChange={(e) => setX(e.target.value)}` and `value={...}` across pages/components such as `LoginRegisterPage`, `TopMenuBar` (search), `ProfileEditForm`, `ProblemCreatePage` components and the result editing dialogs.

---
## Actionable next steps
1. Convert localized forms (Login/Register, Profile edit, Result edit dialog) to RHF first (low risk, high return).
2. Add `zod` schemas for each form to centralize validation and enable `@hookform/resolvers`.
3. Replace controlled components or adapt them to be RHF `Controller`-friendly (option objects, multi-selects, Autocomplete, Checkbox groups).
4. For large multi-step generator flows, prepare a migration plan that keeps the store for stateful processes but uses RHF for the user-editable forms.

---
## Complexity guidance
- Small, single-view forms → **Low–Medium**
- Multi-step flows + server-side validation → **Medium–High**

