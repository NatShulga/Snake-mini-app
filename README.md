# Snake Game in JavaScript

A classic Snake game built with vanilla JavaScript (no libraries).
The project’s goal is to  **practice fundamental algorithms** : 2D arrays, queue data structure, collision detection, game loops, and input handling.

## How to Play

* **Controls:** Arrow keys (↑ ↓ ← →) or WASD.
* The snake moves automatically. Eat fruits (🍓🍒🍇🍉) to grow.
* Hitting a wall or the snake’s own body ends the game.
* Use the **Start** and **Pause** buttons to control the flow.

## Key Algorithms

* **Grid & Snake Representation**
  * The field is a 2D array `grid[ROWS][COLS]` (numbers 1–4 for fruit types, 0 for empty).
  * The snake is an array of `{x, y}` objects, where the last element is the head and the first is the tail — a classic **queue** (FIFO). Movement adds a new head and removes the tail unless food is eaten.
* **Collision Detection**
  * Checks if the new head is out of bounds or overlaps any body segment (except the tail that will be removed in the same step).
* **Food Spawning**
  * Gathers all free cells (empty and not occupied by the snake), then picks a random one and places a random fruit.
* **Game Loop & Input**
  * Uses `setInterval` with a fixed delay. Pausing is done by clearing/resuming the interval.
  * Input handling sets `nextDirection` and prevents 180° reversals.
* **Rendering**
  * The
    board is fully redrawn each frame by creating DOM elements and applying
    CSS classes. Simple and clear, though not the most performant.

## Quick Start

Open `index.html` in any modern browser. No build step required.

## Configuration

Tweak `ROWS`, `COLS`, `SPEED` (ms between moves), or `fruitMap` emojis inside `script.js`.
