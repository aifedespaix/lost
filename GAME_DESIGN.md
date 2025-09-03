# GAME_DESIGN.md

## 🎮 Project Overview

The game is a **3D web multiplayer experience** built with:
- Vue 3 (UI only, decoupled from game logic)
- TypeScript (strict)
- Three.js for 3D rendering
- Rapier for physics
- Howler.js for audio
- SimplePeer (WebRTC) for peer-to-peer multiplayer
- ECS (Entity Component System) for scalable game logic

This document defines the **art direction**, **ambience**, **UX style**, **sound identity**, and **overall design guidelines**.

---

## 🎨 Art Direction (DA)

### Visual Identity
- **Style** → **semi-realistic low-poly** with smooth edges  
- **Mood** → immersive, tense, slightly mysterious  
- **Lighting** → dynamic, volumetric fog, soft shadows  
- **Textures** → subtle, muted, never hyper-detailed
- **Motion language** → fluid, elastic transitions, no harsh pops

### Color Palette
| Element           | Primary Color | Accent Color | Notes |
|------------------|---------------|--------------|-------|
| Ambient | `#222831` | muted grays | Neutral base |
| Interactables | `#00ADB5` | cyan accents | Attracts player |
| Warning | `#F05454` | deep orange-red | Used for danger |
| Highlights | `#EEEEEE` | soft whites | Subtle contrast |
| Shadows | `#121212` | deep black | Used with fog |

> Codex must use these colors consistently across UI, particles, and lighting.

---

## 🌌 Environment Design

The world is a **labyrinth-like procedural environment**.  
Key characteristics:
- Narrow corridors with atmospheric lighting
- Some rooms contain **mystery elements** (objects, puzzles, events)
- Ambient fog and low-contrast depth effects
- GLTF assets loaded dynamically, optimized for streaming

### GLTF & Assets Guidelines
- All 3D models must be **optimized under 5MB**
- Use **three-stdlib** loaders
- Ensure correct scaling, pivot alignment, and normals
- Naming conventions:
assets/models/environment/room_A.gltf
assets/models/items/torch.gltf


---

## 🧠 Gameplay Vision

### Core Mechanics
- First-person or third-person view (switchable)
- Procedural generation of corridors & rooms
- Exploration-based gameplay
- Hidden secrets, collectibles, and events
- Multiplayer optional but seamless (peer-to-peer)

### Movement
- Controlled via WASD + mouse (Pointer Lock)
- Smooth camera transitions between FPS & TPS modes
- Player height ≈ `1.8m`, collider = capsule (`radius=0.4m`, `height=1.6m`)

---

## 🕹️ UX & UI Design

The interface must remain **immersive** and **non-intrusive**.

### HUD Principles
- Minimalistic UI — no clutter
- Crosshair in center, subtle glow, changes color on interactable objects
- Health, stamina, and key inventory slots are **compact**
- Elements fade in/out dynamically based on context

### Transitions & Feedback
- Use **opacity fades** instead of hard swaps
- Smooth animations (100ms → 300ms)
- Audio-visual feedback for all important actions

---

## 🔊 Audio Identity

### Ambient Soundscape
- **Base layer** → low drones, subtle environmental hum
- **Environmental cues**:
- Distant footsteps
- Subtle creaks
- Random faint whispers
- **Threat signals**:
- Deep bass rumble when danger is nearby
- Sudden high-pitched cues for unexpected events

### Implementation Guidelines
- Use **Howler.js** for sound engine
- Enable **3D spatialized audio**
- Sound categories:
assets/audio/ambient/...
assets/audio/interactions/...
assets/audio/ui/...


---

## 🌐 Multiplayer Experience

The multiplayer system is **peer-to-peer**:
- Automatic peer discovery
- Shared state synchronization (positions, animations, events)
- No central authoritative server
- State deltas exchanged at 30Hz for smoothness

> Codex should provide hooks to integrate WebRTC easily with ECS.

---

## 🧩 Effects & Particles

Visual immersion relies on **subtle, performant effects**:
- Dust motes in the air (particles + light scattering)
- Soft fog volumes (Three.js fog + post-processing)
- Occasional light flickering for suspense
- Smooth glow outlines on interactable objects

---

## 🧪 Performance Guidelines

- Target **60 FPS desktop**, **30 FPS tablet**
- All ECS systems must run within a single frame budget:
- **Physics** ≤ 3ms
- **Rendering** ≤ 10ms
- **Networking** ≤ 5ms
- Use **instancing** where possible for repeated meshes

---

## 🧭 Developer Notes

- **AGENTS.md** defines **how to code** the engine.
- **GAME_DESIGN.md** defines **how the game must feel**.
- When generating code, Codex must:
- Follow all component auto-import conventions
- Respect file structure & naming standards
- Ensure shaders, lighting, and GLTF loaders are consistent with the DA
- Avoid hardcoding assets; always use centralized config

---

## ✅ Deliverables Expected from Codex

- Components, Systems, and Engines placed in the correct folders
- Consistent DA (colors, particles, lighting)
- Responsive HUD respecting UX rules
- Dynamic GLTF scene loading with proper scaling
- Audio + lighting tied to events for immersion
- Multiplayer state sync integrated but optional

---

**End of GAME_DESIGN.md**
