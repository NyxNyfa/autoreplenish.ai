import {
  Curve,
  Vector3,
  CatmullRomCurve3,
  BufferGeometry,
  Float32BufferAttribute,
} from "three";
import { ROAD } from "@/config/siteConfig";

/**
 * Analytic Closed 3D Curve for Smooth Continuous Rounded Rectangle (Radius = 12)
 * ==============================================================================
 * Geometry:
 * - 4 straight segments:
 *   1. North: (-18, -20) -> (18, -20), length 36
 *   2. East:  (30, -8)   -> (30, 8),   length 16
 *   3. South: (18, 20)   -> (-18, 20), length 36
 *   4. West:  (-30, 8)   -> (-30, -8), length 16
 * - 4 arc corners (radius 12 units):
 *   NE: center (18, -8),  arc -PI/2 -> 0,   length 12 * PI / 2 = 6*PI
 *   SE: center (18, 8),   arc 0 -> PI/2,    length 6*PI
 *   SW: center (-18, 8),  arc PI/2 -> PI,   length 6*PI
 *   NW: center (-18, -8), arc PI -> 3PI/2,  length 6*PI
 *
 * Total perimeter L = 36 + 6*PI + 16 + 6*PI + 36 + 6*PI + 16 + 6*PI = 104 + 24*PI (~179.398 m)
 */
export class RoundedRoadCurve extends Curve<Vector3> {
  public readonly L1 = 36.0; // North straight
  public readonly L2: number; // NE arc
  public readonly L3 = 16.0; // East straight
  public readonly L4: number; // SE arc
  public readonly L5 = 36.0; // South straight
  public readonly L6: number; // SW arc
  public readonly L7 = 16.0; // West straight
  public readonly L8: number; // NW arc
  public readonly totalLength: number;
  public readonly cornerRadius: number;
  public readonly y: number;

  constructor(cornerRadius = ROAD.cornerRadius, y = 0.04) {
    super();
    this.cornerRadius = cornerRadius;
    this.y = y;
    const arcLen = cornerRadius * (Math.PI / 2);
    this.L2 = arcLen;
    this.L4 = arcLen;
    this.L6 = arcLen;
    this.L8 = arcLen;
    this.totalLength = 36 + 16 + 36 + 16 + 4 * arcLen;
  }

  override getPoint(u: number, target: Vector3 = new Vector3()): Vector3 {
    let normU = u % 1.0;
    if (normU < 0) normU += 1.0;

    const s = normU * this.totalLength;
    const R = this.cornerRadius;

    // Segment 1: North straight (s: 0 -> L1)
    if (s <= this.L1) {
      const frac = s / this.L1;
      return target.set(-18 + frac * 36, this.y, -20);
    }
    // Segment 2: NE Arc (s: L1 -> L1 + L2)
    let acc = this.L1;
    if (s <= acc + this.L2) {
      const theta = -Math.PI / 2 + ((s - acc) / this.L2) * (Math.PI / 2);
      return target.set(18 + R * Math.cos(theta), this.y, -8 + R * Math.sin(theta));
    }
    // Segment 3: East straight
    acc += this.L2;
    if (s <= acc + this.L3) {
      const frac = (s - acc) / this.L3;
      return target.set(30, this.y, -8 + frac * 16);
    }
    // Segment 4: SE Arc
    acc += this.L3;
    if (s <= acc + this.L4) {
      const theta = 0 + ((s - acc) / this.L4) * (Math.PI / 2);
      return target.set(18 + R * Math.cos(theta), this.y, 8 + R * Math.sin(theta));
    }
    // Segment 5: South straight
    acc += this.L4;
    if (s <= acc + this.L5) {
      const frac = (s - acc) / this.L5;
      return target.set(18 - frac * 36, this.y, 20);
    }
    // Segment 6: SW Arc
    acc += this.L5;
    if (s <= acc + this.L6) {
      const theta = Math.PI / 2 + ((s - acc) / this.L6) * (Math.PI / 2);
      return target.set(-18 + R * Math.cos(theta), this.y, 8 + R * Math.sin(theta));
    }
    // Segment 7: West straight
    acc += this.L6;
    if (s <= acc + this.L7) {
      const frac = (s - acc) / this.L7;
      return target.set(-30, this.y, 8 - frac * 16);
    }
    // Segment 8: NW Arc
    acc += this.L7;
    const theta = Math.PI + Math.min(1.0, (s - acc) / this.L8) * (Math.PI / 2);
    return target.set(-18 + R * Math.cos(theta), this.y, -8 + R * Math.sin(theta));
  }

  override getTangent(u: number, target: Vector3 = new Vector3()): Vector3 {
    let normU = u % 1.0;
    if (normU < 0) normU += 1.0;

    const s = normU * this.totalLength;

    if (s <= this.L1) {
      return target.set(1, 0, 0); // Eastward along North road
    }
    let acc = this.L1;
    if (s <= acc + this.L2) {
      const theta = -Math.PI / 2 + ((s - acc) / this.L2) * (Math.PI / 2);
      return target.set(-Math.sin(theta), 0, Math.cos(theta)).normalize();
    }
    acc += this.L2;
    if (s <= acc + this.L3) {
      return target.set(0, 0, 1); // Southward along East road
    }
    acc += this.L3;
    if (s <= acc + this.L4) {
      const theta = 0 + ((s - acc) / this.L4) * (Math.PI / 2);
      return target.set(-Math.sin(theta), 0, Math.cos(theta)).normalize();
    }
    acc += this.L4;
    if (s <= acc + this.L5) {
      return target.set(-1, 0, 0); // Westward along South road
    }
    acc += this.L5;
    if (s <= acc + this.L6) {
      const theta = Math.PI / 2 + ((s - acc) / this.L6) * (Math.PI / 2);
      return target.set(-Math.sin(theta), 0, Math.cos(theta)).normalize();
    }
    acc += this.L6;
    if (s <= acc + this.L7) {
      return target.set(0, 0, -1); // Northward along West road
    }
    acc += this.L7;
    const theta = Math.PI + Math.min(1.0, (s - acc) / this.L8) * (Math.PI / 2);
    return target.set(-Math.sin(theta), 0, Math.cos(theta)).normalize();
  }

  /**
   * Returns whether a given normalized position u is inside one of the 4 rounded corners,
   * used for natural curve deceleration.
   */
  public isCornerSegment(u: number): boolean {
    let normU = u % 1.0;
    if (normU < 0) normU += 1.0;
    const s = normU * this.totalLength;

    const seg2 = s > this.L1 && s <= this.L1 + this.L2;
    const acc3 = this.L1 + this.L2 + this.L3;
    const seg4 = s > acc3 && s <= acc3 + this.L4;
    const acc5 = acc3 + this.L4 + this.L5;
    const seg6 = s > acc5 && s <= acc5 + this.L6;
    const acc7 = acc5 + this.L6 + this.L7;
    const seg8 = s > acc7 && s <= this.totalLength;

    return seg2 || seg4 || seg6 || seg8;
  }
}

// Singleton curve instance
export const ROAD_CENTERLINE_CURVE = new RoundedRoadCurve();

/**
 * Computes the nearest point on the road curve from a given 3D position
 */
export function getNearestPointOnRoad(pos: [number, number, number] | Vector3): {
  point: Vector3;
  distance: number;
  u: number;
} {
  const px = Array.isArray(pos) ? pos[0] : pos.x;
  const pz = Array.isArray(pos) ? pos[2] : pos.z;

  let bestU = 0;
  let bestDistSq = Infinity;
  const bestPoint = new Vector3();
  const tempPoint = new Vector3();

  const SAMPLES = 360;
  for (let i = 0; i < SAMPLES; i++) {
    const u = i / SAMPLES;
    ROAD_CENTERLINE_CURVE.getPoint(u, tempPoint);
    const dx = tempPoint.x - px;
    const dz = tempPoint.z - pz;
    const distSq = dx * dx + dz * dz;
    if (distSq < bestDistSq) {
      bestDistSq = distSq;
      bestU = u;
      bestPoint.copy(tempPoint);
    }
  }

  return {
    point: bestPoint,
    distance: Math.sqrt(bestDistSq),
    u: bestU,
  };
}

/**
 * AUTO-ORIENT LOGIC
 * Chooses rotY from {0, +/-PI/2, PI} maximizing dot(localForward, normalize(P - pos)).
 */
export function computeBuildingOrientation(
  buildingPos: [number, number, number],
  siteId: string
): { rotY: number; maxDot: number } {
  const { point } = getNearestPointOnRoad(buildingPos);
  const dir = new Vector3(point.x - buildingPos[0], 0, point.z - buildingPos[2]).normalize();

  const candidates = [
    { rotY: 0, forward: new Vector3(0, 0, 1) },
    { rotY: -Math.PI / 2, forward: new Vector3(-1, 0, 0) },
    { rotY: Math.PI / 2, forward: new Vector3(1, 0, 0) },
    { rotY: Math.PI, forward: new Vector3(0, 0, -1) },
  ];

  let bestRot = 0;
  let maxDot = -Infinity;

  for (const c of candidates) {
    const dot = c.forward.dot(dir);
    if (dot > maxDot) {
      maxDot = dot;
      bestRot = c.rotY;
    }
  }

  if (import.meta.env?.DEV && maxDot < 0.9) {
    console.warn(
      `[SiteOrientation] Site ${siteId} orientation dot product ${maxDot.toFixed(2)} is < 0.9!`
    );
  }

    return { rotY: bestRot, maxDot };
}

/**
 * Creates a clean, flat ribbon quad-strip geometry along any closed 2D/3D curve
 * Completely eliminates Shape triangulation artifacts, jagged vertices, and criss-cross lines.
 */
export function createRoadRibbonGeometry(
  curve: Curve<Vector3>,
  innerOffset: number,
  outerOffset: number,
  y: number,
  segments = 180
): BufferGeometry {
  const positions: number[] = [];
  const normals: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  const tempP = new Vector3();
  const tempT = new Vector3();

  for (let i = 0; i < segments; i++) {
    const u = i / segments;
    curve.getPoint(u, tempP);
    curve.getTangent(u, tempT);
    tempT.normalize();

    // 2D Normal perpendicular to tangent in XZ plane
    const nx = -tempT.z;
    const nz = tempT.x;

    // Left vertex
    positions.push(tempP.x + nx * innerOffset, y, tempP.z + nz * innerOffset);
    normals.push(0, 1, 0);
    uvs.push(0, u);

    // Right vertex
    positions.push(tempP.x + nx * outerOffset, y, tempP.z + nz * outerOffset);
    normals.push(0, 1, 0);
    uvs.push(1, u);

    // Quad indices
    const nextI = (i + 1) % segments;
    const v0 = i * 2;
    const v1 = i * 2 + 1;
    const v2 = nextI * 2;
    const v3 = nextI * 2 + 1;

    indices.push(v0, v1, v2);
    indices.push(v2, v1, v3);
  }

  const geom = new BufferGeometry();
  geom.setAttribute("position", new Float32BufferAttribute(positions, 3));
  geom.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  geom.setAttribute("uv", new Float32BufferAttribute(uvs, 2));
  geom.setIndex(indices);
  return geom;
}

/**
 * Dedicated Warehouse-to-Store Splines:
 * Spawn at DC Warehouse dock -> drive along road loop -> park at target Supermarket bay
 */
export const WAREHOUSE_TO_STORE_SPLINES = {
  // Truck 1: DC Dock 1 [-6, 0, -24] -> Cabang Sudirman [33.0, 0, 0]
  "TRK-2051": new CatmullRomCurve3(
    [
      new Vector3(-6, 0, -24),
      new Vector3(-6, 0, -20),
      new Vector3(12, 0, -20),
      new Vector3(26.5, 0, -16),
      new Vector3(30, 0, -8),
      new Vector3(30, 0, -2),
      new Vector3(31.5, 0, 0),
      new Vector3(33.0, 0, 0),
    ],
    false,
    "catmullrom",
    0.15
  ),

  // Truck 2: DC Dock 2 [0, 0, -24] -> Cabang Kampus [0, 0, 23.0]
  "TRK-2205": new CatmullRomCurve3(
    [
      new Vector3(0, 0, -24),
      new Vector3(0, 0, -20),
      new Vector3(14, 0, -20),
      new Vector3(26.5, 0, -15),
      new Vector3(30, 0, -6),
      new Vector3(30, 0, 6),
      new Vector3(26.5, 0, 15),
      new Vector3(14, 0, 20),
      new Vector3(3, 0, 20.5),
      new Vector3(0, 0, 21.8),
      new Vector3(0, 0, 23.0),
    ],
    false,
    "catmullrom",
    0.15
  ),

  // Truck 3: DC Dock 3 [6, 0, -24] -> Cabang Perumahan [-33.0, 0, 0]
  "TRK-2307": new CatmullRomCurve3(
    [
      new Vector3(6, 0, -24),
      new Vector3(6, 0, -20),
      new Vector3(-12, 0, -20),
      new Vector3(-26.5, 0, -16),
      new Vector3(-30, 0, -8),
      new Vector3(-30, 0, -2),
      new Vector3(-31.5, 0, 0),
      new Vector3(-33.0, 0, 0),
    ],
    false,
    "catmullrom",
    0.15
  ),
};
