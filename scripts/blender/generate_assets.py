"""
generate_assets.py — AutoReplenish.ai hero 3D assets
=====================================================

Membuat scene 3D low-poly procedural:
  1. Minimarket stylized (sign + jendela emissive cyan = "AI Data Hub")
  2. Truck pengiriman (body amber, aksen cyan emissive, roda silinder)
  3. Data-flow effect (deret bola emissive + jejak bezier = "SAP/AI Data Sync")
  4. Studio lighting gelap + area key light + amber rim light (preview saja)

Lalu mengekspor:
  truck.glb       -> truk saja, asal-origin, mesh/material saja
  minimarket.glb  -> minimarket + data-flow bridge, asal-origin

CARA MENJALANKAN
----------------
A) Blender GUI  : Scripting workspace -> Open file ini -> Run Script.
B) Blender MCP   : kirim seluruh isi file ini ke tool `execute_blender_code`
                  (Blender harus jalan dengan addon MCP aktif).
C) Blender CLI  : blender --background --python generate_assets.py

Lokasi output default : <folder file .blend atau script>/../public/models
Override              : set env var AUTOREPLENISH_MODEL_DIR="D:/.../public/models"
Folder dibuat otomatis jika belum ada (os.makedirs exist_ok=True).

CATATAN R3F (porting koordinat ke React)
----------------------------------------
Scene di-build di world space; store di origin, truck di x=-7.
Setelah centering, layout R3F yang DIJAMIN connect (jangan diubah sepihak):
  - store.glb   -> position [3, 0, 0]
  - truck.glb   -> position [-4.3, 0, 0]
Arc data-flow start di depan-atap kab truk dan berakhir di papan nama toko,
sehingga di R3F ujung arc menyentuh truk ketika koordinat di atas dipakai.
"""

import math
import os
import sys
import traceback

import bpy
from mathutils import Matrix, Vector

# ----------------------------------------------------------------------------
# Konfigurasi tema (hex -> linear, karena socket Principled BSDF scene-linear)
# ----------------------------------------------------------------------------
COLOR_CYAN = "#06b6d4"          # AI / data flow
COLOR_AMBER = "#f59e0b"         # truck / logistics
COLOR_SLATE = "#3f3f46"         # kab truk / atap toko
COLOR_OFFWHITE = "#e7e5e4"      # dinding toko
COLOR_DARK = "#18181b"          # ban / pintu
COLOR_GLASS = "#164e63"         # kaca depan truk

EMISSION_SIGN = 4.0
EMISSION_WINDOW = 1.6
EMISSION_ACCENT = 3.5
EMISSION_FLOW = 6.0

# Override folder ekspor manual (kosongkan untuk auto-detect ../public/models).
# Berguna kalau dijalankan lewat Blender MCP dari working directory lain.
# Contoh: EXPORT_DIR_OVERRIDE = r"D:\School Space\Autoreplenish.ai\Web\public\models"
EXPORT_DIR_OVERRIDE = ""

def srgb_to_linear(hex_color):
    """#rrggbb -> tuple(float 0-1) linear."""
    h = hex_color.lstrip("#")
    out = []
    for i in (0, 2, 4):
        v = int(h[i:i + 2], 16) / 255.0
        out.append(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4)
    return tuple(out)

# ----------------------------------------------------------------------------
# Utilities
# ----------------------------------------------------------------------------
def clear_scene():
    """Hapus semua objek & orphan data, reset ke scene bersih."""
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for data in (
        bpy.data.meshes,
        bpy.data.curves,
        bpy.data.materials,
        bpy.data.textures,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(data):
            if block.users == 0:
                data.remove(block)

def make_material(name, hex_color, metallic=0.0, roughness=0.5,
                  emission=None, emission_strength=0.0):
    """Principled BSDF dengan nama jelas (mis. Mat_Truck_Body)."""
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = next(
        (n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"),
        None,
    )
    if bsdf is None:
        bsdf = mat.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*srgb_to_linear(hex_color), 1.0)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if "Specular IOR Level" in bsdf.inputs:  # Blender 4.x+
        bsdf.inputs["Specular IOR Level"].default_value = 0.4
    if emission:
        try:
            # Blender 4.2+
            bsdf.inputs["Emission Color"].default_value = (*srgb_to_linear(emission), 1.0)
            bsdf.inputs["Emission Strength"].default_value = emission_strength
        except KeyError:
            # Blender lama: input bernama "Emission" tanpa strength terpisah
            bsdf.inputs["Emission"].default_value = (*srgb_to_linear(emission), 1.0)
    return mat

def _assign(obj, material, name):
    obj.name = name
    if material is not None:
        obj.data.materials.append(material)
    return obj

def add_box(name, location, dimensions, material=None, bevel=0.0, parent=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=location)
    obj = bpy.context.active_object
    mesh = obj.data
    mesh.transform(Matrix.Diagonal(Vector((dimensions[0], dimensions[1], dimensions[2], 1.0))))  # bake scale
    obj = _assign(obj, material, name)
    if bevel > 0.0:
        mod = obj.modifiers.new(name="Bevel", type="BEVEL")
        mod.width = bevel
        mod.segments = 2
    if parent is not None:
        obj.parent = parent
        obj.matrix_parent_inverse = parent.matrix_world.inverted()
    return obj

def add_cylinder(name, location, radius, depth, material=None, parent=None,
                 rotation=None, segments=24):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius, depth=depth, vertices=segments, location=location
    )
    obj = bpy.context.active_object
    if rotation is not None:  # bake rotasi ke mesh
        obj.data.transform(Matrix.Rotation(math.radians(rotation), 4, "Y"))
    obj = _assign(obj, material, name)
    if parent is not None:
        obj.parent = parent
        obj.matrix_parent_inverse = parent.matrix_world.inverted()
    return obj

def add_sphere(name, location, radius, material=None, parent=None, segments=16):
    bpy.ops.mesh.primitive_uv_sphere_add(
        radius=radius, segments=segments, ring_count=segments // 2,
        location=location,
    )
    obj = bpy.context.active_object
    obj = _assign(obj, material, name)
    if parent is not None:
        obj.parent = parent
        obj.matrix_parent_inverse = parent.matrix_world.inverted()
    return obj

def world_bbox(objects):
    """Bounding box world-space dari kumpulan objek mesh."""
    minv = Vector((1e20, 1e20, 1e20))
    maxv = Vector((-1e20, -1e20, -1e20))
    for obj in objects:
        if obj.type != "MESH":
            continue
        for corner in obj.bound_box:
            world = obj.matrix_world @ Vector(corner)
            for i in range(3):
                minv[i] = min(minv[i], world[i])
                maxv[i] = max(maxv[i], world[i])
    return minv, maxv

def center_group_on_origin(root_empty, exclude_prefix=None):
    """
    Geser root empty (dan seluruh anak) supaya model centered di origin,
    duduk di ground (y_min -> 0). Dipakai supaya posisi R3F mudah diatur.

    exclude_prefix: objek yang TIDAK ikut dihitung bbox (mis. "DataFlow_"),
    sehingga bridge data-flow tetap di koordinat world asal dan ujungnya
    persis menyentuh truk ketika model di-mount di R3F.
    """
    members = [
        obj
        for obj in ([root_empty] + list(root_empty.children_recursive))
        if not (exclude_prefix and obj.name.startswith(exclude_prefix))
    ]
    minv, maxv = world_bbox(members)
    delta = Vector((-(minv.x + maxv.x) / 2.0, -minv.y, 0.0))
    root_empty.location += delta
    bpy.context.view_layer.update()
    return delta

def make_empty_root(name):
    root = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(root)
    return root

# ----------------------------------------------------------------------------
# 1) TRUCK (world x = -7, menghadap +x menuju store)
# ----------------------------------------------------------------------------
def build_truck():
    print("[asset] build: truck ...")
    root = make_empty_root("Truck_Root")

    mat_body = make_material("Mat_Truck_Body", COLOR_AMBER, metallic=0.05, roughness=0.45)
    mat_cab = make_material("Mat_Truck_Cab", COLOR_SLATE, metallic=0.2, roughness=0.35)
    mat_accent = make_material("Mat_Truck_Accent", COLOR_CYAN,
                               emission=COLOR_CYAN, emission_strength=EMISSION_ACCENT,
                               roughness=0.3)
    mat_glass = make_material("Mat_Truck_Glass", COLOR_GLASS, metallic=0.6, roughness=0.1)
    mat_dark = make_material("Mat_Truck_Dark", COLOR_DARK, roughness=0.8)
    mat_wheel = make_material("Mat_Wheel", COLOR_DARK, roughness=0.9)

    # chassis
    add_box("Truck_Chassis", (-7.55, 0.45, 0), (4.2, 0.28, 1.5), mat_dark, parent=root)

    # cargo box amber + panel sync cyan di samping
    add_box("Truck_Cargo", (-8.2, 1.9, 0), (2.5, 2.4, 2.1), mat_body,
            bevel=0.06, parent=root)
    add_box("Truck_SyncPanel", (-8.2, 2.0, 1.04), (1.7, 0.95, 0.05), mat_accent,
            parent=root)
    add_box("Truck_SyncPanel.B", (-8.2, 2.0, -1.04), (1.7, 0.95, 0.05), mat_accent,
            parent=root)

    # kab + kaca + bemper + lampu
    add_box("Truck_Cab", (-5.95, 1.5, 0), (1.7, 2.0, 2.0), mat_cab, bevel=0.06, parent=root)
    add_box("Truck_Windshield", (-5.14, 2.0, 0), (0.06, 0.95, 1.75), mat_glass, parent=root)
    add_box("Truck_Bumper", (-5.05, 0.6, 0), (0.25, 0.35, 2.0), mat_dark, parent=root)
    add_box("Truck_Headlights", (-5.12, 0.9, 0), (0.08, 0.16, 1.55), mat_accent, parent=root)
    add_cylinder("Truck_Beacon", (-5.95, 2.62, 0), 0.12, 0.25, mat_accent, parent=root)

    # roda (rotasi 90deg di-bake -> sumbu X; di R3F animasi node.rotation.x)
    for pos, wx in (("F", -5.35), ("R", -8.6)):
        for side, wz in (("L", 0.95), ("R", -0.95)):
            add_cylinder(f"Truck_Wheel_{pos}{side}", (wx, 0.45, wz), 0.45, 0.3,
                         mat_wheel, parent=root, rotation=90, segments=24)
    return root

# ----------------------------------------------------------------------------
# 2) MINIMARKET (store di origin)
# ----------------------------------------------------------------------------
def build_store():
    print("[asset] build: minimarket ...")
    root = make_empty_root("Store_Root")

    mat_wall = make_material("Mat_Store_Body", COLOR_OFFWHITE, roughness=0.85)
    mat_roof = make_material("Mat_Store_Roof", COLOR_SLATE, metallic=0.1, roughness=0.6)
    mat_dark = make_material("Mat_Store_Dark", COLOR_DARK, roughness=0.7)
    mat_sign = make_material("Mat_Store_Emissive", COLOR_CYAN,
                             emission=COLOR_CYAN, emission_strength=EMISSION_SIGN,
                             roughness=0.3)
    mat_window = make_material("Mat_Store_Window", COLOR_CYAN,
                               emission=COLOR_CYAN,
                               emission_strength=EMISSION_WINDOW, roughness=0.2)
    mat_hub = make_material("Mat_Store_Hub", COLOR_CYAN,
                            emission=COLOR_CYAN,
                            emission_strength=EMISSION_ACCENT, roughness=0.3)

    add_box("Store_Body", (0, 1.2, 0), (5.0, 2.4, 3.8), mat_wall, bevel=0.04, parent=root)
    add_box("Store_Roof", (0, 2.51, 0), (5.3, 0.22, 4.05), mat_roof, parent=root)
    add_box("Store_SignBack", (0, 2.0, 1.86), (3.6, 0.9, 0.05), mat_dark, parent=root)
    add_box("Store_Sign", (0, 2.0, 1.93), (3.4, 0.7, 0.12), mat_sign, parent=root)
    add_box("Store_Door", (0, 0.95, 1.905), (1.1, 1.9, 0.08), mat_dark, parent=root)
    add_box("Store_WindowL", (1.55, 1.35, 1.905), (1.2, 0.9, 0.05), mat_window, parent=root)
    add_box("Store_WindowR", (-1.55, 1.35, 1.905), (1.2, 0.9, 0.05), mat_window, parent=root)
    add_box("Store_Canopy", (0, 2.35, 2.3), (5.4, 0.12, 1.3), mat_roof, parent=root)
    add_box("Store_Step", (0, 0.075, 2.2), (1.6, 0.15, 0.7), mat_wall, parent=root)

    # "AI hub" di atap: tiang + bola emissive
    add_cylinder("Store_HubPole", (2.0, 2.75, -1.2), 0.05, 0.5, mat_dark, parent=root)
    add_sphere("Store_Hub_Light", (2.0, 3.05, -1.2), 0.09, mat_hub, parent=root)
    return root

# ----------------------------------------------------------------------------
# 3) DATA FLOW BRIDGE (anak dari Store_Root, ujung-ujung menyentuh kab truk & sign)
# ----------------------------------------------------------------------------
def bezier_quadratic(p0, p1, p2, t):
    return (1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2

def build_data_flow(store_root):
    print("[asset] build: data flow bridge ...")
    mat_flow = make_material("Mat_Data_Flow", COLOR_CYAN,
                             emission=COLOR_CYAN, emission_strength=EMISSION_FLOW,
                             roughness=0.3)
    # start = depan-atap kab truk (world), end = papan nama toko
    p0 = Vector((-5.125, 2.5, 0.0))
    p1 = Vector((-3.3, 3.5, 0.9))
    p2 = Vector((-1.5, 2.1, 1.95))
    count = 8
    points = [bezier_quadratic(p0, p1, p2, i / (count - 1)) for i in range(count)]

    for i, p in enumerate(points):
        add_sphere(f"DataFlow_{i:02d}", p, 0.07, mat_flow, parent=store_root)

    # jejak tipis antar-bola (runtuh kalau salah: pakai segment box di-bake)
    for i in range(count - 1):
        a, b = points[i], points[i + 1]
        direction = (b - a).normalized()
        length = (b - a).length * 0.9
        mid = (a + b) / 2.0
        bpy.ops.mesh.primitive_cube_add(size=1, location=mid)
        obj = bpy.context.active_object
        mesh = obj.data
        mesh.transform(Matrix.Diagonal(Vector((0.035, length, 0.035, 1.0))))
        quat = direction.to_track_quat("Y", "Z")
        mesh.transform(quat.to_matrix().to_4x4())
        obj.name = f"DataFlow_Link_{i:02d}"
        obj.data.materials.append(mat_flow)
        obj.parent = store_root
        obj.matrix_parent_inverse = store_root.matrix_world.inverted()

# ----------------------------------------------------------------------------
# 4) STUDIO LIGHTING (preview Blender saja; tidak diekspor ke GLB)
# ----------------------------------------------------------------------------
def setup_lighting():
    print("[asset] setup: studio lighting ...")
    bpy.ops.object.light_add(type="AREA", location=(5.5, 8, 9))
    key = bpy.context.active_object
    key.data.energy = 1000
    key.data.size = 7
    key.name = "Key_Light"

    bpy.ops.object.light_add(type="AREA", location=(-8, 5, -4))
    rim = bpy.context.active_object
    rim.data.energy = 1300
    rim.data.size = 8
    rim.data.color = srgb_to_linear(COLOR_AMBER)
    rim.name = "Rim_Light_Amber"

    # fill di sisi truk supaya body amber tidak tenggelam di shadow
    bpy.ops.object.light_add(type="AREA", location=(-6, 5, 7))
    fill = bpy.context.active_object
    fill.data.energy = 400
    fill.data.size = 5
    fill.name = "Fill_Light_Truck"

    bpy.ops.object.light_add(type="AREA", location=(0, 3, 9))
    fill2 = bpy.context.active_object
    fill2.data.energy = 250
    fill2.data.size = 5
    fill2.name = "Fill_Light_Front"

    # world gelap
    world = bpy.data.worlds.get("World") or bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True
    bg = next(n for n in world.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs[0].default_value = (*srgb_to_linear("#0f1113"), 1.0)
    bg.inputs[1].default_value = 1.0

    # kamera preview menghadap origin
    bpy.ops.object.camera_add(location=(11, 7, 10))
    cam = bpy.context.active_object
    direction = Vector((0, 1.3, 0)) - cam.location
    cam.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    cam.name = "Preview_Camera"
    bpy.context.scene.camera = cam

# ----------------------------------------------------------------------------
# 5) EXPORT
# ----------------------------------------------------------------------------
def resolve_export_dir():
    if EXPORT_DIR_OVERRIDE:
        return os.path.abspath(EXPORT_DIR_OVERRIDE)
    override = os.environ.get("AUTOREPLENISH_MODEL_DIR")
    if override:
        return os.path.abspath(override)
    if bpy.data.filepath:
        base = os.path.dirname(bpy.data.filepath)
    else:
        # coba path text block (dijalankan dari Text Editor / MCP)
        base = None
        try:
            area = bpy.context.area
            if area and area.type == "TEXT_EDITOR":
                text = area.spaces.active.text
                if text and text.filepath:
                    base = os.path.dirname(text.filepath)
        except Exception:
            base = None
        if not base:
            base = os.getcwd()
    return os.path.abspath(os.path.join(base, "..", "public", "models"))

def export_glb(root_empty, filepath):
    """Export root + descendants sebagai GLB. Coba kwarg lengkap, fallback minimal."""
    bpy.ops.object.select_all(action="DESELECT")
    for obj in [root_empty] + list(root_empty.children_recursive):
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root_empty

    full_kwargs = dict(
        filepath=filepath,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_yup=True,
        export_animations=False,
        export_skins=False,
        export_morph=False,
        export_lights=False,
        export_cameras=False,
        export_image_format="AUTO",
    )
    try:
        bpy.ops.export_scene.gltf(**full_kwargs)
    except TypeError:
        # versi Blender lama: beberapa kwarg belum ada
        bpy.ops.export_scene.gltf(
            filepath=filepath,
            export_format="GLB",
            use_selection=True,
            export_apply=True,
            export_yup=True,
        )
    if not os.path.isfile(filepath):
        raise RuntimeError("Export gagal: " + filepath)
    print(f"[asset] exported {filepath} ({os.path.getsize(filepath) / 1024:.1f} KB)")

# ----------------------------------------------------------------------------
# MAIN
# ----------------------------------------------------------------------------
def main():
    clear_scene()

    truck_root = build_truck()
    store_root = build_store()
    build_data_flow(store_root)
    setup_lighting()
    bpy.context.view_layer.update()

    # centering: masing-masing model asal-origin (ground di y=0).
    # DataFlow_* tidak ikut dihitung supaya ujung arc tetap menyentuh
    # posisi kab truk saat di-mount di R3F (truck [-4.3,0,0], store [3,0,0]).
    center_group_on_origin(truck_root)
    center_group_on_origin(store_root, exclude_prefix="DataFlow_")
    bpy.context.view_layer.update()

    export_dir = resolve_export_dir()
    try:
        os.makedirs(export_dir, exist_ok=True)
    except Exception as ex:
        print(f"[asset][ERROR] tidak bisa membuat folder {export_dir}: {ex}")
        print("[asset][ERROR] buat folder manual lalu jalankan ulang.")
        raise
    print(f"[asset] export dir: {export_dir}")

    export_glb(truck_root, os.path.join(export_dir, "truck.glb"))
    export_glb(store_root, os.path.join(export_dir, "minimarket.glb"))

    print("[asset] selesai. Object akhir:")
    for obj in bpy.context.scene.objects:
        print(f"         - {obj.name} ({obj.type})")

if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        print("[asset] GAGAL — lihat traceback di atas.")
