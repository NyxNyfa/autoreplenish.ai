"""
generate_cargo_props.py — AutoReplenish.ai Staging & Cargo Props
==================================================================
Procedural generation and export for 5 supply-chain diorama props:
1. cargo_cluster_a.glb — Pallet + 6 cardboard boxes stacked 3+2+1 with tape (~1.2 x 1.0 x 1.4 m)
2. cargo_cluster_b.glb — Pallet + 4 steel-blue containers 2x2 + 1 cardboard box (~1.2 x 1.0 x 1.3 m)
3. cargo_row.glb — 3 pallets in a row with mixed boxes + 1 blue container (~3.8 x 1.2 x 1.3 m)
4. rack_full.glb — Warehouse rack with both shelf levels filled with boxes
5. trolley.glb — Hand trolley with frame + 2 wheels carrying 1 box (~0.6 x 0.5 x 1.1 m)

Palette:
- cardboard: #C9A87C
- tape: #E8D3B8
- pallet wood: #6E5A40
- containers steel-blue: #4E6E8E
- trolley frame: #3A3937

Technical constraints:
- Origin at bottom-center (Z=0, X=0, Y=0)
- Transforms applied; smooth shading
- Flat Principled BSDF materials (base color only)
- < 1,200 triangles each
- Exported as separate .glb files to Web/public/models/twin/
"""

import math
import os
import sys
import traceback
import bpy
from mathutils import Matrix, Vector

# ============================================================================
# 🎨 COLOR PALETTE (Warm, non-neon supply chain tokens)
# ============================================================================
COLOR_CARDBOARD = "#C9A87C"
COLOR_TAPE = "#E8D3B8"
COLOR_PALLET_WOOD = "#6E5A40"
COLOR_CONTAINER_BLUE = "#4E6E8E"
COLOR_TROLLEY_FRAME = "#3A3937"
COLOR_STEEL_SHELF = "#555451"

EXPORT_DIR_OVERRIDE = r"d:\School Space\Autoreplenish.ai\Web\public\models\twin"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================
def srgb_to_linear(hex_color):
    h = hex_color.lstrip("#")
    out = []
    for i in (0, 2, 4):
        v = int(h[i:i + 2], 16) / 255.0
        out.append(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4)
    return tuple(out)

def clear_scene():
    if bpy.context.object and bpy.context.object.mode != "OBJECT":
        bpy.ops.object.mode_set(mode="OBJECT")
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for data in (
        bpy.data.meshes,
        bpy.data.materials,
        bpy.data.textures,
        bpy.data.cameras,
        bpy.data.lights,
    ):
        for block in list(data):
            if block.users == 0:
                data.remove(block)

def make_material(name, hex_color, roughness=0.6, metallic=0.0, specular=0.5):
    mat = bpy.data.materials.get(name) or bpy.data.materials.new(name)
    mat.use_nodes = True
    bsdf = next((n for n in mat.node_tree.nodes if n.type == "BSDF_PRINCIPLED"), None)
    if bsdf is None:
        bsdf = mat.node_tree.nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (*srgb_to_linear(hex_color), 1.0)
    bsdf.inputs["Roughness"].default_value = roughness
    bsdf.inputs["Metallic"].default_value = metallic
    if "Specular IOR Level" in bsdf.inputs:
        bsdf.inputs["Specular IOR Level"].default_value = specular
    elif "Specular" in bsdf.inputs:
        bsdf.inputs["Specular"].default_value = specular
    return mat

def create_empty_root(name):
    root = bpy.data.objects.new(name, None)
    bpy.context.scene.collection.objects.link(root)
    root.location = (0, 0, 0)
    return root

def assign_material(obj, mat):
    if mat:
        if obj.data.materials:
            obj.data.materials[0] = mat
        else:
            obj.data.materials.append(mat)
    return obj

def add_box(name, location, size, material=None, parent=None, bevel=0.0):
    bpy.ops.mesh.primitive_cube_add(size=1.0, location=location)
    obj = bpy.context.active_object
    obj.name = name
    scale_mat = Matrix.Diagonal(Vector((size[0], size[1], size[2], 1.0)))
    obj.data.transform(scale_mat)
    assign_material(obj, material)
    if bevel > 0.0:
        mod = obj.modifiers.new(name="Bevel", type="BEVEL")
        mod.width = bevel
        mod.segments = 2
    if parent:
        obj.parent = parent
        obj.matrix_parent_inverse = parent.matrix_world.inverted()
    return obj

def add_cylinder(name, location, radius, depth, material=None, parent=None, rotation=(0, 0, 0), segments=16):
    bpy.ops.mesh.primitive_cylinder_add(
        radius=radius,
        depth=depth,
        vertices=segments,
        location=location
    )
    obj = bpy.context.active_object
    obj.name = name
    if any(r != 0 for r in rotation):
        rot_mat = (
            Matrix.Rotation(math.radians(rotation[0]), 4, "X") @
            Matrix.Rotation(math.radians(rotation[1]), 4, "Y") @
            Matrix.Rotation(math.radians(rotation[2]), 4, "Z")
        )
        obj.data.transform(rot_mat)
    assign_material(obj, material)
    if parent:
        obj.parent = parent
        obj.matrix_parent_inverse = parent.matrix_world.inverted()
    return obj

def build_pallet_submesh(prefix, center_pos, parent, mat_wood):
    """Creates a standard Euro-style wooden pallet (~1.2 x 1.0 x 0.14 m) at center_pos."""
    cx, cy, cz = center_pos
    # 3 bottom runners
    for bx in (-0.45, 0.0, 0.45):
        add_box(f"{prefix}_Runner_{bx}", (cx + bx, cy, cz + 0.012), (0.12, 1.0, 0.024), mat_wood, parent=parent)
    # 9 stringer spacer blocks
    for bx in (-0.45, 0.0, 0.45):
        for by in (-0.4, 0.0, 0.4):
            add_box(f"{prefix}_Block_{bx}_{by}", (cx + bx, cy + by, cz + 0.06), (0.12, 0.12, 0.075), mat_wood, parent=parent)
    # 5 top deckboards
    for ty in (-0.4, -0.2, 0.0, 0.2, 0.4):
        add_box(f"{prefix}_Deck_{ty}", (cx, cy + ty, cz + 0.11), (1.2, 0.14, 0.025), mat_wood, parent=parent)

def add_cardboard_box(name, location, size, mat_box, mat_tape, parent=None, bevel=0.012):
    """Creates a cardboard box with a center sealing tape strip."""
    bx, by, bz = location
    sx, sy, sz = size
    add_box(name, location, size, mat_box, parent=parent, bevel=bevel)
    # Sealing tape across top and down sides
    tape_w = 0.065
    add_box(f"{name}_Tape_Top", (bx, by, bz + sz / 2.0 + 0.003), (tape_w, sy + 0.004, 0.006), mat_tape, parent=parent)
    add_box(f"{name}_Tape_SideF", (bx, by + sy / 2.0 + 0.003, bz + sz * 0.25), (tape_w, 0.006, sz * 0.45), mat_tape, parent=parent)
    add_box(f"{name}_Tape_SideB", (bx, by - sy / 2.0 - 0.003, bz + sz * 0.25), (tape_w, 0.006, sz * 0.45), mat_tape, parent=parent)

def add_blue_container(name, location, size, mat_container, mat_trim, parent=None):
    """Creates an industrial steel-blue tote container with reinforced collar and handles."""
    tx, ty, tz = location
    sx, sy, sz = size
    add_box(name, location, size, mat_container, parent=parent, bevel=0.015)
    # Reinforced top lip collar
    add_box(f"{name}_Rim", (tx, ty, tz + sz / 2.0 - 0.02), (sx + 0.03, sy + 0.03, 0.045), mat_trim, parent=parent)
    # Recessed handles on left and right
    add_box(f"{name}_Handle_L", (tx - sx / 2.0 - 0.002, ty, tz + sz * 0.2), (0.015, 0.12, 0.04), mat_trim, parent=parent)
    add_box(f"{name}_Handle_R", (tx + sx / 2.0 + 0.002, ty, tz + sz * 0.2), (0.015, 0.12, 0.04), mat_trim, parent=parent)

def finalize_asset(root):
    """Applies modifiers and transforms so all meshes have origins at root bottom-center."""
    bpy.context.view_layer.update()
    for obj in list(root.children_recursive):
        if obj.type == "MESH":
            bpy.context.view_layer.objects.active = obj
            obj.select_set(True)
            for mod in list(obj.modifiers):
                try:
                    bpy.ops.object.modifier_apply(modifier=mod.name)
                except Exception:
                    pass
            try:
                bpy.ops.object.shade_smooth_by_angle(angle=math.radians(30))
            except Exception:
                for poly in obj.data.polygons:
                    poly.use_smooth = True
            bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
            obj.select_set(False)

    root.location = Vector((0, 0, 0))
    bpy.context.view_layer.update()

def compute_asset_bounds_and_tris(root):
    min_v = Vector((float("inf"), float("inf"), float("inf")))
    max_v = Vector((float("-inf"), float("-inf"), float("-inf")))
    total_tris = 0
    for obj in [root] + list(root.children_recursive):
        if obj.type == "MESH":
            total_tris += sum(len(p.vertices) - 2 for p in obj.data.polygons)
            for v in obj.data.vertices:
                world_pos = obj.matrix_world @ v.co
                min_v.x = min(min_v.x, world_pos.x)
                min_v.y = min(min_v.y, world_pos.y)
                min_v.z = min(min_v.z, world_pos.z)
                max_v.x = max(max_v.x, world_pos.x)
                max_v.y = max(max_v.y, world_pos.y)
                max_v.z = max(max_v.z, world_pos.z)
    dims = (max_v.x - min_v.x, max_v.y - min_v.y, max_v.z - min_v.z)
    return dims, total_tris

def export_glb(root, filepath):
    os.makedirs(os.path.dirname(filepath), exist_ok=True)
    bpy.ops.object.select_all(action="DESELECT")
    for obj in [root] + list(root.children_recursive):
        obj.select_set(True)
    bpy.context.view_layer.objects.active = root

    kwargs = dict(
        filepath=filepath,
        export_format="GLB",
        use_selection=True,
        export_apply=False,
        export_yup=True,
        export_materials="EXPORT",
        export_animations=False,
        export_skins=False,
        export_morph=False,
        export_lights=False,
        export_cameras=False,
    )
    try:
        bpy.ops.export_scene.gltf(**kwargs)
    except TypeError:
        bpy.ops.export_scene.gltf(
            filepath=filepath,
            export_format="GLB",
            use_selection=True,
            export_yup=True,
        )

    if not os.path.isfile(filepath):
        raise RuntimeError(f"GLB export failed: {filepath}")

    size_kb = os.path.getsize(filepath) / 1024.0
    dims, tris = compute_asset_bounds_and_tris(root)
    return dims, tris, size_kb

# ============================================================================
# 📦 ASSET BUILDERS
# ============================================================================

def build_cargo_cluster_a():
    """1. cargo_cluster_a.glb: Pallet + 6 cardboard boxes stacked 3+2+1 (~1.2 x 1.0 x 1.4 m)"""
    root = create_empty_root("CargoClusterA_Root")
    mat_wood = make_material("Mat_Cargo_Wood", COLOR_PALLET_WOOD, roughness=0.85)
    mat_box = make_material("Mat_Cargo_Box", COLOR_CARDBOARD, roughness=0.75)
    mat_tape = make_material("Mat_Cargo_Tape", COLOR_TAPE, roughness=0.6)

    # 1. Wooden Pallet (1.2 x 1.0 x 0.14 m)
    build_pallet_submesh("PalletA", (0, 0, 0), root, mat_wood)

    # 2. Level 1: 3 boxes on pallet (Z = 0.14 to 0.56, height 0.42)
    # Box 1 left
    add_cardboard_box("Box_L1_1", (-0.38, 0, 0.35), (0.38, 0.90, 0.42), mat_box, mat_tape, root)
    # Box 2 right-front
    add_cardboard_box("Box_L1_2", (0.20, -0.23, 0.35), (0.74, 0.44, 0.42), mat_box, mat_tape, root)
    # Box 3 right-back
    add_cardboard_box("Box_L1_3", (0.20, 0.23, 0.35), (0.74, 0.44, 0.42), mat_box, mat_tape, root)

    # 3. Level 2: 2 boxes stacked (Z = 0.56 to 0.98, height 0.42)
    add_cardboard_box("Box_L2_1", (-0.28, 0, 0.77), (0.54, 0.88, 0.42), mat_box, mat_tape, root)
    add_cardboard_box("Box_L2_2", (0.28, 0, 0.77), (0.54, 0.88, 0.42), mat_box, mat_tape, root)

    # 4. Level 3: 1 box on top (Z = 0.98 to 1.38, height 0.40)
    add_cardboard_box("Box_L3_1", (0.02, -0.02, 1.18), (0.56, 0.56, 0.40), mat_box, mat_tape, root)

    finalize_asset(root)
    return root

def build_cargo_cluster_b():
    """2. cargo_cluster_b.glb: Pallet + 4 steel-blue containers 2x2 + 1 cardboard box (~1.2 x 1.0 x 1.3 m)"""
    root = create_empty_root("CargoClusterB_Root")
    mat_wood = make_material("Mat_Cargo_Wood", COLOR_PALLET_WOOD, roughness=0.85)
    mat_container = make_material("Mat_Cargo_Container", COLOR_CONTAINER_BLUE, roughness=0.45)
    mat_trim = make_material("Mat_Cargo_Trim", COLOR_TROLLEY_FRAME, roughness=0.6)
    mat_box = make_material("Mat_Cargo_Box", COLOR_CARDBOARD, roughness=0.75)
    mat_tape = make_material("Mat_Cargo_Tape", COLOR_TAPE, roughness=0.6)

    # 1. Wooden Pallet (1.2 x 1.0 x 0.14 m)
    build_pallet_submesh("PalletB", (0, 0, 0), root, mat_wood)

    # 2. 4 Steel-blue containers (2x2 grid, height 0.48m)
    c_coords = [
        ("C1", (-0.28, -0.23, 0.38)),
        ("C2", (0.28, -0.23, 0.38)),
        ("C3", (-0.28, 0.23, 0.38)),
        ("C4", (0.28, 0.23, 0.38)),
    ]
    for tag, pos in c_coords:
        add_blue_container(tag, pos, (0.52, 0.43, 0.46), mat_container, mat_trim, root)

    # 3. 1 Cardboard box centered on top (Z = 0.14 + 0.48 = 0.62)
    add_cardboard_box("TopBox", (0, 0, 0.88), (0.64, 0.54, 0.50), mat_box, mat_tape, root)

    finalize_asset(root)
    return root

def build_simplified_pallet(prefix, center_pos, parent, mat_wood):
    """Creates an optimized low-poly pallet (~1.2 x 1.0 x 0.14 m) with ~60 triangles."""
    cx, cy, cz = center_pos
    # 3 bottom runners
    for bx in (-0.45, 0.0, 0.45):
        add_box(f"{prefix}_Runner_{bx}", (cx + bx, cy, cz + 0.035), (0.12, 1.0, 0.07), mat_wood, parent=parent)
    # 4 top deckboards
    for ty in (-0.38, -0.12, 0.12, 0.38):
        add_box(f"{prefix}_Deck_{ty}", (cx, cy + ty, cz + 0.105), (1.2, 0.18, 0.07), mat_wood, parent=parent)

def build_cargo_row():
    """3. cargo_row.glb: 3 pallets in a row with mixed boxes + 1 blue container (~3.8 x 1.2 x 1.3 m, <1.2k tris)"""
    root = create_empty_root("CargoRow_Root")
    mat_wood = make_material("Mat_Cargo_Wood", COLOR_PALLET_WOOD, roughness=0.85)
    mat_box = make_material("Mat_Cargo_Box", COLOR_CARDBOARD, roughness=0.75)
    mat_tape = make_material("Mat_Cargo_Tape", COLOR_TAPE, roughness=0.6)
    mat_container = make_material("Mat_Cargo_Container", COLOR_CONTAINER_BLUE, roughness=0.45)
    mat_trim = make_material("Mat_Cargo_Trim", COLOR_TROLLEY_FRAME, roughness=0.6)

    pallet_x_offsets = (-1.28, 0.0, 1.28)

    # Pallet 1 (Left): 4 boxes 2x2 on bottom, 1 box on top (no bevel for strict triangle budget)
    build_simplified_pallet("RowPallet1", (pallet_x_offsets[0], 0, 0), root, mat_wood)
    for i, (dx, dy) in enumerate([(-0.27, -0.22), (0.27, -0.22), (-0.27, 0.22), (0.27, 0.22)]):
        add_cardboard_box(f"P1_Box_{i+1}", (pallet_x_offsets[0] + dx, dy, 0.38), (0.50, 0.42, 0.46), mat_box, mat_tape, root, bevel=0.0)
    add_cardboard_box("P1_Top_1", (pallet_x_offsets[0], 0, 0.83), (0.75, 0.70, 0.42), mat_box, mat_tape, root, bevel=0.0)

    # Pallet 2 (Center): 2 cardboard boxes + 1 blue container + 1 top box
    build_simplified_pallet("RowPallet2", (pallet_x_offsets[1], 0, 0), root, mat_wood)
    add_blue_container("P2_Container", (pallet_x_offsets[1] - 0.28, 0, 0.38), (0.52, 0.86, 0.46), mat_container, mat_trim, root)
    add_cardboard_box("P2_Box_1", (pallet_x_offsets[1] + 0.28, -0.22, 0.38), (0.52, 0.42, 0.46), mat_box, mat_tape, root, bevel=0.0)
    add_cardboard_box("P2_Box_2", (pallet_x_offsets[1] + 0.28, 0.22, 0.38), (0.52, 0.42, 0.46), mat_box, mat_tape, root, bevel=0.0)
    add_cardboard_box("P2_Top", (pallet_x_offsets[1], 0, 0.83), (0.68, 0.58, 0.42), mat_box, mat_tape, root, bevel=0.0)

    # Pallet 3 (Right): 3 tall boxes + 1 top box
    build_simplified_pallet("RowPallet3", (pallet_x_offsets[2], 0, 0), root, mat_wood)
    add_cardboard_box("P3_Box_1", (pallet_x_offsets[2] - 0.28, -0.22, 0.42), (0.52, 0.42, 0.54), mat_box, mat_tape, root, bevel=0.0)
    add_cardboard_box("P3_Box_2", (pallet_x_offsets[2] + 0.28, -0.22, 0.42), (0.52, 0.42, 0.54), mat_box, mat_tape, root, bevel=0.0)
    add_cardboard_box("P3_Box_3", (pallet_x_offsets[2], 0.22, 0.42), (1.08, 0.42, 0.54), mat_box, mat_tape, root, bevel=0.0)
    add_cardboard_box("P3_Top", (pallet_x_offsets[2], 0, 0.90), (0.75, 0.65, 0.40), mat_box, mat_tape, root, bevel=0.0)

    finalize_asset(root)
    return root

def build_rack_full():
    """4. rack_full.glb: Update existing rack — both shelf levels filled with boxes"""
    root = create_empty_root("RackFull_Root")
    mat_uprights = make_material("Mat_Rack_Uprights", COLOR_CONTAINER_BLUE, roughness=0.4)
    mat_shelf = make_material("Mat_Rack_Shelf", COLOR_STEEL_SHELF, roughness=0.5)
    mat_box = make_material("Mat_Rack_Box", COLOR_CARDBOARD, roughness=0.75)
    mat_tape = make_material("Mat_Rack_Tape", COLOR_TAPE, roughness=0.6)
    mat_details = make_material("Mat_Rack_Details", COLOR_TROLLEY_FRAME, roughness=0.7)

    col_x = (-1.25, 1.25)
    col_y = (-0.5, 0.5)

    # 4 Vertical corner columns + base footplates (Height 3.0m)
    for cx in col_x:
        for cy in col_y:
            add_box(f"Rack_Col_{cx}_{cy}", (cx, cy, 1.5), (0.08, 0.08, 3.0), mat_uprights, parent=root)
            add_box(f"Rack_Foot_{cx}_{cy}", (cx, cy, 0.015), (0.16, 0.16, 0.03), mat_details, parent=root)

    # Side cross bracing
    for cx in col_x:
        for bz in (0.7, 1.8, 2.7):
            add_box(f"Rack_SideBrace_{cx}_{bz}", (cx, 0, bz), (0.04, 0.94, 0.04), mat_uprights, parent=root)

    # 2 Shelf Levels: Level 1 at Z=1.1m, Level 2 at Z=2.2m
    for i, sz in enumerate((1.1, 2.2)):
        add_box(f"Rack_BeamF_{i+1}", (0, 0.5, sz), (2.56, 0.07, 0.12), mat_uprights, parent=root)
        add_box(f"Rack_BeamR_{i+1}", (0, -0.5, sz), (2.56, 0.07, 0.12), mat_uprights, parent=root)
        add_box(f"Rack_Deck_{i+1}", (0, 0, sz + 0.045), (2.42, 0.94, 0.03), mat_shelf, parent=root)

    # Level 1 Shelf (Lower): 3 Cardboard boxes side-by-side
    for i, bx in enumerate((-0.75, 0.0, 0.75)):
        add_cardboard_box(f"L1_Box_{i+1}", (bx, 0, 1.48), (0.70, 0.76, 0.60), mat_box, mat_tape, root)

    # Level 2 Shelf (Upper): 3 Cardboard boxes side-by-side
    for i, bx in enumerate((-0.75, 0.0, 0.75)):
        add_cardboard_box(f"L2_Box_{i+1}", (bx, 0, 2.56), (0.70, 0.76, 0.56), mat_box, mat_tape, root)

    finalize_asset(root)
    return root

def build_trolley():
    """5. trolley.glb: Simple hand trolley carrying 1 cardboard box (~0.6 x 0.5 x 1.1 m)"""
    root = create_empty_root("Trolley_Root")
    mat_frame = make_material("Mat_Trolley_Frame", COLOR_TROLLEY_FRAME, roughness=0.6)
    mat_box = make_material("Mat_Trolley_Box", COLOR_CARDBOARD, roughness=0.75)
    mat_tape = make_material("Mat_Trolley_Tape", COLOR_TAPE, roughness=0.6)

    # Frame upright tubular posts (X = -0.18, +0.18, height 1.05m)
    add_box("Trolley_Post_L", (-0.18, 0, 0.56), (0.04, 0.04, 1.02), mat_frame, parent=root)
    add_box("Trolley_Post_R", (0.18, 0, 0.56), (0.04, 0.04, 1.02), mat_frame, parent=root)

    # Top handle crossbar
    add_box("Trolley_Handle_Top", (0, 0, 1.07), (0.42, 0.04, 0.04), mat_frame, parent=root)
    # Middle crossbar braces
    add_box("Trolley_Brace_Mid1", (0, 0, 0.75), (0.36, 0.03, 0.03), mat_frame, parent=root)
    add_box("Trolley_Brace_Mid2", (0, 0, 0.45), (0.36, 0.03, 0.03), mat_frame, parent=root)

    # Bottom toe/nose plate extending forward (+Y direction)
    add_box("Trolley_NosePlate", (0, 0.16, 0.04), (0.42, 0.32, 0.02), mat_frame, parent=root)

    # Wheel axle at rear (-Y direction, Z = 0.10)
    add_cylinder("Trolley_Axle", (0, -0.08, 0.10), radius=0.018, depth=0.48, material=mat_frame, parent=root, rotation=(0, 90, 0), segments=8)
    # 2 Wheels (left and right)
    add_cylinder("Trolley_Wheel_L", (-0.24, -0.08, 0.10), radius=0.10, depth=0.04, material=mat_frame, parent=root, rotation=(0, 90, 0), segments=12)
    add_cylinder("Trolley_Wheel_R", (0.24, -0.08, 0.10), radius=0.10, depth=0.04, material=mat_frame, parent=root, rotation=(0, 90, 0), segments=12)

    # 1 Cardboard box resting on the toe plate against the vertical frame
    # Sits on nose plate at Z = 0.05 + 0.22 = 0.27, Y = 0.16
    add_cardboard_box("Trolley_Box", (0, 0.16, 0.28), (0.38, 0.30, 0.44), mat_box, mat_tape, root)

    finalize_asset(root)
    return root

# ============================================================================
# MAIN PIPELINE
# ============================================================================
PROPS_REGISTRY = [
    ("cargo_cluster_a.glb", build_cargo_cluster_a),
    ("cargo_cluster_b.glb", build_cargo_cluster_b),
    ("cargo_row.glb", build_cargo_row),
    ("rack_full.glb", build_rack_full),
    ("trolley.glb", build_trolley),
]

def main():
    export_dir = os.path.abspath(EXPORT_DIR_OVERRIDE)
    os.makedirs(export_dir, exist_ok=True)

    print("=" * 80)
    print("AutoReplenish.ai — Generating Staging & Cargo Props (Blender 5.2)")
    print(f"Export Destination: {export_dir}")
    print("=" * 80)

    results = []
    for filename, builder_func in PROPS_REGISTRY:
        clear_scene()
        root = builder_func()
        filepath = os.path.join(export_dir, filename)
        dims, tris, size_kb = export_glb(root, filepath)
        status = "PASSED" if tris < 1200 else "EXCEEDS_BUDGET"
        dim_str = f"{dims[0]:.2f} x {dims[1]:.2f} x {dims[2]:.2f} m"
        results.append({
            "asset": filename,
            "dims": dim_str,
            "tris": tris,
            "size_kb": f"{size_kb:.1f} KB",
            "status": status,
        })

    clear_scene()

    print("\n" + "=" * 80)
    print("EXPORT CONFIRMATION TABLE")
    print("=" * 80)
    print(f"{'Asset':<22} | {'Dimensions (X x Y x Z)':<24} | {'Triangles':<10} | {'Size':<10} | {'Status'}")
    print("-" * 80)
    for r in results:
        print(f"{r['asset']:<22} | {r['dims']:<24} | {r['tris']:<10} | {r['size_kb']:<10} | {r['status']}")
    print("=" * 80)
    return results

if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
        sys.exit(1)
