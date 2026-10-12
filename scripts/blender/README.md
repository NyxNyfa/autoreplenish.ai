# Blender Asset Pipeline — AutoReplenish.ai Hero 3D

Script procedural (`generate_assets.py`) membangun **truk pengiriman amber**, **minimarket**, dan **bridge data-flow cyan**, lalu mengekspor:

| File            | Isi                                                        |
| --------------- | ---------------------------------------------------------- |
| `truck.glb`     | Truk kubis, asal-origin, mesh + material saja (tanpa light) |
| `minimarket.glb`| Toko (sign/jendela emissive), hub atap, + bridge DataFlow   |

Hasil ekspor dipakai oleh `src/components/3d/HeroScene.tsx` (React Three Fiber).

**Status: sudah dijalankan & diverifikasi dengan Blender 5.2.2 LTS** — GLB lolos
parse three.js `GLTFLoader` (14 node truk, 27 node minimarket, material emissive utuh).

## 1. Prasyarat

- **Blender 5.1+** (add-on Blender MCP butuh 5.1; script sendiri jalan di 4.0+).
- Untuk jalur MCP: addon MCP aktif & server addon di **port 9876** (lihat repo `forgent3d`-style setup / `blender_mcp`).

## 2. Menjalankan script

### A. Via Blender GUI (paling sederhana)

1. Buka Blender → tab **Scripting** → **Open** `scripts/blender/generate_assets.py` → **Run Script**.
2. Output otomatis ke `Web/public/models/` (folder dibuat kalau belum ada).

### B. Via Blender CLI

```bash
# dari folder Web/ — set env var supaya ekspor tidak meleset ke ../public/models
AUTOREPLENISH_MODEL_DIR="D:/School Space/Autoreplenish.ai/Web/public/models" \
  "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" \
  --background --python scripts/blender/generate_assets.py
```

### C. Via Blender MCP (dari opencode)

Kirim isi `generate_assets.py` ke tool **`blender_execute_code`**. Kalau Blender
jalan dari folder lain, set dulu `EXPORT_DIR_OVERRIDE` di baris atas script:

```python
EXPORT_DIR_OVERRIDE = r"D:\School Space\Autoreplenish.ai\Web\public\models"
```

atau jalankan Blender dengan env `AUTOREPLENISH_MODEL_DIR` sudah di-set.

## 3. Verifikasi hasil

- Via MCP: `get_objects_summary` (harus ada `Truck_*`, `Store_*`, `DataFlow_*`), lalu `get_screenshot_of_window_as_image`.
- Manual: import GLB ke three.js editor (`threejs.org/editor`) atau Blender.
- Cek file ada & berukuran wajar: `public/models/{truck,minimarket}.glb`.

## 4. Render preview (opsional, dev tool)

`render_preview.py` membangun ulang scene, menata layout hero R3F, mencari
kamera terbaik otomatis (titik-titik kunci dijamin masuk frame), lalu render:

```bash
AUTOREPLENISH_MODEL_DIR="D:/School Space/Autoreplenish.ai/Web/public/models" \
  "C:/Program Files/Blender Foundation/Blender 5.2/blender.exe" \
  --background --python scripts/blender/render_preview.py
# output: scripts/blender/preview.png
```

Hasil render terkini juga disalin ke `public/models/hero-preview.jpg` dan dipakai
sebagai poster fallback di `ModelErrorBoundary` (kalau GLB gagal dimuat di browser).

## 5. Blender MCP (opsional)

Addon `blender_mcp_addon` sudah disalin ke
`%APPDATA%\Blender Foundation\Blender\5.2\extensions\user_default\`.
Langkah di UI Blender:

1. **Restart Blender 5.2** (extension di-scan saat startup).
2. Edit → Preferences → Add-ons → cari **"MCP"** → centang untuk enable.
3. Di panel addon (sidebar viewport → tab MCP), klik **Start server** (port 9876).
4. Restart opencode — tools `blender_*` siap dipakai di sesi ini.

## 6. Integrasi web (sudah dilakukan)

- Model di-load via `useGLTF('/models/truck.glb')` & `/models/minimarket.glb` di:
  `src/components/3d/TruckModel.tsx`, `MinimarketModel.tsx`.
- `HeroScene.tsx` sudah di-mount di `HeroSection` (lazy-loaded, error-boundary aman).
- **PENTING** — koordinat terkunci:
  - `TruckModel`  → `position [-4.3, 0, 0]`
  - `MinimarketModel` → `position [3, 0, 0]`

  Ujung bridge `DataFlow_*` di-bake agar menyentuh atap kab truk pada
  koordinat tersebut. Kalau kamu ubah posisi di salah satu sisi, ubah juga
  titik `p0` di `build_data_flow()` (script Blender) supaya tetap connect.

## 7. Regenerasi dengan gltfjsx (opsional)

Kalau mau komponen typed otomatis dari GLB (bukan yang manual):

```bash
npx gltfjsx public/models/truck.glb -o src/components/3d/TruckGltf.tsx
```

Catatan: versi manual di repo ini sudah menangani hal yang gltfjsx tidak
beri — animasi wheel spin (rotasi roda yang di-bake), pulse emissive, dan
urutan bola data-flow.

## 8. Dependencies web

Sudah terpasang di project ini; untuk setup baru:

```bash
npm install three @types/three @react-three/fiber @react-three/drei framer-motion
```

## 9. Troubleshooting

| Gejala                                            | Sebab & solusi                                                                 |
| ------------------------------------------------- | ------------------------------------------------------------------------------ |
| Addon MCP menolak connect                         | Butuh Blender ≥ 5.1; upgrade dari blender.org                                   |
| `Cannot connect to Blender at localhost:9876`     | Server addon belum di-Start (panel MCP preferences → Start)                     |
| Emissive tidak terlihat di GLB                    | Cek Emission Strength material & aktifkan bloom (EEVEE/Cycles)                  |
| Bridge tidak menyentuh truk                       | Jangan ubah `TRUCK_POSITION`/`STORE_POSITION` sepihak; lihat bagian 4           |
| GLB mendarat di salah folder                      | Set `EXPORT_DIR_OVERRIDE` atau env `AUTOREPLENISH_MODEL_DIR`                     |
