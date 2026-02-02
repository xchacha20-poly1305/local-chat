# AGENTS.md

## Project Architecture
- Stack: React + TypeScript + ViewModel.
- UI: `src/App.tsx` is declarative rendering and event wiring only; no direct business state mutations.
- ViewModel: `src/viewmodel.ts` owns state snapshots, actions (CRUD), persistence (localStorage), i18n, and the Chrome Prompt API session.
- Build: Vite + Bun for dependency management and bundling; entry `index.html` -> `src/main.tsx`.

## Code Style Constraints
- Reduce unnecessary comments. And good comments should explain “why,” not “what.”
- Respect the TypeScript type system; avoid overusing `any` (prefer explicit types, unions, or generics).
