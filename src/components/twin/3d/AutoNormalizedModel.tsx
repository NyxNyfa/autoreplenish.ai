import { Component, Suspense, useMemo, type FC, type ReactNode, type ErrorInfo } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, Group, type Mesh } from "three";

interface AutoNormalizedModelProps {
  name: string;
  url: string;
  targetSize: number; // Target primary dimension in units (e.g. DC=30, Minimarket=12, Truck=6)
  primaryAxis?: "x" | "y" | "z" | "maxHorizontal" | "max";
  frontOffsetRotY?: number; // Per-asset Y-rotation offset to normalize front to local +Z
  castShadow?: boolean;
  receiveShadow?: boolean;
  fallback: ReactNode;
  onSceneReady?: (clonedScene: Group) => void;
}

interface ErrorBoundaryProps {
  name: string;
  url: string;
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ModelErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public override state: ErrorBoundaryState = { hasError: false };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public override componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    console.warn(
      `[AutoNormalizedModel] GLB tidak ditemukan (${this.props.url}), memakai fallback prosedural. Error:`,
      error.message
    );
  }

  public override render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

const GLBViewer: FC<Omit<AutoNormalizedModelProps, "fallback">> = ({
  name,
  url,
  targetSize,
  primaryAxis = "maxHorizontal",
  frontOffsetRotY,
  castShadow = true,
  receiveShadow = true,
  onSceneReady,
}) => {
  // useGLTF suspends until loaded or throws if 404
  const gltf = useGLTF(url);

  const { containerGroup } = useMemo(() => {
    // Clone scene
    const clone = gltf.scene.clone(true);

    // Apply per-asset front offset rotation before bounding box calculation
    if (frontOffsetRotY) {
      clone.rotation.y = frontOffsetRotY;
      clone.updateMatrixWorld(true);
    }

    // Compute original bounding box
    const box = new Box3().setFromObject(clone);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);

    // Determine scale factor based on requested target size
    let currentDim = Math.max(size.x, size.z);
    if (primaryAxis === "x") currentDim = size.x;
    else if (primaryAxis === "y") currentDim = size.y;
    else if (primaryAxis === "z") currentDim = size.z;
    else if (primaryAxis === "max") currentDim = Math.max(size.x, size.y, size.z);

    const scaleFactor = currentDim > 0.001 ? targetSize / currentDim : 1.0;

    // Log onLoad with bounding box and scale factor (Phase 1 #5 & Phase 3 #2)
    console.log(
      `[3D Asset Manager] onLoad "${name}" from ${url} | Raw BBox: [w:${size.x.toFixed(2)}, h:${size.y.toFixed(2)}, d:${size.z.toFixed(2)}] | Auto-scale: ${scaleFactor.toFixed(3)}x`
    );

    // Enable shadows on meshes
    clone.traverse((node) => {
      if ((node as Mesh).isMesh) {
        node.castShadow = castShadow;
        node.receiveShadow = receiveShadow;
      }
    });

    // Create a container group that re-centers X/Z to 0 and sits base exactly at y=0
    const parent = new Group();
    parent.name = `Normalized_${name}`;

    // Position inner clone so:
    // center.x becomes 0 -> -center.x
    // base (box.min.y) becomes 0 -> -box.min.y
    // center.z becomes 0 -> -center.z
    clone.position.set(-center.x, -box.min.y, -center.z);

    // Apply uniform scale
    parent.scale.set(scaleFactor, scaleFactor, scaleFactor);
    parent.add(clone);

    onSceneReady?.(clone);

    return { containerGroup: parent };
  }, [gltf.scene, name, url, targetSize, primaryAxis, frontOffsetRotY, castShadow, receiveShadow, onSceneReady]);

  return <primitive object={containerGroup} />;
};

export const AutoNormalizedModel: FC<AutoNormalizedModelProps> = (props) => {
  return (
    <ModelErrorBoundary name={props.name} url={props.url} fallback={props.fallback}>
      <Suspense fallback={props.fallback}>
        <GLBViewer {...props} />
      </Suspense>
    </ModelErrorBoundary>
  );
};
