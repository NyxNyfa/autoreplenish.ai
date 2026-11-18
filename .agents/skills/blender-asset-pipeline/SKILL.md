---
name: blender-asset-pipeline
description: >-
  Use this skill when generating, modifying, rendering, or debugging 3D .glb assets
  using the procedural Blender Python scripts in scripts/blender/ or via the Blender MCP server.
---

# Blender Procedural 3D Asset Pipeline Skill

This project generates all `.glb` 3D assets procedurally via Python scripts in [scripts/blender/](../../scripts/blender/README.md).

## 1. Procedural Scripts

- [scripts/blender/generate_assets.py](../../scripts/blender/generate_assets.py): Generates hero assets `public/models/truck.glb` and `public/models/minimarket.py` (`minimarket.glb` with emissive store + `DataFlow_*` bridge).
- [scripts/blender/generate_twin_assets.py](../../scripts/blender/generate_twin_assets.py): Generates low-poly isometric digital twin assets in `public/models/twin/` (`dc_warehouse.glb`, `minimarket.glb`, `truck_box.glb`, `truck_box_partner.glb`, `pallet_blue.glb`, `pallet_cards.glb`, `rack.glb`, `rack_full.glb`, `trolley.glb`, `road_straight.glb`, `bay_marker.glb`, `tree.glb`).
- [scripts/blender/generate_cargo_props.py](../../scripts/blender/generate_cargo_props.py): Generates `cargo_row.glb`, `cargo_cluster_a.glb`, and `cargo_cluster_b.glb` in `public/models/twin/`.
- [scripts/blender/render_preview.py](../../scripts/blender/render_preview.py): Renders `scripts/blender/preview.png` for hero fallback poster.

## 2. Running via Blender CLI

Always set `AUTOREPLENISH_MODEL_DIR` or check `EXPORT_DIR_OVERRIDE` so exports land in `d:\landingpage\public\models`:

```powershell
$env:AUTOREPLENISH_MODEL_DIR = "d:\landingpage\public\models"
blender --background --python scripts/blender/generate_assets.py
```

For digital twin assets (`generate_twin_assets.py` and `generate_cargo_props.py`), verify `EXPORT_DIR_OVERRIDE` points to `d:\landingpage\public\models\twin` when re-exporting.

## 3. Running via Blender MCP (`blender-mcp`)

1. Ensure Blender 5.1+ is open with the **Blender MCP** addon enabled and listening on `localhost:9876`.
2. Use the MCP tool `execute_blender_code` (or `blender_execute_code`) to run the procedural script contents.
3. Verify scene objects with `get_scene_info` / `get_object_info` and viewport screenshot tools.
