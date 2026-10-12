import {
  CurvePath,
  LineCurve3,
  QuadraticBezierCurve3,
  Vector3,
  Box3,
} from "three";

/**
 * MASTER SITE PLAN & ROAD NETWORK CONFIGURATION (Single Source of Truth)
 *
 * Coordinates: Top view (X = right, Z = down, Y = up)
 * Convention: Every building's front/dock side MUST face local +Z after loading.
 */

export interface CornerPoint {
  x: number;
  z: number;
}

export const ROAD_LOOP_CORNERS: readonly CornerPoint[] = [
  { x: -30, z: -20 }, // NW
  { x: 30, z: -20 },  // NE
  { x: 30, z: 20 },   // SE
  { x: -30, z: 20 },  // SW
] as const;

export const ROAD_CONFIG = {
  width: 6,
  halfWidth: 3,
  laneOffset: 1.5, // right-hand traffic: +1.5 units to the right relative to travel direction
  cornerFilletRadius: 2.0,
  apronWidth: 5,
  centerlineY: 0.05,
  corners: ROAD_LOOP_CORNERS,
} as const;

export interface SiteDefinition {
  id: string;
  name: string;
  areaType: "DC" | "Perkantoran" | "Kampus" | "Perumahan";
  position: [number, number, number];
  rotY: number;
  dockPoint: [number, number]; // [x, z] on apron in front of dock
  loopEntry: [number, number]; // [x, z] perpendicular projection onto road loop centerline
  loopS: number; // 1D coordinate along the 200-unit loop perimeter
  boundsSize: [number, number, number];
  frontOffsetRotY: number; // Per-asset normalization offset (Math.PI for models facing -Z in raw GLB)
  setbackDepth: number; // Half-depth offset to align front edge exactly at apron outer edge
}

export const SITE_CONFIG: Record<string, SiteDefinition> = {
  "DC-01": {
    id: "DC-01",
    name: "DC Pusat Jakarta",
    areaType: "DC",
    position: [0, 0, -27],
    rotY: 0, // front faces +Z (towards road loop at Z=-20)
    dockPoint: [0, -21.5],
    loopEntry: [0, -20],
    loopS: 30,
    boundsSize: [30, 8.5, 14],
    frontOffsetRotY: Math.PI,
    setbackDepth: 7.0, // center offset so front edge sits at local z=0 (world Z=-27)
  },
  "STR-001": {
    id: "STR-001",
    name: "Cabang Sudirman",
    areaType: "Perkantoran",
    position: [38, 0, 0],
    rotY: -Math.PI / 2, // front faces -X (towards road loop at X=30)
    dockPoint: [33.5, 0],
    loopEntry: [30, 0],
    loopS: 80,
    boundsSize: [12, 4.5, 8],
    frontOffsetRotY: Math.PI,
    setbackDepth: 4.0, // center offset so front edge sits at local z=0 (world X=38)
  },
  "STR-002": {
    id: "STR-002",
    name: "Cabang Kampus",
    areaType: "Kampus",
    position: [0, 0, 27],
    rotY: Math.PI, // front faces -Z (towards road loop at Z=20)
    dockPoint: [0, 21.5],
    loopEntry: [0, 20],
    loopS: 130,
    boundsSize: [12, 4.5, 8],
    frontOffsetRotY: Math.PI,
    setbackDepth: 4.0, // center offset so front edge sits at local z=0 (world Z=27)
  },
  "STR-003": {
    id: "STR-003",
    name: "Cabang Perumahan",
    areaType: "Perumahan",
    position: [-38, 0, 0],
    rotY: Math.PI / 2, // front faces +X (towards road loop at X=-30)
    dockPoint: [-33.5, 0],
    loopEntry: [-30, 0],
    loopS: 180,
    boundsSize: [12, 4.5, 8],
    frontOffsetRotY: Math.PI,
    setbackDepth: 4.0, // center offset so front edge sits at local z=0 (world X=-38)
  },
};

/**
 * Calculate raw waypoints along road loop centerline graph between source and target sites.
 * Graph vertices: 4 loop corners + 4 dock approach points + 4 loop entries.
 * Selects shorter direction along the closed rectangular loop.
 */
export function getRawWaypoints(
  sourceSiteId: string,
  targetSiteId: string
): [number, number][] {
  const src = SITE_CONFIG[sourceSiteId] || SITE_CONFIG["DC-01"];
  const tgt = SITE_CONFIG[targetSiteId] || SITE_CONFIG["STR-001"];

  if (src.id === tgt.id) {
    return [src.dockPoint, src.loopEntry, src.dockPoint];
  }

  const sStart = src.loopS;
  const sEnd = tgt.loopS;
  const L = 200; // total loop perimeter (60 + 40 + 60 + 40)

  const dCW = (sEnd - sStart + L) % L;
  const dCCW = (sStart - sEnd + L) % L;
  const isCW = dCW <= dCCW;

  const corners: { s: number; pt: [number, number] }[] = [
    { s: 60, pt: [30, -20] },   // NE
    { s: 100, pt: [30, 20] },   // SE
    { s: 160, pt: [-30, 20] },  // SW
    { s: 200, pt: [-30, -20] }, // NW
  ];

  const wpts: [number, number][] = [src.dockPoint, src.loopEntry];

  if (isCW) {
    for (const c of corners) {
      const cS = c.s;
      const dist = (cS - sStart + L) % L;
      if (dist > 0 && dist < dCW) {
        if (!wpts.some((p) => Math.abs(p[0] - c.pt[0]) < 0.1 && Math.abs(p[1] - c.pt[1]) < 0.1)) {
          wpts.push(c.pt);
        }
      }
    }
  } else {
    for (const c of [...corners].reverse()) {
      const cS = c.s === 200 ? 0 : c.s;
      const dist = (sStart - cS + L) % L;
      if (dist > 0 && dist < dCCW) {
        if (!wpts.some((p) => Math.abs(p[0] - c.pt[0]) < 0.1 && Math.abs(p[1] - c.pt[1]) < 0.1)) {
          wpts.push(c.pt);
        }
      }
    }
  }

  wpts.push(tgt.loopEntry);
  wpts.push(tgt.dockPoint);
  return wpts;
}

export interface RoadRouteResult {
  rawWaypoints: [number, number][];
  offsetVertices: Vector3[];
  curvePath: CurvePath<Vector3>;
  routePoints: [number, number, number][]; // 3D points sampled along filleted curve for <Line />
  cornerIntervals: { startU: number; endU: number }[];
  isCorner: (u: number) => boolean;
}

/**
 * Builds a filleted route with right-hand traffic offset (+1.5) and quadratic corner fillets (~2.0).
 */
export function buildRoadRoute(
  sourceSiteId: string,
  targetSiteId: string,
  laneOffset = ROAD_CONFIG.laneOffset,
  filletRadius = ROAD_CONFIG.cornerFilletRadius
): RoadRouteResult {
  const rawWpts = getRawWaypoints(sourceSiteId, targetSiteId);
  const N = rawWpts.length;

  // Compute segment directions & right-hand normals
  const segNormals: { dx: number; dz: number; nx: number; nz: number }[] = [];
  for (let i = 0; i < N - 1; i++) {
    const p1 = rawWpts[i];
    const p2 = rawWpts[i + 1];
    const dx = p2[0] - p1[0];
    const dz = p2[1] - p1[1];
    const len = Math.hypot(dx, dz);
    if (len < 0.001) {
      segNormals.push({ dx: 1, dz: 0, nx: 0, nz: 0 });
    } else {
      const dirX = dx / len;
      const dirZ = dz / len;
      // Right normal: (-dirZ, dirX)
      segNormals.push({ dx: dirX, dz: dirZ, nx: -dirZ, nz: dirX });
    }
  }

  // Calculate vertices of offset path
  const offsetVertices: Vector3[] = [];
  // Source dock endpoint remains exact dock approach point
  offsetVertices.push(new Vector3(rawWpts[0][0], 0, rawWpts[0][1]));

  for (let i = 1; i < N - 1; i++) {
    const segIn = segNormals[i - 1];
    const segOut = segNormals[i];

    const p1x = rawWpts[i][0] + segIn.nx * laneOffset;
    const p1z = rawWpts[i][1] + segIn.nz * laneOffset;
    const p2x = rawWpts[i][0] + segOut.nx * laneOffset;
    const p2z = rawWpts[i][1] + segOut.nz * laneOffset;

    const det = -segIn.dx * segOut.dz + segIn.dz * segOut.dx;
    if (Math.abs(det) > 0.001) {
      const rx = p2x - p1x;
      const rz = p2z - p1z;
      const t = (-segOut.dz * rx + segOut.dx * rz) / det;
      const ix = p1x + t * segIn.dx;
      const iz = p1z + t * segIn.dz;
      offsetVertices.push(new Vector3(ix, 0, iz));
    } else {
      offsetVertices.push(new Vector3(p1x, 0, p1z));
    }
  }

  // Target dock endpoint remains exact dock approach point
  offsetVertices.push(new Vector3(rawWpts[N - 1][0], 0, rawWpts[N - 1][1]));

  // Build CurvePath with LineCurve3 and QuadraticBezierCurve3 fillet curves
  const curvePath = new CurvePath<Vector3>();
  let currentPos = offsetVertices[0];

  for (let i = 1; i < offsetVertices.length - 1; i++) {
    const pPrev = offsetVertices[i - 1];
    const pCur = offsetVertices[i];
    const pNext = offsetVertices[i + 1];

    const vIn = new Vector3().subVectors(pCur, pPrev).normalize();
    const vOut = new Vector3().subVectors(pNext, pCur).normalize();

    const dIn = pPrev.distanceTo(pCur);
    const dOut = pCur.distanceTo(pNext);

    const r = Math.min(filletRadius, dIn * 0.45, dOut * 0.45);

    const cStart = new Vector3().copy(pCur).sub(vIn.clone().multiplyScalar(r));
    const cEnd = new Vector3().copy(pCur).add(vOut.clone().multiplyScalar(r));

    if (currentPos.distanceTo(cStart) > 0.01) {
      curvePath.add(new LineCurve3(currentPos, cStart));
    }
    curvePath.add(new QuadraticBezierCurve3(cStart, pCur, cEnd));
    currentPos = cEnd;
  }

  const pLast = offsetVertices[offsetVertices.length - 1];
  if (currentPos.distanceTo(pLast) > 0.01) {
    curvePath.add(new LineCurve3(currentPos, pLast));
  }

  // Sample points along curve for Line renderer
  const sampled = curvePath.getPoints(60);
  const routePoints: [number, number, number][] = sampled.map((p) => [p.x, 0.12, p.z]);

  // Identify corner intervals in normalized [0, 1] parameter space
  const totalLength = curvePath.getLength();
  const cornerIntervals: { startU: number; endU: number }[] = [];

  if (totalLength > 0.001) {
    let accumulatedLength = 0;
    for (const curve of curvePath.curves) {
      const cLen = curve.getLength();
      if (curve instanceof QuadraticBezierCurve3) {
        cornerIntervals.push({
          startU: Math.max(0, (accumulatedLength - 0.5) / totalLength),
          endU: Math.min(1, (accumulatedLength + cLen + 0.5) / totalLength),
        });
      }
      accumulatedLength += cLen;
    }
  }

  const isCorner = (u: number): boolean => {
    return cornerIntervals.some((int) => u >= int.startU && u <= int.endU);
  };

  return {
    rawWaypoints: rawWpts,
    offsetVertices,
    curvePath,
    routePoints,
    cornerIntervals,
    isCorner,
  };
}

/**
 * DEV Validation: Check Box3 intersections between building footprints and road segments.
 */
export function validateSceneCollisions(): boolean {
  const roadBoxes = [
    { name: "North Road", box: new Box3(new Vector3(-33, -1, -23), new Vector3(33, 1, -17)) },
    { name: "South Road", box: new Box3(new Vector3(-33, -1, 17), new Vector3(33, 1, 23)) },
    { name: "East Road", box: new Box3(new Vector3(27, -1, -20), new Vector3(33, 1, 20)) },
    { name: "West Road", box: new Box3(new Vector3(-33, -1, -20), new Vector3(-27, 1, 20)) },
  ];

  const buildingBoxes = Object.values(SITE_CONFIG).map((site) => {
    const isDC = site.id === "DC-01";
    let box: Box3;
    if (isDC) {
      // DC-01: pos [0, 0, -27], rotY=0, front sits at Z=-27, body extends back to Z=-41
      box = new Box3(new Vector3(-15, 0, -41), new Vector3(15, 8.5, -27));
    } else if (site.id === "STR-001") {
      // STR-001: pos [38, 0, 0], rotY=-PI/2, front sits at X=38, body extends back to X=46
      box = new Box3(new Vector3(38, 0, -6), new Vector3(46, 4.5, 6));
    } else if (site.id === "STR-002") {
      // STR-002: pos [0, 0, 27], rotY=PI, front sits at Z=27, body extends back to Z=35
      box = new Box3(new Vector3(-6, 0, 27), new Vector3(6, 4.5, 35));
    } else {
      // STR-003: pos [-38, 0, 0], rotY=PI/2, front sits at X=-38, body extends back to X=-46
      box = new Box3(new Vector3(-46, 0, -6), new Vector3(-38, 4.5, 6));
    }
    return { name: `${site.id} (${site.name})`, box };
  });

  let hasOverlap = false;
  buildingBoxes.forEach((b) => {
    roadBoxes.forEach((r) => {
      if (b.box.intersectsBox(r.box)) {
        console.warn(`OVERLAP: ${b.name} intersects ${r.name}`);
        hasOverlap = true;
      }
    });
  });

  if (!hasOverlap) {
    console.log("✅ [Collision Guard] Zero overlaps between building footprints and road segments.");
  }

  return !hasOverlap;
}
