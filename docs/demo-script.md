# Adaptive Memory Match — Live Assessment Demo Script

**Project**: Adaptive Memory Match  
**Problem Statement**: PS09 — Adaptive Memory Matching Game  
**Target Duration**: 3 to 5 minutes  
**Target Audience**: Technical Assessment Evaluators (Cerevyn × Chitkara University)  

---

## Demo Recording Link
- **Video Link**: `[Insert Loom / Google Drive / YouTube Link here]`
- **Duration**: 3 to 5 minutes

---

## Preparation Checklist
1. Start development server: `npm run dev`
2. Open browser to `http://localhost:5173`
3. Optional: Open Browser Developer Tools Console (`F12`) to demonstrate clean, warning-free state transitions and anonymous storage actions.

---

## 1. Opening & Visual Aesthetics (0:00 – 0:45)
- **Script**:  
  > "Hello, I am presenting my solution for Problem Statement PS09: Adaptive Memory Matching Game. The application is built using React 18, TypeScript 5, and Tailwind CSS.
  > 
  > As you can see, the interface is designed around an Apple iOS 27-inspired Liquid Glass aesthetic featuring multi-layered translucent glass panels, subtle ambient aurora lighting, and a 4×4 card grid with concentric diamond motifs.
  > 
  > The top bar includes our brand header, segmented navigation tabs ('Play', 'How to Play', 'Stats'), and an instant Dark/Light appearance toggle."
- **Action**: Click the Sun/Moon toggle to demonstrate the smooth transition between the dark midnight glass theme and the light frost glass appearance, then switch back to dark mode.

---

## 2. Demonstration 1 & 2: Successful Match & Mismatch (0:45 – 1:30)
- **Script**:  
  > "Now let's examine the core gameplay loop and selection rules:
  > 
  > In accordance with PS09 specifications, one move corresponds to one complete pair attempt (revealing two cards), rather than single card clicks.
  > 
  > Notice that on the Easy level, an opening 2.5-second memory preview allows the player to briefly survey the grid before cards turn face-down.
  > 
  > Let's flip our first card."
- **Action**:
  1. Click Card 1. Point out that the timer starts immediately on first click, the card flips with 3D perspective to reveal its symbol (e.g. Star), and the **Moves** counter remains `0`.
  2. Click an unmatched card (e.g. Leaf). Point out:
     - The **Moves** counter increments to `1`.
     - The system enters the `resolvingMismatch` state.
     - The cards remain visible for the configured mismatch duration (1200ms on Easy) before turning back face-down.
  3. Now click two matching cards (e.g. Heart and Heart). Point out:
     - The cards match and lock permanently with a mint/cyan radiant glow.
     - The **Pairs Found** counter increments to `1/8`.
     - The screen reader live announcer informs assistive technologies of the match.

---

## 3. Demonstration 3: Rapid Card Clicks & Anti-Race Safeguards (1:30 – 2:15)
- **Script**:  
  > "A crucial assessment focus is race condition resilience and input locking. Let's demonstrate that rapid, impatient clicks cannot corrupt the game state:
  > 
  > First, I will rapidly double-click on the same revealed card. Notice the click is safely ignored and does not consume a move or trigger a duplicate action.
  > 
  > Second, while two mismatched cards are resolving, I will rapidly spam-click third and fourth cards across the board.
  > 
  > As you can observe, all clicks during mismatch resolution are strictly locked. Third card selections are ignored, and moves do not increment until the turn is fully resolved."
- **Action**: Rapidly click on card 1, then trigger a mismatch and rapidly click across the grid during the 1.2s window. Show that `selectedCardIds` and `moves` remain completely stable.

---

## 4. Demonstration 4: Restart During a Pending Mismatch Timer (2:15 – 3:00)
- **Script**:  
  > "Requirement AC-12 requires that restarting the game cancels or invalidates all pending timers so that events from an old game cannot leak into a new game.
  > 
  > We implemented this using a monotonic generation token (`roundGeneration`). Let's trigger a mismatch, and immediately click 'Restart' while the mismatch delay is still ticking."
- **Action**:
  1. Flip two non-matching cards.
  2. Within 300ms, click the **Restart** button in the Game Controls panel.
  3. Watch the board reset to a fresh shuffle, moves return to `0`, and elapsed time resets to `00:00`.
  4. Wait for the old timeout to expire (after 1200ms).
  5. Show that the new game is completely unaffected: no cards flip back unexpectedly and no ghost actions occur.

---

## 5. Demonstration 5: Performance-Driven Adaptive Difficulty (3:00 – 4:00)
- **Script**:  
  > "Now we demonstrate the core adaptive difficulty engine:
  > 
  > When a player completes a round with Strong performance (8 to 12 moves or under 45 seconds), the engine promotes them from Easy to Medium, or Medium to Hard.
  > 
  > In the Next Round and Completion modal, the system generates an explainable decision text based on actual metrics.
  > 
  > Furthermore, Medium and Hard levels actually alter the physical gameplay parameters:
  > - Medium shortens the mismatch window to 900ms and reduces the preview to 1.2s.
  > - Hard eliminates the opening preview entirely (0s) and shortens the mismatch window to a snappy 650ms."
- **Action**:
  1. Complete the remaining pairs or demonstrate winning with few moves.
  2. Show the **Round Complete!** modal:
     - Final move count, exact elapsed time, and efficiency percentage (`8 / moves * 100`).
     - Adaptive Difficulty update banner: `Easy → Medium`.
     - Explainable reason: *"Outstanding memory! You found all 8 pairs in 10 moves (32s). Difficulty increased from Easy to Medium."*
  3. Click **Play Next Round (MEDIUM)**. Show that the next game launches immediately on Medium difficulty with a shorter 1.2s preview!

---

## 6. Demonstration 6: Session Analytics, History & Cloud Architecture (4:00 – 5:00)
- **Script**:  
  > "Finally, let's review session persistence and architecture:
  > 
  > In the right sidebar, 'Recent Results' updates automatically with our completed session. Clicking 'View all' opens our Session Analytics modal, displaying:
  > - Total games played, best moves, best time, and average moves.
  > - Distribution breakdown by difficulty.
  > - Full historical logs with clear history confirmation.
  > 
  > Storage is completely anonymous and resilient against corrupt data.
  > 
  > Our repository is configured with:
  > - 48 automated tests (100% passing across Vitest and Playwright).
  > - GitHub Actions CI workflow in `.github/workflows/ci.yml`.
  > - Production Azure Static Web Apps cloud hosting plan in `docs/azure-plan.md`.
  > 
  > Thank you for your review. I am happy to answer any questions or walk through specific code modules."
