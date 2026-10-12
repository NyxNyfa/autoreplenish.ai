import { CanvasTexture, SRGBColorSpace } from "three";

/**
 * Shared Monospace Branding Decal Texture "AUTOREPLENISH.AI"
 * Native WebGL CanvasTexture, no React DOM roots required
 */
export const brandDecalTexture = (() => {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.fillStyle = "#161615";
    ctx.fillRect(0, 0, 512, 96);
    ctx.strokeStyle = "#3D3C39";
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 88);
    // Accent dot
    ctx.fillStyle = "#D97757";
    ctx.beginPath();
    ctx.arc(36, 48, 10, 0, Math.PI * 2);
    ctx.fill();
    // Text
    ctx.fillStyle = "#FAF9F5";
    ctx.font = "bold 34px 'IBM Plex Mono', monospace";
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText("AUTOREPLENISH.AI", 64, 48);
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  return tex;
})();
