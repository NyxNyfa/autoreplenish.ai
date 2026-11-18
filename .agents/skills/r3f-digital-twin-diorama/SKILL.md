---
name: r3f-digital-twin-diorama
description: >-
  Use this skill when working on the 3D supply chain diorama, React Three Fiber (R3F)
  components, Three.js materials/lighting, scroll-driven camera timelines, or digital twin
  state in src/components/3d, src/components/hero, src/config, src/hooks, or src/store.
---

# React Three Fiber Digital Twin Diorama Skill

This skill covers the architecture and coordinate constraints for the AutoReplenish.ai 3D Supply Chain Digital Twin built with `three`, `@react-three/fiber`, and `@react-three/drei`.

## 1. Key Files & Architecture

- **Layout & Fleet Config**: [src/config/siteConfig.ts](../../src/config/siteConfig.ts)
  - Defines `ROAD` (continuous rounded-rectangle loop with `halfWidth: 3.0`, `cornerRadius: 12.0`, `x: [-30, 30]`, `z: [-20, 20]`).
  - Defines `SITES`: `DC-01` (`[0, 0, -27]`), `STR-001` (`[38, 0, 0]`), `STR-002` (`[0, 0, 27]`), `STR-003` (`[-38, 0, 0]`).
  - Defines `FLEET_PLAN`, `STAGING_SLOTS`, and `BAY_MARKERS`.
- **Cinematic Scroll Timeline**:
  - [src/config/cinematic.config.ts](../../src/config/cinematic.config.ts) & [src/hooks/useCinematicTimeline.ts](../../src/hooks/useCinematicTimeline.ts)
  - Controls camera position/target interpolation across scroll beats.
- **Palette & Lighting**: [src/config/scenePalette.ts](../../src/config/scenePalette.ts)
- **Digital Twin State Store**: [src/store/useTwinStore.ts](../../src/store/useTwinStore.ts)
- **Hero & 3D Scene Components**:
  - [src/components/hero/HeroSection.tsx](../../src/components/hero/HeroSection.tsx)
  - `src/components/3d/` (`HeroScene.tsx`, `TruckModel.tsx`, `MinimarketModel.tsx`, etc.)

## 2. Coordinate & Asset Invariants

1. **Hero 3D Bridge Alignment**:
   - In `HeroScene.tsx`, `TruckModel` is locked at `[-4.3, 0, 0]` and `MinimarketModel` at `[3, 0, 0]`.
   - The `DataFlow_*` bridge in `minimarket.glb` is baked to connect to the truck cab roof at those exact coordinates. If either position changes, update `p0` in `build_data_flow()` inside `scripts/blender/generate_assets.py`.
2. **GLB Models Location**:
   - Hero models: `public/models/truck.glb`, `public/models/minimarket.glb`
   - Digital Twin diorama models: `public/models/twin/*.glb` (`dc_warehouse.glb`, `minimarket.glb`, `truck_box.glb`, `truck_box_partner.glb`, `pallet_blue.glb`, `pallet_cards.glb`, `rack.glb`, `rack_full.glb`, `trolley.glb`, `cargo_row.glb`, `cargo_cluster_a.glb`, `cargo_cluster_b.glb`, `road_straight.glb`, `bay_marker.glb`, `tree.glb`).
3. **WebGL Resilience**:
   - Always keep 3D canvases wrapped in error boundaries (`ModelErrorBoundary`) and `Suspense` fallbacks so the landing page degrades gracefully if WebGL is unavailable.

## 3. Verification

```powershell
npm run lint
npm run build
```
