import { useState, type FC } from "react";
import { useCursor } from "@react-three/drei";
import type { StoreMetadata } from "@/data/mockPrd";
import { useTwinStore } from "@/store/useTwinStore";
import { SelectionBracket } from "./SelectionBracket";
import { AutoNormalizedModel } from "./AutoNormalizedModel";
import {
  ProceduralDCWarehouse,
  ProceduralMinimarket,
  ProceduralPallets,
  ProceduralMapPin,
} from "./ProceduralBaselines";
import { MATERIALS } from "./Materials";
import { SITE_CONFIG } from "./SiteConfig";

interface SiteGroupProps {
  store: StoreMetadata;
}

export const SiteGroup: FC<SiteGroupProps> = ({ store }) => {
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const selectedEntity = useTwinStore((s) => s.selectedEntity);
  const selectEntity = useTwinStore((s) => s.selectEntity);
  const recommendations = useTwinStore((s) => s.recommendations);

  const isSelected = selectedEntity?.type === "site" && selectedEntity.id === store.id;
  const isDC = store.id === "DC-01";
  const siteDef = SITE_CONFIG[store.id] || SITE_CONFIG["DC-01"];

  // Check pending requirements or risk
  const hasRisk = store.inventory.some((i) => i.status === "STOCKOUT_RISK");
  const hasPendingReq = recommendations.some(
    (r) => r.storeId === store.id && r.status === "PENDING_APPROVAL"
  );

  const boundsSize = siteDef.boundsSize;
  const buildingRotY = siteDef.rotY;

  return (
    <group
      position={siteDef.position}
      rotation={[0, buildingRotY, 0]}
      onClick={(e) => {
        e.stopPropagation();
        selectEntity("site", store.id);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
    >
      {/* Main Building: set back so front edge sits exactly at local z=0 (apron outer edge) */}
      <group position={[0, 0, -siteDef.setbackDepth]}>
        {isDC ? (
          <AutoNormalizedModel
            name="DC Warehouse"
            url="/models/twin/dc_warehouse.glb"
            targetSize={30}
            primaryAxis="x"
            frontOffsetRotY={siteDef.frontOffsetRotY}
            fallback={<ProceduralDCWarehouse />}
          />
        ) : (
          <AutoNormalizedModel
            name={`Minimarket-${store.id}`}
            url="/models/twin/minimarket.glb"
            targetSize={12}
            primaryAxis="x"
            frontOffsetRotY={siteDef.frontOffsetRotY}
            fallback={<ProceduralMinimarket />}
          />
        )}
      </group>

      {/* Surrounding Logistics Props in LOCAL space of the site */}
      {isDC ? (
        <group>
          {/* Staged Pallets on Apron Platform */}
          <group position={[11, 0, 1.2]}>
            <AutoNormalizedModel
              name="Pallet Blue Staging"
              url="/models/twin/pallet_blue.glb"
              targetSize={1.6}
              fallback={<ProceduralPallets variant="blue" />}
            />
          </group>
          <group position={[13, 0, 1.2]}>
            <AutoNormalizedModel
              name="Pallet Cardboard Staging"
              url="/models/twin/pallet_cards.glb"
              targetSize={1.4}
              fallback={<ProceduralPallets variant="cards" />}
            />
          </group>
        </group>
      ) : (
        <group>
          {/* Minimarket Delivery Staging Pallets (side staging, away from front road) */}
          <group position={[-6.2, 0, -siteDef.setbackDepth - 1.2]}>
            <AutoNormalizedModel
              name="Minimarket Pallet Cards"
              url="/models/twin/pallet_cards.glb"
              targetSize={1.4}
              fallback={<ProceduralPallets variant="cards" />}
            />
          </group>
          <group position={[-6.2, 0, -siteDef.setbackDepth + 1.2]}>
            <AutoNormalizedModel
              name="Minimarket Pallet Blue"
              url="/models/twin/pallet_blue.glb"
              targetSize={1.6}
              fallback={<ProceduralPallets variant="blue" />}
            />
          </group>
        </group>
      )}

      {/* 3D Primitive Map Pin Mesh floating above building roof */}
      <group position={[0, boundsSize[1] + 0.5, -siteDef.setbackDepth]}>
        <ProceduralMapPin
          color={
            hasRisk
              ? MATERIALS.pinRisk
              : hasPendingReq
              ? MATERIALS.pinPending
              : MATERIALS.pinNormal
          }
        />
      </group>

      {/* Selection Bracket Visual aligned with building bounds */}
      {isSelected && (
        <group position={[0, boundsSize[1] / 2, -siteDef.setbackDepth]}>
          <SelectionBracket
            size={boundsSize}
            label={store.name}
            statusBadge={hasRisk ? "RESTOCK NEEDED" : "NORMAL"}
            badgeColor={hasRisk ? MATERIALS.selectionRisk : MATERIALS.selectionPrimary}
          />
        </group>
      )}
    </group>
  );
};
