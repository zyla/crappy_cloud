# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a satirical web visualization project that animates flying clouds and tech buzzwords across the screen. It's a humorous commentary on cloud computing and tech industry buzzwords.

## Running the Project

Simply open `index.html` in a web browser. No build process, dependencies, or server required.

## Architecture

The project consists of a single `index.html` file containing:
- Embedded CSS for styling and animations
- Embedded JavaScript for dynamic element spawning
- Reference to `crappy_cloud_1.png` asset

### Core Systems

**Cloud Animation System** (lines 70-96)
- Clones the base cloud image element
- Randomizes scale (0.5-2.5x), opacity, rotation, and vertical position
- Applies either 'left' or 'right' animation (flying across screen)
- Self-regulates spawn rate based on active cloud count
- Auto-removes clouds after animation completes

**Buzzword Animation System** (lines 103-123)
- Spawns h1 elements with random buzzwords from the array (line 101)
- Applies one of 5 'buzz' animations (buzz0-buzz4) with varying effects:
  - Simple horizontal movement with rotation
  - Spinning transformations
  - Scaling effects
- Continuously respawns new buzzwords after each animation ends

### Key Implementation Notes

- Uses `animationend` event listeners to clean up DOM elements and prevent memory leaks
- Spawn timing uses randomization multiplied by active element count to create organic pacing
- CSS animations use `transform` for GPU-accelerated performance
- Character encoding intentionally set to "wtf-8" (line 2) as part of the satirical nature

## Modifying Content

To add/modify buzzwords, edit the `buzzwords` array at line 101.
