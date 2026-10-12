"""
render_preview.py — render preview hero layout (opsional, dev tool)
===============================================================

Menjalankan generate_assets.py, menata layout hero yang sama dengan R3F
(truk [-4.3,0,0] & store [3,0,0]), mencari kamera terbaik secara otomatis
(semua titik kunci masuk frame), lalu render ke PNG.

Jalankan:
    blender --background --python scripts/blender/render_preview.py
    # opsional override output:
    set AUTOREPLENISH_PREVIEW_OUT="D:/.../hero.png"

Output default: scripts/blender/preview.png
"""
import math
import os
import sys

import bpy
from bpy_extras.object_utils import world_to_camera_view
from mathutils import Vector

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import generate_assets as ga

OUT = os.environ.get(
    "AUTOREPLENISH_PREVIEW_OUT",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "preview.png"),
)

# Titik kunci yang wajib masuk frame (world, layout hero)
KEY_POINTS = [
    Vector((-6.6, 3.1, 1.0)),    # truk belakang-atas
    Vector((-2.1, 2.6, 1.0)),    # kab truk (mulai arc)
    Vector((5.9, 3.7, -1.3)),    # hub atap toko
    Vector((5.9, 2.4, 2.2)),     # sudut kanan depan toko
    Vector((-0.6, 0.0, 0.0)),    # tengah scene
]


def main():
    ga.main()  # bangun scene + ekspor GLB (idempotent)

    scene = bpy.context.scene
    bpy.data.objects["Truck_Root"].location.x = -4.3
    bpy.data.objects["Store_Root"].location.x = 3.0
    bpy.context.view_layer.update()

    cam = bpy.data.objects["Preview_Camera"]
    center = Vector((-0.5, 1.6, 0.0))

    def place(az_deg, el_deg, radius, lens):
        az, el = math.radians(az_deg), math.radians(el_deg)
        cam.location = (
            center.x + radius * math.cos(el) * math.sin(az),
            center.y + radius * math.sin(el),
            center.z + radius * math.cos(el) * math.cos(az),
        )
        direction = center - cam.location
        cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        cam.data.lens = lens
        bpy.context.view_layer.update()

    def penalty(az_deg, el_deg, radius, lens):
        place(az_deg, el_deg, radius, lens)
        uvs = [world_to_camera_view(scene, cam, p) for p in KEY_POINTS]
        p = 0.0
        for uv in uvs:
            p += max(0.0, 0.08 - uv.x) + max(0.0, uv.x - 0.92)
            p += max(0.0, 0.08 - uv.y) + max(0.0, uv.y - 0.92)
        span = max(uv.x for uv in uvs) - min(uv.x for uv in uvs)
        span += max(uv.y for uv in uvs) - min(uv.y for uv in uvs)
        return p, span

    best = None
    for az in range(25, 66, 5):
        for el in range(20, 46, 5):
            for radius in range(14, 30, 2):
                for lens in (28, 32, 36, 40):
                    pen, span = penalty(az, el, radius, lens)
                    key = (pen, -span)
                    if best is None or key < best[0]:
                        best = (key, (az, el, radius, lens))
    az, el, radius, lens = best[1]
    place(az, el, radius, lens)
    print(f"[preview] camera: az={az} el={el} r={radius} lens={lens}")

    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1200
    scene.render.resolution_y = 675
    scene.render.image_settings.file_format = "PNG"
    scene.render.filepath = OUT
    bpy.ops.render.render(write_still=True)
    print("[preview] out:", OUT)


main()
