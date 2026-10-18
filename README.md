# Adaptive Memory Match

> **PS09**: Responsive memory matching game built with React 18, TypeScript, and Tailwind CSS, featuring an explainable dynamic difficulty engine and a modern frosted glass aesthetic.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Tests-Vitest%20%26%20Playwright-34D399?style=flat-square&logo=vitest&logoColor=white)](tests/)
[![Accessibility](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-8B5CF6?style=flat-square)](https://www.w3.org/WAI/standards-guidelines/wcag/)

---

## Overview

**Adaptive Memory Match** is a client-side web application challenging players to locate 8 matching symbol pairs on a 4×4 card grid. Built with architectural purity and testability in mind, the game dynamically benchmarks cognitive performance across rounds to adjust future difficulty—providing transparent, explainable rationales for every adjustment.

### Key Highlights

- **Dynamic & Explainable Adaptive Difficulty**: Analyzes moves and completion times per round to seamlessly promote, maintain, or relax difficulty (Easy, Medium, Hard), displaying human-readable justification for every adjustment.
- **Deterministic Seeded PRNG**: Generates reproducible card layouts using the Mulberry32 32-bit PRNG combined with an unbiased Fisher-Yates shuffle.
- **Robust Concurrency & Race-Condition Safeguards**: Implements a strict mismatch lock preventing 3rd card selections, alongside monotonic generation tokens that immediately invalidate stale delayed callbacks upon game restart.
- **Liquid Glass Aesthetic**: Translucent frosted glass containers, smooth 3D card flips, subtle concentric geometry, and responsive multi-column layouts optimized for desktop, tablet, and mobile screens.
- **Accessibility by Design (WCAG 2.1 AA)**: Full keyboard navigation (Tab, Space, Enter, Esc), ARIA live-region announcements, and non-leaking screen-reader labels that protect card mystery until flipped.
- **Resilient Local Persistence**: Stores anonymized session history, personal bests, and aggregate win rates in `localStorage` with automated recovery from corrupted or malformed data.

---

## Tech Stack

| Domain | Technology | Purpose |
|---|---|---|
| **Core Framework** | React 18.3 & TypeScript 5.7 | Component architecture & strict type safety |
| **Bundler & Tooling** | Vite 6.2 | Fast HMR development server and optimized production build |
| **Styling** | Tailwind CSS 3.4 & PostCSS | Utility-first glassmorphism design tokens |
| **Icons & Effects** | Lucide React & Canvas Confetti | Minimalist SVG iconography and win celebration particles |
| **Unit Testing** | Vitest 3.2 & Testing Library | Fast unit and component integration testing |
| **E2E Testing** | Playwright 1.57 | Multi-viewport end-to-end browser journey automation |
| **Code Standards** | ESLint 9 (Flat Config) | Automated linting and static code analysis |

---

## System Architecture

The application is structured with strict separation between pure game state computation, asynchronous UI orchestration, and declarative rendering:

```text
src/
├── app/               # Application-level providers (ThemeContext)
├── components/        # UI Presentation Layer
│   ├── dashboard/     # Adaptive difficulty stepper, recent results, tips
│   ├── game/          # GameBoard (4×4 grid), MemoryCard, Status, Controls
│   ├── layout/        # Header, ambient liquid glow background
│   ├── modals/        # Win celebration, stats records, how-to-play
│   └── ui/            # Reusable glass design primitives (GlassPanel, GlassButton, Badge)
├── game/              # Pure Game Engine (State Machine & Logic)
│   ├── constants.ts   # Card symbol metadata & difficulty configurations
│   ├── deck.ts        # Seeded deck creation (16 cards, 8 unique pairs)
│   ├── difficulty.ts  # Adaptive decision engine and performance threshold rules
│   ├── random.ts      # Mulberry32 PRNG and Fisher-Yates shuffle
│   ├── reducer.ts     # Pure finite state reducer handling all transitions
│   └── types.ts       # TypeScript interfaces, states, and action unions
├── hooks/             # Custom React hooks (useGame orchestration, useTheme)
└── lib/               # Storage, analytics computations, and utility helpers
```

### State Transitions & Concurrency Control

The game engine operates as a deterministic finite state machine (`idle` → `previewing` → `playing` → `resolvingMismatch` → `completed`):

1. **Move Accounting**: One move is strictly defined as revealing a pair attempt (two cards). Flipping the first card starts active round timing without consuming a move.
2. **Mismatch Lock**: If two revealed cards do not match, the game locks interaction into the `resolvingMismatch` state. Additional clicks or spamming during this window are rejected.
3. **Monotonic Generation Tokens**: Each new round or restart increments an internal `roundGeneration` token. If a player restarts while a mismatch reveal timer is pending, the stale timeout is discarded cleanly upon execution.

---

## Adaptive Difficulty Engine

Difficulty levels adjust cognitive challenge dynamically without altering the standard 4×4 grid size:

| Difficulty | Initial Preview | Mismatch Reveal Window | Target Player Profile |
|---|---|---|---|
| **Easy** | 2,500 ms (2.5s) | 1,200 ms (1.2s) | Relaxed retention window for casual players |
| **Medium** | 1,200 ms (1.2s) | 900 ms (0.9s) | Balanced cognitive recall challenge |
| **Hard** | 0 ms (None) | 650 ms (0.65s) | Fast-paced memory challenge for advanced players |

### Adaptation Rules

- **Strong Performance** ($\le 12$ moves, or $\le 16$ moves within 45 seconds):
  - Promotes difficulty: Easy → **Medium** → **Hard** *(capped at Hard)*
- **Moderate Performance** ($13–20$ moves within 120 seconds):
  - Retains current difficulty level to reinforce player consistency.
- **Struggling Performance** ($\ge 21$ moves, or elapsed time $> 120$ seconds):
  - Eases difficulty: Hard → **Medium** → **Easy** *(floor at Easy)*

Every round outcome provides transparent user-facing explanations (e.g., *"Outstanding memory! You completed the round in 10 moves (32s). Difficulty increased from Easy to Medium."*).

---

## Getting Started

### Prerequisites

- **Node.js**: `v20.x` or `v22.x` LTS
- **npm**: `v10.x` or higher

### Installation

```bash
git clone https://github.com/HardikMahajan2005/Adaptive-Memory-Match.git
cd Adaptive-Memory-Match
npm install
```

### Development Server

Start the local development server with Hot Module Replacement:

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### Running Tests

```bash
# Run unit and component integration tests (Vitest)
npm test

# Run end-to-end tests (Playwright)
npm run test:e2e
```

### Code Quality & Build

```bash
# Run ESLint
npm run lint

# TypeScript type verification
npx tsc -b

# Production build (compiled to dist/)
npm run build

# Preview production build locally
npm run preview
```

---

## Verification & Documentation

Detailed engineering documentation and verification assets are organized in [`docs/`](docs/):

- [**Architecture Specification**](docs/architecture.md): Deep dive into the pure state reducer, deck generation, and concurrency model.
- [**Acceptance Criteria Traceability**](docs/implementation-status.md): Complete matrix mapping requirements to implementation modules.
- [**Automated Testing Report**](docs/testing.md): Full test coverage breakdown and test suites.
- [**Evaluator Demo Script**](docs/demo-script.md): Step-by-step demonstration walkthrough.
- [**Azure Deployment Plan**](docs/azure-plan.md): Production Azure Static Web Apps cloud hosting and CI/CD strategy.
- [**Sample Deterministic Data**](sample_data/seeds.json): Reproducible PRNG seed fixtures and expected card coordinate pairings.

---

---

## Limitations

1. **Client-Side Persistence Scope**: Game session history, win rates, and streak data are stored locally in the browser's `localStorage`. Clearing browser cache or switching devices resets this data; cross-device synchronization requires an optional cloud database (detailed in [`docs/azure-plan.md`](docs/azure-plan.md)).
2. **Fixed Grid Geometry**: The game is specifically designed and balanced around a 4×4 grid (16 cards, 8 matching pairs) in accordance with the problem statement specifications.
3. **Single-Player Mode**: Gameplay is designed for individual cognitive training and adaptive memory evaluation; real-time multi-user head-to-head competition is not currently supported.

---

## Contributions

- **Design & Architecture**: Designed the pure deterministic state reducer (`gameReducer`) with monotonic generation tokens (`roundGeneration`) for complete race-condition safety.
- **Adaptive Engine**: Modeled multi-tier performance rules (Strong, Moderate, Struggling) and explainable decision algorithms across Easy, Medium, and Hard difficulty levels.
- **UI/UX & Accessibility**: Built responsive Liquid Glass design system with 3D card flipping, full keyboard controls (Tab/Enter/Space), and screen-reader ARIA live feedback.
- **Verification & QA**: Authored 51 automated tests (35 Vitest unit/integration tests and 16 Playwright end-to-end browser journeys) with 100% pass rates.
- *Full individual contribution details*: Refer to [`CONTRIBUTIONS.md`](CONTRIBUTIONS.md).

---

## Submission & Candidate Metadata

- **Candidate Name**: Hardik
- **Roll Number**: 2311981216
- **Branch**: Computer Science & Engineering (CSE)
- **Problem Statement ID**: PS09 — Adaptive Memory Matching Game
- **Institution**: Chitkara University
- **Repository URL**: [https://github.com/HardikMahajan2005/Adaptive-Memory-Match](https://github.com/HardikMahajan2005/Adaptive-Memory-Match)
- **Evaluated Version**: Latest (`main`)
- **Demo Walkthrough**: [`docs/demo-script.md`](docs/demo-script.md)

