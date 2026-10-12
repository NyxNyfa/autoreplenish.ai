import type { Mesh, MeshStandardMaterial, Object3D } from "three";

/**
 * Helper animasi untuk node hasil import GLB.
 * Semua fungsi "null-safe": kalau node/material belum ketemu, tidak melakukan apa pun.
 */

const getStandardMaterial = (
  node: Object3D | null | undefined
): MeshStandardMaterial | null => {
  if (!node) return null;
  const mesh = node as Mesh;
  const material = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
  if (!material || !("emissive" in material)) return null;
  return material as MeshStandardMaterial;
};

/** Set emissiveIntensity material (dipakai untuk pulse emissive cyan/amber). */
export const setEmissiveIntensity = (
  node: Object3D | null | undefined,
  value: number
): void => {
  const material = getStandardMaterial(node);
  if (material) material.emissiveIntensity = Math.max(0, value);
};

/** Set scale seragam (dipakai untuk pulse bola data-flow). */
export const setScale = (node: Object3D | null | undefined, value: number): void => {
  if (node) node.scale.setScalar(value);
};

/** Putar node pada sumbu X (dipakai untuk animasi roda truk). */
export const spinX = (node: Object3D | null | undefined, delta: number): void => {
  if (node) node.rotation.x -= delta;
};

/** Ambil node berdasarkan nama dari hasil import GLB (yang tidak ketemu di-skip). */
export const collectNodes = (root: Object3D, names: readonly string[]): Object3D[] =>
  names
    .map((name) => root.getObjectByName(name))
    .filter((obj): obj is Object3D => obj !== null);
