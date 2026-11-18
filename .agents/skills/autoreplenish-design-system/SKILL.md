---
name: autoreplenish-design-system
description: >-
  Use this skill when creating, styling, or refactoring UI components, sections,
  or layouts in AutoReplenish.ai. Enforces the Claude Dark Mode warm-dark palette,
  OpenCode IBM Plex Mono typography, 1px flat border structure, and Tailwind CSS v4 tokens
  defined in design.md.
---

# AutoReplenish.ai Design System Skill

Follow the design specifications in [design.md](../../design.md) and [src/index.css](../../src/index.css) whenever building or updating UI components.

## 1. Core Principles

1. **Warm Dark Aesthetic (Claude Dark Mode)**: Use warm near-black surfaces (`#161615`, `#1F1E1D`), never cold blue-blacks or pure `#000000` / `#FFFFFF`.
2. **Single Clay Accent**: Use `--accent` (`#D97757`, hover `#E58A6B`) sparingly for primary focal points (logos, primary CTAs, active focus borders).
3. **Monospace Everything (OpenCode Identity)**: Every text element (headings, body, badges, inputs, tables, nav) uses `--font-mono` (`"IBM Plex Mono", monospace`). Do not mix sans-serif or serif fonts.
4. **Flat 1px Borders**: Separate surfaces with `1px solid var(--border)` (`#3D3C39`) and surface contrast rather than heavy drop shadows or gradients.

## 2. CSS Tokens Reference

| Token | Hex | Purpose |
| :--- | :--- | :--- |
| `--bg` | `#161615` | Main page background |
| `--surface` | `#1F1E1D` | Cards, inputs, panels |
| `--surface-hover` | `#2A2927` | Hover states, inactive tabs |
| `--surface-active` | `#3A3937` | Active tabs/chips, selected items |
| `--border` | `#3D3C39` | 1px dividers and outlines |
| `--text` | `#FAF9F5` | Primary text and headings |
| `--text-muted` | `#A3A199` | Secondary text, descriptions, placeholders |
| `--text-faint` | `#6E6C66` | Markers `[*]`, muted icons, disabled text |
| `--accent` | `#D97757` | Primary clay/orange accent |
| `--accent-hover` | `#E58A6B` | Accent hover state |
| `--link` | `#7AA9EE` | Interactive links |
| `--btn-light-bg` | `#F0EEEA` | High-contrast light primary button background |
| `--btn-light-text` | `#161615` | High-contrast light primary button text |

## 3. Component Conventions

- **Feature Lists**: Prefix items with `<span className="text-[var(--text-faint)]">[*]</span>` followed by bold `var(--text)` title and `var(--text-muted)` description.
- **Buttons**: Radius `8px` (`--radius-md`), padding `10px 16px`, `14px` font weight `500`.
- **Cards & Large Inputs**: Radius `14px` (`--radius-lg`), `1px solid var(--border)`, focus ring/border `var(--accent)`.
- **Motion**: Keep transitions fast (`120ms–200ms ease-out`) on color, opacity, and border; respect `prefers-reduced-motion`.

## 4. Verification

Run linter and production build after UI changes:
```powershell
npm run lint
npm run build
```
