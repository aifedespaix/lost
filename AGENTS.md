# AGENTS.md — Game Engine Codex Instructions

## 🎯 Goal

Create a modular, scalable and testable **3D Web Game Engine** using:
- Vue 3 (only for UI)
- TypeScript (strict)
- Vite + Vite-SSG (static generation)
- ECS (Entity Component System)
- Three.js (rendering)
- Rapier (physics)
- Howler.js (audio)
- SimplePeer (peer-to-peer networking)
- UnoCSS (utility-first styling)
- Pinia (state)
- PWA support
- Markdown + Shiki (for content)
- i18n support

---

## 📦 Folder Structure (in `/src`)

```
src/
├── core/              # Global types, utils, constants
├── ecs/               # ECS base + components + systems
│   ├── core/          # ECS engine (Entity, System, Component)
│   ├── components/    # Data-only (Position, Velocity, etc.)
│   └── systems/       # Logic (MovementSystem, AudioSystem, etc.)
├── engines/           # External engines (physics, audio, network, gfx)
├── game/              # Game-specific logic (scenes, spawn, rules)
├── composables/       # Vue hooks (auto-imported)
├── stores/            # Pinia stores (auto-imported)
├── components/        # Vue-only visual interface
│   └── ui/            # UI components (auto-imported)
├── pages/             # Page views
├── layouts/           # App layout (vite-plugin-vue-layouts)
├── styles/            # css (for global styles if needed)
└── main.ts            # App bootstrap (Vue + game engine)
public/
└── assets/            # Static models, sounds, etc.
```

---

## ✅ Vue Auto-Imports

- Auto-imports via `unplugin-auto-import`
- Enabled for:
  - `vue`, `@vueuse/core`, `vue-i18n`, `vue-router/auto`, `@unhead/vue`
  - All composables in `src/composables/`
  - All stores in `src/stores/`

✅ You **must not manually import** Vue APIs like `ref`, `reactive`, `useRoute`, etc.

---

## 🧩 Component Auto-Registration

- Uses `unplugin-vue-components`
- `directoryAsNamespace: true` is enabled

✅ Rule:
Every Vue component must be in a folder that matches its name. Example:

```
src/components/ui/button.vue → <UiButton />
src/components/ui/list/item.vue → <UiListItem />
```

---

## 🧠 Vue is UI only

All business/game logic (ECS, physics, rendering) is decoupled from Vue.

- Vue only handles:
  - User interaction (mouse, keyboard, UI buttons)
  - HUD rendering
  - Minimal 3D camera updates if needed

All logic runs independently from Vue and can be tested without it.
Each interaction with engines from .vue files should use a "useFunction" via composables

---

## ⚙️ ECS Architecture

- `components/`: data-only
- `systems/`: logic classes (`update(dt: number)`)
- `GameEngine.ts`: orchestrator, runs the tick loop
- Each `System` processes `Component` queries
- Pure functions only, no side effects outside engine boundaries

---

## 🔧 Engines

Each engine is modular and instantiable independently.

- `AudioEngine`: uses Howler
- `PhysicsEngine`: uses Rapier
- `GraphicsEngine`: uses Three.js
- `PeerEngine`: uses peer.js

They are injected into the GameEngine or accessed via a service locator.

---

## 🧪 Testing

- Use `Vitest` for unit tests
- All systems/engines/composables must be testable headlessly
- Cypress used only for E2E (Vue side)

---

## 🤖 Codex Instructions

When generating code:

1. **NEVER import Vue APIs manually**.
2. Vue components must follow strict folder naming conventions.
3. ECS logic must not use Vue or DOM.
4. Systems must be stateless (except internal logic).
5. Use strict TypeScript with full typing.
6. Name all classes and types explicitly (e.g., `RenderSystem`, `ColliderComponent`, `Vec3`)
7. Every new file must be placed in the correct folder.
8. Vue templates must use auto-imported components only.

---

## 📂 Example: AudioSystem.ts

```ts
import { System } from '~/ecs/core/System'
import { AudioSource } from '~/ecs/components/AudioSource'

export class AudioSystem extends System {
  update(dt: number) {
    for (const [audio] of this.query(AudioSource)) {
      if (audio.play) {
        services.audio.play(audio.clip)
        audio.play = false
      }
    }
  }
}
```

---

## ✅ Expected Output

Codex should generate:
- Typed components, systems and engines in the right folders
- Reusable logic, not tied to Vue
- Proper use of auto-imports
- Modular, readable, testable and tested code

## 🎨 Game Atmosphere & Visual Identity

The game is a **mysterious, immersive 3D exploration experience** with:
- **Tone** → dark, tense, subtle hints of danger  
- **Art style** → semi-realistic low-poly, smooth lighting, no hard edges  
- **Lighting** → strong use of shadows, volumetric fog, contrast-based mood  
- **Color palette** → muted greys, soft greens, deep blues; avoid bright saturation  
- **Animations** → smooth, elastic, with slightly delayed easing  
- **UI/UX style** → minimalistic, immersive, HUD fades in/out dynamically

### Audio Identity
- Ambient soundscapes (low drones, distant rumbles, subtle wind)  
- 3D spatialized sounds using Howler  
- Very subtle background music, mostly environmental  
- Sudden sound spikes only when a threat or player interaction occurs  

> ⚠️ Codex should **not generate assets** but should ensure the **engine supports**:
- Dynamic shadows & atmospheric effects
- Event-driven ambient sounds
- Adjustable post-processing (fog, bloom, vignette)

### More infos for visual / ambiance 
- read GAME_DEISGN.md

End of `AGENTS.md`