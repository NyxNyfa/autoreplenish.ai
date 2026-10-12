import { useRef, useMemo, useState, type FC } from "react";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import type { Group } from "three";
import type { TruckData } from "@/data/mockPrd";
import { useTwinStore } from "@/store/useTwinStore";
import { SelectionBracket } from "./SelectionBracket";
import { AutoNormalizedModel } from "./AutoNormalizedModel";
import { ProceduralTruck } from "./ProceduralBaselines";
import { buildRoadRoute } from "./SiteConfig";

interface TruckAgentProps {
  truck: TruckData;
}

export const TruckAgent: FC<TruckAgentProps> = ({ truck }) => {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const selectedEntity = useTwinStore((s) => s.selectedEntity);
  const selectEntity = useTwinStore((s) => s.selectEntity);
  const isSelected = selectedEntity?.type === "truck" && selectedEntity.id === truck.id;

  // Load variant A or B
  const modelUrl =
    truck.modelVariant === "B"
      ? "/models/twin/truck_box_partner.glb"
      : "/models/twin/truck_box.glb";

  // Build filleted road route with right-hand traffic offset and corner fillets
  const route = useMemo(() => {
    return buildRoadRoute("DC-01", truck.assignedStoreId);
  }, [truck.assignedStoreId]);

  const curve = route.curvePath;
  const animProgressRef = useRef(truck.progress);

  // Update position & rotation along filleted road polyline
  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (truck.status === "EN_ROUTE") {
      // Smoothly advance animation progress towards store state
      const targetU = Math.min(1.0, Math.max(0.0, truck.progress));
      animProgressRef.current += (targetU - animProgressRef.current) * Math.min(1, delta * 8);

      const u = Math.min(1.0, Math.max(0.0, animProgressRef.current));
      const pt = curve.getPointAt(u);
      groupRef.current.position.set(pt.x, pt.y, pt.z);

      // Orientation = path tangent (lookAt next point along curve)
      const tangent = curve.getTangentAt(u);
      const angle = Math.atan2(tangent.x, tangent.z);
      groupRef.current.rotation.y = angle;
    } else if (truck.status === "UNLOADING" || truck.status === "DOCKING") {
      // Stopped perpendicular at the target dock approach point
      const pt = curve.getPointAt(1.0);
      groupRef.current.position.set(pt.x, pt.y, pt.z);

      // Perpendicular heading directly facing target dock
      const tangent = curve.getTangentAt(1.0);
      groupRef.current.rotation.y = Math.atan2(tangent.x, tangent.z);
    } else {
      // Staged at DC loading apron
      groupRef.current.position.set(truck.position[0], truck.position[1], truck.position[2]);
      groupRef.current.rotation.y = truck.rotation;
    }
  });

  const getStatusColor = () => {
    switch (truck.status) {
      case "EN_ROUTE":
        return "#2563EB";
      case "LOADING":
        return "#F59E0B";
      case "DOCKING":
      case "UNLOADING":
        return "#10B981";
      default:
        return "#64748B";
    }
  };

  return (
    <group
      ref={groupRef}
      onClick={(e) => {
        e.stopPropagation();
        selectEntity("truck", truck.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* 3D Model with Auto-Normalize (frontOffsetRotY=PI normalizes front to local +Z) */}
      <AutoNormalizedModel
        name={`Truck-${truck.id}`}
        url={modelUrl}
        targetSize={6.0}
        primaryAxis="z"
        frontOffsetRotY={Math.PI}
        fallback={<ProceduralTruck variant={truck.modelVariant} />}
      />

      {/* Floating Status Tag over Truck (disabled for React 19 test) */}
      {/* <Html position={[0, 3.4, 0]} center distanceFactor={28} zIndexRange={[40, 0]}>
        <div
          className={`pointer-events-none select-none flex items-center gap-1.5 px-2.5 py-1 rounded-full shadow-md text-[10px] font-bold border transition-all duration-200 ${
            hovered || isSelected
              ? "bg-neutral-900 text-white border-neutral-700 scale-105"
              : "bg-white/90 backdrop-blur-sm text-neutral-800 border-neutral-200/80"
          }`}
        >
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: getStatusColor() }} />
          <span>{truck.id}</span>
          <span className="opacity-60 text-[9px] font-normal">
            {truck.destinationName.replace("Cabang ", "")}
          </span>
        </div>
      </Html> */}

      {/* Selection Box Visual */}
      {isSelected && (
        <SelectionBracket
          size={[2.6, 2.8, 6.2]}
          label={truck.id}
          statusBadge={truck.status}
          badgeColor={getStatusColor()}
        />
      )}
    </group>
  );
};
