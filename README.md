# Water Balloon Fight Simulator

**Water Balloon Fight Simulator** is a top-down, browser-based game/simulator built entirely with **JavaScript**, **HTML**, and **CSS**. This project was developed while studying **Data Structures and Algorithms** as part of my Computer Science degree at **Eastern Oregon University**. It showcases practical implementation of algorithms, game mechanics, and sprite-based rendering.

[Try the live demo](https://michaelgalloway404.github.io/WaterBalloonFightSim/)

---

## Overview

In this game, two teams of NPCs engage in a chaotic water balloon battle on a randomly generated map. The simulation includes:

- **Dynamic map generation** using procedural algorithms.
- NPC pathfinding and combat logic powered by **A* (A-Star) pathfinding**.
- Depth-aware sprite rendering using a **min-heap** to ensure correct overlapping visuals.
- Real-time projectile mechanics and collision detection.
- Adjustable team sizes via user input before starting the battle.

The simulator emphasizes algorithmic efficiency, object-oriented design, and clean rendering of game elements.

---

## Key Features

### 1. Random Map Generation
- Procedurally generates maps with walkable and non-walkable tiles.
- Uses **A* pathfinding** to validate walkability, ensuring every square is accessible.
- Applies multi-pass labeling to assign proper tile graphics dynamically.

### 2. NPC AI and Pathfinding
- NPCs navigate the map intelligently using **A* pathfinding**.
- Each NPC can attack random opponents with projectiles.
- NPCs avoid obstacles while targeting opponents, demonstrating pathfinding in a dynamic environment.

### 3. Depth-Aware Rendering
- All sprites are sorted by **y-coordinate** using a **min-heap** for natural overlapping.
- Shadows are rendered separately and at a level that allows them to not overlap onto another NPC.
- Tile and sprite layering ensures a visually pleasing 2D environment.

### 4. Real-Time Combat Simulation
- Projectiles track targets and handle collision detection precisely.
- Teams’ health and scores are dynamically updated on the scoreboard.
- Endgame conditions display winners or notify if all NPCs are eliminated.

---

## Technical Highlights

- **Game Engine:** Custom loop with consistent 60 FPS update and render cycles.
- **A* Pathfinding:** Efficient node-based pathfinding with g, h, and f scores.
- **MinHeap:** Priority queue for sprite rendering based on depth.
- **Collision Detection:** Axis-aligned bounding box system for projectiles.
- **Modular Design:** Separate JS modules for sprites, projectiles, map generation, and AI logic.

---

## What I Learned

- Applied **algorithmic knowledge** from CS_318 to a practical simulation.
- Implemented **real-time sprite rendering** with depth sorting.
- Developed **AI-driven NPC behavior** using pathfinding and projectile targeting.
- Improved **modular programming skills** with ES6 modules and reusable code structures.
- Practiced **debugging and performance optimization** in a browser environment.

---

## Try It Out

Play the game in your browser:

[https://michaelgalloway404.github.io/WaterBalloonFightSim/](https://michaelgalloway404.github.io/WaterBalloonFightSim/)

Adjust team sizes and watch the battle unfold with dynamic AI behavior and visually accurate depth rendering.

---

## Author

Michael Galloway
