---
trigger: always_on
---

# AutoReplenish.ai Workspace Rules

1. **Source of Truth**: Always follow [PRD.md](../../PRD.md) for system architecture, domain logic, and business metrics, and [design.md](../../design.md) for UI/UX tokens.
2. **Design System**:
   - Warm dark palette (`--bg: #161615`, `--surface: #1F1E1D`, `--border: #3D3C39`, `--accent: #D97757`).
   - Do not use pure black (`#000000`), pure white (`#FFFFFF`), heavy drop shadows, or gradients on UI cards.
   - Use monospace typography (`--font-mono`, `"IBM Plex Mono"`) across all UI elements.
3. **Tech Stack**:
   - React 19 + TypeScript (`~6.0.2`) + Vite 8 + Tailwind CSS v4 (`@tailwindcss/vite`).
   - 3D Digital Twin & Hero Scene: `three`, `@react-three/fiber`, `@react-three/drei`, `framer-motion`.
   - Linter: `oxlint` (`npm run lint`).
4. **3D Asset Pipeline**:
   - Procedural Blender scripts live in `scripts/blender/`.
   - Exported `.glb` models live in `public/models/` and `public/models/twin/`.
