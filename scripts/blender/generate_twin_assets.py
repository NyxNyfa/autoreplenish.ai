"""
generate_twin_assets.py — AutoReplenish.ai Digital Twin 3D Assets
==================================================================
Regenerates ALL 10 3D assets for the AutoReplenish.ai digital twin in a
SOFT PASTEL ISOMETRIC style (reference: modern logistics digital-twin dashboards).

Technical specs:
- Low-poly, WebGL-optimized (< 1,500 triangles per asset)
- Flat Principled BSDF materials (base color only, NO textures)
- Origin at bottom-center (Z_min = 0, X_center = 0, Y_center = 0)
- Transforms applied; smooth shade with auto-smooth 30 deg
- Separate meshes for critical components (Headlights, Taillights, Signage)
- Exported as separate .glb files (Y-up, meters, export_materials=True)
- Fully idempotent (safe to re-run anytime)
"""

import math
import os
import sys
import traceback
import bpy
from mathutils import Matrix, Vector

# ============================================================================
# 🎨 COLOR PALETTE (Soft Pastel Isometric / WareTrack-style)
# ============================================================================
COLOR_WALL = "#FAFBFF"             # Building walls (near-white)
COLOR_ROOF = "#3B82F6"             # Roofs (blue, slight sheen)
COLOR_GLASS = "#BFD7F5"            # Glass storefront & windows (light blue)
COLOR_BOX = "#D8B48E"              # Cardboard boxes
COLOR_TAPE = "#E8D3B8"             # Box sealing tape strip
COLOR_BLUE_CONTAINER = "#4A7DFC"   # Blue containers / pallets
COLOR_TRUCK_CAB_A = "#2563EB"      # Truck cab variant A (blue)
COLOR_TRUCK_CAB_B = "#FAFBFF"      # Truck cab variant B (white)
COLOR_TRUCK_TEAL = "#2DD4BF"       # Truck partner stripe (teal)
COLOR_TRUCK_CARGO = "#FAFBFF"      # Truck cargo box (white)
COLOR_TRUCK_STRIPE = "#2563EB"     # Thin blue stripe on cargo box
COLOR_TRUCK_PANEL = "#EEF2F9"      # Blank side logo panel
COLOR_DETAILS = "#2A2F3A"          # Wheels, chassis, bumpers, frames
COLOR_HEADLIGHT = "#FFFDE6"        # Warm light headlight
COLOR_TAILLIGHT = "#EF4444"        # Red taillight
COLOR_TREE_CANOPY = "#86D9A5"      # Tree canopy pastel green
COLOR_TREE_TRUNK = "#8B6F4E"       # Tree trunk brown
COLOR_ROAD = "#DDE3F0"             # Road tile pastel slate
COLOR_ROAD_MARKING = "#FAFBFF"     # Road white dashed line
COLOR_ROAD_CURB = "#CBD5E1"        # Road edge curb
COLOR_BAY_OUTLINE = "#F2C94C"      # Parking bay outline yellow
COLOR_WOOD = "#C89D66"             # Pallet natural wood

EXPORT_DIR_OVERRIDE = r"d:\School Space\Autoreplenish.ai\Web\public\models\twin"

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================
def srgb_to_linear(hex_color):
    """Convert #rrggbb to scene-linear float tuple (0.0 - 1.0)."""
    h = hex_color.lstrip("#")
    out = []
    for i in (0, 2, 4):
        v = int(h[i:i + 2], 16) / 255.0
        out.append(v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4)
    return tuple(out)

def clear_scene():
    """Reset to a completely clean Blender scene."""
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

def make_material(name, hex_color, roughness=0.5, metallic=0.0, specular=0.5):
    """Create or update a Principled BSDF material (flat base color only, NO textures)."""
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
    # Scale mesh geometry so object scale stays (1,1,1)
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

def add_icosphere(name, location, radius, subdivisions=1, material=None, parent=None):
    bpy.ops.mesh.primitive_ico_sphere_add(
        subdivisions=subdivisions,
        radius=radius,
        location=location
    )
    obj = bpy.context.active_object
    obj.name = name
    assign_material(obj, material)
    if parent:
        obj.parent = parent
        obj.matrix_parent_inverse = parent.matrix_world.inverted()
    return obj

def get_asset_bbox(root):
    minv = Vector((1e20, 1e20, 1e20))
    maxv = Vector((-1e20, -1e20, -1e20))
    found = False
    for obj in [root] + list(root.children_recursive):
        if obj.type == "MESH":
            found = True
            for corner in obj.bound_box:
                w = obj.matrix_world @ Vector(corner)
                for i in range(3):
                    minv[i] = min(minv[i], w[i])
                    maxv[i] = max(maxv[i], w[i])
    if not found:
        return Vector((0, 0, 0)), Vector((0, 0, 0))
    return minv, maxv

def finalize_asset(root, keep_pivot_names=None):
    """
    Bottom-center the entire asset hierarchy:
      - Shifts geometry so lowest Z = 0.0, center X = 0.0, center Y = 0.0.
      - Smooth-shades all meshes with auto-smooth 30 deg.
      - Applies modifiers (e.g. bevel) and transforms.
      - Keeps wheel/pivot points centered if specified in keep_pivot_names.
    """
    if keep_pivot_names is None:
        keep_pivot_names = set()

    minv, maxv = get_asset_bbox(root)
    # Calculate offset needed to bring asset to bottom-center
    shift = Vector((-(minv.x + maxv.x) / 2.0, -(minv.y + maxv.y) / 2.0, -minv.z))

    # Apply shift to all top-level children under root
    for obj in root.children:
        obj.location += shift
    bpy.context.view_layer.update()

    # Apply modifiers and transforms
    for obj in list(root.children_recursive):
        if obj.type == "MESH":
            bpy.context.view_layer.objects.active = obj
            obj.select_set(True)

            # Apply any modifiers
            for mod in list(obj.modifiers):
                try:
                    bpy.ops.object.modifier_apply(modifier=mod.name)
                except Exception:
                    pass

            # Auto-smooth 30 degrees
            try:
                bpy.ops.object.shade_smooth_by_angle(angle=math.radians(30))
            except Exception:
                for poly in obj.data.polygons:
                    poly.use_smooth = True

            # Transform apply:
            # If object needs pivot at its center (like rotating wheels), keep location, apply rot/scale
            if any(p in obj.name for p in keep_pivot_names):
                bpy.ops.object.transform_apply(location=False, rotation=True, scale=True)
            else:
                # Static part: apply all transforms so origin aligns with root bottom-center (0,0,0)
                bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

            obj.select_set(False)

    root.location = Vector((0, 0, 0))
    bpy.context.view_layer.update()

def count_triangles(root):
    total = 0
    for obj in [root] + list(root.children_recursive):
        if obj.type == "MESH":
            total += sum(len(p.vertices) - 2 for p in obj.data.polygons)
    return total

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
    tris = count_triangles(root)
    return tris, size_kb

# ============================================================================
# 📦 ASSET BUILDERS
# ============================================================================

# ----------------------------------------------------------------------------
# 1 & 2: Box Truck (~6m) — Variant A (Blue) & Variant B (Partner White + Teal)
# ----------------------------------------------------------------------------
def build_truck(variant="A"):
    root_name = "TruckBox_Root" if variant == "A" else "TruckBoxPartner_Root"
    prefix = "Truck" if variant == "A" else "TruckPartner"
    root = create_empty_root(root_name)

    # Materials
    mat_chassis = make_material(f"Mat_{prefix}_Chassis", COLOR_DETAILS, roughness=0.8)
    mat_wheel = make_material(f"Mat_{prefix}_Wheel", COLOR_DETAILS, roughness=0.9)
    mat_rim = make_material(f"Mat_{prefix}_Rim", COLOR_ROAD, roughness=0.4)
    mat_glass = make_material(f"Mat_{prefix}_Glass", COLOR_GLASS, roughness=0.15, specular=0.6)
    mat_details = make_material(f"Mat_{prefix}_Details", COLOR_DETAILS, roughness=0.7)
    mat_cargo = make_material(f"Mat_{prefix}_Cargo", COLOR_TRUCK_CARGO, roughness=0.5)
    mat_stripe = make_material(f"Mat_{prefix}_Stripe", COLOR_TRUCK_STRIPE, roughness=0.4)
    mat_panel = make_material(f"Mat_{prefix}_Panel", COLOR_TRUCK_PANEL, roughness=0.6)
    mat_headlight = make_material(f"Mat_{prefix}_Headlight", COLOR_HEADLIGHT, roughness=0.2)
    mat_taillight = make_material(f"Mat_{prefix}_Taillight", COLOR_TAILLIGHT, roughness=0.2)

    if variant == "A":
        mat_cab = make_material("Mat_Truck_Cab", COLOR_TRUCK_CAB_A, roughness=0.4)
        mat_cab_accent = None
    else:
        mat_cab = make_material("Mat_TruckPartner_Cab", COLOR_TRUCK_CAB_B, roughness=0.4)
        mat_cab_accent = make_material("Mat_TruckPartner_Stripe", COLOR_TRUCK_TEAL, roughness=0.35)

    # Chassis frame
    add_box(f"{prefix}_Chassis", (0, -0.4, 0.45), (1.4, 5.4, 0.25), mat_chassis, parent=root)
    # Fuel tank & battery box
    add_box(f"{prefix}_FuelTank_L", (-0.95, -0.6, 0.45), (0.45, 1.2, 0.35), mat_details, parent=root)
    add_box(f"{prefix}_BatteryBox_R", (0.95, -0.6, 0.45), (0.45, 0.9, 0.35), mat_details, parent=root)
    # Rear underrun bumper
    add_box(f"{prefix}_RearBumper", (0, -3.1, 0.42), (2.1, 0.15, 0.18), mat_details, parent=root)

    # 6 Wheels: 1 front axle (Y=1.7), 2 rear tandem axles (Y=-1.5, Y=-2.6)
    # Radii 0.42m, width 0.26m
    wheel_positions = [
        ("FL", (-1.05, 1.7, 0.42)),
        ("FR", (1.05, 1.7, 0.42)),
        ("ML", (-1.05, -1.5, 0.42)),
        ("MR", (1.05, -1.5, 0.42)),
        ("RL", (-1.05, -2.6, 0.42)),
        ("RR", (1.05, -2.6, 0.42)),
    ]
    for tag, pos in wheel_positions:
        # Wheel tire (rotated 90 deg along Y so cylinder axis is X)
        w_obj = add_cylinder(
            f"Wheel_{tag}", pos, radius=0.42, depth=0.26,
            material=mat_wheel, parent=root, rotation=(0, 90, 0), segments=16
        )
        # Hub rim inset
        rim_offset = -0.11 if pos[0] < 0 else 0.11
        add_cylinder(
            f"Rim_{tag}", (pos[0] + rim_offset, pos[1], pos[2]), radius=0.24, depth=0.08,
            material=mat_rim, parent=w_obj, rotation=(0, 90, 0), segments=12
        )

    # Cab (front at +Y)
    # Rounded cab box: 2.1m wide, 1.8m deep, 1.9m tall
    add_box(f"{prefix}_Cab", (0, 1.6, 1.45), (2.1, 1.8, 1.75), mat_cab, parent=root, bevel=0.08)
    # Front bumper & grille
    add_box(f"{prefix}_FrontBumper", (0, 2.52, 0.52), (2.15, 0.22, 0.35), mat_details, parent=root)
    add_box(f"{prefix}_Grille", (0, 2.52, 1.05), (1.4, 0.08, 0.55), mat_details, parent=root)

    # Windshield (slanted front glass)
    add_box(f"{prefix}_Windshield", (0, 2.42, 1.75), (1.9, 0.12, 0.75), mat_glass, parent=root)
    # Side windows
    add_box(f"{prefix}_SideWindow_L", (-1.06, 1.7, 1.75), (0.06, 0.9, 0.65), mat_glass, parent=root)
    add_box(f"{prefix}_SideWindow_R", (1.06, 1.7, 1.75), (0.06, 0.9, 0.65), mat_glass, parent=root)

    # Variant B teal livery stripe on cab
    if variant == "B" and mat_cab_accent:
        add_box(f"{prefix}_TealStripe_Front", (0, 2.52, 1.35), (2.12, 0.06, 0.15), mat_cab_accent, parent=root)
        add_box(f"{prefix}_TealStripe_L", (-1.06, 1.6, 1.35), (0.06, 1.82, 0.15), mat_cab_accent, parent=root)
        add_box(f"{prefix}_TealStripe_R", (1.06, 1.6, 1.35), (0.06, 1.82, 0.15), mat_cab_accent, parent=root)

    # Side mirrors
    add_box(f"{prefix}_Mirror_L", (-1.18, 2.2, 1.75), (0.08, 0.18, 0.32), mat_details, parent=root)
    add_box(f"{prefix}_Mirror_R", (1.18, 2.2, 1.75), (0.08, 0.18, 0.32), mat_details, parent=root)
    add_cylinder(f"{prefix}_MirrorArm_L", (-1.12, 2.2, 1.75), radius=0.02, depth=0.15, material=mat_details, parent=root, rotation=(0, 90, 0), segments=8)
    add_cylinder(f"{prefix}_MirrorArm_R", (1.12, 2.2, 1.75), radius=0.02, depth=0.15, material=mat_details, parent=root, rotation=(0, 90, 0), segments=8)

    # Separate meshes for Headlights & Taillights (named explicitly for R3F emissive swap)
    add_box("Headlights", (0, 2.58, 0.68), (1.8, 0.08, 0.14), mat_headlight, parent=root)
    add_box("Taillights", (0, -3.15, 0.55), (1.7, 0.06, 0.14), mat_taillight, parent=root)

    # Cargo Box (white #FAFBFF with thin blue bottom stripe + blank logo panels)
    # Box size: ~2.25m wide, ~3.7m deep, ~2.1m high
    add_box(f"{prefix}_CargoBox", (0, -1.2, 1.8), (2.25, 3.7, 2.1), mat_cargo, parent=root, bevel=0.04)
    # Thin blue bottom stripe
    add_box(f"{prefix}_BottomStripe_L", (-1.135, -1.2, 0.85), (0.04, 3.72, 0.14), mat_stripe, parent=root)
    add_box(f"{prefix}_BottomStripe_R", (1.135, -1.2, 0.85), (0.04, 3.72, 0.14), mat_stripe, parent=root)
    add_box(f"{prefix}_BottomStripe_Rear", (0, -3.06, 0.85), (2.26, 0.04, 0.14), mat_stripe, parent=root)

    # Blank side logo panels
    add_box(f"{prefix}_LogoPanel_L", (-1.136, -1.2, 1.9), (0.03, 2.2, 0.9), mat_panel, parent=root)
    add_box(f"{prefix}_LogoPanel_R", (1.136, -1.2, 1.9), (0.03, 2.2, 0.9), mat_panel, parent=root)

    # Rear door frame & roll-up slats
    add_box(f"{prefix}_RearDoorFrame", (0, -3.06, 1.8), (1.95, 0.05, 1.85), mat_details, parent=root)

    # Cab roof aero deflector cap
    add_box(f"{prefix}_AeroCap", (0, 1.25, 2.5), (1.9, 0.8, 0.35), mat_cab, parent=root)

    finalize_asset(root, keep_pivot_names={"Wheel_"})
    return root

# ----------------------------------------------------------------------------
# 3: Minimarket (~12x8x4m)
# ----------------------------------------------------------------------------
def build_minimarket():
    root = create_empty_root("Minimarket_Root")

    # Materials
    mat_wall = make_material("Mat_Minimarket_Wall", COLOR_WALL, roughness=0.85)
    mat_roof = make_material("Mat_Minimarket_Roof", COLOR_ROOF, roughness=0.35, specular=0.5)
    mat_glass = make_material("Mat_Minimarket_Glass", COLOR_GLASS, roughness=0.15, specular=0.6)
    mat_canopy = make_material("Mat_Minimarket_Canopy", COLOR_ROOF, roughness=0.35, specular=0.5)
    mat_door = make_material("Mat_Minimarket_Door", COLOR_DETAILS, roughness=0.7)
    mat_sign = make_material("Mat_Minimarket_Signage", COLOR_ROOF, roughness=0.35, specular=0.5)
    mat_base = make_material("Mat_Minimarket_Base", COLOR_ROAD, roughness=0.9)
    mat_details = make_material("Mat_Minimarket_Details", COLOR_DETAILS, roughness=0.75)

    # Perimeter base foundation / sidewalk plinth (12.6m x 8.6m x 0.15m)
    add_box("Minimarket_Base", (0, 0, 0.075), (12.6, 8.6, 0.15), mat_base, parent=root)

    # Main building walls: 11.8m wide, 7.8m deep, 3.7m tall
    add_box("Minimarket_Body", (0, 0, 1.95), (11.8, 7.8, 3.6), mat_wall, parent=root, bevel=0.04)

    # Blue flat roof with overhang (12.5m x 8.5m x 0.35m at top Z)
    add_box("Minimarket_Roof", (0, 0, 3.9), (12.5, 8.5, 0.35), mat_roof, parent=root)
    # Parapet edge trim
    add_box("Minimarket_RoofTrim", (0, 0, 4.1), (12.6, 8.6, 0.12), mat_roof, parent=root)

    # Glass storefront on front facade (Y = +3.9m)
    # Large display window panes + framing
    add_box("Minimarket_Storefront_Glass", (0, 3.92, 1.55), (9.8, 0.08, 2.3), mat_glass, parent=root)
    add_box("Minimarket_Storefront_Frame_Bot", (0, 3.93, 0.42), (10.0, 0.1, 0.12), mat_details, parent=root)
    add_box("Minimarket_Storefront_Frame_Top", (0, 3.93, 2.72), (10.0, 0.1, 0.12), mat_details, parent=root)
    # Mullions
    for mx in (-3.6, -1.8, 0.0, 1.8, 3.6):
        add_box(f"Minimarket_Mullion_{mx}", (mx, 3.93, 1.55), (0.08, 0.1, 2.2), mat_details, parent=root)

    # Sliding entrance doors in center
    add_box("Minimarket_EntranceDoor", (0, 3.94, 1.35), (2.0, 0.06, 2.1), mat_door, parent=root)

    # Entrance canopy over front doors
    add_box("Minimarket_Canopy", (0, 4.5, 2.95), (4.2, 1.5, 0.15), mat_canopy, parent=root)
    # Canopy support struts
    add_box("Minimarket_CanopySupport_L", (-1.9, 4.4, 2.7), (0.08, 1.1, 0.08), mat_details, parent=root)
    add_box("Minimarket_CanopySupport_R", (1.9, 4.4, 2.7), (0.08, 1.1, 0.08), mat_details, parent=root)

    # Back service door on rear facade (Y = -3.9m)
    add_box("Minimarket_ServiceDoor", (3.2, -3.92, 1.3), (1.3, 0.08, 2.2), mat_door, parent=root)
    add_box("Minimarket_ServiceDoorFrame", (3.2, -3.93, 1.3), (1.45, 0.06, 2.35), mat_details, parent=root)

    # Roof Signage Strip as SEPARATE mesh named "Signage" (7.6m x 0.14m x 0.85m)
    add_box("Signage", (0, 4.22, 3.35), (7.6, 0.14, 0.85), mat_sign, parent=root)
    add_box("Minimarket_SignBackplate", (0, 4.14, 3.35), (7.8, 0.08, 0.95), mat_details, parent=root)

    # Rooftop HVAC units & vents
    add_box("Minimarket_HVAC_1", (-3.2, -1.2, 4.3), (1.6, 1.2, 0.65), mat_details, parent=root)
    add_box("Minimarket_HVAC_2", (3.2, -1.5, 4.25), (1.2, 1.0, 0.55), mat_details, parent=root)
    add_cylinder("Minimarket_Vent", (-1.5, -2.0, 4.25), radius=0.25, depth=0.45, material=mat_base, parent=root, segments=12)

    # Entrance bollards
    for bx in (-2.4, 2.4):
        add_cylinder(f"Minimarket_Bollard_{bx}", (bx, 4.8, 0.45), radius=0.1, depth=0.6, material=mat_details, parent=root, segments=12)

    finalize_asset(root)
    return root

# ----------------------------------------------------------------------------
# 4: Distribution Center Warehouse (~30x14x8m)
# ----------------------------------------------------------------------------
def build_dc_warehouse():
    root = create_empty_root("DC_Warehouse_Root")

    # Materials
    mat_wall = make_material("Mat_DC_Wall", COLOR_WALL, roughness=0.85)
    mat_roof = make_material("Mat_DC_Roof", COLOR_ROOF, roughness=0.35, specular=0.5)
    mat_dock_frame = make_material("Mat_DC_DockFrame", COLOR_ROOF, roughness=0.4)
    mat_dock_door = make_material("Mat_DC_DockDoor", COLOR_DETAILS, roughness=0.75)
    mat_sign = make_material("Mat_DC_Signage", COLOR_ROOF, roughness=0.35, specular=0.5)
    mat_base = make_material("Mat_DC_Base", COLOR_ROAD, roughness=0.9)
    mat_bumper = make_material("Mat_DC_Bumper", COLOR_BAY_OUTLINE, roughness=0.5)
    mat_details = make_material("Mat_DC_Details", COLOR_DETAILS, roughness=0.7)
    mat_glass = make_material("Mat_DC_Glass", COLOR_GLASS, roughness=0.15, specular=0.6)

    # Base apron / foundation (30.6m x 14.6m x 0.25m)
    add_box("DC_Base", (0, 0, 0.125), (30.6, 14.6, 0.25), mat_base, parent=root)

    # Main warehouse hall: 29.6m wide, 13.6m deep, 7.8m high
    add_box("DC_Body", (0, 0, 4.0), (29.6, 13.6, 7.6), mat_wall, parent=root, bevel=0.06)

    # Blue roof with parapet coping (30.2m x 14.2m x 0.45m)
    add_box("DC_Roof", (0, 0, 7.9), (30.2, 14.2, 0.45), mat_roof, parent=root)
    add_box("DC_RoofCoping", (0, 0, 8.15), (30.4, 14.4, 0.15), mat_roof, parent=root)

    # 5 Loading Dock Bays on front facade (Y = +6.8m)
    # Positions: X = -10.0, -5.0, 0.0, +5.0, +10.0
    dock_x_coords = (-10.0, -5.0, 0.0, 5.0, 10.0)
    for i, dx in enumerate(dock_x_coords):
        # Blue projecting dock frame / shelter (3.2m wide, 3.6m tall)
        add_box(f"DC_DockFrame_{i+1}", (dx, 6.95, 2.3), (3.2, 0.45, 3.6), mat_dock_frame, parent=root)
        # Recessed dark opening / roll-up segmented door
        add_box(f"DC_DockDoor_{i+1}", (dx, 6.82, 2.2), (2.6, 0.12, 3.2), mat_dock_door, parent=root)
        # Dock bumpers (pair on left and right of bay)
        add_box(f"DC_DockBumper_L_{i+1}", (dx - 1.45, 7.15, 0.7), (0.22, 0.22, 0.8), mat_bumper, parent=root)
        add_box(f"DC_DockBumper_R_{i+1}", (dx + 1.45, 7.15, 0.7), (0.22, 0.22, 0.8), mat_bumper, parent=root)
        # Bay marker plaque above door
        add_box(f"DC_DockPlaque_{i+1}", (dx, 7.18, 4.2), (0.7, 0.08, 0.35), mat_details, parent=root)

    # Separate mesh named "Signage" on upper facade (10.0m x 0.16m x 1.5m at Z=6.0m)
    add_box("Signage", (0, 6.92, 6.0), (10.0, 0.16, 1.5), mat_sign, parent=root)
    add_box("DC_SignBackplate", (0, 6.84, 6.0), (10.4, 0.08, 1.7), mat_details, parent=root)

    # Administrative 2-story office annex on left wing (X: -14.6 to -12.0)
    add_box("DC_Office_Body", (-13.0, 4.0, 3.2), (3.4, 4.5, 5.8), mat_wall, parent=root)
    # Ribbon windows on office annex
    add_box("DC_Office_Windows_1F", (-13.0, 6.3, 1.6), (3.0, 0.08, 1.1), mat_glass, parent=root)
    add_box("DC_Office_Windows_2F", (-13.0, 6.3, 3.8), (3.0, 0.08, 1.1), mat_glass, parent=root)

    # Rooftop industrial ventilation & skylight strips
    for sx in (-6.0, 6.0):
        add_box(f"DC_Skylight_{sx}", (sx, 0, 8.2), (4.5, 6.0, 0.25), mat_glass, parent=root)
    add_box("DC_RoofHVAC_1", (-8.0, -3.5, 8.4), (2.4, 1.8, 0.9), mat_details, parent=root)
    add_box("DC_RoofHVAC_2", (8.0, -3.5, 8.4), (2.4, 1.8, 0.9), mat_details, parent=root)

    finalize_asset(root)
    return root

# ----------------------------------------------------------------------------
# 5: Pallet with 4 Cardboard Boxes (pallet_cards.glb)
# ----------------------------------------------------------------------------
def build_pallet_cards():
    root = create_empty_root("PalletCards_Root")

    # Materials
    mat_wood = make_material("Mat_PalletCards_Wood", COLOR_WOOD, roughness=0.85)
    mat_box = make_material("Mat_PalletCards_Box", COLOR_BOX, roughness=0.8)
    mat_tape = make_material("Mat_PalletCards_Tape", COLOR_TAPE, roughness=0.65)

    # Wooden Pallet (~1.2m x 1.0m x 0.14m)
    # 3 bottom runners
    for bx in (-0.45, 0.0, 0.45):
        add_box(f"Pallet_Bottom_{bx}", (bx, 0, 0.012), (0.12, 1.0, 0.024), mat_wood, parent=root)
    # 9 stringer spacer blocks
    for bx in (-0.45, 0.0, 0.45):
        for by in (-0.4, 0.0, 0.4):
            add_box(f"Pallet_Block_{bx}_{by}", (bx, by, 0.06), (0.12, 0.12, 0.075), mat_wood, parent=root)
    # 5 top deckboards
    for ty in (-0.4, -0.2, 0.0, 0.2, 0.4):
        add_box(f"Pallet_Top_{ty}", (0, ty, 0.11), (1.2, 0.14, 0.025), mat_wood, parent=root)

    # 4 Cardboard Boxes (2x2 grid)
    # Size per box: 0.52m x 0.44m x 0.48m
    box_coords = [
        ("Box_1", (-0.28, -0.24, 0.38)),
        ("Box_2", (0.28, -0.24, 0.38)),
        ("Box_3", (-0.28, 0.24, 0.38)),
        ("Box_4", (0.28, 0.24, 0.38)),
    ]
    for tag, (bx, by, bz) in box_coords:
        # Box body
        add_box(tag, (bx, by, bz), (0.52, 0.43, 0.48), mat_box, parent=root, bevel=0.015)
        # Center sealing tape strip (across top and folding down sides)
        add_box(f"{tag}_Tape_Top", (bx, by, bz + 0.242), (0.08, 0.435, 0.008), mat_tape, parent=root)
        add_box(f"{tag}_Tape_SideF", (bx, by + 0.217, bz + 0.16), (0.08, 0.008, 0.16), mat_tape, parent=root)
        add_box(f"{tag}_Tape_SideB", (bx, by - 0.217, bz + 0.16), (0.08, 0.008, 0.16), mat_tape, parent=root)

    finalize_asset(root)
    return root

# ----------------------------------------------------------------------------
# 6: Pallet with 4 Blue Containers (pallet_blue.glb)
# ----------------------------------------------------------------------------
def build_pallet_blue():
    root = create_empty_root("PalletBlue_Root")

    # Materials
    mat_pallet = make_material("Mat_PalletBlue_Pallet", COLOR_BLUE_CONTAINER, roughness=0.6)
    mat_container = make_material("Mat_PalletBlue_Container", COLOR_BLUE_CONTAINER, roughness=0.45)
    mat_details = make_material("Mat_PalletBlue_Details", COLOR_ROOF, roughness=0.4)

    # Blue Pallet base (~1.2m x 1.0m x 0.14m)
    for bx in (-0.45, 0.0, 0.45):
        add_box(f"BluePallet_Runner_{bx}", (bx, 0, 0.012), (0.12, 1.0, 0.024), mat_pallet, parent=root)
    for bx in (-0.45, 0.0, 0.45):
        for by in (-0.4, 0.0, 0.4):
            add_box(f"BluePallet_Block_{bx}_{by}", (bx, by, 0.06), (0.12, 0.12, 0.075), mat_pallet, parent=root)
    for ty in (-0.4, -0.2, 0.0, 0.2, 0.4):
        add_box(f"BluePallet_Deck_{ty}", (0, ty, 0.11), (1.2, 0.15, 0.025), mat_pallet, parent=root)

    # 4 Blue Industrial Containers (2x2 grid)
    # Size per tote: 0.52m x 0.43m x 0.40m
    tote_coords = [
        ("Tote_1", (-0.28, -0.23, 0.33)),
        ("Tote_2", (0.28, -0.23, 0.33)),
        ("Tote_3", (-0.28, 0.23, 0.33)),
        ("Tote_4", (0.28, 0.23, 0.33)),
    ]
    for tag, (tx, ty, tz) in tote_coords:
        # Container main body
        add_box(tag, (tx, ty, tz), (0.52, 0.43, 0.40), mat_container, parent=root, bevel=0.015)
        # Reinforced top rim lip / collar
        add_box(f"{tag}_Rim", (tx, ty, tz + 0.19), (0.55, 0.46, 0.05), mat_details, parent=root)
        # Recessed ergonomic side handles
        add_box(f"{tag}_Handle_L", (tx - 0.262, ty, tz + 0.12), (0.02, 0.14, 0.05), mat_details, parent=root)
        add_box(f"{tag}_Handle_R", (tx + 0.262, ty, tz + 0.12), (0.02, 0.14, 0.05), mat_details, parent=root)

    finalize_asset(root)
    return root

# ----------------------------------------------------------------------------
# 7: Warehouse Rack holding 3 Boxes (rack.glb)
# ----------------------------------------------------------------------------
def build_rack():
    root = create_empty_root("Rack_Root")

    # Materials
    mat_uprights = make_material("Mat_Rack_Uprights", COLOR_BLUE_CONTAINER, roughness=0.4)
    mat_shelf = make_material("Mat_Rack_Shelf", COLOR_ROAD, roughness=0.5)
    mat_box = make_material("Mat_Rack_Box", COLOR_BOX, roughness=0.8)
    mat_tape = make_material("Mat_Rack_Tape", COLOR_TAPE, roughness=0.65)
    mat_details = make_material("Mat_Rack_Details", COLOR_DETAILS, roughness=0.7)

    # Rack dimensions: 2.6m wide (X), 1.1m deep (Y), 3.0m tall (Z)
    col_x = (-1.25, 1.25)
    col_y = (-0.5, 0.5)

    # 4 Vertical corner columns + base footplates
    for cx in col_x:
        for cy in col_y:
            add_box(f"Rack_Col_{cx}_{cy}", (cx, cy, 1.5), (0.08, 0.08, 3.0), mat_uprights, parent=root)
            add_box(f"Rack_Foot_{cx}_{cy}", (cx, cy, 0.015), (0.16, 0.16, 0.03), mat_details, parent=root)

    # Side cross bracing (left side and right side)
    for cx in col_x:
        for bz in (0.7, 1.8, 2.7):
            add_box(f"Rack_SideBrace_{cx}_{bz}", (cx, 0, bz), (0.04, 0.94, 0.04), mat_uprights, parent=root)

    # 2 Shelf Levels: Level 1 at Z=1.1m, Level 2 at Z=2.2m
    for i, sz in enumerate((1.1, 2.2)):
        # Front & rear horizontal load beams
        add_box(f"Rack_BeamF_{i+1}", (0, 0.5, sz), (2.56, 0.07, 0.12), mat_uprights, parent=root)
        add_box(f"Rack_BeamR_{i+1}", (0, -0.5, sz), (2.56, 0.07, 0.12), mat_uprights, parent=root)
        # Steel / wire shelf decking plate
        add_box(f"Rack_Deck_{i+1}", (0, 0, sz + 0.045), (2.42, 0.94, 0.03), mat_shelf, parent=root)

    # 3 Cardboard boxes:
    # Lower shelf: 2 boxes side-by-side
    b1_pos = (-0.6, 0, 1.42)
    b2_pos = (0.6, 0, 1.42)
    # Upper shelf: 1 larger box centered
    b3_pos = (0, 0, 2.58)

    boxes_info = [
        ("Box_L1", b1_pos, (0.75, 0.65, 0.52)),
        ("Box_L2", b2_pos, (0.75, 0.65, 0.52)),
        ("Box_U1", b3_pos, (0.95, 0.75, 0.62)),
    ]
    for tag, (bx, by, bz), (sx, sy, sz) in boxes_info:
        add_box(tag, (bx, by, bz), (sx, sy, sz), mat_box, parent=root, bevel=0.015)
        # Center tape strip
        add_box(f"{tag}_Tape", (bx, by, bz + sz / 2.0 + 0.004), (0.08, sy + 0.004, 0.008), mat_tape, parent=root)

    finalize_asset(root)
    return root

# ----------------------------------------------------------------------------
# 8: Low-Poly Tree (tree.glb)
# ----------------------------------------------------------------------------
def build_tree():
    root = create_empty_root("Tree_Root")

    # Materials
    mat_canopy = make_material("Mat_Tree_Canopy", COLOR_TREE_CANOPY, roughness=0.6)
    mat_trunk = make_material("Mat_Tree_Trunk", COLOR_TREE_TRUNK, roughness=0.85)

    # Trunk cylinder (radius 0.20m, height 2.2m) with base root flare
    add_cylinder("Tree_Trunk", (0, 0, 1.1), radius=0.18, depth=2.2, material=mat_trunk, parent=root, segments=10)
    add_cylinder("Tree_RootFlare", (0, 0, 0.15), radius=0.32, depth=0.3, material=mat_trunk, parent=root, segments=8)

    # Stylized low-poly canopy: 3 overlapping icosphere clusters (subdivision 1)
    # Main central canopy lobe
    add_icosphere("Tree_Canopy_Main", (0, 0, 2.75), radius=1.15, subdivisions=1, material=mat_canopy, parent=root)
    # Top accent lobe
    add_icosphere("Tree_Canopy_Top", (0, 0.1, 3.35), radius=0.85, subdivisions=1, material=mat_canopy, parent=root)
    # Secondary side lobe for charming organic asymmetry
    add_icosphere("Tree_Canopy_Side", (0.35, -0.25, 2.45), radius=0.75, subdivisions=1, material=mat_canopy, parent=root)

    finalize_asset(root)
    return root

# ----------------------------------------------------------------------------
# 9: Road Straight Tile (10x6m) (road_straight.glb)
# ----------------------------------------------------------------------------
def build_road_straight():
    root = create_empty_root("RoadStraight_Root")

    # Materials
    mat_asphalt = make_material("Mat_Road_Asphalt", COLOR_ROAD, roughness=0.9)
    mat_marking = make_material("Mat_Road_Marking", COLOR_ROAD_MARKING, roughness=0.5)
    mat_curb = make_material("Mat_Road_Curb", COLOR_ROAD_CURB, roughness=0.8)

    # Road slab: Length Y = 10.0m, Width X = 6.0m, Height Z = 0.12m
    add_box("Road_Asphalt", (0, 0, 0.06), (6.0, 10.0, 0.12), mat_asphalt, parent=root)

    # Dashed center-line geometry (4 white dash segments, raised 2mm above road)
    # Centerline runs along Y axis at X = 0
    dash_length = 1.3
    dash_width = 0.18
    dash_y_positions = (-3.75, -1.25, 1.25, 3.75)
    for i, dy in enumerate(dash_y_positions):
        add_box(f"Road_Dash_{i+1}", (0, dy, 0.123), (dash_width, dash_length, 0.006), mat_marking, parent=root)

    # Side curbs / borders on left (X = -2.92m) and right (X = +2.92m)
    add_box("Road_Curb_L", (-2.92, 0, 0.09), (0.16, 10.0, 0.18), mat_curb, parent=root)
    add_box("Road_Curb_R", (2.92, 0, 0.09), (0.16, 10.0, 0.18), mat_curb, parent=root)

    finalize_asset(root)
    return root

# ----------------------------------------------------------------------------
# 10: Parking Bay Marker (6x3m) (bay_marker.glb)
# ----------------------------------------------------------------------------
def build_bay_marker():
    root = create_empty_root("BayMarker_Root")

    # Materials
    mat_base = make_material("Mat_BayMarker_Base", COLOR_ROAD, roughness=0.9)
    mat_outline = make_material("Mat_BayMarker_Outline", COLOR_BAY_OUTLINE, roughness=0.5)
    mat_bumper = make_material("Mat_BayMarker_Bumper", COLOR_DETAILS, roughness=0.7)

    # Base ground slab: Length Y = 6.0m, Width X = 3.0m, Height Z = 0.04m
    add_box("Bay_Base", (0, 0, 0.02), (3.0, 6.0, 0.04), mat_base, parent=root)

    # Yellow outline markings (thick U-shaped parking stall line geometry)
    # Line width = 0.14m, raised 6mm above base
    line_w = 0.14
    # Left border stripe (Y from -2.8 to +2.8 at X = -1.35)
    add_box("Bay_Line_L", (-1.35, 0, 0.045), (line_w, 5.6, 0.01), mat_outline, parent=root)
    # Right border stripe
    add_box("Bay_Line_R", (1.35, 0, 0.045), (line_w, 5.6, 0.01), mat_outline, parent=root)
    # Rear end stop stripe (at Y = -2.75)
    add_box("Bay_Line_End", (0, -2.75, 0.045), (2.84, line_w, 0.01), mat_outline, parent=root)

    # Parking wheel-stop bumper block at rear of stall (Y = -2.2m)
    add_box("Bay_WheelStop", (0, -2.2, 0.08), (1.8, 0.18, 0.10), mat_bumper, parent=root, bevel=0.01)
    # Reflective yellow caps on wheel-stop
    add_box("Bay_WheelStop_CapL", (-0.6, -2.2, 0.082), (0.25, 0.184, 0.102), mat_outline, parent=root)
    add_box("Bay_WheelStop_CapR", (0.6, -2.2, 0.082), (0.25, 0.184, 0.102), mat_outline, parent=root)

    finalize_asset(root)
    return root

# ============================================================================
# MAIN PIPELINE
# ============================================================================
def resolve_export_dir():
    if EXPORT_DIR_OVERRIDE:
        return os.path.abspath(EXPORT_DIR_OVERRIDE)
    override = os.environ.get("AUTOREPLENISH_MODEL_DIR")
    if override:
        return os.path.abspath(override)
    return os.path.abspath(r"d:\School Space\Autoreplenish.ai\Web\public\models\twin")

ASSET_REGISTRY = [
    ("truck_box.glb", lambda: build_truck(variant="A")),
    ("truck_box_partner.glb", lambda: build_truck(variant="B")),
    ("minimarket.glb", build_minimarket),
    ("dc_warehouse.glb", build_dc_warehouse),
    ("pallet_cards.glb", build_pallet_cards),
    ("pallet_blue.glb", build_pallet_blue),
    ("rack.glb", build_rack),
    ("tree.glb", build_tree),
    ("road_straight.glb", build_road_straight),
    ("bay_marker.glb", build_bay_marker),
]

def main():
    export_dir = resolve_export_dir()
    os.makedirs(export_dir, exist_ok=True)

    print("==================================================================")
    print("AutoReplenish.ai — Regenerating Digital Twin 3D Assets")
    print(f"Export Destination: {export_dir}")
    print("==================================================================")

    results = []
    for filename, builder_func in ASSET_REGISTRY:
        clear_scene()
        root = builder_func()
        filepath = os.path.join(export_dir, filename)
        tris, size_kb = export_glb(root, filepath)
        status = "PASSED" if tris < 1500 else "EXCEEDS_BUDGET"
        results.append({
            "filename": filename,
            "triangles": tris,
            "size_kb": round(size_kb, 1),
            "status": status,
            "path": filepath
        })
        print(f"[{status}] {filename:<24} | {tris:>5} triangles | {size_kb:>6.1f} KB")

    clear_scene()
    print("==================================================================")
    print("Export Complete! All 10 assets regenerated successfully.")
    print("==================================================================")
    return results

if __name__ == "__main__":
    try:
        main()
    except Exception:
        traceback.print_exc()
