# Project Contributions & Integrity Statement

**Assessment**: Cerevyn × Chitkara University Round One Technical Assessment  
**Problem Statement**: PS09 — Adaptive Memory Matching Game  
**Candidate Name**: Hardik  
**Roll Number**: 2311981216  
**Branch**: Computer Science & Engineering (CSE)  
**Date**: October 2026  

---

## 1. Individual Contributions

This project was designed, implemented, tested, and validated as an end-to-end production web application:

1. **Problem Analysis & Requirements Mapping**:
   - Analyzed and decomposed all core requirements and evaluation criteria of Problem Statement PS09 into verifiable engineering tasks.
2. **Architecture & State Machine Design**:
   - Engineered the pure-function state reducer architecture (`gameReducer`) separating selection rules, mismatch locking, move calculation, and win detection.
   - Designed the generation-token concurrency safeguard (`roundGeneration`) to guarantee delayed asynchronous timeouts cannot corrupt restarted games.
3. **Adaptive Difficulty Mathematical Modeling**:
   - Defined deterministic performance tiers (Strong, Moderate, Struggling) and bidirectional transition policies across Easy, Medium, and Hard difficulty levels.
   - Formulated transparent, explainable adaptation reasoning generated directly from observed metrics (moves and elapsed time).
4. **UI/UX Design Engineering**:
   - Designed a modern frosted glass aesthetic featuring multi-layered translucent surfaces, geometric card motifs, rim illumination, and responsive dashboard layouts.
5. **Quality Assurance & Test Automation**:
   - Implemented 51 automated tests (35 Vitest unit & component integration tests, 16 Playwright end-to-end tests).
6. **Cloud Deployment Architecture**:
   - Formulated the Microsoft Azure Static Web Apps deployment plan, security configurations, and GitHub Actions CI workflow.

---

## 2. Development & Verification Process

- **Methodology**: Iterative development cycle starting from core deterministic game algorithms, progressing to the state machine, user interface, persistence layer, and automated test coverage.
- **Verification**: All code was compiled, linted, tested, and executed locally. Every automated test was executed and verified with 100% pass rates across browsers.
