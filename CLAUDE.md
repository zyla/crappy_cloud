# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a satirical web visualization project that animates flying clouds and tech buzzwords across the screen. It's a humorous commentary on cloud computing and tech industry buzzwords.

## Running the Project

**Simple (no dev server)**:
Simply open `index.html` in a web browser.

**With dev server** (for testing):
```bash
npm install          # Install dependencies (first time only)
npm run serve        # Start dev server at http://localhost:3000
```

## Architecture

The project now uses a **modular architecture** for testability:

### File Structure
```
├── index.html              # Main HTML file with CSS and module imports
├── src/
│   ├── main.js            # Application entry point
│   ├── cloudAnimator.js   # Cloud animation system
│   ├── buzzwordAnimator.js # Buzzword animation system
│   └── utils.js           # Utility functions (randomization)
├── __tests__/
│   ├── *.test.js          # Unit tests (Jest)
│   └── e2e/               # E2E tests (Playwright)
├── index.html.original     # Original single-file version
└── TESTING.md             # Comprehensive testing guide
```

### Core Classes

**CloudAnimator** (`src/cloudAnimator.js`)
- Manages cloud element lifecycle
- Clones base cloud image, applies random transforms
- Randomizes scale (0.5-2.5x), opacity, rotation, vertical position
- Spawns clouds with 'left' or 'right' animation
- Self-regulates spawn rate based on active cloud count
- Auto-removes elements after `animationend` event

**BuzzwordAnimator** (`src/buzzwordAnimator.js`)
- Manages buzzword element lifecycle
- Creates h1 elements with random buzzwords
- Applies one of 5 'buzz' animations (buzz0-buzz4)
- Continuously respawns after animations complete

**Utils** (`src/utils.js`)
- Pure functions for random number generation
- Testable, mockable randomization logic

### Key Implementation Details

- **Memory leak prevention**: `animationend` listeners clean up DOM elements
- **ES6 modules**: Uses modern JavaScript with imports/exports
- **GPU acceleration**: CSS `transform` animations for performance
- **Exposed debugging**: `window.cloudAnimator` and `window.buzzwordAnimator` available in console

## Testing

The project has comprehensive test coverage. See `TESTING.md` for full details.

### Quick Commands
```bash
npm test                 # Run unit tests
npm run test:watch       # Unit tests in watch mode
npm run test:coverage    # Generate coverage report
npm run test:e2e         # Run E2E tests (visual + memory leak detection)
npm run test:e2e:ui      # Interactive E2E test runner
npm run test:all         # Run all tests
```

### Test Strategy
- **Unit tests** (Jest): Test animation logic, element creation, randomization
- **E2E tests** (Playwright): Test visual behavior in real browser
- **Memory leak tests**: Verify elements are cleaned up over time (critical!)

Memory leak testing is **essential** for this project due to continuous element spawning.

## Modifying Content

To add/modify buzzwords, edit the `buzzwords` array in `src/main.js`.

## Legacy Version

The original single-file version is preserved as `index.html.original`.
